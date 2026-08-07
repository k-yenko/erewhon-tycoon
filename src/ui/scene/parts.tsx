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
    <g stroke={INK} strokeWidth="1.1">
      <path d={`M${px} ${py} L${px} ${py - 16 * s}`} strokeWidth={3 * s} stroke="#8a6f4d" />
      <circle cx={px - 6 * s} cy={py - 20 * s} r={8 * s} fill="#4c9440" />
      <circle cx={px + 6 * s} cy={py - 21 * s} r={8.5 * s} fill="#57a84e" />
      <circle cx={px} cy={py - 27 * s} r={8 * s} fill="#5aa552" />
    </g>
  );
}

export function Palm({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const [px, py] = iso(x, y);
  return (
    <g stroke={INK} strokeWidth="1.1" transform={`translate(${px} ${py}) scale(${s})`}>
      <path d="M0 0 C1 -10 0 -20 -2 -28" fill="none" stroke="#8a6f4d" strokeWidth="4" strokeLinecap="round" />
      <g fill="#57a84e">
        <path d="M-2 -28 C-10 -32 -16 -31 -20 -27 C-13 -29 -7 -28 -2 -26Z" />
        <path d="M-2 -28 C-8 -35 -14 -36 -19 -34 C-12 -33 -6 -30 -2 -27Z" />
        <path d="M-2 -28 C4 -35 10 -36 15 -34 C9 -32 3 -30 -1 -27Z" />
        <path d="M-2 -28 C6 -31 12 -30 17 -26 C10 -29 3 -28 -2 -26Z" />
        <path d="M-2 -28 C-1 -36 1 -39 5 -41 C1 -37 0 -32 -1 -27Z" />
      </g>
    </g>
  );
}

export function Hedge({ x, y, w }: { x: number; y: number; w: number }) {
  const [px, py] = iso(x, y);
  const [qx, qy] = iso(x + w, y);
  return (
    <g stroke={INK} strokeWidth="1.1">
      <path d={`M${px} ${py} L${qx} ${qy}`} stroke="#4c9440" strokeWidth="14" strokeLinecap="round" />
      <path d={`M${px} ${py - 3} L${qx} ${qy - 3}`} stroke="#57a84e" strokeWidth="8" strokeLinecap="round" />
    </g>
  );
}

export function Umbrella({ x, y, c1, c2 }: { x: number; y: number; c1: string; c2: string }) {
  const [px, py] = iso(x, y);
  return (
    <g stroke={INK} strokeWidth="1.1" transform={`translate(${px} ${py})`}>
      <path d="M0 0 V-26" stroke="#8a6f4d" strokeWidth="2.5" />
      <path d="M-18 -22 C-12 -32 12 -32 18 -22 L10 -24 L0 -22 L-10 -24Z" fill={c1} strokeLinejoin="round" />
      <path d="M-10 -24 C-5 -29 5 -29 10 -24 L0 -22Z" fill={c2} strokeLinejoin="round" />
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

export function Bin({ x, y, color }: { x: number; y: number; color: string }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} stroke={INK} strokeWidth="1" strokeLinejoin="round">
      <rect x="-5" y="-16" width="10" height="15" rx="1.5" fill={color} />
      <rect x="-6.5" y="-19" width="13" height="3.5" rx="1.5" fill={color} />
    </g>
  );
}

export function Planter({ x, y }: { x: number; y: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} stroke={INK} strokeWidth="1">
      <rect x="-9" y="-8" width="18" height="8" fill="#c4beb0" />
      <circle cx="-3" cy="-11" r="4.5" fill="#57a84e" />
      <circle cx="4" cy="-12" r="5" fill="#4c9440" />
    </g>
  );
}

export function LampPost({ x, y }: { x: number; y: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} stroke={INK} strokeWidth="1.2">
      <path d="M0 0 V-34" strokeWidth="2.2" />
      <circle cx="0" cy="-36" r="3.5" fill="#f2c53d" />
    </g>
  );
}

