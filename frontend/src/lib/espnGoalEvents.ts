import { normalizeTeamKey } from './teamKey';
import { normalizeEspnTeam } from './espnSoccerParse';

function matchPairKey(pool: string, teamA: string, teamB: string): string {
  const pair = [normalizeTeamKey(teamA), normalizeTeamKey(teamB)].sort();
  return [pool, pair[0], pair[1]].join('\0');
}

const ESPN_SUMMARY =
  'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary';

const SUMMARY_CACHE_TTL_MS = 1_000;

type EspnKeyEvent = {
  id?: string;
  type?: { type?: string; text?: string };
  shortText?: string;
  text?: string;
  scoringPlay?: boolean;
  ownGoal?: boolean;
  team?: { id?: string; displayName?: string };
  participants?: Array<{ athlete?: { displayName?: string } }>;
  athletesInvolved?: Array<{ displayName?: string }>;
  clock?: { value?: number; displayValue?: string };
  wallclock?: string;
};

export type EspnGoalEvent = {
  id: string;
  espnEventId: string;
  pool: string;
  teamHome: string;
  teamAway: string;
  scoringTeam: string;
  scorer: string;
  isOwnGoal: boolean;
  isPenalty: boolean;
  minute: number | null;
  minuteLabel: string;
  scoredAt: string;
  scoreHome: number;
  scoreAway: number;
};

export type EspnCardEvent = {
  id: string;
  espnEventId: string;
  kind: 'yellow' | 'red';
  team: string;
  player: string;
  minute: number | null;
  minuteLabel: string;
  at: string;
};

export type EspnShootoutKick = {
  id: string;
  player: string;
  team: string;
  side: 'home' | 'away';
  shotNumber: number;
  outcome: 'scored' | 'missed';
};

export type EspnMatchFeed = {
  goals: EspnGoalEvent[];
  cards: EspnCardEvent[];
  teamStats: LiveMatchTeamStats | null;
  shootoutKicks: EspnShootoutKick[];
};

export type TeamLiveStats = {
  possessionPct: number | null;
  shots: number | null;
  shotsOnTarget: number | null;
  corners: number | null;
};

export type LiveMatchTeamStats = {
  home: TeamLiveStats;
  away: TeamLiveStats;
};

type EspnStatRow = { name?: string; displayValue?: string };

type EspnBoxscoreTeam = {
  homeAway?: string;
  team?: { displayName?: string };
  statistics?: EspnStatRow[];
};

const summaryCache = new Map<string, { at: number; feed: EspnMatchFeed }>();

function statNum(stats: EspnStatRow[], name: string): number | null {
  const row = stats.find((s) => s.name === name);
  if (!row?.displayValue) return null;
  const n = Number.parseFloat(String(row.displayValue).replace('%', '').trim());
  return Number.isFinite(n) ? n : null;
}

function rowTeamStats(stats: EspnStatRow[]): TeamLiveStats {
  return {
    possessionPct: statNum(stats, 'possessionPct'),
    shots: statNum(stats, 'totalShots'),
    shotsOnTarget: statNum(stats, 'shotsOnTarget'),
    corners: statNum(stats, 'wonCorners'),
  };
}

function hasAnyTeamStats(stats: TeamLiveStats): boolean {
  return (
    stats.possessionPct != null ||
    stats.shots != null ||
    stats.shotsOnTarget != null ||
    stats.corners != null
  );
}

export function parseMatchTeamStats(
  teams: EspnBoxscoreTeam[] | undefined,
  teamHome: string,
  teamAway: string,
): LiveMatchTeamStats | null {
  if (!teams?.length) return null;

  const homeKey = normalizeTeamKey(teamHome);
  const awayKey = normalizeTeamKey(teamAway);
  let home: TeamLiveStats | null = null;
  let away: TeamLiveStats | null = null;

  for (const row of teams) {
    const parsed = rowTeamStats(row.statistics ?? []);
    if (!hasAnyTeamStats(parsed)) continue;

    const nameKey = normalizeTeamKey(normalizeEspnTeam(row.team?.displayName ?? ''));
    if (row.homeAway === 'home' || nameKey === homeKey) home = parsed;
    else if (row.homeAway === 'away' || nameKey === awayKey) away = parsed;
  }

  if (!home || !away) return null;
  return { home, away };
}

