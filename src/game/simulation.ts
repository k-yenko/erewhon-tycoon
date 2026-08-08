import type {
  DailyContent,
  DayResult,
  GameState,
  SimCustomer,
  SimState,
  StockId,
} from './types';
import { C, calendar, computeMods, adBoost, era, liquidationValue, rentFor, rivalAt, tasteQuality, type Mods } from './economy';
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
// rushBias > 1 (office districts) makes peaks peakier and lulls deader.
function trafficCurve(minute: number, rushBias = 1): number {
  const t = minute / C.DAY_TICKS;
  const base = t < 0.25 ? 0.6 : t < 0.65 ? 1.45 : 0.8;
  return Math.max(0.1, 1 + (base - 1) * rushBias);
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
  wtpSd: number;       // willingness-to-pay spread (whale neighborhoods widen it)
  priceGripe: number;  // chance a priced-out walker actually complains
  tasteStrict: number; // taste quality raised to this power (critic neighborhoods)
  rushBias: number;    // lunch-curve sharpness for this location
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
  // A location event you're NOT at still matters a little: crowds drain toward
  // the hot spot (or spread out from the dead one). The news is never a no-op.
  if (event && event.scope.kind === 'location' && event.scope.locationId !== locationId) {
    const pull = event.traffic ?? 1;
    return {
      headline: event.headline,
      traffic: pull > 1 ? 0.92 : pull < 1 ? 1.05 : 1,
      pay: 1,
      patience: 1,
      vibe: event.vibe,
      isLive: false,
    };
  }
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
  p *= loc.quirk?.shelfMult ?? 1; // souvenir neighborhoods attach more
  p *= computeMods(state).shelfGlobalMult; // the merch empire
  return Math.min(0.85, p);
}

// Expected customer count for today at the current location — the same math
// the simulator uses, shared with the player-facing forecast.
export function expectedTraffic(state: GameState): number {
  const daily = state.daily!;
  const mods = computeMods(state);
  const loc = LOCATION_BY_ID[state.locationId];
  const weather = weatherFor(daily);
  const ev = activeEvent(daily, state.locationId);
  const { popularity: pop, satisfaction: sat, novelty } = state.locations[state.locationId];
  const repeatMult =
    C.SAT_TRAFFIC_MIN + C.SAT_TRAFFIC_SPAN * (loc.quirk?.loyalty ?? 1) * mods.loyaltyMult * sat;
  const rivalHere = rivalAt(state, state.locationId);
  let rival = rivalHere
    ? daily.rivalIntent === 'undercut'
      ? C.RIVAL_TRAFFIC_UNDERCUT
      : C.RIVAL_TRAFFIC
    : 1;
  if (rivalHere && mods.rivalResist) rival = 1 - (1 - rival) / 2; // billboard war
  // Day of the week: office districts fill on weekdays and thin out on
  // weekends; beach crowds do the reverse. And commuters still commute in an
  // atmospheric river — bad weather can't empty a work neighborhood on a
  // weekday, it just mutes it. Beach spots feel weather harder both ways.
  const cal = calendar(state.day);
  const weekMult = cal.weekend
    ? 1 - 0.22 * loc.industry + 0.3 * loc.touristy
    : 1 + 0.16 * loc.industry - 0.18 * loc.touristy;
  const sensed = 1 + (weather.traffic - 1) * (loc.quirk?.weatherSens ?? 1);
  const weatherTraffic = cal.weekend
    ? sensed
    : sensed + Math.max(0, 0.75 - sensed) * loc.industry;
  return (
    loc.baseTraffic *
    weatherTraffic *
    weekMult *
    ev.traffic *
    (0.5 + pop) *
    repeatMult *
    adBoost(state.adSpend) *
    mods.drawMult *
    (daily.viralShelf ? C.SHELF_VIRAL_TRAFFIC : 1) *
    (novelty ?? 1) *
    rival
  );
}

// Morning forecast: honest expectation, blurred so it's a forecast, not an oracle.
export function forecastRange(state: GameState): [number, number] {
  const rand = mulberry32(((state.day * 40503) ^ state.seedNonce ^ 0xf0ca) >>> 0);
  const center = expectedTraffic(state) * (0.9 + rand() * 0.2);
  return [Math.max(0, Math.round(center * 0.8)), Math.round(center * 1.2)];
}

