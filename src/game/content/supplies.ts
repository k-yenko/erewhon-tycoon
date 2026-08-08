import type { SupplyDef } from '../types';

// Three bulk tiers each, bulk always cheaper per unit (mirrors Lemonade Tycoon),
// priced at Erewhon-satire levels.
export const SUPPLIES: SupplyDef[] = [
  {
    id: 'strawberries',
    name: 'Organic Strawberries',
    icon: 'strawberry',
    tiers: [
      { qty: 12, cost: 36.0 },  // $3.00 each
      { qty: 24, cost: 57.6 },  // $2.40 each
      { qty: 48, cost: 86.4 },  // $1.80 each
    ],
    spoils: true,
    meltsNightly: false,
  },
  {
    id: 'coconutCream',
    name: 'Coconut Cream',
    icon: 'coconut',
    tiers: [
      { qty: 12, cost: 30.0 },  // $2.50 each
      { qty: 20, cost: 44.0 },  // $2.20 each
      { qty: 50, cost: 90.0 },  // $1.80 each
    ],
    spoils: true,
    meltsNightly: false,
  },
  {
    id: 'seaMoss',
    name: 'Sea Moss Gel',
    icon: 'seamoss',
    tiers: [
      { qty: 50, cost: 12.0 },
      { qty: 200, cost: 36.0 },
      { qty: 500, cost: 60.0 },
    ],
    spoils: false,
    meltsNightly: false,
  },
  {
    id: 'ice',
    name: 'Artisanal Ice',
    icon: 'ice',
    tiers: [
      { qty: 50, cost: 4.0 },
      { qty: 200, cost: 12.0 },
      { qty: 500, cost: 20.0 },
    ],
    spoils: false,
    meltsNightly: true, // always melts overnight, like the original
  },
  {
    id: 'cups',
    name: 'Compostable Cups',
    icon: 'cup',
    tiers: [
      { qty: 75, cost: 12.0 },
      { qty: 225, cost: 28.0 },
      { qty: 400, cost: 45.0 },
    ],
    spoils: false,
    meltsNightly: false,
  },
];

// Average unit cost (mid tier) — used to value stock used/lost on the results screen
export const UNIT_VALUE: Record<string, number> = {
  strawberries: 2.4,
  coconutCream: 2.2,
  seaMoss: 0.18,
  ice: 0.06,
  cups: 0.12,
};

// Sell-back rate for the pantry buyback: enough to un-stick a bad week,
// not enough to make supplies a savings account.
export const BUYBACK_RATE = 0.6;
