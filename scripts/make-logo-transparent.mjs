// One-off script: converts public/logo.jpeg into public/logo.png with the
// white background keyed out to alpha 0. Re-runnable, idempotent.
//
//   node scripts/make-logo-transparent.mjs

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '..', 'public', 'logo.png');
const OUT = resolve(__dirname, '..', 'public', 'logo.png');

// Pixels brighter than this threshold (per channel) become fully transparent.
// Pixels in the soft transition zone fade to partial alpha so antialiased
// edges don't show a hard fringe.
const HARD_WHITE = 240;
const SOFT_WHITE = 200;

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.from(data);

for (let i = 0; i < out.length; i += channels) {
  const r = out[i];
  const g = out[i + 1];
  const b = out[i + 2];
  const minChannel = Math.min(r, g, b);

  if (minChannel >= HARD_WHITE) {
    // Fully transparent
    out[i + 3] = 0;
  } else if (minChannel >= SOFT_WHITE) {
    // Linear fade from 255 (visible) to 0 (transparent) across the soft band
    const t = (minChannel - SOFT_WHITE) / (HARD_WHITE - SOFT_WHITE);
    out[i + 3] = Math.round(255 * (1 - t));
  }
}

await sharp(out, { raw: { width, height, channels } })
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log(`✓ wrote ${OUT}`);
