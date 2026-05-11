import { useEffect, useState } from 'react';
import { supabase, CONTENT_TABLE } from './supabase';

// Global cache so every component shares the same fetch + the same realtime channel.
let cache = null;
let listeners = new Set();
let channelInitialized = false;

const notify = () => {
  listeners.forEach((cb) => cb(cache));
};

const fetchAll = async () => {
  const { data, error } = await supabase
    .from(CONTENT_TABLE)
    .select('key, value');
  if (error) {
    // eslint-disable-next-line no-console
    console.warn('[site_content]', error.message);
    cache = {};
    notify();
    return;
  }
  cache = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
  notify();
};

const initChannel = () => {
  if (channelInitialized) return;
  channelInitialized = true;

  supabase
    .channel('site_content_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: CONTENT_TABLE },
      () => { fetchAll(); }
    )
    .subscribe();
};

/**
 * Returns a function `t(key, fallback)` that yields the current value of a content key,
 * or the provided fallback string while loading / when the key is missing.
 * Re-renders the calling component whenever any key changes in real time.
 */
export function useSiteContent() {
  const [, setVersion] = useState(0);

  useEffect(() => {
    const listener = () => setVersion((v) => v + 1);
    listeners.add(listener);

    if (cache === null) {
      fetchAll();
    }
    initChannel();

    return () => { listeners.delete(listener); };
  }, []);

  return (key, fallback = '') => {
    if (!cache) return fallback;
    const v = cache[key];
    return v === undefined || v === null || v === '' ? fallback : v;
  };
}
