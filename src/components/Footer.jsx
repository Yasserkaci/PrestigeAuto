const EXPLORE_LINKS  = ['Gallery', 'Superpowers', 'About Us', 'Process'];
const SERVICE_LINKS  = ['Car Rental', 'Export', 'Concierge', 'Fleet'];

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@1,300&family=DM+Mono:wght@300;400&family=DM+Sans:wght@300;400&display=swap');

        .ft-wrap {
          background: #050505;
          border-top: 1px solid rgba(255,255,255,0.05);
          color: #e4dfd6;
          font-family: 'DM Sans', sans-serif;
          padding: 80px 24px 0;
        }

        @media (max-width: 640px) {
          .ft-wrap { padding: 60px 16px 0; }
        }

        .ft-inner { max-width: 1100px; margin: 0 auto; }

        .ft-top {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 64px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        @media (max-width: 960px) {
          .ft-top { grid-template-columns: 1fr 1fr; gap: 40px; }
          .ft-brand-col { grid-column: 1 / -1; }
        }

        @media (max-width: 540px) {
          .ft-top { grid-template-columns: 1fr; }
          .ft-top > div:not(.ft-brand-col) { padding-top: 8px; }
        }

        .ft-brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 30px; letter-spacing: 0.1em; color: #e4dfd6;
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 16px;
        }

        .ft-brand-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #c9a84c; display: inline-block; flex-shrink: 0;
        }

        .ft-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-weight: 300; font-size: 16px;
          color: rgba(228,223,214,0.4); line-height: 1.7;
          max-width: 240px; margin-bottom: 28px;
        }

        .ft-social { display: flex; gap: 10px; }

        .ft-social-link {
          width: 36px; height: 36px;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          color: rgba(228,223,214,0.5); text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }

        .ft-social-link:hover { border-color: rgba(201,168,76,0.5); color: #c9a84c; }

        .ft-col-title {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.4em; text-transform: uppercase;
          color: rgba(201,168,76,0.7); margin-bottom: 24px;
        }

        .ft-links { list-style: none; display: flex; flex-direction: column; gap: 12px; }

        .ft-links a {
          font-size: 13px; color: rgba(228,223,214,0.45); text-decoration: none;
          letter-spacing: 0.03em; transition: color 0.2s;
        }

        .ft-links a:hover { color: #e4dfd6; }

        .ft-contact-item { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }

        .ft-contact-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(201,168,76,0.5);
        }

        .ft-contact-value { font-size: 13px; color: rgba(228,223,214,0.6); line-height: 1.6; }

        .ft-bottom {
          padding: 24px 0;
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 12px;
        }

        .ft-copy { font-size: 11px; color: rgba(228,223,214,0.2); letter-spacing: 0.05em; }

        .ft-legal { display: flex; gap: 20px; }

        .ft-legal a {
          font-size: 11px; color: rgba(228,223,214,0.2); text-decoration: none;
          letter-spacing: 0.05em; transition: color 0.2s;
        }

        .ft-legal a:hover { color: rgba(228,223,214,0.5); }
      `}</style>

      <footer className="ft-wrap">
        <div className="ft-inner">
          <div className="ft-top">
            {/* Brand */}
            <div className="ft-brand-col">
              <div className="ft-brand">
                PRESTIGE <span className="ft-brand-dot" />
              </div>
              <p className="ft-tagline">
                Precision engineered. Globally delivered.<br />Prestige in every mile.
              </p>
              <div className="ft-social">
                <a
                  href="https://www.instagram.com/prestige_company_pl?igsh=MWxwOHk2Mm50ZHhudQ%3D%3D&utm_source=qr"
                  target="_blank" rel="noopener noreferrer"
                  className="ft-social-link" aria-label="Instagram"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/share/1AqteMDviP/?mibextid=wwXIfr"
                  target="_blank" rel="noopener noreferrer"
                  className="ft-social-link" aria-label="Facebook"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@prestige_company?_r=1&_t=ZN-95Uak88rZHK"
                  target="_blank" rel="noopener noreferrer"
                  className="ft-social-link" aria-label="TikTok"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.43a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.26z"/>
                  </svg>
                </a>
                <a
                  href="https://wa.me/48739690668"
                  target="_blank" rel="noopener noreferrer"
                  className="ft-social-link" aria-label="WhatsApp"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Explore */}
            <div>
              <p className="ft-col-title">Explore</p>
              <ul className="ft-links">
                {EXPLORE_LINKS.map((l) => <li key={l}><a href="#">{l}</a></li>)}
              </ul>
            </div>

            {/* Services */}
            <div>
              <p className="ft-col-title">Services</p>
              <ul className="ft-links">
                {SERVICE_LINKS.map((l) => <li key={l}><a href="#">{l}</a></li>)}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="ft-col-title">Contact</p>
              <div className="ft-contact-item">
                <span className="ft-contact-label">Phone</span>
                <span className="ft-contact-value">+48 739 690 668</span>
              </div>
              <div className="ft-contact-item">
                <span className="ft-contact-label">Email</span>
                <span className="ft-contact-value">byasserkaci@gmail.com</span>
              </div>
              <div className="ft-contact-item">
                <span className="ft-contact-label">Address</span>
                <span className="ft-contact-value">Zaciszna 21/1<br />05-092 Sadowa, Polska</span>
              </div>
            </div>
          </div>

          <div className="ft-bottom">
            <p className="ft-copy">© {new Date().getFullYear()} Prestige. All rights reserved.</p>
            <div className="ft-legal">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
