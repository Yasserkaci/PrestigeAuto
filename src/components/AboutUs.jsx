import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const sections = [
  {
    index: "01",
    title: "ESTABLISHED\nIN 2020",
    sub: "Six Years of Precision",
    text: "Prestige Company brings over six years of expertise in the automotive industry, specializing in the sale of new and used vehicles across Poland and Europe. Quality, reliability, and absolute customer satisfaction remain our guiding principles.",
    img: "/about/about1.jpg",
  },
  {
    index: "02",
    title: "WARSAW\n& MARSEILLE",
    sub: "A Continental Presence",
    text: "Headquartered in Warsaw, with a partner showroom in Marseille that serves as our strategic delivery and collection point for vehicles exported to North Africa — making international acquisition seamless for clients across borders.",
    img: "/about/about2.jpg",
  },
  {
    index: "03",
    title: "GERMAN\nMASTERY",
    sub: "Premium Marques",
    text: "We specialize in BMW, Audi, Mercedes-Benz, and Volkswagen — the pinnacle of German automotive engineering. Through bespoke orders we can also source virtually any other marque, built to each client's exact specification.",
    img: "/about/about3.jpg",
  },
  {
    index: "04",
    title: "DRIVEN BY\nTRUST",
    sub: "Sales · Export · Rental",
    text: "Beyond sales and international export, we offer professional car rental for individuals and businesses seeking comfort, flexibility, and the unmistakable feel of prestige. Driven by trust, powered by Prestige.",
    img: "/about/about4.jpg",
  },
];

export default function AboutUs() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.ab-row').forEach((row) => {
        const img     = row.querySelector('.ab-img-wrap');
        const imgEl   = row.querySelector('.ab-img');
        const indexEl = row.querySelector('.ab-index');
        const subEl   = row.querySelector('.ab-sub');
        const heading = row.querySelector('.ab-heading');
        const rule    = row.querySelector('.ab-rule');
        const para    = row.querySelector('.ab-para');

        gsap.set([heading, para], { text: '' });
        gsap.set([indexEl, subEl, rule], { opacity: 0, y: 20 });
        gsap.set(img,   { opacity: 0, x: row.classList.contains('ab-row--reverse') ? 60 : -60 });
        gsap.set(imgEl, { scale: 1.12 });

        gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 78%', toggleActions: 'play none none none' },
        })
          .to(img,     { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out' })
          .to(imgEl,   { scale: 1,   duration: 1.2, ease: 'power3.out' }, '<')
          .to(indexEl, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.6')
          .to(subEl,   { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35')
          .to(heading, { text: { value: heading.getAttribute('data-text') }, duration: 0.7, ease: 'none' }, '-=0.2')
          .to(rule,    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.1')
          .to(para,    { text: { value: para.getAttribute('data-text') }, duration: 0.8, ease: 'none' }, '-=0.1');
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400&display=swap');

        .ab-section {
          background: #060606; color: #e4dfd6;
          font-family: 'DM Sans', sans-serif;
          padding: 100px 24px 140px; overflow: hidden;
        }

        @media (max-width: 640px) {
          .ab-section { padding: 60px 16px 80px; }
          .ab-section-label { margin-bottom: 40px !important; }
        }

        .ab-inner { max-width: 1100px; margin: 0 auto; }

        .ab-section-label {
          display: flex; align-items: center; gap: 16px; margin-bottom: 80px;
        }

        .ab-section-label span {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.45em; text-transform: uppercase;
          color: rgba(201,168,76,0.7);
        }

        .ab-section-label::after {
          content: ''; display: block; height: 1px; flex: 1;
          background: linear-gradient(90deg, rgba(201,168,76,0.25), transparent);
        }

        .ab-row {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center; padding: 64px 0;
          border-top: 1px solid rgba(255,255,255,0.05); position: relative;
        }

        .ab-row--reverse { direction: rtl; }
        .ab-row--reverse > * { direction: ltr; }

        @media (max-width: 800px) {
          .ab-row { grid-template-columns: 1fr; direction: ltr; gap: 32px; padding: 40px 0; }
          .ab-row--reverse > * { direction: ltr; }
        }

        .ab-img-wrap {
          position: relative; aspect-ratio: 3 / 4;
          overflow: hidden; background: #0c0c0c;
        }

        .ab-img-wrap::before, .ab-img-wrap::after {
          content: ''; position: absolute; width: 18px; height: 18px; z-index: 2; pointer-events: none;
        }

        .ab-img-wrap::before { top: 0; left: 0; border-top: 1px solid #c9a84c; border-left: 1px solid #c9a84c; }
        .ab-img-wrap::after  { bottom: 0; right: 0; border-bottom: 1px solid #c9a84c; border-right: 1px solid #c9a84c; }

        .ab-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: grayscale(60%); opacity: 0.8;
          transition: filter 0.8s ease, opacity 0.8s ease;
        }

        .ab-img-wrap:hover .ab-img { filter: grayscale(0%); opacity: 1; }

        .ab-img-num {
          position: absolute; bottom: 16px; left: 16px;
          font-family: 'Cormorant Garamond', serif; font-size: 80px;
          font-weight: 600; line-height: 1;
          color: rgba(201,168,76,0.12); pointer-events: none; z-index: 2; user-select: none;
        }

        .ab-text { display: flex; flex-direction: column; gap: 0; }

        .ab-index {
          font-family: 'DM Mono', monospace; font-size: 9px;
          letter-spacing: 0.4em; text-transform: uppercase;
          color: rgba(201,168,76,0.55); margin-bottom: 10px;
        }

        .ab-sub {
          font-family: 'DM Mono', monospace; font-size: 9px;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(228,223,214,0.3); margin-bottom: 18px;
        }

        .ab-heading {
          font-family: 'Cormorant Garamond', serif; font-weight: 600;
          font-size: clamp(34px, 4.5vw, 58px); line-height: 1.0;
          letter-spacing: 0.04em; color: #e4dfd6;
          text-transform: uppercase; white-space: pre-line;
          min-height: 2.1em; margin-bottom: 0;
        }

        .ab-rule {
          height: 1px; width: 48px;
          background: linear-gradient(90deg, #c9a84c, transparent);
          margin: 22px 0;
        }

        .ab-para {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-weight: 300; font-size: 17px; line-height: 1.8;
          color: rgba(228,223,214,0.5); min-height: 6em; margin-bottom: 0;
        }
      `}</style>

      <section id="about" className="ab-section" ref={containerRef}>
        <div className="ab-inner">
          <h2 className="ab-section-label">
            <span>About Us</span>
          </h2>

          {sections.map((item, i) => (
            <div key={i} className={`ab-row${i % 2 !== 0 ? ' ab-row--reverse' : ''}`}>
              {/* Image */}
              <div className="ab-img-wrap">
                <img src={item.img} alt={item.title.replace('\n', ' ')} loading="lazy" className="ab-img" />
                <div className="ab-img-num" aria-hidden="true">{item.index}</div>
              </div>

              {/* Text */}
              <div className="ab-text">
                <p className="ab-index">MTRX_{item.index}</p>
                <p className="ab-sub">{item.sub}</p>
                <h3 className="ab-heading" data-text={item.title} />
                <div className="ab-rule" />
                <p className="ab-para" data-text={item.text} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
