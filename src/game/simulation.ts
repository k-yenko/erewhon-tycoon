import type {
  DailyContent,
  DayResult,
  GameState,
  SimCustomer,
  SimState,
  StockId,
} from './types';
import { C, computeMods, adBoost, tasteQuality, type Mods } from './economy';
import { LOCATION_BY_ID } from './content/locations';
import { EVENT_BY_ID } from './content/events';
import { weatherFor } from './dailyContent';
import { DROP_BY_ID } from './content/products';
import { UNIT_VALUE } from './content/supplies';
import { STAFF_BY_ID } from './content/staff';
import { gaussian, mulberry32 } from './rng';
import { pickReview, type ReviewVariant } from './content/reviews';

// Intra-day traffic curve like the original's hourly customer counts:
// quiet open, lunch-rush peak, afternoon taper. Averages ~1 over the day.
export function trafficCurve(minute: number): number {
  const t = minute / C.DAY_TICKS;
  if (t < 0.25) return 0.6;
  if (t < 0.65) return 1.45;
  return 0.8;
}

export interface SimContext {
  state: GameState;
  daily: DailyContent;
  mods: Mods;
  rand: () => number;
  spawnPerTick: number;
  wealthMean: number;
  patienceMult: number;
  dropPrice: number;
  shelfAttachChance: number;
  nextId: number;
}

// How much of this location's crowd a global event actually touches.
function audienceWeight(locationId: string, audience?: string): number {
  if (!audience || audience === 'everyone') return 1;
  const loc = LOCATION_BY_ID[locationId];
  if (audience === 'tourists') return loc.touristy;
  if (audience === 'industry') return loc.industry;
  // locals: whoever isn't a tourist (Coachella empties Silver Lake, not Venice)
  return 1 - loc.touristy * 0.85;
}

// The active headline: the real-LA fetch when today prefers it, else the pool event.
export function activeEvent(daily: DailyContent, locationId: string) {
  if (daily.useLive && daily.liveEvent) {
    const e = daily.liveEvent;
    return { headline: e.headline, traffic: e.traffic, pay: e.pay, patience: e.patience, vibe: e.vibe, isLive: true };
  }
  const event = EVENT_BY_ID[daily.eventId];
  const applies =
    event && (event.scope.kind === 'global' || event.scope.locationId === locationId);
  // Global events scale by how much of this crowd they move; the effect shrinks
  // toward neutral (×1) where that audience is thin on the ground.
  const w = applies && event.scope.kind === 'global' ? audienceWeight(locationId, event.audience) : 1;
  return {
    headline: event?.headline ?? '',
    traffic: applies ? 1 + ((event.traffic ?? 1) - 1) * w : 1,
    pay: applies ? 1 + ((event.pay ?? 1) - 1) * w : 1,
    patience: applies ? 1 + ((event.patience ?? 1) - 1) * w : 1,
    vibe: applies ? event.vibe : undefined,
    isLive: false,
  };
}

// Today's odds that a smoothie buyer also grabs the shelf item.
export function shelfAttachChance(state: GameState): number {
  const daily = state.daily!;
  const item = daily.shelfItem;
  const loc = LOCATION_BY_ID[state.locationId];
  const weather = weatherFor(daily);
  const ev = activeEvent(daily, state.locationId);

  let p: number = C.SHELF_BASE_ATTACH[item.category] ?? 0.12;
  // price fit: an impulse buy vs a considered one, relative to local wealth
  p *= Math.min(1.6, Math.max(0.25, (loc.wealth * 1.5) / Math.max(item.price, 4)));
  // weather: heat sells cold things, rain kills merch browsing
  if (daily.tempF >= 90 && (item.category === 'drink' || item.category === 'snack')) p *= 1.5;
  if (weather.traffic < 0.7 && item.category === 'merch') p *= 0.6;
  // event vibe: wellness days move supplements, hype days move merch
  if (ev.vibe === 'wellness' && item.category === 'supplement') p *= 1.6;
  if (ev.vibe === 'hype' && item.category === 'merch') p *= 1.8;
  // marketing: ads push the shelf, merch most of all (the insta/tiktok effect)
  const adLift = (adBoost(state.adSpend) - 1) * C.SHELF_AD_SENS;
  p *= 1 + adLift * (item.category === 'merch' ? C.SHELF_MERCH_AD_MULT : 1);
  if (daily.viralShelf) p *= C.SHELF_VIRAL_MULT;
  return Math.min(0.85, p);
}

