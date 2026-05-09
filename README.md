# Prestige

A luxury car rental and international export website. Built as a single-page React app with cinematic GSAP scroll animations, a video-backed hero, and a dark gold-accented design system.

---

## Live sections

| #   | Section      | What it does                                                                              |
| --- | ------------ | ----------------------------------------------------------------------------------------- |
| 1   | Hero         | Background video + GSAP typing effect on "PRESTIGE IN EVERY MILE." Mobile shows a static gradient instead of the video. |
| 2   | Logo Marquee | Infinite-loop carousel of car-brand logos (BMW, Audi, Volkswagen, Mercedes). Hover slows it down. |
| 3   | Gallery      | Scroll-pinned image mosaic that explodes outward as the center image scales up. Mobile falls back to a clean 2-column grid. |
| 4   | About Us     | Four alternating editorial rows with scroll-triggered text-typing and image fade-ins.     |
| 5   | Location     | Embedded Google Map of the showroom with a hover-to-activate filter and animated detail list. |
| 6   | Contact      | Form that fires off either a pre-filled WhatsApp message or a `mailto:` link.             |
| 7   | Footer       | Brand logo, navigation columns, contact details, social links (Instagram, Facebook, TikTok, WhatsApp). |

---

## Tech stack

- **React 19** + **Vite 8** for the app shell and dev server
- **Tailwind CSS 4** (via `@tailwindcss/vite`) for utility styling
- **GSAP 3** with `ScrollTrigger` and `TextPlugin` for all scroll-driven animations
- **lucide-react** for icons (Car, Phone, Mail, Clock, Trophy, etc.)
- **ESLint 10** with the React Hooks and React Refresh plugins

Fonts loaded from Google Fonts: `Bebas Neue`, `Cormorant Garamond`, `DM Mono`, `DM Sans`, `Doto`, `Montserrat`.

---

## Project structure

```
prestige/
├── public/
│   ├── about/              # AboutUs section images (about1–4.jpg)
│   ├── pics/               # Gallery section images (bm1–5.jpg)
│   ├── bg.mp4 / bg.mov     # Hero background video (desktop only)
│   ├── logo.jpeg           # Brand logo (header + footer)
│   ├── audi.svg, bmw.png, mer.png, volk.svg   # Logo marquee assets
│   └── favicon.svg
│
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Hero + section composition
│   ├── index.css           # Tailwind import, font import, smooth scroll
│   └── components/
│       ├── LogoMarquee.jsx
│       ├── ImageGallery.jsx
│       ├── AboutUs.jsx
│       ├── Location.jsx
│       ├── Contact.jsx
│       └── Footer.jsx
│
├── index.html              # Vite entry
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## Getting started

### Prerequisites

- **Node.js 18+** and npm

### Install & run

```bash
# Install dependencies
npm install

# Start the dev server (usually http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview the production build locally
npm run preview

# Run ESLint
npm run lint
```

---

## Configuration

A few values are hard-coded as constants — update them when business details change.

### Contact details — [src/components/Contact.jsx](src/components/Contact.jsx)

```js
const WHATSAPP_NUMBER = "48739690668";                    // digits only, no '+' or spaces
const EMAIL_ADDRESS   = "office.prestigecompany@gmail.com";
```

The phone number shown in the info panel is rendered separately as `+48 739 690 668`. Keep both in sync.

### Footer contact column — [src/components/Footer.jsx](src/components/Footer.jsx)

The phone, email, and address are hard-coded inside the JSX (look for `ft-contact-item`).

### Social links — [src/components/Footer.jsx](src/components/Footer.jsx)

Inside `.ft-social`, four anchors point to:

- Instagram: `instagram.com/prestige_company_pl`
- Facebook: `facebook.com/share/1AqteMDviP/`
- TikTok: `tiktok.com/@prestige_company`
- WhatsApp: `wa.me/48739690668`

### Map — [src/components/Location.jsx](src/components/Location.jsx)

`MAPS_EMBED` is a Google Maps embed URL keyed off the address `Zaciszna 21/1, 05-092 Sadowa, Polska`. Replace the URL and the `details` array if the showroom moves.

### Navigation — [src/App.jsx](src/App.jsx)

```js
const NAV_ITEMS = [
  { label: 'Gallery',  href: '#gallery'  },
  { label: 'About',    href: '#about'    },
  { label: 'Location', href: '#location' },
  { label: 'Contact',  href: '#contact'  },
];
```

Each `href` matches an `id` on the corresponding section component. Add a new entry here when adding a new section.

---

## Design system

| Token              | Value             | Used for                                       |
| ------------------ | ----------------- | ---------------------------------------------- |
| Background (deep)  | `#050505`         | Footer, Gallery                                 |
| Background         | `#060606`         | About, Location                                 |
| Background (warm)  | `#080808`         | Contact                                         |
| Foreground         | `#e4dfd6` / `#e8e3da` / `#f0ede8` | Body text variants            |
| **Gold accent**    | `#c9a84c`         | Borders, accents, hover fills, active icons    |
| Error              | `rgba(220,140,140,0.9)` | Form validation messages                  |

Reusable button pattern: transparent background, gold border, gold panel slides in from the left on hover and inverts the text colour. See `.loc-btn`, `.ab-btn`, `.btn` in their respective component `<style>` blocks.

---

## Responsive behaviour

- **Header:** desktop nav inline; mobile collapses to a hamburger that opens a fullscreen overlay.
- **Hero:** desktop renders the video; mobile skips the video entirely, uses a gradient background, and lays out the content in natural flow (no `100vh` lock).
- **Gallery:** scroll-pinned mosaic on `≥768px`; static 2-column grid below that.
- **About / Location / Contact:** two-column grids collapse to one on tablet/mobile, with reduced section padding on `≤640px`.
- **Footer:** four-column layout collapses to two columns under 960px and a single column under 540px.

---

## Animation notes

All sections use `gsap.context()` (or scoped `ScrollTrigger` instances) so animations clean up on unmount. Smooth in-page scrolling is enabled globally in [src/index.css](src/index.css) with `html { scroll-behavior: smooth }` and an 80px `scroll-margin-top` on every `section[id]` so the fixed header doesn't overlap section headings.

---

## License

Private project. All rights reserved.
