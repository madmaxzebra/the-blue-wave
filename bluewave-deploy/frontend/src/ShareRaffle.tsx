import { useState, useMemo } from 'react';
import { getApiBase } from './api';

const SITE_TITLE = 'The Blue Wave – FIFA World Cup 2026';

function useShareLinks() {
  return useMemo(() => {
    const siteUrl = typeof window !== 'undefined' ? window.location.href : '';
    return [
      { name: 'Twitter', icon: '𝕏', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SITE_TITLE)}&url=${encodeURIComponent(siteUrl)}` },
      { name: 'Facebook', icon: 'f', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}` },
      { name: 'LinkedIn', icon: 'in', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}` },
      { name: 'WhatsApp', icon: 'WA', url: `https://wa.me/?text=${encodeURIComponent(SITE_TITLE + ' ' + siteUrl)}` },
    ];
  }, []);
}

export function ShareRaffle() {
  const shareLinks = useShareLinks();
  const [email, setEmail] = useState('');
  const [sharedOn, setSharedOn] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const r = await fetch(`${getApiBase()}/api/raffle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), sharedOn: sharedOn || undefined }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Failed to enter');
      setStatus('success');
      setMessage("You're in the raffle! Good luck 🎉");
      setEmail('');
      setSharedOn('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className="share-raffle">
      <div className="share-buttons">
        {shareLinks.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn share-btn-icon-only"
            onClick={() => setSharedOn(s.name)}
            title={`Share on ${s.name}`}
            aria-label={`Share on ${s.name}`}
          >
            <span className="share-btn-icon">{s.icon}</span>
          </a>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="raffle-form">
        <input
          type="email"
          placeholder="Your email to enter the raffle"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading'}
          className="raffle-email-input"
        />
        <button type="submit" disabled={status === 'loading'} className="btn btn-primary">
          {status === 'loading' ? 'Entering…' : 'Enter raffle'}
        </button>
      </form>
      {sharedOn && (
        <p className="raffle-hint">You selected: {sharedOn}. Enter your email above to complete your entry.</p>
      )}
      {message && (
        <p className={status === 'success' ? 'form-success' : 'form-error'}>{message}</p>
      )}
    </div>
  );
}
