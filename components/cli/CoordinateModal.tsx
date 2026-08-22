'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTeam } from '@/components/team/TeamContext';
import './cli.css';

interface CoordinateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CoordinateModal({ isOpen, onClose }: CoordinateModalProps) {
  const router = useRouter();
  const { team, refresh } = useTeam();
  const [raInput, setRaInput] = useState('');
  const [decInput, setDecInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRaInput('');
      setDecInput('');
      setErrorMsg('');
      setSuccessMsg('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    // The answer is verified on the server (app/api/verify-coordinates) so it
    // is never exposed in the browser. Formatting (spaces/case/symbols) and
    // small rounding of the lat/long are tolerated there.
    try {
      const res = await fetch('/api/verify-coordinates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ra: raInput, dec: decInput, teamCode: team?.teamCode }),
      });
      const data = await res.json();

      if (data.ok) {
        setSuccessMsg('COORDINATES LOCKED. QUANTUM ALIGNMENT ESTABLISHED.');
        refresh();
        setTimeout(() => {
          onClose();
          router.push('/cli');
        }, 1200);
      } else {
        setIsSubmitting(false);
        setErrorMsg('ACCESS DENIED: coordinates not recognized. Retrying quantum alignment...');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMsg('LINK FAILURE: could not reach the gateway. Try again.');
    }
  };

  return (
    <div className="coord-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="coord-modal" onClick={(e) => e.stopPropagation()}>
        <div className="coord-modal__header">
          <div className="coord-modal__header-center">
            <div className="coord-modal__badge">
              <span className="coord-modal__pulse" />
              YGGDRASIL SECURE GATEWAY
            </div>
            {/* Custom Message requested by user */}
            <h3 className="coord-modal__title">Enter the World Tree's Coordinates</h3>
          </div>
          <button type="button" className="coord-modal__close" onClick={onClose} aria-label="Close modal">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="coord-modal__body">
          <p className="coord-modal__desc">
            Provide the dual astronomical vector passwords to authorize warp trajectory and establish link to the core CLI terminal.
          </p>

          <form onSubmit={handleSubmit} className="coord-modal__form">
            <div className="coord-field">
              <label htmlFor="ra-input" className="coord-field__label">
                <span>Right Ascension (RA)</span>
              </label>
              <div className="coord-field__input-wrap">
                <span className="coord-field__prefix">RA :</span>
                <input
                  id="ra-input"
                  type="text"
                  className="coord-field__input"
                  placeholder="Enter RA vector"
                  value={raInput}
                  onChange={(e) => setRaInput(e.target.value)}
                  disabled={isSubmitting || !!successMsg}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="coord-field">
              <label htmlFor="dec-input" className="coord-field__label">
                <span>Declination (Dec)</span>
              </label>
              <div className="coord-field__input-wrap">
                <span className="coord-field__prefix">Dec :</span>
                <input
                  id="dec-input"
                  type="text"
                  className="coord-field__input"
                  placeholder="Enter Dec vector"
                  value={decInput}
                  onChange={(e) => setDecInput(e.target.value)}
                  disabled={isSubmitting || !!successMsg}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <div className="coord-modal__error">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>warning</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="coord-modal__success">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
                <span>{successMsg}</span>
              </div>
            )}

            <div className="coord-modal__actions">
              <button
                type="button"
                className="coord-btn coord-btn--secondary"
                onClick={onClose}
                disabled={isSubmitting || !!successMsg}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="coord-btn coord-btn--primary"
                disabled={isSubmitting || !!successMsg || !raInput || !decInput}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite', fontSize: 16 }}>
                      sync
                    </span>
                    Verifying...
                  </>
                ) : (
                  <>
                    Commence Voyage
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
