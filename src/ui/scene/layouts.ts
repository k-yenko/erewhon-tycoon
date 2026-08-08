// Per-location movement layout: where the cart sits, the walk polyline,
// and how the queue stacks. Drives both rendering and people movement so
// scene changes and gameplay stay in sync.

export type GridPt = [number, number];

export interface SceneLayout {
  cart: GridPt;
  path: GridPt[];      // spawn → … → exit, in grid coords
  queueIndex: number;  // vertex where sim's queue-join point (x=0.45) lands
  queueStep: GridPt;   // queue grows from path[queueIndex] along this delta
  ambient?: GridPt[][]; // extra wander routes so scenes feel like a busy square
}

export const LAYOUTS: Record<string, SceneLayout> = {
  driveway: {
    cart: [6.0, 7.2], // on the actual driveway
    path: [[-1.5, 6.15], [5.3, 6.15], [11.5, 6.15]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
    ambient: [
      [[9.8, -1], [9.4, 10.5]],
      [[-1.5, 3.95], [11.5, 3.95]],
      [[11.5, 5.85], [-1.5, 5.85]],
      [[-1.5, 7.6], [4.6, 7.7], [8.2, 8.5], [11.5, 7.9]],
    ],
  },
  silverlake: {
    cart: [4.05, 6.35],
    path: [[-1.5, 6.15], [3.2, 6.15], [11.5, 6.15]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
    ambient: [
      [[7.7, -1], [7.1, 10.5]],
      [[-1.5, 3.95], [11.5, 3.95]],
      [[-1.5, 5.9], [11.5, 5.9]],
      [[5.0, -1], [5.2, 10.5]],
    ],
  },
  culver: {
    cart: [4.03, 6.35],
    path: [[-1.5, 6.35], [3.0, 6.35], [11.5, 6.35]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
    ambient: [
      [[-1.5, 3.95], [11.5, 3.95]],
      [[6.2, -1], [6.2, 11]],
      [[-1.5, 6.85], [11.5, 6.85]],
      [[3.6, -1], [3.6, 11]],
    ],
  },
  studio: {
    cart: [4.5, 6.35],
    path: [[-1.5, 6.15], [3.55, 6.15], [11.5, 6.15]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
    ambient: [
      [[8.1, -1], [7.5, 10.5]],
      [[-1.5, 3.95], [11.5, 3.95]],
      [[-1.5, 5.9], [11.5, 5.9]],
      [[4.6, -1], [4.6, 10.5]],
    ],
  },
  venice: {
    cart: [4.1, 6.35], // on the boardwalk
    path: [[-1.5, 6.1], [3.1, 6.1], [11.5, 6.1]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
    ambient: [
      [[8.3, -1], [7.6, 10]],
      [[-1, 2.2], [3.5, 3.6], [7, 2.4], [11.5, 3.4]],
      [[11.5, 6.7], [-1.5, 6.7]],
      [[-1.5, 4.6], [3, 4.2], [7, 4.7], [11.5, 4.3]],
    ],
  },
  santamonica: {
    cart: [4.2, 6.35],
    path: [[-1.5, 6.35], [1.4, 5.7], [3.2, 6.1], [11.5, 6.1]],
    queueIndex: 2,
    queueStep: [-0.55, 0],
    ambient: [
      [[8.4, -1], [7.7, 10]],
      [[-1.5, 5.0], [11.5, 5.0]],
      [[-1, 6.9], [11.5, 6.9]],
      [[-1, 2.15], [11.5, 2.15]],
    ],
  },
  calabasas: {
    cart: [3.85, 6.65], // just outside the gate
    path: [[-1.5, 6.45], [2.9, 6.45], [11.5, 6.45]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
    ambient: [
      [[8.7, -1], [8.0, 10.5]],
      [[-1.5, 4.2], [11.5, 4.2]],
      [[11.5, 6.12], [-1.5, 6.12]],
      [[-1.5, 7.6], [4, 7.9], [8, 7.4], [11.5, 7.8]],
    ],
  },
  beverlygrove: {
    cart: [4.05, 7.15], // at the parking-lot sidewalk edge
    path: [[-1.5, 7.05], [3.1, 7.05], [11.5, 7.05]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
    ambient: [
      [[8.0, -1], [7.3, 10.5]],
      [[-1, 5.0], [3, 4.6], [6, 5.3], [11.8, 4.6]],
      [[-1.5, 7.32], [11.5, 7.32]],
      [[11.5, 6.1], [-1.5, 6.1]],
    ],
  },
  beverlyhills: {
    cart: [4.03, 6.35],
    path: [[-1.5, 6.35], [3.0, 6.35], [11.5, 6.35]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
    ambient: [
      [[-1.5, 3.95], [11.5, 3.95]],
      [[6.15, -1], [6.15, 11]],
      [[-1.5, 6.85], [11.5, 6.85]],
      [[4.1, -1], [4.1, 11]],
    ],
  },
  palisades: {
    cart: [4.2, 7.0], // on the village green's edge
    path: [[-1.5, 5.7], [1.2, 6.1], [3.2, 6.65], [5.6, 6.85], [8.2, 6.3], [11.5, 5.9]],
    queueIndex: 2,
    queueStep: [-0.5, -0.18],
    ambient: [
      [[1.9, 3.9], [2.5, 10]],
      [[-1, 7.6], [3, 7.9], [7, 7.4], [11.5, 6.6]],
      [[-1.5, 4.8], [4, 4.9], [8, 4.7], [11.5, 5.2]],
      [[-1.5, 3.75], [11.5, 3.75]],
    ],
  },
};

// Sim queue-join threshold and end-of-path progress (mirrors simulation.ts).
export const QUEUE_JOIN_X = 0.45;
export const EXIT_X = 1.3;

// Street furniture AND building footprints near the walk bands, as
// [x, y, radius] no-walk circles — keeps pedestrians from standing inside
// fountains, planters, bikes, and most importantly, other people's houses.
export const OBSTACLES: Record<string, [number, number, number][]> = {
  driveway: [[5.1, 6.95, 0.45], [5.1, 7.35, 0.45], [7.15, 5.85, 0.35], [0.6, 7.3, 0.45], [0.4, 3.85, 0.3], [2.75, 3.35, 0.35], [7.2, 3.15, 0.35], [1.6, 7.5, 0.4],
    [1.55, 2.4, 1.1], [8.45, 2.2, 1.1], [7.65, 7.45, 1.15]],
  silverlake: [[2.35, 6.45, 0.4], [0.4, 6.3, 0.4], [6.2, 6.45, 0.35], [9.7, 5.85, 0.3], [8.4, 6.25, 0.4], [6.5, 3.45, 0.5], [5.6, 3.3, 0.4],
    [1.55, 2.55, 1.15], [3.7, 2.6, 1.0], [7.8, 2.6, 1.35]],
  culver: [[1.9, 6.55, 0.5], [1.2, 6.7, 0.4], [7.4, 6.7, 0.4], [6.1, 6.5, 0.3], [8.9, 6.55, 0.45], [9.5, 6.7, 0.45], [3.1, 3.1, 0.4],
    [1.7, 2.0, 1.2], [7.15, 2.1, 1.1], [9.35, 2.35, 0.85]],
  studio: [[4.6, 6.45, 0.4], [2.4, 6.5, 0.5], [0.5, 6.4, 0.45], [9.7, 6.35, 0.45], [7.2, 6.4, 0.4], [8.3, 6.45, 0.35], [0.7, 3.35, 0.35], [3.75, 3.35, 0.35],
    [2.1, 1.9, 1.6], [7.4, 2.3, 0.7]],
  venice: [[9.9, 5.5, 0.5], [0.2, 6.9, 0.4], [1.0, 3.6, 0.45], [5.3, 3.1, 0.45], [9.8, 3.7, 0.45], [6.3, 3.35, 0.35], [2.15, 2.4, 0.5], [7.25, 1.9, 0.5]],
  santamonica: [[3.6, 4.95, 0.5], [5.4, 5.0, 0.45], [8.8, 5.0, 0.45], [1.2, 5.0, 0.4], [10.6, 5.0, 0.35], [-0.5, 6.9, 0.3], [2.2, 6.9, 0.3], [6.8, 6.9, 0.3], [9.5, 6.9, 0.3],
    [1.5, 3.1, 1.0], [3.65, 3.15, 0.9]],
  calabasas: [[4.2, 4.25, 0.4], [6.6, 4.25, 0.4], [1.9, 4.32, 0.35], [8.9, 4.32, 0.35], [0.5, 6.15, 0.3], [9.4, 6.7, 0.35], [0.2, 4.15, 0.3], [8.7, 4.15, 0.3],
    [7.8, 1.75, 1.35], [1.9, 1.85, 1.15]],
  beverlygrove: [[0.4, 6.85, 0.3], [3.3, 7.35, 0.35], [8.9, 7.2, 0.4], [11.1, 6.0, 0.4], [4.4, 5.0, 0.4], [0.0, 4.85, 0.7], [2.4, 4.85, 0.7], [6.0, 4.85, 0.7], [9.6, 4.85, 0.7],
    [1.7, 2.3, 1.3], [4.6, 2.4, 1.3]],
  beverlyhills: [[9.6, 6.6, 0.75], [1.5, 6.7, 0.4], [8.2, 6.7, 0.4], [0.5, 6.5, 0.35], [6.4, 6.5, 0.35], [1.35, 3.7, 0.4], [3.25, 3.7, 0.4], [7.25, 3.7, 0.4], [9.15, 3.7, 0.4], [8.3, 3.85, 0.65],
    [1.35, 2.4, 1.1], [3.25, 2.4, 1.0], [7.25, 2.4, 1.1], [9.15, 2.4, 1.0]],
  palisades: [[4.5, 5.35, 0.5], [5.8, 5.6, 0.45], [1.6, 5.2, 0.45], [7.6, 5.0, 0.45], [9.6, 7.0, 0.45], [9.8, 6.7, 0.35], [0.5, 5.4, 0.35], [6.5, 5.7, 0.35],
    [1.6, 2.25, 1.05], [8.15, 2.15, 1.1]],
};

// Push a walk target out of any obstacle circle. `side` biases which way a
// head-on approach deflects, so a person consistently rounds the same edge.
export function avoidObstacles(locId: string, gx: number, gy: number, side: 1 | -1): GridPt {
  const obs = OBSTACLES[locId];
  if (!obs) return [gx, gy];
  for (const [ox, oy, r] of obs) {
    let dx = gx - ox;
    let dy = gy - oy;
    if (Math.abs(dy) < 0.14) dy = 0.14 * side; // pick a lane before the bumper
    const d = Math.hypot(dx, dy);
    if (d < r) {
      gx = ox + (dx / d) * r;
      gy = oy + (dy / d) * r;
    }
  }
  return [gx, gy];
}

export function pointAlongPolyline(pts: GridPt[], f: number): GridPt {
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
  if (simX <= QUEUE_JOIN_X) return pointAlongPolyline(approach, simX / QUEUE_JOIN_X);
  return pointAlongPolyline(exit, (simX - QUEUE_JOIN_X) / (EXIT_X - QUEUE_JOIN_X));
}

// Queue bunches two-abreast into a loose cluster by the cart, not a snake.
// The second column offsets toward the viewer (away from the cart/road).
export function queueSpot(layout: SceneLayout, index: number): GridPt {
  const head = layout.path[layout.queueIndex];
  const [sx, sy] = layout.queueStep;
  const perp: GridPt = [sy * 1.0, -sx * 1.0];
  const row = Math.floor(index / 2);
  const side = index % 2;
  // 1.3× row spacing so the crowd reads as people, not a pile
  return [
    head[0] + sx * row * 1.3 + perp[0] * side,
    head[1] + sy * row * 1.3 + perp[1] * side,
  ];
}
