import { useEffect, useRef, useState } from 'react';
import type { SimState, GameState } from '../game/types';
import { C, calendar, computeMods } from '../game/economy';
import { sfx } from '../game/audio';
import { cardFor } from '../game/content/archetypes';
import { SIGNS, signFor, readingFor } from '../game/content/astrology';
import { LOCATION_BY_ID } from '../game/content/locations';
import IsoScene, { Cart, iso } from './scene/IsoScene';
import {
  LAYOUTS, walkPoint, queueSpot, pointAlongPolyline, avoidObstacles, EXIT_X, QUEUE_JOIN_X,
} from './scene/layouts';
import Person, { outfitIndexFor, outfitAccent } from './scene/Person';

// Stable per-person quirks so the crowd doesn't march in a file:
// a lateral drift off the path, a loose queue stance, and some window-shoppers
// strolling the other direction entirely.
function quirks(id: number) {
  const h = (Math.imul(id, 2654435761) >>> 0);
  return {
    drift: ((h & 0xff) / 255 - 0.5) * 0.55,          // buyers stay near the path
    wander: (((h >> 4) & 0xff) / 255 - 0.5) * 1.05,  // browsers drift well off their route
    sway: (((h >> 8) & 0xff) / 255 - 0.5) * 0.2,     // loose queue stance
    reversed: ((h >> 16) & 1) === 0,                  // half stroll right-to-left
    fromRight: ((h >> 18) & 1) === 1,                 // half the buyers approach from the right
    route: (h >> 20) & 7,                             // which wander route they take
    side: (((h >> 12) & 1) === 0 ? 1 : -1) as 1 | -1, // which edge they round obstacles on
  };
}

// One person's movement segment: from → to over dur ms starting at t0.
// Walkers keep extrapolating past the end so a late sim tick reads as a
// longer stride, never a freeze; queue shuffles ease out and stop.
interface Anim {
  fx: number;
  fy: number;
  tx: number;
  ty: number;
  t0: number;
  dur: number;
  mode: 'walk' | 'queue';
}

function samplePos(a: Anim, now: number): [number, number] {
  const raw = a.dur <= 0 ? 1 : (now - a.t0) / a.dur;
  const k =
    a.mode === 'queue'
      ? 1 - (1 - Math.min(1, Math.max(0, raw))) ** 2 // ease-out shuffle
      : Math.min(1.35, Math.max(0, raw)); // linear glide, tolerant of timer jitter
  return [a.fx + (a.tx - a.fx) * k, a.fy + (a.ty - a.fy) * k];
}

const CARD_W = 224;
const CARD_H = 264;

