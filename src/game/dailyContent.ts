import type { DailyContent, LiveEvent, ShelfCategory, ShelfItem } from './types';
import { mulberry32, seedFromDateKey, pickWeighted, pick } from './rng';
import { WEATHERS, WEATHER_WEIGHTS, WEATHER_BY_ID } from './content/weather';
import { EVENTS } from './content/events';
import { DROPS, SHELF_POOL } from './content/products';
import { C } from './economy';

const NEW_ARRIVALS_URL =
  'https://ship.erewhon.com/collections/erewhon-new-arrivals-products/products.json?limit=50';
const LA_NEWS_URL = 'https://www.reddit.com/r/LosAngeles/hot.json?limit=25';
const SHELF_CACHE_KEY = 'erewhon-tycoon:shelf';
const LA_CACHE_KEY = 'erewhon-tycoon:la-news';

// Weather and the news event reroll every in-game morning (salted per save so
// replays differ); Today's Drop, the shelf item, and viral status are pinned to
// the real-life date, so the game feels fresh the first time it's opened each day.
export function generateDaily(dateKey: string, gameDay: number, seedNonce: number): DailyContent {
  const dateSeed = seedFromDateKey(dateKey);
  const dayRand = mulberry32((dateSeed ^ Math.imul(gameDay, 2654435761) ^ seedNonce) >>> 0);
  const dateRand = mulberry32(dateSeed);

  const weather = pickWeighted(dayRand, WEATHERS, (w) => WEATHER_WEIGHTS[w.id] ?? 1);
  const [lo, hi] = weather.tempF;
  const tempF = Math.round(lo + dayRand() * (hi - lo));

  // Location events are strategic bait — the news names a place, you can chase it.
  const event = pickWeighted(dayRand, EVENTS, (e) => (e.scope.kind === 'global' ? 2 : 1));

  const drop = pick(dateRand, DROPS);
  const shelfItem = pick(dateRand, SHELF_POOL);
  const viralShelf = dateRand() < C.VIRAL_CHANCE;

  return {
    dateKey,
    gameDay,
    weatherId: weather.id,
    tempF,
    eventId: event.id,
    dropId: drop.id,
    shelfItem,
    viralShelf,
    useLive: dayRand() < 0.55, // most days lean on the real-LA headline when we have one
    liveWeather: false,
  };
}

// ——— real LA weather (Open-Meteo, keyless + CORS-open) ———

const LA_WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=34.05&longitude=-118.24' +
  '&daily=temperature_2m_max,precipitation_probability_max,wind_speed_10m_max,cloud_cover_mean' +
  '&temperature_unit=fahrenheit&timezone=America/Los_Angeles&forecast_days=1';
const LA_WEATHER_CACHE_KEY = 'erewhon-tycoon:la-weather';

export async function fetchLiveLAWeather(
  dateKey: string,
): Promise<{ weatherId: string; tempF: number } | null> {
  try {
    const cachedRaw = localStorage.getItem(LA_WEATHER_CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw) as {
        dateKey: string;
        weather: { weatherId: string; tempF: number };
      };
      if (cached.dateKey === dateKey) return cached.weather;
    }
  } catch {
    // corrupted cache — refetch
  }
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3500);
    const res = await fetch(LA_WEATHER_URL, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      daily?: {
        temperature_2m_max?: number[];
        precipitation_probability_max?: number[];
        wind_speed_10m_max?: number[];
        cloud_cover_mean?: number[];
      };
    };
    const temp = data.daily?.temperature_2m_max?.[0];
    if (typeof temp !== 'number') return null;
    const precip = data.daily?.precipitation_probability_max?.[0] ?? 0;
    const wind = data.daily?.wind_speed_10m_max?.[0] ?? 0;
    const cloud = data.daily?.cloud_cover_mean?.[0] ?? 0;
    const weatherId =
      precip >= 60 ? 'atmosphericriver'
      : precip >= 35 ? 'rain'
      : temp >= 90 ? 'heatwave'
      : wind >= 38 && temp >= 78 ? 'santaana'
      : cloud >= 65 && temp < 72 ? 'junegloom'
      : 'perfect75';
    const weather = { weatherId, tempF: Math.round(temp) };
    localStorage.setItem(LA_WEATHER_CACHE_KEY, JSON.stringify({ dateKey, weather }));
    return weather;
  } catch {
    return null; // offline → simulated LA weather
  }
}

// ——— live shelf item (ship.erewhon.com Shopify feed) ———

