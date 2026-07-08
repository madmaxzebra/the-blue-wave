import { THE_BLUE_WAVE_APP_URL } from './appLinks';

export function LandingAppPromo() {
  return (
    <section className="landing-app-promo" aria-labelledby="landing-app-promo-heading">
      <h2 id="landing-app-promo-heading" className="landing-app-promo__title">
        The Blue Wave app.
        <span className="landing-app-promo__title-line">Your pocket World Cup stadium</span>
      </h2>
      <p className="landing-app-promo__subtitle">
        The World Cup, the Blue Wave, and you — one tap away. Free. Always.
      </p>

      <div className="landing-app-promo__stack">
        <img
          src="/thebluewave-app-screens.png"
          alt="The Blue Wave app on iPhone — Live scores, Pool E, and the magazine"
          className="landing-app-promo__img"
          loading="lazy"
          decoding="async"
          width={1200}
          height={675}
        />

        <div className="landing-app-promo__copy">
          <p>
            The Blue Wave mobile app keeps the World Cup 2026 and The Blue Wave Magazine in your pocket:
            thumb-friendly reading, plus real-time news updates and live score messages and alerts delivered
            through push technology.
          </p>
          <p>
            The Blue Wave app will soon be available as a free download on the Apple App Store and Google
            Play. It is currently going through Apple and Google&apos;s approval process.
          </p>
          <p>Get The Blue Wave app — download on Android or open in your browser:</p>
          <p className="landing-app-promo__cta-wrap">
            <a href={THE_BLUE_WAVE_APP_URL} className="nav-link-app landing-app-promo__app-link">
              <img
                src="/bluewavelogo_small.png"
                alt=""
                className="nav-link-app__icon"
                width={22}
                height={22}
                decoding="async"
              />
              <span>The Blue Wave App</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
