// Tiny WebAudio synth: all SFX and the background loop are generated in code —
// no audio assets. Everything routes through a master gain with a persisted mute.

const MUTE_KEY = 'erewhon-tycoon:muted';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicTimer: number | null = null;
let muted = localStorage.getItem(MUTE_KEY) === '1';

export function isMuted(): boolean {
  return muted;
}

export function toggleMute(): boolean {
  muted = !muted;
  localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  if (master) master.gain.value = muted ? 0 : 1;
  return muted;
}

// Must be called from a user gesture (browser autoplay policy).
export function unlock(): void {
  if (ctx) {
    if (ctx.state === 'suspended') void ctx.resume();
    return;
  }
  ctx = new AudioContext();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 1;
  master.connect(ctx.destination);
  musicGain = ctx.createGain();
  musicGain.gain.value = 0.05; // well under the sfx
  musicGain.connect(master);
  startMusic();
}

function tone(
  freq: number,
  opts: {
    type?: OscillatorType;
    at?: number;       // seconds from now
    dur?: number;
    vol?: number;
    slide?: number;    // target freq to glide to
    dest?: AudioNode;
  } = {},
) {
  if (!ctx || !master) return;
  const { type = 'sine', at = 0, dur = 0.15, vol = 0.12, slide, dest = master } = opts;
  const t = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  osc.connect(g).connect(dest);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export type Sfx =
  | 'sale'
  | 'happy'
  | 'taste'
  | 'price'
  | 'wait'
  | 'blend'
  | 'dayStart'
  | 'results'
  | 'viral';

export function sfx(name: Sfx): void {
  if (!ctx || muted) return;
  switch (name) {
    case 'sale': // cha-ching
      tone(880, { at: 0, dur: 0.08, vol: 0.1 });
      tone(1318, { at: 0.07, dur: 0.16, vol: 0.12 });
      break;
    case 'happy':
      tone(740, { type: 'triangle', dur: 0.1, vol: 0.08, slide: 1100 });
      break;
    case 'taste': // downward womp
      tone(220, { type: 'sawtooth', dur: 0.22, vol: 0.05, slide: 110 });
      break;
    case 'price': // dry scoff
      tone(330, { type: 'square', dur: 0.07, vol: 0.045 });
      tone(262, { type: 'square', at: 0.08, dur: 0.09, vol: 0.045 });
      break;
    case 'wait': // deflating sigh
      tone(500, { type: 'triangle', dur: 0.3, vol: 0.05, slide: 240 });
      break;
    case 'blend': // quick whirr
      tone(90, { type: 'sawtooth', dur: 0.28, vol: 0.05, slide: 190 });
      break;
    case 'dayStart':
      [523, 659, 784].forEach((f, i) => tone(f, { type: 'triangle', at: i * 0.09, dur: 0.22, vol: 0.09 }));
      break;
    case 'results':
      [784, 659, 523, 659, 784, 1046].forEach((f, i) =>
        tone(f, { type: 'triangle', at: i * 0.08, dur: 0.14, vol: 0.08 }),
      );
      break;
    case 'viral': // sparkle
      [1046, 1318, 1568, 2093].forEach((f, i) => tone(f, { at: i * 0.05, dur: 0.1, vol: 0.07 }));
      break;
  }
}

// A very quiet lo-fi loop: four soft chords, one gentle pluck per bar.
const CHORDS: number[][] = [
  [174.6, 220, 261.6, 329.6], // Fmaj7
  [220, 261.6, 329.6, 392],   // Am7
  [130.8, 164.8, 196, 246.9], // Cmaj7
  [196, 246.9, 293.7, 349.2], // G7-ish
];

function startMusic(): void {
  if (!ctx || !musicGain || musicTimer !== null) return;
  let bar = 0;
  const BAR = 3.2; // seconds
  const playBar = () => {
    if (!ctx || !musicGain) return;
    const chord = CHORDS[bar % CHORDS.length];
    for (const f of chord) {
      tone(f, { type: 'triangle', at: 0.05, dur: BAR * 0.95, vol: 0.05, dest: musicGain });
    }
    // sparse pluck an octave up
    const pluck = chord[(bar * 7) % chord.length] * 2;
    tone(pluck, { type: 'sine', at: BAR * 0.5, dur: 0.5, vol: 0.1, dest: musicGain });
    bar += 1;
  };
  playBar();
  musicTimer = window.setInterval(playBar, BAR * 1000);
}
