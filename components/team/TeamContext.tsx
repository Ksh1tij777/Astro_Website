'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const SESSION_KEY = 'team-session';

export type TeamStatus = 'active' | 'finished' | 'expired';

export type TeamFragments = { first: boolean; second: boolean; third: boolean; fourth: boolean };

// Everything here comes straight from the server response. It is never
// locally computed and written back — the server is the sole authority for
// score, status, and every timestamp. See the plan's "Server as the
// absolute scoring authority" section.
export type TeamState = {
  teamCode: string;
  teamName: string;
  fragments: TeamFragments;
  coordinatesVerified: boolean;
  finished: boolean;
  finishedAt: number | null;
  status: TeamStatus;
  score: number;
  elapsedMinutes: number;
  timePenalty: number;
  hintPenalty: number;
  hintsUsed: number;
};

type StoredSession = { teamCode: string; teamName: string };

type LoginResult = { ok: true; freshCode?: string } | { ok: false; error: string };

type TeamContextValue = {
  team: TeamState | null;
  loading: boolean;
  login: (teamName: string, teamCode?: string) => Promise<LoginResult>;
  refresh: () => Promise<void>;
};

const TeamCtx = createContext<TeamContextValue>({
  team: null,
  loading: true,
  login: async () => ({ ok: false, error: 'not ready' }),
  refresh: async () => {},
});

export const useTeam = () => useContext(TeamCtx);

function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.teamCode === 'string' && typeof parsed.teamName === 'string') return parsed;
    return null;
  } catch {
    return null;
  }
}

function writeSession(session: StoredSession) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [team, setTeam] = useState<TeamState | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const session = readSession();
    if (!session) {
      setTeam(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/team/state?teamCode=${encodeURIComponent(session.teamCode)}`);
      if (!res.ok) {
        clearSession();
        setTeam(null);
        return;
      }
      const data = (await res.json()) as TeamState;
      setTeam(data);
    } catch {
      /* transient network error — keep the last known state */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (teamName: string, teamCode?: string): Promise<LoginResult> => {
    try {
      const res = await fetch('/api/team/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName, teamCode: teamCode || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error ?? 'Login failed.' };
      }
      const state = data as TeamState;
      writeSession({ teamCode: state.teamCode, teamName: state.teamName });
      setTeam(state);
      return { ok: true, freshCode: teamCode ? undefined : state.teamCode };
    } catch {
      return { ok: false, error: 'Could not reach the server. Try again.' };
    }
  }, []);

  return <TeamCtx.Provider value={{ team, loading, login, refresh }}>{children}</TeamCtx.Provider>;
}
