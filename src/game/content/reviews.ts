// Erewhon-voiced customer reviews, in the spirit of the reference repo's
// star-review feed. Variants map to the sim's verdicts.
import type { Recipe } from '../types';
import { idealIce } from './weather';

export type ReviewVariant = 'happy' | 'taste' | 'price' | 'wait';

const HAPPY = [
  'This smoothie changed my morning.',
  'Worth every dollar. All of them.',
  'The sea moss is doing something. Five stars.',
  'Posting this immediately.',
  'Obsessed. Genuinely obsessed.',
  'Tastes like the inside of a wellness retreat.',
];

const PRICE = [
  'I love it here but my card declined emotionally.',
  'This costs more than my parking ticket.',
  'Charging like Erewhon without being Erewhon. Bold.',
  "It's giving overpriced.",
];

const WAIT = [
  'The line was longer than the farmers market.',
  'Waited so long my parking meter expired.',
  'Cute cart. Insane line.',
  'I have a pilates class. I cannot wait like this.',
];

const TASTE_GENERIC = [
  'The texture was... a choice.',
  'Something in this is not organic. I can tell.',
];

// Recipe-direction tips, like the repo's "More sugar will be better."
export function tasteReview(recipe: Recipe, tempF: number): string {
  const ideal = idealIce(tempF);
  if (recipe.ice < ideal - 1) return 'Basically room temperature. More ice.';
  if (recipe.ice > ideal + 1) return 'This is a slushie. Less ice.';
  if (recipe.strawberries < 4) return 'Watery. Where are the strawberries?';
  if (recipe.coconutCream === 0) return 'No body to it. Needs coconut cream.';
  if (recipe.seaMoss >= 4) return 'Why is there SO much sea moss.';
  if (recipe.seaMoss === 0) return 'No sea moss? What is even the point.';
  return TASTE_GENERIC[(recipe.strawberries + recipe.ice) % TASTE_GENERIC.length];
}

export function pickReview(
  variant: ReviewVariant,
  roll: number,
  recipe: Recipe,
  tempF: number,
): { text: string; stars: number } {
  const pick = (arr: string[]) => arr[Math.floor(roll * arr.length) % arr.length];
  switch (variant) {
    case 'happy':
      return { text: pick(HAPPY), stars: 3 };
    case 'taste':
      return { text: tasteReview(recipe, tempF), stars: 1 };
    case 'price':
      return { text: pick(PRICE), stars: 0 };
    case 'wait':
      return { text: pick(WAIT), stars: 0 };
  }
}
