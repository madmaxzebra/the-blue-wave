import type { LiveMatchTeamStats } from './lib/espnGoalEvents';
import {
  formatPossessionPct,
  formatStatCount,
  teamStatsHasData,
} from './lib/liveMatchStatsFormat';
import {
  matchEndedOnPenalties,
  matchRecapPhaseLabel,
  matchRecapPhases,
  partitionShootoutKicks,
  resolveShootoutDisplayScores,
} from './lib/matchRecapPhases';
import type {
  FinishedGoalLine,
  LiveCardLine,
  LiveMatchEventLine,
  MatchRecapContext,
  ShootoutKickLine,
} from './lib/matchRecapTypes';
import { statsHeadingIncludesExtraTime } from './lib/matchScoreDisplay';
import { abbreviateTeamName } from './teamFlags';
import './LandingMatchRecap.css';
import './LandingPenaltyPanel.css';

const DASH = '—';

type RecapMatch = {
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

type Props = {
  match: RecapMatch;
  homeCode: string;
  awayCode: string;
  teamStats: LiveMatchTeamStats | null;
  goals: FinishedGoalLine[];
  cards: LiveCardLine[];
  shootoutKicks: ShootoutKickLine[];
  isLive: boolean;
};

function mergeRecapEvents(goals: FinishedGoalLine[], cards: LiveCardLine[]): LiveMatchEventLine[] {
  const merged: LiveMatchEventLine[] = [
    ...goals.map((g, i) => ({ kind: 'goal' as const, id: `g-${i}`, minute: null, ...g })),
    ...cards.map((c) => ({ kind: 'card' as const, ...c })),
  ];
  return merged.sort((a, b) => {
    const minuteOf = (row: LiveMatchEventLine) => {
      if (row.kind === 'goal') return row.minute ?? 0;
      const parsed = Number.parseInt(row.minuteLabel, 10);
      return Number.isFinite(parsed) ? parsed : 0;
    };
    const am = minuteOf(a);
    const bm = minuteOf(b);
    if (am !== bm) return am - bm;
    if (a.kind === 'goal' && b.kind === 'card') return -1;
    if (a.kind === 'card' && b.kind === 'goal') return 1;
    return 0;
  });
}

function goalTags(g: FinishedGoalLine): string[] {
  const tags: string[] = [];
  if (g.isPenalty) tags.push('Penalty');
  if (g.isOwnGoal) tags.push('OG');
  return tags;
}

function RecapStatsTable({
  homeCode,
  awayCode,
  teamStats,
  includesExtraTime,
}: {
  homeCode: string;
  awayCode: string;
  teamStats: LiveMatchTeamStats | null;
  includesExtraTime: boolean;
}) {
  if (!teamStats || (!teamStatsHasData(teamStats.home) && !teamStatsHasData(teamStats.away))) return null;

  const heading = includesExtraTime
    ? 'Match statistics (incl. extra time)'
    : 'Match statistics';

  const rows = [
    {
      label: 'Ball possession',
      home: formatPossessionPct(teamStats.home.possessionPct) ?? DASH,
      away: formatPossessionPct(teamStats.away.possessionPct) ?? DASH,
    },
    {
      label: 'Shots',
      home: formatStatCount(teamStats.home.shots) ?? DASH,
      away: formatStatCount(teamStats.away.shots) ?? DASH,
    },
    {
      label: 'Shots on target',
      home: formatStatCount(teamStats.home.shotsOnTarget) ?? DASH,
      away: formatStatCount(teamStats.away.shotsOnTarget) ?? DASH,
    },
    {
      label: 'Corners',
      home: formatStatCount(teamStats.home.corners) ?? DASH,
      away: formatStatCount(teamStats.away.corners) ?? DASH,
    },
  ];

  return (
    <div className="match-recap-stats">
      <p className="match-recap-stats__heading">{heading}</p>
      <table className="match-recap-stats__table">
        <thead>
          <tr>
            <th scope="col">{homeCode}</th>
            <th scope="col" className="match-recap-stats__mid">
              Stat
            </th>
            <th scope="col">{awayCode}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td>{row.home}</td>
              <th scope="row" className="match-recap-stats__mid">
                {row.label}
              </th>
              <td>{row.away}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecapEventsList({ events, heading }: { events: LiveMatchEventLine[]; heading: string }) {
  if (events.length === 0) return null;

  return (
    <div className="landing-recap-events">
      <p className="landing-recap-events__heading">{heading}</p>
      <ul className="landing-recap-events__list">
        {events.map((row) => {
          if (row.kind === 'card') {
            return (
              <li
                key={row.id}
                className={`landing-recap-events__item landing-recap-events__item--card landing-recap-events__item--${row.cardKind}`}
              >
                <span
                  className={`landing-recap-events__card-icon landing-recap-events__card-icon--${row.cardKind}`}
                  aria-hidden
                />
                <span className="landing-recap-events__minute">{row.minuteLabel}</span>
                <span className="landing-recap-events__scorer">
                  {row.player}
                  <span className="landing-recap-events__team"> ({abbreviateTeamName(row.team)})</span>
                </span>
              </li>
            );
          }

          const tags = goalTags(row);
          return (
            <li key={row.id} className="landing-recap-events__item landing-recap-events__item--goal">
              <span className="landing-recap-events__goal-icon" aria-hidden>
                ⚽
              </span>
              <span className="landing-recap-events__minute">{row.minuteLabel}</span>
              <span className="landing-recap-events__scorer">
                {row.scorer}
                <span className="landing-recap-events__team"> ({abbreviateTeamName(row.team)})</span>
                {tags.length > 0 ? (
                  <span className="landing-recap-events__tags">
                    {tags.map((t) => (
                      <span key={t} className="landing-recap-events__tag">
                        {t}
                      </span>
                    ))}
                  </span>
                ) : null}
              </span>
              <span className="landing-recap-events__score">{row.scoreLine}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PenaltyPanel({
  homeCode,
  awayCode,
  homeKicks,
  awayKicks,
  penHome,
  penAway,
  isLive,
}: {
  homeCode: string;
  awayCode: string;
  homeKicks: ShootoutKickLine[];
  awayKicks: ShootoutKickLine[];
  penHome: number;
  penAway: number;
  isLive: boolean;
}) {
  const hasKicks = homeKicks.length > 0 || awayKicks.length > 0;
  if (!hasKicks && penHome === 0 && penAway === 0) return null;

  return (
    <section className={`pen-live${isLive ? '' : ' pen-live--static'}`} aria-label="Penalty shootout">
      <p className="pen-live__title">{isLive ? 'Penalty shootout' : 'Penalties'}</p>
      <div className="pen-live__scoreline" aria-live="polite">
        <span className="pen-live__score-code">{homeCode}</span>
        <strong className="pen-live__score-main">
          {penHome}
          <span className="pen-live__score-dash"> – </span>
          {penAway}
        </strong>
        <span className="pen-live__score-code">{awayCode}</span>
      </div>
      {hasKicks ? (
        <div className="pen-live__cols">
          {[homeKicks, awayKicks].map((kicks, colIndex) => {
            const code = colIndex === 0 ? homeCode : awayCode;
            const total = colIndex === 0 ? penHome : penAway;
            return (
              <div key={code} className="pen-live__col">
                <div className="pen-live__col-head">
                  <span className="pen-live__col-code">{code}</span>
                  <strong className="pen-live__col-total">{total}</strong>
                </div>
                <ul className="pen-live__kicks">
                  {kicks.length === 0 ? (
                    <li className="pen-live__kick pen-live__kick--empty">—</li>
                  ) : (
                    kicks.map((kick) => {
                      const scored = kick.outcome === 'scored';
                      return (
                        <li key={kick.id} className={`pen-live__kick pen-live__kick--${kick.outcome}`}>
                          <span className="pen-live__kick-icon" aria-hidden>
                            {scored ? '✓' : '✗'}
                          </span>
                          <span className="pen-live__kick-body">
                            <span className="pen-live__kick-player">{kick.player}</span>
                            <span className={`pen-live__kick-result pen-live__kick-result--${kick.outcome}`}>
                              {scored ? 'Scored' : 'Missed'}
                            </span>
                          </span>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      ) : isLive ? (
        <p className="pen-live__waiting">Waiting for the first kick…</p>
      ) : null}
    </section>
  );
}

/** Stats, goals, bookings, and penalties — same data as the app Live tab. */
export function LandingMatchRecap({
  match,
  homeCode,
  awayCode,
  teamStats,
  goals,
  cards,
  shootoutKicks,
  isLive,
}: Props) {
  const ctx: MatchRecapContext = {
    matchPhase: match.matchPhase,
    resultNote: match.resultNote,
    shootoutScoreHome: match.shootoutScoreHome,
    shootoutScoreAway: match.shootoutScoreAway,
    shootoutKicksCount: shootoutKicks.length,
    liveStatusDetail: match.liveStatusDetail,
  };
  const phases = matchRecapPhases(ctx, goals);
  const onPens = matchEndedOnPenalties(ctx);
  const penTotals = onPens
    ? resolveShootoutDisplayScores(
        {
          teamHome: match.teamHome,
          teamAway: match.teamAway,
          shootoutScoreHome: match.shootoutScoreHome,
          shootoutScoreAway: match.shootoutScoreAway,
        },
        shootoutKicks,
      )
    : null;
  const { home: homePenKicks, away: awayPenKicks } = partitionShootoutKicks(shootoutKicks, match.teamHome);
  const events = mergeRecapEvents(goals, cards);
  const eventsHeading =
    cards.length > 0 ? 'Goals & bookings' : goals.length > 0 ? 'All goals' : 'Match events';

  return (
    <div className="match-recap match-recap--compact landing-match-recap">
      <div className="match-recap__phases" aria-label="Match phases">
        {phases.map((phase) => (
          <span
            key={phase}
            className={`match-recap__phase match-recap__phase--${phase.replace('_', '-')}`}
          >
            {matchRecapPhaseLabel(phase)}
          </span>
        ))}
      </div>

      <RecapStatsTable
        homeCode={homeCode}
        awayCode={awayCode}
        teamStats={teamStats}
        includesExtraTime={statsHeadingIncludesExtraTime(match, goals)}
      />

      {events.length > 0 ? (
        <RecapEventsList events={events} heading={eventsHeading} />
      ) : (
        <p className="match-recap__empty">Goal and booking details will appear here when available.</p>
      )}

      {onPens && penTotals ? (
        <PenaltyPanel
          homeCode={homeCode}
          awayCode={awayCode}
          homeKicks={homePenKicks}
          awayKicks={awayPenKicks}
          penHome={penTotals.home}
          penAway={penTotals.away}
          isLive={isLive}
        />
      ) : null}
    </div>
  );
}
