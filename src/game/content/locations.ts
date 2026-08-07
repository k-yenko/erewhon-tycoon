import type { LocationDef } from '../types';

// Ten locations, rent-laddered like the original's Suburbs → Hexa-Stad,
// flavored from the real stores' documented vibes.
export const LOCATIONS: LocationDef[] = [
  {
    id: 'driveway',
    name: 'Your Driveway (Silver Lake)',
    rent: 0,
    blurb:
      'A folding table on your own driveway. Light foot traffic, but the rent is free and your roommates are supportive.',
    baseTraffic: 14,
    wealth: 18,
    basePopularity: 0.45,
    baseSatisfaction: 0.75,
    sceneColors: { sky: '#cfe3ea', ground: '#b9b2a4', accent: '#8fae8b' },
  },
  {
    id: 'silverlake',
    name: 'Silver Lake',
    rent: 40,
    blurb:
      'Eastside creatives and music producers. They will ask if the sea moss is ethically sourced.',
    baseTraffic: 25,
    wealth: 20,
    basePopularity: 0.3,
    baseSatisfaction: 0.6,
    sceneColors: { sky: '#cfe3ea', ground: '#a8a094', accent: '#7fa07a' },
  },
  {
    id: 'culver',
    name: 'Culver City',
    rent: 120,
    blurb:
      'Tech and studio professionals on a tight lunch break. They order fast and expense it.',
    baseTraffic: 35,
    wealth: 21,
    basePopularity: 0.2,
    baseSatisfaction: 0.55,
    sceneColors: { sky: '#d5e6ee', ground: '#9aa2a8', accent: '#6f8fae' },
  },
  {
    id: 'studio',
    name: 'Studio City',
    rent: 120,
    blurb:
      'Industry people of the Valley. Everyone here is attached to a project.',
    baseTraffic: 35,
    wealth: 22,
    basePopularity: 0.2,
    baseSatisfaction: 0.55,
    sceneColors: { sky: '#e8e0cf', ground: '#b0a48f', accent: '#a58e5f' },
  },
  {
    id: 'venice',
    name: 'Venice (Abbot Kinney)',
    rent: 160,
    blurb:
      'Beach crowds and tourists off Abbot Kinney. Great on sunny days.',
    baseTraffic: 45,
    wealth: 23,
    basePopularity: 0.25,
    baseSatisfaction: 0.45,
    sceneColors: { sky: '#bfe0ec', ground: '#d8c9a3', accent: '#5f9ea0' },
  },
  {
    id: 'santamonica',
    name: 'Santa Monica',
    rent: 200,
    blurb:
      'Content creators and promenade tourists. Every third customer is holding a ring light.',
    baseTraffic: 50,
    wealth: 24,
    basePopularity: 0.2,
    baseSatisfaction: 0.45,
    sceneColors: { sky: '#bfe0ec', ground: '#cfc3a0', accent: '#4f94b0' },
  },
  {
    id: 'calabasas',
    name: 'Calabasas',
    rent: 200,
    blurb:
      'Teenagers with a parent\'s credit card. Prices are not an obstacle here.',
    baseTraffic: 45,
    wealth: 26,
    basePopularity: 0.15,
    baseSatisfaction: 0.65,
    sceneColors: { sky: '#e9ddc8', ground: '#c2b193', accent: '#b09a6e' },
  },
  {
    id: 'beverlygrove',
    name: 'Beverly Grove',
    rent: 400,
    blurb:
      'The original. Peak influencer density, legendary parking situation.',
    baseTraffic: 70,
    wealth: 27,
    basePopularity: 0.1,
    baseSatisfaction: 0.5,
    sceneColors: { sky: '#d8e4ea', ground: '#a9a29a', accent: '#8b7fae' },
  },
  {
    id: 'beverlyhills',
    name: 'Beverly Hills',
    rent: 400,
    blurb:
      'Tourists and devoted regulars. Ground zero of the $19 strawberry.',
    baseTraffic: 70,
    wealth: 28,
    basePopularity: 0.1,
    baseSatisfaction: 0.55,
    sceneColors: { sky: '#d8e4ea', ground: '#b5ab9c', accent: '#ae8b7f' },
  },
  {
    id: 'palisades',
    name: 'The Palisades',
    rent: 600,
    blurb:
      'Quiet money on quick produce runs. The most serene customers in Los Angeles.',
    baseTraffic: 90,
    wealth: 30,
    basePopularity: 0.1,
    baseSatisfaction: 0.7,
    sceneColors: { sky: '#c8e2ee', ground: '#a3b59a', accent: '#6e9a7c' },
  },
];

export const LOCATION_BY_ID = Object.fromEntries(LOCATIONS.map((l) => [l.id, l]));
