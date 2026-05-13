import { useEffect, useRef, useState } from 'react';
import { Upload, Trash2, ImagePlus, AlertTriangle, Check, Eye, EyeOff } from 'lucide-react';
import { supabase, TEAM_BUCKET, TEAM_TABLE, CONTENT_TABLE } from '../../lib/supabase';
import { ADMIN_STYLES } from './adminStyles';

const VISIBILITY_KEY = 'team.visible';

export default function TeamManager() {
  const fileInputRef = useRef(null);
  const [members, setMembers] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [visible, setVisible] = useState(true);
  const [savingVisible, setSavingVisible] = useState(false);

  const fetchMembers = async () => {
    setLoadingList(true);
    const { data, error } = await supabase
      .from(TEAM_TABLE)
      .select('id, name, role, bio, image_url, image_path, created_at')
      .order('created_at', { ascending: true });
    if (error) setStatus({ type: 'err', message: error.message });
    else setMembers(data ?? []);
    setLoadingList(false);
  };

  const fetchVisibility = async () => {
    const { data } = await supabase
      .from(CONTENT_TABLE)
      .select('value')
      .eq('key', VISIBILITY_KEY)
      .maybeSingle();
    setVisible(data?.value !== 'false');
  };

  useEffect(() => {
    fetchMembers();
    fetchVisibility();
  }, []);

  const toggleVisibility = async () => {
    const next = !visible;
    setSavingVisible(true);
    setVisible(next);
    const { error } = await supabase
      .from(CONTENT_TABLE)
      .upsert(
        { key: VISIBILITY_KEY, value: next ? 'true' : 'false', updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
    setSavingVisible(false);
    if (error) {
      setVisible(!next);
      setStatus({ type: 'err', message: `Couldn't save visibility: ${error.message}` });
    }
  };

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFilePreview(URL.createObjectURL(f));
  };

  const resetForm = () => {
    setName(''); setRole(''); setBio(''); setFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!name.trim() || !file) {
      setStatus({ type: 'err', message: 'Name and photo are required.' });
      return;
    }
    setSubmitting(true);

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from(TEAM_BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (uploadErr) {
      setSubmitting(false);
      setStatus({ type: 'err', message: `Upload failed: ${uploadErr.message}` });
      return;
    }

    const { data: pub } = supabase.storage.from(TEAM_BUCKET).getPublicUrl(path);

    const { error: insertErr } = await supabase
      .from(TEAM_TABLE)
      .insert({
        name: name.trim(),
        role: role.trim() || null,
        bio: bio.trim() || null,
        image_url: pub.publicUrl,
        image_path: path,
      });

    if (insertErr) {
      await supabase.storage.from(TEAM_BUCKET).remove([path]);
      setSubmitting(false);
      setStatus({ type: 'err', message: `Save failed: ${insertErr.message}` });
      return;
    }

    setSubmitting(false);
    setStatus({ type: 'ok', message: 'Team member added.' });
    resetForm();
    fetchMembers();
  };

  const handleDelete = async (m) => {
    if (!confirm(`Remove ${m.name} from the team?`)) return;
    if (m.image_path) await supabase.storage.from(TEAM_BUCKET).remove([m.image_path]);
    const { error } = await supabase.from(TEAM_TABLE).delete().eq('id', m.id);
    if (error) {
      setStatus({ type: 'err', message: `Delete failed: ${error.message}` });
      return;
    }
    setStatus({ type: 'ok', message: 'Team member removed.' });
    fetchMembers();
  };

  return (
    <>
      <style>{ADMIN_STYLES}</style>

      <style>{`
        .tm-toggle {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 14px 16px;
          margin-bottom: 20px;
        }
        .tm-toggle-info { display: flex; align-items: center; gap: 12px; }
        .tm-toggle-icon {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 6px;
          background: #f3f4f6; color: #4b5563;
        }
        .tm-toggle-icon.on { background: #dbeafe; color: #2563eb; }
        .tm-toggle-text { display: flex; flex-direction: column; gap: 2px; }
        .tm-toggle-title { font-size: 14px; font-weight: 600; color: #111827; }
        .tm-toggle-sub  { font-size: 12px; color: #6b7280; }
        .tm-switch {
          position: relative;
          width: 44px; height: 24px;
          background: #d1d5db;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .tm-switch::after {
          content: '';
          position: absolute;
          top: 2px; left: 2px;
          width: 20px; height: 20px;
          background: #ffffff;
          border-radius: 50%;
          transition: transform 0.2s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.15);
        }
        .tm-switch.on { background: #2563eb; }
        .tm-switch.on::after { transform: translateX(20px); }
        .tm-switch:disabled { opacity: 0.6; cursor: wait; }
      `}</style>

      <p className="am-eyebrow">Manage Team</p>
      <h1 className="am-heading">Team <em>Members</em></h1>

      <div className="tm-toggle">
        <div className="tm-toggle-info">
          <div className={`tm-toggle-icon ${visible ? 'on' : ''}`}>
            {visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </div>
          <div className="tm-toggle-text">
            <span className="tm-toggle-title">
              {visible ? 'Team section is visible' : 'Team section is hidden'}
            </span>
            <span className="tm-toggle-sub">
              {visible
                ? 'Visitors can see the team section on the homepage.'
                : 'The team section is hidden from the public site.'}
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-label="Toggle team section visibility"
          className={`tm-switch ${visible ? 'on' : ''}`}
          onClick={toggleVisibility}
          disabled={savingVisible}
        />
      </div>

      <div className="am-grid">
        <div className="am-card">
          <h2>Add team member</h2>
          <form onSubmit={handleSubmit}>
            <div className="am-field">
              <label className="am-label" htmlFor="tm-name">Full name</label>
              <input
                id="tm-name" className="am-input"
                placeholder="e.g. Karim El Amrani"
                value={name} onChange={(e) => setName(e.target.value)} maxLength={120}
              />
            </div>

            <div className="am-field">
              <label className="am-label" htmlFor="tm-role">Role (optional)</label>
              <input
                id="tm-role" className="am-input"
                placeholder="e.g. Head of Sales · Marseille"
                value={role} onChange={(e) => setRole(e.target.value)} maxLength={120}
              />
            </div>

            <div className="am-field">
              <label className="am-label" htmlFor="tm-bio">Bio (optional)</label>
              <textarea
                id="tm-bio" className="am-textarea"
                placeholder="Short blurb — what they do, what they bring…"
                value={bio} onChange={(e) => setBio(e.target.value)} maxLength={400}
              />
            </div>

            <div className="am-field">
              <label className="am-label">Photo</label>
              <label className="am-drop">
                <ImagePlus className="am-drop-icon" size={28} strokeWidth={1.25} />
                <div>{file ? 'Replace photo' : 'Click to choose a photo'}</div>
                <div className="am-drop-hint">JPG · PNG · WEBP — up to 8 MB</div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={onPickFile} />
              </label>

              {file && filePreview && (
                <div className="am-preview">
                  <img src={filePreview} alt="Preview" />
                  <div className="am-preview-meta">
                    <div className="am-preview-name">{file.name}</div>
                    <div className="am-preview-size">{(file.size / 1024).toFixed(0)} KB</div>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="am-btn" disabled={submitting}>
              <Upload size={13} strokeWidth={1.75} />
              <span>{submitting ? 'Uploading…' : 'Add team member'}</span>
            </button>

            {status && (
              <div className={`am-status am-status-${status.type}`}>
                {status.type === 'ok'
                  ? <Check size={13} strokeWidth={2} />
                  : <AlertTriangle size={13} strokeWidth={1.75} />}
                <span>{status.message}</span>
              </div>
            )}
          </form>
        </div>

        <div>
          <div className="am-row-head">
            <h2>Team ({members.length})</h2>
          </div>

          {loadingList && <div className="am-empty">Loading…</div>}
          {!loadingList && members.length === 0 && (
            <div className="am-empty">No team members yet. Add your first one →</div>
          )}
          {!loadingList && members.length > 0 && (
            <div className="am-list">
              {members.map((m) => (
                <div key={m.id} className="am-item">
                  <img src={m.image_url} alt={m.name} className="am-item-img" loading="lazy" />
                  <div className="am-item-body">
                    <div className="am-item-title">{m.name}</div>
                    {m.role && <div className="am-item-desc">{m.role}</div>}
                    {m.bio && <div className="am-item-desc">{m.bio}</div>}
                    <div className="am-item-meta">
                      {new Date(m.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="am-item-actions">
                    <button className="am-del" onClick={() => handleDelete(m)}>
                      <Trash2 size={11} strokeWidth={1.75} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
