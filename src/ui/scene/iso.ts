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
export const ASPHALT = '#757572';
export const ASPHALT_D = '#646460';
export const CONCRETE = '#dcdcd2';
export const CONCRETE_D = '#c6c6ba';
export const DASH = '#ffffff';