function parseMinuteFromLabel(label: string): number | null {
  const m = label.match(/^(\d{1,3})/);
  if (!m) return null;
  const n = Number.parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

function parseScoreAtGoal(
  text: string,
  teamHome: string,
  _teamAway: string,
  fallbackHome: number,
  fallbackAway: number,
): { scoreHome: number; scoreAway: number } {
  const cleaned = text.trim();

  // ESPN: "Goal! Germany 1, Curaçao 0. Felix Nmecha…"
  const espn = cleaned.match(/Goal!\s*(.+?)\s+(\d+),\s*(.+?)\s+(\d+)/i);
  if (espn) {
    const mapped = mapParsedScoreTeams(espn[1], espn[2], espn[3], espn[4], teamHome);
    if (mapped) return mapped;
  }

  // Generic: "Germany 1, Curaçao 0" or "Germany 1 - Curaçao 0"
  const generic = cleaned.match(/(.+?)\s+(\d+)\s*[,–-]\s*(.+?)\s+(\d+)/i);
  if (generic) {
    const mapped = mapParsedScoreTeams(generic[1], generic[2], generic[3], generic[4], teamHome);
    if (mapped) return mapped;
  }

  return { scoreHome: fallbackHome, scoreAway: fallbackAway };
}

function mapParsedScoreTeams(
  teamA: string,
  scoreAStr: string,
  teamB: string,
  scoreBStr: string,
  teamHome: string,
): { scoreHome: number; scoreAway: number } | null {
  const scoreA = Number.parseInt(scoreAStr, 10);
  const scoreB = Number.parseInt(scoreBStr, 10);
  if (!Number.isFinite(scoreA) || !Number.isFinite(scoreB)) return null;

  const homeKey = normalizeTeamKey(teamHome);
  const aKey = normalizeTeamKey(normalizeEspnTeam(teamA.trim()));
  const bKey = normalizeTeamKey(normalizeEspnTeam(teamB.trim()));
  if (aKey === homeKey) return { scoreHome: scoreA, scoreAway: scoreB };
  if (bKey === homeKey) return { scoreHome: scoreB, scoreAway: scoreA };
  return null;
}

/** Score after each goal — derived from chronological order. */
function applyRunningScores(goals: EspnGoalEvent[]): EspnGoalEvent[] {
  if (goals.length === 0) return goals;

  const homeKey = normalizeTeamKey(goals[0].teamHome);
  const awayKey = normalizeTeamKey(goals[0].teamAway);

  const sorted = [...goals].sort((a, b) => {
    const am = a.minute ?? 0;
    const bm = b.minute ?? 0;
    if (am !== bm) return am - bm;
    return a.scoredAt.localeCompare(b.scoredAt);
  });

  let scoreHome = 0;
  let scoreAway = 0;
  const scoreById = new Map<string, { scoreHome: number; scoreAway: number }>();

  for (const g of sorted) {
    const scoringKey = normalizeTeamKey(g.scoringTeam);
    // ESPN `team` is the side credited on the scoreboard — including own goals
    // (e.g. "Own Goal by … Egypt. Belgium 1, Egypt 1" → team is Belgium).
    if (scoringKey === homeKey) scoreHome += 1;
    else if (scoringKey === awayKey) scoreAway += 1;
    scoreById.set(g.id, { scoreHome, scoreAway });
  }

  return goals.map((g) => {
    const running = scoreById.get(g.id);
    return running ? { ...g, scoreHome: running.scoreHome, scoreAway: running.scoreAway } : g;
  });
}

function parseEspnGoal(
  ev: EspnKeyEvent,
  ctx: {
    espnEventId: string;
    pool: string;
    teamHome: string;
    teamAway: string;
    scoreHome: number;
    scoreAway: number;
  },
  teamById?: Map<string, string>,
): EspnGoalEvent | null {
  if (!ev.scoringPlay) return null;

  let scoringTeam = '';
  if (ev.team?.displayName) {
    scoringTeam = normalizeEspnTeam(ev.team.displayName);
  } else if (ev.team?.id && teamById) {
    scoringTeam = teamById.get(String(ev.team.id)) ?? '';
  }
  if (!scoringTeam) return null;

  const isOwnGoal = ev.type?.type === 'own-goal' || ev.ownGoal === true;
  const isPenalty =
    ev.type?.type === 'penalty-goal' ||
    /penalty/i.test(ev.type?.text ?? '') ||
    /penalty/i.test(ev.shortText ?? '');
  const participant =
    ev.participants?.[0]?.athlete?.displayName?.trim() ??
    ev.athletesInvolved?.[0]?.displayName?.trim() ??
    '';
  const scorer = isOwnGoal
    ? participant
      ? `Own goal (${participant})`
      : 'Own goal'
    : participant || ev.shortText?.replace(/\s*Goal$/i, '').trim() || 'Goal';

  const minuteLabel = ev.clock?.displayValue?.trim() || '';
  const minute = minuteLabel ? parseMinuteFromLabel(minuteLabel) : null;
  const scores = parseScoreAtGoal(
    ev.text ?? ev.shortText ?? '',
    ctx.teamHome,
    ctx.teamAway,
    ctx.scoreHome,
    ctx.scoreAway,
  );

  const id =
    ev.id ??
    `${ctx.espnEventId}:${ev.clock?.value ?? minuteLabel}:${scoringTeam}:${participant || 'goal'}`;

  return {
    id,
    espnEventId: ctx.espnEventId,
    pool: ctx.pool,
    teamHome: ctx.teamHome,
    teamAway: ctx.teamAway,
    scoringTeam,
    scorer,
    isOwnGoal,
    isPenalty,
    minute,
    minuteLabel: minuteLabel || (minute != null ? `${minute}'` : ''),
    scoredAt: ev.wallclock ?? new Date().toISOString(),
    scoreHome: scores.scoreHome,
    scoreAway: scores.scoreAway,
  };
}

function parseEspnCard(
  ev: EspnKeyEvent,
  ctx: { espnEventId: string },
  teamById?: Map<string, string>,
): EspnCardEvent | null {
  const rawType = (ev.type?.type ?? '').toLowerCase();
  const kind: EspnCardEvent['kind'] | null =
    rawType === 'red-card' || rawType === 'redcard' ? 'red' : rawType === 'yellow-card' || rawType === 'yellowcard' ? 'yellow' : null;
  if (!kind) return null;

  let team = '';
  if (ev.team?.displayName) team = normalizeEspnTeam(ev.team.displayName);
  else if (ev.team?.id && teamById) team = teamById.get(String(ev.team.id)) ?? '';
  if (!team) return null;

  const player =
    ev.participants?.[0]?.athlete?.displayName?.trim() ??
    ev.athletesInvolved?.[0]?.displayName?.trim() ??
    ev.shortText?.trim() ??
    'Booking';

  const minuteLabel = ev.clock?.displayValue?.trim() || '';
  const minute = minuteLabel ? parseMinuteFromLabel(minuteLabel) : null;
  const id =
    ev.id ?? `${ctx.espnEventId}:card:${kind}:${minuteLabel}:${player}`;

  return {
    id,
    espnEventId: ctx.espnEventId,
    kind,
    team,
    player,
    minute,
    minuteLabel: minuteLabel || (minute != null ? `${minute}'` : ''),
    at: ev.wallclock ?? new Date().toISOString(),
  };
}

type EspnShootoutTeam = {
  team?: string;
  shots?: Array<{
    id?: string;
    player?: string;
    shotNumber?: number;
    didScore?: boolean;
  }>;
};

/** Alternating home/away kicks from ESPN summary `shootout` block. */
export function parseEspnShootout(
  shootout: EspnShootoutTeam[] | undefined,
  teamHome: string,
  teamAway: string,
): EspnShootoutKick[] {
  if (!shootout?.length) return [];

  const homeKey = normalizeTeamKey(teamHome);
  const awayKey = normalizeTeamKey(teamAway);
  const kicksBySide: { home: EspnShootoutKick[]; away: EspnShootoutKick[] } = { home: [], away: [] };

  for (let rowIndex = 0; rowIndex < shootout.length; rowIndex += 1) {
    const row = shootout[rowIndex];
    const team = normalizeEspnTeam(row.team ?? '');
    const sideKey = normalizeTeamKey(team);
    let side: 'home' | 'away' | null =
      sideKey === homeKey ? 'home' : sideKey === awayKey ? 'away' : null;
    if (!side) side = rowIndex === 0 ? 'home' : 'away';
    const bucket = side === 'home' ? kicksBySide.home : kicksBySide.away;

    for (const shot of row.shots ?? []) {
      const shotNumber =
        typeof shot.shotNumber === 'number' && Number.isFinite(shot.shotNumber) ? shot.shotNumber : 0;
      if (shotNumber <= 0) continue;
      bucket.push({
        id: shot.id ?? `${team}:${shotNumber}`,
        player: shot.player?.trim() || 'Unknown player',
        team: team || (side === 'home' ? teamHome : teamAway),
        side,
        shotNumber,
        outcome: shot.didScore ? 'scored' : 'missed',
      });
    }
  }

  kicksBySide.home.sort((a, b) => a.shotNumber - b.shotNumber);
  kicksBySide.away.sort((a, b) => a.shotNumber - b.shotNumber);

  const maxRound = Math.max(
    kicksBySide.home[kicksBySide.home.length - 1]?.shotNumber ?? 0,
    kicksBySide.away[kicksBySide.away.length - 1]?.shotNumber ?? 0,
  );

  const merged: EspnShootoutKick[] = [];
  for (let round = 1; round <= maxRound; round += 1) {
    const homeKick = kicksBySide.home.find((k) => k.shotNumber === round);
    const awayKick = kicksBySide.away.find((k) => k.shotNumber === round);
    if (homeKick) merged.push(homeKick);
    if (awayKick) merged.push(awayKick);
  }
  return merged;
}

function sortByMinute<T extends { minute: number | null; at?: string; scoredAt?: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => {
    const am = a.minute ?? 0;
    const bm = b.minute ?? 0;
    if (am !== bm) return am - bm;
    const atA = ('scoredAt' in a ? a.scoredAt : a.at) ?? '';
    const atB = ('scoredAt' in b ? b.scoredAt : b.at) ?? '';
    return atA.localeCompare(atB);
  });
}

