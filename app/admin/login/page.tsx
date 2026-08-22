'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../../components/cli/cli.css';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Login failed.');
        setSubmitting(false);
        return;
      }
      router.push('/admin');
    } catch {
      setError('Could not reach the server.');
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-backdrop">
      <div className="coord-modal">
        <div className="coord-modal__header">
          <div className="coord-modal__header-center">
            <div className="coord-modal__badge">
              <span className="coord-modal__pulse" />
              MISSION CONTROL
            </div>
            <h3 className="coord-modal__title">Admin Access</h3>
          </div>
        </div>
        <div className="coord-modal__body">
          <form onSubmit={handleSubmit} className="coord-modal__form">
            <div className="coord-field">
              <label htmlFor="admin-password" className="coord-field__label">
                <span>Password</span>
              </label>
              <div className="coord-field__input-wrap">
                <input
                  id="admin-password"
                  type="password"
                  className="coord-field__input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  autoComplete="current-password"
                  required
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
              <button type="submit" className="coord-btn coord-btn--primary" disabled={submitting || !password}>
                {submitting ? 'Verifying...' : 'Enter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
