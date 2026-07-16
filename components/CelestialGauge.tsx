'use client';

import { sections } from '@/content/sections';
import { useScroll } from './ScrollProvider';

/** Right-edge altitude gauge: one tick per section, driven by shared scroll state. */
export default function CelestialGauge() {
  const { percent, activeId } = useScroll();

  return (
    <div className="gauge" aria-hidden>
      <div className="gauge__track">
        <div className="gauge__cursor" style={{ top: `${percent * 100}%` }} />
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
