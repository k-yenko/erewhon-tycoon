import type { GameState } from './types';
import { LOCATIONS } from './content/locations';
import { C } from './economy';

const SAVE_KEY = 'erewhon-tycoon:save';
const SAVE_VERSION = 5; // v5: seed nonce + shelf economy

export function newGame(): GameState {
  return {
    version: SAVE_VERSION,
    seedNonce: Math.floor(Math.random() * 0xffffffff),
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
        { popularity: l.basePopularity, satisfaction: l.baseSatisfaction },
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
    const state = JSON.parse(raw) as GameState;
    if (state.version !== SAVE_VERSION) return null; // future: migrations
    return state;
  } catch {
    return null;
  }
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
