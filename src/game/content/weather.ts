import type { WeatherDef } from '../types';

// LA weather, daily, no persistence — drives traffic, price tolerance, and ideal ice.
export const WEATHERS: WeatherDef[] = [
  {
    id: 'perfect75',
    name: 'Perfect 75',
    headline: 'Another flawless day. This is why you pay the rent.',
    icon: 'sun',
    tempF: [72, 78],
    traffic: 1.2,
    payTolerance: 1.0,
  },
  {
    id: 'heatwave',
    name: 'Heat Wave',
    headline: 'Triple digits in the Valley. Hydration is a personality now.',
    icon: 'heat',
    tempF: [92, 108],
    traffic: 1.5,
    payTolerance: 1.25,
  },
  {
    id: 'junegloom',
    name: 'June Gloom',
    headline: 'Marine layer until 2pm. The city is emotionally unavailable.',
    icon: 'cloud',
    tempF: [62, 68],
    traffic: 0.75,
    payTolerance: 0.9,
  },
  {
    id: 'santaana',
    name: 'Santa Ana Winds',
    headline: 'Dry winds. Everyone is beautiful and irritable.',
    icon: 'wind',
    tempF: [80, 90],
    traffic: 0.9,
    payTolerance: 1.1,
  },
  {
    id: 'rain',
    name: 'Rare Rain',
    headline: 'Light drizzle. The city has forgotten how to drive.',
    icon: 'rain',
    tempF: [55, 63],
    traffic: 0.5,
    payTolerance: 0.8,
  },
  {
    id: 'atmosphericriver',
    name: 'Atmospheric River',
    headline: 'A river. In the atmosphere. Nobody is leaving the house.',
    icon: 'storm',
    tempF: [52, 60],
    traffic: 0.4,
    payTolerance: 0.75,
  },
];

// Sunny LA: weights make nice days common, storms rare.
export const WEATHER_WEIGHTS: Record<string, number> = {
  perfect75: 38,
  heatwave: 16,
  junegloom: 20,
  santaana: 12,
  rain: 10,
  atmosphericriver: 4,
};

export const WEATHER_BY_ID = Object.fromEntries(WEATHERS.map((w) => [w.id, w]));

// Ideal ice cubes per batch scales with temperature (like the original).
export function idealIce(tempF: number): number {
  return Math.max(0, Math.min(5, Math.round((tempF - 55) / 10)));
}
