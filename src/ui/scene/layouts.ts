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
    ambient: [[[8.4, 1.8], [7.9, 8.2]], [[-1.5, 3.95], [11.5, 3.95]]],
  },
  silverlake: {
    cart: [4.05, 6.35],
    path: [[-1.5, 6.15], [3.2, 6.15], [11.5, 6.15]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
    ambient: [[[7.6, 1.8], [7.2, 8.2]], [[-1.5, 3.95], [11.5, 3.95]]],
  },
  culver: {
    cart: [4.03, 6.35],
    path: [[-1.5, 6.35], [3.0, 6.35], [11.5, 6.35]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
    ambient: [[[-1.5, 3.95], [11.5, 3.95]], [[6.2, -1], [6.2, 11]]],
  },
  studio: {
    cart: [4.5, 6.35],
    path: [[-1.5, 6.15], [3.55, 6.15], [11.5, 6.15]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
    ambient: [[[8.0, 1.8], [7.6, 8.2]], [[-1.5, 3.95], [11.5, 3.95]]],
  },
  venice: {
    cart: [4.1, 6.35], // on the boardwalk
    path: [[-1.5, 6.1], [3.1, 6.1], [11.5, 6.1]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
    ambient: [[[8.2, 1.2], [7.7, 7.6]], [[-1, 2.2], [3.5, 3.6], [7, 2.4], [11.5, 3.4]]],
  },
  santamonica: {
    cart: [4.2, 6.35],
    path: [[-1.5, 6.35], [1.4, 5.7], [3.2, 6.1], [11.5, 6.1]],
    queueIndex: 2,
    queueStep: [-0.55, 0],
    ambient: [[[8.3, 2.0], [7.8, 7.8]], [[-1.5, 5.0], [11.5, 5.0]], [[-1, 6.9], [11.5, 6.9]]],
  },
  calabasas: {
    cart: [3.85, 6.65], // just outside the gate
    path: [[-1.5, 6.45], [2.9, 6.45], [11.5, 6.45]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
    ambient: [[[8.6, 2.0], [8.1, 8.4]], [[-1.5, 4.2], [11.5, 4.2]]],
  },
  beverlygrove: {
    cart: [4.05, 7.15], // at the parking-lot sidewalk edge
    path: [[-1.5, 7.05], [3.1, 7.05], [11.5, 7.05]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
    ambient: [[[7.9, 2.2], [7.4, 8.4]], [[-1, 5.0], [3, 4.6], [6, 5.3], [11, 4.7]]],
  },
  beverlyhills: {
    cart: [4.03, 6.35],
    path: [[-1.5, 6.35], [3.0, 6.35], [11.5, 6.35]],
    queueIndex: 1,
    queueStep: [-0.55, 0],
    ambient: [[[-1.5, 3.95], [11.5, 3.95]], [[6.2, -1], [6.2, 11]]],
  },
  palisades: {
    cart: [4.2, 7.0], // on the village green's edge
    path: [[-1.5, 5.7], [1.2, 6.1], [3.2, 6.65], [5.6, 6.85], [8.2, 6.3], [11.5, 5.9]],
    queueIndex: 2,
    queueStep: [-0.5, -0.18],
    ambient: [[[2.0, 4.6], [2.4, 8.6]], [[-1, 7.6], [3, 7.9], [7, 7.4], [11.5, 6.6]]],
  },
};

// Sim queue-join threshold and end-of-path progress (mirrors simulation.ts).
export const QUEUE_JOIN_X = 0.45;
export const EXIT_X = 1.3;

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
