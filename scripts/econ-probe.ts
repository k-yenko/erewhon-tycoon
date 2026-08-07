// Price-elasticity probe: sweeps price across weather/location scenarios
// through the real engine and prints the demand/revenue curves.
import { newGame } from '../src/game/save';
import { createSim, createSimContext, skipToEnd } from '../src/game/simulation';
import { LOCATION_BY_ID } from '../src/game/content/locations';
import { UNIT_VALUE } from '../src/game/content/supplies';
import { idealIce } from '../src/game/content/weather';
import type { DailyContent, GameState } from '../src/game/types';

const SCENARIOS: [string, string, number][] = [
  ['driveway', 'perfect75', 75],
  ['driveway', 'rain', 58],
  ['venice', 'heatwave', 98],
  ['palisades', 'perfect75', 75],
  ['palisades', 'heatwave', 98],
  ['beverlygrove', 'rain', 58],
];
const PRICES = [8, 11, 14, 17, 20, 23, 26, 30, 34];
const TRIALS = 8;

function makeDaily(weatherId: string, tempF: number): DailyContent {
  return {
    dateKey: '2026-08-07',
    gameDay: 1,
    weatherId,
    tempF,
    eventId: 'adaptogens-real', // mild global event, no pay modifier
    dropId: 'hailey',
    shelfItem: { name: 'probe item', price: 20, source: 'pool', category: 'snack' },
    viralShelf: false,
    useLive: false,
    liveWeather: false,
    marketPrices: { strawberries: 1, coconutCream: 1, seaMoss: 1, ice: 1, cups: 1 },
    rivalLocationId: '',
  };
}

function runDay(locId: string, daily: DailyContent, price: number, day: number) {
  const state: GameState = newGame();
  state.locationId = locId;
  state.price = price;
  state.day = day;
  state.daily = daily;
  state.recipe.ice = Math.max(1, idealIce(daily.tempF));
  // ample stock, maxed serve upgrades so supply-side isn't the bottleneck early
  state.stock = { strawberries: 100, coconutCream: 100, seaMoss: 200, ice: 200, cups: 200 };
  state.upgrades = ['vitamix', 'blendtec', 'tipscreen'];
  state.staff = ['madison'];
  const ctx = createSimContext(state);
  const sim = skipToEnd(ctx, createSim());
  const ingredientCost = Object.entries(sim.stockUsed).reduce(
    (s, [id, n]) => s + (UNIT_VALUE[id] ?? 0) * n,
    0,
  );
  // core smoothie economics only (exclude shelf-attach noise)
  const smoothieRevenue = sim.revenue - sim.shelfSold * daily.shelfItem.price;
  return {
    sold: sim.cupsSold,
    total: sim.customersTotal,
    refused: sim.complaints.price,
    revenue: smoothieRevenue,
    profit: smoothieRevenue - ingredientCost - LOCATION_BY_ID[locId].rent,
  };
}

for (const [locId, weatherId, tempF] of SCENARIOS) {
  const loc = LOCATION_BY_ID[locId];
  console.log(`\n=== ${loc.name} — ${weatherId} (wealth $${loc.wealth}, rent $${loc.rent}) ===`);
  console.log('price   sold/traffic  accept%   revenue   profit');
  let best = { price: 0, profit: -Infinity };
  for (const price of PRICES) {
    let sold = 0, total = 0, refused = 0, revenue = 0, profit = 0;
    for (let t = 0; t < TRIALS; t++) {
      const r = runDay(locId, makeDaily(weatherId, tempF), price, 1 + t);
      sold += r.sold; total += r.total; refused += r.refused;
      revenue += r.revenue; profit += r.profit;
    }
    sold /= TRIALS; total /= TRIALS; refused /= TRIALS; revenue /= TRIALS; profit /= TRIALS;
    const accept = total > 0 ? Math.round((1 - refused / total) * 100) : 0;
    if (profit > best.profit) best = { price, profit };
    console.log(
      `$${String(price).padEnd(5)} ${String(Math.round(sold)).padStart(4)}/${String(Math.round(total)).padEnd(6)} ` +
        `${String(accept).padStart(5)}%   $${revenue.toFixed(0).padStart(6)}  $${profit.toFixed(0).padStart(6)}`,
    );
  }
  console.log(`--> best price ≈ $${best.price} (avg profit $${best.profit.toFixed(0)})`);
}
