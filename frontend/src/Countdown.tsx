import { useEffect, useState, type ReactNode } from 'react';

type Props = {
  /** Full ISO kickoff time (preferred). */
  targetDateTime?: string;
  /** Legacy: date only YYYY-MM-DD at local midnight. */
  targetDate?: string;
  label?: ReactNode;
  /** When true, render only the timer row (no outer block / label). */
  bare?: boolean;
};

function resolveTargetMs(targetDateTime?: string, targetDate?: string): number | null {
  if (targetDateTime) {
    const ms = Date.parse(targetDateTime);
    return Number.isFinite(ms) ? ms : null;
  }
  if (targetDate) {
    const ms = new Date(`${targetDate}T00:00:00`).getTime();
    return Number.isFinite(ms) ? ms : null;
  }
  return null;
}

export function Countdown({ targetDateTime, targetDate, label, bare }: Props) {
  const targetMs = resolveTargetMs(targetDateTime, targetDate);
  const [diff, setDiff] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    if (targetMs == null) {
      setDiff(null);
      return;
    }

    const tick = () => {
      const rem = Math.max(0, targetMs - Date.now());
      setDiff({
        d: Math.floor(rem / 86400000),
        h: Math.floor((rem % 86400000) / 3600000),
        m: Math.floor((rem % 3600000) / 60000),
        s: Math.floor((rem % 60000) / 1000),
      });
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  if (targetMs == null || !diff) return null;

  const countdown = (
    <div className="countdown">
      <div className="countdown-item">
        <span className="countdown-value">{diff.d}</span>
        <span className="countdown-label">days</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{String(diff.h).padStart(2, '0')}</span>
        <span className="countdown-label">hrs</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{String(diff.m).padStart(2, '0')}</span>
        <span className="countdown-label">min</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{String(diff.s).padStart(2, '0')}</span>
        <span className="countdown-label">sec</span>
      </div>
    </div>
  );

  if (bare || !label) return countdown;

  return (
    <div className="countdown-block">
      <p className="countdown-label-top">{label}</p>
      {countdown}
    </div>
  );
}
