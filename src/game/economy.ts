import type { GameState, Recipe } from './types';
import { UPGRADE_BY_ID, DEFAULT_STORAGE } from './content/upgrades';
import { STAFF_BY_ID } from './content/staff';
import { idealIce } from './content/weather';

// Every tunable number in one place for the balance pass.
export const C = {
  DAY_TICKS: 60,          // one in-game hour, one tick = one minute
  MS_PER_TICK: 1500,      // 90s per day at 1x
  CUPS_PER_BATCH: 12,
  BASE_SERVE_TICKS: 2, // tip-screen upgrade brings this to 1; Madison serves in parallel
  BASE_BLEND_TICKS: 4,
  BASE_PATIENCE_MIN: 15,
  BASE_PATIENCE_SPREAD: 20,
  BALK_LINE: 6,           // arrivals take one look at a line this long and keep walking
  WTP_SD: 5,              // willingness-to-pay standard deviation ($)
  DROP_FAN_CHANCE: 0.15,  // fans who pay Today's Drop's own price (your slider governs the rest)
  PRICE_COMPLAINT_WEIGHT: 0.5, // window-shopper gripes count half in satisfaction
  // — shelf item ("NEW AT EREWHON TODAY") demand model —
  SHELF_BASE_ATTACH: { snack: 0.22, drink: 0.18, supplement: 0.12, pantry: 0.12, merch: 0.06 },
  SHELF_AD_SENS: 0.8,     // how strongly ad spend lifts shelf demand...
  SHELF_MERCH_AD_MULT: 2, // ...doubled for merch (the insta/tiktok effect)
  SHELF_VIRAL_MULT: 3,    // viral-day demand spike
  SHELF_VIRAL_TRAFFIC: 1.15, // people come to the cart just for the drop
  SHELF_COGS: 0.5,        // wholesale cost fraction of shelf revenue
  SHELF_VIRAL_COGS: 0.65, // scarcity pricing on viral days
  VIRAL_CHANCE: 0.18,     // per real date
  SPOILAGE_RATE: 0.1,     // nightly loss fraction for perishables
  SAT_CARRY: 0.6,         // satisfaction = carry×old + (1−carry)×today
  SAT_TRAFFIC_MIN: 0.6,   // repeat-customer traffic mult at satisfaction 0
  SAT_TRAFFIC_SPAN: 0.8,  // ... up to MIN+SPAN at satisfaction 1 (neutral at 0.5)
  SAT_PATIENCE_MIN: 0.85, // loyal customers wait longer
  SAT_PATIENCE_SPAN: 0.3,
  POP_APPROACH: 0.25,     // popularity moves this fraction toward target
  UNVISITED_DRIFT: 0.06,  // unvisited spots drift toward their baselines
  AD_MAX_BOOST: 0.5,      // ad boost asymptote (+50% traffic)
  AD_HALFSCALE: 20,       // $ spend where the boost curve bends
  WIN_LIFETIME_REVENUE: 15000, // Reserve-tier spend, but you're the one earning it
  START_CASH: 300,
} as const;

export interface Mods {
  serveTicks: number;
  blendTicks: number;
  patienceMult: number;
  drawMult: number;
  noSpoilage: boolean;
  iceKeep: number;   // fraction kept overnight
  freeIce: boolean;
  secondServer: boolean;
  standTier: number;
  storage: Record<string, number>;
}

export function computeMods(state: GameState): Mods {
  const m: Mods = {
    serveTicks: C.BASE_SERVE_TICKS,
    blendTicks: C.BASE_BLEND_TICKS,
    patienceMult: 1,
    drawMult: 1,
    noSpoilage: false,
    iceKeep: 0,
    freeIce: false,
    secondServer: false,
    standTier: 0,
    storage: { ...DEFAULT_STORAGE },
  };
  for (const id of state.upgrades) {
    const u = UPGRADE_BY_ID[id];
    if (!u) continue;
    const e = u.effect;
    if (e.kind === 'serveSpeed') m.serveTicks = Math.max(1, m.serveTicks - e.ticks);
    else if (e.kind === 'blendSpeed') m.blendTicks = Math.max(1, m.blendTicks - e.ticks);
    else if (e.kind === 'patience') m.patienceMult *= e.mult;
    else if (e.kind === 'draw') m.drawMult *= e.mult;
    else if (e.kind === 'noSpoilage') m.noSpoilage = true;
    else if (e.kind === 'iceSaver') m.iceKeep = Math.max(m.iceKeep, e.keep);
    else if (e.kind === 'freeIce') m.freeIce = true;
    else if (e.kind === 'stand' && e.tier > m.standTier) {
      m.standTier = e.tier;
      m.drawMult *= e.draw;
      m.storage = { ...e.storage };
    }
  }
  for (const id of state.staff) {
    const s = STAFF_BY_ID[id];
    if (!s) continue;
    if (s.effect.kind === 'secondServer') m.secondServer = true;
    else if (s.effect.kind === 'patience') m.patienceMult *= s.effect.mult;
  }
  return m;
}

// Diminishing returns on Instagram/TikTok spend; day-scoped like the original.
export function adBoost(spend: number): number {
  return 1 + C.AD_MAX_BOOST * (1 - Math.exp(-spend / C.AD_HALFSCALE));
}

// 0..1 — how good the recipe tastes today (ideal ice tracks temperature).
export function tasteQuality(recipe: Recipe, tempF: number): number {
  let penalty = 0;
  penalty += Math.abs(recipe.ice - idealIce(tempF)) * 0.15;
  if (recipe.strawberries < 4) penalty += (4 - recipe.strawberries) * 0.15; // watery
  if (recipe.strawberries > 8) penalty += (recipe.strawberries - 8) * 0.05;
  if (recipe.coconutCream === 0) penalty += 0.3; // no body
  if (recipe.coconutCream > 4) penalty += (recipe.coconutCream - 4) * 0.1;
  if (recipe.seaMoss === 0) penalty += 0.1;  // no glow
  if (recipe.seaMoss >= 4) penalty += 0.2;   // slimy
  return Math.max(0, Math.min(1, 1 - penalty));
}

// In-game calendar: Year 1 – Month 1 – Day 1, 30-day months, 12-month years.
export function calendar(day: number): { year: number; month: number; dayOfMonth: number } {
  const d = day - 1;
  return {
    year: Math.floor(d / 360) + 1,
    month: (Math.floor(d / 30) % 12) + 1,
    dayOfMonth: (d % 30) + 1,
  };
}

export function fmtMoney(n: number): string {
  return `${n.toFixed(2)} $`;
}
