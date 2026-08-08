// Shared vector building blocks for the location scenes.
import type { ReactNode } from 'react';
import { iso, poly, INK, ASPHALT, ASPHALT_D, CONCRETE, CONCRETE_D, DASH } from './iso';

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
  return (
    <g stroke={INK} strokeWidth="1.2" strokeLinejoin="round">
      <polygon points={poly([up(T1), up(T2), up(T3), up(T4)])} fill={top} />
      <polygon points={poly([up(T2), up(T3), T3, T2])} fill={right} />
      <polygon points={poly([up(T4), up(T3), T3, T4])} fill={front} />
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
  return (
    <g stroke={INK} strokeWidth="1.2" strokeLinejoin="round">
      <polygon points={poly([up(T2, h), up(T3, h), T3, T2])} fill={wall} />
      <polygon points={poly([up(T4, h), up(T3, h), T3, T4])} fill={wall} />
      <polygon points={poly([up(T1, h), RA, RB, up(T4, h)])} fill={roof} opacity="0.85" />
      <polygon points={poly([up(T2, h), RA, RB, up(T3, h)])} fill={roof} />
      <rect x={door[0] - 5} y={door[1] - h * 0.72} width="10" height={h * 0.6} fill={INK} opacity="0.55" />
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

export function Umbrella({ x, y, c1, c2 }: { x: number; y: number; c1: string; c2: string }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} shapeRendering="crispEdges">
      <rect x="-1.4" y="-26" width="2.8" height="26" fill="#8a6f4d" />
      <rect x="-6" y="-34" width="12" height="5" fill={c1} />
      <rect x="-13" y="-30" width="26" height="5" fill={c2} />
      <rect x="-19" y="-26" width="38" height="5" fill={c1} />
      <rect x="-19" y="-21" width="6" height="3" fill={c2} />
      <rect x="-7" y="-21" width="6" height="3" fill={c2} />
      <rect x="5" y="-21" width="6" height="3" fill={c2} />
      <rect x="-1.5" y="-37" width="3" height="3" fill={c2} />
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

// The Erewhon cart, drawn as a real isometric object: iso-box body with
// sign and jars flat on the visible faces, umbrella overhead, grounded wheels.
// The Erewhon cart — pixel build: blocky striped umbrella, straight marquee
// sign, produce crates on the counter, square wheels.
export function Cart({ x, y, rival = false }: { x: number; y: number; rival?: boolean }) {
  const [px, py] = iso(x, y);
  const body = rival ? '#d8ecec' : '#fdfaf2';
  const face = rival ? '#c4e0e0' : '#efe8da';
  const stripe = rival ? '#4a9ea8' : '#9db98a';
  const counter = rival ? '#3f8a94' : '#c9b99a';
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
      {/* square pixel wheels */}
      <g shapeRendering="crispEdges">
        <rect x="19" y="12" width="10" height="10" fill="#1a1a18" />
        <rect x="22" y="15" width="4" height="4" fill={counter} />
        <rect x="-21" y="6" width="10" height="10" fill="#1a1a18" />
        <rect x="-18" y="9" width="4" height="4" fill={counter} />
      </g>
      {/* iso body */}
      <g stroke={INK} strokeWidth="1.1" strokeLinejoin="round">
        <polygon points={poly([T1, T2, P2, P1])} fill={face} />
        <polygon points={poly([T2, T3, P3, P2])} fill={body} />
        <polygon points={poly([T0, T1, T2, T3])} fill={counter} />
      </g>
      {/* produce crates on the counter */}
      <g shapeRendering="crispEdges">
        <rect x="-8" y="-44" width="9" height="6" fill="#e05a7a" />
        <rect x="3" y="-46" width="9" height="7" fill="#57a84e" />
        <rect x="14" y="-42" width="8" height="6" fill="#3f97d9" />
        <rect x="-8" y="-44" width="9" height="1.6" fill="#fff" opacity="0.4" />
        <rect x="3" y="-46" width="9" height="1.6" fill="#fff" opacity="0.4" />
      </g>
      {/* straight marquee sign — no more glitch-skewed lettering */}
      <g shapeRendering="crispEdges">
        <rect x="-31" y="-32" width="50" height="14" fill="#fdfaf2" stroke={INK} strokeWidth="1.4" />
        <rect x="-31" y="-32" width="50" height="3" fill={stripe} />
      </g>
      <text
        x="-6"
        y="-21.5"
        textAnchor="middle"
        fontFamily="'Press Start 2P', monospace"
        fontSize="6.4"
        fill={INK}
        letterSpacing="0.5"
      >
        {sign}
      </text>
      {/* pixel umbrella: stepped striped dome with a scalloped edge */}
      <g shapeRendering="crispEdges">
        <rect x="2" y="-56" width="4" height="22" fill="#8a6f4d" />
        <rect x="-8" y="-84" width="20" height="6" fill={stripe} />
        <rect x="-20" y="-78" width="44" height="6" fill={body} />
        <rect x="-30" y="-72" width="64" height="6" fill={stripe} />
        <rect x="-36" y="-66" width="76" height="6" fill={body} />
        {/* scallops */}
        <rect x="-36" y="-60" width="10" height="4" fill={stripe} />
        <rect x="-18" y="-60" width="10" height="4" fill={stripe} />
        <rect x="0" y="-60" width="10" height="4" fill={stripe} />
        <rect x="18" y="-60" width="10" height="4" fill={stripe} />
        <rect x="30" y="-60" width="10" height="4" fill={stripe} />
        {/* finial */}
        <rect x="0" y="-88" width="8" height="4" fill="#e05a7a" />
      </g>
    </g>
  );
}
