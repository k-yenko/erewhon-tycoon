// Scene wrapper: ground tone, the location's own backdrop, the people/cart
// layer (children), and weather overlays.
import type { ReactNode } from 'react';
import type { LocationDef } from '../../game/types';
import { VIEW_W, VIEW_H } from './iso';
import { SCENES } from './locations';

export { iso, VIEW_W, VIEW_H } from './iso';
export { Cart } from './parts';

// ——— pixel-art weather pieces (blocky, like the sprites) ———

function PixelCloud({ x, y, s = 1, shade = false }: { x: number; y: number; s?: number; shade?: boolean }) {
  const body = shade ? '#d8dde2' : '#ffffff';
  const under = shade ? '#b8c0c8' : '#e2e6ea';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} shapeRendering="crispEdges">
      {/* classic stacked-block cloud silhouette */}
      <rect x="14" y="-18" width="34" height="10" fill={body} />
      <rect x="4" y="-10" width="58" height="10" fill={body} />
      <rect x="-6" y="-2" width="78" height="12" fill={body} />
      <rect x="24" y="-24" width="16" height="6" fill={body} />
      {/* flat shaded underside */}
      <rect x="-6" y="6" width="78" height="4" fill={under} />
      <rect x="0" y="-1" width="8" height="4" fill={under} opacity="0.6" />
      <rect x="50" y="-8" width="8" height="4" fill={under} opacity="0.6" />
    </g>
  );
}

function PixelSun({ x, y, s = 1, hot = false }: { x: number; y: number; s?: number; hot?: boolean }) {
  const core = hot ? '#f2a53d' : '#f2c53d';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} shapeRendering="crispEdges" className={hot ? 'heat-pulse' : ''}>
      {/* blocky 8-bit sun: square core with stepped corners + block rays */}
      <rect x="-14" y="-14" width="28" height="28" fill={core} />
      <rect x="-18" y="-8" width="4" height="16" fill={core} />
      <rect x="14" y="-8" width="4" height="16" fill={core} />
      <rect x="-8" y="-18" width="16" height="4" fill={core} />
      <rect x="-8" y="14" width="16" height="4" fill={core} />
      <rect x="-8" y="-8" width="16" height="16" fill="#ffe08a" />
      {/* block rays */}
      <rect x="-30" y="-3" width="8" height="6" fill={core} />
      <rect x="22" y="-3" width="8" height="6" fill={core} />
      <rect x="-3" y="-30" width="6" height="8" fill={core} />
      <rect x="-3" y="22" width="6" height="8" fill={core} />
      <rect x="-24" y="-24" width="6" height="6" fill={core} />
      <rect x="18" y="-24" width="6" height="6" fill={core} />
      <rect x="-24" y="18" width="6" height="6" fill={core} />
      <rect x="18" y="18" width="6" height="6" fill={core} />
    </g>
  );
}

function PixelFogBand({ y, widths, drift }: { y: number; widths: number[]; drift: 'fog-drift' | 'fog-drift-rev' }) {
  // a stepped bar of misaligned blocks reads as low marine layer
  let x = -80;
  const blocks = widths.map((w, i) => {
    const el = <rect key={i} x={x} y={y + (i % 2) * 6} width={w} height={16} fill="#cfd4d8" />;
    x += w + 26;
    return el;
  });
  return (
    <g className={drift} opacity="0.4" shapeRendering="crispEdges">
      {blocks}
    </g>
  );
}

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
      style={{ display: 'block', width: '100%', height: '100%', background: loc.sceneColors.ground }}
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
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#speckle)" opacity="0.09" />
      <Scene loc={loc} />
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#dither)" opacity="0.06" style={{ pointerEvents: 'none' }} />
      {children}

      {/* ——— weather, visible on screen ——— */}
      {sunny && <PixelSun x={VIEW_W - 80} y={62} s={hot ? 1.3 : 1} hot={hot} />}
      {weatherId === 'perfect75' && (
        <>
          <g className="cloud-drift">
            <PixelCloud x={110} y={54} s={0.9} />
          </g>
          <g className="cloud-drift-slow">
            <PixelCloud x={430} y={38} s={0.6} shade />
          </g>
        </>
      )}
      {hot && <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="#d9995f" opacity="0.08" className="heat-pulse" />}
      {gloomy && (
        <g>
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="#6a6d70" opacity="0.14" />
          <PixelFogBand y={44} widths={[180, 120, 220, 150]} drift="fog-drift" />
          <PixelFogBand y={110} widths={[140, 240, 110, 200]} drift="fog-drift-rev" />
          <g className="cloud-drift-slow">
            <PixelCloud x={300} y={40} s={0.8} shade />
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
          {storming && (
            <g className="cloud-drift-slow">
              <PixelCloud x={120} y={44} s={1.1} shade />
              <PixelCloud x={560} y={30} s={0.8} shade />
            </g>
          )}
          <g className="rain-layer" opacity="0.8" shapeRendering="crispEdges">
            {Array.from({ length: storming ? 64 : 40 }, (_, i) => {
              const x = (i * 53) % VIEW_W;
              const y = (i * 97) % VIEW_H;
              return (
                <rect key={i} x={x} y={y} width="3" height="12" fill="#cfe3ea" transform={`skewX(-14)`} />
              );
            })}
            {Array.from({ length: 12 }, (_, i) => {
              const x = (i * 151 + 40) % VIEW_W;
              const y = VIEW_H - 60 + ((i * 37) % 40);
              return <rect key={`sp${i}`} x={x} y={y} width="4" height="3" fill="#e6f2fa" />;
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
