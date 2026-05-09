import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, CARS_TABLE } from '../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

export default function CarsGallery() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const headingRef = useRef(null);
  const trackRef = useRef(null);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch latest cars
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from(CARS_TABLE)
        .select('id, title, description, image_url, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      if (cancelled) return;
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setCars(data ?? []);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  // Reveal animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = (trigger) => ({ trigger, start: 'top 82%', toggleActions: 'play none none reverse' });
      gsap.fromTo(labelRef.current,   { y: 20, opacity: 0 },           { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', scrollTrigger: st(labelRef.current)   });
      gsap.fromTo(headingRef.current, { y: 50, opacity: 0, skewY: 2 }, { y: 0, opacity: 1, skewY: 0, duration: 1, ease: 'power3.out', scrollTrigger: st(headingRef.current) });
    }, sectionRef);

    return () => ctx.revert();
  }, [cars.length]);

  const scrollByOne = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.cg-card');
    if (!card) return;
    const cardWidth = card.getBoundingClientRect().width + 24; // gap
    track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.cg-card');
    if (!card) return;
    const cardWidth = card.getBoundingClientRect().width + 24;
    setActiveIndex(Math.round(track.scrollLeft / cardWidth));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');

        .cg-wrap {
          background: #060606;
          color: #e8e3da;
          font-family: 'DM Sans', sans-serif;
          padding: 120px 24px;
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        @media (max-width: 640px) { .cg-wrap { padding: 80px 16px; } }

        .cg-orb {
          position: absolute; top: -120px; left: -100px;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .cg-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }

        .cg-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase;
          color: #c9a84c; margin-bottom: 20px;
          display: flex; align-items: center; gap: 14px;
        }
        .cg-eyebrow::after {
          content: ''; display: block; height: 1px; width: 40px;
          background: #c9a84c; opacity: 0.5;
        }

        .cg-heading {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(48px, 7vw, 88px);
          line-height: 0.9; letter-spacing: -0.01em;
          color: #e8e3da; margin-bottom: 0;
        }
        .cg-heading em { font-style: italic; color: #c9a84c; }

        .cg-rule {
          height: 1px; width: 100%;
          background: linear-gradient(90deg, rgba(201,168,76,0.5), transparent);
          margin: 36px 0 0;
        }

        .cg-controls {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 56px; margin-bottom: 24px; gap: 16px;
        }

        .cg-progress {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(232,227,218,0.5);
        }
        .cg-progress strong { color: #c9a84c; font-weight: 400; }

        .cg-arrows { display: flex; gap: 8px; }

        .cg-arrow {
          width: 44px; height: 44px;
          background: transparent;
          border: 1px solid rgba(201,168,76,0.35);
          color: #e8e3da;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.3s, color 0.3s, border-color 0.3s;
        }
        .cg-arrow:hover {
          background: #c9a84c; color: #060606; border-color: #c9a84c;
        }
        .cg-arrow:disabled { opacity: 0.35; cursor: not-allowed; }

        .cg-track {
          display: flex; gap: 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 12px;
        }
        .cg-track::-webkit-scrollbar { display: none; }

        .cg-card {
          flex: 0 0 calc((100% - 48px) / 3);
          min-width: 0;
          scroll-snap-align: start;
          background: #0c0c0c;
          border: 1px solid rgba(255,255,255,0.05);
          display: flex; flex-direction: column;
          transition: border-color 0.3s, transform 0.3s;
        }
        .cg-card:hover { border-color: rgba(201,168,76,0.35); transform: translateY(-4px); }

        @media (max-width: 1000px) {
          .cg-card { flex: 0 0 calc((100% - 24px) / 2); }
        }
        @media (max-width: 640px) {
          .cg-card { flex: 0 0 85%; }
        }

        .cg-img-wrap {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: #050505;
        }

        .cg-img-wrap::before, .cg-img-wrap::after {
          content: ''; position: absolute; width: 16px; height: 16px;
          z-index: 2; pointer-events: none;
        }
        .cg-img-wrap::before { top: 0; left: 0; border-top: 1px solid #c9a84c; border-left: 1px solid #c9a84c; }
        .cg-img-wrap::after  { bottom: 0; right: 0; border-bottom: 1px solid #c9a84c; border-right: 1px solid #c9a84c; }

        .cg-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          filter: grayscale(40%);
          transition: filter 0.6s ease, transform 0.8s ease;
        }
        .cg-card:hover .cg-img { filter: grayscale(0%); transform: scale(1.04); }

        .cg-body {
          padding: 24px 22px 26px;
          display: flex; flex-direction: column; gap: 8px;
          flex: 1;
        }

        .cg-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600; font-size: 22px;
          line-height: 1.2; letter-spacing: 0.01em;
          color: #e8e3da;
        }

        .cg-desc {
          font-size: 13px; line-height: 1.7;
          color: rgba(232,227,218,0.55); font-weight: 300;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .cg-meta {
          margin-top: auto; padding-top: 16px;
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(201,168,76,0.55);
        }

        .cg-empty {
          padding: 80px 24px;
          text-align: center;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 18px;
          color: rgba(232,227,218,0.4);
          border: 1px dashed rgba(255,255,255,0.06);
          margin-top: 48px;
        }
      `}</style>

      <section id="cars" className="cg-wrap" ref={sectionRef}>
        <div className="cg-orb" aria-hidden="true" />

        <div className="cg-inner">
          <p className="cg-eyebrow" ref={labelRef}>The Fleet</p>
          <h2 className="cg-heading" ref={headingRef}>
            Latest <em>Arrivals</em>
          </h2>
          <div className="cg-rule" />

          {loading && (
            <div className="cg-empty">Loading the fleet…</div>
          )}

          {!loading && error && (
            <div className="cg-empty">Unable to load cars right now.</div>
          )}

          {!loading && !error && cars.length === 0 && (
            <div className="cg-empty">No cars in the showroom yet — check back soon.</div>
          )}

          {!loading && !error && cars.length > 0 && (
            <>
              <div className="cg-controls">
                <span className="cg-progress">
                  <strong>{String(Math.min(activeIndex + 1, cars.length)).padStart(2, '0')}</strong>
                  {' / '}
                  {String(cars.length).padStart(2, '0')}
                </span>
                <div className="cg-arrows">
                  <button
                    className="cg-arrow"
                    onClick={() => scrollByOne(-1)}
                    aria-label="Previous car"
                    disabled={activeIndex === 0}
                  >
                    <ChevronLeft size={18} strokeWidth={1.5} />
                  </button>
                  <button
                    className="cg-arrow"
                    onClick={() => scrollByOne(1)}
                    aria-label="Next car"
                  >
                    <ChevronRight size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <div className="cg-track" ref={trackRef} onScroll={onScroll}>
                {cars.map((car) => (
                  <article key={car.id} className="cg-card">
                    <div className="cg-img-wrap">
                      <img
                        src={car.image_url}
                        alt={car.title}
                        loading="lazy"
                        className="cg-img"
                      />
                    </div>
                    <div className="cg-body">
                      <h3 className="cg-title">{car.title}</h3>
                      {car.description && <p className="cg-desc">{car.description}</p>}
                      <p className="cg-meta">
                        {new Date(car.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
