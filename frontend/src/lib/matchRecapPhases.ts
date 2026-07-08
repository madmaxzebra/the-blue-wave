import type { MatchRecapContext, MatchRecapPhase } from './matchRecapTypes';
import { normalizeTeamKey } from './teamKey';

type GoalMinuteLike = { minuteLabel: string; minute?: number | null };

function parseMinuteFromLabel(label: string): number | null {
  const trimmed = label.trim();
  const stoppage = trimmed.match(/^90\+(\d+)/);
  if (stoppage) return 90 + Number.parseInt(stoppage[1], 10);
  const et = trimmed.match(/^(\d{1,3})/);
  if (!et) return null;
  const n = Number.parseInt(et[1], 10);
  return Number.isFinite(n) ? n : null;
}

export function isMatchInPenalties(ctx: Pick<MatchRecapContext, 'matchPhase' | 'liveStatusDetail'>): boolean {
  if (ctx.matchPhase === 'penalties') return true;
  const d = (ctx.liveStatusDetail ?? '').toUpperCase();
  return d.includes('PEN') || d.includes('SHOOTOUT');
}

export function matchHadExtraTime(ctx: MatchRecapContext, goals: GoalMinuteLike[]): boolean {
  if (ctx.matchPhase === 'extra_time') return true;
  const note = (ctx.resultNote ?? '').toUpperCase();
  if (note.includes('EXTRA') || note.includes('AET') || note.includes('ET')) return true;
  for (const g of goals) {
    const minute = g.minute ?? parseMinuteFromLabel(g.minuteLabel);
    if (minute != null && minute > 90) return true;
  }
  return false;
}

export function matchEndedOnPenalties(ctx: MatchRecapContext): boolean {
  if (isMatchInPenalties(ctx)) return true;
  if ((ctx.shootoutKicksCount ?? 0) > 0) return true;
  return (
    ctx.shootoutScoreHome != null &&
    ctx.shootoutScoreAway != null &&
    ctx.shootoutScoreHome + ctx.shootoutScoreAway > 0
  );
}

export function matchRecapPhases(ctx: MatchRecapContext, goals: GoalMinuteLike[]): MatchRecapPhase[] {
  const phases: MatchRecapPhase[] = ['full_time'];
  if (matchHadExtraTime(ctx, goals)) phases.push('extra_time');
  if (matchEndedOnPenalties(ctx)) phases.push('penalties');
  return phases;
}

export function matchRecapPhaseLabel(phase: MatchRecapPhase): string {
  if (phase === 'extra_time') return 'Extra time';
  if (phase === 'penalties') return 'Penalties';
  return 'Full time';
}

export type ShootoutKickLike = {
  team: string;
  side?: 'home' | 'away';
  outcome: 'scored' | 'missed';
};

function countShootoutGoals(kicks: ShootoutKickLike[], teamHome: string): { home: number; away: number } {
  const homeKey = normalizeTeamKey(teamHome);
  let home = 0;
  let away = 0;
  for (const kick of kicks) {
    if (kick.outcome !== 'scored') continue;
    const isHome = kick.side === 'home' || (kick.side == null && normalizeTeamKey(kick.team) === homeKey);
    if (isHome) home += 1;
    else away += 1;
  }
  return { home, away };
}

export function resolveShootoutDisplayScores(
  match: {
    teamHome: string;
    teamAway: string;
    shootoutScoreHome?: number | null;
    shootoutScoreAway?: number | null;
  },
  kicks: ShootoutKickLike[],
): { home: number; away: number } | null {
  if (kicks.length > 0) return countShootoutGoals(kicks, match.teamHome);
  if (match.shootoutScoreHome != null && match.shootoutScoreAway != null) {
    return { home: match.shootoutScoreHome, away: match.shootoutScoreAway };
  }
  return null;
}

export function partitionShootoutKicks<T extends ShootoutKickLike & { side?: 'home' | 'away'; shotNumber?: number }>(
  kicks: T[],
  teamHome: string,
): { home: T[]; away: T[] } {
  const homeKey = normalizeTeamKey(teamHome);
  const home: T[] = [];
  const away: T[] = [];
  for (const kick of kicks) {
    const isHome = kick.side === 'home' || (kick.side == null && normalizeTeamKey(kick.team) === homeKey);
    if (isHome) home.push(kick);
    else away.push(kick);
  }
  const byShot = (a: T, b: T) => (a.shotNumber ?? 0) - (b.shotNumber ?? 0);
  home.sort(byShot);
  away.sort(byShot);
  return { home, away };
}