export function createSimContext(state: GameState): SimContext {
  const daily = state.daily!;
  const mods = computeMods(state);
  const loc = LOCATION_BY_ID[state.locationId];
  const weather = weatherFor(daily);
  const ev = activeEvent(daily, state.locationId);

  const sat = state.locations[state.locationId].satisfaction;
  const rivalHere = rivalAt(state, state.locationId);
  const expectedCustomers = expectedTraffic(state);

  return {
    state,
    daily,
    mods,
    // seeded per game-day so Skip and live play agree
    rand: mulberry32(((state.day * 2654435761) ^ 0x9e3779b9 ^ state.seedNonce) >>> 0),
    spawnPerTick: expectedCustomers / C.DAY_TICKS,
    wealthMean:
      loc.wealth *
      weather.payTolerance *
      ev.pay *
      (rivalHere
        ? (() => {
            const base =
              daily.rivalIntent === 'undercut' ? C.RIVAL_PAY_UNDERCUT : C.RIVAL_PAY;
            return mods.rivalResist ? 1 - (1 - base) / 2 : base;
          })()
        : 1),
    patienceMult:
      ev.patience *
      mods.patienceMult *
      (daily.tempF >= 85 ? mods.heatPatience : 1) * // misting system earns its keep
      (C.SAT_PATIENCE_MIN + C.SAT_PATIENCE_SPAN * sat),
    dropPrice: DROP_BY_ID[daily.dropId]?.price ?? state.price,
    shelfAttachChance: shelfAttachChance(state),
    wtpSd: C.WTP_SD * (loc.quirk?.wtpSpread ?? 1),
    priceGripe: loc.quirk?.priceGripeMult ?? 1,
    tasteStrict: loc.quirk?.tasteStrict ?? 1,
    rushBias: loc.quirk?.rushBias ?? 1,
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
    pausedId: null,
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
  sim.batchCupsLeft += ctx.mods.batchSize; // accumulate: pipeline blends stack on the remainder
}

function cupsAvailable(ctx: SimContext, sim: SimState): boolean {
  return ctx.state.stock.cups - sim.stockUsed.cups > 0;
}

// One in-game minute. Mutates sim in place; returns it for convenience.
export function stepSim(ctx: SimContext, sim: SimState): SimState {
  if (sim.finished) return sim;
  const { rand } = ctx;
  const taste = Math.min(
    1,
    Math.pow(
      tasteQuality(ctx.state.recipe, ctx.daily.tempF, LOCATION_BY_ID[ctx.state.locationId]),
      ctx.tasteStrict,
    ) + ctx.mods.tasteAdd,
  );

  // — Spawns (Poisson-ish, shaped by the time-of-day curve) —
  const rate = ctx.spawnPerTick * trafficCurve(sim.minute, ctx.rushBias);
  let spawns = Math.floor(rate);
  if (rand() < rate - spawns) spawns += 1;
  for (let i = 0; i < spawns; i++) {
    const wtp = gaussian(rand, ctx.wealthMean, ctx.wtpSd);
    const wantsDrop = rand() < C.DROP_FAN_CHANCE * ctx.mods.dropFanMult;
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
      pace: 0.8 + rand() * 0.5,
    };
    // Price-shy customers glance at the sign, complain, and keep walking —
    // unless the neighborhood expenses everything and can't be bothered.
    if (!willBuy) {
      cust.state = 'leaving';
      if (rand() < ctx.priceGripe) {
        cust.bubble = 'price';
        cust.bubbleTtl = 4;
        sim.complaints.price += 1;
        addReview(ctx, sim, 'price');
      }
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
    if (c.id === sim.pausedId) {
      // being perceived: they stand still for their card
    } else if (c.state === 'walking') {
      c.x += 0.12 * c.pace;
      if (c.x >= 0.45) {
        if (sim.soldOut) {
          c.state = 'leaving';
          sim.walkedAway += 1;
        } else if (
          // rational balk: "will this line finish before my patience does?"
          // faster serving and a second server directly shorten the estimated wait
          sim.queue.length * (ctx.mods.serveTicks / (ctx.mods.secondServer ? 2 : 1)) >
            c.patienceLeft ||
          sim.queue.length >= ctx.mods.balkLine
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
      c.x += 0.15 * c.pace;
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
    if (c.id === sim.pausedId) continue; // no bailing while under inspection
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
  // Double-pitcher rig: start the next batch while cups are still pouring,
  // so the blender stall never reaches the customers.
  if (
    ctx.mods.pipelineBlend &&
    sim.blendTicksLeft === 0 &&
    sim.batchCupsLeft > 0 &&
    sim.batchCupsLeft <= 4 &&
    sim.queue.length > 0 &&
    !sim.soldOut &&
    hasStockForBatch(ctx, sim)
  ) {
    sim.blendTicksLeft = ctx.mods.blendTicks;
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
        c.bubble = 'happy';
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
  const [forecastLo, forecastHi] = forecastRange(state);
  const loc = LOCATION_BY_ID[state.locationId];
  const rent = rentFor(state, state.locationId); // popularity-priced, not the sticker rate
  const wages = state.staff.reduce((s, id) => s + (STAFF_BY_ID[id]?.wage ?? 0), 0);
  const shelfCogs = state.daily!.viralShelf ? C.SHELF_VIRAL_COGS : C.SHELF_COGS;
  const stockUsedCost =
    Object.entries(sim.stockUsed).reduce(
      (s, [id, n]) => s + (UNIT_VALUE[id] ?? 0) * n,
      0,
    ) +
    sim.shelfSold * state.daily!.shelfItem.price * shelfCogs;

  const marketing = state.adSpend;
  const earnings = sim.revenue - stockUsedCost - rent - marketing - wages;

  // consume stock
  for (const [id, n] of Object.entries(sim.stockUsed)) {
    state.stock[id as StockId] = Math.max(0, state.stock[id as StockId] - n);
  }
  const eraBefore = era(state);
  state.cash += sim.revenue - rent - marketing - wages;
  state.lifetimeRevenue += sim.revenue;
  const eraAfter = era(state);

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
  ls.popularity += C.POP_APPROACH * (loc.quirk?.hypeGain ?? 1) * (popTarget - ls.popularity);
  if (state.adSpend > 0) ls.popularity = Math.min(1, ls.popularity + 0.02);
  // Novelty: camp a corner and the neighborhood slowly gets over you;
  // everywhere else, absence makes the crowd grow fonder. Home turf forgives,
  // and the residency program buys goodwill everywhere.
  const modsNow = computeMods(state);
  ls.novelty = Math.max(
    0.35,
    (ls.novelty ?? 1) - 0.07 * (loc.quirk?.noveltyRate ?? 1) * modsNow.noveltyMult,
  );
  for (const [id, other] of Object.entries(state.locations)) {
    if (id !== state.locationId) {
      const base = LOCATION_BY_ID[id];
      other.popularity += C.UNVISITED_DRIFT * (base.basePopularity - other.popularity);
      other.satisfaction += C.UNVISITED_DRIFT * (base.baseSatisfaction - other.satisfaction);
      other.novelty = Math.min(1, (other.novelty ?? 1) + 0.05);
    }
  }

  // — Diagnostic tips, like the original's results screen —
  const tips: string[] = [];
  if (eraAfter > eraBefore) {
    tips.push(
      eraAfter === 2
        ? 'You have entered THE LANDLORD ERA. The city has noticed you — new equipment is available in the upgrades tab.'
        : 'You have entered THE JUICE WARS. Moon Juus knows your name — wartime equipment is available in the upgrades tab.',
    );
  }
  if (sim.complaints.wait >= 3)
    tips.push('You were too slow. Customers left the line. Consider staff or a faster blender.');
  if (sim.complaints.taste >= 3)
    tips.push("Your recipe is whack. Check the ice against today's temperature.");
  if (sim.complaints.price >= 3)
    tips.push('People side-eyed the price. Even here, there are limits.');
  if (sim.soldOut) tips.push('You sold out. Imagine the revenue if you had stocked more.');
  if (sim.cupsSold === 0 && sim.customersTotal > 0)
    tips.push('Zero smoothies sold. The vibes were off.');
  if (ls.novelty < 0.6)
    tips.push('Same cart, same corner. The neighborhood is getting used to you — a change of scenery would do the numbers good.');
  if (rent > loc.rent)
    tips.push(`The landlord noticed your line: rent here is now ${rent.toFixed(2)} $.`);
  if (earnings > 0 && tips.length === 0)
    tips.push('A profitable day of wellness. The algorithm smiles upon you.');
  tips.splice(3); // era news leads; never a wall of advice

  const result: DayResult = {
    day: state.day,
    locationId: state.locationId,
    cupsSold: sim.cupsSold,
    revenue: sim.revenue,
    stockUsedCost,
    stockLostCost: 0, // filled by overnight processing
    rent,
    marketing,
    wages,
    earnings,
    complaints: { ...sim.complaints },
    happy: sim.happy,
    customersTotal: sim.customersTotal,
    walkedAway: sim.walkedAway,
    satisfactionPct:
      interactions > 0 ? Math.round((positives / interactions) * 100) : 100,
    tempF: state.daily!.tempF,
    forecastLo,
    forecastHi,
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

  // Bankruptcy: even selling every jar AND the equipment wouldn't fund a
  // supply run. Until then, there's always something left to liquidate.
  if (state.cash + liquidationValue(state) < 45) {
    state.gameOver = true;
  }
}
