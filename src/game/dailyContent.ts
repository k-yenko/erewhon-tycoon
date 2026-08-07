import type { DailyContent, ShelfItem } from './types';
import { mulberry32, seedFromDateKey, pickWeighted, pick } from './rng';
import { WEATHERS, WEATHER_WEIGHTS, WEATHER_BY_ID } from './content/weather';
import { EVENTS } from './content/events';
import { DROPS, SHELF_POOL } from './content/products';

const NEW_ARRIVALS_URL =
  'https://ship.erewhon.com/collections/erewhon-new-arrivals-products/products.json?limit=50';
const SHELF_CACHE_KEY = 'erewhon-tycoon:shelf';

// Weather and the news event reroll every in-game morning; Today's Drop and the
// "NEW AT EREWHON" shelf item are pinned to the real-life date, so the game feels
// fresh the first time it's opened each day.
export function generateDaily(dateKey: string, gameDay: number): DailyContent {
  const dateSeed = seedFromDateKey(dateKey);
  const dayRand = mulberry32((dateSeed ^ Math.imul(gameDay, 2654435761)) >>> 0);
  const dateRand = mulberry32(dateSeed);

  const weather = pickWeighted(dayRand, WEATHERS, (w) => WEATHER_WEIGHTS[w.id] ?? 1);
  const [lo, hi] = weather.tempF;
  const tempF = Math.round(lo + dayRand() * (hi - lo));

  // Location events are strategic bait — the news names a place, you can chase it.
  const event = pickWeighted(dayRand, EVENTS, (e) => (e.scope.kind === 'global' ? 2 : 1));

  const drop = pick(dateRand, DROPS);
  const shelfItem = pick(dateRand, SHELF_POOL);

  return {
    dateKey,
    gameDay,
    weatherId: weather.id,
    tempF,
    eventId: event.id,
    dropId: drop.id,
    shelfItem,
  };
}

// Try the real Erewhon new-arrivals feed; on success, swap today's shelf item
// for an actual product. Cached per real date so we only fetch once.
export async function fetchLiveShelfItem(dateKey: string): Promise<ShelfItem | null> {
  try {
    const cachedRaw = localStorage.getItem(SHELF_CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw) as { dateKey: string; item: ShelfItem };
      if (cached.dateKey === dateKey) return cached.item;
    }
  } catch {
    // corrupted cache — refetch
  }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(NEW_ARRIVALS_URL, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      products?: { title?: string; variants?: { price?: string }[] }[];
    };
    const products = (data.products ?? []).filter(
      (p) => p.title && p.variants?.[0]?.price && Number(p.variants[0].price) > 0,
    );
    if (products.length === 0) return null;
    const rand = mulberry32((seedFromDateKey(dateKey) ^ 0x5eed) >>> 0);
    const chosen = pick(rand, products);
    const item: ShelfItem = {
      name: chosen.title!,
      price: Math.round(Number(chosen.variants![0].price!)),
      source: 'live',
    };
    localStorage.setItem(SHELF_CACHE_KEY, JSON.stringify({ dateKey, item }));
    return item;
  } catch {
    return null; // CORS/offline/timeout → caller keeps the pool item
  }
}

export function weatherFor(daily: DailyContent) {
  return WEATHER_BY_ID[daily.weatherId] ?? WEATHERS[0];
}
