// Ten hand-built location scenes, each matched to its LA stereotype and to
// its movement layout in layouts.ts (roads/paving under the walk path).
import type { ReactNode } from 'react';
import type { LocationDef } from '../../game/types';
import { iso, poly, INK, ASPHALT, ASPHALT_D, CONCRETE, CONCRETE_D, DASH } from './iso';
import {
  AFrame, Awning, Bench, Bike, Bin, Box, CrossRoads, FerrisWheel, FlowerPatch, Fountain,
  Hedge, House, Hydrant, LampPost, Mailbox, Palm, Planter, RoadX, RoofUnits, SUV, Seagull,
  ShoppingCart, SidewalkX, SportsCar, Spotlight, StorefrontGlass, StringLights, Topiary,
  Tree, WaterTower, Windows,
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

// A flat band painted onto a wall face between two grid points (murals, signs).
function WallBand({ a, b, lift, h, fill, opacity }: { a: GridPt; b: GridPt; lift: number; h: number; fill: string; opacity?: number }) {
  const [ax, ay] = iso(a[0], a[1]);
  const [bx, by] = iso(b[0], b[1]);
  return (
    <polygon
      points={`${ax},${ay - lift} ${bx},${by - lift} ${bx},${by - lift + h} ${ax},${ay - lift + h}`}
      fill={fill}
      stroke="none"
      opacity={opacity}
    />
  );
}

// Sign lettering aligned to a front wall face (rotated to the iso slope).
function SignText({ at, dy, text, size = 8, fill = INK }: { at: GridPt; dy: number; text: string; size?: number; fill?: string }) {
  const [x, y] = iso(at[0], at[1]);
  return (
    <text
      x={x}
      y={y + dy}
      textAnchor="middle"
      fontFamily="'Silkscreen', monospace"
      fontSize={size}
      fill={fill}
      stroke="none"
      letterSpacing="1"
      transform={`rotate(26.565 ${x} ${y + dy})`}
    >
      {text}
    </text>
  );
}

// 1 — Your Driveway: quiet residential street with real signs of life.
function DrivewayScene({ loc }: { loc: LocationDef }) {
  const hoop = iso(5.55, 8.15);
  return (
    <g>
      <House x={0.7} y={1.7} w={1.7} d={1.4} h={32} rh={15} wall="#efe8da" roof={loc.sceneColors.accent} />
      <House x={7.6} y={1.5} w={1.7} d={1.4} h={34} rh={16} wall="#e6dccb" roof="#7b5ec7" />
      <FlowerPatch x={2.75} y={3.35} />
      <FlowerPatch x={7.2} y={3.15} />
      <Tree x={3.4} y={3.0} />
      <Tree x={6.6} y={3.2} s={0.8} />
      <Hydrant x={0.4} y={3.85} />
      <SidewalkX y0={3.6} y1={4.3} />
      <RoadX y0={4.3} y1={5.7} dashY={5} />
      <SUV x={8.6} y={4.85} color="#b8c4c9" />
      <SidewalkX y0={5.7} y1={6.6} />
      <Mailbox x={7.15} y={5.85} />
      {/* the driveway itself, running down from the sidewalk to your bungalow */}
      <polygon points={poly([iso(5.4, 6.6), iso(6.7, 6.6), iso(6.7, 8.4), iso(5.4, 8.4)])} fill="#cfc9bb" stroke={INK} strokeWidth="1.2" />
      <House x={6.85} y={6.8} w={1.6} d={1.3} h={30} rh={14} wall="#f0e9da" roof="#57a84e" />
      {/* basketball hoop over the garage, obviously */}
      <g shapeRendering="crispEdges">
        <rect x={hoop[0] - 1.2} y={hoop[1] - 34} width="2.4" height="34" fill="#7d8a90" />
        <rect x={hoop[0] - 7} y={hoop[1] - 46} width="14" height="12" fill="#fdfaf2" stroke={INK} strokeWidth="1" />
        <rect x={hoop[0] - 3.4} y={hoop[1] - 41} width="6.8" height="5" fill="none" stroke={INK} strokeWidth="0.9" />
        <rect x={hoop[0] - 4.4} y={hoop[1] - 35} width="8.8" height="2.2" fill="#e8724a" />
      </g>
      <Bin x={5.1} y={6.95} color="#4a5560" />
      <Bin x={5.1} y={7.35} color="#6e9a7c" />
      <FlowerPatch x={8.9} y={7.05} />
      <Tree x={1.6} y={7.5} s={0.9} />
      <Palm x={0.6} y={7.3} />
    </g>
  );
}

// 2 — Silver Lake: Sunset Junction storefronts, a real mural, bikes and wires.
function SilverlakeScene({ loc }: { loc: LocationDef }) {
  const [w1x, w1y] = iso(-1, 1.2);
  const [w2x, w2y] = iso(11, 3.4);
  return (
    <g>
      {/* coffee shop + record store, with actual windows and doors */}
      <Box x={0.6} y={1.8} w={1.9} d={1.5} h={44} top="#e6dfd0" right="#efe8da" front="#f0e9da">
        <Awning a={[0.6, 3.3]} b={[2.5, 3.3]} top={30} drop={9} color={loc.sceneColors.accent} />
      </Box>
      <StorefrontGlass a={[0.6, 3.3]} b={[2.5, 3.3]} h={20} door={0.72} />
      <Box x={2.9} y={1.9} w={1.6} d={1.4} h={38} top="#d8cdb8" right="#e0d5c0" front="#e8ddc8">
        <Awning a={[2.9, 3.3]} b={[4.5, 3.3]} top={26} drop={8} color="#7b5ec7" />
      </Box>
      <StorefrontGlass a={[2.9, 3.3]} b={[4.5, 3.3]} h={18} door={0.2} />
      <RoofUnits x={1.4} y={2.4} h={46} />
      {/* mural wall: pixel sunset over waves */}
      <Box x={6.6} y={2.0} w={2.4} d={1.2} h={40} top="#c4beb0" right="#d8d2c4" front="#e05a7a" />
      <WallBand a={[6.7, 3.2]} b={[8.9, 3.2]} lift={36} h={8} fill="#f2c53d" />
      <WallBand a={[6.7, 3.2]} b={[8.9, 3.2]} lift={28} h={8} fill="#e8724a" />
      <WallBand a={[6.7, 3.2]} b={[8.9, 3.2]} lift={20} h={8} fill="#e05a7a" />
      <WallBand a={[6.7, 3.2]} b={[8.9, 3.2]} lift={12} h={9} fill="#3f97d9" />
      <WallBand a={[7.0, 3.2]} b={[7.5, 3.2]} lift={10} h={3} fill="#7fb4c9" />
      <WallBand a={[8.0, 3.2]} b={[8.6, 3.2]} lift={8} h={3} fill="#7fb4c9" />
      {(() => {
        const [sx, sy] = iso(7.8, 3.2);
        return (
          <g shapeRendering="crispEdges">
            <rect x={sx - 5} y={sy - 34} width="10" height="10" fill="#ffe08a" />
            <rect x={sx - 3} y={sy - 36} width="6" height="2" fill="#ffe08a" />
          </g>
        );
      })()}
      <Bike x={6.5} y={3.45} color="#e8724a" />
      <Tree x={5.6} y={3.3} s={0.85} />
      {/* power line */}
      <path d={`M${w1x} ${w1y - 90} Q ${(w1x + w2x) / 2} ${(w1y + w2y) / 2 - 55} ${w2x} ${w2y - 84}`} fill="none" stroke={INK} strokeWidth="1.2" opacity="0.5" />
      <SidewalkX y0={3.6} y1={4.3} />
      <RoadX y0={4.3} y1={5.7} dashY={5} />
      <SidewalkX y0={5.7} y1={6.6} />
      <AFrame x={2.35} y={6.45} accent="#7b5ec7" />
      <Bin x={0.4} y={6.3} color="#6e9a7c" />
      <FlowerPatch x={6.2} y={6.45} />
      <Hydrant x={9.7} y={5.85} />
      <Tree x={8.4} y={6.25} s={0.75} />
    </g>
  );
}

// 3 — Culver City: office plaza at a cross intersection, lobby glass and all.
function CulverScene({ loc }: { loc: LocationDef }) {
  return (
    <g>
      <Box x={0.8} y={1.2} w={1.8} d={1.6} h={72} top="#b9c4c9" right="#9aa7ad" front="#aab6bc">
        <Windows x={0.8} y={1.2} w={1.8} d={1.6} h={72} cols={4} rows={4} />
      </Box>
      <StorefrontGlass a={[0.8, 2.8]} b={[2.6, 2.8]} h={18} door={0.42} />
      <RoofUnits x={1.6} y={1.8} h={74} />
      <Box x={6.3} y={1.4} w={1.7} d={1.4} h={54} top="#c4beb0" right="#a8a094" front="#b5ab9c">
        <Windows x={6.3} y={1.4} w={1.7} d={1.4} h={54} cols={4} rows={3} />
      </Box>
      <RoofUnits x={7.0} y={2.0} h={56} />
      <Box x={8.7} y={1.8} w={1.3} d={1.1} h={40} top={loc.sceneColors.accent} right="#8fa3ae" front="#9fb2bc" />
      <StorefrontGlass a={[8.7, 2.9]} b={[10.0, 2.9]} h={16} door={0.7} />
      <Tree x={3.1} y={3.1} s={0.85} />
      <Palm x={5.5} y={3.3} s={0.8} />
      <CrossRoads />
      <Bench x={1.9} y={6.55} />
      <Planter x={1.2} y={6.7} />
      <Planter x={7.4} y={6.7} />
      <Hydrant x={6.1} y={6.5} />
      <Bike x={8.9} y={6.55} color="#3f97d9" />
      <Bike x={9.5} y={6.7} color="#43a047" />
    </g>
  );
}

// 4 — Studio City: soundstage, water tower, lot wall, gear on the curb.
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
      <RoofUnits x={1.1} y={1.5} h={90} />
      <Spotlight x={0.7} y={3.35} />
      <Spotlight x={3.75} y={3.35} flip />
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
      <AFrame x={4.6} y={6.45} accent="#f2c53d" />
      <Bench x={2.4} y={6.5} />
      <Palm x={0.5} y={6.4} s={0.9} />
      <Palm x={9.7} y={6.35} s={0.85} />
      <Bin x={7.2} y={6.4} color={loc.sceneColors.accent} />
      <FlowerPatch x={8.3} y={6.45} />
    </g>
  );
}

