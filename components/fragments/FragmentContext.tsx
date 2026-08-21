'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export type Fragment = { id: string; slot: number; value: string };

// The four Golden Disc fragments, in the order they assemble.
export const FRAGMENTS: Fragment[] = [
  { id: 'first', slot: 1, value: 'rajharsh' },
  { id: 'second', slot: 2, value: '13564/' },
  { id: 'third', slot: 3, value: 'gaia' },
  { id: 'fourth', slot: 4, value: 'records' },
];

// Revealed once all four are collected. Set this to the real destination.
export const FINAL_URL = 'github.com/rajharsh/gaia-records';

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
  }, []);

  return (
    <FragmentCtx.Provider value={{ collected, pulse, last, collect }}>
      {children}
    </FragmentCtx.Provider>
  );
}
