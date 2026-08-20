'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { sections } from '@/content/sections';
import { useScroll } from './ScrollProvider';

export default function Nav() {
  const { activeId } = useScroll();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const getHref = (id: string) => {
    return pathname === '/cli' ? `/#${id}` : `#${id}`;
  };

  return (
    <header className="nav">
      <nav className="nav__inner">
        <a href={pathname === '/cli' ? '/' : '#home'} className="nav__logo" onClick={close}>
          ASTRONOMY&nbsp;CLUB
        </a>

        {/* Section links — inline on desktop, a dropdown on mobile */}
        <div className={`nav__links${open ? ' is-open' : ''}`}>
          {sections.map((s) => (
            <a
              key={s.id}
              href={getHref(s.id)}
              className={`navlink${pathname !== '/cli' && activeId === s.id ? ' active' : ''}`}
              onClick={close}
            >
              {s.label}
            </a>
          ))}
          {pathname === '/cli' && (
            <a href="/cli" className="navlink active" onClick={close}>
              CLI
            </a>
          )}
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