// 5 — Venice: ocean, sand, boardwalk — umbrellas, boards, and gulls.
function VeniceScene({ loc }: { loc: LocationDef }) {
  const board = iso(6.3, 3.35);
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
      {/* beach setups: towels, umbrellas, a cooler */}
      <polygon points={poly([iso(1.8, 2.2), iso(2.5, 2.2), iso(2.5, 2.55), iso(1.8, 2.55)])} fill="#e05a7a" stroke={INK} strokeWidth="1" />
      <polygon points={poly([iso(6.9, 1.7), iso(7.6, 1.7), iso(7.6, 2.05), iso(6.9, 2.05)])} fill="#3f97d9" stroke={INK} strokeWidth="1" />
      <polygon points={poly([iso(3.9, 1.6), iso(4.6, 1.6), iso(4.6, 1.95), iso(3.9, 1.95)])} fill="#f2c53d" stroke={INK} strokeWidth="1" />
      {(() => {
        const [cx, cy] = iso(2.6, 2.05);
        return (
          <g shapeRendering="crispEdges">
            <rect x={cx - 4} y={cy - 7} width="8" height="7" fill="#d94436" />
            <rect x={cx - 4} y={cy - 7} width="8" height="2" fill="#fdfaf2" />
          </g>
        );
      })()}
      {(() => {
        const [ux, uy] = iso(2.15, 2.4);
        const [vx, vy] = iso(7.25, 1.9);
        return (
          <g shapeRendering="crispEdges">
            <rect x={ux - 1.2} y={uy - 24} width="2.4" height="24" fill="#8a6f4d" />
            <rect x={ux - 12} y={uy - 30} width="24" height="5" fill="#e05a7a" />
            <rect x={ux - 16} y={uy - 25} width="32" height="5" fill="#fdfaf2" />
            <rect x={vx - 1.2} y={vy - 22} width="2.4" height="22" fill="#8a6f4d" />
            <rect x={vx - 11} y={vy - 28} width="22" height="5" fill="#3f97d9" />
            <rect x={vx - 15} y={vy - 23} width="30" height="5" fill="#fdfaf2" />
          </g>
        );
      })()}
      {/* a surfboard stuck in the sand */}
      <g shapeRendering="crispEdges">
        <rect x={board[0] - 3.4} y={board[1] - 26} width="6.8" height="24" fill="#2f9ea8" />
        <rect x={board[0] - 1.4} y={board[1] - 29} width="2.8" height="4" fill="#2f9ea8" />
        <rect x={board[0] - 1.2} y={board[1] - 24} width="2.4" height="20" fill="#f0ede4" />
      </g>
      <Seagull x={iso(1.2, 1.3)[0]} y={iso(1.2, 1.3)[1] - 40} />
      <Seagull x={iso(8.6, 0.9)[0]} y={iso(8.6, 0.9)[1] - 52} flip />
      <Seagull x={iso(5.1, 2.6)[0]} y={iso(5.1, 2.6)[1] - 4} />
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
      <Bike x={9.9} y={5.5} color="#f2c53d" />
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
      <Seagull x={iso(6.4, 0.4)[0]} y={iso(6.4, 0.4)[1] - 46} />
      <Seagull x={iso(1.3, 0.2)[0]} y={iso(1.3, 0.2)[1] - 38} flip />
      <polygon points={poly([iso(-2, 1.4), iso(12, 1.4), iso(12, 2.4), iso(-2, 2.4)])} fill="#efd68f" stroke="none" />
      {(() => {
        const [ux, uy] = iso(10.3, 2.0);
        return (
          <g shapeRendering="crispEdges">
            <rect x={ux - 1.2} y={uy - 22} width="2.4" height="22" fill="#8a6f4d" />
            <rect x={ux - 11} y={uy - 28} width="22" height="5" fill="#f2c53d" />
            <rect x={ux - 15} y={uy - 23} width="30" height="5" fill="#fdfaf2" />
          </g>
        );
      })()}
      {/* storefront row */}
      <Box x={0.6} y={2.5} w={1.8} d={1.2} h={40} top="#f0e9da" right="#e6dfd0" front="#efe8da">
        <Awning a={[0.6, 3.7]} b={[2.4, 3.7]} top={28} drop={8} color="#e05a7a" />
      </Box>
      <StorefrontGlass a={[0.6, 3.7]} b={[2.4, 3.7]} h={19} door={0.7} />
      <Box x={2.9} y={2.6} w={1.5} d={1.1} h={34} top="#e8ddc8" right="#e0d5c0" front="#e8ddc8">
        <Awning a={[2.9, 3.7]} b={[4.4, 3.7]} top={24} drop={8} color={loc.sceneColors.accent} />
      </Box>
      <StorefrontGlass a={[2.9, 3.7]} b={[4.4, 3.7]} h={17} door={0.25} />
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
      {posts.slice(0, -1).map((p, i) => (
        <StringLights key={`s${i}`} a={p} b={posts[i + 1]} lift={36} dip={12} />
      ))}
      <Bench x={3.6} y={4.95} />
      <Planter x={5.4} y={5.0} />
      <Planter x={8.8} y={5.0} />
      <Bin x={1.2} y={5.0} color="#6e9a7c" />
      <FlowerPatch x={10.6} y={5.0} />
    </g>
  );
}

