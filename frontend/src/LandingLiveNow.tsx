import { useEffect, useRef, useState } from 'react';
import { THE_BLUE_WAVE_APP_URL } from './appLinks';
import { useLandingMatchFeed } from './hooks/useLandingMatchFeed';
import { LandingMatchRecap } from './LandingMatchRecap';
import {
  fetchLandingMatchDisplay,
  type LandingMatchDisplay,
} from './landingEspnLive';
import {
  formatFinishedMeta,
  resolveLandingScoreDisplay,
} from './lib/matchScoreDisplay';
import { abbreviateTeamName, teamFlagImgSrc } from './teamFlags';

const POLL_LIVE_MS = 8_000;
const POLL_IDLE_MS = 30_000;

function formatKickoff(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return '';
  }
}

function MatchCard({ display }: { display: LandingMatchDisplay }) {
  const { match, kind } = display;
  const isLive = kind === 'live';
  const homeCode = abbreviateTeamName(match.teamHome);
  const awayCode = abbreviateTeamName(match.teamAway);
  const homeFlag = teamFlagImgSrc(match.teamHome, 72);
  const awayFlag = teamFlagImgSrc(match.teamAway, 72);
  const feed = useLandingMatchFeed(match, isLive);
  const scoreDisplay = resolveLandingScoreDisplay(match, isLive, feed.goals, feed.shootoutKicks);
  const statusMeta = formatFinishedMeta(match, feed.goals, feed.shootoutKicks);

  return (
    <section
      className={`landing-live-now${isLive ? ' landing-live-now--live' : ' landing-live-now--final'}`}
      aria-label={isLive ? 'Live now' : 'Last match'}
    >
      <p className="landing-live-now__headline">{isLive ? 'Live now' : 'Last match'}</p>
      {!isLive ? (
        <p className="landing-live-now__note">No live game right now — latest World Cup result:</p>
      ) : null}
      <p className="landing-live-now__match-title">
        {match.teamHome} vs {match.teamAway}
      </p>

      <div className="landing-live-now__matchup">
        <span className="landing-live-now__side">
          {homeFlag ? (
            <img className="landing-live-now__flag" src={homeFlag} width={54} height={40} alt="" decoding="async" />
          ) : null}
          <span className="landing-live-now__code">{homeCode}</span>
        </span>
        <span className="landing-live-now__score" aria-label={`Score ${scoreDisplay.primaryHome} to ${scoreDisplay.primaryAway}`}>
          {scoreDisplay.primaryHome}
          <span className="landing-live-now__dash"> – </span>
          {scoreDisplay.primaryAway}
        </span>
        <span className="landing-live-now__side">
          <span className="landing-live-now__code">{awayCode}</span>
          {awayFlag ? (
            <img className="landing-live-now__flag" src={awayFlag} width={54} height={40} alt="" decoding="async" />
          ) : null}
        </span>
      </div>

      {scoreDisplay.primaryLabel ? (
        <p className="landing-live-now__score-phase">{scoreDisplay.primaryLabel}</p>
      ) : null}
      {scoreDisplay.subLine ? <p className="landing-live-now__score-sub">{scoreDisplay.subLine}</p> : null}

      <p className="landing-live-now__meta">
        {match.pool === 'KO' ? 'Knockout' : `Group ${match.pool}`}
        {isLive
          ? match.liveStatusDetail
            ? ` · ${match.liveStatusDetail}`
            : match.liveClock
              ? ` · ${match.liveClock}`
              : ' · In play'
          : ` · ${statusMeta}`}
        {formatKickoff(match.startTime) ? ` · Kickoff ${formatKickoff(match.startTime)}` : ''}
      </p>

      <LandingMatchRecap
        match={match}
        homeCode={homeCode}
        awayCode={awayCode}
        teamStats={feed.teamStats}
        goals={feed.goals}
        cards={feed.cards}
        shootoutKicks={feed.shootoutKicks}
        isLive={isLive}
      />

      <a href={THE_BLUE_WAVE_APP_URL} className="landing-live-now__cta">
        Open live scores in the app
      </a>
    </section>
  );
}

export function LandingLiveNow() {
  const [display, setDisplay] = useState<LandingMatchDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const hasLiveRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let timer: number | null = null;

    const load = async (): Promise<number> => {
      try {
        const next = await fetchLandingMatchDisplay();
        if (!cancelled) {
          hasLiveRef.current = next?.kind === 'live';
          setDisplay(next);
          setLoading(false);
        }
        return next?.kind === 'live' ? POLL_LIVE_MS : POLL_IDLE_MS;
      } catch {
        if (!cancelled) setLoading(false);
        return hasLiveRef.current ? POLL_LIVE_MS : POLL_IDLE_MS;
      }
    };

    const schedule = (delay: number) => {
      if (cancelled) return;
      timer = window.setTimeout(async () => {
        const nextDelay = await load();
        schedule(nextDelay);
      }, delay);
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible' && !cancelled) {
        if (timer != null) window.clearTimeout(timer);
        schedule(0);
      }
    };

    schedule(0);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      if (timer != null) window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  if (loading) {
    return (
      <section className="landing-live-now landing-live-now--loading" aria-busy="true" aria-label="Loading live scores">
        <p className="landing-live-now__headline">Live now</p>
        <p className="landing-live-now__note">Loading match scores…</p>
      </section>
    );
  }

  if (!display) {
    return (
      <section className="landing-live-now landing-live-now--empty" aria-label="Live scores">
        <p className="landing-live-now__headline">Live now</p>
        <p className="landing-live-now__note">
          Scores are updating — open the app for live results, or refresh in a moment.
        </p>
        <a href={THE_BLUE_WAVE_APP_URL} className="landing-live-now__cta">
          Open live scores in the app
        </a>
      </section>
    );
  }

  return <MatchCard display={display} />;
}
