// Defines which text snippets across the site are editable from the admin
// Content tab. Each entry maps a `key` (stored in the `site_content` table) to a
// human-readable label, a description shown in the admin UI, the fallback used
// when the row is missing, and whether the field is a single-line input or a
// multi-line textarea.

export const CONTENT_GROUPS = [
  {
    section: 'Hero',
    keys: [
      {
        key: 'hero.eyebrow',
        label: 'Eyebrow line',
        help: 'Small uppercase line above the title (e.g. "Prestige Company // 2026 Collection").',
        fallback: 'Prestige Company // 2026 Collection',
        multiline: false,
      },
      {
        key: 'hero.title',
        label: 'Main title',
        help: 'The big animated headline.',
        fallback: 'PRESTIGE IN EVERY MILE.',
        multiline: false,
      },
      {
        key: 'hero.subtext',
        label: 'Subtext',
        help: 'Short caption shown below the headline.',
        fallback: 'Featuring the Skoda Fabia Monte Carlo. Premium rental and international export.',
        multiline: true,
      },
      {
        key: 'hero.cta',
        label: 'CTA button label',
        help: 'Label on the "Explore Fleet" button.',
        fallback: 'Explore Fleet',
        multiline: false,
      },
    ],
  },
  {
    section: 'Fleet (cars slider)',
    keys: [
      {
        key: 'cars.eyebrow',
        label: 'Eyebrow line',
        help: 'Small uppercase line above the "Latest Arrivals" title.',
        fallback: 'The Fleet',
        multiline: false,
      },
      {
        key: 'cars.title',
        label: 'Title',
        help: 'Main section title. Use the word "Arrivals" to keep the gold italic accent (or change both halves below).',
        fallback: 'Latest Arrivals',
        multiline: false,
      },
    ],
  },
  {
    section: 'Location',
    keys: [
      {
        key: 'location.eyebrow',
        label: 'Eyebrow line',
        help: 'Small uppercase line above the heading.',
        fallback: 'Our Location',
        multiline: false,
      },
      {
        key: 'location.body',
        label: 'Body copy',
        help: 'Italic description shown next to the map.',
        fallback: 'Our primary showroom and engineering atelier — visits are strictly by appointment, ensuring the absolute discretion our clients expect.',
        multiline: true,
      },
    ],
  },
  {
    section: 'Contact',
    keys: [
      {
        key: 'contact.title_a',
        label: 'Title — line 1',
        help: 'First line of the section title.',
        fallback: "Let's Find Your",
        multiline: false,
      },
      {
        key: 'contact.title_b',
        label: 'Title — line 2 (gold)',
        help: 'Second line of the title, shown in gold.',
        fallback: 'Perfect Drive',
        multiline: false,
      },
      {
        key: 'contact.sub',
        label: 'Subtext',
        help: 'Short blurb shown under the title.',
        fallback: "Whether you're renting for a weekend or buying your dream car, our team is ready to make it happen — fast.",
        multiline: true,
      },
    ],
  },
  {
    section: 'Footer',
    keys: [
      {
        key: 'footer.tagline',
        label: 'Tagline',
        help: 'Italic copy below the logo in the footer.',
        fallback: 'Precision engineered. Globally delivered.\nPrestige in every mile.',
        multiline: true,
      },
      {
        key: 'footer.copyright',
        label: 'Copyright line',
        help: 'Bottom-of-page copyright text. Use {year} to insert the current year.',
        fallback: '© {year} Prestige Company. All rights reserved.',
        multiline: false,
      },
    ],
  },
];

// Flat list of every editable key — used to seed defaults and to render rows.
export const CONTENT_KEYS = CONTENT_GROUPS.flatMap((g) => g.keys);
