'use client';

import { useEffect, useRef, useState } from 'react';
import { useTeam } from './TeamContext';
import { CHALLENGE_MINUTES } from '@/lib/scoringConstants';
import './team-gate.css';

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Team-facing score/timer readout. SCORE and HINTS are only ever set from
 * the server's poll response — the local ticker below is purely cosmetic
 * (smooths the clock between polls) and is never fed back into any request.
 */
export default function TeamHUD() {
  const { team, refresh } = useTeam();
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const tickBaseRef = useRef({ seconds: 0, at: Date.now() });

  useEffect(() => {
    if (!team) return;
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  }, [team?.teamCode, refresh]);

  useEffect(() => {
    if (!team) return;
    tickBaseRef.current = { seconds: team.elapsedMinutes * 60, at: Date.now() };
    setDisplaySeconds(tickBaseRef.current.seconds);
  }, [team?.elapsedMinutes]);

  useEffect(() => {
    if (!team) return;
    const id = setInterval(() => {
      const elapsedSincePoll = Math.floor((Date.now() - tickBaseRef.current.at) / 1000);
      setDisplaySeconds(tickBaseRef.current.seconds + elapsedSincePoll);
    }, 1000);
    return () => clearInterval(id);
  }, [team]);

  if (!team) return null;

  return (
    <div className="team-hud" aria-hidden>
      <span className="team-hud__row">
        <span className="team-hud__label">SCORE</span>
        <span className="team-hud__value">{team.score}</span>
      </span>
      <span className="team-hud__row">
        <span className="team-hud__label">TIME</span>
        <span className="team-hud__value">
          {formatClock(displaySeconds)} / {String(CHALLENGE_MINUTES).padStart(2, '0')}:00
        </span>
      </span>
      <span className="team-hud__row">
        <span className="team-hud__label">HINTS</span>
        <span className="team-hud__value">{team.hintsUsed}</span>
      </span>
    </div>
  );
}
