// Shared vector building blocks for the location scenes.
import type { ReactNode } from 'react';
import { iso, poly, INK, ASPHALT, ASPHALT_D, CONCRETE, CONCRETE_D, DASH } from './iso';
import { OCEAN_FOAM, SAIL } from './palette';

// Foam lines, sun glints, and a couple of tiny sailboats for ocean bands.
export function OceanDetail({ y0, y1 }: { y0: number; y1: number }) {
  const mid = (y0 + y1) / 2;
  return (
    <g shapeRendering="crispEdges">
      {[0.2, 0.45, 0.7].map((t, i) => (
        <g key={i}>
          <rect x={60 + i * 280} y={y0 + (y1 - y0) * t} width={54 - i * 8} height={2.4} fill={OCEAN_FOAM} opacity="0.7" />
          <rect x={220 + i * 240} y={y0 + (y1 - y0) * t + 9} width={30} height={2} fill={OCEAN_FOAM} opacity="0.5" />
        </g>
      ))}
      {/* sun glint */}
      <rect x={640} y={mid - 4} width={90} height={2} fill="#ffe08a" opacity="0.5" />
      <rect x={676} y={mid + 1} width={44} height={2} fill="#ffe08a" opacity="0.35" />
      {/* sailboats */}
      <g>
        <rect x={150} y={mid - 9} width={2} height={9} fill={INK} opacity="0.6" />
        <polygon points={`152,${mid - 9} 160,${mid - 3} 152,${mid - 3}`} fill={SAIL} stroke={INK} strokeWidth="0.8" shapeRendering="auto" />
        <rect x={146} y={mid} width={13} height={2.6} fill="#8a6f4d" />
      </g>
      <g>
        <rect x={860} y={mid - 24} width={1.6} height={7} fill={INK} opacity="0.6" />
        <polygon points={`861,${mid - 24} 868,${mid - 19} 861,${mid - 19}`} fill={SAIL} stroke={INK} strokeWidth="0.7" shapeRendering="auto" />
        <rect x={857} y={mid - 17} width={10} height={2.2} fill="#8a6f4d" />
      </g>
    </g>
  );
}

// A white village gazebo — the Palisades' whole personality.
export function Gazebo({ x, y }: { x: number; y: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} shapeRendering="crispEdges">
      <ellipse cx="0" cy="1" rx="17" ry="4.5" fill={INK} opacity="0.1" shapeRendering="auto" />
      <rect x="-15" y="-4" width="30" height="4" fill="#e8e2d2" />
      <rect x="-13" y="-16" width="2.6" height="12" fill="#fdfaf2" />
      <rect x="10.4" y="-16" width="2.6" height="12" fill="#fdfaf2" />
      <rect x="-5" y="-18" width="2.6" height="14" fill="#fdfaf2" />
      <rect x="2.4" y="-18" width="2.6" height="14" fill="#fdfaf2" />
      <rect x="-13" y="-9" width="26" height="1.8" fill="#e8e2d2" />
      {/* stepped roof */}
      <rect x="-17" y="-20" width="34" height="4" fill="#3f9e63" />
      <rect x="-11" y="-24" width="22" height="4" fill="#57a84e" />
      <rect x="-5" y="-28" width="10" height="4" fill="#3f9e63" />
      <rect x="-1.4" y="-31" width="2.8" height="3" fill="#fdfaf2" />
    </g>
  );
}

// ——— structures ———

export function Box({
  x, y, w, d, h,
  top, right, front,
  children,
}: {
  x: number; y: number; w: number; d: number; h: number;
  top: string; right: string; front: string;
  children?: ReactNode;
}) {
  const T1 = iso(x, y), T2 = iso(x + w, y), T3 = iso(x + w, y + d), T4 = iso(x, y + d);
  const up = (p: [number, number]): [number, number] => [p[0], p[1] - h];
  const sh = (p: [number, number]): [number, number] => [p[0] + 12, p[1] + 6];
  return (
    <g stroke={INK} strokeWidth="1.2" strokeLinejoin="round">
      {/* grounded: every building casts a soft SE shadow */}
      <polygon points={poly([T2, sh(T2), sh(T3), sh(T4), T4, T3])} fill={INK} opacity="0.09" stroke="none" />
      <polygon points={poly([up(T1), up(T2), up(T3), up(T4)])} fill={top} />
      <polygon points={poly([up(T2), up(T3), T3, T2])} fill={right} />
      <polygon points={poly([up(T4), up(T3), T3, T4])} fill={front} />
      {/* parapet lip along the roofline for depth */}
      <polygon
        points={poly([up(T4), up(T3), [up(T3)[0], up(T3)[1] + 3], [up(T4)[0], up(T4)[1] + 3]])}
        fill={INK}
        opacity="0.14"
        stroke="none"
      />
      <polygon
        points={poly([up(T2), up(T3), [up(T3)[0], up(T3)[1] + 3], [up(T2)[0], up(T2)[1] + 3]])}
        fill={INK}
        opacity="0.08"
        stroke="none"
      />
      {children}
    </g>
  );
}

export function House({
  x, y, w, d, h, rh,
  wall, roof,
}: {
  x: number; y: number; w: number; d: number; h: number; rh: number;
  wall: string; roof: string;
}) {
  const T1 = iso(x, y), T2 = iso(x + w, y), T3 = iso(x + w, y + d), T4 = iso(x, y + d);
  const up = (p: [number, number], dz: number): [number, number] => [p[0], p[1] - dz];
  const RA = up(iso(x + w / 2, y), h + rh);
  const RB = up(iso(x + w / 2, y + d), h + rh);
  const door = iso(x + w * 0.62, y + d);
  const sh = (p: [number, number]): [number, number] => [p[0] + 10, p[1] + 5];
  return (
    <g stroke={INK} strokeWidth="1.2" strokeLinejoin="round">
      <polygon points={poly([T2, sh(T2), sh(T3), sh(T4), T4, T3])} fill={INK} opacity="0.09" stroke="none" />
      <polygon points={poly([up(T2, h), up(T3, h), T3, T2])} fill={wall} />
      <polygon points={poly([up(T4, h), up(T3, h), T3, T4])} fill={wall} />
      <polygon points={poly([up(T1, h), RA, RB, up(T4, h)])} fill={roof} opacity="0.85" />
      <polygon points={poly([up(T2, h), RA, RB, up(T3, h)])} fill={roof} />
      {/* eave line */}
      <polygon
        points={poly([up(T4, h), up(T3, h), [up(T3, h)[0], up(T3, h)[1] + 2.6], [up(T4, h)[0], up(T4, h)[1] + 2.6]])}
        fill={INK}
        opacity="0.16"
        stroke="none"
      />
      <rect x={door[0] - 5} y={door[1] - h * 0.72} width="10" height={h * 0.6} fill={INK} opacity="0.55" />
      {/* welcome mat, because of course */}
      <rect x={door[0] - 6.5} y={door[1] - h * 0.1} width="13" height="3.4" fill="#b8926a" stroke="none" />
    </g>
  );
}

