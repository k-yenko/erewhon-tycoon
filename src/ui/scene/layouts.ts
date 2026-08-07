// Per-location movement layout: where the cart sits, the walk polyline,
// and how the queue stacks. Drives both rendering and people movement so
// scene changes and gameplay stay in sync.

export type GridPt = [number, number];

export interface SceneLayout {
  cart: GridPt;
  path: GridPt[];      // spawn → … → exit, in grid coords
  queueIndex: number;  // vertex where sim's queue-join point (x=0.45) lands
  queueStep: GridPt;   // queue grows from path[queueIndex] along this delta
}

export const LAYOUTS: Record<string, SceneLayout> = {
  driveway: {
    cart: [6.0, 7.2], // on the actual driveway
    path: [[-1.5, 6.15], [5.3, 6.15], [11.5, 6.15]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
  },
  silverlake: {
    cart: [3.8, 6.35],
    path: [[-1.5, 6.15], [3.2, 6.15], [11.5, 6.15]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
  },
  culver: {
    cart: [3.78, 6.35],
    path: [[-1.5, 6.35], [3.0, 6.35], [11.5, 6.35]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
  },
  studio: {
    cart: [4.25, 6.35],
    path: [[-1.5, 6.15], [3.55, 6.15], [11.5, 6.15]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
  },
  venice: {
    cart: [3.85, 6.35], // on the boardwalk
    path: [[-1.5, 6.1], [3.1, 6.1], [11.5, 6.1]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
  },
  santamonica: {
    cart: [3.95, 6.35],
    path: [[-1.5, 6.35], [1.4, 5.7], [3.2, 6.1], [11.5, 6.1]],
    queueIndex: 2,
    queueStep: [-0.55, 0],
  },
  calabasas: {
    cart: [3.6, 6.65], // just outside the gate
    path: [[-1.5, 6.45], [2.9, 6.45], [11.5, 6.45]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
  },
  beverlygrove: {
    cart: [3.8, 7.15], // at the parking-lot sidewalk edge
    path: [[-1.5, 7.05], [3.1, 7.05], [11.5, 7.05]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
  },
  beverlyhills: {
    cart: [3.78, 6.35],
    path: [[-1.5, 6.35], [3.0, 6.35], [11.5, 6.35]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
  },
  palisades: {
    cart: [3.95, 7.0], // on the village green's edge
    path: [[-1.5, 5.7], [1.2, 6.1], [3.2, 6.65], [5.6, 6.85], [8.2, 6.3], [11.5, 5.9]],
    queueIndex: 2,
    queueStep: [-0.5, -0.18],
  },
};

// Sim queue-join threshold and end-of-path progress (mirrors simulation.ts).
export const QUEUE_JOIN_X = 0.45;
export const EXIT_X = 1.3;

function interp(pts: GridPt[], f: number): GridPt {
  if (pts.length === 1) return pts[0];
  const lens: number[] = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    lens.push(d);
    total += d;
  }
  let target = Math.max(0, Math.min(1, f)) * total;
  for (let i = 0; i < lens.length; i++) {
    if (target <= lens[i] || i === lens.length - 1) {
      const t = lens[i] === 0 ? 0 : target / lens[i];
      return [
        pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t,
        pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t,
      ];
    }
    target -= lens[i];
  }
  return pts[pts.length - 1];
}

// Map a customer's sim progress (0..EXIT_X) to a grid position on the layout's path.
export function walkPoint(layout: SceneLayout, simX: number): GridPt {
  const approach = layout.path.slice(0, layout.queueIndex + 1);
  const exit = layout.path.slice(layout.queueIndex);
  if (simX <= QUEUE_JOIN_X) return interp(approach, simX / QUEUE_JOIN_X);
  return interp(exit, (simX - QUEUE_JOIN_X) / (EXIT_X - QUEUE_JOIN_X));
}

export function queueSpot(layout: SceneLayout, index: number): GridPt {
  const head = layout.path[layout.queueIndex];
  return [head[0] + layout.queueStep[0] * index, head[1] + layout.queueStep[1] * index];
}
