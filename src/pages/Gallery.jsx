import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, GALLERY_TABLE } from '../lib/supabase';

export default function Gallery() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialIndex = parseInt(searchParams.get('i') ?? '', 10);
  const [activeIndex, setActiveIndex] = useState(
    Number.isFinite(initialIndex) ? initialIndex : null
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from(GALLERY_TABLE)
        .select('id, title, description, image_url, created_at')
        .order('created_at', { ascending: false });

      if (cancelled) return;
      if (error) {
        setError(error.message);
      } else {
        setImages(data ?? []);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const close = useCallback(() => {
    setActiveIndex(null);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const open = (i) => {
    setActiveIndex(i);
    setSearchParams({ i: String(i) }, { replace: true });
  };

  const next = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  // Keyboard nav for the lightbox
  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, close, next, prev]);

  const active = activeIndex !== null && images[activeIndex];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');

        .gp-wrap {
          min-height: 100vh;
          background: #060606;
          color: #e8e3da;
          font-family: 'DM Sans', sans-serif;
          padding: 60px 24px 100px;
        }
        @media (max-width: 640px) { .gp-wrap { padding: 40px 16px 80px; } }

        .gp-inner { max-width: 1400px; margin: 0 auto; }

        .gp-back {
          display: inline-flex; align-items: center; gap: 8px;
          color: rgba(232,227,218,0.5);
          text-decoration: none;
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          transition: color 0.2s;
          margin-bottom: 36px;
        }
        .gp-back:hover { color: #c9a84c; }

        .gp-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase;
          color: #c9a84c; margin-bottom: 12px;
          display: flex; align-items: center; gap: 12px;
        }
        .gp-eyebrow::after {
          content: ''; display: block; height: 1px; width: 40px;
          background: #c9a84c; opacity: 0.5;
        }

        .gp-heading {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(48px, 7vw, 88px);
          line-height: 0.9; letter-spacing: -0.01em;
          margin-bottom: 8px;
        }
        .gp-heading em { font-style: italic; color: #c9a84c; }

        .gp-sub {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-weight: 300;
          font-size: 18px; color: rgba(232,227,218,0.45);
          margin-bottom: 56px;
        }

        .gp-rule {
          height: 1px; width: 100%;
          background: linear-gradient(90deg, rgba(201,168,76,0.4), transparent);
          margin: 16px 0 56px;
        }

        .gp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }

        .gp-tile {
          position: relative;
          aspect-ratio: 4 / 3;
          background: #0c0c0c;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.04);
          transition: border-color 0.3s, transform 0.3s;
        }
        .gp-tile:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-3px); }

        .gp-tile img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          filter: grayscale(35%);
          transition: filter 0.6s ease, transform 0.7s ease;
        }
        .gp-tile:hover img { filter: none; transform: scale(1.06); }

        .gp-tile-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.85) 100%);
          opacity: 0;
          transition: opacity 0.3s;
          padding: 14px 16px;
          display: flex; align-items: flex-end;
          pointer-events: none;
        }
        .gp-tile:hover .gp-tile-overlay { opacity: 1; }

        .gp-tile-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600; font-size: 17px;
          color: #e8e3da;
        }

        .gp-empty {
          padding: 80px 24px;
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 18px;
          color: rgba(232,227,218,0.4);
          border: 1px dashed rgba(255,255,255,0.06);
        }

        /* Lightbox */
        .gp-lb {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.95);
          backdrop-filter: blur(10px);
          z-index: 100;
          display: flex; flex-direction: column;
          padding: 24px;
        }

        .gp-lb-bar {
          display: flex; align-items: center; justify-content: space-between;
          color: rgba(232,227,218,0.6);
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
        }

        .gp-lb-counter strong { color: #c9a84c; font-weight: 400; }

        .gp-lb-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(232,227,218,0.6);
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .gp-lb-btn:hover { border-color: rgba(201,168,76,0.6); color: #c9a84c; }

        .gp-lb-stage {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          position: relative;
          margin: 18px 0;
          min-height: 0;
        }

        .gp-lb-img {
          max-width: min(1200px, 100%);
          max-height: 100%;
          object-fit: contain;
          display: block;
        }

        .gp-lb-arrow {
          position: absolute;
          top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(201,168,76,0.35);
          color: #e8e3da;
          width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .gp-lb-arrow:hover { background: #c9a84c; color: #060606; border-color: #c9a84c; }
        .gp-lb-arrow.prev { left: 8px; }
        .gp-lb-arrow.next { right: 8px; }

        .gp-lb-meta {
          color: #e8e3da;
          text-align: center;
        }
        .gp-lb-meta h3 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600; font-size: 24px;
          margin-bottom: 6px;
        }
        .gp-lb-meta p {
          font-size: 13px;
          color: rgba(232,227,218,0.55);
          max-width: 720px; margin: 0 auto;
          line-height: 1.7;
        }
      `}</style>

      <div className="gp-wrap">
        <div className="gp-inner">
          <a
            href="/"
            className="gp-back"
            onClick={(e) => { e.preventDefault(); navigate('/#gallery'); }}
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to site
          </a>

          <p className="gp-eyebrow">Full Gallery</p>
          <h1 className="gp-heading">The <em>Collection</em></h1>
          <p className="gp-sub">Every angle. Every detail. Hand-curated.</p>
          <div className="gp-rule" />

          {loading && <div className="gp-empty">Loading gallery…</div>}
          {!loading && error && <div className="gp-empty">Couldn't load the gallery.</div>}
          {!loading && !error && images.length === 0 && (
            <div className="gp-empty">The gallery is currently being curated. Check back soon.</div>
          )}

          {!loading && !error && images.length > 0 && (
            <div className="gp-grid">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  className="gp-tile"
                  onClick={() => open(i)}
                  aria-label={`Open image: ${img.title || 'Gallery image'}`}
                >
                  <img src={img.image_url} alt={img.title || 'Gallery image'} loading="lazy" />
                  {img.title && (
                    <div className="gp-tile-overlay">
                      <span className="gp-tile-title">{img.title}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {active && (
          <div className="gp-lb" role="dialog" aria-modal="true" onClick={close}>
            <div className="gp-lb-bar" onClick={(e) => e.stopPropagation()}>
              <span className="gp-lb-counter">
                <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
                {' / '}
                {String(images.length).padStart(2, '0')}
              </span>
              <button className="gp-lb-btn" onClick={close} aria-label="Close">
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className="gp-lb-stage" onClick={(e) => e.stopPropagation()}>
              <button
                className="gp-lb-arrow prev"
                onClick={prev}
                aria-label="Previous image"
              >
                <ChevronLeft size={22} strokeWidth={1.5} />
              </button>
              <img src={active.image_url} alt={active.title || 'Gallery image'} className="gp-lb-img" />
              <button
                className="gp-lb-arrow next"
                onClick={next}
                aria-label="Next image"
              >
                <ChevronRight size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div className="gp-lb-meta" onClick={(e) => e.stopPropagation()}>
              {active.title && <h3>{active.title}</h3>}
              {active.description && <p>{active.description}</p>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
