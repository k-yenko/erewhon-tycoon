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
      {/* blocky, pixel-sprite construction like the original's little people */}
      <g className={walking ? 'walkcycle' : ''} shapeRendering="crispEdges">
        <ellipse cx="0" cy="0.5" rx="6.5" ry="1.8" fill={INK} opacity="0.12" shapeRendering="auto" />
        <g className="body-bob">
          {/* legs: square pixel columns from the hip */}
          <g className="leg leg-a">
            <rect x="-4" y="-14" width="3.2" height="12.5" fill={o.bottom} />
            <rect x="-4.6" y="-2.6" width="4.2" height="2.6" fill={INK} />
          </g>
          <g className="leg leg-b">
            <rect x="0.8" y="-14" width="3.2" height="12.5" fill={o.bottom} />
            <rect x="0.4" y="-2.6" width="4.2" height="2.6" fill={INK} />
          </g>
          {/* torso: a plain block */}
          <rect x="-4.8" y="-25" width="9.6" height="11.5" fill={o.top} />
          {/* arms: thin blocks at the sides */}
          <g className="arm arm-a">
            <rect x="-6.6" y="-24.5" width="2" height="9" fill={o.top} />
            <rect x="-6.6" y="-15.5" width="2" height="2" fill={o.skin} />
          </g>
          <g className="arm arm-b">
            <rect x="4.6" y="-24.5" width="2" height="9" fill={o.top} />
            <rect x="4.6" y="-15.5" width="2" height="2" fill={o.skin} />
          </g>
          {/* square head + flat hair (or cap) */}
          <rect x="-3.8" y="-34" width="7.6" height="8.4" fill={o.skin} />
          {o.cap ? (
            <>
              <rect x="-3.8" y="-35" width="7.6" height="2.6" fill={o.cap} />
              <rect x="2.6" y="-34" width="3.4" height="1.8" fill={o.cap} />
            </>
          ) : (
            <>
              <rect x="-3.8" y="-35" width="7.6" height="2.4" fill={o.hair} />
              <rect x="-3.8" y="-33" width="1.6" height="3.4" fill={o.hair} />
              <rect x="2.2" y="-33" width="1.6" height="3.4" fill={o.hair} />
            </>
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
