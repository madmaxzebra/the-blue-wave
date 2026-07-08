import type { EspnCardEvent, EspnGoalEvent, EspnMatchFeed, EspnShootoutKick } from './espnGoalEvents';
import type { FinishedGoalLine, LiveCardLine, ShootoutKickLine } from './matchRecapTypes';

export function mapEspnGoalsToLines(goals: EspnGoalEvent[]): FinishedGoalLine[] {
  return goals.map((g) => ({
    minuteLabel: g.minuteLabel || (g.minute != null ? `${g.minute}'` : '\u2014'),
    scorer: g.scorer,
    team: g.scoringTeam,
    scoreLine: `${g.scoreHome}\u2013${g.scoreAway}`,
    isOwnGoal: g.isOwnGoal,
    isPenalty: g.isPenalty,
  }));
}

export function mapEspnCardsToLines(cards: EspnCardEvent[]): LiveCardLine[] {
  return cards.map((c) => ({
    id: c.id,
    cardKind: c.kind,
    minuteLabel: c.minuteLabel,
    player: c.player,
    team: c.team,
  }));
}

export function mapEspnShootoutKicks(kicks: EspnShootoutKick[]): ShootoutKickLine[] {
  return kicks.map((k) => ({
    id: k.id,
    player: k.player,
    team: k.team,
    side: k.side,
    shotNumber: k.shotNumber,
    outcome: k.outcome,
  }));
}

export function mapEspnMatchFeedToRecap(feed: EspnMatchFeed) {
  return {
    teamStats: feed.teamStats,
    goals: mapEspnGoalsToLines(feed.goals),
    cards: mapEspnCardsToLines(feed.cards),
    shootoutKicks: mapEspnShootoutKicks(feed.shootoutKicks),
  };
}
