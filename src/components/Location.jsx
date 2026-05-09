import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MAPS_EMBED =
  "https://maps.google.com/maps?q=Zaciszna%2021%2F1%2C%2005-092%20Sadowa%2C%20Polska&t=&z=16&ie=UTF8&iwloc=&output=embed";

const details = [
  { label: "Address",      value: ["Zaciszna 21/1", "05-092 Sadowa, Polska"],            mono: false },
  { label: "Coordinates",  value: ["52.3580° N, 20.8510° E"],                            mono: true  },
  { label: "Availability", value: ["Mon – Sat  ·  10:00 – 19:00", "By appointment only"], mono: false },
];

export default function Location() {
  const sectionRef  = useRef(null);
  const labelRef    = useRef(null);
  const headingRef  = useRef(null);
  const lineRef     = useRef(null);
  const bodyRef     = useRef(null);
  const detailsRef  = useRef(null);
  const btnRef      = useRef(null);
  const mapRef      = useRef(null);
  const [mapHovered, setMapHovered] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = (trigger) => ({ trigger, start: "top 82%", toggleActions: "play none none reverse" });

      gsap.fromTo(labelRef.current,   { y: 20, opacity: 0 },                { y: 0, opacity: 1, duration: 0.7, ease: "power2.out",  scrollTrigger: st(labelRef.current)   });
      gsap.fromTo(headingRef.current, { y: 50, opacity: 0, skewY: 2 },      { y: 0, opacity: 1, skewY: 0, duration: 1, ease: "power3.out",  scrollTrigger: st(headingRef.current) });
      gsap.fromTo(lineRef.current,    { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.8, ease: "power2.inOut", scrollTrigger: st(lineRef.current)  });
      gsap.fromTo(bodyRef.current,    { y: 30, opacity: 0 },                { y: 0, opacity: 1, duration: 0.8, ease: "power2.out",  scrollTrigger: st(bodyRef.current)    });
      gsap.fromTo(btnRef.current,     { y: 20, opacity: 0 },                { y: 0, opacity: 1, duration: 0.6, ease: "power2.out",  scrollTrigger: st(btnRef.current)     });
      gsap.fromTo(mapRef.current,     { x: 60, opacity: 0 },                { x: 0, opacity: 1, duration: 1.1, ease: "power3.out",  scrollTrigger: st(mapRef.current)     });

      gsap.utils.toArray(".loc-detail").forEach((el, i) => {
        gsap.fromTo(el, { x: -24, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.6, delay: i * 0.12, ease: "power2.out",
          scrollTrigger: st(el),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400;500&display=swap');

        .loc-wrap {
          background: #060606;
          color: #e8e3da;
          font-family: 'DM Sans', sans-serif;
          padding: 120px 24px;
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        @media (max-width: 640px) {
          .loc-wrap { padding: 80px 16px; }
        }

        .loc-texture {
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            -55deg, transparent, transparent 80px,
            rgba(255,255,255,0.012) 80px, rgba(255,255,255,0.012) 81px
          );
          pointer-events: none; z-index: 0;
        }

        .loc-orb {
          position: absolute; top: -120px; right: -80px;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .loc-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

        .loc-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase;
          color: #c9a84c; margin-bottom: 20px;
          display: flex; align-items: center; gap: 14px;
        }

        .loc-eyebrow::after {
          content: ''; display: block; height: 1px; width: 40px;
          background: #c9a84c; opacity: 0.5;
        }

        .loc-heading {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(48px, 7vw, 88px);
          line-height: 0.9; letter-spacing: -0.01em;
          color: #e8e3da; margin-bottom: 0;
        }

        .loc-heading em { font-style: italic; color: #c9a84c; }

        .loc-rule {
          height: 1px; width: 100%;
          background: linear-gradient(90deg, rgba(201,168,76,0.5), transparent);
          margin: 36px 0 0;
        }

        .loc-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 72px; align-items: center; margin-top: 72px;
        }

        @media (max-width: 900px) {
          .loc-grid { grid-template-columns: 1fr; gap: 48px; margin-top: 48px; }
        }

        .loc-body {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: 19px; line-height: 1.75;
          color: rgba(232,227,218,0.55); max-width: 420px;
          margin-bottom: 44px; font-style: italic;
        }

        .loc-details {
          display: flex; flex-direction: column; gap: 28px;
          border-left: 1px solid rgba(201,168,76,0.2);
          padding-left: 24px; margin-bottom: 44px;
        }

        .loc-detail-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase;
          color: rgba(201,168,76,0.6); margin-bottom: 6px;
        }

        .loc-detail-value {
          font-size: 13px; font-weight: 300;
          color: rgba(232,227,218,0.75); line-height: 1.7; letter-spacing: 0.03em;
        }

        .loc-detail-value.mono {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: #c9a84c; letter-spacing: 0.06em;
        }

        .loc-btn {
          position: relative; display: inline-flex; align-items: center; gap: 14px;
          padding: 14px 28px; background: transparent;
          border: 1px solid rgba(201,168,76,0.35); color: #e8e3da;
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.3em; text-transform: uppercase;
          cursor: pointer; overflow: hidden; transition: color 0.4s;
        }

        .loc-btn::before {
          content: ''; position: absolute; inset: 0; background: #c9a84c;
          transform: translateX(-101%); transition: transform 0.45s cubic-bezier(0.77,0,0.18,1);
        }

        .loc-btn:hover::before { transform: translateX(0); }
        .loc-btn:hover { color: #060606; border-color: #c9a84c; }
        .loc-btn span { position: relative; z-index: 1; }

        .loc-btn-arrow { position: relative; z-index: 1; font-size: 16px; transition: transform 0.3s; }
        .loc-btn:hover .loc-btn-arrow { transform: translateX(4px); }

        .loc-map-shell {
          position: relative; height: 500px;
          background: #0c0c0c; border: 1px solid rgba(255,255,255,0.06); overflow: hidden;
        }

        @media (max-width: 640px) {
          .loc-map-shell { height: 320px; }
        }

        .loc-map-shell::before, .loc-map-shell::after {
          content: ''; position: absolute; width: 20px; height: 20px; z-index: 3; pointer-events: none;
        }

        .loc-map-shell::before { top: 0; left: 0; border-top: 1px solid #c9a84c; border-left: 1px solid #c9a84c; }
        .loc-map-shell::after  { bottom: 0; right: 0; border-bottom: 1px solid #c9a84c; border-right: 1px solid #c9a84c; }

        .loc-map-iframe {
          width: 100%; height: 100%; border: 0; display: block;
          transition: filter 0.9s ease, opacity 0.9s ease;
        }

        .loc-map-iframe.idle   { filter: grayscale(95%) contrast(1.2) brightness(0.7); opacity: 0.55; }
        .loc-map-iframe.active { filter: none; opacity: 1; }

        .loc-map-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(6,6,6,0.35) 0%, transparent 60%);
          pointer-events: none; z-index: 2; transition: opacity 0.9s ease;
        }

        .loc-map-overlay.hidden { opacity: 0; }

        .loc-map-badge {
          position: absolute; bottom: 18px; left: 18px; z-index: 4;
          background: rgba(6,6,6,0.85); border: 1px solid rgba(201,168,76,0.25);
          padding: 8px 14px; display: flex; align-items: center; gap: 8px;
          pointer-events: none; backdrop-filter: blur(4px);
        }

        .loc-map-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #c9a84c;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        .loc-map-badge-text {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(232,227,218,0.6);
        }

        .loc-map-hint {
          position: absolute; top: 18px; right: 18px; z-index: 4;
          font-family: 'DM Mono', monospace; font-size: 9px;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(201,168,76,0.5); pointer-events: none; transition: opacity 0.5s;
        }

        .loc-map-hint.hidden { opacity: 0; }
      `}</style>

      <section id="location" className="loc-wrap" ref={sectionRef}>
        <div className="loc-texture" aria-hidden="true" />
        <div className="loc-orb"     aria-hidden="true" />

        <div className="loc-inner">
          <p className="loc-eyebrow" ref={labelRef}>Our Location</p>
          <h2 className="loc-heading" ref={headingRef}>
            The<br /><em>Headquarters</em>
          </h2>
          <div className="loc-rule" ref={lineRef} />

          <div className="loc-grid">
            {/* Left */}
            <div>
              <p className="loc-body" ref={bodyRef}>
                Our primary showroom and engineering atelier — visits are strictly by appointment,
                ensuring the absolute discretion our clients expect.
              </p>

              <div className="loc-details" ref={detailsRef}>
                {details.map((d, i) => (
                  <div key={i} className="loc-detail">
                    <p className="loc-detail-label">{d.label}</p>
                    {d.value.map((line, j) => (
                      <p key={j} className={`loc-detail-value${d.mono ? " mono" : ""}`}>{line}</p>
                    ))}
                  </div>
                ))}
              </div>

              <div ref={btnRef}>
                <button className="loc-btn">
                  <span>Request Appointment</span>
                  <span className="loc-btn-arrow">→</span>
                </button>
              </div>
            </div>

            {/* Map */}
            <div
              ref={mapRef}
              className="loc-map-shell"
              onMouseEnter={() => setMapHovered(true)}
              onMouseLeave={() => setMapHovered(false)}
            >
              <iframe
                src={MAPS_EMBED}
                title="Prestige Location"
                className={`loc-map-iframe ${mapHovered ? "active" : "idle"}`}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className={`loc-map-overlay ${mapHovered ? "hidden" : ""}`} aria-hidden="true" />
              <div className="loc-map-badge" aria-hidden="true">
                <div className="loc-map-dot" />
                <span className="loc-map-badge-text">Showroom</span>
              </div>
              <div className={`loc-map-hint ${mapHovered ? "hidden" : ""}`} aria-hidden="true">
                Hover to explore
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
