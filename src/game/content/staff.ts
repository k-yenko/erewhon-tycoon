import type { StaffDef } from '../types';

// Two hires, flat daily wage, day-by-day contracts — exactly like the original.
export const STAFF: StaffDef[] = [
  {
    id: 'madison',
    name: 'Madison the Barista',
    wage: 240,
    tagline: 'Too many people to serve? She has done a juice residency in Ojai.',
    icon: 'person',
    effect: { kind: 'secondServer' },
  },
  {
    id: 'sage',
    name: 'Sage the Content Creator',
    wage: 320,
    tagline: 'Films the line. Being filmed makes people patient. And thirsty.',
    icon: 'camera',
    effect: { kind: 'patience', mult: 1.4 },
  },
];

export const STAFF_BY_ID = Object.fromEntries(STAFF.map((s) => [s.id, s]));
