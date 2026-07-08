import type { TeamLiveStats } from './espnGoalEvents';

export function formatPossessionPct(value: number | null): string | null {
  if (value == null) return null;
  return `${Math.round(value)}%`;
}

export function formatStatCount(value: number | null): string | null {
  if (value == null) return null;
  return String(Math.round(value));
}

export function teamStatsHasData(stats: TeamLiveStats): boolean {
  return (
    stats.possessionPct != null ||
    stats.shots != null ||
    stats.shotsOnTarget != null ||
    stats.corners != null
  );
}
