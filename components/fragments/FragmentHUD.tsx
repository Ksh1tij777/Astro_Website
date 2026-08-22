'use client';

import { useEffect, useState } from 'react';
import { FINAL_URL, FRAGMENTS, Fragment, useFragments } from './FragmentContext';

// true  = the 0/4 counter is always visible (good for testing / a teaser)
// false = counter stays hidden until the first fragment is found (secret hunt)
const ALWAYS_SHOW_COUNTER = true;

export default function FragmentHUD() {
  const { collected, pulse, last } = useFragments();
  const [burst, setBurst] = useState<Fragment | null>(null);
  const [takeover, setTakeover] = useState(false);

  const total = FRAGMENTS.length;
  const count = collected.length;
  const complete = count >= total;

  // Animate only on a genuine new collection (pulse changes), never on reload.
  useEffect(() => {
    if (pulse === 0) return;
    setBurst(last);
    const t1 = setTimeout(() => setBurst(null), 2000);
    let t2: ReturnType<typeof setTimeout> | undefined;
    if (collected.length >= total) {
      t2 = setTimeout(() => setTakeover(true), 1700);
    }
    return () => {
      clearTimeout(t1);
      if (t2) clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pulse]);

  // Keep the counter hidden until the first fragment is found (unless testing).
  if (count === 0 && !takeover && !ALWAYS_SHOW_COUNTER) return null;

  return (
    <>
      {/* Top-left live counter */}
      <div className="disc-hud" aria-hidden>
        <div
          className="disc-hud__disc"
          style={{ ['--pct' as string]: `${(count / total) * 100}%` }}
        >
          <span className="disc-hud__hole" />
        </div>
        <div className="disc-hud__meta">
          <span className="disc-hud__label">GOLDEN DISC</span>
          <span className="disc-hud__count">
            {count}/{total} FRAGMENTS
          </span>
        </div>
      </div>

      {/* Top-center: the signal-origin link assembling as you collect */}
      <div className="disc-link" aria-hidden>
        <span className="disc-link__tag">SIGNAL ORIGIN</span>
        <span className="disc-link__code">
          {FRAGMENTS.map((f) => (
            <span
              key={f.id}
              className={`disc-link__seg${collected.includes(f.id) ? ' is-on' : ''}`}
            >
              {collected.includes(f.id) ? f.value : '░░░░'}
            </span>
          ))}
        </span>
      </div>

      {/* Center burst when a fragment is acquired */}
      {burst && (
        <div className="disc-burst" aria-hidden key={pulse}>
          <div className="disc-burst__piece" />
          <div className="disc-burst__text">
            <span className="disc-burst__title">FRAGMENT ACQUIRED</span>
            <span className="disc-burst__value">{burst.value}</span>
          </div>
        </div>
      )}

      {/* Full-screen suspenseful takeover once all four are gathered */}
      {takeover && (
        <div className="disc-takeover" role="dialog" aria-modal="true">
          <div className="disc-takeover__scan" />
          <div className="disc-takeover__inner">
            <div className="disc-takeover__disc" />
            <p className="disc-takeover__l1">GOLDEN RECORD REASSEMBLED</p>
            <p className="disc-takeover__l2">SIGNAL ORIGIN LOCATED</p>
            <p className="disc-takeover__url">{FINAL_URL}</p>
            <p className="disc-takeover__open">⟟ THE TRANSMISSION IS NOW OPEN — BEGIN THE VOYAGE</p>
            <button type="button" className="disc-takeover__close" onClick={() => setTakeover(false)}>
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
