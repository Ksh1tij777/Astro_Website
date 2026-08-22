'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTeam } from '@/components/team/TeamContext';

export type Fragment = { id: string; slot: number; value: string };

// The four Golden Disc fragments, in the order they assemble.
export const FRAGMENTS: Fragment[] = [
  { id: 'first', slot: 1, value: 'rajharsh' },
  { id: 'second', slot: 2, value: '13564/' },
  { id: 'third', slot: 3, value: 'gaia' },
  { id: 'fourth', slot: 4, value: 'records' },
];

// Revealed once all four are collected — the listening-station (GitHub Pages) URL.
export const FINAL_URL = 'rajharsh13564.github.io/gaia_records';

const STORAGE_KEY = 'golden-disc-fragments';

type FragmentState = {
  collected: string[]; // fragment ids, in the order collected
  pulse: number; // increments ONLY on a genuine new collection (drives animation)
  last: Fragment | null; // the most recently collected fragment
  collect: (id: string) => void;
};

const FragmentCtx = createContext<FragmentState>({
  collected: [],
  pulse: 0,
  last: null,
  collect: () => {},
});

export const useFragments = () => useContext(FragmentCtx);

export function FragmentProvider({ children }: { children: React.ReactNode }) {
  const [collected, setCollected] = useState<string[]>([]);
  const [pulse, setPulse] = useState(0);
  const [last, setLast] = useState<Fragment | null>(null);
  const collectedRef = useRef<string[]>([]);
  const { team } = useTeam();
  const teamCodeRef = useRef<string | null>(null);
  teamCodeRef.current = team?.teamCode ?? null;

  // Restore progress (survives moving between / and /cli, and refreshes).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved)) {
        const valid = saved.filter((id) => FRAGMENTS.some((f) => f.id === id));
        collectedRef.current = valid;
        setCollected(valid);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Cryptic riddle hub for the four fragments — printed once to the console,
  // the classic place a curious solver goes looking.
  useEffect(() => {
    const head = 'color:#d0a060;font-size:14px;letter-spacing:2px;font-weight:bold';
    const dim = 'color:#8f8e96;font-size:12px;font-style:italic';
    // eslint-disable-next-line no-console
    console.log('%c⟟ INTERCEPTED TRANSMISSION — THE GOLDEN DISC (0/4)', head);
    // eslint-disable-next-line no-console
    console.log(
      '%cI · A lost wanderer drifts the edges of the void — greet it twice, and it lets a fragment go.\n' +
        "II · Among those who built this world, one maker's name still hums — strike it twice where the crew is credited.\n" +
        'III · The Record opened with hello. Say what Earth’s children said, on the channel where we listen.\n' +
        'IV · At the foot of everything, one door claims to lead home — but it doubles back instead.',
      dim,
    );
  }, []);

  const collect = useCallback((id: string) => {
    // Ignore unknown ids and ones already collected (so no re-animation).
    const frag = FRAGMENTS.find((f) => f.id === id);
    if (!frag || collectedRef.current.includes(id)) return;

    const next = [...collectedRef.current, id];
    collectedRef.current = next;
    setCollected(next);
    setLast(frag);
    setPulse((p) => p + 1);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }

    const teamCode = teamCodeRef.current;
    if (teamCode) {
      fetch('/api/team/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamCode, event: 'fragment', fragmentId: id }),
      }).catch(() => {
        /* fire-and-forget — the local disc HUD already reflects collection */
      });
    }
  }, []);

  return (
    <FragmentCtx.Provider value={{ collected, pulse, last, collect }}>
      {children}
    </FragmentCtx.Provider>
  );
}
