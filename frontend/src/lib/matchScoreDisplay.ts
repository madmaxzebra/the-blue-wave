import {
  isMatchInPenalties,
  matchEndedOnPenalties,
  matchHadExtraTime,
  resolveShootoutDisplayScores,
} from './matchRecapPhases';
import type { FinishedGoalLine, MatchRecapContext, ShootoutKickLine } from './matchRecapTypes';

export type LandingScoreMatch = {
  teamHome: string;
  teamAway: string;
  scoreHome: number;
  scoreAway: number;
  shootoutScoreHome?: number | null;
  shootoutScoreAway?: number | null;
  matchPhase?: MatchRecapContext['matchPhase'];
  resultNote?: string | null;
  liveStatusDetail?: string | null;
};

/** e.g. "2–2 (3–4 pens)" */
export function formatMatchScoreDetail(m: LandingScoreMatch, status?: 'LIVE' | 'FINISHED'): string | null {
  const pens =
    m.shootoutScoreHome != null &&
    m.shootoutScoreAway != null &&
    (isMatchInPenalties(m) || m.shootoutScoreHome > 0 || m.shootoutScoreAway > 0);
  if (pens) {
    return `${m.scoreHome}–${m.scoreAway} after extra time · ${m.shootoutScoreHome}–${m.shootoutScoreAway} on penalties`;
  }
  if (m.resultNote?.trim()) return m.resultNote.trim();
  if (status === 'LIVE' && m.matchPhase === 'penalties') return 'Penalty shootout';
  if (status === 'LIVE' && m.matchPhase === 'extra_time') return 'Extra time (2 × 15 min)';
  if (status === 'FINISHED' && matchHadExtraTime(m, [])) return `${m.scoreHome}–${m.scoreAway} after extra time`;
  return null;
}

export function formatFinishedMeta(
  m: LandingScoreMatch,
  goals: FinishedGoalLine[],
  shootoutKicks: ShootoutKickLine[],
): string {
  const ctx: MatchRecapContext = {
    matchPhase: m.matchPhase,
    resultNote: m.resultNote,
    shootoutScoreHome: m.shootoutScoreHome,
    shootoutScoreAway: m.shootoutScoreAway,
    shootoutKicksCount: shootoutKicks.length,
    liveStatusDetail: m.liveStatusDetail,
  };
  const pens = matchEndedOnPenalties(ctx);
  const et = matchHadExtraTime(ctx, goals);

  if (pens) {
    return et ? 'After extra time · Decided on penalties' : 'Decided on penalties';
  }
  if (et) return 'After extra time (2 × 15 min)';
  return 'Full time';
}

export type LandingScoreDisplay = {
  /** Large headline numbers in the score row */
  primaryHome: number;
  primaryAway: number;
  primaryLabel: string | null;
  /** Line under the score (AET score when pens decide) */
  subLine: string | null;
  detailLine: string | null;
};

/** Penalties 3–4 as the main result when the shootout decided the tie. */
export function resolveLandingScoreDisplay(
  m: LandingScoreMatch,
  isLive: boolean,
  goals: FinishedGoalLine[],
  shootoutKicks: ShootoutKickLine[],
): LandingScoreDisplay {
  const ctx: MatchRecapContext = {
    matchPhase: m.matchPhase,
    resultNote: m.resultNote,
    shootoutScoreHome: m.shootoutScoreHome,
    shootoutScoreAway: m.shootoutScoreAway,
    shootoutKicksCount: shootoutKicks.length,
    liveStatusDetail: m.liveStatusDetail,
  };
  const pens = resolveShootoutDisplayScores(m, shootoutKicks);
  const onPens = matchEndedOnPenalties(ctx);
  const et = matchHadExtraTime(ctx, goals);
  const status = isLive ? 'LIVE' : 'FINISHED';

  if (onPens && pens && !isLive) {
    return {
      primaryHome: pens.home,
      primaryAway: pens.away,
      primaryLabel: 'Penalties',
      subLine: et
        ? `After extra time the score was ${m.scoreHome}–${m.scoreAway} (2 × 15 min each half)`
        : `Full-time score was ${m.scoreHome}–${m.scoreAway}`,
      detailLine: formatMatchScoreDetail(m, status),
    };
  }

  if (isLive && isMatchInPenalties(m) && pens) {
    return {
      primaryHome: pens.home,
      primaryAway: pens.away,
      primaryLabel: 'Penalties — live',
      subLine: et ? `Extra time ended ${m.scoreHome}–${m.scoreAway}` : `Score ${m.scoreHome}–${m.scoreAway}`,
      detailLine: null,
    };
  }

  if (isLive && m.matchPhase === 'extra_time') {
    return {
      primaryHome: m.scoreHome,
      primaryAway: m.scoreAway,
      primaryLabel: 'Extra time',
      subLine: '2 × 15 minutes',
      detailLine: null,
    };
  }

  return {
    primaryHome: m.scoreHome,
    primaryAway: m.scoreAway,
    primaryLabel: et && !isLive ? 'After extra time' : null,
    subLine: et && !isLive ? '2 × 15 minutes each half' : null,
    detailLine: formatMatchScoreDetail(m, status),
  };
}

export function statsHeadingIncludesExtraTime(
  m: LandingScoreMatch,
  goals: FinishedGoalLine[],
): boolean {
  return matchHadExtraTime(
    {
      matchPhase: m.matchPhase,
      resultNote: m.resultNote,
      shootoutScoreHome: m.shootoutScoreHome,
      shootoutScoreAway: m.shootoutScoreAway,
    },
    goals,
  );
}
