'use client';

import { sections } from '@/content/sections';
import { useScroll } from './ScrollProvider';

/** Right-edge altitude gauge: one tick per section, driven by shared scroll state. */
export default function CelestialGauge() {
  const { percent, activeId } = useScroll();

  return (
    <div className="gauge" aria-hidden>
      <div className="gauge__track">
        <div className="gauge__cursor" style={{ top: `${percent * 100}%` }}>
          <svg className="gauge__rocket" viewBox="0 0 20 34" aria-hidden>
            {/* exhaust trail (points up, opposite the downward travel) */}
            <path className="gauge__flame" d="M10 0 L10 6" />
            {/* body — nose points down */}
            <path
              d="M10 5 C5 9 4 16 6 22 C7 25 8.4 26.5 10 28.5 C11.6 26.5 13 25 14 22 C16 16 15 9 10 5 Z"
              fill="#e6e6ee"
            />
            {/* fins */}
            <path d="M6 20 L2.6 26 L6.6 24 Z" fill="#9a9aa8" />
            <path d="M14 20 L17.4 26 L13.4 24 Z" fill="#9a9aa8" />
            {/* window */}
            <circle cx="10" cy="14" r="2" fill="#0c0f0f" />
          </svg>
        </div>
        {sections.map((s, i) => (
          <div
            key={s.id}
            className={`gauge__tick${activeId === s.id ? ' active' : ''}`}
            style={{ top: `${(i / (sections.length - 1)) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
