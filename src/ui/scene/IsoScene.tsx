// Scene wrapper: ground tone, the location's own backdrop, the people/cart
// layer (children), and weather overlays.
import type { ReactNode } from 'react';
import type { LocationDef } from '../../game/types';
import { VIEW_W, VIEW_H } from './iso';
import { SCENES } from './locations';

export { iso, VIEW_W, VIEW_H } from './iso';
export { Cart } from './parts';

export default function IsoScene({
  loc,
  weatherId,
  children,
}: {
  loc: LocationDef;
  weatherId?: string;
  children?: ReactNode;
}) {
  const gloomy = weatherId === 'junegloom';
  const rainy = weatherId === 'rain' || weatherId === 'atmosphericriver';
  const storming = weatherId === 'atmosphericriver';
  const hot = weatherId === 'heatwave';
  const sunny = weatherId === 'perfect75' || hot;
  const windy = weatherId === 'santaana';
  const Scene = SCENES[loc.id] ?? SCENES.silverlake;
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      <defs>
        {/* subtle retro dither over big flat faces */}
        <pattern id="dither" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="2" height="2" fill="#1a1a18" />
          <rect x="2" y="2" width="2" height="2" fill="#1a1a18" />
        </pattern>
        <pattern id="speckle" width="26" height="22" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="6" r="1" fill="#1a1a18" />
          <circle cx="18" cy="14" r="1.2" fill="#ffffff" />
          <circle cx="11" cy="19" r="0.9" fill="#1a1a18" />
        </pattern>
      </defs>
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill={loc.sceneColors.ground} />
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#speckle)" opacity="0.05" />
      <Scene loc={loc} />
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#dither)" opacity="0.035" style={{ pointerEvents: 'none' }} />
      {children}

      {/* ——— weather, visible on screen ——— */}
      {sunny && (
        <g className={hot ? 'sun-hot' : ''}>
          <circle cx={VIEW_W - 70} cy={56} r={hot ? 26 : 20} fill="#f2c53d" stroke="#1a1a18" strokeWidth="1.4" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            const r1 = hot ? 34 : 27;
            const r2 = hot ? 46 : 36;
            return (
              <line
                key={i}
                x1={VIEW_W - 70 + Math.cos(a) * r1}
                y1={56 + Math.sin(a) * r1}
                x2={VIEW_W - 70 + Math.cos(a) * r2}
                y2={56 + Math.sin(a) * r2}
                stroke="#f2c53d"
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      )}
      {weatherId === 'perfect75' && (
        <g className="cloud-drift" opacity="0.9">
          <ellipse cx="150" cy="52" rx="34" ry="13" fill="#fff" stroke="#1a1a18" strokeWidth="1.2" />
          <ellipse cx="180" cy="44" rx="24" ry="11" fill="#fff" stroke="#1a1a18" strokeWidth="1.2" />
        </g>
      )}
      {hot && <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="#d9995f" opacity="0.08" className="heat-pulse" />}
      {gloomy && (
        <g>
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="#6a6d70" opacity="0.14" />
          <g className="fog-drift" opacity="0.28">
            <ellipse cx="240" cy="90" rx="260" ry="42" fill="#c9ccd0" />
            <ellipse cx="700" cy="150" rx="300" ry="48" fill="#c9ccd0" />
          </g>
        </g>
      )}
      {windy && (
        <g className="dust-drift" stroke="#e0cfa0" strokeWidth="2" strokeLinecap="round" opacity="0.55">
          {Array.from({ length: 9 }, (_, i) => {
            const y = 60 + i * 44;
            const x = (i * 173) % (VIEW_W - 120);
            return <line key={i} x1={x} y1={y} x2={x + 60 + (i % 3) * 24} y2={y} />;
          })}
        </g>
      )}
      {rainy && (
        <g>
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="#4a5560" opacity={storming ? 0.22 : 0.16} />
          <g className="rain-layer" stroke="#cfe3ea" strokeWidth="1.8" strokeLinecap="round" opacity="0.75">
            {Array.from({ length: storming ? 60 : 38 }, (_, i) => {
              const x = (i * 53) % VIEW_W;
              const y = (i * 97) % VIEW_H;
              return <line key={i} x1={x} y1={y} x2={x - 7} y2={y + 18} />;
            })}
          </g>
          {storming && (
            <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="#fff" opacity="0" className="storm-flash" />
          )}
        </g>
      )}
    </svg>
  );
}
