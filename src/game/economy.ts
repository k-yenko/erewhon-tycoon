import type { GameState, LocationDef, Recipe } from './types';
import { UPGRADE_BY_ID, DEFAULT_STORAGE, RESALE_RATE } from './content/upgrades';
import { UNIT_VALUE, BUYBACK_RATE } from './content/supplies';
import { STAFF_BY_ID } from './content/staff';
import { LOCATION_BY_ID } from './content/locations';
import { idealIce } from './content/weather';

export const round2 = (n: number): number => Math.round(n * 100) / 100;

// Every tunable number in one place for the balance pass.
export const C = {
  DAY_TICKS: 60,          // one in-game hour, one tick = one minute
  MS_PER_TICK: 1500,      // 90s per day at 1x
  CUPS_PER_BATCH: 12,
  BASE_SERVE_TICKS: 2, // tip-screen upgrade brings this to 1; Madison serves in parallel
  BASE_BLEND_TICKS: 4,
  BASE_PATIENCE_MIN: 15,
  BASE_PATIENCE_SPREAD: 20,
  BALK_LINE: 14,          // hard visual cap; the real balk test is estimated wait vs patience
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
  RIVAL_TRAFFIC: 0.75,    // Moon Juus parked here: they take a cut of the crowd
  RIVAL_PAY: 0.85,        // ...and having an alternative makes people price-picky
  RIVAL_TRAFFIC_UNDERCUT: 0.7,  // when the price war is on, the cut gets deeper
  RIVAL_PAY_UNDERCUT: 0.8,
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

// Which act of the game you're in: 1 grind, 2 the landlord notices, 3 juice war.
export const ERA_2_AT = 3000;
export const ERA_3_AT = 8000;
export const RIVAL_UNDERCUT_AT = 12000; // deep in Act III the war turns personal
export function era(state: GameState): 1 | 2 | 3 {
  return state.lifetimeRevenue >= ERA_3_AT ? 3 : state.lifetimeRevenue >= ERA_2_AT ? 2 : 1;
}

// Moon Juus is part of the story: it rolls into town in Act II no matter what.
// The advanced-mode toggle just invites it from day 1.
export function rivalActive(state: GameState): boolean {
  return !!state.settings?.rival || era(state) >= 2;
}

// Is the Moon Juus truck parked at this location today?
export function rivalAt(state: GameState, locId: string): boolean {
  return rivalActive(state) && state.daily?.rivalLocationId === locId;
}

// The Flagship Dream: reserve-tier revenue AND the flagship cart.
export function hasWon(state: GameState): boolean {
  return state.lifetimeRevenue >= C.WIN_LIFETIME_REVENUE && state.upgrades.includes('stand3');
}

// What everything would fetch in a fire sale — supplies at buyback, gear at
// resale. One formula for the balance sheet, the bankruptcy check, the score.
export function liquidationValue(state: GameState): number {
  const stock = Object.entries(state.stock).reduce(
    (s, [id, n]) => s + (UNIT_VALUE[id] ?? 0) * n * BUYBACK_RATE,
    0,
  );
  const gear = state.upgrades.reduce(
    (s, id) => s + (UPGRADE_BY_ID[id]?.price ?? 0) * RESALE_RATE,
    0,
  );
  return stock + gear;
}

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
  pipelineBlend: boolean; // next batch blends while the current one pours
  batchSize: number;      // cups per blended batch
  rentCap: boolean;       // the lawyer halves the landlord's premium
  noveltyMult: number;    // ×0.6 with the residency program
  loyaltyMult: number;    // satisfaction repays more repeat traffic
  rivalResist: boolean;   // halves Moon Juus's bite
  dropFanMult: number;    // superfan chance multiplier
  supplyCostMult: number; // ingredient order discount
  tasteAdd: number;       // recipe floor from the R&D chef
  shelfGlobalMult: number;// merch empire attach multiplier
  heatPatience: number;   // extra patience on 85°F+ days (misting system)
  balkLine: number;       // how deep the line can grow before people balk
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
    pipelineBlend: false,
    batchSize: C.CUPS_PER_BATCH,
    rentCap: false,
    noveltyMult: 1,
    loyaltyMult: 1,
    rivalResist: false,
    dropFanMult: 1,
    supplyCostMult: 1,
    tasteAdd: 0,
    shelfGlobalMult: 1,
    heatPatience: 1,
    balkLine: C.BALK_LINE,
    storage: { ...DEFAULT_STORAGE },
  };
  let storageBoost = 1;
  for (const id of state.upgrades) {
    const u = UPGRADE_BY_ID[id];
    if (!u) continue;
    const e = u.effect;
    if (e.kind === 'serveSpeed') m.serveTicks = Math.max(0.5, m.serveTicks - e.ticks);
    else if (e.kind === 'blendSpeed') m.blendTicks = Math.max(1, m.blendTicks - e.ticks);
    else if (e.kind === 'patience') m.patienceMult *= e.mult;
    else if (e.kind === 'draw') m.drawMult *= e.mult;
    else if (e.kind === 'noSpoilage') m.noSpoilage = true;
    else if (e.kind === 'iceSaver') m.iceKeep = Math.max(m.iceKeep, e.keep);
    else if (e.kind === 'freeIce') m.freeIce = true;
    else if (e.kind === 'pipelineBlend') m.pipelineBlend = true;
    else if (e.kind === 'batchSize') m.batchSize += e.cups;
    else if (e.kind === 'rentCap') m.rentCap = true;
    else if (e.kind === 'noveltyGuard') m.noveltyMult = 0.6;
    else if (e.kind === 'loyaltyBoost') m.loyaltyMult *= e.mult;
    else if (e.kind === 'storageBoost') storageBoost *= e.mult;
    else if (e.kind === 'rivalResist') m.rivalResist = true;
    else if (e.kind === 'dropFanBoost') m.dropFanMult = 2;
    else if (e.kind === 'supplyDiscount') m.supplyCostMult *= e.mult;
    else if (e.kind === 'tasteBoost') m.tasteAdd += e.add;
    else if (e.kind === 'shelfBoost') m.shelfGlobalMult *= e.mult;
    else if (e.kind === 'heatPatience') m.heatPatience *= e.mult;
    else if (e.kind === 'lineCap') m.balkLine += e.add;
    else if (e.kind === 'stand' && e.tier > m.standTier) {
      m.standTier = e.tier;
      m.drawMult *= e.draw;
      m.storage = { ...e.storage };
    }
  }
  if (storageBoost !== 1) {
    for (const k of Object.keys(m.storage)) m.storage[k] = Math.round(m.storage[k] * storageBoost);
  }
  for (const id of state.staff) {
    const s = STAFF_BY_ID[id];
    if (!s) continue;
    if (s.effect.kind === 'secondServer') m.secondServer = true;
    else if (s.effect.kind === 'patience') m.patienceMult *= s.effect.mult;
  }
  return m;
}

