// Headless balance harness — plays N days through the real engine with a greedy bot.
import { newGame } from '../src/game/save';
import { generateDaily } from '../src/game/dailyContent';
import {
  createSim,
  createSimContext,
  overnight,
  settleDay,
  skipToEnd,
} from '../src/game/simulation';
import { computeMods, C } from '../src/game/economy';
import { idealIce } from '../src/game/content/weather';
import { SUPPLIES } from '../src/game/content/supplies';
import { UPGRADES } from '../src/game/content/upgrades';
import { LOCATION_BY_ID } from '../src/game/content/locations';
import type { GameState, StockId } from '../src/game/types';

const DAYS = Number(process.argv[2] ?? 25);
const state: GameState = newGame();

function buyTo(state: GameState, id: StockId, target: number, cap: number) {
  const def = SUPPLIES.find((s) => s.id === id)!;
  let guard = 0;
  while (state.stock[id] < target && guard++ < 50) {
    // best value-per-unit tier that fits storage & wallet, else smallest affordable
    const affordable = def.tiers.filter(
      (t) => state.stock[id] + t.qty <= cap && state.cash - t.cost > 5,
    );
    if (affordable.length === 0) break;
    const fitting = affordable.reduce((a, b) => (a.cost / a.qty <= b.cost / b.qty ? a : b));
    state.cash -= fitting.cost;
    state.stock[id] += fitting.qty;
  }
}

const UPGRADE_PRIORITY = ['vitamix', 'tipscreen', 'subzero', 'blendtec', 'stand1', 'icedispenser', 'shadesail', 'stand2', 'ledhalo', 'soundbath', 'stand3', 'icemaker'];
const MOVE_PLAN: [number, string][] = [
  [0, 'driveway'],
  [800, 'silverlake'],
  [2000, 'venice'],
  [5000, 'beverlygrove'],
  [12000, 'palisades'],
];

let violations = 0;
for (let d = 1; d <= DAYS; d++) {
  state.daily = generateDaily('2026-08-07', d, state.seedNonce);

  // strategy
  for (const [minCash, loc] of MOVE_PLAN) if (state.cash >= minCash) state.locationId = loc;
  for (const id of UPGRADE_PRIORITY) {
    const u = UPGRADES.find((x) => x.id === id)!;
    if (!state.upgrades.includes(id) && state.cash > u.price * 2.5) {
      state.cash -= u.price;
      state.upgrades.push(id);
    }
  }
  state.staff = state.cash > 3000 ? ['madison', 'sage'] : state.cash > 1200 ? ['madison'] : [];
  state.adSpend = state.cash > 2000 ? 50 : state.cash > 400 ? 15 : 0;
  // adaptive pricing like a human: a notch under local willingness-to-pay
  state.price = LOCATION_BY_ID[state.locationId].wealth - 2;
  state.recipe.ice = Math.max(1, idealIce(state.daily.tempF));
  state.recipe.strawberries = 4;
  state.recipe.coconutCream = 2;
  state.recipe.seaMoss = 1;

  const mods = computeMods(state);
  const expect = Math.min(80, 20 + d * 5);
  const batches = Math.ceil(expect / C.CUPS_PER_BATCH);
  buyTo(state, 'cups', expect, mods.storage.cups);
  buyTo(state, 'strawberries', batches * state.recipe.strawberries, mods.storage.strawberries);
  buyTo(state, 'coconutCream', batches * state.recipe.coconutCream, mods.storage.coconutCream);
  buyTo(state, 'seaMoss', batches * state.recipe.seaMoss, mods.storage.seaMoss);
  if (!mods.freeIce) buyTo(state, 'ice', batches * state.recipe.ice, mods.storage.ice);

  const cashBefore = state.cash;
  const ctx = createSimContext(state);
  const sim = skipToEnd(ctx, createSim());
  const r = settleDay(state, sim);
  overnight(state);

  // results math must reconcile
  const lhs = r.revenue - r.stockUsedCost - r.stockLostCost - r.rent - r.marketing - r.wages;
  if (Math.abs(lhs - r.earnings) > 0.01) {
    violations++;
    console.log(`  !! math violation day ${d}: ${lhs.toFixed(2)} vs ${r.earnings.toFixed(2)}`);
  }
  if ([r.revenue, state.cash].some((n) => !Number.isFinite(n))) {
    violations++;
    console.log(`  !! NaN day ${d}`);
  }

  console.log(
    `day ${String(d).padStart(2)} @${state.results.at(-1)!.locationId.padEnd(12)} ` +
      `sold ${String(r.cupsSold).padStart(3)}/${String(r.customersTotal).padStart(3)} ` +
      `rev ${r.revenue.toFixed(0).padStart(5)} earn ${r.earnings.toFixed(0).padStart(5)} ` +
      `cash ${state.cash.toFixed(0).padStart(6)} (was ${cashBefore.toFixed(0)}) ` +
      `😍${r.happy} 🤢${r.complaints.taste} 💸${r.complaints.price} ⌛${r.complaints.wait}` +
      `${r.soldOut ? ' SOLDOUT' : ''}${state.gameOver ? ' GAMEOVER' : ''}`,
  );
  if (state.gameOver) break;
}
console.log(
  `\nlifetime revenue ${state.lifetimeRevenue.toFixed(0)}, upgrades: ${state.upgrades.join(',')}`,
);
console.log(violations === 0 ? 'MATH OK' : `${violations} VIOLATIONS`);