export function createSimContext(state: GameState): SimContext {
  const daily = state.daily!;
  const mods = computeMods(state);
  const loc = LOCATION_BY_ID[state.locationId];
  const weather = weatherFor(daily);
  const ev = activeEvent(daily, state.locationId);

  const { popularity: pop, satisfaction: sat } = state.locations[state.locationId];
  const repeatMult = C.SAT_TRAFFIC_MIN + C.SAT_TRAFFIC_SPAN * sat; // loyal regulars
  const expectedCustomers =
    loc.baseTraffic *
    weather.traffic *
    ev.traffic *
    (0.5 + pop) *
    repeatMult *
    adBoost(state.adSpend) *
    mods.drawMult *
    (daily.viralShelf ? C.SHELF_VIRAL_TRAFFIC : 1);

  return {
    state,
    daily,
    mods,
    // seeded per game-day so Skip and live play agree
    rand: mulberry32(((state.day * 2654435761) ^ 0x9e3779b9 ^ state.seedNonce) >>> 0),
    spawnPerTick: expectedCustomers / C.DAY_TICKS,
    wealthMean: loc.wealth * weather.payTolerance * ev.pay,
    patienceMult:
      ev.patience * mods.patienceMult * (C.SAT_PATIENCE_MIN + C.SAT_PATIENCE_SPAN * sat),
    dropPrice: DROP_BY_ID[daily.dropId]?.price ?? state.price,
    shelfAttachChance: shelfAttachChance(state),
    nextId: 1,
  };
}

export function createSim(): SimState {
  return {
    minute: 0,
    reviews: [],
    customers: [],
    queue: [],
    cupsSold: 0,
    revenue: 0,
    batchCupsLeft: 0,
    blendTicksLeft: 0,
    serveProgress: 1,
    serveProgress2: 1,
    complaints: { taste: 0, price: 0, wait: 0 },
    happy: 0,
    customersTotal: 0,
    walkedAway: 0,
    soldOut: false,
    shelfSold: 0,
    stockUsed: { strawberries: 0, coconutCream: 0, seaMoss: 0, ice: 0, cups: 0 },
    finished: false,
  };
}

function addReview(ctx: SimContext, sim: SimState, variant: ReviewVariant): void {
  sim.reviews.push({
    variant,
    ...pickReview(variant, ctx.rand(), ctx.state.recipe, ctx.daily.tempF),
  });
  if (sim.reviews.length > 40) sim.reviews.shift();
}

function hasStockForBatch(ctx: SimContext, sim: SimState): boolean {
  const { recipe } = ctx.state;
  const { stock } = ctx.state;
  const need: [StockId, number][] = [
    ['strawberries', recipe.strawberries],
    ['coconutCream', recipe.coconutCream],
    ['seaMoss', recipe.seaMoss],
  ];
  if (!ctx.mods.freeIce) need.push(['ice', recipe.ice]);
  return need.every(([id, n]) => stock[id] - sim.stockUsed[id] >= n);
}

function consumeBatch(ctx: SimContext, sim: SimState): void {
  const { recipe } = ctx.state;
  sim.stockUsed.strawberries += recipe.strawberries;
  sim.stockUsed.coconutCream += recipe.coconutCream;
  sim.stockUsed.seaMoss += recipe.seaMoss;
  if (!ctx.mods.freeIce) sim.stockUsed.ice += recipe.ice;
  sim.batchCupsLeft = C.CUPS_PER_BATCH;
}

function cupsAvailable(ctx: SimContext, sim: SimState): boolean {
  return ctx.state.stock.cups - sim.stockUsed.cups > 0;
}

