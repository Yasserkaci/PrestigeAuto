import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) navigate('/admin', { replace: true });
  }, [session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate('/admin', { replace: true });
  };

  return (
    <>
      <style>{`
        .lg-wrap {
          min-height: 100vh;
          background: #f9fafb;
          color: #111827;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }

        .lg-back {
          position: absolute; top: 16px; left: 16px;
          display: inline-flex; align-items: center; gap: 6px;
          color: #4b5563; text-decoration: none;
          font-size: 13px;
          transition: color 0.15s;
        }
        .lg-back:hover { color: #111827; }

        .lg-card {
          width: 100%; max-width: 400px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 32px 28px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        @media (max-width: 540px) { .lg-card { padding: 24px 20px; } }

        .lg-eyebrow {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .lg-heading {
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }
        .lg-heading em { font-style: normal; color: #2563eb; }

        .lg-sub {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
          margin-top: 4px;
          margin-bottom: 24px;
        }

        .lg-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }

        .lg-label {
          font-size: 12px;
          font-weight: 500;
          color: #374151;
        }

        .lg-input-wrap { position: relative; }

        .lg-input-icon {
          position: absolute; left: 10px; top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }

        .lg-input {
          width: 100%;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          color: #111827;
          font-size: 14px;
          padding: 8px 10px 8px 34px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .lg-input::placeholder { color: #9ca3af; }
        .lg-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .lg-btn {
          width: 100%;
          padding: 10px 16px;
          background: #2563eb;
          border: 1px solid #2563eb;
          border-radius: 4px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
          margin-top: 6px;
        }
        .lg-btn:hover:not(:disabled) { background: #1d4ed8; border-color: #1d4ed8; }
        .lg-btn:disabled { opacity: 0.6; cursor: wait; }

        .lg-error {
          margin-top: 14px;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 13px;
          color: #b91c1c;
          background: #fef2f2;
          border: 1px solid #fecaca;
          display: flex; align-items: center; gap: 8px;
        }
      `}</style>

      <div className="lg-wrap">
        <a href="/" className="lg-back">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to site
        </a>

        <div className="lg-card">
          <p className="lg-eyebrow">Admin</p>
          <h1 className="lg-heading">Sign in</h1>
          <p className="lg-sub">
            Sign in with your administrator credentials to manage the site.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="lg-field">
              <label className="lg-label" htmlFor="lg-email">Email</label>
              <div className="lg-input-wrap">
                <Mail className="lg-input-icon" size={15} strokeWidth={1.5} />
                <input
                  id="lg-email"
                  type="email"
                  required
                  autoComplete="email"
                  className="lg-input"
                  placeholder="admin@prestigecompany.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="lg-field">
              <label className="lg-label" htmlFor="lg-pwd">Password</label>
              <div className="lg-input-wrap">
                <Lock className="lg-input-icon" size={15} strokeWidth={1.5} />
                <input
                  id="lg-pwd"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="lg-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="lg-btn" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>

            {error && (
              <div className="lg-error">
                <AlertTriangle size={14} strokeWidth={1.75} />
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
