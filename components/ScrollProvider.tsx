'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { sections } from '@/content/sections';

type ScrollState = {
  /** 0 → 1 through the whole document */
  percent: number;
  /** id of the section nearest the viewport centre */
  activeId: string;
};

const ScrollContext = createContext<ScrollState>({ percent: 0, activeId: sections[0].id });

/** Read the single shared scroll state. Used by Nav, CelestialGauge and SpaceBackground. */
export const useScroll = () => useContext(ScrollContext);

/**
 * Owns the ONE scroll listener for the whole app and exposes derived
 * scroll state via context, so no component re-derives it independently.
 */
export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ScrollState>({ percent: 0, activeId: sections[0].id });

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const denom = doc.scrollHeight - doc.clientHeight || 1;
      const percent = Math.min(1, Math.max(0, doc.scrollTop / denom));

      const mid = window.scrollY + window.innerHeight / 2;
      let activeId = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= mid) activeId = s.id;
      }

      setState((prev) =>
        prev.percent === percent && prev.activeId === activeId ? prev : { percent, activeId },
      );
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <ScrollContext.Provider value={state}>{children}</ScrollContext.Provider>;
}
