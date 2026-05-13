import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Car as CarIcon, Image as ImageIcon, Type, Users, Inbox } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

import CarsManager from './admin/CarsManager';
import GalleryManager from './admin/GalleryManager';
import TeamManager from './admin/TeamManager';
import MessagesManager from './admin/MessagesManager';
import ContentManager from './admin/ContentManager';

const TABS = [
  { key: 'cars',     label: 'Cars',     icon: CarIcon   },
  { key: 'gallery',  label: 'Gallery',  icon: ImageIcon },
  { key: 'team',     label: 'Team',     icon: Users     },
  { key: 'messages', label: 'Messages', icon: Inbox     },
  { key: 'content',  label: 'Content',  icon: Type      },
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
        .ad-wrap {
          min-height: 100vh;
          background: #f9fafb;
          color: #111827;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          padding: 24px;
        }
        @media (max-width: 640px) { .ad-wrap { padding: 16px; } }

        .ad-inner { max-width: 1200px; margin: 0 auto; }

        .ad-bar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .ad-brand { display: flex; align-items: center; gap: 12px; }
        .ad-brand-mark {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }
        .ad-brand-mark span { color: #6b7280; font-weight: 400; }

        .ad-tag {
          font-size: 11px;
          color: #4b5563;
          padding: 3px 8px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
        }

        .ad-bar-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

        .ad-link {
          display: inline-flex; align-items: center; gap: 6px;
          color: #4b5563; text-decoration: none;
          font-size: 13px;
          transition: color 0.15s;
        }
        .ad-link:hover { color: #111827; }

        .ad-signout {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 12px;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          color: #374151;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .ad-signout:hover { background: #f9fafb; border-color: #9ca3af; }

        .ad-tabs {
          display: flex; gap: 2px;
          margin-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .ad-tab {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 14px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: #6b7280;
          font-size: 14px;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
          margin-bottom: -1px;
        }
        .ad-tab:hover { color: #111827; }
        .ad-tab.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
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

          {tab === 'cars'     && <CarsManager />}
          {tab === 'gallery'  && <GalleryManager />}
          {tab === 'team'     && <TeamManager />}
          {tab === 'messages' && <MessagesManager />}
          {tab === 'content'  && <ContentManager />}
        </div>
      </div>
    </>
  );
}
