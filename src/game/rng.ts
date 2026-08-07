// Deterministic PRNG — the real date seeds today's content so everyone
// who opens the game on the same day gets the same LA.

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Supports ?fakeDate=2026-08-08 for testing the daily refresh.
export function todayKey(): string {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const fake = params.get('fakeDate');
    if (fake && /^\d{4}-\d{2}-\d{2}$/.test(fake)) return fake;
  }
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function seedFromDateKey(dateKey: string): number {
  return Number(dateKey.replaceAll('-', ''));
}

export function pickWeighted<T>(
  rand: () => number,
  items: T[],
  weight: (item: T) => number,
): T {
  const total = items.reduce((s, i) => s + weight(i), 0);
  let r = rand() * total;
  for (const item of items) {
    r -= weight(item);
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

export function pick<T>(rand: () => number, items: T[]): T {
  return items[Math.floor(rand() * items.length)];
}

// Box–Muller for willingness-to-pay
export function gaussian(rand: () => number, mean: number, sd: number): number {
  const u1 = Math.max(rand(), 1e-9);
  const u2 = rand();
  return mean + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
