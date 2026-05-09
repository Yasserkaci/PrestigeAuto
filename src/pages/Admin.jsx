import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Upload, Trash2, ImagePlus, AlertTriangle, Check, ArrowLeft } from 'lucide-react';
import { supabase, CARS_BUCKET, CARS_TABLE } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export default function Admin() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const fileInputRef = useRef(null);

  const [cars, setCars] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'ok' | 'err', message }

  const fetchCars = async () => {
    setLoadingList(true);
    const { data, error } = await supabase
      .from(CARS_TABLE)
      .select('id, title, description, image_url, image_path, created_at')
      .order('created_at', { ascending: false });
    if (error) {
      setStatus({ type: 'err', message: error.message });
    } else {
      setCars(data ?? []);
    }
    setLoadingList(false);
  };

  useEffect(() => { fetchCars(); }, []);

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFilePreview(URL.createObjectURL(f));
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!title.trim() || !file) {
      setStatus({ type: 'err', message: 'Title and image are required.' });
      return;
    }

    setSubmitting(true);

    // 1. Upload image to Storage
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from(CARS_BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (uploadErr) {
      setSubmitting(false);
      setStatus({ type: 'err', message: `Upload failed: ${uploadErr.message}` });
      return;
    }

    // 2. Get public URL
    const { data: pub } = supabase.storage.from(CARS_BUCKET).getPublicUrl(path);
    const imageUrl = pub.publicUrl;

    // 3. Insert row in cars table
    const { error: insertErr } = await supabase
      .from(CARS_TABLE)
      .insert({
        title: title.trim(),
        description: description.trim() || null,
        image_url: imageUrl,
        image_path: path,
      });

    if (insertErr) {
      // best-effort cleanup of the uploaded file
      await supabase.storage.from(CARS_BUCKET).remove([path]);
      setSubmitting(false);
      setStatus({ type: 'err', message: `Save failed: ${insertErr.message}` });
      return;
    }

    setSubmitting(false);
    setStatus({ type: 'ok', message: 'Car added successfully.' });
    resetForm();
    fetchCars();
  };

  const handleDelete = async (car) => {
    if (!confirm(`Delete "${car.title}"? This cannot be undone.`)) return;

    if (car.image_path) {
      await supabase.storage.from(CARS_BUCKET).remove([car.image_path]);
    }
    const { error } = await supabase.from(CARS_TABLE).delete().eq('id', car.id);
    if (error) {
      setStatus({ type: 'err', message: `Delete failed: ${error.message}` });
      return;
    }
    setStatus({ type: 'ok', message: 'Car removed.' });
    fetchCars();
  };

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
          margin-bottom: 48px;
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

        .ad-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase;
          color: #c9a84c; margin-bottom: 12px;
        }

        .ad-heading {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(40px, 5vw, 56px);
          line-height: 1; letter-spacing: -0.01em;
          margin-bottom: 36px;
        }
        .ad-heading em { font-style: italic; color: #c9a84c; }

        .ad-grid {
          display: grid;
          grid-template-columns: minmax(320px, 1fr) 2fr;
          gap: 36px;
          align-items: start;
        }
        @media (max-width: 900px) { .ad-grid { grid-template-columns: 1fr; } }

        .ad-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 28px;
        }

        .ad-card h2 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600; font-size: 22px;
          margin-bottom: 18px;
          color: #e8e3da;
        }

        .ad-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }

        .ad-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(201,168,76,0.6);
        }

        .ad-input, .ad-textarea {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #e8e3da;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          padding: 12px 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          width: 100%;
        }
        .ad-input::placeholder, .ad-textarea::placeholder { color: rgba(232,227,218,0.25); }
        .ad-input:focus, .ad-textarea:focus {
          border-color: rgba(201,168,76,0.6);
          background: rgba(201,168,76,0.04);
        }
        .ad-textarea { resize: vertical; min-height: 100px; }

        .ad-drop {
          position: relative;
          border: 1px dashed rgba(201,168,76,0.4);
          background: rgba(201,168,76,0.03);
          padding: 28px 16px;
          text-align: center;
          color: rgba(232,227,218,0.55);
          font-size: 12px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .ad-drop:hover { border-color: rgba(201,168,76,0.7); background: rgba(201,168,76,0.06); }
        .ad-drop input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

        .ad-drop-icon { color: #c9a84c; margin: 0 auto 8px; }
        .ad-drop-hint { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(201,168,76,0.55); margin-top: 6px; }

        .ad-preview {
          display: flex; gap: 12px; align-items: center;
          margin-top: 12px;
          padding: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .ad-preview img { width: 64px; height: 64px; object-fit: cover; }
        .ad-preview-meta { flex: 1; min-width: 0; }
        .ad-preview-name { font-size: 12px; color: #e8e3da; word-break: break-all; }
        .ad-preview-size { font-size: 10px; color: rgba(232,227,218,0.4); margin-top: 2px; font-family: 'DM Mono', monospace; }

        .ad-btn {
          position: relative;
          width: 100%;
          padding: 13px 20px;
          background: transparent;
          border: 1px solid rgba(201,168,76,0.45);
          color: #e8e3da;
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          cursor: pointer; overflow: hidden;
          transition: color 0.4s, border-color 0.4s;
          margin-top: 14px;
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
        }
        .ad-btn::before {
          content: ''; position: absolute; inset: 0; background: #c9a84c;
          transform: translateX(-101%);
          transition: transform 0.45s cubic-bezier(0.77,0,0.18,1);
        }
        .ad-btn:hover:not(:disabled)::before { transform: translateX(0); }
        .ad-btn:hover:not(:disabled) { color: #060606; border-color: #c9a84c; }
        .ad-btn:disabled { opacity: 0.5; cursor: wait; }
        .ad-btn > * { position: relative; z-index: 1; }

        .ad-status {
          margin-top: 14px;
          padding: 10px 14px;
          font-size: 12px;
          display: flex; align-items: center; gap: 10px;
          border-left: 1px solid;
        }
        .ad-status-ok  { background: rgba(201,168,76,0.06); color: #c9a84c;             border-color: rgba(201,168,76,0.5); }
        .ad-status-err { background: rgba(220,80,80,0.05); color: rgba(220,140,140,0.95); border-color: rgba(220,80,80,0.5); }

        .ad-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }

        .ad-item {
          background: #0c0c0c;
          border: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column;
          transition: border-color 0.3s;
        }
        .ad-item:hover { border-color: rgba(201,168,76,0.3); }

        .ad-item-img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block; background: #050505; }

        .ad-item-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 6px; }

        .ad-item-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600; font-size: 18px; line-height: 1.2; color: #e8e3da;
        }
        .ad-item-desc {
          font-size: 12px; color: rgba(232,227,218,0.5); line-height: 1.6;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .ad-item-meta {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
          color: rgba(201,168,76,0.55);
          margin-top: 4px;
        }

        .ad-item-actions { padding: 0 16px 16px; }

        .ad-del {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 12px;
          background: transparent;
          border: 1px solid rgba(220,80,80,0.35);
          color: rgba(220,140,140,0.9);
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .ad-del:hover { background: rgba(220,80,80,0.12); color: #f1bcbc; }

        .ad-empty {
          padding: 60px 20px;
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          color: rgba(232,227,218,0.4);
          border: 1px dashed rgba(255,255,255,0.06);
        }
      `}</style>

      <div className="ad-wrap">
        <div className="ad-inner">
          <div className="ad-bar">
            <div className="ad-brand">
              <span className="ad-brand-mark">PRESTIGE <span>·</span> ADMIN</span>
              <span className="ad-tag">Fleet Manager</span>
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

          <p className="ad-eyebrow">Manage Fleet</p>
          <h1 className="ad-heading">Cars <em>&amp; Inventory</em></h1>

          <div className="ad-grid">
            {/* Upload form */}
            <div className="ad-card">
              <h2>Add a car</h2>
              <form onSubmit={handleSubmit}>
                <div className="ad-field">
                  <label className="ad-label" htmlFor="ad-title">Title</label>
                  <input
                    id="ad-title" className="ad-input"
                    placeholder="e.g. Skoda Fabia Monte Carlo"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={120}
                  />
                </div>

                <div className="ad-field">
                  <label className="ad-label" htmlFor="ad-desc">Description</label>
                  <textarea
                    id="ad-desc" className="ad-textarea"
                    placeholder="Engine, year, key specs, condition…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={600}
                  />
                </div>

                <div className="ad-field">
                  <label className="ad-label">Image</label>
                  <label className="ad-drop">
                    <ImagePlus className="ad-drop-icon" size={28} strokeWidth={1.25} />
                    <div>{file ? 'Replace image' : 'Click to choose an image'}</div>
                    <div className="ad-drop-hint">JPG · PNG · WEBP — up to 8 MB</div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onPickFile}
                    />
                  </label>

                  {file && filePreview && (
                    <div className="ad-preview">
                      <img src={filePreview} alt="Preview" />
                      <div className="ad-preview-meta">
                        <div className="ad-preview-name">{file.name}</div>
                        <div className="ad-preview-size">
                          {(file.size / 1024).toFixed(0)} KB
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="ad-btn" disabled={submitting}>
                  <Upload size={13} strokeWidth={1.75} />
                  <span>{submitting ? 'Uploading…' : 'Add car'}</span>
                </button>

                {status && (
                  <div className={`ad-status ad-status-${status.type}`}>
                    {status.type === 'ok'
                      ? <Check size={13} strokeWidth={2} />
                      : <AlertTriangle size={13} strokeWidth={1.75} />}
                    <span>{status.message}</span>
                  </div>
                )}
              </form>
            </div>

            {/* Existing cars list */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 22, color: '#e8e3da' }}>
                  Inventory ({cars.length})
                </h2>
              </div>

              {loadingList && (
                <div className="ad-empty">Loading…</div>
              )}

              {!loadingList && cars.length === 0 && (
                <div className="ad-empty">No cars yet. Upload your first one →</div>
              )}

              {!loadingList && cars.length > 0 && (
                <div className="ad-list">
                  {cars.map((car) => (
                    <div key={car.id} className="ad-item">
                      <img src={car.image_url} alt={car.title} className="ad-item-img" loading="lazy" />
                      <div className="ad-item-body">
                        <div className="ad-item-title">{car.title}</div>
                        {car.description && <div className="ad-item-desc">{car.description}</div>}
                        <div className="ad-item-meta">
                          {new Date(car.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="ad-item-actions">
                        <button className="ad-del" onClick={() => handleDelete(car)}>
                          <Trash2 size={11} strokeWidth={1.75} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
