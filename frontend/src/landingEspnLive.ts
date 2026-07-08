import { parseEspnSoccerEvent, type EspnEvent } from './lib/espnSoccerParse';

const ESPN_SCOREBOARD =
  'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';

const GROUP_FIRST = '2026-06-11';
const GROUP_LAST = '2026-07-19';

const CACHE_TTL_MS = 8_000;
let cacheAt = 0;
let cacheDisplay: LandingMatchDisplay | null = null;

export type LandingLiveMatch = {
  espnEventId: string;
  pool: string;
  teamHome: string;
  teamAway: string;
  startTime: string;
  scoreHome: number;
  scoreAway: number;
  liveClock: string | null;
  liveStatusDetail: string | null;
  matchPhase: 'extra_time' | 'penalties' | null;
  resultNote: string | null;
  shootoutScoreHome: number | null;
  shootoutScoreAway: number | null;
};

export type LandingMatchDisplay =
  | { kind: 'live'; match: LandingLiveMatch }
  | { kind: 'final'; match: LandingLiveMatch };

export type LandingScheduleMatch = LandingLiveMatch & {
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
};

function rowFromEspn(ev: EspnEvent): LandingScheduleMatch | null {
  const parsed = parseEspnSoccerEvent(ev, GROUP_FIRST);
  if (!parsed) return null;
  return {
    espnEventId: parsed.espnEventId,
    pool: parsed.pool,
    teamHome: parsed.teamHome,
    teamAway: parsed.teamAway,
    startTime: parsed.startTime,
    scoreHome: parsed.scoreHome,
    scoreAway: parsed.scoreAway,
    liveClock: parsed.liveClock,
    liveStatusDetail: parsed.liveStatusDetail,
    matchPhase: parsed.matchPhase,
    resultNote: parsed.resultNote,
    shootoutScoreHome: parsed.shootoutScoreHome,
    shootoutScoreAway: parsed.shootoutScoreAway,
    status: parsed.status,
  };
}

function localYmdFromIso(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function espnDateRange(): string {
  const from = GROUP_FIRST.replace(/-/g, '');
  const to = GROUP_LAST.replace(/-/g, '');
  return `${from}-${to}`;
}

function espnRecentDateRange(): string {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 4);
  const end = new Date(now);
  end.setDate(end.getDate() + 2);
  const ymd = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `${ymd(start)}-${ymd(end)}`;
}

async function fetchEspnRowsForDates(dates: string): Promise<LandingScheduleMatch[]> {
  const url = `${ESPN_SCOREBOARD}?dates=${dates}&limit=200`;
  const res = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } });
  if (!res.ok) return [];
  const text = await res.text();
  if (!text || text.trimStart().startsWith('<!')) return [];
  const body = JSON.parse(text) as { events?: EspnEvent[] };
  return (body.events ?? [])
    .map(rowFromEspn)
    .filter((m): m is LandingScheduleMatch => m != null);
}

async function fetchAllEspnRows(): Promise<LandingScheduleMatch[]> {
  const recent = await fetchEspnRowsForDates(espnRecentDateRange());
  const activeRecent = recent.filter((m) => m.status === 'LIVE' || m.status === 'FINISHED');
  if (pickDisplay(activeRecent)) return recent;

  const full = await fetchEspnRowsForDates(espnDateRange());
  if (full.length === 0) return recent;

  const byId = new Map<string, LandingScheduleMatch>();
  for (const row of [...recent, ...full]) byId.set(row.espnEventId, row);
  return [...byId.values()];
}

function pickDisplay(rows: LandingScheduleMatch[]): LandingMatchDisplay | null {
  const live = rows
    .filter((m) => m.status === 'LIVE')
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  if (live[0]) {
    const { status: _s, ...match } = live[0];
    return { kind: 'live', match };
  }

  const latest = rows
    .filter((m) => m.status === 'FINISHED')
    .sort((a, b) => b.startTime.localeCompare(a.startTime))[0];
  if (!latest) return null;
  const { status: _s, ...match } = latest;
  return { kind: 'final', match };
}

/** Live match when on; otherwise the most recent final score. */
export async function fetchLandingMatchDisplay(force = false): Promise<LandingMatchDisplay | null> {
  if (!force && cacheDisplay && Date.now() - cacheAt < CACHE_TTL_MS) {
    return cacheDisplay;
  }

  try {
    const rows = (await fetchAllEspnRows()).filter((m) => m.status === 'LIVE' || m.status === 'FINISHED');
    cacheDisplay = pickDisplay(rows);
    cacheAt = Date.now();
    return cacheDisplay;
  } catch {
    return cacheDisplay;
  }
}

/** @deprecated Use fetchLandingMatchDisplay */
export async function fetchAnyLiveMatch(force = false): Promise<LandingLiveMatch | null> {
  const display = await fetchLandingMatchDisplay(force);
  return display?.kind === 'live' ? display.match : null;
}

let todaysCacheAt = 0;
let todaysCache: LandingScheduleMatch[] = [];

/** All World Cup fixtures today (local date), including scheduled and knockout. */
export async function fetchLandingTodaysGames(force = false): Promise<LandingScheduleMatch[]> {
  if (!force && todaysCache.length > 0 && Date.now() - todaysCacheAt < CACHE_TTL_MS) {
    return todaysCache;
  }

  try {
    const today = localYmdFromIso(new Date().toString());
    const rows = (await fetchAllEspnRows())
      .filter((m) => localYmdFromIso(m.startTime) === today)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    todaysCache = rows;
    todaysCacheAt = Date.now();
    return rows;
  } catch {
    return todaysCache;
  }
}