export function classifyShelfItem(title: string, productType?: string): ShelfCategory {
  const t = `${title} ${productType ?? ''}`.toLowerCase();
  const match = (words: string[]) => words.some((w) => t.includes(w));
  if (match(['hoodie', 'hat', 'tote', 'candle', 'sock', 'towel', 'crewneck', 'tee', 'shirt', 'spray', 'bag', 'gift']))
    return 'merch';
  if (match(['mg', 'capsule', 'colostrum', 'vitamin', 'glutathione', 'magnesium', 'ashwagandha', 'omega', 'protein', 'collagen', 'supplement', 'sea moss', 'liposomal', 'sleep', 'liver']))
    return 'supplement';
  if (match(['crisp', 'chip', 'chocolate', 'cookie', 'granola', 'toffee', 'trail', 'snack', 'bar', 'strawberry', 'toast']))
    return 'snack';
  if (match(['smoothie', 'latte', 'juice', 'water', 'kit', 'milk', 'coffee', 'tonic', 'shot']))
    return 'drink';
  return 'pantry';
}

export async function fetchLiveShelfItem(dateKey: string): Promise<ShelfItem | null> {
  try {
    const cachedRaw = localStorage.getItem(SHELF_CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw) as { dateKey: string; item: ShelfItem };
      if (cached.dateKey === dateKey && cached.item.category) return cached.item;
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
      products?: { title?: string; product_type?: string; variants?: { price?: string }[] }[];
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
      category: classifyShelfItem(chosen.title!, chosen.product_type),
    };
    localStorage.setItem(SHELF_CACHE_KEY, JSON.stringify({ dateKey, item }));
    return item;
  } catch {
    return null; // CORS/offline/timeout → caller keeps the pool item
  }
}

// ——— the real-LA news bot ———

// Keyword classes map a headline to game effects. First match wins.
const LA_RULES: { words: string[]; effect: Omit<LiveEvent, 'headline'> }[] = [
  { words: ['fire', 'smoke', 'evacuation', 'earthquake'], effect: { traffic: 0.6, pay: 1, patience: 0.85, vibe: 'chaos' } },
  { words: ['strike', 'protest', 'shutdown', 'closure', 'closed'], effect: { traffic: 0.7, pay: 0.9, patience: 0.9, vibe: 'chaos' } },
  { words: ['traffic', '405', '101', '110', 'freeway', 'road work'], effect: { traffic: 0.8, pay: 1, patience: 0.7, vibe: 'chaos' } },
  { words: ['heat', 'heatwave', 'hot'], effect: { traffic: 1.3, pay: 1.1, patience: 1, vibe: 'wellness' } },
  { words: ['rain', 'storm', 'flood'], effect: { traffic: 0.6, pay: 0.9, patience: 1 } },
  { words: ['dodgers', 'lakers', 'rams', 'lafc', 'game', 'playoff', 'parade'], effect: { traffic: 1.35, pay: 1.05, patience: 1, vibe: 'hype' } },
  { words: ['festival', 'concert', 'show', 'premiere', 'opening', 'pop-up', 'popup'], effect: { traffic: 1.3, pay: 1.1, patience: 1, vibe: 'hype' } },
  { words: ['marathon', 'ciclavia', 'race'], effect: { traffic: 1.2, pay: 1, patience: 1.1, vibe: 'wellness' } },
  { words: ['restaurant', 'food', 'coffee', 'bakery', 'market'], effect: { traffic: 1.2, pay: 1.05, patience: 1, vibe: 'hype' } },
];

export async function fetchLiveLAEvent(dateKey: string): Promise<LiveEvent | null> {
  try {
    const cachedRaw = localStorage.getItem(LA_CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw) as { dateKey: string; event: LiveEvent };
      if (cached.dateKey === dateKey) return cached.event;
    }
  } catch {
    // corrupted cache — refetch
  }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3500);
    const res = await fetch(LA_NEWS_URL, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      data?: { children?: { data?: { title?: string; stickied?: boolean } }[] };
    };
    const titles = (data.data?.children ?? [])
      .map((c) => c.data)
      .filter((d): d is { title: string } => !!d?.title && !d.stickied)
      .map((d) => d.title);
    for (const title of titles) {
      const t = title.toLowerCase();
      const rule = LA_RULES.find((r) => r.words.some((w) => t.includes(w)));
      if (rule) {
        const headline = title.length > 90 ? `${title.slice(0, 87)}...` : title;
        const event: LiveEvent = { headline, ...rule.effect };
        localStorage.setItem(LA_CACHE_KEY, JSON.stringify({ dateKey, event }));
        return event;
      }
    }
    return null;
  } catch {
    return null; // offline → pool deck carries the day
  }
}

export function weatherFor(daily: DailyContent) {
  return WEATHER_BY_ID[daily.weatherId] ?? WEATHERS[0];
}