// 7 — Calabasas: gated community — fountain, topiary, and a very white wall.
function CalabasasScene({ loc }: { loc: LocationDef }) {
  const g1 = iso(4.75, 3.95);
  const g2 = iso(6.05, 3.95);
  return (
    <g>
      <House x={6.6} y={0.9} w={2.4} d={1.7} h={46} rh={22} wall="#f5f0e4" roof={loc.sceneColors.accent} />
      <House x={0.9} y={1.1} w={2.0} d={1.5} h={40} rh={19} wall="#f5f0e4" roof="#b8926a" />
      <Fountain x={5.4} y={2.75} s={1.1} />
      <Tree x={9.4} y={2.6} />
      <Tree x={3.6} y={2.5} s={0.85} />
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
      <Topiary x={4.2} y={4.25} />
      <Topiary x={6.6} y={4.25} />
      <Hedge x={-1.4} y={4.15} w={3.2} />
      <Hedge x={7.0} y={4.15} w={3.4} />
      <FlowerPatch x={1.9} y={4.32} />
      <FlowerPatch x={8.9} y={4.32} />
      <RoadX y0={4.5} y1={5.9} dashY={5.2} />
      <SUV x={7.6} y={5.05} color="#3a3733" />
      <SUV x={9.8} y={5.25} color="#f0e9da" />
      <SportsCar x={1.6} y={5.1} color="#fdfaf2" />
      <SidewalkX y0={5.9} y1={6.9} />
      <Hydrant x={0.5} y={6.15} />
      <FlowerPatch x={9.4} y={6.7} />
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
      <StorefrontGlass a={[1.0, 3.3]} b={[5.4, 3.3]} h={22} door={0.44} />
      <RoofUnits x={2.0} y={2.2} h={56} />
      <RoofUnits x={4.4} y={2.4} h={56} />
      <Palm x={7.2} y={2.4} />
      <Palm x={8.6} y={2.8} s={0.85} />
      <Planter x={9.8} y={3.4} />
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
      <ShoppingCart x={4.4} y={5.0} />
      {/* lot drive lane */}
      <polygon points={poly([iso(-2, 5.4), iso(12, 5.4), iso(12, 6.6), iso(-2, 6.6)])} fill={ASPHALT_D} stroke="none" />
      <ShoppingCart x={11.1} y={6.0} />
      <SidewalkX y0={6.6} y1={7.5} />
      <Hydrant x={0.4} y={6.85} />
      <FlowerPatch x={3.3} y={7.35} />
      <Bin x={8.9} y={7.2} color="#6e9a7c" />
    </g>
  );
}

