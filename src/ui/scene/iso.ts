// Isometric projection + shared scene constants.
export const VIEW_W = 960;
export const VIEW_H = 470;
export const TILE = 46;
const OX = 480;
const OY = 40;

export function iso(gx: number, gy: number): [number, number] {
  return [OX + (gx - gy) * TILE, OY + (gx + gy) * (TILE / 2)];
}

export function poly(pts: [number, number][]): string {
  return pts.map((p) => p.join(',')).join(' ');
}

export const INK = '#1a1a18';
export const ASPHALT = '#8f8d88';
export const ASPHALT_D = '#7c7a75';
export const CONCRETE = '#d8d2c4';
export const CONCRETE_D = '#c4beb0';
export const DASH = '#f0e9da';
