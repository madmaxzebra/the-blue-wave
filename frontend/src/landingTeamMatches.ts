export type LandingFixture = {
  startTime: string;
  teamHome: string;
  teamAway: string;
  pool: string;
  city: string;
  stadium: string;
  country: string;
};

export const CURACAO_FIXTURES: LandingFixture[] = [
  {
    pool: 'E',
    teamHome: 'Germany',
    teamAway: 'Curaçao',
    startTime: '2026-06-14T17:00:00.000Z',
    city: 'Houston',
    stadium: 'NRG Stadium',
    country: 'USA',
  },
  {
    pool: 'E',
    teamHome: 'Ecuador',
    teamAway: 'Curaçao',
    startTime: '2026-06-21T00:00:00.000Z',
    city: 'Kansas City',
    stadium: 'Arrowhead Stadium',
    country: 'USA',
  },
  {
    pool: 'E',
    teamHome: 'Curaçao',
    teamAway: 'Ivory Coast',
    startTime: '2026-06-25T20:00:00.000Z',
    city: 'Philadelphia',
    stadium: 'Lincoln Financial Field',
    country: 'USA',
  },
];

export const NETHERLANDS_FIXTURES: LandingFixture[] = [
  {
    pool: 'F',
    teamHome: 'Netherlands',
    teamAway: 'Japan',
    startTime: '2026-06-14T20:00:00.000Z',
    city: 'Arlington',
    stadium: 'AT&T Stadium',
    country: 'USA',
  },
  {
    pool: 'F',
    teamHome: 'Netherlands',
    teamAway: 'Sweden',
    startTime: '2026-06-20T17:00:00.000Z',
    city: 'Houston',
    stadium: 'NRG Stadium',
    country: 'USA',
  },
  {
    pool: 'F',
    teamHome: 'Tunisia',
    teamAway: 'Netherlands',
    startTime: '2026-06-25T23:00:00.000Z',
    city: 'Kansas City',
    stadium: 'Arrowhead Stadium',
    country: 'USA',
  },
];

const MATCH_WINDOW_MS = 105 * 60 * 1000;

export function nextFixtureForTeam(
  team: string,
  fixtures: LandingFixture[],
  nowMs = Date.now(),
): LandingFixture | null {
  const sorted = [...fixtures].sort((a, b) => a.startTime.localeCompare(b.startTime));
  for (const f of sorted) {
    const kickoff = Date.parse(f.startTime);
    if (!Number.isFinite(kickoff)) continue;
    if (kickoff + MATCH_WINDOW_MS > nowMs) return f;
  }
  return null;
}

export function fixtureIsLive(fixture: LandingFixture, nowMs = Date.now()): boolean {
  const kickoff = Date.parse(fixture.startTime);
  if (!Number.isFinite(kickoff)) return false;
  return nowMs >= kickoff && nowMs < kickoff + MATCH_WINDOW_MS;
}

export function fixtureLabel(fixture: LandingFixture, focusTeam: string): string {
  const opponent = fixture.teamHome === focusTeam ? fixture.teamAway : fixture.teamHome;
  const home = fixture.teamHome === focusTeam;
  return home ? `${focusTeam} vs ${opponent}` : `${opponent} vs ${focusTeam}`;
}

export function formatFixtureKickoff(iso: string): string {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString(undefined, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const time = d.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
    return `${date} · ${time}`;
  } catch {
    return iso;
  }
}

export function formatFixtureVenue(fixture: LandingFixture): string {
  return `${fixture.city}, ${fixture.country} · ${fixture.stadium}`;
}
