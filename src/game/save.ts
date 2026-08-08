import type { GameState } from './types';
import { LOCATIONS } from './content/locations';
import { C } from './economy';

const SAVE_KEY = 'erewhon-tycoon:save';
const SAVE_VERSION = 6; // v6: per-location novelty

export function newGame(): GameState {
  return {
    version: SAVE_VERSION,
    seedNonce: Math.floor(Math.random() * 0xffffffff),
    settings: { market: false, rival: false },
    cash: C.START_CASH,
    day: 1,
    stock: { strawberries: 0, coconutCream: 0, seaMoss: 0, ice: 0, cups: 0 },
    stockAge: { strawberries: 0, coconutCream: 0 },
    recipe: { strawberries: 4, coconutCream: 2, seaMoss: 1, ice: 2 },
    price: 18,
    adSpend: 0,
    locationId: 'driveway',
    upgrades: [],
    staff: [],
    locations: Object.fromEntries(
      LOCATIONS.map((l) => [
        l.id,
        // Each spot starts at its own character baseline (visible on the Rent tab).
        { popularity: l.basePopularity, satisfaction: l.baseSatisfaction, novelty: 1 },
      ]),
    ),
    lifetimeRevenue: 0,
    results: [],
    daily: null,
    wonShown: false,
    gameOver: false,
  };
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Partial<GameState>;
    if (typeof stored.cash !== 'number' || typeof stored.day !== 'number') return null;
    if (stored.version === SAVE_VERSION) {
      // backfill fields added without a version bump
      return { settings: { market: false, rival: false }, ...stored } as GameState;
    }
    return migrate(stored);
  } catch {
    return null;
  }
}

// Older saves get new fields filled from defaults — progress is never wiped.
function migrate(stored: Partial<GameState>): GameState {
  const base = newGame();
  const locations = { ...base.locations };
  for (const [id, ls] of Object.entries(stored.locations ?? {})) {
    if (locations[id]) locations[id] = { ...locations[id], ...ls };
  }
  return {
    ...base,
    ...stored,
    version: SAVE_VERSION,
    seedNonce: stored.seedNonce ?? base.seedNonce,
    stock: { ...base.stock, ...stored.stock },
    recipe: { ...base.recipe, ...stored.recipe },
    locations,
    daily: null, // regenerate with the current schema
  } as GameState;
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // storage full/blocked — play on without persistence
  }
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
