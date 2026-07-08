export type FinishedGoalLine = {
  minuteLabel: string;
  scorer: string;
  team: string;
  scoreLine: string;
  isOwnGoal?: boolean;
  isPenalty?: boolean;
};

export type LiveCardLine = {
  id: string;
  cardKind: 'yellow' | 'red';
  minuteLabel: string;
  player: string;
  team: string;
};

export type ShootoutKickLine = {
  id: string;
  player: string;
  team: string;
  side: 'home' | 'away';
  shotNumber: number;
  outcome: 'scored' | 'missed';
};

export type LiveMatchEventLine =
  | ({ kind: 'goal'; id: string; minute?: number | null } & FinishedGoalLine)
  | ({ kind: 'card' } & LiveCardLine);

export type MatchRecapPhase = 'full_time' | 'extra_time' | 'penalties';

export type MatchRecapContext = {
  matchPhase?: 'extra_time' | 'penalties' | null;
  resultNote?: string | null;
  shootoutScoreHome?: number | null;
  shootoutScoreAway?: number | null;
  shootoutKicksCount?: number;
  liveStatusDetail?: string | null;
};
