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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');

        .lg-wrap {
          min-height: 100vh;
          background: #060606;
          color: #e8e3da;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; justify-content: center;
          padding: 32px 20px;
          position: relative;
          overflow: hidden;
        }

        .lg-orb {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 60%);
          pointer-events: none; z-index: 0;
        }

        .lg-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none; z-index: 0;
        }

        .lg-back {
          position: absolute; top: 24px; left: 24px;
          display: inline-flex; align-items: center; gap: 8px;
          color: rgba(232,227,218,0.5); text-decoration: none;
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          transition: color 0.2s;
          z-index: 2;
        }
        .lg-back:hover { color: #c9a84c; }

        .lg-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 420px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 48px 36px;
        }

        @media (max-width: 540px) { .lg-card { padding: 32px 22px; } }

        .lg-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase;
          color: #c9a84c; margin-bottom: 12px;
          display: flex; align-items: center; gap: 12px;
        }
        .lg-eyebrow::after {
          content: ''; display: block; height: 1px; width: 32px;
          background: #c9a84c; opacity: 0.5;
        }

        .lg-heading {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: 44px;
          line-height: 1; letter-spacing: -0.01em;
          color: #e8e3da;
        }
        .lg-heading em { font-style: italic; color: #c9a84c; }

        .lg-sub {
          font-size: 13px; color: rgba(232,227,218,0.45);
          line-height: 1.6; margin-top: 12px; margin-bottom: 36px;
          font-weight: 300;
        }

        .lg-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }

        .lg-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(201,168,76,0.6);
        }

        .lg-input-wrap { position: relative; }

        .lg-input-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          color: rgba(201,168,76,0.55);
          pointer-events: none;
        }

        .lg-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #e8e3da;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          padding: 12px 14px 12px 42px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .lg-input::placeholder { color: rgba(232,227,218,0.25); }
        .lg-input:focus {
          border-color: rgba(201,168,76,0.6);
          background: rgba(201,168,76,0.04);
        }

        .lg-btn {
          position: relative;
          width: 100%;
          padding: 14px 20px;
          background: transparent;
          border: 1px solid rgba(201,168,76,0.45);
          color: #e8e3da;
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          cursor: pointer; overflow: hidden;
          transition: color 0.4s, border-color 0.4s;
          margin-top: 8px;
        }
        .lg-btn::before {
          content: ''; position: absolute; inset: 0; background: #c9a84c;
          transform: translateX(-101%);
          transition: transform 0.45s cubic-bezier(0.77,0,0.18,1);
          z-index: 0;
        }
        .lg-btn:hover:not(:disabled)::before { transform: translateX(0); }
        .lg-btn:hover:not(:disabled) { color: #060606; border-color: #c9a84c; }
        .lg-btn:disabled { opacity: 0.5; cursor: wait; }
        .lg-btn span { position: relative; z-index: 1; }

        .lg-error {
          margin-top: 18px;
          padding: 10px 14px;
          font-size: 12px;
          color: rgba(220,140,140,0.95);
          background: rgba(220,80,80,0.05);
          border-left: 1px solid rgba(220,80,80,0.45);
          display: flex; align-items: center; gap: 10px;
        }
      `}</style>

      <div className="lg-wrap">
        <div className="lg-grid" aria-hidden="true" />
        <div className="lg-orb" aria-hidden="true" />

        <a href="/" className="lg-back">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to site
        </a>

        <div className="lg-card">
          <p className="lg-eyebrow">Restricted Access</p>
          <h1 className="lg-heading">Admin <em>Login</em></h1>
          <p className="lg-sub">
            Sign in with your administrator credentials to manage the fleet.
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
              <span>{submitting ? 'Signing in…' : 'Sign in'}</span>
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
