// Small vector person for the street scene, drawn feet-at-origin so a
// translate() places them on the sidewalk. Legs/arms swing via CSS classes.
import type { BubbleKind } from '../../game/types';
import { IconGlyph, INK, type IconName } from '../icons';

const BUBBLE_GLYPH: Record<BubbleKind, IconName> = {
  happy: 'smile',
  taste: 'frown',
  price: 'tag',
  wait: 'hourglass',
};

interface Outfit {
  skin: string;
  hair: string;
  top: string;
  bottom: string;
  cap?: string; // baseball cap color
}

// bright primary outfits, like the original's little sprites
const OUTFITS: Outfit[] = [
  { skin: '#e8b48f', hair: '#5a3a22', top: '#d94436', bottom: '#2f3f66' },
  { skin: '#c68863', hair: '#241d16', top: '#3f7fd9', bottom: '#3a3733' },
  { skin: '#f0d0b0', hair: '#b8863f', top: '#43a047', bottom: '#2e6b33' },
  { skin: '#a86a44', hair: '#141210', top: '#f2c53d', bottom: '#3a3733' },
  { skin: '#e8c39e', hair: '#3a2a1a', top: '#ffffff', bottom: '#c74b3f', cap: '#d94436' },
  { skin: '#d69a6e', hair: '#33241a', top: '#e05a7a', bottom: '#4a4740' },
];

const PS = { stroke: INK, strokeWidth: 0.9, strokeLinejoin: 'round', strokeLinecap: 'round' } as const;

export default function Person({
  variant,
  walking,
  bubble,
  x,
  y,
  moveSeconds = 1.45,
}: {
  variant: number;
  walking: boolean;
  bubble: BubbleKind | null;
  x: number;
  y: number;
  moveSeconds?: number;
}) {
  const o = OUTFITS[((variant % OUTFITS.length) + OUTFITS.length) % OUTFITS.length];
  return (
    <g
      style={{
        transform: `translate(${x}px, ${y}px)`,
        transition: `transform ${moveSeconds}s ${walking ? 'linear' : 'ease-out'}`,
      }}
    >
      <g className={walking ? 'walkcycle' : ''}>
        {/* shadow */}
        <ellipse cx="0" cy="0.5" rx="7" ry="2" fill={INK} opacity="0.12" />
        <g className="body-bob">
          {/* legs (origin at hip, y=-14) */}
          <g className="leg leg-a">
            <path d="M-2.4 -14 L-2.6 -1.5" stroke={o.bottom} strokeWidth="3.4" strokeLinecap="round" />
            <path d="M-3.6 -1 H-1.2" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          </g>
          <g className="leg leg-b">
            <path d="M2.4 -14 L2.6 -1.5" stroke={o.bottom} strokeWidth="3.4" strokeLinecap="round" />
            <path d="M1.2 -1 H3.6" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          </g>
          {/* torso */}
          <path
            d="M-4.4 -25 H4.4 C5 -25 5.4 -24.5 5.3 -23.8 L4.4 -13.5 H-4.4 L-5.3 -23.8 C-5.4 -24.5 -5 -25 -4.4 -25Z"
            fill={o.top}
            {...PS}
          />
          {/* arms */}
          <g className="arm arm-a">
            <path d="M-5 -24 L-5.6 -15.5" stroke={o.top} strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="-5.7" cy="-14.8" r="1.3" fill={o.skin} />
          </g>
          <g className="arm arm-b">
            <path d="M5 -24 L5.6 -15.5" stroke={o.top} strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="5.7" cy="-14.8" r="1.3" fill={o.skin} />
          </g>
          {/* head */}
          <circle cx="0" cy="-30" r="4.6" fill={o.skin} {...PS} />
          {o.cap ? (
            <path d="M-4.6 -31 A4.6 4.6 0 0 1 4.6 -31 L6.8 -30.4 C6.9 -30 6.6 -29.7 6.2 -29.7 L-4.6 -30Z" fill={o.cap} {...PS} />
          ) : (
            <path d="M-4.7 -30.5 C-4.7 -34 -2.5 -35.4 0 -35.4 C2.5 -35.4 4.7 -34 4.7 -30.5 C3.2 -33 -3 -33.3 -4.7 -30.5Z" fill={o.hair} {...PS} />
          )}
        </g>
      </g>
      {bubble && (
        <g
          className="bubble-pop"
          style={{
            // each person's reaction pops at their own moment inside the tick,
            // not on the shared sim heartbeat
            animationDelay: `${(Math.imul(variant, 40503) >>> 16) % 1100}ms`,
          }}
        >
          <path d="M9 -38 L7 -31.5 L14 -38Z" fill="#fff" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
          <rect x="4" y="-56" width="22" height="20" rx="5" fill="#fff" stroke={INK} strokeWidth="1.2" />
          <IconGlyph name={BUBBLE_GLYPH[bubble]} x={7} y={-53.5} size={16} />
        </g>
      )}
    </g>
  );
}
