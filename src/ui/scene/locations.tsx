// Ten hand-built location scenes, each matched to its LA stereotype and to
// its movement layout in layouts.ts (roads/paving under the walk path).
import type { ReactNode } from 'react';
import type { LocationDef } from '../../game/types';
import { iso, poly, INK, ASPHALT, ASPHALT_D, CONCRETE, CONCRETE_D, DASH } from './iso';
import {
  Awning, Bin, Box, CrossRoads, FerrisWheel, Hedge, House, LampPost, Palm, Planter,
  RoadX, SUV, SidewalkX, Tree, WaterTower, Windows,
} from './parts';
import { LAYOUTS, type GridPt } from './layouts';

// Concrete ribbon following a walk path (for plazas/greens without sidewalks).
function PathPaving({ pts, width = 20, color = CONCRETE }: { pts: GridPt[]; width?: number; color?: string }) {
  const d = pts
    .map((p, i) => {
      const [x, y] = iso(p[0], p[1]);
      return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
    })
    .join(' ');
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={width + 2.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

// Sign lettering aligned to a front wall face (rotated to the iso slope).
function SignText({ at, dy, text, size = 8 }: { at: GridPt; dy: number; text: string; size?: number }) {
  const [x, y] = iso(at[0], at[1]);
  return (
    <text
      x={x}
      y={y + dy}
      textAnchor="middle"
      fontFamily="'Silkscreen', monospace"
      fontSize={size}
      fill={INK}
      stroke="none"
      letterSpacing="1"
      transform={`rotate(26.565 ${x} ${y + dy})`}
    >
      {text}
    </text>
  );
}

// 1 — Your Driveway: quiet residential street, cart on an actual driveway.
function DrivewayScene({ loc }: { loc: LocationDef }) {
  return (
    <g>
      <House x={0.7} y={1.7} w={1.7} d={1.4} h={32} rh={15} wall="#efe8da" roof={loc.sceneColors.accent} />
      <House x={7.6} y={1.5} w={1.7} d={1.4} h={34} rh={16} wall="#e6dccb" roof="#7b5ec7" />
      <Tree x={3.4} y={3.0} />
      <Tree x={6.6} y={3.2} s={0.8} />
      <SidewalkX y0={3.6} y1={4.3} />
      <RoadX y0={4.3} y1={5.7} dashY={5} />
      <SUV x={8.6} y={4.85} color="#b8c4c9" />
      <SidewalkX y0={5.7} y1={6.6} />
      {/* the driveway itself, running down from the sidewalk to your bungalow */}
      <polygon points={poly([iso(5.4, 6.6), iso(6.7, 6.6), iso(6.7, 8.4), iso(5.4, 8.4)])} fill="#cfc9bb" stroke={INK} strokeWidth="1.2" />
      <House x={6.85} y={6.8} w={1.6} d={1.3} h={30} rh={14} wall="#f0e9da" roof="#57a84e" />
      <Bin x={5.1} y={6.95} color="#4a5560" />
      <Bin x={5.1} y={7.35} color="#6e9a7c" />
      <Palm x={0.6} y={7.3} />
    </g>
  );
}

// 2 — Silver Lake: Sunset Junction storefronts, mural wall, overhead wires.
function SilverlakeScene({ loc }: { loc: LocationDef }) {
  const [w1x, w1y] = iso(-1, 1.2);
  const [w2x, w2y] = iso(11, 3.4);
  return (
    <g>
      {/* coffee shop + record store */}
      <Box x={0.6} y={1.8} w={1.9} d={1.5} h={44} top="#e6dfd0" right="#efe8da" front="#f0e9da">
        <Awning a={[0.6, 3.3]} b={[2.5, 3.3]} top={30} drop={9} color={loc.sceneColors.accent} />
      </Box>
      <Box x={2.9} y={1.9} w={1.6} d={1.4} h={38} top="#d8cdb8" right="#e0d5c0" front="#e8ddc8">
        <Awning a={[2.9, 3.3]} b={[4.5, 3.3]} top={26} drop={8} color="#7b5ec7" />
      </Box>
      {/* mural wall */}
      <Box x={6.6} y={2.0} w={2.4} d={1.2} h={40} top="#c4beb0" right="#d8d2c4" front="#e05a7a" />
      <circle cx={iso(8.3, 3.2)[0]} cy={iso(8.3, 3.2)[1] - 22} r="9" fill="#3f97d9" stroke={INK} strokeWidth="1.1" />
      <circle cx={iso(8.9, 3.2)[0]} cy={iso(8.9, 3.2)[1] - 14} r="6" fill="#f2c53d" stroke={INK} strokeWidth="1.1" />
      <Tree x={5.6} y={3.3} s={0.85} />
      {/* power line */}
      <path d={`M${w1x} ${w1y - 90} Q ${(w1x + w2x) / 2} ${(w1y + w2y) / 2 - 55} ${w2x} ${w2y - 84}`} fill="none" stroke={INK} strokeWidth="1.2" opacity="0.5" />
      <SidewalkX y0={3.6} y1={4.3} />
      <RoadX y0={4.3} y1={5.7} dashY={5} />
      <SidewalkX y0={5.7} y1={6.6} />
      <Bin x={0.4} y={6.3} color="#6e9a7c" />
      <Tree x={8.4} y={6.25} s={0.75} />
    </g>
  );
}

// 3 — Culver City: office plaza at a cross intersection.
function CulverScene({ loc }: { loc: LocationDef }) {
  return (
    <g>
      <Box x={0.8} y={1.2} w={1.8} d={1.6} h={72} top="#b9c4c9" right="#9aa7ad" front="#aab6bc">
        <Windows x={0.8} y={1.2} w={1.8} d={1.6} h={72} cols={4} rows={4} />
      </Box>
      <Box x={6.3} y={1.4} w={1.7} d={1.4} h={54} top="#c4beb0" right="#a8a094" front="#b5ab9c">
        <Windows x={6.3} y={1.4} w={1.7} d={1.4} h={54} cols={4} rows={3} />
      </Box>
      <Box x={8.7} y={1.8} w={1.3} d={1.1} h={40} top={loc.sceneColors.accent} right="#8fa3ae" front="#9fb2bc" />
      <Tree x={3.1} y={3.1} s={0.85} />
      <CrossRoads />
      <Planter x={1.2} y={6.7} />
      <Planter x={7.4} y={6.7} />
    </g>
  );
}

// 4 — Studio City: soundstage, water tower, lot wall.
function StudioScene({ loc }: { loc: LocationDef }) {
  return (
    <g>
      <Box x={0.4} y={0.8} w={3.4} d={2.2} h={88} top="#d8cdb8" right="#cfc4ac" front="#e0d5c0">
        {/* elephant door */}
        <polygon
          points={poly([
            [iso(1.4, 3.0)[0], iso(1.4, 3.0)[1] - 52],
            [iso(3.0, 3.0)[0], iso(3.0, 3.0)[1] - 52],
            [iso(3.0, 3.0)[0], iso(3.0, 3.0)[1] - 2],
            [iso(1.4, 3.0)[0], iso(1.4, 3.0)[1] - 2],
          ])}
          fill="#b5ab9c"
        />
      </Box>
      <SignText at={[2.2, 3.0]} dy={-62} text="STAGE 4" size={9} />
      {/* lot gate over the wall so the movie-lot read is unmistakable */}
      <SignText at={[8.1, 3.45]} dy={-26} text="STUDIO LOT" size={7} />
      <g transform={`translate(${iso(7.4, 2.3)[0]} ${iso(7.4, 2.3)[1]}) scale(1.35) translate(${-iso(7.4, 2.3)[0]} ${-iso(7.4, 2.3)[1]})`}>
        <WaterTower x={7.4} y={2.3} />
      </g>
      {/* lot wall */}
      <Box x={5.8} y={3.15} w={4.7} d={0.3} h={20} top="#e6dfd0" right="#d8d2c4" front="#e0dacb" />
      <SidewalkX y0={3.6} y1={4.3} />
      <RoadX y0={4.3} y1={5.7} dashY={5} />
      <SidewalkX y0={5.7} y1={6.6} />
      <Palm x={0.5} y={6.4} s={0.9} />
      <Palm x={9.7} y={6.35} s={0.85} />
      <Bin x={7.2} y={6.4} color={loc.sceneColors.accent} />
    </g>
  );
}

// 5 — Venice: ocean, sand, boardwalk. No cars anywhere.
function VeniceScene({ loc }: { loc: LocationDef }) {
  return (
    <g>
      <polygon points={poly([iso(-2, -2), iso(12, -2), iso(12, 0.8), iso(-2, 0.8)])} fill="#3f97d9" stroke="none" />
      <path
        d={`M${iso(-1, 0.8)[0]} ${iso(-1, 0.8)[1]} Q ${iso(2, 0.55)[0]} ${iso(2, 0.55)[1]} ${iso(5, 0.8)[0]} ${iso(5, 0.8)[1]} T ${iso(11, 0.8)[0]} ${iso(11, 0.8)[1]}`}
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        opacity="0.7"
      />
      <polygon points={poly([iso(-2, 0.8), iso(12, 0.8), iso(12, 5.2), iso(-2, 5.2)])} fill="#efd68f" stroke="none" />
      {/* towels */}
      <polygon points={poly([iso(1.8, 2.2), iso(2.5, 2.2), iso(2.5, 2.55), iso(1.8, 2.55)])} fill="#e05a7a" stroke={INK} strokeWidth="1" />
      <polygon points={poly([iso(6.9, 1.7), iso(7.6, 1.7), iso(7.6, 2.05), iso(6.9, 2.05)])} fill="#3f97d9" stroke={INK} strokeWidth="1" />
      <Palm x={1.0} y={3.6} />
      <Palm x={5.3} y={3.1} s={0.85} />
      <Palm x={9.8} y={3.7} s={1.05} />
      {/* boardwalk */}
      <polygon points={poly([iso(-2, 5.2), iso(12, 5.2), iso(12, 7.2), iso(-2, 7.2)])} fill="#cf9c55" stroke={INK} strokeWidth="1.2" />
      {Array.from({ length: 28 }, (_, i) => -2 + i * 0.5).map((gx) => {
        const [ax, ay] = iso(gx, 5.2);
        const [bx, by] = iso(gx, 7.2);
        return <line key={gx} x1={ax} y1={ay} x2={bx} y2={by} stroke="#b8853f" strokeWidth="1.3" />;
      })}
      <Bin x={0.2} y={6.9} color={loc.sceneColors.accent} />
    </g>
  );
}

// 6 — Santa Monica: pier with ferris wheel, promenade with string lights.
function SantamonicaScene({ loc }: { loc: LocationDef }) {
  const posts: GridPt[] = [[-0.5, 6.9], [2.2, 6.9], [6.8, 6.9], [9.5, 6.9]];
  return (
    <g>
      <polygon points={poly([iso(-2, -2), iso(12, -2), iso(12, 1.4), iso(-2, 1.4)])} fill="#3f97d9" stroke="none" />
      {/* pier deck + ferris wheel */}
      <polygon points={poly([iso(2.8, -1.2), iso(5.4, -1.2), iso(5.4, 2.1), iso(2.8, 2.1)])} fill="#a8875f" stroke={INK} strokeWidth="1.2" />
      {[3.2, 4.1, 5.0].map((gx) => {
        const [x, y] = iso(gx, 1.55);
        return <line key={gx} x1={x} y1={y} x2={x} y2={y + 14} stroke={INK} strokeWidth="2" />;
      })}
      <FerrisWheel x={4.1} y={0.5} s={0.95} />
      <polygon points={poly([iso(-2, 1.4), iso(12, 1.4), iso(12, 2.4), iso(-2, 2.4)])} fill="#efd68f" stroke="none" />
      {/* storefront row */}
      <Box x={0.6} y={2.5} w={1.8} d={1.2} h={40} top="#f0e9da" right="#e6dfd0" front="#efe8da">
        <Awning a={[0.6, 3.7]} b={[2.4, 3.7]} top={28} drop={8} color="#e05a7a" />
      </Box>
      <Box x={2.9} y={2.6} w={1.5} d={1.1} h={34} top="#e8ddc8" right="#e0d5c0" front="#e8ddc8">
        <Awning a={[2.9, 3.7]} b={[4.4, 3.7]} top={24} drop={8} color={loc.sceneColors.accent} />
      </Box>
      {/* promenade */}
      <polygon points={poly([iso(-2, 4.6), iso(12, 4.6), iso(12, 7.2), iso(-2, 7.2)])} fill={CONCRETE} stroke={INK} strokeWidth="1.2" />
      {[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((gx) => {
        const [ax, ay] = iso(gx, 4.6);
        const [bx, by] = iso(gx, 7.2);
        return <line key={gx} x1={ax} y1={ay} x2={bx} y2={by} stroke={CONCRETE_D} strokeWidth="1.3" />;
      })}
      {posts.map((p, i) => (
        <LampPost key={i} x={p[0]} y={p[1]} />
      ))}
      {posts.slice(0, -1).map((p, i) => {
        const [ax, ay] = iso(p[0], p[1]);
        const [bx, by] = iso(posts[i + 1][0], posts[i + 1][1]);
        return (
          <path
            key={`s${i}`}
            d={`M${ax} ${ay - 34} Q ${(ax + bx) / 2} ${(ay + by) / 2 - 22} ${bx} ${by - 34}`}
            fill="none"
            stroke={INK}
            strokeWidth="1"
            opacity="0.5"
          />
        );
      })}
      <Planter x={5.4} y={5.0} />
    </g>
  );
}

// 7 — Calabasas: gated community, mansion behind the wall, parked SUVs.
function CalabasasScene({ loc }: { loc: LocationDef }) {
  const g1 = iso(4.75, 3.95);
  const g2 = iso(6.05, 3.95);
  return (
    <g>
      <House x={6.6} y={0.9} w={2.4} d={1.7} h={46} rh={22} wall="#f5f0e4" roof={loc.sceneColors.accent} />
      <Tree x={9.4} y={2.6} />
      {/* estate wall with gate pillars */}
      <Box x={-2} y={3.6} w={6.35} d={0.3} h={26} top="#f0e9da" right="#e6dfd0" front="#efe8da" />
      <Box x={6.4} y={3.6} w={5.6} d={0.3} h={26} top="#f0e9da" right="#e6dfd0" front="#efe8da" />
      <Box x={4.35} y={3.55} w={0.4} d={0.4} h={38} top="#e6dfd0" right="#d8d2c4" front="#e0dacb" />
      <Box x={6.05} y={3.55} w={0.4} d={0.4} h={38} top="#e6dfd0" right="#d8d2c4" front="#e0dacb" />
      {/* iron gate */}
      {[0.18, 0.38, 0.58, 0.78].map((t) => {
        const x = g1[0] + (g2[0] - g1[0]) * t;
        const y = g1[1] + (g2[1] - g1[1]) * t;
        return <line key={t} x1={x} y1={y - 30} x2={x} y2={y - 2} stroke={INK} strokeWidth="1.6" />;
      })}
      <line x1={g1[0]} y1={g1[1] - 30} x2={g2[0]} y2={g2[1] - 30} stroke={INK} strokeWidth="2" />
      <Hedge x={-1.4} y={4.15} w={3.2} />
      <Hedge x={7.0} y={4.15} w={3.4} />
      <RoadX y0={4.5} y1={5.9} dashY={5.2} />
      <SUV x={7.6} y={5.05} color="#3a3733" />
      <SUV x={9.8} y={5.25} color="#f0e9da" />
      <SidewalkX y0={5.9} y1={6.9} />
    </g>
  );
}

// 8 — Beverly Grove: the mothership storefront + parking lot chaos.
function BeverlygroveScene(_props: { loc: LocationDef }) {
  return (
    <g>
      <Box x={0.6} y={1.4} w={5.2} d={1.9} h={54} top="#f5f0e4" right="#efe8da" front="#f0e9da">
        {/* sign band */}
        <polygon
          points={poly([
            [iso(0.6, 3.3)[0], iso(0.6, 3.3)[1] - 46],
            [iso(5.8, 3.3)[0], iso(5.8, 3.3)[1] - 46],
            [iso(5.8, 3.3)[0], iso(5.8, 3.3)[1] - 30],
            [iso(0.6, 3.3)[0], iso(0.6, 3.3)[1] - 30],
          ])}
          fill={INK}
        />
      </Box>
      <text
        x={iso(3.2, 3.3)[0]}
        y={iso(3.2, 3.3)[1] - 35}
        textAnchor="middle"
        fontFamily="'Silkscreen', monospace"
        fontSize="10"
        fill="#faf7f0"
        stroke="none"
        letterSpacing="3"
        transform={`rotate(26.565 ${iso(3.2, 3.3)[0]} ${iso(3.2, 3.3)[1] - 35})`}
      >
        EREWHON
      </text>
      <Palm x={7.2} y={2.4} />
      <Palm x={8.6} y={2.8} s={0.85} />
      {/* parking lot */}
      <polygon points={poly([iso(-2, 3.9), iso(12, 3.9), iso(12, 6.6), iso(-2, 6.6)])} fill={ASPHALT} stroke={INK} strokeWidth="1.2" />
      {[-1, 0.2, 1.4, 2.6, 3.8, 5.0, 6.2, 7.4, 8.6, 9.8].map((gx) => {
        const [ax, ay] = iso(gx, 4.1);
        const [bx, by] = iso(gx, 5.2);
        return <line key={gx} x1={ax} y1={ay} x2={bx} y2={by} stroke={DASH} strokeWidth="2" />;
      })}
      <SUV x={0.0} y={4.85} color="#3a3733" />
      <SUV x={2.4} y={4.85} color="#b8c4c9" />
      <SUV x={6.0} y={4.85} color="#f0e9da" />
      <SUV x={9.6} y={4.85} color="#7b5ec7" />
      {/* lot drive lane */}
      <polygon points={poly([iso(-2, 5.4), iso(12, 5.4), iso(12, 6.6), iso(-2, 6.6)])} fill={ASPHALT_D} stroke="none" />
      <SidewalkX y0={6.6} y1={7.5} />
      <Bin x={8.9} y={7.2} color="#6e9a7c" />
    </g>
  );
}

// 9 — Beverly Hills: boutique row, palm median, gold accents.
function BeverlyhillsScene({ loc }: { loc: LocationDef }) {
  return (
    <g>
      {[
        { x: 0.5, w: 1.7, awn: '#e05a7a' },
        { x: 2.5, w: 1.5, awn: loc.sceneColors.accent },
        { x: 6.4, w: 1.7, awn: '#3f97d9' },
        { x: 8.4, w: 1.5, awn: '#f2c53d' },
      ].map((b, i) => (
        <Box key={i} x={b.x} y={1.7} w={b.w} d={1.4} h={48} top="#f5f0e4" right="#efe8da" front="#f7f2e8">
          <Awning a={[b.x, 3.1]} b={[b.x + b.w, 3.1]} top={34} drop={9} color={b.awn} />
          {/* column fronts */}
          {[0.2, b.w - 0.2].map((dx, j) => {
            const [cx, cy] = iso(b.x + dx, 3.1);
            return <line key={j} x1={cx} y1={cy - 2} x2={cx} y2={cy - 30} stroke={INK} strokeWidth="2.4" />;
          })}
        </Box>
      ))}
      <CrossRoads />
      {/* palm median in the main road */}
      <polygon points={poly([iso(-2, 4.92), iso(4.2, 4.92), iso(4.2, 5.08), iso(-2, 5.08)])} fill={CONCRETE} stroke={INK} strokeWidth="1" />
      <polygon points={poly([iso(5.8, 4.92), iso(12, 4.92), iso(12, 5.08), iso(5.8, 5.08)])} fill={CONCRETE} stroke={INK} strokeWidth="1" />
      <Palm x={0.6} y={5.0} s={0.7} />
      <Palm x={2.8} y={5.0} s={0.7} />
      <Palm x={7.2} y={5.0} s={0.7} />
      <Palm x={9.4} y={5.0} s={0.7} />
      <Planter x={1.5} y={6.7} />
      <Planter x={8.2} y={6.7} />
    </g>
  );
}

// 10 — The Palisades: village green with a curved path, bluffs + ocean sliver.
function PalisadesScene({ loc }: { loc: LocationDef }) {
  return (
    <g>
      {/* ocean sliver + bluff ridge */}
      <polygon points={poly([iso(-2, -2), iso(12, -2), iso(12, -0.6), iso(-2, -0.6)])} fill="#3f97d9" stroke="none" />
      <polygon
        points={poly([
          iso(-2, -0.6),
          iso(1, -0.9),
          iso(3.5, -0.4),
          iso(6, -1.0),
          iso(9, -0.5),
          iso(12, -0.8),
          iso(12, 0.9),
          iso(-2, 0.9),
        ])}
        fill="#5aa552"
        stroke={INK}
        strokeWidth="1.2"
      />
      {/* village storefronts */}
      <Box x={0.7} y={1.6} w={1.8} d={1.3} h={38} top="#f5f0e4" right="#efe8da" front="#f7f2e8">
        <Awning a={[0.7, 2.9]} b={[2.5, 2.9]} top={26} drop={8} color="#57a84e" />
      </Box>
      <Box x={7.2} y={1.5} w={1.9} d={1.3} h={42} top="#f5f0e4" right="#efe8da" front="#f7f2e8">
        <Awning a={[7.2, 2.8]} b={[9.1, 2.8]} top={28} drop={8} color={loc.sceneColors.accent} />
      </Box>
      <Tree x={4.6} y={2.4} />
      <SidewalkX y0={3.4} y1={4.1} />
      {/* village green */}
      <polygon
        points={poly([iso(-0.5, 4.5), iso(10.5, 4.5), iso(11.5, 6.2), iso(8, 8.2), iso(2, 8.2), iso(-1.5, 6.2)])}
        fill="#a3c39a"
        stroke={INK}
        strokeWidth="1.2"
      />
      <PathPaving pts={LAYOUTS.palisades.path} width={20} />
      <Tree x={1.6} y={5.2} s={0.9} />
      <Tree x={7.6} y={5.0} s={0.85} />
      <Palm x={9.6} y={7.0} s={0.9} />
      <Planter x={5.8} y={5.6} />
    </g>
  );
}

export const SCENES: Record<string, (props: { loc: LocationDef }) => ReactNode> = {
  driveway: DrivewayScene,
  silverlake: SilverlakeScene,
  culver: CulverScene,
  studio: StudioScene,
  venice: VeniceScene,
  santamonica: SantamonicaScene,
  calabasas: CalabasasScene,
  beverlygrove: BeverlygroveScene,
  beverlyhills: BeverlyhillsScene,
  palisades: PalisadesScene,
};
