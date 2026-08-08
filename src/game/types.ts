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

export type EventVibe = 'wellness' | 'money' | 'chaos' | 'hype';
// Who a global event actually moves: locals leave for Coachella, industry
// money freezes in a strike, tourists ride the tour buses. Locations feel
// events proportionally to how much of that crowd they have.
export type EventAudience = 'locals' | 'tourists' | 'industry' | 'everyone';

export interface EventDef {
  id: string;
  headline: string;
  scope: EventScope;
  traffic?: number;      // multiplier (default 1)
  pay?: number;          // multiplier on willingness to pay (default 1)
  patience?: number;     // multiplier on queue patience (default 1)
  vibe?: EventVibe;      // colors what sells from the shelf today
  audience?: EventAudience;
  shock?: { ingredient: StockId; mult: number }; // supply-price shock
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
  touristy: number;         // 0..1 — share of the crowd that's tourists
  industry: number;         // 0..1 — share tied to entertainment/tech money
  tasteBias?: Partial<Recipe>; // what this neighborhood wants more (or less) of
  perk: string;  // the mechanical upside, in plain words (Rent tab)
  catch: string; // the mechanical downside, in plain words (Rent tab)
  quirk?: {
    noveltyRate?: number;    // × the 0.07/day novelty decay (home turf forgives)
    rushBias?: number;       // sharpens the lunch curve: peaks peakier, lulls deader
    priceGripeMult?: number; // chance a priced-out walker actually complains
    patienceMod?: number;    // × customer patience
    weatherSens?: number;    // amplifies weather's traffic swing, both directions
    shelfMult?: number;      // × shelf-item attach rate
    wtpSpread?: number;      // × willingness-to-pay spread (whales overshoot)
    tasteStrict?: number;    // taste quality raised to this power (critics)
    loyalty?: number;        // × the satisfaction→repeat-traffic payoff
    hypeGain?: number;       // × how fast popularity moves here
    rivalMagnet?: number;    // × rival's preference for parking here
  };
  sceneColors: { sky: string; ground: string; accent: string };
}

export interface UpgradeDef {
  id: string;
  name: string;
  price: number;
  tagline: string;
  benefit?: string; // plain-language what-you-actually-get line
  icon: IconName;
  era?: 1 | 2 | 3; // which act of the game this belongs to (default 1)
  effect:
    | { kind: 'blendSpeed'; ticks: number }       // reduces batch remix stall
    | { kind: 'serveSpeed'; ticks: number }       // reduces transaction time
    | { kind: 'patience'; mult: number }          // customers wait longer
    | { kind: 'noSpoilage' }                      // fridge
    | { kind: 'iceSaver'; keep: number }          // fraction of ice kept overnight
    | { kind: 'freeIce' }                         // never consume/buy ice
    | { kind: 'draw'; mult: number }              // more passers-by approach
    | { kind: 'pipelineBlend' }                   // next batch blends while serving
    | { kind: 'batchSize'; cups: number }         // bigger batches, fewer stalls
    | { kind: 'rentCap' }                         // halves the landlord's premium
    | { kind: 'noveltyGuard' }                    // the city forgets you slower
    | { kind: 'heatPatience'; mult: number }      // patience boost on hot days only
    | { kind: 'lineCap'; add: number }            // the line can grow deeper
    | { kind: 'loyaltyBoost'; mult: number }      // satisfaction repays more traffic
    | { kind: 'storageBoost'; mult: number }      // more room for everything
    | { kind: 'rivalResist' }                     // halves Moon Juus's bite
    | { kind: 'dropFanBoost' }                    // doubles Today's-Drop superfans
    | { kind: 'supplyDiscount'; mult: number }    // cheaper ingredient orders
    | { kind: 'tasteBoost'; add: number }         // recipe floor raised
    | { kind: 'shelfBoost'; mult: number }        // shelf items attach more
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

export type ShelfCategory = 'merch' | 'supplement' | 'snack' | 'drink' | 'pantry';

export interface ShelfItem {
  name: string;
  price: number;
  source: 'live' | 'pool'; // live = fetched from ship.erewhon.com
  category: ShelfCategory;
}

// A real LA happening fetched from the news bot, mapped to game effects.
export interface LiveEvent {
  headline: string;
  traffic: number;
  pay: number;
  patience: number;
  vibe?: EventVibe;
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
  viralShelf: boolean;  // today the shelf item went viral
  useLive: boolean;     // this in-game day prefers the real-LA headline if fetched
  liveEvent?: LiveEvent;
  liveWeather: boolean; // weather mirrors actual LA conditions right now
  marketPrices: Record<StockId, number>; // today's ingredient price multipliers
  rivalLocationId: string; // where the Moon Juus truck parked ('' = day off)
  rivalIntent?: 'wander' | 'stalk' | 'undercut'; // escalates with your success
  shelfRotated?: boolean;  // today's shelf pick has been drawn from the rotation deck
}

export interface LocationState {
  popularity: number;   // 0..1
  satisfaction: number; // 0..1
  novelty: number;      // 0.35..1 — camp a spot and the neighborhood gets over you
}

export interface GameSettings {
  market: boolean; // ingredient commodity market (advanced)
  rival: boolean;  // the Moon Juus competitor truck (advanced)
}

export interface GameState {
  version: number;
  seedNonce: number;    // per-save salt so weather/news differ between runs
  settings: GameSettings;
  cash: number;
  day: number;          // 1-based, in-game day counter
  // calendar derived from day: Year/Month/Day
  stock: Record<StockId, number>;
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
  wonDay?: number;        // the day the Flagship Dream was achieved
  gameOver: boolean;
  seasonScored?: boolean; // the Day-60 season report has been shown
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
  satisfactionPct: number; // that day's customer satisfaction, 0..100
  tempF?: number;          // that day's temperature, for the Charts tab
  forecastLo: number;      // what the morning forecast promised
  forecastHi: number;
  soldOut: boolean;
  shelfSold: number;
  shelfItemName: string;
  shelfRevenue: number;
  bestReview?: SimReview;
  worstReview?: SimReview;
  tips: string[];
}

// Live simulation types
export type BubbleKind = 'happy' | 'taste' | 'price' | 'wait';

export interface SimCustomer {
  id: number;
  x: number;            // 0..1 walk position
  state: 'walking' | 'queued' | 'served' | 'leaving';
  patienceLeft: number;
  bubble: BubbleKind | null;
  bubbleTtl: number;
  willBuy: boolean;
  wantsDrop: boolean;   // pays the drop's price instead of yours
  pace: number;         // personal walking speed, so crowds don't march in platoons
}

export interface SimReview {
  variant: 'happy' | 'taste' | 'price' | 'wait';
  text: string;
  stars: number; // 0..3
}

export interface SimState {
  minute: number;       // 0..60
  reviews: SimReview[];
  customers: SimCustomer[];
  queue: number[];      // customer ids
  cupsSold: number;
  revenue: number;
  batchCupsLeft: number;
  blendTicksLeft: number;
  serveProgress: number;  // fractional serve accumulator per server
  serveProgress2: number; // second server
  complaints: { taste: number; price: number; wait: number };
  happy: number;
  customersTotal: number;
  walkedAway: number;
  soldOut: boolean;
  shelfSold: number;    // today's shelf-item units sold
  stockUsed: Record<StockId, number>;
  finished: boolean;
  pausedId?: number | null; // customer frozen mid-stroll while the player inspects them
}