// One in-game minute. Mutates sim in place; returns it for convenience.
export function stepSim(ctx: SimContext, sim: SimState): SimState {
  if (sim.finished) return sim;
  const { rand } = ctx;
  const taste = tasteQuality(ctx.state.recipe, ctx.daily.tempF);

  // — Spawns (Poisson-ish, shaped by the time-of-day curve) —
  const rate = ctx.spawnPerTick * trafficCurve(sim.minute);
  let spawns = Math.floor(rate);
  if (rand() < rate - spawns) spawns += 1;
  for (let i = 0; i < spawns; i++) {
    const wtp = gaussian(rand, ctx.wealthMean, C.WTP_SD);
    const wantsDrop = rand() < C.DROP_FAN_CHANCE;
    const effectivePrice = wantsDrop ? ctx.dropPrice : ctx.state.price;
    const willBuy = effectivePrice <= wtp;
    sim.customersTotal += 1;
    const cust: SimCustomer = {
      id: ctx.nextId++,
      x: 0,
      state: 'walking',
      patienceLeft: Math.round(
        (C.BASE_PATIENCE_MIN + rand() * C.BASE_PATIENCE_SPREAD) * ctx.patienceMult,
      ),
      bubble: null,
      bubbleTtl: 0,
      willBuy,
      wantsDrop,
    };
    // Price-shy customers glance at the sign, complain, and keep walking.
    if (!willBuy) {
      cust.bubble = 'price';
      cust.bubbleTtl = 4;
      cust.state = 'leaving';
      sim.complaints.price += 1;
      addReview(ctx, sim, 'price');
    }
    sim.customers.push(cust);
    if (willBuy && !sim.soldOut) {
      // they head for the queue
    } else if (willBuy && sim.soldOut) {
      cust.state = 'leaving';
      sim.walkedAway += 1;
    }
  }

  // — Movement & queue joining —
  for (const c of sim.customers) {
    if (c.state === 'walking') {
      c.x += 0.12;
      if (c.x >= 0.45) {
        if (sim.soldOut) {
          c.state = 'leaving';
          sim.walkedAway += 1;
        } else if (
          // rational balk: "will this line finish before my patience does?"
          // faster serving and a second server directly shorten the estimated wait
          sim.queue.length * (ctx.mods.serveTicks / (ctx.mods.secondServer ? 2 : 1)) >
            c.patienceLeft ||
          sim.queue.length >= C.BALK_LINE
        ) {
          c.state = 'leaving';
          c.bubble = 'wait';
          c.bubbleTtl = 4;
          sim.complaints.wait += 1;
          sim.walkedAway += 1;
          addReview(ctx, sim, 'wait');
        } else {
          c.state = 'queued';
          sim.queue.push(c.id);
        }
      }
    } else if (c.state === 'leaving' || c.state === 'served') {
      c.x += 0.15;
    }
    if (c.bubbleTtl > 0) {
      c.bubbleTtl -= 1;
      if (c.bubbleTtl === 0) c.bubble = null;
    }
  }
  sim.customers = sim.customers.filter((c) => c.x < 1.3);

  // — Patience — (whoever is at the counter is committed and never bails)
  const beingServed = ctx.mods.secondServer ? 2 : 1;
  for (const [qi, id] of [...sim.queue].entries()) {
    const c = sim.customers.find((k) => k.id === id);
    if (!c) {
      sim.queue = sim.queue.filter((q) => q !== id);
      continue;
    }
    if (qi < beingServed) continue;
    c.patienceLeft -= 1;
    if (c.patienceLeft <= 0) {
      sim.queue = sim.queue.filter((q) => q !== id);
      c.state = 'leaving';
      c.bubble = 'wait';
      c.bubbleTtl = 4;
      sim.complaints.wait += 1;
      sim.walkedAway += 1;
      addReview(ctx, sim, 'wait');
    }
  }

  // — Blending —
  if (sim.blendTicksLeft > 0) {
    sim.blendTicksLeft -= 1;
    if (sim.blendTicksLeft === 0) consumeBatch(ctx, sim);
  }

  // — Serving (one or two servers; fractional speed via progress accumulators
  //   so the late-game chain of serve upgrades can go past one-per-tick) —
  const servers = ctx.mods.secondServer ? 2 : 1;
  const progKeys = ['serveProgress', 'serveProgress2'] as const;
  for (let s = 0; s < servers; s++) {
    const key = progKeys[s];
    if (sim.queue.length === 0) {
      sim[key] = Math.min(sim[key], 1); // no banking speed while idle
      continue;
    }

    if (sim.batchCupsLeft === 0 && sim.blendTicksLeft === 0) {
      if (hasStockForBatch(ctx, sim)) {
        sim.blendTicksLeft = ctx.mods.blendTicks;
      } else {
        sim.soldOut = true;
      }
    }
    if (sim.soldOut || !cupsAvailable(ctx, sim)) {
      if (!cupsAvailable(ctx, sim)) sim.soldOut = true;
      // send remaining queue away
      for (const id of sim.queue) {
        const c = sim.customers.find((k) => k.id === id);
        if (c) {
          c.state = 'leaving';
          sim.walkedAway += 1;
        }
      }
      sim.queue = [];
      break;
    }
    if (sim.batchCupsLeft === 0) continue; // blending in progress

    sim[key] += 1 / ctx.mods.serveTicks;
    while (
      sim[key] >= 1 &&
      sim.queue.length > 0 &&
      sim.batchCupsLeft > 0 &&
      cupsAvailable(ctx, sim)
    ) {
      sim[key] -= 1;
      const id = sim.queue.shift()!;
      const c = sim.customers.find((k) => k.id === id);
      if (!c) continue;
      // serve one cup — they pay the price they walked up for
      sim.batchCupsLeft -= 1;
      sim.stockUsed.cups += 1;
      const paid = c.wantsDrop ? ctx.dropPrice : ctx.state.price;
      sim.revenue += paid;
      sim.cupsSold += 1;
      if (ctx.rand() < ctx.shelfAttachChance) {
        sim.revenue += ctx.daily.shelfItem.price;
        sim.shelfSold += 1;
      }
      c.state = 'served';
      if (ctx.rand() < taste) {
        sim.happy += 1;
        c.bubble = ctx.rand() < 0.25 ? 'content' : 'happy';
        if (ctx.rand() < 0.3) addReview(ctx, sim, 'happy');
      } else {
        sim.complaints.taste += 1;
        c.bubble = 'taste';
        addReview(ctx, sim, 'taste');
      }
      c.bubbleTtl = 4;
    }
  }

  // — Clock —
  sim.minute += 1;
  if (sim.minute >= C.DAY_TICKS) sim.finished = true;
  return sim;
}