// What this person is going through right now, per the sim's actual state.
function moodOf(c: {
  bubble: string | null;
  state: string;
  willBuy: boolean;
  patienceLeft: number;
}): string {
  if (c.bubble === 'price') return 'personally offended by the price';
  if (c.bubble === 'wait') return 'done waiting, telling everyone';
  if (c.bubble === 'taste') return 'betrayed by the recipe';
  if (c.bubble === 'happy') return 'genuinely glowing';
  if (c.state === 'queued') return c.patienceLeft > 6 ? 'waiting, serenely' : 'waiting, barely';
  if (c.state === 'served') return 'sipping and thriving';
  if (c.state === 'leaving' && !c.willBuy) return 'just here for the vibes';
  return c.willBuy ? 'craving a smoothie' : 'window shopping';
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
  const tickMs = C.MS_PER_TICK / speed;

  // Legs only move when the body actually moves: track last targets and
  // compare per render, so nobody moonwalks in place.
  const lastPos = useRef(new Map<number, [number, number]>());

  // rAF-driven movement: React only sets the *targets* once per sim tick;
  // a frame loop glides every sprite between targets so walking is one
  // continuous motion no matter how the timers land.
  const nodes = useRef(new Map<number, SVGGElement>());
  const anims = useRef(new Map<number, Anim>());
  const targets = useRef(new Map<number, { x: number; y: number; queued: boolean }>());

  // Hover card: pause the person and read their whole deal.
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<{ id: number; x: number; y: number; w: number; h: number } | null>(null);
  useEffect(() => {
    if (hover && !sim.customers.some((c) => c.id === hover.id)) {
      setHover(null);
      sim.pausedId = null;
    }
  });

  // Retarget every sim tick (after commit, so mount order never matters).
  useEffect(() => {
    const now = performance.now();
    for (const [id, t] of targets.current) {
      if (id === sim.pausedId) continue; // frozen in their tracks until unhover
      const a = anims.current.get(id);
      if (!a) {
        anims.current.set(id, { fx: t.x, fy: t.y, tx: t.x, ty: t.y, t0: now, dur: tickMs, mode: 'walk' });
      } else {
        const [cx, cy] = samplePos(a, now);
        a.fx = cx;
        a.fy = cy;
        a.tx = t.x;
        a.ty = t.y;
        a.t0 = now;
        a.mode = t.queued ? 'queue' : 'walk';
        a.dur = t.queued ? 420 / speed : tickMs;
      }
    }
    for (const id of [...anims.current.keys()]) {
      if (!targets.current.has(id)) anims.current.delete(id);
    }
  });

  useEffect(() => {
    let raf = 0;
    const frame = () => {
      const now = performance.now();
      for (const [id, node] of nodes.current) {
        const a = anims.current.get(id);
        if (!a) continue;
        const [x, y] = samplePos(a, now);
        node.style.transform = `translate(${x}px, ${y}px)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

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

  const hoverEnter = (id: number) => (e: React.MouseEvent) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({ id, x: e.clientX - rect.left, y: e.clientY - rect.top, w: rect.width, h: rect.height });
    sim.pausedId = id;
    // stop them in their tracks THIS frame, not at the end of their stride
    const a = anims.current.get(id);
    if (a) {
      const now = performance.now();
      const [cx, cy] = samplePos(a, now);
      a.fx = a.tx = cx;
      a.fy = a.ty = cy;
      a.t0 = now;
    }
  };
  const hoverLeave = (id: number) => () => {
    setHover((h) => (h?.id === id ? null : h));
    if (sim.pausedId === id) sim.pausedId = null;
    // and off they go again — resume the glide toward their current target
    const a = anims.current.get(id);
    const t = targets.current.get(id);
    if (a && t) {
      a.tx = t.x;
      a.ty = t.y;
      a.t0 = performance.now();
      a.dur = tickMs;
    }
  };

  return (
    <div className="scene" ref={sceneRef}>
      <IsoScene loc={loc} weatherId={state.daily?.weatherId}>
        {/* People render in STABLE id order (so DOM nodes never churn) —
            split only into behind/in-front of the cart, the one occlusion
            that matters. Position comes from the rAF loop via refs. */}
        {(() => {
          const cartDepth = iso(layout.cart[0], layout.cart[1])[1];
          const routes = [layout.path, ...(layout.ambient ?? [])];

          // Pass 1: raw targets (with street furniture avoidance in grid space)
          const entries: { c: (typeof sim.customers)[number]; px: number; py: number; queued: boolean }[] = [];
          for (const c of sim.customers) {
            const q = quirks(c.id);
            const queued = c.state === 'queued';
            let px: number, py: number;

            if (queued) {
              const qi = sim.queue.indexOf(c.id);
              const [gx, gy] = queueSpot(layout, Math.min(Math.max(qi, 0), C.BALK_LINE - 1));
              [px, py] = iso(gx + q.sway * 0.4, gy + q.sway);
            } else {
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
              [gx, gy] = avoidObstacles(state.locationId, gx, gy, q.side);
              [px, py] = iso(gx, gy);
            }
            entries.push({ c, px, py, queued });
          }

          // Pass 2: personal space — nudge overlapping walkers apart, gently.
          // Queued and inspected people hold their ground; walkers flow around.
          // Pushes are damped and CAPPED so a dense clump never teleports anyone.
          const sx = new Array(entries.length).fill(0);
          const sy = new Array(entries.length).fill(0);
          for (let i = 0; i < entries.length; i++) {
            for (let j = i + 1; j < entries.length; j++) {
              const a = entries[i];
              const b = entries[j];
              const aFixed = a.queued || a.c.id === sim.pausedId;
              const bFixed = b.queued || b.c.id === sim.pausedId;
              if (aFixed && bFixed) continue;
              let dx = b.px - a.px;
              let dy = (b.py - a.py) * 1.9; // iso foreshortening: y gaps read half as wide
              let d = Math.hypot(dx, dy);
              if (d >= 13) continue;
              if (d < 0.01) {
                dx = i % 2 ? 1 : -1;
                dy = 0.5;
                d = 1;
              }
              const push = ((13 - d) / d) * 0.7;
              const ux = dx * push;
              const uy = (dy * push) / 1.9;
              if (aFixed) {
                sx[j] += ux;
                sy[j] += uy;
              } else if (bFixed) {
                sx[i] -= ux;
                sy[i] -= uy;
              } else {
                sx[i] -= ux / 2;
                sy[i] -= uy / 2;
                sx[j] += ux / 2;
                sy[j] += uy / 2;
              }
            }
          }
          const clamp7 = (v: number) => Math.max(-7, Math.min(7, v));
          for (let i = 0; i < entries.length; i++) {
            if (entries[i].queued || entries[i].c.id === sim.pausedId) continue;
            entries[i].px += clamp7(sx[i]);
            entries[i].py += clamp7(sy[i]);
          }

          // Pass 3: build stable-order elements and hand targets to the animator.
          const behind: React.ReactNode[] = [];
          const front: React.ReactNode[] = [];
          const seen = new Set<number>();
          for (const { c, px, py, queued } of entries) {
            let walking = !queued;
            if (!queued) {
              const was = lastPos.current.get(c.id);
              walking = !was || Math.hypot(px - was[0], py - was[1]) > 0.5;
            }
            if (c.id === sim.pausedId) walking = false;
            lastPos.current.set(c.id, [px, py]);
            targets.current.set(c.id, { x: px, y: py, queued });
            seen.add(c.id);

            const el = (
              <g
                key={`p${c.id}`}
                className="person-in"
                ref={(node) => {
                  if (node) nodes.current.set(c.id, node);
                  else nodes.current.delete(c.id);
                }}
                style={{
                  transform: `translate(${px}px, ${py}px)`,
                  cursor: 'pointer',
                  // while a card is open, passers-by can't steal the cursor
                  pointerEvents: hover && hover.id !== c.id ? 'none' : undefined,
                }}
                onMouseEnter={hoverEnter(c.id)}
                onMouseLeave={hoverLeave(c.id)}
              >
                {/* generous invisible hit target — sprites are small */}
                <rect x="-10" y="-44" width="20" height="48" fill="transparent" />
                <Person
                  variant={c.id}
                  walking={walking}
                  bubble={c.bubble}
                  x={0}
                  y={0}
                  moveSeconds={0}
                  locId={state.locationId}
                />
              </g>
            );
            (py < cartDepth ? behind : front).push(el);
          }

          // forget departed customers
          for (const id of [...targets.current.keys()]) {
            if (!seen.has(id)) {
              targets.current.delete(id);
              lastPos.current.delete(id);
            }
          }

          return (
            <>
              {behind}
              <Cart x={layout.cart[0]} y={layout.cart[1]} stage={computeMods(state).standTier} />
              {state.settings?.rival &&
                state.daily?.rivalLocationId === state.locationId && (
                  <Cart x={layout.cart[0] + 2.4} y={layout.cart[1]} rival />
                )}
              {front}
            </>
          );
        })()}
      </IsoScene>

      {/* the trading card: who this person is as a person */}
      {hover &&
        (() => {
          const c = sim.customers.find((k) => k.id === hover.id);
          if (!c) return null;
          const oi = outfitIndexFor(c.id, state.locationId);
          const card = cardFor(oi, c.id);
          const cal = calendar(state.day);
          const sign = signFor(c.id);
          const reading = readingFor(sign, cal.month, cal.dayOfMonth, state.day);
          const left = Math.max(8, Math.min(hover.x + 16, hover.w - CARD_W - 8));
          const top = Math.max(8, Math.min(hover.y - 30, hover.h - CARD_H - 8));
          return (
            <div className="person-card" style={{ left, top }}>
              <div className="pc-head" style={{ background: outfitAccent(oi) }}>
                <span>{card.name}</span>
                <span className="pc-aura">AURA {card.aura}</span>
              </div>
              <div className="pc-body">
                <svg viewBox="-14 -48 28 54" width="42" height="81" aria-hidden>
                  <Person variant={c.id} walking={false} bubble={null} x={0} y={0} moveSeconds={0} locId={state.locationId} />
                </svg>
                <div>
                  <div className="pc-title">{card.title}</div>
                  <div className="pc-types">{card.types}</div>
                </div>
              </div>
              <div className="pc-moves">
                {card.moves.map((m) => (
                  <div key={m}>- {m}</div>
                ))}
              </div>
              <div className="pc-mood">mood: {moodOf(c)}</div>
              <div className="pc-weak">weakness: {card.weakness}</div>
              <div className="pc-astro">
                <span className="pc-sign">{SIGNS[sign]}</span> {reading}
              </div>
              <div className="pc-quote">"{card.quote}"</div>
            </div>
          );
        })()}

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
