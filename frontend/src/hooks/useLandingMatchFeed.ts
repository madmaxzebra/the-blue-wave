import { useEffect, useState } from 'react';
import { fetchEspnMatchFeed } from '../lib/espnGoalEvents';
import { mapEspnMatchFeedToRecap } from '../lib/espnFeedMap';
import type { LandingLiveMatch } from '../landingEspnLive';

export type LandingMatchFeedState = ReturnType<typeof mapEspnMatchFeedToRecap>;

const EMPTY: LandingMatchFeedState = { teamStats: null, goals: [], cards: [], shootoutKicks: [] };

const POLL_LIVE_MS = 8_000;
const POLL_IDLE_MS = 30_000;

export function useLandingMatchFeed(match: LandingLiveMatch | null, isLive: boolean): LandingMatchFeedState {
  const [feed, setFeed] = useState<LandingMatchFeedState>(EMPTY);

  useEffect(() => {
    if (!match?.espnEventId) {
      setFeed(EMPTY);
      return;
    }

    let cancelled = false;
    let timer: number | null = null;

    const load = async () => {
      try {
        const raw = await fetchEspnMatchFeed(
          match.espnEventId,
          {
            pool: match.pool,
            teamHome: match.teamHome,
            teamAway: match.teamAway,
            scoreHome: match.scoreHome,
            scoreAway: match.scoreAway,
          },
          true,
        );
        if (!cancelled) setFeed(mapEspnMatchFeedToRecap(raw));
      } catch {
        /* keep previous */
      }
    };

    const tick = async () => {
      await load();
      if (!cancelled) timer = window.setTimeout(tick, isLive ? POLL_LIVE_MS : POLL_IDLE_MS);
    };

    tick();
    return () => {
      cancelled = true;
      if (timer != null) window.clearTimeout(timer);
    };
  }, [
    isLive,
    match?.espnEventId,
    match?.pool,
    match?.scoreAway,
    match?.scoreHome,
    match?.teamAway,
    match?.teamHome,
  ]);

  return feed;
}