export function skipToEnd(ctx: SimContext, sim: SimState): SimState {
  while (!sim.finished) stepSim(ctx, sim);
  return sim;
}

// Applies the finished day to the game state and returns the results-screen data.
export function settleDay(state: GameState, sim: SimState): DayResult {
  const loc = LOCATION_BY_ID[state.locationId];
  const wages = state.staff.reduce((s, id) => s + (STAFF_BY_ID[id]?.wage ?? 0), 0);
  const shelfCogs = state.daily!.viralShelf ? C.SHELF_VIRAL_COGS : C.SHELF_COGS;
  const stockUsedCost =
    Object.entries(sim.stockUsed).reduce(
      (s, [id, n]) => s + (UNIT_VALUE[id] ?? 0) * n,
      0,
    ) +
    sim.shelfSold * state.daily!.shelfItem.price * shelfCogs;

  const marketing = state.adSpend;
  const earnings = sim.revenue - stockUsedCost - loc.rent - marketing - wages;

  // consume stock
  for (const [id, n] of Object.entries(sim.stockUsed)) {
    state.stock[id as StockId] = Math.max(0, state.stock[id as StockId] - n);
  }
  state.cash += sim.revenue - loc.rent - marketing - wages;
  state.lifetimeRevenue += sim.revenue;

  // — Satisfaction & popularity (per location) —
  const ls = state.locations[state.locationId];
  const positives = sim.happy;
  const negatives =
    sim.complaints.taste +
    sim.complaints.price * C.PRICE_COMPLAINT_WEIGHT +
    sim.complaints.wait;
  const interactions = positives + negatives;
  if (interactions > 0) {
    const dayScore = positives / interactions;
    ls.satisfaction = C.SAT_CARRY * ls.satisfaction + (1 - C.SAT_CARRY) * dayScore;
  }
  const servedFraction = Math.min(1, sim.cupsSold / Math.max(1, loc.baseTraffic));
  const popTarget = Math.min(1, servedFraction * 0.8 + ls.satisfaction * 0.4);
  ls.popularity += C.POP_APPROACH * (popTarget - ls.popularity);
  if (state.adSpend > 0) ls.popularity = Math.min(1, ls.popularity + 0.02);
  for (const [id, other] of Object.entries(state.locations)) {
    if (id !== state.locationId) {
      const base = LOCATION_BY_ID[id];
      other.popularity += C.UNVISITED_DRIFT * (base.basePopularity - other.popularity);
      other.satisfaction += C.UNVISITED_DRIFT * (base.baseSatisfaction - other.satisfaction);
    }
  }

  // — Diagnostic tips, like the original's results screen —
  const tips: string[] = [];
  if (sim.complaints.wait >= 3)
    tips.push('You were too slow. Customers left the line. Consider staff or a faster blender.');
  if (sim.complaints.taste >= 3)
    tips.push("Your recipe is whack. Check the ice against today's temperature.");
  if (sim.complaints.price >= 3)
    tips.push('People side-eyed the price. Even here, there are limits.');
  if (sim.soldOut) tips.push('You sold out. Imagine the revenue if you had stocked more.');
  if (sim.cupsSold === 0 && sim.customersTotal > 0)
    tips.push('Zero smoothies sold. The vibes were off.');
  if (earnings > 0 && tips.length === 0)
    tips.push('A profitable day of wellness. The algorithm smiles upon you.');

  const result: DayResult = {
    day: state.day,
    locationId: state.locationId,
    cupsSold: sim.cupsSold,
    revenue: sim.revenue,
    stockUsedCost,
    stockLostCost: 0, // filled by overnight processing
    rent: loc.rent,
    marketing,
    wages,
    earnings,
    complaints: { ...sim.complaints },
    happy: sim.happy,
    customersTotal: sim.customersTotal,
    walkedAway: sim.walkedAway,
    satisfactionPct:
      interactions > 0 ? Math.round((positives / interactions) * 100) : 100,
    soldOut: sim.soldOut,
    shelfSold: sim.shelfSold,
    shelfItemName: state.daily!.shelfItem.name,
    shelfRevenue: sim.shelfSold * state.daily!.shelfItem.price,
    bestReview: sim.reviews.find((r) => r.stars >= 3),
    worstReview: sim.reviews.find((r) => r.stars <= 1),
    tips,
  };
  state.results.push(result);
  return result;
}

// Ice melts, perishables spoil, staff contracts end, the calendar turns.
export function overnight(state: GameState): void {
  const mods = computeMods(state);
  let lost = 0;

  if (!mods.freeIce) {
    const kept = Math.floor(state.stock.ice * mods.iceKeep);
    lost += (state.stock.ice - kept) * UNIT_VALUE.ice;
    state.stock.ice = kept;
  }
  if (!mods.noSpoilage) {
    for (const id of ['strawberries', 'coconutCream'] as const) {
      const spoiled = Math.floor(state.stock[id] * C.SPOILAGE_RATE);
      lost += spoiled * UNIT_VALUE[id];
      state.stock[id] -= spoiled;
    }
  }
  const last = state.results[state.results.length - 1];
  if (last) {
    last.stockLostCost = lost;
    last.earnings -= lost;
  }

  state.day += 1; // staff stay hired (and paid daily) until fired, like the original

  // Bankruptcy: can't afford even a minimal free-location day.
  const minimalDay = 60; // rough cost of smallest useful supply run
  if (state.cash < minimalDay && state.stock.cups === 0) {
    state.gameOver = true;
  }
}
