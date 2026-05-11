// Shared admin tab CSS — imported as a `<style>` block from each manager so
// you can edit once and have it apply across Cars/Gallery/Content tabs.
export const ADMIN_STYLES = `
  .am-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase;
    color: #c9a84c; margin-bottom: 12px;
  }

  .am-heading {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300; font-size: clamp(32px, 4.5vw, 48px);
    line-height: 1; letter-spacing: -0.01em;
    margin-bottom: 32px;
  }
  .am-heading em { font-style: italic; color: #c9a84c; }

  .am-grid {
    display: grid;
    grid-template-columns: minmax(320px, 1fr) 2fr;
    gap: 36px;
    align-items: start;
  }
  @media (max-width: 900px) { .am-grid { grid-template-columns: 1fr; } }

  .am-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    padding: 28px;
  }
  .am-card h2 {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600; font-size: 22px;
    margin-bottom: 18px;
    color: #e8e3da;
  }

  .am-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .am-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
    color: rgba(201,168,76,0.6);
  }

  .am-input, .am-textarea {
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
  .am-input::placeholder, .am-textarea::placeholder { color: rgba(232,227,218,0.25); }
  .am-input:focus, .am-textarea:focus {
    border-color: rgba(201,168,76,0.6);
    background: rgba(201,168,76,0.04);
  }
  .am-textarea { resize: vertical; min-height: 100px; }

  .am-drop {
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
  .am-drop:hover { border-color: rgba(201,168,76,0.7); background: rgba(201,168,76,0.06); }
  .am-drop input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .am-drop-icon { color: #c9a84c; margin: 0 auto 8px; }
  .am-drop-hint {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(201,168,76,0.55); margin-top: 6px;
  }

  .am-preview {
    display: flex; gap: 12px; align-items: center;
    margin-top: 12px;
    padding: 10px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
  }
  .am-preview img { width: 64px; height: 64px; object-fit: cover; }
  .am-preview-meta { flex: 1; min-width: 0; }
  .am-preview-name { font-size: 12px; color: #e8e3da; word-break: break-all; }
  .am-preview-size {
    font-size: 10px; color: rgba(232,227,218,0.4);
    margin-top: 2px; font-family: 'DM Mono', monospace;
  }

  .am-btn {
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
  .am-btn::before {
    content: ''; position: absolute; inset: 0; background: #c9a84c;
    transform: translateX(-101%);
    transition: transform 0.45s cubic-bezier(0.77,0,0.18,1);
  }
  .am-btn:hover:not(:disabled)::before { transform: translateX(0); }
  .am-btn:hover:not(:disabled) { color: #060606; border-color: #c9a84c; }
  .am-btn:disabled { opacity: 0.5; cursor: wait; }
  .am-btn > * { position: relative; z-index: 1; }

  .am-status {
    margin-top: 14px;
    padding: 10px 14px;
    font-size: 12px;
    display: flex; align-items: center; gap: 10px;
    border-left: 1px solid;
  }
  .am-status-ok  { background: rgba(201,168,76,0.06); color: #c9a84c;             border-color: rgba(201,168,76,0.5); }
  .am-status-err { background: rgba(220,80,80,0.05); color: rgba(220,140,140,0.95); border-color: rgba(220,80,80,0.5); }

  .am-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }

  .am-item {
    background: #0c0c0c;
    border: 1px solid rgba(255,255,255,0.06);
    display: flex; flex-direction: column;
    transition: border-color 0.3s;
  }
  .am-item:hover { border-color: rgba(201,168,76,0.3); }

  .am-item-img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block; background: #050505; }
  .am-item-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 5px; }
  .am-item-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600; font-size: 17px; line-height: 1.2; color: #e8e3da;
  }
  .am-item-desc {
    font-size: 12px; color: rgba(232,227,218,0.5); line-height: 1.6;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .am-item-meta {
    font-family: 'DM Mono', monospace;
    font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(201,168,76,0.55); margin-top: 4px;
  }
  .am-item-actions { padding: 0 14px 14px; }

  .am-del {
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
  .am-del:hover { background: rgba(220,80,80,0.12); color: #f1bcbc; }

  .am-empty {
    padding: 50px 20px;
    text-align: center;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    color: rgba(232,227,218,0.4);
    border: 1px dashed rgba(255,255,255,0.06);
  }

  .am-row-head {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 18px;
  }
  .am-row-head h2 {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600; font-size: 22px; color: #e8e3da;
  }

  /* Content tab */
  .am-content-list { display: flex; flex-direction: column; gap: 14px; }
  .am-content-row {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    padding: 18px 20px;
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
    font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
    color: #c9a84c;
  }
  .am-content-key-desc {
    font-size: 12px;
    color: rgba(232,227,218,0.45);
    line-height: 1.5;
  }

  .am-save-row { display: flex; gap: 10px; align-items: center; }

  .am-save-btn {
    background: transparent;
    border: 1px solid rgba(201,168,76,0.45);
    color: #c9a84c;
    font-family: 'DM Mono', monospace;
    font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
    padding: 9px 14px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    white-space: nowrap;
  }
  .am-save-btn:hover:not(:disabled) { background: #c9a84c; color: #060606; }
  .am-save-btn:disabled { opacity: 0.4; cursor: wait; }
  .am-save-btn.dirty { border-color: #c9a84c; }
  .am-save-flash { font-size: 11px; color: #c9a84c; opacity: 0; transition: opacity 0.3s; font-family: 'DM Mono', monospace; letter-spacing: 0.2em; text-transform: uppercase; }
  .am-save-flash.shown { opacity: 1; }
`;