export function Windows({ x, y, w, d, h, cols, rows }: { x: number; y: number; w: number; d: number; h: number; cols: number; rows: number }) {
  const [px, py] = iso(x + w, y + d);
  const cells: ReactNode[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      cells.push(
        <rect key={`${r}-${c}`} x={5 + c * 13} y={-h + 8 + r * 14} width="8" height="9" fill="#bfe0f2" stroke={INK} strokeWidth="0.8" />,
      );
  return <g transform={`translate(${px} ${py}) skewY(-26.565)`}>{cells}</g>;
}

// Fabric awning hanging off a wall face (screen-space quad from two grid points).
export function Awning({ a, b, top, drop, color }: { a: [number, number]; b: [number, number]; top: number; drop: number; color: string }) {
  const [ax, ay] = iso(a[0], a[1]);
  const [bx, by] = iso(b[0], b[1]);
  const d = Math.max(drop, 12);
  return (
    <g stroke={INK} strokeWidth="1.2" strokeLinejoin="round">
      <polygon
        points={poly([[ax, ay - top], [bx, by - top], [bx + 13, by - top + d], [ax + 13, ay - top + d]])}
        fill={color}
      />
      {/* valance */}
      <polygon
        points={poly([[ax + 13, ay - top + d], [bx + 13, by - top + d], [bx + 13, by - top + d + 5], [ax + 13, ay - top + d + 5]])}
        fill={color}
        opacity="0.75"
      />
    </g>
  );
}

// ——— greenery & props ———

export function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py}) scale(${s})`} shapeRendering="crispEdges">
      <rect x="-2.4" y="-14" width="4.8" height="14" fill="#8a6f4d" />
      <rect x="-11" y="-24" width="22" height="9" fill="#4c9440" />
      <rect x="-14" y="-18" width="28" height="6" fill="#3f8236" />
      <rect x="-8" y="-31" width="16" height="8" fill="#57a84e" />
      <rect x="-4" y="-36" width="8" height="6" fill="#6fbc5f" />
      <rect x="-6" y="-29" width="4" height="4" fill="#8fd47f" />
      <rect x="4" y="-22" width="4" height="4" fill="#8fd47f" />
    </g>
  );
}

export function Palm({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py}) scale(${s})`} shapeRendering="crispEdges">
      {/* segmented trunk with a slight lean */}
      <rect x="-2" y="-9" width="4" height="9" fill="#8a6f4d" />
      <rect x="-3" y="-18" width="4" height="9" fill="#9a7d58" />
      <rect x="-4" y="-27" width="4" height="9" fill="#8a6f4d" />
      {/* blocky fronds */}
      <rect x="-18" y="-31" width="14" height="4" fill="#4c9440" />
      <rect x="-22" y="-28" width="8" height="3" fill="#3f8236" />
      <rect x="2" y="-31" width="14" height="4" fill="#57a84e" />
      <rect x="12" y="-28" width="8" height="3" fill="#3f8236" />
      <rect x="-12" y="-36" width="10" height="4" fill="#57a84e" />
      <rect x="0" y="-36" width="10" height="4" fill="#4c9440" />
      <rect x="-4" y="-40" width="6" height="5" fill="#6fbc5f" />
      {/* coconuts */}
      <rect x="-5" y="-30" width="3" height="3" fill="#6b4a2f" />
      <rect x="0" y="-29" width="3" height="3" fill="#6b4a2f" />
    </g>
  );
}

export function Hedge({ x, y, w }: { x: number; y: number; w: number }) {
  const [px, py] = iso(x, y);
  const [qx, qy] = iso(x + w, y);
  return (
    <g shapeRendering="crispEdges">
      {Array.from({ length: Math.max(2, Math.round(w * 2.2)) }, (_, i) => {
        const t = i / Math.max(1, Math.round(w * 2.2) - 1);
        const bx = px + (qx - px) * t;
        const by = py + (qy - py) * t;
        return (
          <g key={i}>
            <rect x={bx - 7} y={by - 13} width={14} height={13} fill={i % 2 ? '#4c9440' : '#57a84e'} />
            <rect x={bx - 5} y={by - 16} width={10} height={4} fill="#6fbc5f" />
          </g>
        );
      })}
    </g>
  );
}

// Parked SUV (LA default vehicle), oriented along the x axis.
export function SUV({ x, y, color }: { x: number; y: number; color: string }) {
  const [px, py] = iso(x, y);
  const dark = '#1a1a18';
  return (
    <g transform={`translate(${px} ${py})`} shapeRendering="crispEdges">
      {/* blocky pixel build, like the sprites */}
      <rect x="-27" y="-14" width="54" height="11" fill={color} />
      <rect x="-17" y="-23" width="34" height="9" fill={color} />
      <rect x="-14" y="-21.5" width="12" height="6.5" fill="#bfe0f2" />
      <rect x="1" y="-21.5" width="11" height="6.5" fill="#bfe0f2" />
      <rect x="14.5" y="-21.5" width="2.5" height="6.5" fill="#bfe0f2" />
      <rect x="-27" y="-14" width="54" height="1.6" fill={dark} opacity="0.25" />
      <rect x="-28.4" y="-6" width="3" height="3.6" fill={dark} />
      <rect x="25.4" y="-6" width="3" height="3.6" fill={dark} />
      <rect x="-27" y="-12" width="2.4" height="2.6" fill="#f2c53d" />
      <rect x="24.6" y="-12" width="2.4" height="2.6" fill="#d94436" />
      <rect x="-20" y="-5" width="9" height="9" fill={dark} />
      <rect x="-17.4" y="-2.4" width="3.8" height="3.8" fill="#c9b99a" />
      <rect x="11" y="-5" width="9" height="9" fill={dark} />
      <rect x="13.6" y="-2.4" width="3.8" height="3.8" fill="#c9b99a" />
    </g>
  );
}