// 9 — Beverly Hills: boutique row, palm median, gold accents everywhere.
function BeverlyhillsScene({ loc }: { loc: LocationDef }) {
  const shops = [
    { x: 0.5, w: 1.7, awn: '#e05a7a' },
    { x: 2.5, w: 1.5, awn: loc.sceneColors.accent },
    { x: 6.4, w: 1.7, awn: '#3f97d9' },
    { x: 8.4, w: 1.5, awn: '#f2c53d' },
  ];
  return (
    <g>
      {shops.map((b, i) => (
        <Box key={i} x={b.x} y={1.7} w={b.w} d={1.4} h={48} top="#f5f0e4" right="#efe8da" front="#f7f2e8">
          <Awning a={[b.x, 3.1]} b={[b.x + b.w, 3.1]} top={34} drop={9} color={b.awn} />
          {/* column fronts */}
          {[0.2, b.w - 0.2].map((dx, j) => {
            const [cx, cy] = iso(b.x + dx, 3.1);
            return <line key={j} x1={cx} y1={cy - 2} x2={cx} y2={cy - 30} stroke={INK} strokeWidth="2.4" />;
          })}
        </Box>
      ))}
      {shops.map((b, i) => (
        <StorefrontGlass key={`g${i}`} a={[b.x + 0.15, 3.1]} b={[b.x + b.w - 0.15, 3.1]} h={18} door={i % 2 ? 0.24 : 0.68} />
      ))}
      {shops.map((b, i) => (
        <Topiary key={`t${i}`} x={b.x + b.w / 2} y={3.7} />
      ))}
      <CrossRoads />
      {/* palm median in the main road */}
      <polygon points={poly([iso(-2, 4.92), iso(4.2, 4.92), iso(4.2, 5.08), iso(-2, 5.08)])} fill={CONCRETE} stroke={INK} strokeWidth="1" />
      <polygon points={poly([iso(5.8, 4.92), iso(12, 4.92), iso(12, 5.08), iso(5.8, 5.08)])} fill={CONCRETE} stroke={INK} strokeWidth="1" />
      <Palm x={0.6} y={5.0} s={0.7} />
      <Palm x={2.8} y={5.0} s={0.7} />
      <Palm x={7.2} y={5.0} s={0.7} />
      <Palm x={9.4} y={5.0} s={0.7} />
      <SportsCar x={8.6} y={4.55} color="#d94436" />
      <Fountain x={9.6} y={6.6} s={0.95} />
      <Planter x={1.5} y={6.7} />
      <Planter x={8.2} y={6.7} />
      <FlowerPatch x={0.5} y={6.5} />
      <FlowerPatch x={6.4} y={6.5} />
    </g>
  );
}

