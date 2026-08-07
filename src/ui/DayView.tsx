import { useEffect, useRef } from 'react';
import type { SimState, GameState } from '../game/types';
import { sfx } from '../game/audio';
import { LOCATION_BY_ID } from '../game/content/locations';
import IsoScene, { Cart, iso } from './scene/IsoScene';
import { LAYOUTS, walkPoint, queueSpot, pointAlongPolyline, EXIT_X, QUEUE_JOIN_X } from './scene/layouts';
import Person from './scene/Person';

// Stable per-person quirks so the crowd doesn't march in a file:
// a lateral drift off the path, a loose queue stance, and some window-shoppers
// strolling the other direction entirely.
function quirks(id: number) {
  const h = (Math.imul(id, 2654435761) >>> 0);
  return {
    drift: ((h & 0xff) / 255 - 0.5) * 0.55,          // buyers stay near the path
    wander: (((h >> 4) & 0xff) / 255 - 0.5) * 0.7,   // browsers drift off their route
    sway: (((h >> 8) & 0xff) / 255 - 0.5) * 0.2,     // loose queue stance
    reversed: ((h >> 16) & 1) === 0,                  // half stroll right-to-left
    fromRight: ((h >> 18) & 1) === 1,                 // half the buyers approach from the right
    route: (h >> 20) & 7,                             // which wander route they take
  };
}

export default function DayView({
  state,
  sim,
  speed,
  onSpeed,
  onSkip,
}: {
  state: GameState;
  sim: SimState;
  speed: 1 | 2;
  onSpeed: (s: 1 | 2) => void;
  onSkip: () => void;
}) {
  const loc = LOCATION_BY_ID[state.locationId];
  const layout = LAYOUTS[state.locationId] ?? LAYOUTS.silverlake;
  // movement transition matches the real tick rate, so walking is one
  // continuous glide — and the ▶▶ button visibly speeds people up
  const tickSec = 1.5 / speed;

  // Legs only move when the body actually moves: track last positions and
  // compare per render, so nobody moonwalks in place.
  const lastPos = useRef(new Map<number, [number, number]>());

  // Fire sounds by diffing the sim's counters — staggered inside the tick
  // window so reactions land at individual moments, not on the heartbeat.
  const prev = useRef({ sold: 0, happy: 0, taste: 0, price: 0, wait: 0, blending: 0 });
  useEffect(() => {
    const p = prev.current;
    const jitter = (fn: () => void) => setTimeout(fn, Math.random() * 900);
    for (let i = 0; i < Math.min(sim.cupsSold - p.sold, 3); i++) jitter(() => sfx('sale'));
    if (sim.happy > p.happy) jitter(() => sfx('happy'));
    if (sim.complaints.taste > p.taste) jitter(() => sfx('taste'));
    if (sim.complaints.price > p.price) jitter(() => sfx('price'));
    if (sim.complaints.wait > p.wait) jitter(() => sfx('wait'));
    if (sim.blendTicksLeft > p.blending) sfx('blend');
    prev.current = {
      sold: sim.cupsSold,
      happy: sim.happy,
      taste: sim.complaints.taste,
      price: sim.complaints.price,
      wait: sim.complaints.wait,
      blending: sim.blendTicksLeft,
    };
  });

  return (
    <div className="scene">
      <IsoScene loc={loc} weatherId={state.daily?.weatherId}>
        {/* everything in the people layer is depth-sorted by screen y so the
            cart correctly occludes people behind it (and vice versa) */}
        {(() => {
          const cartPos = iso(layout.cart[0], layout.cart[1]);
          const items: { key: string; depth: number; el: React.ReactNode }[] = [
            {
              key: 'cart',
              depth: cartPos[1],
              el: <Cart x={layout.cart[0]} y={layout.cart[1]} />,
            },
          ];
          if (state.settings?.rival && state.daily?.rivalLocationId === state.locationId) {
            const rivalPos = iso(layout.cart[0] + 2.4, layout.cart[1]);
            items.push({
              key: 'rival',
              depth: rivalPos[1],
              el: <Cart x={layout.cart[0] + 2.4} y={layout.cart[1]} rival />,
            });
          }

          // queue: a loose two-abreast cluster by the cart
          sim.queue.forEach((id, qi) => {
            const c = sim.customers.find((k) => k.id === id);
            if (!c) return;
            const q = quirks(c.id);
            const [gx, gy] = queueSpot(layout, Math.min(qi, 11));
            const [px, py] = iso(gx + q.sway * 0.4, gy + q.sway);
            items.push({
              key: `p${c.id}`,
              depth: py,
              el: (
                <Person
                  variant={c.id}
                  walking={false}
                  bubble={c.bubble}
                  x={px}
                  y={py}
                  moveSeconds={0.45 / speed}
                />
              ),
            });
          });

          // walkers: buyers head down the main path; browsers spread across
          // every route in the scene so it reads like a busy square
          const routes = [layout.path, ...(layout.ambient ?? [])];
          for (const c of sim.customers) {
            if (c.state === 'queued') continue;
            const q = quirks(c.id);
            const strolling = !c.willBuy && q.reversed;
            const progress = strolling ? Math.max(0, EXIT_X - c.x) : c.x;
            let gx: number, gy: number;
            if (c.willBuy) {
              // half the buyers come from the right side, walking left to the cart
              let p2 = progress;
              if (q.fromRight) {
                p2 =
                  c.x <= QUEUE_JOIN_X
                    ? EXIT_X - (c.x / QUEUE_JOIN_X) * (EXIT_X - QUEUE_JOIN_X)
                    : QUEUE_JOIN_X * (1 - (c.x - QUEUE_JOIN_X) / (EXIT_X - QUEUE_JOIN_X));
              }
              [gx, gy] = walkPoint(layout, p2);
              gx += q.drift * 0.3;
              gy += q.drift;
            } else {
              const route = routes[q.route % routes.length];
              [gx, gy] = pointAlongPolyline(route, progress / EXIT_X);
              gx += q.wander * 0.3;
              gy += q.wander;
            }
            const [px, py] = iso(gx, gy);
            const was = lastPos.current.get(c.id);
            const moving = !was || Math.hypot(px - was[0], py - was[1]) > 0.5;
            lastPos.current.set(c.id, [px, py]);
            items.push({
              key: `p${c.id}`,
              depth: py,
              el: (
                <Person
                  variant={c.id}
                  walking={moving}
                  bubble={c.bubble}
                  x={px}
                  y={py}
                  moveSeconds={tickSec}
                />
              ),
            });
          }

          return items
            .sort((a, b) => a.depth - b.depth)
            .map((i) => <g key={i.key}>{i.el}</g>);
        })()}
      </IsoScene>

      {sim.soldOut && (
        <div className="scene-flag" style={{ background: 'var(--alert)', color: 'var(--cream)' }}>
          SOLD OUT
        </div>
      )}

      <div className="sim-controls">
        <button
          className={`pixel-btn ${speed === 2 ? 'primary' : ''}`}
          style={{ padding: '4px 10px' }}
          onClick={() => onSpeed(speed === 1 ? 2 : 1)}
        >
          ▶▶
        </button>
        <button className="pixel-btn" style={{ padding: '4px 10px' }} onClick={onSkip}>
          SKIP
        </button>
      </div>

      <div className="scene-counter">
        sold {sim.cupsSold} · line {sim.queue.length}
        {sim.shelfSold > 0 ? ` · shelf ${sim.shelfSold}` : ''}
      </div>
    </div>
  );
}
