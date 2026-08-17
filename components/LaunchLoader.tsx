'use client';

import { useEffect, useState } from 'react';

type Stage = 'count' | 'launch' | 'gone';

/**
 * A short "mission control" intro shown once per browser session: a countdown,
 * then the rocket lifts off and the overlay clears to reveal the site.
 */
export default function LaunchLoader() {
  const [show, setShow] = useState(true);
  const [stage, setStage] = useState<Stage>('count');
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (sessionStorage.getItem('launched')) {
      setShow(false);
      return;
    }
    const timers = [
      window.setTimeout(() => setCount(2), 600),
      window.setTimeout(() => setCount(1), 1200),
      window.setTimeout(() => setCount(0), 1800), // 0 → "LIFTOFF"
      window.setTimeout(() => setStage('launch'), 1850),
      window.setTimeout(() => {
        setStage('gone');
        sessionStorage.setItem('launched', '1');
      }, 2700),
      window.setTimeout(() => setShow(false), 3300),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (!show) return null;

  return (
    <div className={`loader loader--${stage}`} aria-hidden>
      <div className="loader__scene">
        <svg className="loader__rocket" viewBox="0 0 40 72">
          <path d="M20 3 C10 16 8 36 12 52 L28 52 C32 36 30 16 20 3 Z" fill="#e6e6ee" />
          <circle cx="20" cy="26" r="3.6" fill="#0c0f0f" />
          <path d="M12 45 L4 60 L12 54 Z" fill="#9a9aa8" />
          <path d="M28 45 L36 60 L28 54 Z" fill="#9a9aa8" />
          <rect x="15" y="52" width="10" height="5" fill="#9a9aa8" />
        </svg>
        <span className="loader__flame" />
      </div>

      <div className="loader__readout">
        <span className="loader__brand">ASTRONOMY&nbsp;CLUB</span>
        <span className="loader__count">{count > 0 ? `T-00:0${count}` : 'LIFTOFF'}</span>
      </div>
    </div>
  );
}