/** Goals + bookings from ESPN summary (shared cache). */
export async function fetchEspnMatchFeed(
  espnEventId: string,
  ctx: {
    pool: string;
    teamHome: string;
    teamAway: string;
    scoreHome: number;
    scoreAway: number;
  },
  force = false,
): Promise<EspnMatchFeed> {
  const cached = summaryCache.get(espnEventId);
  if (!force && cached && Date.now() - cached.at < SUMMARY_CACHE_TTL_MS) {
    return cached.feed;
  }

  try {
    const res = await fetch(`${ESPN_SUMMARY}?event=${encodeURIComponent(espnEventId)}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return cached?.feed ?? { goals: [], cards: [], teamStats: null, shootoutKicks: [] };
    const text = await res.text();
    if (!text || text.trimStart().startsWith('<!'))
      return cached?.feed ?? { goals: [], cards: [], teamStats: null, shootoutKicks: [] };
    const body = JSON.parse(text) as {
      keyEvents?: EspnKeyEvent[];
      boxscore?: { teams?: EspnBoxscoreTeam[] };
      shootout?: EspnShootoutTeam[];
    };
    const keyEvents = body.keyEvents ?? [];
    const goals = applyRunningScores(
      keyEvents
        .map((ev) => parseEspnGoal(ev, { espnEventId, ...ctx }))
        .filter((g): g is EspnGoalEvent => g != null),
    );
    const cards = sortByMinute(
      keyEvents
        .map((ev) => parseEspnCard(ev, { espnEventId }))
        .filter((c): c is EspnCardEvent => c != null),
    );
    const teamStats = parseMatchTeamStats(body.boxscore?.teams, ctx.teamHome, ctx.teamAway);
    const shootoutKicks = parseEspnShootout(body.shootout, ctx.teamHome, ctx.teamAway);
    const feed = { goals, cards, teamStats, shootoutKicks };
    summaryCache.set(espnEventId, { at: Date.now(), feed });
    return feed;
  } catch {
    return cached?.feed ?? { goals: [], cards: [], teamStats: null, shootoutKicks: [] };
  }
}

/** All goals in a fixture (newest last). */
export async function fetchEspnMatchGoals(
  espnEventId: string,
  ctx: {
    pool: string;
    teamHome: string;
    teamAway: string;
    scoreHome: number;
    scoreAway: number;
  },
  force = false,
): Promise<EspnGoalEvent[]> {
  const feed = await fetchEspnMatchFeed(espnEventId, ctx, force);
  return feed.goals;
}

export function teamKeyMatchesFollowed(teamName: string, followedLabelKeys: Set<string>): boolean {
  return followedLabelKeys.has(normalizeTeamKey(teamName));
}

export function matchPairForTeams(pool: string, teamHome: string, teamAway: string): string {
  return matchPairKey(pool, teamHome, teamAway);
}

export { normalizeEspnTeam, normalizeTeamKey };
