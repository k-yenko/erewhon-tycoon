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

type Accessory =
  | 'mat'       // rolled yoga mat under the arm
  | 'vest'      // fleece vest over the shirt
  | 'phone'     // arm up, filming
  | 'dog'       // little dog on a leash
  | 'stroller'  // pushing a baby stroller
  | 'hoodie'    // oversized hood up
  | 'surfboard' // board under the arm
  | 'visor'     // power-walker visor
  | 'coffee'    // industry coffee cup
  | 'tote'      // canvas tote at the hip
  | 'shades';   // just the sunglasses

interface Outfit {
  skin: string;
  hair: string;
  top: string;
  bottom: string;
  cap?: string;        // baseball cap color
  accessory?: Accessory;
  accent?: string;     // accessory color
}

// The whole LA census, in blocks.
const OUTFITS: Outfit[] = [
  // the basics
  { skin: '#e8b48f', hair: '#5a3a22', top: '#d94436', bottom: '#2f3f66' },
  { skin: '#c68863', hair: '#241d16', top: '#3f7fd9', bottom: '#3a3733' },
  { skin: '#f0d0b0', hair: '#b8863f', top: '#43a047', bottom: '#2e6b33' },
  { skin: '#e8c39e', hair: '#3a2a1a', top: '#ffffff', bottom: '#c74b3f', cap: '#d94436' },
  // pilates girl: matching set + rolled mat
  { skin: '#d69a6e', hair: '#33241a', top: '#e05a7a', bottom: '#e05a7a', accessory: 'mat', accent: '#7fb4c9' },
  { skin: '#f0d0b0', hair: '#b8863f', top: '#9b7fd4', bottom: '#9b7fd4', accessory: 'mat', accent: '#43a047' },
  // tech bro: fleece vest over the shirt, coffee optional but implied
  { skin: '#e8c39e', hair: '#5a3a22', top: '#8fb4d9', bottom: '#b8a888', accessory: 'vest', accent: '#3a4a5a' },
  // influencer: filming, obviously
  { skin: '#d69a6e', hair: '#141210', top: '#ffffff', bottom: '#3a3733', accessory: 'phone', accent: '#1a1a18' },
  // dog dad
  { skin: '#a86a44', hair: '#241d16', top: '#43a047', bottom: '#4a4740', accessory: 'dog', accent: '#b8863f' },
  // stroller parent
  { skin: '#e8b48f', hair: '#6b4a2f', top: '#f2c53d', bottom: '#2f3f66', accessory: 'stroller', accent: '#4a5a6a' },
  // skater kid: hood up
  { skin: '#c68863', hair: '#141210', top: '#7b5ec7', bottom: '#3a3733', accessory: 'hoodie' },
  // surfer: tank + board
  { skin: '#d69a6e', hair: '#e8d49a', top: '#2f9ea8', bottom: '#e8724a', accessory: 'surfboard', accent: '#f0ede4' },
  // power walker: visor + tracksuit
  { skin: '#f0d0b0', hair: '#d0d0d0', top: '#d94436', bottom: '#d94436', accessory: 'visor', accent: '#ffffff' },
  // industry person: all black, coffee, shades
  { skin: '#e8c39e', hair: '#141210', top: '#1f1e1c', bottom: '#1f1e1c', accessory: 'coffee', accent: '#f0ede4' },
  // tote hipster
  { skin: '#a86a44', hair: '#33241a', top: '#cf9c3f', bottom: '#2e6b33', accessory: 'tote', accent: '#e8dfc8' },
  // shades-only cool person
  { skin: '#e8b48f', hair: '#3a2a1a', top: '#e05a7a', bottom: '#4a4740', accessory: 'shades' },
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
          {/* accessories that sit against the torso */}
          {o.accessory === 'vest' && (
            <rect x="-4.8" y="-25" width="9.6" height="7.4" fill={o.accent} />
          )}
          {o.accessory === 'mat' && (
            <>
              <rect x="-8.6" y="-22.5" width="3" height="9.5" fill={o.accent} />
              <rect x="-8.6" y="-22.5" width="3" height="1.6" fill="#fff" opacity="0.6" />
            </>
          )}
          {o.accessory === 'tote' && (
            <>
              <rect x="4.8" y="-18" width="3.6" height="6.4" fill={o.accent} />
              <rect x="5.8" y="-20" width="1.4" height="2" fill={o.accent} />
            </>
          )}
          {o.accessory === 'surfboard' && (
            <>
              <rect x="6.4" y="-30" width="3.6" height="27" fill={o.accent} />
              <rect x="7.2" y="-32" width="2" height="2" fill={o.accent} />
              <rect x="7.8" y="-28" width="1" height="23" fill="#2f9ea8" />
            </>
          )}
          {o.accessory === 'coffee' && (
            <rect x="5" y="-17.5" width="2.6" height="3.6" fill={o.accent} />
          )}
          {o.accessory === 'phone' && (
            <>
              <rect x="4.8" y="-30" width="2" height="6.5" fill={o.skin} />
              <rect x="4.2" y="-33.6" width="3.4" height="4.4" fill={o.accent} />
            </>
          )}

          {/* square head + flat hair (cap / visor / hood / hair) */}
          {o.accessory === 'hoodie' && (
            <rect x="-4.8" y="-35.4" width="9.6" height="10.4" fill={o.top} />
          )}
          <rect x="-3.8" y="-34" width="7.6" height="8.4" fill={o.skin} />
          {o.accessory === 'shades' || o.accessory === 'phone' || o.accessory === 'coffee' ? (
            <rect x="-3.2" y="-31.8" width="6.4" height="2" fill="#1a1a18" />
          ) : null}
          {o.accessory === 'visor' ? (
            <>
              <rect x="-3.8" y="-35" width="7.6" height="1.8" fill={o.accent} />
              <rect x="2.6" y="-34.4" width="3.6" height="1.6" fill={o.accent} />
            </>
          ) : o.cap ? (
            <>
              <rect x="-3.8" y="-35" width="7.6" height="2.6" fill={o.cap} />
              <rect x="2.6" y="-34" width="3.4" height="1.8" fill={o.cap} />
            </>
          ) : o.accessory !== 'hoodie' ? (
            <>
              <rect x="-3.8" y="-35" width="7.6" height="2.4" fill={o.hair} />
              <rect x="-3.8" y="-33" width="1.6" height="3.4" fill={o.hair} />
              <rect x="2.2" y="-33" width="1.6" height="3.4" fill={o.hair} />
            </>
          ) : null}
        </g>

        {/* companions that travel alongside */}
        {o.accessory === 'dog' && (
          <g shapeRendering="crispEdges">
            <rect x="7" y="-7.5" width="8" height="4.4" fill={o.accent} />
            <rect x="13.6" y="-10.5" width="4" height="4" fill={o.accent} />
            <rect x="16" y="-12" width="1.6" height="2" fill={o.accent} />
            <rect x="8" y="-3.2" width="2" height="3.2" fill={o.accent} />
            <rect x="12.4" y="-3.2" width="2" height="3.2" fill={o.accent} />
            <rect x="5.6" y="-9" width="1.6" height="2.4" fill={o.accent} />
            <line x1="5" y1="-15" x2="14" y2="-9" stroke="#1a1a18" strokeWidth="0.8" />
          </g>
        )}
        {o.accessory === 'stroller' && (
          <g shapeRendering="crispEdges">
            <rect x="7" y="-15" width="10" height="6.5" fill={o.accent} />
            <rect x="7" y="-19" width="5" height="4" fill={o.accent} />
            <rect x="8.4" y="-13.6" width="3.2" height="2.6" fill="#e8c39e" />
            <rect x="8" y="-3.4" width="3.2" height="3.4" fill="#1a1a18" />
            <rect x="13.6" y="-3.4" width="3.2" height="3.4" fill="#1a1a18" />
            <line x1="5.2" y1="-17" x2="8" y2="-14.5" stroke="#1a1a18" strokeWidth="1.2" />
          </g>
        )}
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
