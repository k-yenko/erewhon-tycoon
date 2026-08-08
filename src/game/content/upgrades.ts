import type { UpgradeDef } from '../types';

// Thirteen upgrades mirroring the original's ladder (juicers, canopy, register,
// fridge, ice, sound, neon, and four stand tiers), priced for the Erewhon economy.
export const UPGRADES: UpgradeDef[] = [
  {
    id: 'vitamix',
    name: 'Vitamix Pro',
    price: 199.99,
    tagline: 'Blend a batch in no time at all!',
    icon: 'blender',
    effect: { kind: 'blendSpeed', ticks: 1 },
  },
  {
    id: 'shadesail',
    name: 'Linen Shade Sail',
    price: 449.99,
    tagline: 'Keep your customers cool. And beige.',
    icon: 'tent',
    effect: { kind: 'patience', mult: 1.25 },
  },
  {
    id: 'blendtec',
    name: 'Blendtec Stealth 885',
    price: 599.99,
    tagline: 'Refill batches at lightning-fast speed!',
    icon: 'blender',
    effect: { kind: 'blendSpeed', ticks: 2 },
  },
  {
    id: 'tipscreen',
    name: 'iPad With 30% Tip Screen',
    price: 899.99,
    tagline: 'Speed up your serving process. Guilt included free.',
    icon: 'tablet',
    effect: { kind: 'serveSpeed', ticks: 1 },
  },
  {
    id: 'prepour',
    name: 'Pre-Pour Cold Case',
    price: 4999.99,
    tagline: 'Pre-poured and waiting. Service at the speed of entitlement.',
    icon: 'fridge',
    effect: { kind: 'serveSpeed', ticks: 1 },
  },
  {
    id: 'subzero',
    name: 'Sub-Zero Fridge',
    price: 899.99,
    tagline: 'Never waste money on spoiled strawberries again!',
    icon: 'fridge',
    effect: { kind: 'noSpoilage' },
  },
  {
    id: 'icedispenser',
    name: 'Ice-O-Matic Dispenser',
    price: 1399.99,
    tagline: 'Tired of watching artisanal ice melt?',
    icon: 'snowflake',
    effect: { kind: 'iceSaver', keep: 0.75 },
  },
  {
    id: 'soundbath',
    name: 'Sound Bath Speaker',
    price: 2499.99,
    tagline: 'Keep the line in a state of grace.',
    icon: 'bell',
    effect: { kind: 'patience', mult: 1.35 },
  },
  {
    id: 'ledhalo',
    name: 'LED Halo Sign',
    price: 3999.99,
    tagline: 'Grab their attention from across the parking lot.',
    icon: 'bulb',
    effect: { kind: 'draw', mult: 1.25 },
  },
  {
    id: 'icemaker',
    name: 'Automatic Ice Maker',
    price: 6999.99,
    tagline: 'Never buy ice again. The glacier comes to you.',
    icon: 'mountain',
    effect: { kind: 'freeIce' },
  },
  {
    id: 'stand1',
    name: 'Farmers-Market Stand',
    price: 1499.99,
    tagline: 'A classic look for a guaranteed hit!',
    icon: 'tent',
    effect: {
      kind: 'stand',
      tier: 1,
      draw: 1.1,
      storage: { strawberries: 130, coconutCream: 75, seaMoss: 500, ice: 500, cups: 350 },
    },
  },
  {
    id: 'stand2',
    name: 'Boutique Kiosk',
    price: 3499.99,
    tagline: 'Reclaimed oak. Terrazzo counter. You know the vibe.',
    icon: 'store',
    effect: {
      kind: 'stand',
      tier: 2,
      draw: 1.2,
      storage: { strawberries: 250, coconutCream: 150, seaMoss: 750, ice: 750, cups: 600 },
    },
  },
  {
    id: 'stand3',
    name: 'Flagship Cart',
    price: 9999.99,
    tagline: 'More than just smoothies. A lifestyle. A statement. A cart.',
    icon: 'stand',
    effect: {
      kind: 'stand',
      tier: 3,
      draw: 1.35,
      storage: { strawberries: 500, coconutCream: 300, seaMoss: 1800, ice: 1800, cups: 1200 },
    },
  },
];

export const UPGRADE_BY_ID = Object.fromEntries(UPGRADES.map((u) => [u.id, u]));

// Secondhand wellness equipment: half what you paid, no warranty, no regrets.
export const RESALE_RATE = 0.5;

export const DEFAULT_STORAGE: Record<string, number> = {
  strawberries: 100,
  coconutCream: 100,
  seaMoss: 200,
  ice: 200,
  cups: 200,
};