// A patch of pixel wildflowers for color.
export function FlowerPatch({ x, y }: { x: number; y: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} shapeRendering="crispEdges">
      <rect x="-8" y="-3" width="4" height="3" fill="#3f8236" />
      <rect x="0" y="-4" width="4" height="4" fill="#3f8236" />
      <rect x="7" y="-3" width="4" height="3" fill="#3f8236" />
      <rect x="-8" y="-7" width="4" height="4" fill="#e05a7a" />
      <rect x="0" y="-8" width="4" height="4" fill="#f2c53d" />
      <rect x="7" y="-7" width="4" height="4" fill="#9b7fd4" />
    </g>
  );
}

// LA's little red hydrant.
export function Hydrant({ x, y }: { x: number; y: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} shapeRendering="crispEdges">
      <rect x="-4" y="-2.6" width="8" height="2.6" fill="#a83428" />
      <rect x="-3" y="-11" width="6" height="8.4" fill="#d94436" />
      <rect x="-4.6" y="-8" width="1.8" height="3" fill="#d94436" />
      <rect x="2.8" y="-8" width="1.8" height="3" fill="#d94436" />
      <rect x="-2" y="-13" width="4" height="2.4" fill="#a83428" />
      <rect x="-3" y="-11" width="6" height="1.4" fill="#fff" opacity="0.35" />
    </g>
  );
}

// A sidewalk bench.
export function Bench({ x, y }: { x: number; y: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} shapeRendering="crispEdges">
      <rect x="-12" y="-9" width="24" height="3" fill="#b8926a" />
      <rect x="-12" y="-5" width="24" height="2" fill="#a3805c" />
      <rect x="-11" y="-3" width="2.6" height="3" fill="#1a1a18" />
      <rect x="8.4" y="-3" width="2.6" height="3" fill="#1a1a18" />
      <rect x="-12" y="-14" width="24" height="2.4" fill="#b8926a" />
    </g>
  );
}

export function Bin({ x, y, color }: { x: number; y: number; color: string }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} shapeRendering="crispEdges">
      <rect x="-5" y="-16" width="10" height="15" fill={color} />
      <rect x="-6.5" y="-19" width="13" height="3.5" fill={color} />
      <rect x="-6.5" y="-19" width="13" height="1.4" fill="#fff" opacity="0.35" />
      <rect x="-3" y="-13" width="6" height="1.6" fill="#1a1a18" opacity="0.3" />
    </g>
  );
}

export function Planter({ x, y }: { x: number; y: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} shapeRendering="crispEdges">
      <rect x="-9" y="-8" width="18" height="8" fill="#b8926a" />
      <rect x="-9" y="-8" width="18" height="1.6" fill="#fff" opacity="0.3" />
      <rect x="-7" y="-13" width="6" height="5" fill="#4c9440" />
      <rect x="1" y="-14" width="6" height="6" fill="#57a84e" />
      <rect x="-4" y="-16" width="4" height="4" fill="#e05a7a" />
      <rect x="3" y="-17" width="3" height="3" fill="#f2c53d" />
    </g>
  );
}

export function LampPost({ x, y }: { x: number; y: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} shapeRendering="crispEdges">
      <rect x="-1.2" y="-34" width="2.4" height="34" fill="#1a1a18" />
      <rect x="-3.4" y="-40" width="6.8" height="6.4" fill="#f2c53d" />
      <rect x="-2" y="-38.6" width="4" height="3.6" fill="#ffe08a" />
    </g>
  );
}

export function WaterTower({ x, y }: { x: number; y: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} shapeRendering="crispEdges">
      <rect x="-11" y="-34" width="3" height="34" fill="#6b5a44" />
      <rect x="8" y="-34" width="3" height="34" fill="#6b5a44" />
      <rect x="-9" y="-13" width="18" height="2.4" fill="#6b5a44" />
      <rect x="-8" y="-24" width="16" height="2.4" fill="#6b5a44" />
      <rect x="-12" y="-52" width="24" height="18" fill="#b5926a" />
      <rect x="-12" y="-52" width="24" height="2.6" fill="#8a6f4d" />
      <rect x="-9" y="-57" width="18" height="5" fill="#8a6f4d" />
      <rect x="-1.2" y="-63" width="2.4" height="6" fill="#1a1a18" />
      <rect x="-12" y="-44" width="24" height="1.6" fill="#8a6f4d" opacity="0.5" />
    </g>
  );
}

export function FerrisWheel({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const [px, py] = iso(x, y);
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return { x: Math.cos(a) * 26, y: Math.sin(a) * 26 };
  });
  return (
    <g transform={`translate(${px} ${py}) scale(${s})`} stroke={INK} strokeWidth="1.3">
      <path d="M-14 0 L0 -34 L14 0" fill="none" />
      <circle cx="0" cy="-34" r="26" fill="none" />
      {spokes.map((p, i) => (
        <line key={i} x1="0" y1="-34" x2={p.x} y2={-34 + p.y} />
      ))}
      {spokes.map((p, i) => (
        <circle key={`c${i}`} cx={p.x} cy={-34 + p.y} r="3.5" fill={i % 2 ? '#e05a7a' : '#3f97d9'} />
      ))}
    </g>
  );
}