// Dynamic rent: make a corner famous and the landlord reprices it.
// Free spots stay free; the premium scales with popularity above neutral.
export function rentFor(state: GameState, locId: string): number {
  const loc = LOCATION_BY_ID[locId];
  if (!loc || loc.rent === 0) return 0;
  const pop = state.locations[locId]?.popularity ?? 0;
  const lawyer = state.upgrades.includes('leaselawyer') ? 0.5 : 1;
  const premium = 1 + 0.5 * lawyer * Math.max(0, pop - 0.5);
  return round2(loc.rent * premium);
}

// Diminishing returns on Instagram/TikTok spend; day-scoped like the original.
export function adBoost(spend: number): number {
  return 1 + C.AD_MAX_BOOST * (1 - Math.exp(-spend / C.AD_HALFSCALE));
}

// 0..1 — how good the recipe tastes today. Ideal ice tracks temperature, and
// each neighborhood shifts the targets (recipe is product-market fit).
export function tasteQuality(recipe: Recipe, tempF: number, loc?: LocationDef): number {
  const b = loc?.tasteBias ?? {};
  const iceTarget = idealIce(tempF) + (b.ice ?? 0);
  const strawFloor = 4 + (b.strawberries ?? 0);
  const cocoCeil = 4 + (b.coconutCream ?? 0);
  const mossCeil = 4 + (b.seaMoss ?? 0);
  let penalty = 0;
  penalty += Math.abs(recipe.ice - iceTarget) * 0.15;
  if (recipe.strawberries < strawFloor) penalty += (strawFloor - recipe.strawberries) * 0.15;
  if (recipe.strawberries > 8) penalty += (recipe.strawberries - 8) * 0.05;
  if (recipe.coconutCream === 0) penalty += 0.3; // no body
  if (recipe.coconutCream > cocoCeil) penalty += (recipe.coconutCream - cocoCeil) * 0.1;
  if (recipe.seaMoss === 0) penalty += (b.seaMoss ?? 0) > 0 ? 0.25 : 0.1; // wellness crowds notice
  if (recipe.seaMoss >= mossCeil) penalty += 0.2; // slimy
  return Math.max(0, Math.min(1, 1 - penalty));
}

// How many smoothies current stock can produce (the supplies-planning number).
export function stockCoverage(state: GameState, freeIce: boolean): number {
  const r = state.recipe;
  const parts: number[] = [];
  if (r.strawberries > 0) parts.push(Math.floor(state.stock.strawberries / r.strawberries));
  if (r.coconutCream > 0) parts.push(Math.floor(state.stock.coconutCream / r.coconutCream));
  if (r.seaMoss > 0) parts.push(Math.floor(state.stock.seaMoss / r.seaMoss));
  if (!freeIce && r.ice > 0) parts.push(Math.floor(state.stock.ice / r.ice));
  const batches = parts.length > 0 ? Math.min(...parts) : 0;
  return Math.min(batches * C.CUPS_PER_BATCH, state.stock.cups);
}

// In-game calendar: Year 1 starts Jan 1, 30-day months, 12-month years.
// Day 1 is a Monday; every 7th day the city changes character.
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
export function calendar(day: number): {
  year: number;
  month: number;
  monthName: string;
  dayOfMonth: number;
  weekday: string;
  weekend: boolean;
} {
  const d = day - 1;
  const month = (Math.floor(d / 30) % 12) + 1;
  return {
    year: Math.floor(d / 360) + 1,
    month,
    monthName: MONTHS[month - 1],
    dayOfMonth: (d % 30) + 1,
    weekday: WEEKDAYS[d % 7],
    weekend: d % 7 >= 5,
  };
}

export function fmtMoney(n: number): string {
  return `${n.toFixed(2)} $`;
}