export function WaterTower({ x, y }: { x: number; y: number }) {
  const [px, py] = iso(x, y);
  return (
    <g transform={`translate(${px} ${py})`} stroke={INK} strokeWidth="1.2" strokeLinejoin="round">
      <path d="M-12 0 L-4 -34 M12 0 L4 -34 M-9 -12 L9 -12 M-7 -24 L7 -24" fill="none" />
      <path d="M-11 -34 H11 V-52 C11 -52 6 -56 0 -56 C-6 -56 -11 -52 -11 -52Z" fill="#b5ab9c" />
      <path d="M-11 -52 C-6 -49 6 -49 11 -52" fill="none" />
      <path d="M0 -56 V-62" strokeWidth="1.6" />
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
export function Cart({ x, y, rival = false }: { x: number; y: number; rival?: boolean }) {
  const [px, py] = iso(x, y);
  const body = rival ? '#d8ecec' : '#faf7f0';
  const face = rival ? '#c4e0e0' : '#f0e9da';
  const stripe = rival ? '#4a9ea8' : '#c9b99a';
  const sign = rival ? 'MOON JUUS' : 'EREWHON';
  // footprint corners (local): back, right, front(bottom), left — height 34
  const P0: [number, number] = [0, -10];
  const P1: [number, number] = [38, 9];
  const P2: [number, number] = [8, 24];
  const P3: [number, number] = [-30, 5];
  const H = 34;
  const up = (p: [number, number]): [number, number] => [p[0], p[1] - H];
  const [T0, T1, T2, T3] = [P0, P1, P2, P3].map(up) as [number, number][];
  return (
    <g
      transform={`translate(${px} ${py - 22})`}
      stroke={INK}
      strokeWidth="1.2"
      strokeLinejoin="round"
    >
      <ellipse cx="4" cy="22" rx="40" ry="9" fill={INK} opacity="0.1" stroke="none" />
      {/* wheels tucked under the body */}
      <ellipse cx="24" cy="18" rx="5.5" ry="6" fill="#4a4740" />
      <ellipse cx="24" cy="18" rx="2" ry="2.2" fill="#c9b99a" />
      <ellipse cx="-16" cy="12" rx="5.5" ry="6" fill="#4a4740" />
      <ellipse cx="-16" cy="12" rx="2" ry="2.2" fill="#c9b99a" />
      {/* body: right + front faces, counter top */}
      <polygon points={poly([T1, T2, P2, P1])} fill={face} />
      <polygon points={poly([T2, T3, P3, P2])} fill={body} />
      <polygon points={poly([T0, T1, T2, T3])} fill={stripe} />
      {/* jars on the right face (skewed to the face slope) */}
      <g transform="translate(12 -6) skewY(-26.565)" stroke={INK} strokeWidth="1">
        <rect x="0" y="0" width="6.5" height="8" rx="1" fill="#e05a7a" />
        <rect x="9.5" y="0" width="6.5" height="8" rx="1" fill="#57a84e" />
        <rect x="19" y="0" width="6.5" height="8" rx="1" fill="#3f97d9" />
      </g>
      {/* sign mounted on the front-left face */}
      <polygon
        points={poly([[-27, -20], [4, -4.5], [4, 5.5], [-27, -10]])}
        fill={body}
      />
      <text
        x="-11.5"
        y="-4.5"
        textAnchor="middle"
        fontFamily="'Press Start 2P', monospace"
        fontSize="5.4"
        fill={INK}
        stroke="none"
        letterSpacing="0.5"
        transform="rotate(26.565 -11.5 -4.5)"
      >
        {sign}
      </text>
      {/* umbrella: pole from the counter, striped iso dome above */}
      <path d="M4 -36 V-64" stroke="#8a6f4d" strokeWidth="2.8" />
      <g strokeLinejoin="round">
        <defs>
          <clipPath id={rival ? 'rival-canopy' : 'cart-canopy'}>
            <path d="M-34 -56 C-26 -78 34 -82 42 -62 C28 -66 12 -64 4 -63 C-8 -62 -24 -59 -34 -56Z" />
          </clipPath>
        </defs>
        <path d="M-34 -56 C-26 -78 34 -82 42 -62 C28 -66 12 -64 4 -63 C-8 -62 -24 -59 -34 -56Z" fill={body} stroke="none" />
        <g clipPath={rival ? 'url(#rival-canopy)' : 'url(#cart-canopy)'} stroke="none">
          <rect x="-34" y="-84" width="19" height="30" fill={stripe} />
          <rect x="-4" y="-84" width="19" height="30" fill={stripe} />
          <rect x="26" y="-84" width="19" height="30" fill={stripe} />
        </g>
        <path d="M-34 -56 C-26 -78 34 -82 42 -62 C28 -66 12 -64 4 -63 C-8 -62 -24 -59 -34 -56Z" fill="none" />
        <circle cx="4" cy="-73" r="2.3" fill="#c9b99a" />
      </g>
    </g>
  );
}