// A glass storefront band along a building's front face: window glass,
// mullions, and a door, so shops read as shops instead of blank boxes.
export function StorefrontGlass({ a, b, h = 22, door = 0.7 }: { a: [number, number]; b: [number, number]; h?: number; door?: number }) {
  const [ax, ay] = iso(a[0], a[1]);
  const [bx, by] = iso(b[0], b[1]);
  const lerp = (t: number): [number, number] => [ax + (bx - ax) * t, ay + (by - ay) * t];
  const quad = (t0: number, t1: number, y0: number, hh: number, fill: string, opacity?: number) => {
    const [x0, yy0] = lerp(t0);
    const [x1, yy1] = lerp(t1);
    return (
      <polygon
        points={`${x0},${yy0 - y0} ${x1},${yy1 - y0} ${x1},${yy1 - y0 + hh} ${x0},${yy0 - y0 + hh}`}
        fill={fill}
        stroke="none"
        opacity={opacity}
      />
    );
  };
  return (
    <g>
      {quad(0.06, 0.94, h, h - 3, '#bfe0f2')}
      {quad(0.06, 0.94, h, 3, '#fff', 0.5)}
      {/* diagonal light streak: glass that catches the afternoon */}
      {quad(0.12, 0.2, h - 2, h - 6, '#ffffff', 0.35)}
      {quad(0.24, 0.28, h - 2, h - 6, '#ffffff', 0.22)}
      {[0.28, 0.5, 0.72].map((t) => (
        <g key={t}>{quad(t, t + 0.015, h, h - 3, INK, 0.5)}</g>
      ))}
      {/* door */}
      {quad(door, door + 0.16, h + 2, h - 1, '#8a6f4d')}
      {quad(door + 0.115, door + 0.145, h - 8, 3, '#f2c53d')}
    </g>
  );
}

// Rooftop AC units + a vent pipe — the honest LA roofline.
export function RoofUnits({ x, y, h }: { x: number; y: number; h: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py - h})`} shapeRendering="crispEdges">
      <rect x="-10" y="-8" width="12" height="8" fill="#9aa7ad" stroke={INK} strokeWidth="0.9" />
      <rect x="-8" y="-6" width="8" height="4" fill="#7d8a90" />
      <rect x="8" y="-10" width="3" height="10" fill="#7d8a90" stroke={INK} strokeWidth="0.9" />
    </g>
  );
}

// String lights swagged between two grid points, with colored bulb pixels.
export function StringLights({ a, b, lift = 34, dip = 14 }: { a: [number, number]; b: [number, number]; lift?: number; dip?: number }) {
  const [ax, ay] = iso(a[0], a[1]);
  const [bx, by] = iso(b[0], b[1]);
  const y0 = ay - lift;
  const y1 = by - lift;
  const cx = (ax + bx) / 2;
  const cy = (y0 + y1) / 2 + dip;
  const bulbs = [0.15, 0.32, 0.5, 0.68, 0.85].map((t, i) => {
    const bxp = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cx + t * t * bx;
    const byp = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
    return (
      <rect
        key={t}
        x={bxp - 1.5}
        y={byp}
        width="3"
        height="3"
        fill={['#ffe08a', '#e05a7a', '#7fb4c9', '#f2c53d', '#6fbc5f'][i]}
        shapeRendering="crispEdges"
      />
    );
  });
  return (
    <g>
      <path d={`M${ax} ${y0} Q ${cx} ${cy} ${bx} ${y1}`} fill="none" stroke={INK} strokeWidth="1" opacity="0.5" />
      {bulbs}
    </g>
  );
}

// A bicycle leaning where its owner left it (probably against a mural).
export function Bike({ x, y, color = '#2f9ea8' }: { x: number; y: number; color?: string }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} shapeRendering="crispEdges">
      <rect x="-11" y="-8" width="8" height="8" fill="none" stroke={INK} strokeWidth="1.4" />
      <rect x="4" y="-8" width="8" height="8" fill="none" stroke={INK} strokeWidth="1.4" />
      <rect x="-6" y="-11" width="13" height="2.4" fill={color} />
      <rect x="1" y="-15" width="2.4" height="6" fill={color} />
      <rect x="-7" y="-14" width="2.4" height="5" fill={color} />
      <rect x="-9.4" y="-15.4" width="7" height="2.4" fill={INK} />
      <rect x="1" y="-16.6" width="5" height="2.4" fill="#8a6f4d" />
    </g>
  );
}

// A seagull — two-block wings, always eyeing someone's smoothie.
export function Seagull({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})${flip ? ' scale(-1 1)' : ''}`} shapeRendering="crispEdges">
      <rect x="-6" y="-2" width="5" height="2.4" fill="#fdfaf2" />
      <rect x="1" y="-4" width="5" height="2.4" fill="#fdfaf2" />
      <rect x="-1" y="-2.6" width="2.6" height="2.6" fill="#d8dde2" />
    </g>
  );
}

// A tiered fountain for the neighborhoods that gate themselves.
export function Fountain({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py}) scale(${s})`} shapeRendering="crispEdges">
      <rect x="-16" y="-6" width="32" height="6" fill="#d8d2c4" stroke={INK} strokeWidth="1" />
      <rect x="-13" y="-8" width="26" height="3" fill="#7fb4c9" />
      <rect x="-3" y="-16" width="6" height="10" fill="#d8d2c4" stroke={INK} strokeWidth="1" />
      <rect x="-8" y="-18" width="16" height="3.4" fill="#d8d2c4" stroke={INK} strokeWidth="1" />
      <rect x="-6" y="-19.4" width="12" height="2" fill="#7fb4c9" />
      <rect x="-1.4" y="-25" width="2.8" height="6" fill="#7fb4c9" />
      <rect x="-4" y="-21" width="2" height="3" fill="#a8d4e4" />
      <rect x="2" y="-21" width="2" height="3" fill="#a8d4e4" />
    </g>
  );
}

// Topiary ball on a stem — landscaping with money behind it.
export function Topiary({ x, y }: { x: number; y: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} shapeRendering="crispEdges">
      <rect x="-5" y="-6" width="10" height="6" fill="#b8926a" />
      <rect x="-1.4" y="-12" width="2.8" height="6" fill="#8a6f4d" />
      <rect x="-6" y="-22" width="12" height="10" fill="#4c9440" />
      <rect x="-4" y="-24" width="8" height="4" fill="#57a84e" />
      <rect x="-4" y="-20" width="3" height="3" fill="#6fbc5f" />
    </g>
  );
}

// A stray shopping cart, nowhere near the corral.
export function ShoppingCart({ x, y }: { x: number; y: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} shapeRendering="crispEdges">
      <rect x="-8" y="-12" width="14" height="8" fill="none" stroke="#7d8a90" strokeWidth="1.6" />
      <rect x="-7" y="-10" width="12" height="1.6" fill="#7d8a90" />
      <rect x="6" y="-16" width="2" height="12" fill="#7d8a90" />
      <rect x="-7" y="-3" width="3" height="3" fill="#1a1a18" />
      <rect x="2" y="-3" width="3" height="3" fill="#1a1a18" />
    </g>
  );
}

// A low convertible for the tax bracket that doesn't drive SUVs.
export function SportsCar({ x, y, color }: { x: number; y: number; color: string }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} shapeRendering="crispEdges">
      <rect x="-24" y="-10" width="48" height="8" fill={color} />
      <rect x="-10" y="-14" width="22" height="4" fill={color} />
      <rect x="-8" y="-13.4" width="8" height="3.4" fill="#bfe0f2" />
      <rect x="-24" y="-10" width="48" height="1.4" fill="#fff" opacity="0.4" />
      <rect x="-24" y="-8" width="2.2" height="2.2" fill="#f2c53d" />
      <rect x="21.8" y="-8" width="2.2" height="2.2" fill="#d94436" />
      <rect x="-16" y="-3" width="8" height="8" fill="#1a1a18" />
      <rect x="-13.6" y="-0.6" width="3.2" height="3.2" fill="#c9b99a" />
      <rect x="8" y="-3" width="8" height="8" fill="#1a1a18" />
      <rect x="10.4" y="-0.6" width="3.2" height="3.2" fill="#c9b99a" />
    </g>
  );
}

// A studio spotlight on legs.
export function Spotlight({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})${flip ? ' scale(-1 1)' : ''}`} shapeRendering="crispEdges">
      <rect x="-1.2" y="-20" width="2.4" height="20" fill="#1a1a18" />
      <rect x="-5" y="-2.4" width="4" height="2.4" fill="#1a1a18" />
      <rect x="1" y="-2.4" width="4" height="2.4" fill="#1a1a18" />
      <rect x="-2" y="-28" width="10" height="8" fill="#3a3733" />
      <rect x="8" y="-27" width="2.6" height="6" fill="#ffe08a" />
    </g>
  );
}

