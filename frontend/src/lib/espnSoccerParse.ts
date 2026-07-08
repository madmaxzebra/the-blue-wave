import { normalizeTeamKey } from './teamKey';

/** Map ESPN display names to our FIFA schedule spellings. */
export function normalizeEspnTeam(name: string): string {
  const raw = name.trim();
  const key = normalizeTeamKey(raw);
  const aliases: Record<string, string> = {
    [normalizeTeamKey('Bosnia-Herzegovina')]: 'Bosnia and Herzegovina',
    [normalizeTeamKey('Türkiye')]: 'Turkey',
    [normalizeTeamKey('Turkiye')]: 'Turkey',
    [normalizeTeamKey('USA')]: 'United States',
    [normalizeTeamKey('Korea Republic')]: 'South Korea',
    [normalizeTeamKey('Cote d Ivoire')]: 'Ivory Coast',
    [normalizeTeamKey("Côte d'Ivoire")]: 'Ivory Coast',
    [normalizeTeamKey('IR Iran')]: 'Iran',
    [normalizeTeamKey('Cabo Verde')]: 'Cape Verde',
    [normalizeTeamKey('Congo DR')]: 'DR Congo',
    [normalizeTeamKey('Curacao')]: 'Curaçao',
    [normalizeTeamKey('Czechia')]: 'Czech Republic',
  };
  return aliases[key] ?? raw;
}

export type EspnMatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED';
export type EspnMatchPhase = 'extra_time' | 'penalties' | null;

export type EspnSoccerRow = {
  espnEventId: string;
  pool: string;
  teamHome: string;
  teamAway: string;
  startTime: string;
  status: EspnMatchStatus;
  scoreHome: number;
  scoreAway: number;
  shootoutScoreHome: number | null;
  shootoutScoreAway: number | null;
  winnerTeam: string | null;
  matchPhase: EspnMatchPhase;
  resultNote: string | null;
  liveClock: string | null;
  liveStatusDetail: string | null;
};

type EspnCompetitor = {
  homeAway?: string;
  score?: string;
  shootoutScore?: number;
  winner?: boolean;
  advance?: boolean;
  team?: { displayName?: string };
};

type EspnCompetition = {
  date?: string;
  startDate?: string;
  altGameNote?: string;
  notes?: Array<{ text?: string; headline?: string }>;
  status?: {
    type?: { name?: string; state?: string; detail?: string; shortDetail?: string };
    displayClock?: string;
    period?: number;
  };
  competitors?: EspnCompetitor[];
};

export type EspnEvent = {
  id?: string;
  date?: string;
  status?: { type?: { name?: string; state?: string } };
  competitions?: EspnCompetition[];
};

function parseIntScore(raw: string | undefined): number {
  const n = Number.parseInt(String(raw ?? '0'), 10);
  return Number.isFinite(n) ? n : 0;
}

function poolFromAltNote(note: string | undefined): string | null {
  if (!note) return null;
  const m = note.match(/Group\s+([A-L])/i);
  return m ? m[1].toUpperCase() : null;
}

/** ESPN knockout / soccer status — includes ET, pens, and FT-Pens. */
export function mapEspnSoccerStatus(name: string | undefined, state: string | undefined): EspnMatchStatus {
  const n = name ?? '';

  if (
    state === 'post' ||
    n === 'STATUS_FULL_TIME' ||
    n === 'STATUS_FINAL' ||
    n === 'STATUS_FINAL_PEN' ||
    n === 'STATUS_FINAL_AET' ||
    n === 'STATUS_FINAL_SHOOTOUT'
  ) {
    return 'FINISHED';
  }

  if (
    state === 'in' ||
    n === 'STATUS_FIRST_HALF' ||
    n === 'STATUS_SECOND_HALF' ||
    n === 'STATUS_HALFTIME' ||
    n === 'STATUS_END_PERIOD' ||
    n === 'STATUS_IN_PROGRESS' ||
    n === 'STATUS_EXTRA_TIME' ||
    n === 'STATUS_EXTRA_TIME_FIRST_HALF' ||
    n === 'STATUS_EXTRA_TIME_SECOND_HALF' ||
    n === 'STATUS_PENALTY_SHOOTOUT' ||
    n === 'STATUS_SHOOTOUT'
  ) {
    return 'LIVE';
  }

  return 'SCHEDULED';
}

