import { useEffect, useRef, useState } from 'react';
import { THE_BLUE_WAVE_APP_URL } from './appLinks';
import { fetchLandingTodaysGames, type LandingScheduleMatch } from './landingEspnLive';
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

function poolLabel(pool: string): string {
  return pool === 'KO' ? 'Knockout' : `Group ${pool}`;
}

function MatchRow({ match }: { match: LandingScheduleMatch }) {
  const homeCode = abbreviateTeamName(match.teamHome);
  const awayCode = abbreviateTeamName(match.teamAway);
  const homeFlag = teamFlagImgSrc(match.teamHome, 48);
  const awayFlag = teamFlagImgSrc(match.teamAway, 48);
  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FINISHED';
  const kickoff = formatKickoff(match.startTime);

  return (
    <li className={`landing-todays-games__row${isLive ? ' landing-todays-games__row--live' : ''}`}>
      <div className="landing-todays-games__meta">
        <span>{poolLabel(match.pool)}</span>
        {isLive ? <span className="landing-todays-games__live">Live</span> : null}
        {isFinished ? <span className="landing-todays-games__ft">Full time</span> : null}
        {!isLive && !isFinished && kickoff ? <span>{kickoff}</span> : null}
      </div>
      <div className="landing-todays-games__matchup">
        <span className="landing-todays-games__side">
          {homeFlag ? (
            <img className="landing-todays-games__flag" src={homeFlag} width={28} height={21} alt="" decoding="async" />
          ) : null}
          <span>{homeCode}</span>
        </span>
        <span className="landing-todays-games__score">
          {isLive || isFinished ? `${match.scoreHome} – ${match.scoreAway}` : 'vs'}
        </span>
        <span className="landing-todays-games__side">
          <span>{awayCode}</span>
          {awayFlag ? (
            <img className="landing-todays-games__flag" src={awayFlag} width={28} height={21} alt="" decoding="async" />
          ) : null}
        </span>
      </div>
      {isLive && match.liveClock ? (
        <p className="landing-todays-games__clock">{match.liveClock}</p>
      ) : null}
    </li>
  );
}

export function LandingTodaysGames() {
  const [matches, setMatches] = useState<LandingScheduleMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLiveRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let timer: number | null = null;

    const load = async (): Promise<number> => {
      try {
        const rows = await fetchLandingTodaysGames();
        if (!cancelled) {
          hasLiveRef.current = rows.some((m) => m.status === 'LIVE');
          setMatches(rows);
          setLoading(false);
        }
        return hasLiveRef.current ? POLL_LIVE_MS : POLL_IDLE_MS;
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
      <section className="landing-todays-games landing-todays-games--loading" aria-busy="true">
        <p className="landing-todays-games__headline">Today&apos;s games</p>
        <p className="landing-todays-games__note">Loading today&apos;s schedule…</p>
      </section>
    );
  }

  if (matches.length === 0) return null;

  return (
    <section className="landing-todays-games" aria-labelledby="landing-todays-games-heading">
      <p id="landing-todays-games-heading" className="landing-todays-games__headline">
        Today&apos;s games
      </p>
      <ul className="landing-todays-games__list">
        {matches.map((m) => (
          <MatchRow key={`${m.startTime}-${m.teamHome}-${m.teamAway}`} match={m} />
        ))}
      </ul>
      <a href={THE_BLUE_WAVE_APP_URL} className="landing-todays-games__cta">
        Full schedule in the app
      </a>
    </section>
  );
}
