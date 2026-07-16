'use client';

import { sections } from '@/content/sections';
import { useScroll } from './ScrollProvider';

export default function Nav() {
  const { activeId } = useScroll();

  return (
    <header className="nav">
      <nav className="nav__inner">
        <a href="#home" className="nav__logo">
          ASTRONOMY&nbsp;CLUB
        </a>

        {/* Links built from the single section list */}
        <div className="nav__links">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`navlink${activeId === s.id ? ' active' : ''}`}
            >
              {s.label}
            </a>
          ))}
        </div>

        <button type="button" className="btn-pill nav__cta">
          Join
        </button>
      </nav>
    </header>
  );
}
