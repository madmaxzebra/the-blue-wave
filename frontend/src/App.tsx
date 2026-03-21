import { useState, useEffect } from 'react';
import { Countdown } from './Countdown';
import { getApiBase } from './api';

import { Logo } from './Logo';
import { CommunityFeed } from './CommunityFeed';
import { ShareRaffle } from './ShareRaffle';
import { getApiBase } from './api';
import './App.css';

const SITE_TITLE = 'The Blue Wave | FIFA World Cup 2026';
const SITE_DESCRIPTION = 'Something special is on the horizon. A transformative initiative bringing excitement and innovation to Curaçao.';

function setShareMeta() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const origin = window.location.origin;
  const url = window.location.href;
  const imageUrl = `${origin}/logo.png`;
  const meta: Array<[string, string, string]> = [
    ['og:image', imageUrl, 'property'],
    ['og:url', url, 'property'],
    ['og:title', SITE_TITLE, 'property'],
    ['og:description', SITE_DESCRIPTION, 'property'],
    ['og:type', 'website', 'property'],
    ['twitter:card', 'summary_large_image', 'name'],
    ['twitter:image', imageUrl, 'name'],
    ['twitter:title', SITE_TITLE, 'name'],
    ['twitter:description', SITE_DESCRIPTION, 'name'],
  ];
  meta.forEach(([key, content, attr]) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  });
}

export default function App() {
  useEffect(() => { setShareMeta(); }, []);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const apiBase = getApiBase();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (apiBase.includes('loca.lt')) {
        headers['bypass-tunnel-reminder'] = '1'; // LocalTunnel: skip password page for API calls
      }
      const res = await fetch(`${apiBase}/api/subscribe`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: email.trim(),
          origin: typeof window !== 'undefined' ? window.location.origin : undefined,
        }),
      });
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(text || 'Request failed');
      }
      if (res.ok) {
        setStatus('success');
        setMessage('Thanks! Check your inbox for the confirmation.');
        setEmail('');
        return;
      }
      if (res.status === 409 || (data.error && /already|ingeschreven|subscribed/i.test(data.error))) {
        setStatus('success');
        setMessage('Thanks! We’ll send the confirmation email shortly.');
        setEmail('');
        return;
      }
      throw new Error(data.error || 'Something went wrong');
    } catch (err) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Please try again later.';
      setMessage(msg === 'Failed to fetch' ? 'Connection error. Check the tunnel is running and try again.' : msg);
    }
  };

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <a href="#" className="logo">
            <Logo size="nav" />
          </a>
          <nav>
            <a href="#about">About</a>
            <a href="#why">Why</a>
            <a href="#community">Community</a>
            <a href="#share-raffle">Share & Win</a>
            <a href="#stay-tuned">Stay Updated</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay">
          <div className="logo-hero">
            <Logo size="hero" />
          </div>
          <p className="hero-tagline">
            Something special is on the horizon.<br />
            A transformative initiative bringing excitement and innovation to Curaçao.
          </p>
          <Countdown targetDate="2026-05-15" />
          <div className="hero-ctas">
            <a href="#stay-tuned" className="btn btn-primary">
              Get Notified →
            </a>
            <a href="#about" className="btn btn-outline">
              Learn More
            </a>
          </div>
        </div>
      </section>

      <svg className="wave-divider" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,64 C360,120 720,0 1080,64 C1260,96 1380,96 1440,64 L1440,120 L0,120 Z" fill="var(--off-white)" />
      </svg>

      <div className="main-layout">
        <div className="main-content">
      <section id="about" className="section about">
        <div className="container">
          <h2>Our Vision</h2>
          <p className="lead">
            The Blue Wave brings innovation, culture and energy together. Discover our perspective on the FIFA World Cup 2026 story.
          </p>
          <div className="cards">
            <div className="card">
              <span className="card-icon">🚀</span>
              <h3>Innovation</h3>
              <p>Modern approach, sharp content, ready for the future.</p>
            </div>
            <div className="card">
              <span className="card-icon">🏝️</span>
              <h3>Culture</h3>
              <p>Curaçao's identity and passion for football.</p>
            </div>
            <div className="card">
              <span className="card-icon">⚡</span>
              <h3>Energy</h3>
              <p>The dynamism of The Blue Wave in action.</p>
            </div>
          </div>
        </div>
      </section>

      <svg className="wave-divider wave-invert" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,64 C360,0 720,120 1080,64 C1260,32 1380,32 1440,64 L1440,0 L0,0 Z" fill="var(--blue)" opacity="0.05" />
      </svg>

      <section id="why" className="section why">
        <div className="container">
          <h2>Why The Blue Wave?</h2>
          <div className="reasons">
            <div className="reason">
              <span className="reason-icon">🌊</span>
              <h3>Unique Content</h3>
              <p>Exclusive stories, interviews and behind-the-scenes from the World Cup journey.</p>
            </div>
            <div className="reason">
              <span className="reason-icon">🎯</span>
              <h3>Direct Access</h3>
              <p>One place for all updates on the magazine and FIFA World Cup 2026.</p>
            </div>
            <div className="reason">
              <span className="reason-icon">🤝</span>
              <h3>Community</h3>
              <p>Join supporters and fans of The Blue Wave.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="stay-tuned" className="section stay-tuned">
        <div className="container">
          <div className="subscribe-box">
            <h2 className="stay-tuned-title">Stay Updated</h2>
            <p className="stay-tuned-lead">Subscribe and be the first to receive updates and exclusive content.</p>
            <form onSubmit={handleSubmit} className="subscribe-form">
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
        </div>

        <aside className="right-sidebar">
          <section id="community" className="section section-sidebar community">
            <h2>Community</h2>
            <p className="lead">Share your thoughts, photos, and connect with fellow supporters.</p>
            <div className="community-feed-scroll">
              <CommunityFeed />
            </div>
          </section>
          <section id="share-raffle" className="section section-sidebar share-raffle-section">
            <h2>Share & Win</h2>
            <p className="lead">Share The Blue Wave and enter our raffle for exclusive prizes.</p>
            <ShareRaffle />
          </section>
        </aside>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-brand">
            <Logo size="footer" />
            <p>© Zebra Productions · FIFA World Cup 2026</p>
          </div>
          <nav className="footer-nav">
            <a href="#about">About</a>
            <a href="#why">Why</a>
            <a href="#community">Community</a>
            <a href="#share-raffle">Share & Win</a>
            <a href="#stay-tuned">Stay Updated</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
