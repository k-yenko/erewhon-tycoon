import type { ProductDrop, ShelfItem } from '../types';

// Celebrity smoothie drops — real collabs, real prices.
// One is featured each day as "Today's Drop" and sells at its own premium price.
export const DROPS: ProductDrop[] = [
  { id: 'hailey', name: 'Strawberry Glaze Skin Smoothie', by: 'Hailey Bieber', price: 20 },
  { id: 'kendall', name: 'Peaches & Cream Smoothie', by: 'Kendall Jenner', price: 23 },
  { id: 'bella', name: 'Kinsicle Smoothie', by: 'Bella Hadid', price: 19 },
  { id: 'sofia', name: 'Sweet Cherry Smoothie', by: 'Sofia Richie Grainge', price: 21 },
  { id: 'winnie', name: 'Island Glow Smoothie', by: 'Winnie Harlow', price: 20 },
  { id: 'marianna', name: 'Coconut Cloud Smoothie', by: 'Marianna Hewitt', price: 18 },
  { id: 'sabrina', name: "Short n' Sweet Smoothie", by: 'Sabrina Carpenter', price: 23 },
  { id: 'nara', name: 'Wellness From Scratch Smoothie', by: 'Nara Smith', price: 23 },
  { id: 'travis', name: 'Storm Storm Smoothie', by: 'Travis Scott', price: 20 },
  { id: 'tyla', name: 'Bliss Smoothie', by: 'Tyla', price: 20 },
  { id: 'laroi', name: 'The Girls Smoothie', by: 'The Kid LAROI', price: 20 },
  { id: 'shay', name: 'Not Béisic Smoothie', by: 'Shay Mitchell', price: 20 },
  { id: 'lori', name: 'Vanilla Matcha Smoothie', by: 'Lori Harvey', price: 20 },
  { id: 'kourtney', name: 'Poosh Potion Detox Smoothie', by: 'Kourtney Kardashian', price: 17 },
];

export const DROP_BY_ID = Object.fromEntries(DROPS.map((d) => [d.id, d]));

// Fallback pool for "NEW AT EREWHON TODAY" when the live Shopify fetch fails —
// all real items with real prices.
export const SHELF_POOL: ShelfItem[] = [
  { name: 'Black Truffle Seed Crisps', price: 12, source: 'pool', category: 'snack' },
  { name: 'Tamari & Nori Seed Crisps', price: 12, source: 'pool', category: 'snack' },
  { name: 'Elly Amai Japanese Strawberry (single)', price: 19, source: 'pool', category: 'snack' },
  { name: 'Pink Glow Sea Moss Gel', price: 44, source: 'pool', category: 'supplement' },
  { name: 'Blue Pearl Sea Moss Gel', price: 44, source: 'pool', category: 'supplement' },
  { name: 'Raw A2/A2 Whole Milk (half gal)', price: 22, source: 'pool', category: 'drink' },
  { name: 'ARMRA Colostrum', price: 52, source: 'pool', category: 'supplement' },
  { name: 'Liposomal Glutathione', price: 100, source: 'pool', category: 'supplement' },
  { name: 'Liposomal Vitamin C', price: 76, source: 'pool', category: 'supplement' },
  { name: 'Organic Olivia Liver Juice', price: 38, source: 'pool', category: 'supplement' },
  { name: 'Sleep Formula', price: 74, source: 'pool', category: 'supplement' },
  { name: 'A2 Whey Protein', price: 68, source: 'pool', category: 'supplement' },
  { name: 'House-Made Granola', price: 18, source: 'pool', category: 'snack' },
  { name: 'Chlorophyll Water', price: 5, source: 'pool', category: 'drink' },
  { name: 'Fire Cider Immunity Shot', price: 7, source: 'pool', category: 'drink' },
  { name: 'Mushroom Coffee Latte', price: 10, source: 'pool', category: 'drink' },
  { name: 'Erewhon Hoodie', price: 170, source: 'pool', category: 'merch' },
  { name: 'Erewhon Dad Hat', price: 70, source: 'pool', category: 'merch' },
  { name: 'Coconut Cloud Smoothie Kit (makes 4)', price: 100, source: 'pool', category: 'drink' },
  { name: 'Erewhon Candle', price: 70, source: 'pool', category: 'merch' },
  { name: 'Tie-Dye Socks', price: 36, source: 'pool', category: 'merch' },
  { name: 'Beach Towel', price: 100, source: 'pool', category: 'merch' },
  { name: 'Pistachio Chocolate Toffee', price: 15, source: 'pool', category: 'snack' },
  { name: 'Vegan Chocolate Chip Cookie', price: 5, source: 'pool', category: 'snack' },
  { name: 'Avocado Toast', price: 16, source: 'pool', category: 'snack' },
  { name: 'Kale Caesar (hot bar, per lb)', price: 18, source: 'pool', category: 'pantry' },
];
