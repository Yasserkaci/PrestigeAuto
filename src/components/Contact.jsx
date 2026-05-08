import { useEffect, useRef, useState } from "react";

const WHATSAPP_NUMBER = "1234567890";
const EMAIL_ADDRESS = "byasserkaci@gmail.com";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export default function ContactSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const dividerRef = useRef(null);
  const carRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(null);

  useEffect(() => {
    let killed = false;

    const init = async () => {
      await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js");

      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      if (!gsap || !ScrollTrigger || killed) return;

      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        carRef.current,
        { x: -120, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
        .fromTo(
          headingRef.current,
          { y: 60, opacity: 0, skewY: 3 },
          { y: 0, opacity: 1, skewY: 0, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          subRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          dividerRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.7, ease: "power2.inOut" },
          "-=0.3"
        );

      gsap.fromTo(
        formRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        infoRef.current,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: infoRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.utils.toArray(".info-item").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: i * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    };

    init();

    return () => {
      killed = true;
      if (window.ScrollTrigger) window.ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const buildMessage = () =>
    `Hello DriveElite!%0A%0AName: ${form.name}%0APhone: ${form.phone}%0AEmail: ${form.email}%0A%0AMessage:%0A${form.message}`;

  const buildEmailBody = () =>
    `Name: ${form.name}%0APhone: ${form.phone}%0A%0AMessage:%0A${form.message}`;

  // FIX: removed `form.service` from validation — that field no longer exists in the form
  const validate = () => form.name && form.message;

  const handleWhatsApp = () => {
    if (!validate()) { setSent("error"); return; }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildMessage()}`, "_blank");
    setSent("whatsapp");
  };

  const handleEmail = () => {
    if (!validate()) { setSent("error"); return; }
    const subject = encodeURIComponent("DriveElite Inquiry");
    window.open(`mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${buildEmailBody()}`, "_blank");
    setSent("email");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .contact-wrap * { box-sizing: border-box; margin: 0; padding: 0; }

        .contact-wrap {
          background: #080808;
          min-height: 100vh;
          color: #f0ede8;
          font-family: 'DM Sans', sans-serif;
          padding: 100px 24px;
          position: relative;
          overflow: hidden;
        }

        .noise {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 0;
        }

        .grid-lines {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none; z-index: 0;
        }

        .contact-inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative; z-index: 1;
        }

        .section-tag {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 16px;
        }

        .tag-pill {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          border: 1px solid rgba(201,168,76,0.4);
          padding: 4px 12px;
          border-radius: 999px;
        }

        .car-svg {
          font-size: 28px;
          line-height: 1;
          display: inline-block;
        }

        .section-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 8vw, 96px);
          line-height: 0.92;
          letter-spacing: 0.02em;
          color: #f0ede8;
          margin-bottom: 20px;
        }

        .heading-accent {
          color: #c9a84c;
          display: block;
        }

        .section-sub {
          font-size: 15px;
          color: rgba(240,237,232,0.45);
          max-width: 400px;
          line-height: 1.7;
          font-weight: 300;
        }

        .gold-divider {
          height: 1px;
          background: linear-gradient(90deg, #c9a84c, transparent);
          margin: 40px 0;
          display: block;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 48px;
          align-items: start;
        }

        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; }
        }

        .form-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 36px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 540px) {
          .form-row { grid-template-columns: 1fr; }
          .form-card { padding: 24px; }
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .field-label {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(240,237,232,0.4);
          font-weight: 500;
        }

        .field-input, .field-select, .field-textarea {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #f0ede8;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          padding: 12px 14px;
          transition: border-color 0.2s, background 0.2s;
          outline: none;
          width: 100%;
        }

        .field-input::placeholder, .field-textarea::placeholder { color: rgba(240,237,232,0.2); }
        .field-input:focus, .field-select:focus, .field-textarea:focus {
          border-color: rgba(201,168,76,0.6);
          background: rgba(201,168,76,0.04);
        }

        .field-select option { background: #111; color: #f0ede8; }

        .field-textarea { resize: vertical; min-height: 110px; }

        .btn-row {
          display: flex; gap: 12px; margin-top: 8px; flex-wrap: wrap;
        }

        .btn {
          flex: 1;
          min-width: 140px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px 20px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: transform 0.15s, opacity 0.15s, box-shadow 0.2s;
          letter-spacing: 0.02em;
        }

        .btn:hover { transform: translateY(-2px); opacity: 0.92; }
        .btn:active { transform: scale(0.97); }

        .btn-whatsapp {
          background: #25d366;
          color: #000;
          box-shadow: 0 4px 24px rgba(37,211,102,0.2);
        }

        .btn-email {
          background: #c9a84c;
          color: #000;
          box-shadow: 0 4px 24px rgba(201,168,76,0.2);
        }

        .status-msg {
          margin-top: 14px;
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 8px;
          display: flex; align-items: center; gap: 8px;
        }

        .status-ok { background: rgba(37,211,102,0.08); color: #25d366; border: 1px solid rgba(37,211,102,0.2); }
        .status-err { background: rgba(220,60,60,0.08); color: #e05757; border: 1px solid rgba(220,60,60,0.2); }

        .info-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          padding: 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          transition: border-color 0.2s, background 0.2s;
        }

        .info-item:hover {
          border-color: rgba(201,168,76,0.3);
          background: rgba(201,168,76,0.03);
        }

        .info-icon {
          width: 40px; height: 40px;
          background: rgba(201,168,76,0.12);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .info-label {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(240,237,232,0.35);
          margin-bottom: 4px;
        }

        .info-value {
          font-size: 14px;
          color: #f0ede8;
          line-height: 1.5;
          font-weight: 300;
        }

        .hours-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px 16px;
          margin-top: 4px;
        }

        .hours-day { font-size: 12px; color: rgba(240,237,232,0.35); }
        .hours-time { font-size: 12px; color: #c9a84c; }

        .bottom-strip {
          margin-top: 64px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .brand-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 0.08em;
          color: rgba(240,237,232,0.3);
        }

        .brand-name span { color: #c9a84c; }

        .legal-text {
          font-size: 12px;
          color: rgba(240,237,232,0.2);
          font-weight: 300;
        }
      `}</style>

      <section className="contact-wrap" ref={sectionRef}>
        <div className="noise" aria-hidden="true" />
        <div className="grid-lines" aria-hidden="true" />

        <div className="contact-inner">
          <div className="section-tag">
            <span ref={carRef} className="car-svg" aria-hidden="true">🏎</span>
            <span className="tag-pill">Get in Touch</span>
          </div>

          <h2 ref={headingRef} className="section-heading">
            Let's Find Your<br />
            <span className="heading-accent">Perfect Drive</span>
          </h2>

          <p ref={subRef} className="section-sub">
            Whether you're renting for a weekend or buying your dream car,
            our team is ready to make it happen — fast.
          </p>

          <span ref={dividerRef} className="gold-divider" />

          <div className="contact-grid">
            {/* FORM */}
            <div ref={formRef} className="form-card">
              <div className="form-row">
                <div className="field-group">
                  <label className="field-label" htmlFor="c-name">Full Name</label>
                  <input
                    id="c-name" name="name" className="field-input"
                    placeholder="John Doe"
                    value={form.name} onChange={handleChange}
                  />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="c-phone">Phone</label>
                  <input
                    id="c-phone" name="phone" className="field-input"
                    placeholder="+1 (000) 000-0000"
                    value={form.phone} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="c-email">Email</label>
                <input
                  id="c-email" name="email" type="email" className="field-input"
                  placeholder="john@email.com"
                  value={form.email} onChange={handleChange}
                />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="c-message">Message</label>
                <textarea
                  id="c-message" name="message" className="field-textarea"
                  placeholder="Tell us what you're looking for — model, budget, dates…"
                  value={form.message} onChange={handleChange}
                />
              </div>

              <div className="btn-row">
                <button className="btn btn-whatsapp" onClick={handleWhatsApp}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Us
                </button>
                <button className="btn btn-email" onClick={handleEmail}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  Send Email
                </button>
              </div>

              {sent === "error" && (
                <div className="status-msg status-err">
                  ⚠️ Please fill in your Name and Message before sending.
                </div>
              )}
              {sent === "whatsapp" && (
                <div className="status-msg status-ok">
                  ✓ Opening WhatsApp — your message is pre-filled and ready!
                </div>
              )}
              {sent === "email" && (
                <div className="status-msg status-ok">
                  ✓ Opening your email client — just hit send!
                </div>
              )}
            </div>

            {/* INFO PANEL — re-added so infoRef has a DOM node to animate */}
            <div ref={infoRef} className="info-panel">
              <div className="info-item">
                <div className="info-icon">📞</div>
                <div>
                  <p className="info-label">Phone</p>
                  <p className="info-value">+1 (234) 567-890</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📧</div>
                <div>
                  <p className="info-label">Email</p>
                  <p className="info-value">{EMAIL_ADDRESS}</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">🕐</div>
                <div>
                  <p className="info-label">Hours</p>
                  <div className="hours-grid">
                    <span className="hours-day">Mon – Fri</span>
                    <span className="hours-time">9am – 7pm</span>
                    <span className="hours-day">Saturday</span>
                    <span className="hours-time">10am – 5pm</span>
                    <span className="hours-day">Sunday</span>
                    <span className="hours-time">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}