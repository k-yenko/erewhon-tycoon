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
  const hot = weatherId === 'heatwave';
  const Scene = SCENES[loc.id] ?? SCENES.silverlake;
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill={loc.sceneColors.ground} />
      <Scene loc={loc} />
      {children}
      {gloomy && <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="#6a6d70" opacity="0.14" />}
      {hot && <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="#d9995f" opacity="0.08" />}
      {rainy && (
        <g>
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="#4a5560" opacity="0.16" />
          <g className="rain-layer" stroke="#cfe3ea" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
            {Array.from({ length: 26 }, (_, i) => {
              const x = (i * 79) % VIEW_W;
              const y = (i * 137) % VIEW_H;
              return <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 16} />;
            })}
          </g>
        </g>
      )}
    </svg>
  );
}