// Curbside mailbox on a post.
export function Mailbox({ x, y }: { x: number; y: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} shapeRendering="crispEdges">
      <rect x="-1" y="-12" width="2.4" height="12" fill="#8a6f4d" />
      <rect x="-4" y="-17" width="9" height="5.4" fill="#3f97d9" />
      <rect x="-4" y="-17" width="9" height="1.4" fill="#fff" opacity="0.4" />
      <rect x="4" y="-20" width="1.6" height="4" fill="#d94436" />
    </g>
  );
}

// Sidewalk A-frame chalk sign.
export function AFrame({ x, y, accent = '#e05a7a' }: { x: number; y: number; accent?: string }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} shapeRendering="crispEdges">
      <polygon points="-7,0 -2,-16 2,-16 7,0" fill="#8a6f4d" stroke={INK} strokeWidth="0.9" shapeRendering="auto" />
      <rect x="-4.6" y="-13" width="9.2" height="9" fill="#2f3a33" />
      <rect x="-3" y="-11" width="6" height="1.6" fill="#f0ede4" opacity="0.8" />
      <rect x="-3" y="-8.4" width="4.4" height="1.6" fill={accent} opacity="0.9" />
      <rect x="-3" y="-5.8" width="5.4" height="1.6" fill="#f0ede4" opacity="0.6" />
    </g>
  );
}

// ——— roads & paving (grid-space bands) ———

export function RoadX({ y0, y1, dashY, dashXs }: { y0: number; y1: number; dashY?: number; dashXs?: number[] }) {
  return (
    <g>
      <polygon points={poly([iso(-2, y0), iso(12, y0), iso(12, y1), iso(-2, y1)])} fill={ASPHALT} stroke={INK} strokeWidth="1.2" />
      {dashY !== undefined &&
        (dashXs ?? [-1.5, -0.5, 0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5]).map((gx) => {
          const [x1, y1s] = iso(gx, dashY);
          const [x2, y2s] = iso(gx + 0.45, dashY);
          return <line key={gx} x1={x1} y1={y1s} x2={x2} y2={y2s} stroke={DASH} strokeWidth="2.5" />;
        })}
    </g>
  );
}

export function SidewalkX({ y0, y1, x0 = -2, x1 = 12, tiles = true }: { y0: number; y1: number; x0?: number; x1?: number; tiles?: boolean }) {
  return (
    <g>
      <polygon points={poly([iso(x0, y0), iso(x1, y0), iso(x1, y1), iso(x0, y1)])} fill={CONCRETE} stroke={INK} strokeWidth="1.2" />
      {tiles &&
        Array.from({ length: Math.floor(x1 - x0) }, (_, i) => Math.ceil(x0) + i).map((gx) => {
          const [ax, ay] = iso(gx, y0);
          const [bx, by] = iso(gx, y1);
          return <line key={gx} x1={ax} y1={ay} x2={bx} y2={by} stroke={CONCRETE_D} strokeWidth="1.5" />;
        })}
    </g>
  );
}

