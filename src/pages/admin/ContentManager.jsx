import { useEffect, useState } from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { supabase, CONTENT_TABLE } from '../../lib/supabase';
import { ADMIN_STYLES } from './adminStyles';
import { CONTENT_GROUPS, CONTENT_KEYS } from './contentKeys';

export default function ContentManager() {
  const [values, setValues] = useState({});      // current saved values
  const [drafts, setDrafts] = useState({});      // unsaved edits
  const [savingKey, setSavingKey] = useState(null);
  const [flash, setFlash] = useState({});        // key -> "Saved" timestamp
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    const { data, error } = await supabase
      .from(CONTENT_TABLE)
      .select('key, value');
    if (error) {
      setStatus({ type: 'err', message: error.message });
      setLoading(false);
      return;
    }
    const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
    setValues(map);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const getDraft = (key, fallback) => {
    if (drafts[key] !== undefined) return drafts[key];
    if (values[key] !== undefined && values[key] !== null) return values[key];
    return fallback;
  };

  const isDirty = (key, fallback) => {
    const current = getDraft(key, fallback);
    const saved = values[key] ?? fallback;
    return current !== saved;
  };

  const handleChange = (key, val) => {
    setDrafts((d) => ({ ...d, [key]: val }));
  };

  const handleSave = async (key) => {
    setStatus(null);
    setSavingKey(key);
    const val = drafts[key] ?? '';

    // upsert by primary key
    const { error } = await supabase
      .from(CONTENT_TABLE)
      .upsert({ key, value: val, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    setSavingKey(null);
    if (error) {
      setStatus({ type: 'err', message: `Save failed: ${error.message}` });
      return;
    }
    setValues((v) => ({ ...v, [key]: val }));
    setDrafts((d) => {
      const next = { ...d };
      delete next[key];
      return next;
    });
    setFlash((f) => ({ ...f, [key]: Date.now() }));
    setTimeout(() => {
      setFlash((f) => {
        const next = { ...f };
        delete next[key];
        return next;
      });
    }, 1800);
  };

  const handleResetToDefault = async (key, fallback) => {
    if (!confirm('Reset this field to its default value?')) return;
    setStatus(null);
    setSavingKey(key);
    const { error } = await supabase.from(CONTENT_TABLE).delete().eq('key', key);
    setSavingKey(null);
    if (error) {
      setStatus({ type: 'err', message: `Reset failed: ${error.message}` });
      return;
    }
    setValues((v) => {
      const next = { ...v };
      delete next[key];
      return next;
    });
    setDrafts((d) => {
      const next = { ...d };
      delete next[key];
      return next;
    });
    setFlash((f) => ({ ...f, [key]: Date.now() }));
    setTimeout(() => {
      setFlash((f) => {
        const next = { ...f };
        delete next[key];
        return next;
      });
    }, 1800);
  };

  return (
    <>
      <style>{ADMIN_STYLES}</style>

      <p className="am-eyebrow">Manage Copy</p>
      <h1 className="am-heading">Site <em>Content</em></h1>

      {status && (
        <div className={`am-status am-status-${status.type}`} style={{ marginBottom: 20 }}>
          {status.type === 'ok'
            ? <Check size={13} strokeWidth={2} />
            : <AlertTriangle size={13} strokeWidth={1.75} />}
          <span>{status.message}</span>
        </div>
      )}

      {loading && <div className="am-empty">Loading…</div>}

      {!loading && CONTENT_GROUPS.map((group) => (
        <section key={group.section} style={{ marginBottom: 36 }}>
          <h2 style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: 11,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(232,227,218,0.5)',
            marginBottom: 14,
          }}>
            — {group.section}
          </h2>

          <div className="am-content-list">
            {group.keys.map(({ key, label, help, fallback, multiline }) => {
              const value = getDraft(key, fallback);
              const dirty = isDirty(key, fallback);
              const saved = flash[key];

              return (
                <div key={key} className="am-content-row">
                  <div className="am-content-key">
                    <span className="am-content-key-name">{label}</span>
                    <span className="am-content-key-desc">{help}</span>
                  </div>

                  {multiline ? (
                    <textarea
                      className="am-textarea"
                      value={value}
                      onChange={(e) => handleChange(key, e.target.value)}
                    />
                  ) : (
                    <input
                      className="am-input"
                      value={value}
                      onChange={(e) => handleChange(key, e.target.value)}
                    />
                  )}

                  <div className="am-save-row">
                    <button
                      className={`am-save-btn ${dirty ? 'dirty' : ''}`}
                      onClick={() => handleSave(key)}
                      disabled={!dirty || savingKey === key}
                    >
                      {savingKey === key ? 'Saving…' : 'Save'}
                    </button>
                    <span className={`am-save-flash ${saved ? 'shown' : ''}`}>Saved</span>
                  </div>

                  {(values[key] !== undefined && values[key] !== null) && (
                    <div style={{ gridColumn: '1 / -1', marginTop: -4 }}>
                      <button
                        onClick={() => handleResetToDefault(key, fallback)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'rgba(232,227,218,0.35)',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: 9,
                          letterSpacing: '0.25em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        ↺ Reset to default
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <div style={{
        marginTop: 28,
        padding: 16,
        border: '1px dashed rgba(255,255,255,0.06)',
        fontSize: 12,
        color: 'rgba(232,227,218,0.5)',
        lineHeight: 1.7,
      }}>
        <strong style={{ color: '#c9a84c', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: 10, fontFamily: 'DM Mono, monospace' }}>
          Tip
        </strong>
        {' '}— changes save individually and appear on the live site in real time
        thanks to a Supabase realtime subscription. There are {CONTENT_KEYS.length} editable
        fields across the site. Leave a field empty to fall back to its default.
      </div>
    </>
  );
}
