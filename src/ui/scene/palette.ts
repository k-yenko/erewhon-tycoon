// Shared color math + distant-layer tones so every scene draws from one
// coherent world instead of ten ad-hoc ones.

// Mix a hex toward black (amt < 0) or white (amt > 0). amt in [-1, 1].
export function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) =>
    Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  const r = ch((n >> 16) & 255);
  const g = ch((n >> 8) & 255);
  const b = ch(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Distant-layer tones: always muted, always cooler than the foreground.
export const OCEAN_DEEP = '#2f7fc0';
export const OCEAN_FOAM = '#dff0f8';
export const SAIL = '#fdfaf2';
