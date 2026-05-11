import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Car as CarIcon, Image as ImageIcon, Type } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

import CarsManager from './admin/CarsManager';
import GalleryManager from './admin/GalleryManager';
import ContentManager from './admin/ContentManager';

const TABS = [
  { key: 'cars',    label: 'Cars',     icon: CarIcon  },
  { key: 'gallery', label: 'Gallery',  icon: ImageIcon },
  { key: 'content', label: 'Content',  icon: Type     },
];

export default function Admin() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [tab, setTab] = useState('cars');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');

        .ad-wrap {
          min-height: 100vh;
          background: #060606;
          color: #e8e3da;
          font-family: 'DM Sans', sans-serif;
          padding: 32px 24px 80px;
        }
        @media (max-width: 640px) { .ad-wrap { padding: 24px 16px 60px; } }

        .ad-inner { max-width: 1200px; margin: 0 auto; }

        .ad-bar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; padding-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .ad-brand { display: flex; align-items: center; gap: 14px; }
        .ad-brand-mark {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px; letter-spacing: 0.12em;
          color: #e8e3da;
        }
        .ad-brand-mark span { color: #c9a84c; }

        .ad-tag {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(201,168,76,0.7);
          padding: 4px 10px;
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 999px;
        }

        .ad-bar-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

        .ad-link {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgba(232,227,218,0.5); text-decoration: none;
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          transition: color 0.2s;
        }
        .ad-link:hover { color: #c9a84c; }

        .ad-signout {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 14px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(232,227,218,0.7);
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .ad-signout:hover { border-color: rgba(201,168,76,0.5); color: #c9a84c; }

        .ad-tabs {
          display: flex; gap: 4px;
          margin-bottom: 36px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .ad-tab {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 20px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: rgba(232,227,218,0.5);
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
          margin-bottom: -1px;
        }
        .ad-tab:hover { color: #e8e3da; }
        .ad-tab.active {
          color: #c9a84c;
          border-bottom-color: #c9a84c;
        }
      `}</style>

      <div className="ad-wrap">
        <div className="ad-inner">
          <div className="ad-bar">
            <div className="ad-brand">
              <span className="ad-brand-mark">PRESTIGE <span>·</span> ADMIN</span>
              <span className="ad-tag">Site Manager</span>
            </div>
            <div className="ad-bar-actions">
              <a href="/" className="ad-link">
                <ArrowLeft size={12} strokeWidth={1.5} /> View site
              </a>
              {session?.user?.email && (
                <span className="ad-link" style={{ pointerEvents: 'none' }}>
                  {session.user.email}
                </span>
              )}
              <button className="ad-signout" onClick={handleSignOut}>
                <LogOut size={13} strokeWidth={1.5} /> Sign out
              </button>
            </div>
          </div>

          <div className="ad-tabs">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`ad-tab ${tab === key ? 'active' : ''}`}
                onClick={() => setTab(key)}
              >
                <Icon size={13} strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>

          {tab === 'cars'    && <CarsManager />}
          {tab === 'gallery' && <GalleryManager />}
          {tab === 'content' && <ContentManager />}
        </div>
      </div>
    </>
  );
}
