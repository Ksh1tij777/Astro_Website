'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './admin.css';

type FragmentMap = { first: boolean; second: boolean; third: boolean; fourth: boolean };

type AdminTeam = {
  teamCode: string;
  teamName: string;
  fragments: FragmentMap;
  coordinatesVerified: boolean;
  finished: boolean;
  finishedAt: number | null;
  lastActive: number | null;
  status: 'active' | 'finished' | 'expired';
  score: number;
  elapsedMinutes: number;
  timePenalty: number;
  hardCount: number;
  easyCount: number;
  hintPenalty: number;
  correctionsTotal: number;
  hints: { type: 'hard' | 'easy'; penalty: number; note: string | null; at: number }[];
  corrections: { adjustment: number; note: string; at: number }[];
};

type Standing = AdminTeam & { rank: number };

function fragmentCount(f: FragmentMap) {
  return Object.values(f).filter(Boolean).length;
}

function fmtTime(ms: number | null) {
  if (!ms) return '—';
  return new Date(ms).toLocaleTimeString();
}

function TeamCard({ team, onChanged }: { team: AdminTeam; onChanged: () => void }) {
  const [note, setNote] = useState('');
  const [showCorrection, setShowCorrection] = useState(false);
  const [correctionAmount, setCorrectionAmount] = useState('');
  const [correctionNote, setCorrectionNote] = useState('');
  const [busy, setBusy] = useState(false);

  const locked = team.status !== 'active';
  const discDone = fragmentCount(team.fragments) >= 4;

  const giveHint = async (type: 'hard' | 'easy') => {
    setBusy(true);
    try {
      await fetch('/api/admin/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamCode: team.teamCode, type, note: note.trim() || undefined }),
      });
      setNote('');
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  const submitCorrection = async () => {
    const adjustment = Number(correctionAmount);
    if (!Number.isFinite(adjustment) || adjustment === 0 || !correctionNote.trim()) return;
    setBusy(true);
    try {
      await fetch('/api/admin/correction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamCode: team.teamCode, adjustment, note: correctionNote.trim() }),
      });
      setCorrectionAmount('');
      setCorrectionNote('');
      setShowCorrection(false);
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card__top">
        <span className="admin-card__name">{team.teamName}</span>
        <span className={`admin-status admin-status--${team.status}`}>{team.status}</span>
      </div>
      <div className="admin-card__code">{team.teamCode}</div>
      <div className="admin-card__score">{team.score}</div>

      <div className="admin-progress">
        <span className={`admin-progress__stage${discDone ? ' done' : ''}`}>DISC {fragmentCount(team.fragments)}/4</span>
        <span className={`admin-progress__stage${discDone ? ' done' : ''}`}>STATION</span>
        <span className={`admin-progress__stage${team.coordinatesVerified ? ' done' : ''}`}>COORDS</span>
        <span className={`admin-progress__stage${team.finished ? ' done' : ''}`}>FINISH</span>
      </div>

      <div className="admin-breakdown">
        <span>
          Time: <b>{team.elapsedMinutes}m / 90m</b>
        </span>
        <span>
          Time penalty: <b>−{team.timePenalty}</b>
        </span>
        <span>
          Hints: <b>Hard ×{team.hardCount} Easy ×{team.easyCount}</b>
        </span>
        <span>
          Hint penalty: <b>−{team.hintPenalty}</b>
        </span>
        {team.correctionsTotal !== 0 && (
          <span>
            Corrections: <b>{team.correctionsTotal > 0 ? '+' : ''}{team.correctionsTotal}</b>
          </span>
        )}
        <span>
          Finished: <b>{fmtTime(team.finishedAt)}</b>
        </span>
      </div>

      <input
        className="admin-note-input"
        placeholder="Optional note for the next hint..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={locked || busy}
      />
      <div className="admin-hint-btns">
        <button type="button" className="admin-hint-btn" disabled={locked || busy} onClick={() => giveHint('hard')}>
          HARD HINT −5
        </button>
        <button type="button" className="admin-hint-btn" disabled={locked || busy} onClick={() => giveHint('easy')}>
          EASY HINT −15
        </button>
      </div>

      <button type="button" className="admin-correction-toggle" onClick={() => setShowCorrection((v) => !v)}>
        {showCorrection ? 'hide correction' : 'deliberate correction…'}
      </button>
      {showCorrection && (
        <div className="admin-correction-box">
          <input
            type="number"
            placeholder="Point adjustment (e.g. -10 or 5)"
            value={correctionAmount}
            onChange={(e) => setCorrectionAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Reason (required)"
            value={correctionNote}
            onChange={(e) => setCorrectionNote(e.target.value)}
          />
          <button type="button" onClick={submitCorrection} disabled={busy}>
            Apply correction
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [view, setView] = useState<'live' | 'standings'>('live');
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);

  const loadTeams = useCallback(async () => {
    const res = await fetch('/api/admin/teams');
    if (res.status === 401) {
      router.push('/admin/login');
      return;
    }
    const data = await res.json();
    setTeams(data.teams ?? []);
  }, [router]);

  const loadStandings = useCallback(async () => {
    const res = await fetch('/api/admin/standings');
    if (res.status === 401) {
      router.push('/admin/login');
      return;
    }
    const data = await res.json();
    setStandings(data.standings ?? []);
  }, [router]);

  useEffect(() => {
    loadTeams();
    loadStandings();
    const interval = setInterval(() => {
      loadTeams();
      loadStandings();
    }, 4000);
    return () => clearInterval(interval);
  }, [loadTeams, loadStandings]);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <span className="admin-title">Mission Control — Live Standings</span>
        <div className="admin-tabs">
          <button type="button" className={`admin-tab${view === 'live' ? ' active' : ''}`} onClick={() => setView('live')}>
            Live Competition
          </button>
          <button
            type="button"
            className={`admin-tab${view === 'standings' ? ' active' : ''}`}
            onClick={() => setView('standings')}
          >
            Final Standings
          </button>
        </div>
        <button type="button" className="admin-logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {view === 'live' &&
        (teams.length === 0 ? (
          <p className="admin-empty">No teams registered yet.</p>
        ) : (
          <div className="admin-grid">
            {teams.map((t) => (
              <TeamCard key={t.teamCode} team={t} onChanged={loadTeams} />
            ))}
          </div>
        ))}

      {view === 'standings' &&
        (standings.length === 0 ? (
          <p className="admin-empty">No teams have finished yet.</p>
        ) : (
          <table className="admin-standings-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Final Score</th>
                <th>Finish Time</th>
                <th>Elapsed</th>
                <th>Time Penalty</th>
                <th>Hard</th>
                <th>Easy</th>
                <th>Hint Penalty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s) => (
                <tr key={s.teamCode} className={`rank-${s.rank}`}>
                  <td>{s.rank}</td>
                  <td>{s.teamName}</td>
                  <td>{s.score}</td>
                  <td>{fmtTime(s.finishedAt)}</td>
                  <td>{s.elapsedMinutes}m</td>
                  <td>−{s.timePenalty}</td>
                  <td>{s.hardCount}</td>
                  <td>{s.easyCount}</td>
                  <td>−{s.hintPenalty}</td>
                  <td>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
    </div>
  );
}