export function espnMatchPhaseFromStatus(name: string | undefined, period?: number): EspnMatchPhase {
  const n = name ?? '';
  if (
    n.includes('PENALTY') ||
    n.includes('SHOOTOUT') ||
    n === 'STATUS_FINAL_PEN' ||
    period === 5
  ) {
    return 'penalties';
  }
  if (n.includes('EXTRA') || n === 'STATUS_FINAL_AET' || period === 3 || period === 4) {
    return 'extra_time';
  }
  return null;
}

function formatLivePhaseLabel(name: string | undefined, detail: string | undefined, period?: number): string | null {
  const phase = espnMatchPhaseFromStatus(name, period);
  if (phase === 'penalties') return 'Penalties';
  if (phase === 'extra_time') return 'Extra time';
  const d = detail?.trim();
  if (d) return d;
  return null;
}

export function parseEspnSoccerEvent(ev: EspnEvent, minStartTime = '2026-06-11'): EspnSoccerRow | null {
  const espnEventId = ev.id?.trim();
  if (!espnEventId) return null;

  const comp = ev.competitions?.[0];
  if (!comp?.competitors?.length) return null;

  const home = comp.competitors.find((c) => c.homeAway === 'home');
  const away = comp.competitors.find((c) => c.homeAway === 'away');
  if (!home?.team?.displayName || !away?.team?.displayName) return null;

  const startTime = comp.startDate ?? comp.date ?? ev.date;
  if (!startTime || startTime < minStartTime) return null;

  let pool = poolFromAltNote(comp.altGameNote);
  if (!pool) {
    if (startTime < '2026-06-28') return null;
    const note = comp.altGameNote ?? '';
    if (/group\s+[A-L]/i.test(note)) return null;
    pool = 'KO';
  }

  const statusType = comp.status?.type;
  const statusName = statusType?.name ?? ev.status?.type?.name;
  const statusState = statusType?.state ?? ev.status?.type?.state;
  const status = mapEspnSoccerStatus(statusName, statusState);
  const period = comp.status?.period;

  const teamHome = normalizeEspnTeam(home.team.displayName);
  const teamAway = normalizeEspnTeam(away.team.displayName);
  const scoreHome = parseIntScore(home.score);
  const scoreAway = parseIntScore(away.score);

  const shootoutScoreHome =
    typeof home.shootoutScore === 'number' && Number.isFinite(home.shootoutScore)
      ? home.shootoutScore
      : null;
  const shootoutScoreAway =
    typeof away.shootoutScore === 'number' && Number.isFinite(away.shootoutScore)
      ? away.shootoutScore
      : null;

  let winnerTeam: string | null = null;
  if (home.winner || home.advance) winnerTeam = teamHome;
  else if (away.winner || away.advance) winnerTeam = teamAway;
  else if (status === 'FINISHED' && scoreHome !== scoreAway) {
    winnerTeam = scoreHome > scoreAway ? teamHome : teamAway;
  } else if (
    status === 'FINISHED' &&
    shootoutScoreHome != null &&
    shootoutScoreAway != null &&
    shootoutScoreHome !== shootoutScoreAway
  ) {
    winnerTeam = shootoutScoreHome > shootoutScoreAway ? teamHome : teamAway;
  }

  const noteText = comp.notes?.find((n) => n.text?.trim())?.text?.trim() ?? null;
  const matchPhase =
    status === 'LIVE' || status === 'FINISHED'
      ? espnMatchPhaseFromStatus(statusName, period)
      : null;

  const liveClock = status === 'LIVE' ? comp.status?.displayClock?.trim() || null : null;
  const liveStatusDetail =
    status === 'LIVE'
      ? formatLivePhaseLabel(statusName, statusType?.shortDetail ?? statusType?.detail, period)
      : status === 'FINISHED' && espnMatchPhaseFromStatus(statusName, period) === 'penalties'
        ? statusType?.shortDetail?.trim() || 'FT-Penalties'
        : null;

  return {
    espnEventId,
    pool,
    teamHome,
    teamAway,
    startTime,
    status,
    scoreHome,
    scoreAway,
    shootoutScoreHome,
    shootoutScoreAway,
    winnerTeam,
    matchPhase,
    resultNote: noteText,
    liveClock,
    liveStatusDetail,
  };
}
