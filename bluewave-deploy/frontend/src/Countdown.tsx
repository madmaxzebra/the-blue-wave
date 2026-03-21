import { useEffect, useState } from 'react';

interface Props {
  targetDate: string; // YYYY-MM-DD
}

export function Countdown({ targetDate }: Props) {
  const [diff, setDiff] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const target = new Date(targetDate + 'T00:00:00').getTime();
    const tick = () => {
      const now = Date.now();
      const rem = Math.max(0, target - now);
      setDiff({
        d: Math.floor(rem / 86400000),
        h: Math.floor((rem % 86400000) / 3600000),
        m: Math.floor((rem % 3600000) / 60000),
        s: Math.floor((rem % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!diff) return null;

  return (
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
}
