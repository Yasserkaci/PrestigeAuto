import { useEffect, useState } from 'react';
import { Trash2, Mail, Phone, AlertTriangle, Check, Inbox, MailOpen } from 'lucide-react';
import { supabase, MESSAGES_TABLE } from '../../lib/supabase';
import { ADMIN_STYLES } from './adminStyles';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [filter, setFilter] = useState('all'); // all | unread | read

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(MESSAGES_TABLE)
      .select('id, name, email, phone, message, read, created_at')
      .order('created_at', { ascending: false });
    if (error) setStatus({ type: 'err', message: error.message });
    else setMessages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (m) => {
    const next = !m.read;
    setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: next } : x)));
    const { error } = await supabase
      .from(MESSAGES_TABLE)
      .update({ read: next })
      .eq('id', m.id);
    if (error) {
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: !next } : x)));
      setStatus({ type: 'err', message: `Couldn't update: ${error.message}` });
    }
  };

  const handleDelete = async (m) => {
    if (!confirm(`Delete the message from ${m.name}?`)) return;
    const { error } = await supabase.from(MESSAGES_TABLE).delete().eq('id', m.id);
    if (error) {
      setStatus({ type: 'err', message: `Delete failed: ${error.message}` });
      return;
    }
    setStatus({ type: 'ok', message: 'Message deleted.' });
    fetchMessages();
  };

  const filtered = messages.filter((m) => {
    if (filter === 'unread') return !m.read;
    if (filter === 'read') return m.read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <>
      <style>{ADMIN_STYLES}</style>
      <style>{`
        .mg-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .mg-filters { display: flex; gap: 4px; }
        .mg-filter {
          background: #ffffff;
          border: 1px solid #d1d5db;
          color: #4b5563;
          padding: 6px 12px;
          font-size: 13px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .mg-filter:hover { background: #f9fafb; }
        .mg-filter.on {
          background: #2563eb;
          border-color: #2563eb;
          color: #ffffff;
        }
        .mg-count {
          font-size: 13px;
          color: #4b5563;
        }
        .mg-count strong { color: #111827; }

        .mg-list { display: flex; flex-direction: column; gap: 10px; }

        .mg-msg {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-left: 3px solid #d1d5db;
          border-radius: 6px;
          padding: 16px 18px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px 20px;
          align-items: start;
        }
        .mg-msg.unread { border-left-color: #2563eb; background: #f8fafc; }

        .mg-head {
          display: flex; align-items: baseline; gap: 10px;
          flex-wrap: wrap; margin-bottom: 6px;
        }
        .mg-name { font-size: 15px; font-weight: 600; color: #111827; }
        .mg-dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #2563eb;
        }
        .mg-date { font-size: 12px; color: #6b7280; }

        .mg-contact { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 8px; }
        .mg-contact a, .mg-contact span {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; color: #4b5563;
          text-decoration: none;
        }
        .mg-contact a:hover { color: #2563eb; }

        .mg-body {
          font-size: 14px;
          color: #1f2937;
          line-height: 1.55;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .mg-actions { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }

        .mg-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 10px;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 12px;
          color: #374151;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .mg-btn:hover { background: #f9fafb; border-color: #9ca3af; }
        .mg-btn-del {
          color: #b91c1c;
          border-color: #fecaca;
        }
        .mg-btn-del:hover { background: #fef2f2; border-color: #fca5a5; }

        @media (max-width: 600px) {
          .mg-msg { grid-template-columns: 1fr; }
          .mg-actions { flex-direction: row; align-items: center; }
        }
      `}</style>

      <p className="am-eyebrow">Inbox</p>
      <h1 className="am-heading">Contact <em>Messages</em></h1>

      {status && (
        <div className={`am-status am-status-${status.type}`} style={{ marginBottom: 16 }}>
          {status.type === 'ok'
            ? <Check size={13} strokeWidth={2} />
            : <AlertTriangle size={13} strokeWidth={1.75} />}
          <span>{status.message}</span>
        </div>
      )}

      <div className="mg-toolbar">
        <div className="mg-count">
          <strong>{messages.length}</strong> total
          {unreadCount > 0 && <> · <strong>{unreadCount}</strong> unread</>}
        </div>
        <div className="mg-filters">
          <button className={`mg-filter ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`mg-filter ${filter === 'unread' ? 'on' : ''}`} onClick={() => setFilter('unread')}>Unread</button>
          <button className={`mg-filter ${filter === 'read' ? 'on' : ''}`} onClick={() => setFilter('read')}>Read</button>
        </div>
      </div>

      {loading && <div className="am-empty">Loading…</div>}
      {!loading && filtered.length === 0 && (
        <div className="am-empty">
          <Inbox size={20} strokeWidth={1.5} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 8, color: '#9ca3af' }} />
          {filter === 'all' ? 'No messages yet.' : `No ${filter} messages.`}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="mg-list">
          {filtered.map((m) => (
            <div key={m.id} className={`mg-msg ${m.read ? '' : 'unread'}`}>
              <div>
                <div className="mg-head">
                  {!m.read && <span className="mg-dot" aria-label="Unread" />}
                  <span className="mg-name">{m.name}</span>
                  <span className="mg-date">
                    {new Date(m.created_at).toLocaleString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: 'numeric', minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="mg-contact">
                  {m.email && (
                    <a href={`mailto:${m.email}`}>
                      <Mail size={12} strokeWidth={1.75} /> {m.email}
                    </a>
                  )}
                  {m.phone && (
                    <a href={`tel:${m.phone.replace(/\s+/g, '')}`}>
                      <Phone size={12} strokeWidth={1.75} /> {m.phone}
                    </a>
                  )}
                </div>
                <div className="mg-body">{m.message}</div>
              </div>

              <div className="mg-actions">
                <button className="mg-btn" onClick={() => toggleRead(m)}>
                  {m.read
                    ? <><Inbox size={12} strokeWidth={1.75} /> Mark unread</>
                    : <><MailOpen size={12} strokeWidth={1.75} /> Mark read</>
                  }
                </button>
                <button className="mg-btn mg-btn-del" onClick={() => handleDelete(m)}>
                  <Trash2 size={12} strokeWidth={1.75} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
