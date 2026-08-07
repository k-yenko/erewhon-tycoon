import type { SimState, GameState } from '../game/types';
import { LOCATION_BY_ID } from '../game/content/locations';
import IsoScene, { Cart, iso } from './scene/IsoScene';
import { LAYOUTS, walkPoint, queueSpot, EXIT_X } from './scene/layouts';
import Person from './scene/Person';

// Stable per-person quirks so the crowd doesn't march in a file:
// a lateral drift off the path, a loose queue stance, and some window-shoppers
// strolling the other direction entirely.
function quirks(id: number) {
  const h = (Math.imul(id, 2654435761) >>> 0);
  return {
    drift: ((h & 0xff) / 255 - 0.5) * 0.55,          // sideways offset in tiles
    sway: (((h >> 8) & 0xff) / 255 - 0.5) * 0.2,     // loose queue stance
    reversed: ((h >> 16) & 3) === 0,                  // some stroll right-to-left
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
  return (
    <div className="scene">
      <IsoScene loc={loc} weatherId={state.daily?.weatherId}>
        <Cart x={layout.cart[0]} y={layout.cart[1]} />

        {/* queue: a loose line stacking along the layout's queue direction */}
        {sim.queue.map((id, qi) => {
          const c = sim.customers.find((k) => k.id === id);
          if (!c) return null;
          const q = quirks(c.id);
          // long lines bunch up at the back instead of walking off-scene
          const [gx, gy] = queueSpot(layout, Math.min(qi, 7) + Math.min(Math.max(qi - 7, 0), 3) * 0.25);
          const [px, py] = iso(gx + q.sway * 0.4, gy + q.sway);
          return (
            <Person key={c.id} variant={c.id} walking={false} bubble={c.bubble} x={px} y={py} />
          );
        })}

        {/* walkers and leavers wander near the path, not on a rail */}
        {sim.customers
          .filter((c) => c.state !== 'queued')
          .map((c) => {
            const q = quirks(c.id);
            // window-shoppers who never buy sometimes stroll the other way
            const strolling = !c.willBuy && q.reversed;
            const progress = strolling ? Math.max(0, EXIT_X - c.x) : c.x;
            const [gx, gy] = walkPoint(layout, progress);
            const [px, py] = iso(gx, gy + q.drift);
            return (
              <Person key={c.id} variant={c.id} walking={true} bubble={c.bubble} x={px} y={py} />
            );
          })}
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
