// Star signs for the crowd. Every customer is born under something, and the
// daily reading actually tracks the in-game calendar: sign seasons, June
// gloom, fire season, the holidays. All aphorisms original, tone: cosmic
// notification you didn't ask for.
import { mulberry32 } from '../rng';

export const SIGNS = [
  'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
  'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius',
] as const;

// Which sign season a given in-game date falls in (30-day months, Jan = 1).
const CUTOFFS = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
// sign index in season before the cutoff of month m (1-based)
const BEFORE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const AFTER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];
function seasonSign(month: number, dayOfMonth: number): number {
  return dayOfMonth < CUTOFFS[month - 1] ? BEFORE[month - 1] : AFTER[month - 1];
}

// A customer's own sun sign, fixed for life.
export function signFor(customerId: number): number {
  return (Math.imul(customerId + 17, 2246822519) >>> 9) % 12;
}

// Sign-flavored lines — evergreen.
const SIGN_LINES: string[][] = [
  [ // Capricorn
    'Rest is also a deliverable.',
    'You cannot invoice someone for loving you.',
    'The five-year plan heard what you said about it.',
  ],
  [ // Aquarius
    'Being misunderstood is not a personality. Almost, though.',
    'You are the group chat’s weirdest thinker. Protect that.',
    'Contrarianism is still a form of agreement.',
  ],
  [ // Pisces
    'Not every feeling requires a voice memo.',
    'You absorbed someone’s mood on the sidewalk again.',
    'The dream meant nothing. Or everything. Drink water.',
  ],
  [ // Aries
    'Count to ten. You made it to two. Progress.',
    'Not everything is a race. Today is, though.',
    'Your first instinct was right. Your second was litigation.',
  ],
  [ // Taurus
    'You were right to order the expensive one.',
    'Comfort is a strategy. You are its general.',
    'You have not changed your mind since 2019. Correct.',
  ],
  [ // Gemini
    'Both of you are doing great today.',
    'You told two people two different plans. Godspeed.',
    'Your attention span is a rumor.',
  ],
  [ // Cancer
    'You are not "fine." You are marinating.',
    'Home is wherever you can control the lighting.',
    'Someone owes you an apology from March. Let it go. (Don’t.)',
  ],
  [ // Leo
    'The main character can also listen sometimes.',
    'You were photographed today. You knew.',
    'Attention is not love, but it is close enough for Tuesday.',
  ],
  [ // Virgo
    'The list has a list now. Seek help. Or don’t — it’s working.',
    'You noticed the typo. Nobility is silence.',
    'Perfection is a moving target you keep hitting anyway.',
  ],
  [ // Libra
    'Make the decision. Any decision. One decision.',
    'You agreed with both sides again. Diplomatic. Cowardly. Both.',
    'Beauty is justice. Keep saying it until it’s true.',
  ],
  [ // Scorpio
    'Trust the pettiness today. It is data.',
    'You forgave them. You also kept the screenshot.',
    'Intensity is your love language. Warn people.',
  ],
  [ // Sagittarius
    'The plane ticket will not fix it. Buy it anyway.',
    'Your honesty is a public service nobody requested.',
    'Commitment is a country you visit.',
  ],
];

// Month-anchored lines — the reading knows what time of year it is.
const MONTH_LINES: string[][] = [
  [ // Jan
    'Your resolution is on life support. The smoothie counts as wellness.',
    'New year, same you. That was always the good version.',
  ],
  [ // Feb
    'Romance is in the air, or that’s just marine layer.',
    'Someone is thinking about you. Statistically.',
  ],
  [ // Mar
    'It’s pilot season. Everyone is lying a little more than usual.',
    'Spring wants you to start over. Finish something first.',
  ],
  [ // Apr
    'Mercury isn’t in retrograde. Your taxes are.',
    'April showers are a myth here. Your emotions compensate.',
  ],
  [ // May
    'May Gray is not a mood disorder, but it’s trying.',
    'Graduation energy: you are done with something. Decide what.',
  ],
  [ // Jun
    'June Gloom lifts by noon. You will not.',
    'The solstice is coming. Charge yourself like the crystal you are.',
  ],
  [ // Jul
    'It is too hot to hold grudges. Refrigerate them for October.',
    'Vacation is a state of mind you cannot expense.',
  ],
  [ // Aug
    'Fire season: check on your exes’ houses, not your exes.',
    'August wants nothing from you. Give it exactly that.',
  ],
  [ // Sep
    'The city pretends fall exists. Wear the boots anyway. Sweat.',
    'A fresh start is available. It costs one honest conversation.',
  ],
  [ // Oct
    'Scorpio season approaches. Hide your secrets and your Venmo.',
    'The veil is thin. So is your patience. Both are fine.',
  ],
  [ // Nov
    'Gratitude is free. You will still find a way to pay for it.',
    'Mercury retrograde: do not text them. Do not. You did.',
  ],
  [ // Dec
    'The holidays are coming. So is your childhood self. Be kind to both.',
    'End the year owing nothing to anyone except, technically, everyone.',
  ],
];

// The line for one person on one in-game day.
export function readingFor(
  signIdx: number,
  month: number,
  dayOfMonth: number,
  gameDay: number,
): string {
  const rand = mulberry32((Math.imul(gameDay + 1, 0x85ebca6b) ^ (signIdx * 2654435761)) >>> 0);
  // your season is a whole thing
  if (seasonSign(month, dayOfMonth) === signIdx && rand() < 0.5) {
    return `It’s your season. Behave accordingly, or don’t.`;
  }
  const pool = rand() < 0.55 ? SIGN_LINES[signIdx] : MONTH_LINES[month - 1];
  return pool[Math.floor(rand() * pool.length)];
}
