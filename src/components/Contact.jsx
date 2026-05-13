import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Car, Phone, Mail, Clock, AlertTriangle, Check, Send } from "lucide-react";
import { supabase, MESSAGES_TABLE } from "../lib/supabase";

gsap.registerPlugin(ScrollTrigger);

const EMAIL_ADDRESS = "Office@prestigecompany.pl";

export default function ContactSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const dividerRef = useRef(null);
  const carRef = useRef(null);

  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(carRef.current, { x: -120, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out" })
        .fromTo(headingRef.current, { y: 60, opacity: 0, skewY: 3 }, { y: 0, opacity: 1, skewY: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
        .fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4")
        .fromTo(dividerRef.current, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, "-=0.3");

      gsap.fromTo(formRef.current, { y: 80, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: formRef.current, start: "top 85%", toggleActions: "play none none reverse" },
      });

      gsap.fromTo(infoRef.current, { x: 80, opacity: 0 }, {
        x: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: infoRef.current, start: "top 85%", toggleActions: "play none none reverse" },
      });

      gsap.utils.toArray(".info-item").forEach((el, i) => {
        gsap.fromTo(el, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, delay: i * 0.1, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => form.name.trim() && form.message.trim();

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!validate()) { setSent("error"); return; }
    setSubmitting(true);
    const { error } = await supabase.from(MESSAGES_TABLE).insert({
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      message: form.message.trim(),
    });
    setSubmitting(false);
    if (error) {
      setSent("fail");
      return;
    }
    setSent("ok");
    setForm({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .contact-wrap {
          background: #080808;
          min-height: 100vh;
          color: #f0ede8;
          font-family: 'DM Sans', sans-serif;
          padding: 100px 24px;
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .contact-wrap { padding: 60px 16px; }
        }

        .noise {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 0;
        }

        .grid-lines {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none; z-index: 0;
        }

        .contact-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

        .section-tag { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }

        .tag-pill {
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #c9a84c; border: 1px solid rgba(201,168,76,0.4);
          padding: 4px 12px; border-radius: 999px;
        }

        .car-svg { color: #c9a84c; display: inline-block; }

        .section-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 8vw, 96px);
          line-height: 0.92; letter-spacing: 0.02em;
          color: #f0ede8; margin-bottom: 20px;
        }

        .heading-accent { color: #c9a84c; display: block; }

        .section-sub {
          font-size: 15px; color: rgba(240,237,232,0.45);
          max-width: 400px; line-height: 1.7; font-weight: 300;
        }

        .gold-divider {
          height: 1px;
          background: linear-gradient(90deg, #c9a84c, transparent);
          margin: 40px 0; display: block;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 48px; align-items: start;
        }

        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; }
        }

        .form-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 36px;
        }

        @media (max-width: 540px) { .form-card { padding: 20px; } }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        @media (max-width: 540px) { .form-row { grid-template-columns: 1fr; } }

        .field-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }

        .field-label {
          font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(240,237,232,0.4); font-weight: 500;
        }

        .field-input, .field-textarea {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; color: #f0ede8;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; padding: 12px 14px;
          transition: border-color 0.2s, background 0.2s;
          outline: none; width: 100%;
        }

        .field-input::placeholder, .field-textarea::placeholder { color: rgba(240,237,232,0.2); }

        .field-input:focus, .field-textarea:focus {
          border-color: rgba(201,168,76,0.6);
          background: rgba(201,168,76,0.04);
        }

        .field-textarea { resize: vertical; min-height: 110px; }

        .btn-row { display: flex; gap: 12px; margin-top: 8px; flex-wrap: wrap; }

        .btn {
          position: relative;
          flex: 1; min-width: 140px;
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 14px 20px;
          background: transparent;
          border: 1px solid rgba(201,168,76,0.4);
          color: #e8e3da;
          font-family: 'DM Mono', monospace;
          font-size: 10px; font-weight: 400;
          letter-spacing: 0.3em; text-transform: uppercase;
          cursor: pointer; overflow: hidden;
          transition: color 0.4s, border-color 0.4s;
        }

        .btn::before {
          content: '';
          position: absolute; inset: 0; z-index: 0;
          background: #c9a84c;
          transform: translateX(-101%);
          transition: transform 0.45s cubic-bezier(0.77,0,0.18,1);
        }

        .btn > * { position: relative; z-index: 1; }

        .btn:hover { color: #060606; border-color: #c9a84c; }
        .btn:hover::before { transform: translateX(0); }
        .btn:active { transform: scale(0.98); }

        .btn-primary { background: rgba(201,168,76,0.08); }

        .status-msg {
          margin-top: 14px; font-size: 13px;
          padding: 10px 14px;
          display: flex; align-items: center; gap: 10px;
          border-left: 1px solid;
        }

        .status-ok  { background: rgba(201,168,76,0.06); color: #c9a84c;        border-color: rgba(201,168,76,0.5); }
        .status-err { background: rgba(220,80,80,0.05);  color: rgba(220,140,140,0.9); border-color: rgba(220,80,80,0.45); }

        .info-panel { display: flex; flex-direction: column; gap: 20px; }

        .info-item {
          display: flex; gap: 16px; align-items: flex-start;
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
          color: #c9a84c;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.3s, border-color 0.3s;
        }

        .info-item:hover .info-icon {
          background: rgba(201,168,76,0.18);
          border-color: rgba(201,168,76,0.45);
        }

        .info-label {
          font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(240,237,232,0.35); margin-bottom: 4px;
        }

        .info-value { font-size: 14px; color: #f0ede8; line-height: 1.5; font-weight: 300; }

        .hours-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; margin-top: 4px; }
        .hours-day  { font-size: 12px; color: rgba(240,237,232,0.35); }
        .hours-time { font-size: 12px; color: #c9a84c; }
      `}</style>

      <section id="contact" className="contact-wrap" ref={sectionRef}>
        <div className="noise" aria-hidden="true" />
        <div className="grid-lines" aria-hidden="true" />

        <div className="contact-inner">
          <div className="section-tag">
            <Car ref={carRef} className="car-svg" size={30} strokeWidth={1.25} aria-hidden="true" />
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
            {/* Form */}
            <form ref={formRef} className="form-card" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="field-group">
                  <label className="field-label" htmlFor="c-name">Full Name</label>
                  <input id="c-name" name="name" className="field-input" placeholder="John Doe" value={form.name} onChange={handleChange} />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="c-phone">Phone</label>
                  <input id="c-phone" name="phone" className="field-input" placeholder="+1 (000) 000-0000" value={form.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="c-email">Email</label>
                <input id="c-email" name="email" type="email" className="field-input" placeholder="john@email.com" value={form.email} onChange={handleChange} />
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
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <Send size={14} strokeWidth={1.75} aria-hidden="true" />
                  <span>{submitting ? "Sending…" : "Send Message"}</span>
                </button>
              </div>

              {sent === "error" && (
                <div className="status-msg status-err">
                  <AlertTriangle size={14} strokeWidth={1.75} />
                  <span>Please fill in your Name and Message before sending.</span>
                </div>
              )}
              {sent === "fail" && (
                <div className="status-msg status-err">
                  <AlertTriangle size={14} strokeWidth={1.75} />
                  <span>Couldn't send your message. Please try again in a moment.</span>
                </div>
              )}
              {sent === "ok" && (
                <div className="status-msg status-ok">
                  <Check size={14} strokeWidth={2} />
                  <span>Thank you — your message has been received. We'll be in touch shortly.</span>
                </div>
              )}
            </form>

            {/* Info Panel */}
            <div ref={infoRef} className="info-panel">
              <div className="info-item">
                <div className="info-icon"><Phone size={18} strokeWidth={1.5} /></div>
                <div>
                  <p className="info-label">Phone</p>
                  <p className="info-value">+48 739 690 668</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><Mail size={18} strokeWidth={1.5} /></div>
                <div>
                  <p className="info-label">Email</p>
                  <p className="info-value">{EMAIL_ADDRESS}</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><Clock size={18} strokeWidth={1.5} /></div>
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
