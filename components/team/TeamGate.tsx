'use client';

import { useState } from 'react';
import { useTeam } from './TeamContext';
import '../cli/cli.css';
import './team-gate.css';

export default function TeamGate() {
  const { team, loading, login } = useTeam();
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [revealedCode, setRevealedCode] = useState<string | null>(null);

  if (loading || team) return null;
  if (revealedCode) {
    return (
      <div className="team-gate-backdrop" role="dialog" aria-modal="true">
        <div className="coord-modal">
          <div className="coord-modal__header">
            <div className="coord-modal__header-center">
              <div className="coord-modal__badge">
                <span className="coord-modal__pulse" />
                TEAM REGISTERED
              </div>
              <h3 className="coord-modal__title">Save Your Team Code</h3>
            </div>
          </div>
          <div className="coord-modal__body">
            <div className="team-gate__code-reveal">
              <span className="team-gate__code-label">Your team code</span>
              <span className="team-gate__code-value">{revealedCode}</span>
              <p className="team-gate__code-note">
                Write this down. You&apos;ll need your <strong>team name</strong> and this{' '}
                <strong>code</strong> together to resume on another device.
              </p>
            </div>
            <div className="coord-modal__actions">
              <button type="button" className="coord-btn coord-btn--primary" onClick={() => setRevealedCode(null)}>
                Begin the Voyage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!teamName.trim()) {
      setError('Enter a team name.');
      return;
    }
    setSubmitting(true);
    const result = await login(teamName, teamCode.trim() || undefined);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (result.freshCode) {
      setRevealedCode(result.freshCode);
    }
  };

  return (
    <div className="team-gate-backdrop" role="dialog" aria-modal="true">
      <div className="coord-modal">
        <div className="coord-modal__header">
          <div className="coord-modal__header-center">
            <div className="coord-modal__badge">
              <span className="coord-modal__pulse" />
              YGGDRASIL SECURE GATEWAY
            </div>
            <h3 className="coord-modal__title">Identify Your Crew</h3>
          </div>
        </div>

        <div className="coord-modal__body">
          <p className="coord-modal__desc">
            Register a team name to begin the voyage, or return with your team name and code if you&apos;ve already
            started.
          </p>

          <form onSubmit={handleSubmit} className="coord-modal__form">
            <div className="coord-field">
              <label htmlFor="team-name-input" className="coord-field__label">
                <span>Team Name</span>
              </label>
              <div className="coord-field__input-wrap">
                <input
                  id="team-name-input"
                  type="text"
                  className="coord-field__input"
                  placeholder="Enter your team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  disabled={submitting}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="coord-field">
              <label htmlFor="team-code-input" className="coord-field__label">
                <span>Team Code</span>
              </label>
              <div className="coord-field__input-wrap">
                <input
                  id="team-code-input"
                  type="text"
                  className="coord-field__input"
                  placeholder="Leave blank if this is a new team"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value)}
                  disabled={submitting}
                  autoComplete="off"
                />
              </div>
            </div>

            {error && (
              <div className="coord-modal__error">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  warning
                </span>
                <span>{error}</span>
              </div>
            )}

            <div className="coord-modal__actions">
              <button type="submit" className="coord-btn coord-btn--primary" disabled={submitting || !teamName.trim()}>
                {submitting ? 'Contacting Mission Control...' : 'Enter the Voyage'}
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  arrow_forward
                </span>
              </button>
            </div>
          </form>

          <p className="team-gate__hint">
            ⟟ New crews: leave the code blank — one will be issued to you. Returning crews: enter the exact name and
            code from registration.
          </p>
        </div>
      </div>
    </div>
  );
}
