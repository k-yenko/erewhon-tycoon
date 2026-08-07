// Core game types for Erewhon Tycoon
import type { IconName } from '../ui/icons';

export type IngredientId = 'strawberries' | 'coconutCream' | 'seaMoss' | 'ice';
export type StockId = IngredientId | 'cups';

export interface SupplyTier {
  qty: number;
  cost: number;
}

export interface SupplyDef {
  id: StockId;
  name: string;
  icon: IconName;
  tiers: [SupplyTier, SupplyTier, SupplyTier];
  spoils: boolean;      // rolls to lose stock overnight
  meltsNightly: boolean; // ice: gone at end of day
}

export interface Recipe {
  strawberries: number;
  coconutCream: number;
  seaMoss: number;
  ice: number;
}

export interface WeatherDef {
  id: string;
  name: string;        // e.g. "Perfect 75"
  headline: string;    // forecast blurb
  icon: IconName;
  tempF: [number, number]; // range to roll within
  traffic: number;     // multiplier
  payTolerance: number; // multiplier on willingness to pay
}

export type EventScope =
  | { kind: 'global' }
  | { kind: 'location'; locationId: string };

export interface EventDef {
  id: string;
  headline: string;
  scope: EventScope;
  traffic?: number;      // multiplier (default 1)
  pay?: number;          // multiplier on willingness to pay (default 1)
  patience?: number;     // multiplier on queue patience (default 1)
}

export interface LocationDef {
  id: string;
  name: string;
  rent: number;
  blurb: string;         // flavor text shown under the scene
  baseTraffic: number;   // avg potential customers per day at popularity 0.5
  wealth: number;        // avg willingness-to-pay in $ for a smoothie
  basePopularity: number;   // starting/resting popularity at this spot
  baseSatisfaction: number; // starting/resting satisfaction at this spot
  sceneColors: { sky: string; ground: string; accent: string };
}

export interface UpgradeDef {
  id: string;
  name: string;
  price: number;
  tagline: string;
  icon: IconName;
  effect:
    | { kind: 'blendSpeed'; ticks: number }       // reduces batch remix stall
    | { kind: 'serveSpeed'; ticks: number }       // reduces transaction time
    | { kind: 'patience'; mult: number }          // customers wait longer
    | { kind: 'noSpoilage' }                      // fridge
    | { kind: 'iceSaver'; keep: number }          // fraction of ice kept overnight
    | { kind: 'freeIce' }                         // never consume/buy ice
    | { kind: 'draw'; mult: number }              // more passers-by approach
    | { kind: 'stand'; tier: number; draw: number; storage: Record<StockId, number> };
}

export interface StaffDef {
  id: string;
  name: string;
  wage: number;
  tagline: string;
  icon: IconName;
  effect: { kind: 'secondServer' } | { kind: 'patience'; mult: number };
}

export interface ProductDrop {
  id: string;
  name: string;      // e.g. "Strawberry Glaze Skin Smoothie"
  by?: string;       // e.g. "Hailey Bieber"
  price: number;     // real price, used as premium sale price
}

export interface ShelfItem {
  name: string;
  price: number;
  source: 'live' | 'pool'; // live = fetched from ship.erewhon.com
}

// Today's conditions: weather/news reroll per in-game day; drop/shelf pin to real date
export interface DailyContent {
  dateKey: string;      // YYYY-MM-DD
  gameDay: number;      // in-game day this was generated for
  weatherId: string;
  tempF: number;
  eventId: string;
  dropId: string;       // today's featured celebrity smoothie
  shelfItem: ShelfItem; // "NEW AT EREWHON TODAY"
}

export interface LocationState {
  popularity: number;   // 0..1
  satisfaction: number; // 0..1
}

export interface GameState {
  version: number;
  cash: number;
  day: number;          // 1-based, in-game day counter
  // calendar derived from day: Year/Month/Day
  stock: Record<StockId, number>;
  stockAge: { strawberries: number; coconutCream: number }; // days held
  recipe: Recipe;
  price: number;
  adSpend: number;
  locationId: string;
  upgrades: string[];   // owned upgrade ids
  staff: string[];      // hired-today staff ids
  locations: Record<string, LocationState>;
  lifetimeRevenue: number;
  results: DayResult[]; // history
  daily: DailyContent | null;
  wonShown: boolean;
  gameOver: boolean;
}

export interface DayResult {
  day: number;
  locationId: string;
  cupsSold: number;
  revenue: number;
  stockUsedCost: number;
  stockLostCost: number;
  rent: number;
  marketing: number;
  wages: number;
  earnings: number;
  complaints: { taste: number; price: number; wait: number };
  happy: number;
  customersTotal: number;
  walkedAway: number;
  soldOut: boolean;
  tips: string[];
}

// Live simulation types
export type BubbleKind = 'happy' | 'taste' | 'price' | 'wait' | 'content';

export interface SimCustomer {
  id: number;
  x: number;            // 0..1 walk position
  state: 'walking' | 'queued' | 'served' | 'leaving';
  patienceLeft: number;
  bubble: BubbleKind | null;
  bubbleTtl: number;
  willBuy: boolean;
  wantsDrop: boolean;   // pays the drop's price instead of yours
}

export interface SimState {
  minute: number;       // 0..60
  customers: SimCustomer[];
  queue: number[];      // customer ids
  cupsSold: number;
  revenue: number;
  batchCupsLeft: number;
  blendTicksLeft: number;
  serveTicksLeft: number;
  serveTicksLeft2: number; // second server
  complaints: { taste: number; price: number; wait: number };
  happy: number;
  customersTotal: number;
  walkedAway: number;
  soldOut: boolean;
  shelfSold: number;    // today's shelf-item units sold
  stockUsed: Record<StockId, number>;
  finished: boolean;
}