// Full cross intersection (main road + cross road + crosswalk on the front sidewalk).
export function CrossRoads() {
  return (
    <g>
      <RoadX y0={4.3} y1={5.7} dashY={5} dashXs={[-1.5, -0.5, 0.5, 1.5, 2.5, 6.5, 7.5, 8.5, 9.5, 10.5]} />
      <polygon points={poly([iso(4.3, -2), iso(5.7, -2), iso(5.7, 12), iso(4.3, 12)])} fill={ASPHALT} stroke={INK} strokeWidth="1.2" />
      <polygon points={poly([iso(4.3, 4.3), iso(5.7, 4.3), iso(5.7, 5.7), iso(4.3, 5.7)])} fill={ASPHALT_D} stroke="none" />
      {[-1.5, -0.5, 0.5, 1.5, 2.5, 7.5, 8.5, 9.5, 10.5].map((gy) => {
        const [x1, y1] = iso(5, gy);
        const [x2, y2] = iso(5, gy + 0.45);
        return <line key={`e${gy}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={DASH} strokeWidth="2.5" />;
      })}
      {[4.45, 4.75, 5.05, 5.35].map((gx) => {
        const [x1, y1] = iso(gx, 5.75);
        const [x2, y2] = iso(gx, 6.95);
        return <line key={`c${gx}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={DASH} strokeWidth="5" />;
      })}
      <SidewalkX y0={5.7} y1={7.0} x0={-2} x1={4.3} />
      <SidewalkX y0={5.7} y1={7.0} x0={5.7} x1={12} />
    </g>
  );
}

// ——— the Erewhon cart ———

// Owned upgrades, visible in the world: buy the gear, see the gear.
export function CartExtras({ x, y, upgrades }: { x: number; y: number; upgrades: string[] }) {
  const [px, py] = iso(x, y);
  const has = (id: string) => upgrades.includes(id);
  return (
    <g transform={`translate(${px} ${py - 22})`} shapeRendering="crispEdges">
      {/* linen shade sail on a lean pole, left of the cart */}
      {has('shadesail') && (
        <g>
          <rect x="-62" y="-58" width="3" height="62" fill="#8a6f4d" />
          <rect x="-78" y="-56" width="30" height="20" fill="#f0e9da" stroke={INK} strokeWidth="1" />
          <rect x="-78" y="-56" width="30" height="4" fill="#e0d5c0" />
          <rect x="-74" y="-36" width="6" height="3" fill="#f0e9da" />
          <rect x="-62" y="-36" width="6" height="3" fill="#f0e9da" />
        </g>
      )}
      {/* sound bath speaker on a stand, right of the cart */}
      {has('soundbath') && (
        <g>
          <rect x="47" y="-4" width="2.4" height="16" fill="#1a1a18" />
          <rect x="42" y="-20" width="13" height="16" fill="#3a3733" stroke={INK} strokeWidth="1" />
          <rect x="45.5" y="-16" width="6" height="6" fill="#f2c53d" />
          <rect x="46.8" y="-14.6" width="3.4" height="3.4" fill="#1a1a18" />
          <rect x="57" y="-26" width="3" height="3" fill="#f2c53d" />
          <rect x="61" y="-32" width="3" height="3" fill="#e05a7a" />
        </g>
      )}
      {/* LED halo, hovering above everything like a blessed UFO */}
      {has('ledhalo') && (
        <g shapeRendering="auto">
          <ellipse cx="4" cy="-98" rx="22" ry="7" fill="#ffe08a" opacity="0.3" />
          <ellipse cx="4" cy="-98" rx="16" ry="5" fill="none" stroke="#f2c53d" strokeWidth="3" />
        </g>
      )}
      {/* misting system: soft fog puffs by the queue */}
      {has('mister') && (
        <g opacity="0.55">
          <rect x="-42" y="6" width="2.4" height="14" fill="#7d8a90" />
          <rect x="-48" y="0" width="14" height="5" fill="#dff0f8" />
          <rect x="-52" y="-5" width="10" height="4" fill="#dff0f8" opacity="0.7" />
          <rect x="-40" y="-8" width="8" height="4" fill="#dff0f8" opacity="0.5" />
        </g>
      )}
      {/* valet podium, front right */}
      {has('valet') && (
        <g>
          <rect x="56" y="4" width="13" height="16" fill="#b8926a" stroke={INK} strokeWidth="1" />
          <rect x="56" y="0" width="13" height="4" fill="#8a6f4d" />
          <rect x="60" y="-6" width="5" height="5" fill="#f2c53d" />
        </g>
      )}
      {/* automatic ice maker chest humming behind */}
      {has('icemaker') && (
        <g>
          <rect x="-64" y="6" width="18" height="14" fill="#dff0f8" stroke={INK} strokeWidth="1" />
          <rect x="-64" y="6" width="18" height="3.5" fill="#7fb4c9" />
          <rect x="-60" y="12" width="4" height="4" fill="#7fb4c9" />
        </g>
      )}
      {/* counter-billboard: the war is public */}
      {has('billboard') && (
        <g>
          <rect x="72" y="-66" width="3" height="60" fill="#4a4740" />
          <rect x="58" y="-92" width="52" height="28" fill="#fdfaf2" stroke={INK} strokeWidth="1.4" />
          <rect x="58" y="-92" width="52" height="6" fill="#d94436" />
          <rect x="63" y="-82" width="30" height="4" fill="#1a1a18" opacity="0.8" />
          <rect x="63" y="-75" width="42" height="4" fill="#1a1a18" opacity="0.5" />
          <rect x="63" y="-69" width="22" height="3" fill="#d94436" opacity="0.8" />
        </g>
      )}
    </g>
  );
}

// A slanted strip that follows one of the cart's iso faces (slope ±0.5),
// for skirt stripes, seams, and boards that sit flat on the body.
function faceStrip(xa: number, xb: number, ya: number, h: number, slope: number, fill: string, opacity?: number) {
  const yb = ya + slope * (xb - xa);
  return (
    <polygon
      points={`${xa},${ya} ${xb},${yb} ${xb},${yb + h} ${xa},${ya + h}`}
      fill={fill}
      stroke="none"
      opacity={opacity}
    />
  );
}

// The Erewhon cart — a real isometric body dressed up per stand tier:
// 0 sidewalk cart → 1 farmers-market tent → 2 boutique oak kiosk → 3 flagship.
export function Cart({ x, y, rival = false, stage = 0 }: { x: number; y: number; rival?: boolean; stage?: number }) {
  const [px, py] = iso(x, y);
  const s = rival ? 0 : Math.max(0, Math.min(3, Math.floor(stage)));
  const P = rival
    ? { body: '#d8ecec', face: '#c4e0e0', stripe: '#4a9ea8', counter: '#3f8a94', trim: '#2f6e78', pole: '#4a9ea8' }
    : [
        { body: '#fdfaf2', face: '#f0e8d8', stripe: '#43a047', counter: '#c9b99a', trim: '#2e6b33', pole: '#8a6f4d' },
        { body: '#fdfaf2', face: '#f0e8d8', stripe: '#d94436', counter: '#b8926a', trim: '#a83428', pole: '#8a6f4d' },
        { body: '#c9a06a', face: '#b8905c', stripe: '#2f9ea8', counter: '#f0ede4', trim: '#8a6f4d', pole: '#d9b34a' },
        { body: '#fffdf7', face: '#f7f0e0', stripe: '#d9b34a', counter: '#f0ead8', trim: '#b8933a', pole: '#d9b34a' },
      ][s];
  const sign = rival ? 'MOON JUUS' : 'EREWHON';
  const P0: [number, number] = [0, -10];
  const P1: [number, number] = [38, 9];
  const P2: [number, number] = [8, 24];
  const P3: [number, number] = [-30, 5];
  const H = 34;
  const up = (p: [number, number]): [number, number] => [p[0], p[1] - H];
  const [T0, T1, T2, T3] = [P0, P1, P2, P3].map(up) as [number, number][];
  return (
    <g transform={`translate(${px} ${py - 22})`}>
      <ellipse cx="4" cy="22" rx="40" ry="9" fill={INK} opacity="0.1" />
      {/* wagon wheels: chunky pixel build with hub + rim */}
      <g shapeRendering="crispEdges">
        <rect x="18" y="11" width="12" height="12" fill="#1a1a18" />
        <rect x="20" y="13" width="8" height="8" fill={rival ? '#3f8a94' : '#c9b99a'} />
        <rect x="23" y="16" width="2" height="2" fill="#1a1a18" />
        <rect x="-22" y="5" width="12" height="12" fill="#1a1a18" />
        <rect x="-20" y="7" width="8" height="8" fill={rival ? '#3f8a94' : '#c9b99a'} />
        <rect x="-17" y="10" width="2" height="2" fill="#1a1a18" />
      </g>
      {/* iso body */}
      <g stroke={INK} strokeWidth="1.1" strokeLinejoin="round">
        <polygon points={poly([T1, T2, P2, P1])} fill={P.face} />
        <polygon points={poly([T2, T3, P3, P2])} fill={P.body} />
        <polygon points={poly([T0, T1, T2, T3])} fill={P.counter} />
      </g>
      {/* face dressing: striped skirt + seam + chalk menu board */}
      <g>
        {faceStrip(-29.4, 7.4, -0.5, 6, 0.5, P.stripe)}
        {faceStrip(-29.4, 7.4, -6.2, 1.6, 0.5, P.trim, 0.55)}
        {faceStrip(8.6, 37.4, 18.2, 6, -0.5, P.stripe)}
        {faceStrip(8.6, 37.4, 12.6, 1.6, -0.5, P.trim, 0.55)}
        {/* chalkboard menu low on the front face, under the sign */}
        {faceStrip(-25, -11, -7, 11, 0.5, '#2f3a33')}
        {faceStrip(-23, -13, -4.6, 1.6, 0.5, '#f0ede4', 0.8)}
        {faceStrip(-23, -15, -2, 1.6, 0.5, '#f0ede4', 0.6)}
        {faceStrip(-23, -17, 0.6, 1.6, 0.5, '#e05a7a', 0.8)}
        {/* strawberry mark on the right face */}
        {faceStrip(18, 26, -8.5, 5, -0.5, '#d94436')}
        {faceStrip(20, 24, -11, 2.5, -0.5, '#43a047')}
      </g>
      {/* counter goods: crates, cup stack, blender */}
      <g shapeRendering="crispEdges">
        <rect x="-12" y="-42" width="10" height="7" fill="#b8926a" />
        <rect x="-11" y="-46" width="3.4" height="4" fill="#e05a7a" />
        <rect x="-7" y="-46.6" width="3.4" height="4.6" fill="#d94436" />
        <rect x="-12" y="-42" width="10" height="1.6" fill="#fff" opacity="0.35" />
        <rect x="0" y="-45" width="10" height="7" fill="#b8926a" />
        <rect x="1" y="-49" width="3.4" height="4" fill="#57a84e" />
        <rect x="5" y="-49.6" width="3.4" height="4.6" fill="#f2c53d" />
        <rect x="0" y="-45" width="10" height="1.6" fill="#fff" opacity="0.35" />
        {/* cup stack */}
        <rect x="-22" y="-38" width="7" height="8" fill="#fdfaf2" stroke={INK} strokeWidth="0.8" />
        <rect x="-22" y="-35.5" width="7" height="1.2" fill={INK} opacity="0.25" />
        <rect x="-22" y="-33" width="7" height="1.2" fill={INK} opacity="0.25" />
        {/* blender */}
        <rect x="13" y="-36" width="8" height="4" fill="#1f1e1c" />
        <rect x="14" y="-43" width="6" height="7" fill="#cfe3ea" />
        <rect x="14" y="-40" width="6" height="2" fill="#e05a7a" opacity="0.8" />
      </g>
      {/* terrazzo speckle on the boutique counter */}
      {s === 2 && !rival && (
        <g shapeRendering="crispEdges">
          <rect x="-6" y="-32" width="2" height="2" fill="#e05a7a" />
          <rect x="6" y="-28" width="2" height="2" fill="#1a1a18" opacity="0.5" />
          <rect x="-16" y="-29" width="2" height="2" fill="#d9b34a" />
          <rect x="16" y="-24" width="2" height="2" fill="#2f9ea8" />
          <rect x="0" y="-22" width="2" height="2" fill="#e05a7a" />
        </g>
      )}
      {/* flagship counter: gold-flecked marble + the glass juice case */}
      {s === 3 && !rival && (
        <g shapeRendering="crispEdges">
          <rect x="-8" y="-31" width="2" height="2" fill="#d9b34a" />
          <rect x="4" y="-27" width="2" height="2" fill="#e05a7a" />
          <rect x="-17" y="-28" width="2" height="2" fill="#d9b34a" />
          <rect x="13" y="-23" width="2" height="2" fill="#c9b99a" />
          <rect x="-2" y="-21.5" width="2" height="2" fill="#d9b34a" />
          <rect x="20" y="-46" width="13" height="12" fill="#cfe3ea" stroke={INK} strokeWidth="0.9" />
          <rect x="21.5" y="-43.5" width="10" height="2.2" fill="#e05a7a" />
          <rect x="21.5" y="-40.3" width="10" height="2.2" fill="#f2c53d" />
          <rect x="21.5" y="-37.1" width="10" height="2.2" fill="#57a84e" />
        </g>
      )}
      {/* marquee glow for the flagship */}
      {s === 3 && !rival && <ellipse cx="-12" cy="-14" rx="26" ry="12" fill="#ffe08a" opacity="0.35" />}
      {/* sign plate lying flat on the front face, following the cart's angle */}
      <g>
        <polygon
          points="-28,-23 4,-7 4,6 -28,-10"
          fill="#fdfaf2"
          stroke={s === 3 ? P.trim : INK}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {faceStrip(-27.4, 3.4, -22, 3, 0.5, P.stripe)}
        <text
          x="-11.5"
          y="-6.2"
          textAnchor="middle"
          fontFamily="'Silkscreen', monospace"
          fontSize={rival ? 4.6 : 5.6}
          fill={INK}
          letterSpacing="0.4"
          transform="rotate(26.565 -11.5 -8.5)"
        >
          {sign}
        </text>
      </g>

      {/* ——— overhead, per tier ——— */}
      {s <= 0 && (
        // classic striped umbrella
        <g shapeRendering="crispEdges">
          <rect x="2" y="-56" width="4" height="22" fill={P.pole} />
          <rect x="-6" y="-84" width="20" height="6" fill={P.stripe} />
          <rect x="-18" y="-78" width="44" height="6" fill="#fdfaf2" />
          <rect x="-28" y="-72" width="64" height="6" fill={P.stripe} />
          <rect x="-34" y="-66" width="76" height="6" fill="#fdfaf2" />
          <rect x="-34" y="-60" width="10" height="4" fill={P.stripe} />
          <rect x="-16" y="-60" width="10" height="4" fill={P.stripe} />
          <rect x="2" y="-60" width="10" height="4" fill={P.stripe} />
          <rect x="20" y="-60" width="10" height="4" fill={P.stripe} />
          <rect x="32" y="-60" width="10" height="4" fill={P.stripe} />
          <rect x="-34" y="-66" width="76" height="1.6" fill={INK} opacity="0.12" />
          <rect x="0" y="-88" width="8" height="4" fill="#e05a7a" />
        </g>
      )}
      {s === 1 && (
        // farmers-market tent: striped valance on two poles
        <g shapeRendering="crispEdges">
          <rect x="-36" y="-58" width="4" height="26" fill={P.pole} />
          <rect x="30" y="-46" width="4" height="24" fill={P.pole} />
          <rect x="-42" y="-72" width="88" height="8" fill="#fdfaf2" />
          <rect x="-42" y="-76" width="88" height="4" fill={P.trim} opacity="0.85" />
          {[-42, -20, 2, 24].map((vx) => (
            <rect key={vx} x={vx} y={-64} width="11" height="8" fill={P.stripe} />
          ))}
          {[-31, -9, 13, 35].map((vx) => (
            <rect key={vx} x={vx} y={-64} width="11" height="8" fill="#fdfaf2" />
          ))}
          {[-42, -20, 2, 24].map((vx) => (
            <rect key={`s${vx}`} x={vx + 2} y={-56} width="7" height="3" fill={P.stripe} />
          ))}
        </g>
      )}
      {s === 2 && (
        // boutique kiosk: cream canopy, brass poles, hanging pendant bulbs
        <g shapeRendering="crispEdges">
          <rect x="-36" y="-58" width="3.4" height="26" fill={P.pole} />
          <rect x="31" y="-46" width="3.4" height="24" fill={P.pole} />
          <rect x="-42" y="-74" width="88" height="10" fill="#f5efe2" />
          <rect x="-42" y="-78" width="88" height="4" fill="#c9a06a" />
          {[-40, -24, -8, 8, 24, 36].map((vx) => (
            <rect key={vx} x={vx} y={-64} width="8" height="3.4" fill="#c9a06a" />
          ))}
          {/* pendants */}
          <rect x="-13" y="-64" width="1.6" height="9" fill={INK} opacity="0.6" />
          <rect x="-15.4" y="-55" width="6" height="5" fill="#ffe08a" />
          <rect x="14" y="-60" width="1.6" height="9" fill={INK} opacity="0.6" />
          <rect x="11.6" y="-51" width="6" height="5" fill="#ffe08a" />
        </g>
      )}
      {s === 3 && (
        // flagship: luxe striped double-tier canopy, gold scallops, lights, flag
        <g shapeRendering="crispEdges">
          <rect x="-36" y="-60" width="3.4" height="28" fill={P.pole} />
          <rect x="31" y="-48" width="3.4" height="26" fill={P.pole} />
          <rect x="-20" y="-90" width="48" height="7" fill="#e05a7a" />
          <rect x="-16" y="-90" width="8" height="7" fill="#fdfaf2" />
          <rect x="0" y="-90" width="8" height="7" fill="#fdfaf2" />
          <rect x="16" y="-90" width="8" height="7" fill="#fdfaf2" />
          <rect x="-44" y="-83" width="92" height="13" fill="#fdfaf2" />
          <rect x="-44" y="-86" width="92" height="3" fill={P.trim} />
          {[-44, -28, -12, 4, 20, 36].map((vx) => (
            <rect key={`b${vx}`} x={vx} y={-83} width="8" height="13" fill={P.stripe} />
          ))}
          {[-44, -28, -12, 4, 20, 36].map((vx) => (
            <rect key={vx} x={vx} y={-70} width="8" height="4" fill={P.stripe} />
          ))}
          {/* string lights swooping across the front */}
          <path d="M-44 -66 Q 2 -52 48 -68" fill="none" stroke={INK} strokeWidth="1" opacity="0.5" shapeRendering="auto" />
          {[-38, -26, -14, -2, 10, 22, 34, 44].map((vx, i) => {
            const t = (vx + 44) / 92;
            const vy = (1 - t) * (1 - t) * -66 + 2 * (1 - t) * t * -52 + t * t * -68;
            return (
              <rect key={vx} x={vx - 1.6} y={vy} width="3.4" height="3.4" fill={['#ffe08a', '#e05a7a', '#7fb4c9'][i % 3]} />
            );
          })}
          {/* flag */}
          <rect x="2" y="-102" width="2.4" height="14" fill={P.pole} />
          <rect x="4.4" y="-101" width="12" height="6" fill="#e05a7a" />
        </g>
      )}
      {/* potted plants flanking the fancier stands */}
      {s >= 2 && !rival && (
        <g shapeRendering="crispEdges">
          <rect x="-52" y="8" width="11" height="9" fill="#b8674f" />
          <rect x="-50" y="1" width="7" height="7" fill="#57a84e" />
          <rect x="-52" y="-3" width="5" height="5" fill="#4c9440" />
          <rect x="-46" y="-4" width="4" height="4" fill="#6fbc5f" />
          {s === 3 && (
            <>
              <rect x="42" y="0" width="11" height="9" fill="#b8674f" />
              <rect x="44" y="-7" width="7" height="7" fill="#57a84e" />
              <rect x="42" y="-11" width="5" height="5" fill="#6fbc5f" />
            </>
          )}
        </g>
      )}
    </g>
  );
}
