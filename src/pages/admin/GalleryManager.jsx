import { useEffect, useRef, useState } from 'react';
import { Upload, Trash2, ImagePlus, AlertTriangle, Check } from 'lucide-react';
import { supabase, GALLERY_BUCKET, GALLERY_TABLE } from '../../lib/supabase';
import { ADMIN_STYLES } from './adminStyles';

export default function GalleryManager() {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const fetchImages = async () => {
    setLoadingList(true);
    const { data, error } = await supabase
      .from(GALLERY_TABLE)
      .select('id, title, description, image_url, image_path, created_at')
      .order('created_at', { ascending: false });
    if (error) setStatus({ type: 'err', message: error.message });
    else setImages(data ?? []);
    setLoadingList(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFilePreview(URL.createObjectURL(f));
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!file) {
      setStatus({ type: 'err', message: 'An image is required.' });
      return;
    }
    setSubmitting(true);

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from(GALLERY_BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (uploadErr) {
      setSubmitting(false);
      setStatus({ type: 'err', message: `Upload failed: ${uploadErr.message}` });
      return;
    }

    const { data: pub } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path);

    const { error: insertErr } = await supabase
      .from(GALLERY_TABLE)
      .insert({
        title: title.trim() || null,
        description: description.trim() || null,
        image_url: pub.publicUrl,
        image_path: path,
      });

    if (insertErr) {
      await supabase.storage.from(GALLERY_BUCKET).remove([path]);
      setSubmitting(false);
      setStatus({ type: 'err', message: `Save failed: ${insertErr.message}` });
      return;
    }

    setSubmitting(false);
    setStatus({ type: 'ok', message: 'Image added to gallery.' });
    resetForm();
    fetchImages();
  };

  const handleDelete = async (img) => {
    if (!confirm(`Delete this image${img.title ? ` "${img.title}"` : ''}?`)) return;
    if (img.image_path) await supabase.storage.from(GALLERY_BUCKET).remove([img.image_path]);
    const { error } = await supabase.from(GALLERY_TABLE).delete().eq('id', img.id);
    if (error) {
      setStatus({ type: 'err', message: `Delete failed: ${error.message}` });
      return;
    }
    setStatus({ type: 'ok', message: 'Image removed.' });
    fetchImages();
  };

  return (
    <>
      <style>{ADMIN_STYLES}</style>

      <p className="am-eyebrow">Manage Gallery</p>
      <h1 className="am-heading">Gallery <em>Images</em></h1>

      <div className="am-grid">
        <div className="am-card">
          <h2>Upload image</h2>
          <form onSubmit={handleSubmit}>
            <div className="am-field">
              <label className="am-label" htmlFor="ga-title">Title (optional)</label>
              <input
                id="ga-title" className="am-input"
                placeholder="e.g. Black BMW M4"
                value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120}
              />
            </div>

            <div className="am-field">
              <label className="am-label" htmlFor="ga-desc">Description (optional)</label>
              <textarea
                id="ga-desc" className="am-textarea"
                placeholder="Where it was shot, model details, anything contextual…"
                value={description} onChange={(e) => setDescription(e.target.value)} maxLength={600}
              />
            </div>

            <div className="am-field">
              <label className="am-label">Image</label>
              <label className="am-drop">
                <ImagePlus className="am-drop-icon" size={28} strokeWidth={1.25} />
                <div>{file ? 'Replace image' : 'Click to choose an image'}</div>
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
              <span>{submitting ? 'Uploading…' : 'Add to gallery'}</span>
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
            <h2>Gallery ({images.length})</h2>
          </div>

          {loadingList && <div className="am-empty">Loading…</div>}
          {!loadingList && images.length === 0 && (
            <div className="am-empty">No images yet. Upload your first one →</div>
          )}
          {!loadingList && images.length > 0 && (
            <div className="am-list">
              {images.map((img) => (
                <div key={img.id} className="am-item">
                  <img src={img.image_url} alt={img.title || 'Gallery image'} className="am-item-img" loading="lazy" />
                  <div className="am-item-body">
                    {img.title && <div className="am-item-title">{img.title}</div>}
                    {img.description && <div className="am-item-desc">{img.description}</div>}
                    <div className="am-item-meta">
                      {new Date(img.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="am-item-actions">
                    <button className="am-del" onClick={() => handleDelete(img)}>
                      <Trash2 size={11} strokeWidth={1.75} /> Delete
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
