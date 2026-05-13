import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase, TEAM_TABLE } from '../lib/supabase';
import { useSiteContent } from '../lib/useSiteContent';

gsap.registerPlugin(ScrollTrigger);

export default function Team() {
  const t = useSiteContent();
  const containerRef = useRef(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const visible = t('team.visible', 'true') !== 'false';

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from(TEAM_TABLE)
        .select('id, name, role, bio, image_url, created_at')
        .order('created_at', { ascending: true });
      if (!mounted) return;
      if (!error) setMembers(data ?? []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!members.length) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.tm-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            delay: (i % 4) * 0.08,
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, [members]);

  if (!visible) return null;
  if (loading) return null;
  if (members.length === 0) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400&display=swap');

        .tm-section {
          background: #060606; color: #e4dfd6;
          font-family: 'DM Sans', sans-serif;
          padding: 100px 24px 140px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        @media (max-width: 640px) {
          .tm-section { padding: 60px 16px 80px; }
        }

        .tm-inner { max-width: 1100px; margin: 0 auto; }

        .tm-eyebrow {
          display: flex; align-items: center; gap: 16px; margin-bottom: 28px;
        }
        .tm-eyebrow span {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.45em; text-transform: uppercase;
          color: rgba(201,168,76,0.7);
        }
        .tm-eyebrow::after {
          content: ''; display: block; height: 1px; flex: 1;
          background: linear-gradient(90deg, rgba(201,168,76,0.25), transparent);
        }

        .tm-headline {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(32px, 4.5vw, 54px);
          line-height: 1; letter-spacing: -0.01em;
          color: #e4dfd6;
          margin-bottom: 12px;
        }
        .tm-headline em { font-style: italic; color: #c9a84c; }

        .tm-lede {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-weight: 300;
          font-size: 17px; line-height: 1.7;
          color: rgba(228,223,214,0.55);
          max-width: 560px;
          margin-bottom: 64px;
        }

        .tm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 36px 28px;
        }
        @media (max-width: 640px) {
          .tm-grid { grid-template-columns: repeat(2, 1fr); gap: 24px 16px; }
        }

        .tm-card {
          display: flex; flex-direction: column;
        }

        .tm-img-wrap {
          position: relative;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: #0c0c0c;
          margin-bottom: 18px;
        }
        .tm-img-wrap::before, .tm-img-wrap::after {
          content: ''; position: absolute;
          width: 16px; height: 16px; z-index: 2; pointer-events: none;
          transition: width 0.4s ease, height 0.4s ease;
        }
        .tm-img-wrap::before {
          top: 0; left: 0;
          border-top: 1px solid #c9a84c; border-left: 1px solid #c9a84c;
        }
        .tm-img-wrap::after {
          bottom: 0; right: 0;
          border-bottom: 1px solid #c9a84c; border-right: 1px solid #c9a84c;
        }
        .tm-img-wrap:hover::before, .tm-img-wrap:hover::after {
          width: 24px; height: 24px;
        }

        .tm-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          filter: grayscale(70%); opacity: 0.85;
          transition: filter 0.7s ease, opacity 0.7s ease, transform 0.9s ease;
        }
        .tm-img-wrap:hover .tm-img {
          filter: grayscale(0%); opacity: 1; transform: scale(1.03);
        }

        .tm-name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600; font-size: 22px;
          line-height: 1.15; color: #e4dfd6;
          margin-bottom: 6px;
        }
        @media (max-width: 640px) { .tm-name { font-size: 19px; } }

        .tm-role {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.32em; text-transform: uppercase;
          color: rgba(201,168,76,0.75);
          margin-bottom: 10px;
        }

        .tm-bio {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-weight: 300;
          font-size: 14px; line-height: 1.65;
          color: rgba(228,223,214,0.5);
        }
      `}</style>

      <section id="team" className="tm-section" ref={containerRef}>
        <div className="tm-inner">
          <h2 className="tm-eyebrow">
            <span>The Team</span>
          </h2>

          <h3 className="tm-headline">
            People behind <em>Prestige</em>
          </h3>
          <p className="tm-lede">
            A small, deliberate team of specialists in sourcing, logistics, and after-sale care — operating across Warsaw and Marseille.
          </p>

          <div className="tm-grid">
            {members.map((m) => (
              <article key={m.id} className="tm-card">
                <div className="tm-img-wrap">
                  <img
                    src={m.image_url}
                    alt={m.name}
                    loading="lazy"
                    className="tm-img"
                  />
                </div>
                <h4 className="tm-name">{m.name}</h4>
                {m.role && <p className="tm-role">{m.role}</p>}
                {m.bio && <p className="tm-bio">{m.bio}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