// 10 — The Palisades: village green with a curved path, bluffs + ocean sliver.
function PalisadesScene({ loc }: { loc: LocationDef }) {
  const kite = iso(9.2, 0.6);
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
      <Seagull x={iso(2.4, -0.9)[0]} y={iso(2.4, -0.9)[1] - 30} />
      {/* somebody's kite over the bluffs */}
      <g shapeRendering="crispEdges">
        <rect x={kite[0] - 4} y={kite[1] - 78} width="8" height="8" fill="#e05a7a" transform={`rotate(45 ${kite[0]} ${kite[1] - 74})`} shapeRendering="auto" />
        <path d={`M${kite[0]} ${kite[1] - 70} q 6 14 -2 30`} fill="none" stroke={INK} strokeWidth="0.9" opacity="0.5" />
      </g>
      {/* village storefronts */}
      <Box x={0.7} y={1.6} w={1.8} d={1.3} h={38} top="#f5f0e4" right="#efe8da" front="#f7f2e8">
        <Awning a={[0.7, 2.9]} b={[2.5, 2.9]} top={26} drop={8} color="#57a84e" />
      </Box>
      <StorefrontGlass a={[0.7, 2.9]} b={[2.5, 2.9]} h={17} door={0.7} />
      <Box x={7.2} y={1.5} w={1.9} d={1.3} h={42} top="#f5f0e4" right="#efe8da" front="#f7f2e8">
        <Awning a={[7.2, 2.8]} b={[9.1, 2.8]} top={28} drop={8} color={loc.sceneColors.accent} />
      </Box>
      <StorefrontGlass a={[7.2, 2.8]} b={[9.1, 2.8]} h={18} door={0.28} />
      <Tree x={4.6} y={2.4} />
      <AFrame x={2.9} y={3.85} accent="#57a84e" />
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
      <StringLights a={[1.6, 5.2]} b={[4.6, 5.35]} lift={30} dip={10} />
      <StringLights a={[4.6, 5.35]} b={[7.6, 5.0]} lift={30} dip={10} />
      <Bench x={4.5} y={5.35} />
      <FlowerPatch x={0.5} y={5.4} />
      <FlowerPatch x={6.5} y={5.7} />
      <FlowerPatch x={9.8} y={6.7} />
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
