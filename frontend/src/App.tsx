import { useState, useEffect } from 'react';
import { getApiBase } from './api';
import { Logo } from './Logo';
import { Countdown } from './Countdown';
import { FacebookLink } from './FacebookLink';
import { submitStayUpdatedSignup } from './subscribeForm';
import {
  SubscriberCounter,
  fetchSubscriberCount,
  SUBSCRIBER_COUNT_FALLBACK,
} from './SubscriberCounter';
import {
  applySeo,
  DEFAULT_FLIPSNACK_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from './seo';
import './App.css';

/** Tournament opener — Mexico City opening ceremony, 11 June 2026, 11:30 local (FIFA). */
const OPENING_CEREMONY_AT = '2026-06-11T11:30:00-06:00';

function normalizeUrl(raw: string): string {
  return raw.trim().replace(/\/$/, '');
}

export default function App() {
  useEffect(() => {
    applySeo({ flipsnackUrl: DEFAULT_FLIPSNACK_URL });
  }, []);

  const [flipsnackUrl, setFlipsnackUrl] = useState(DEFAULT_FLIPSNACK_URL);

  useEffect(() => {
    let cancelled = false;
    const apiBase = getApiBase();
    const headers: Record<string, string> = {};
    if (apiBase.includes('loca.lt')) {
      headers['bypass-tunnel-reminder'] = '1';
    }
    fetch(`${apiBase}/api/flipsnack-url`, { headers })
      .then((res) => res.json())
      .then((data: { url?: string }) => {
        if (cancelled || !data.url || typeof data.url !== 'string') return;
        const url = normalizeUrl(data.url);
        setFlipsnackUrl(url);
        applySeo({ flipsnackUrl: url });
      })
      .catch(() => {
        /* keep default */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [subscriberCount, setSubscriberCount] = useState(SUBSCRIBER_COUNT_FALLBACK);

  useEffect(() => {
    let cancelled = false;

    const refresh = () => {
      fetchSubscriberCount().then((count) => {
        if (!cancelled && count !== null) {
          setSubscriberCount(count);
        }
      });
    };

    refresh();
    const interval = window.setInterval(refresh, 45000);

    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const form = e.currentTarget;
      const botcheck = form.botcheck instanceof HTMLInputElement ? form.botcheck.checked : false;
      const result = await submitStayUpdatedSignup(email, { botcheck });
      if (result.ok) {
        setStatus('success');
        setMessage(result.message);
        setEmail('');
        const latest = await fetchSubscriberCount();
        setSubscriberCount((prev) => latest ?? result.subscriberCount ?? prev + 1);
        return;
      }
      setStatus('error');
      setMessage(result.message);
    } catch (err) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Please try again later.';
      setMessage(msg === 'Failed to fetch' ? 'Network error — please try again.' : msg);
    }
  };

  return (
    <>
      <header className="nav nav--launch">
        <div className="nav-inner">
          <a href="/" className="logo" aria-label="The Blue Wave home">
            <Logo size="nav" />
          </a>
          <nav aria-label="Main navigation">
            <a
              href={flipsnackUrl}
              className="cta-nav cta-nav--launch"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the magazine
            </a>
            <a href="#stay-tuned">Stay Updated</a>
            <FacebookLink variant="nav" showLabel={false} />
          </nav>
        </div>
      </header>

      <main id="main-content">
      <section className="hero hero--launch" aria-labelledby="hero-heading">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-overlay">
          <div className="logo-hero">
            <Logo size="hero" />
          </div>
          <Countdown
            targetDateTime={OPENING_CEREMONY_AT}
            label="Countdown to the FIFA World Cup 2026 opening ceremony · Mexico City"
          />
          <p className="hero-eyebrow">World Cup Soccer Magazine</p>
          <h1 id="hero-heading" className="hero-heading">
            {SITE_TITLE}
          </h1>
          <span className="hero-live-badge" aria-label="Live now">
            LIVE NOW
          </span>
          <p className="hero-tagline hero-tagline--launch">
            {SITE_DESCRIPTION}
          </p>
          <div className="hero-ctas hero-ctas--launch">
            <a
              href={flipsnackUrl}
              className="btn btn-primary btn-flipsnack"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open the magazine — flip &amp; read →
            </a>
            <a href="#stay-tuned" className="btn btn-outline">
              Stay updated
            </a>
          </div>
          <p className="hero-flipsnack-hint">
            Free to read online · tap to flip through every page
          </p>
          <div className="hero-social">
            <FacebookLink variant="hero" />
          </div>
        </div>
      </section>

      <svg className="wave-divider" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path
          d="M0,64 C360,120 720,0 1080,64 C1260,96 1380,96 1440,64 L1440,120 L0,120 Z"
          fill="var(--off-white)"
        />
      </svg>

      <section className="section seo-about" aria-labelledby="about-heading">
        <div className="container">
          <h2 id="about-heading" className="seo-about__title">
            FIFA World Cup 2026 magazine from Curaçao
          </h2>
          <p className="seo-about__text">
            <strong>The Blue Wave</strong> is a free online flip magazine for FIFA World Cup 2026
            fans in Curaçao, the Caribbean, and beyond. Explore match previews, local fan culture,
            sports bars, and editorial stories — then subscribe for new issues and World Cup updates.
          </p>
        </div>
      </section>

      <section id="stay-tuned" className="section stay-tuned stay-tuned--solo" aria-labelledby="stay-tuned-heading">
        <div className="container">
          <div className="subscribe-box">
            <h2 id="stay-tuned-heading" className="stay-tuned-title">Stay Updated</h2>
            <p className="stay-tuned-lead">
              Subscribe and be the first to receive updates and exclusive content.
            </p>
            <SubscriberCounter count={subscriberCount} />
            <form onSubmit={handleSubmit} className="subscribe-form">
              <input
                type="checkbox"
                name="botcheck"
                id="botcheck"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ display: 'none' }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                disabled={status === 'loading'}
                required
              />
              <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Subscribing…' : 'Notify Me'}
              </button>
            </form>
            {message && (
              <p className={status === 'success' ? 'form-success' : 'form-error'}>{message}</p>
            )}
          </div>
        </div>
      </section>
      </main>

      <footer className="footer footer--minimal">
        <div className="container">
          <div className="footer-brand">
            <Logo size="footer" />
            <p>© Zebra Productions · FIFA World Cup 2026</p>
            <FacebookLink variant="footer" />
          </div>
        </div>
      </footer>
    </>
  );
}
