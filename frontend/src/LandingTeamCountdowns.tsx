import { useEffect, useState } from 'react';
import { Countdown } from './Countdown';
import {
  CURACAO_FIXTURES,
  NETHERLANDS_FIXTURES,
  fixtureIsLive,
  fixtureLabel,
  formatFixtureKickoff,
  formatFixtureVenue,
  nextFixtureForTeam,
  type LandingFixture,
} from './landingTeamMatches';
import { teamFlagImgSrc } from './teamFlags';

const TEAM_ROWS = [
  { team: 'Curaçao', fixtures: CURACAO_FIXTURES },
  { team: 'Netherlands', fixtures: NETHERLANDS_FIXTURES },
] as const;

function SideFlag({ team }: { team: string }) {
  const src = teamFlagImgSrc(team, 80);
  if (!src) return <span className="countdown-side-flag countdown-side-flag--empty" aria-hidden="true" />;
  return (
    <img
      className="countdown-side-flag"
      src={src}
      alt=""
      width={72}
      height={54}
      decoding="async"
    />
  );
}

function MatchCountdownBlock({ fixture, focusTeam }: { fixture: LandingFixture; focusTeam: string }) {
  const matchLine = fixtureLabel(fixture, focusTeam);
  const kickoffLine = formatFixtureKickoff(fixture.startTime);
  const venueLine = formatFixtureVenue(fixture);

  return (
    <div className="countdown-block">
      <p className="countdown-group">Group {fixture.pool}</p>
      <p className="countdown-match-title">{matchLine}</p>

      <div className="countdown-with-flags">
        <SideFlag team={fixture.teamHome} />
        <Countdown targetDateTime={fixture.startTime} bare />
        <SideFlag team={fixture.teamAway} />
      </div>

      <p className="countdown-datetime">{kickoffLine}</p>
      <p className="countdown-venue">{venueLine}</p>
    </div>
  );
}

function MatchLiveBlock({ fixture, focusTeam }: { fixture: LandingFixture; focusTeam: string }) {
  const matchLine = fixtureLabel(fixture, focusTeam);
  const kickoffLine = formatFixtureKickoff(fixture.startTime);
  const venueLine = formatFixtureVenue(fixture);

  return (
    <div className="countdown-block countdown-block--live">
      <p className="countdown-group">Group {fixture.pool}</p>
      <p className="countdown-match-title">{matchLine}</p>

      <div className="countdown-with-flags countdown-with-flags--live">
        <SideFlag team={fixture.teamHome} />
        <p className="countdown-live-now" aria-live="polite">
          Live now
        </p>
        <SideFlag team={fixture.teamAway} />
      </div>

      <p className="countdown-datetime">{kickoffLine}</p>
      <p className="countdown-venue">{venueLine}</p>
    </div>
  );
}

function TeamRow({ team, fixtures }: (typeof TEAM_ROWS)[number]) {
  const [fixture, setFixture] = useState<LandingFixture | null>(() => nextFixtureForTeam(team, fixtures));
  const [live, setLive] = useState(() => {
    const f = nextFixtureForTeam(team, fixtures);
    return f ? fixtureIsLive(f) : false;
  });

  useEffect(() => {
    const refresh = () => {
      const next = nextFixtureForTeam(team, fixtures);
      setFixture(next);
      setLive(next ? fixtureIsLive(next) : false);
    };
    refresh();
    const id = window.setInterval(refresh, 30_000);
    return () => window.clearInterval(id);
  }, [team, fixtures]);

  if (!fixture) return null;

  if (live) {
    return <MatchLiveBlock fixture={fixture} focusTeam={team} />;
  }

  return <MatchCountdownBlock fixture={fixture} focusTeam={team} />;
}

export function LandingTeamCountdowns() {
  return (
    <div className="hero-team-countdowns" aria-label="Next kickoffs">
      {TEAM_ROWS.map((row) => (
        <TeamRow key={row.team} {...row} />
      ))}
    </div>
  );
}
