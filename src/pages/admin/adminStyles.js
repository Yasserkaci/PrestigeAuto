// Shared admin tab CSS — light, plain, utilitarian.
// System fonts, neutral grays, single accent color.
export const ADMIN_STYLES = `
  .am-eyebrow {
    font-size: 12px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 6px;
  }

  .am-heading {
    font-size: 24px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 24px;
  }
  .am-heading em { font-style: normal; color: #2563eb; }

  .am-grid {
    display: grid;
    grid-template-columns: minmax(320px, 1fr) 2fr;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 900px) { .am-grid { grid-template-columns: 1fr; } }

  .am-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 20px;
  }
  .am-card h2 {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 16px;
  }

  .am-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .am-label {
    font-size: 12px;
    font-weight: 500;
    color: #374151;
  }

  .am-input, .am-textarea {
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    color: #111827;
    font-size: 14px;
    padding: 8px 10px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
  }
  .am-input::placeholder, .am-textarea::placeholder { color: #9ca3af; }
  .am-input:focus, .am-textarea:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
  .am-textarea { resize: vertical; min-height: 96px; }

  .am-drop {
    position: relative;
    border: 1px dashed #d1d5db;
    background: #f9fafb;
    border-radius: 4px;
    padding: 22px 12px;
    text-align: center;
    color: #4b5563;
    font-size: 13px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
  }
  .am-drop:hover { border-color: #2563eb; background: #eff6ff; }
  .am-drop input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .am-drop-icon { color: #2563eb; margin: 0 auto 8px; }
  .am-drop-hint {
    font-size: 11px;
    color: #6b7280;
    margin-top: 6px;
  }

  .am-preview {
    display: flex; gap: 12px; align-items: center;
    margin-top: 10px;
    padding: 10px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
  }
  .am-preview img { width: 56px; height: 56px; object-fit: cover; border-radius: 3px; }
  .am-preview-meta { flex: 1; min-width: 0; }
  .am-preview-name { font-size: 13px; color: #111827; word-break: break-all; }
  .am-preview-size {
    font-size: 11px; color: #6b7280; margin-top: 2px;
  }

  .am-btn {
    width: 100%;
    padding: 9px 16px;
    background: #2563eb;
    border: 1px solid #2563eb;
    border-radius: 4px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
    margin-top: 10px;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  }
  .am-btn:hover:not(:disabled) { background: #1d4ed8; border-color: #1d4ed8; }
  .am-btn:disabled { opacity: 0.6; cursor: wait; }

  .am-status {
    margin-top: 12px;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 13px;
    display: flex; align-items: center; gap: 8px;
    border: 1px solid;
  }
  .am-status-ok  { background: #ecfdf5; color: #047857; border-color: #a7f3d0; }
  .am-status-err { background: #fef2f2; color: #b91c1c; border-color: #fecaca; }

  .am-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 14px;
  }

  .am-item {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    display: flex; flex-direction: column;
    transition: border-color 0.15s, box-shadow 0.15s;
    overflow: hidden;
  }
  .am-item:hover { border-color: #2563eb; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }

  .am-item-img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block; background: #f3f4f6; }
  .am-item-body { padding: 10px 12px; display: flex; flex-direction: column; gap: 4px; }
  .am-item-title {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    line-height: 1.3;
  }
  .am-item-desc {
    font-size: 12px;
    color: #4b5563;
    line-height: 1.5;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .am-item-meta {
    font-size: 11px;
    color: #6b7280;
    margin-top: 2px;
  }
  .am-item-actions { padding: 0 12px 12px; }

  .am-del {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 10px;
    background: #ffffff;
    border: 1px solid #fecaca;
    border-radius: 4px;
    color: #b91c1c;
    font-size: 12px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .am-del:hover { background: #fef2f2; }

  .am-empty {
    padding: 40px 16px;
    text-align: center;
    color: #6b7280;
    font-size: 13px;
    border: 1px dashed #e5e7eb;
    border-radius: 4px;
    background: #f9fafb;
  }

  .am-row-head {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 14px;
  }
  .am-row-head h2 {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
  }

  /* Content tab */
  .am-content-list { display: flex; flex-direction: column; gap: 12px; }
  .am-content-row {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 14px 16px;
    display: grid;
    grid-template-columns: 1fr 2fr auto;
    gap: 14px;
    align-items: start;
  }
  @media (max-width: 720px) {
    .am-content-row { grid-template-columns: 1fr; }
  }

  .am-content-key { display: flex; flex-direction: column; gap: 4px; }
  .am-content-key-name {
    font-size: 12px;
    font-weight: 600;
    color: #111827;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  }
  .am-content-key-desc {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.4;
  }

  .am-save-row { display: flex; gap: 10px; align-items: center; }

  .am-save-btn {
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    color: #374151;
    font-size: 12px;
    padding: 7px 12px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .am-save-btn:hover:not(:disabled) { background: #f9fafb; border-color: #9ca3af; }
  .am-save-btn:disabled { opacity: 0.5; cursor: wait; }
  .am-save-btn.dirty {
    background: #2563eb;
    border-color: #2563eb;
    color: #ffffff;
  }
  .am-save-btn.dirty:hover:not(:disabled) { background: #1d4ed8; border-color: #1d4ed8; }

  .am-save-flash {
    font-size: 12px;
    color: #047857;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .am-save-flash.shown { opacity: 1; }
`;
