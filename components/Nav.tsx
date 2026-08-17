'use client';

import { useState } from 'react';
import { sections } from '@/content/sections';
import { useScroll } from './ScrollProvider';

export default function Nav() {
  const { activeId } = useScroll();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="nav">
      <nav className="nav__inner">
        <a href="#home" className="nav__logo" onClick={close}>
          ASTRONOMY&nbsp;CLUB
        </a>

        {/* Section links — inline on desktop, a dropdown on mobile */}
        <div className={`nav__links${open ? ' is-open' : ''}`}>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`navlink${activeId === s.id ? ' active' : ''}`}
              onClick={close}
            >
              {s.label}
            </a>
          ))}
        </div>

        <div className="nav__actions">
          <a
            href="https://forms.gle/ateF5jHtf3He5Lh39"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button type="button" className="btn-pill nav__cta">
              Join
            </button>
          </a>

          <button
            type="button"
            className={`nav__burger${open ? ' is-open' : ''}`}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  );
}
