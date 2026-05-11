import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

export const CARS_BUCKET = 'cars';
export const CARS_TABLE = 'cars';

export const GALLERY_BUCKET = 'gallery';
export const GALLERY_TABLE = 'gallery_images';

export const CONTENT_TABLE = 'site_content';
