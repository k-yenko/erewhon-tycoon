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
  musicGain.gain.value = 0.09; // well under the sfx
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
  | 'click'
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
    case 'click': // cute little tick on every button
      tone(660, { type: 'triangle', dur: 0.045, vol: 0.06 });
      tone(990, { type: 'triangle', at: 0.035, dur: 0.05, vol: 0.045 });
      break;
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

// ——— lo-fi beat: jazzy chords through a warm filter, swung drums, tape hiss ———

const BPM = 72;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const SWING = 0.58; // offbeat lands late

// Fmaj9 → Em7 → Dm9 → Cmaj7, with bass roots
const PROG: { chord: number[]; bass: number }[] = [
  { chord: [174.6, 220, 261.6, 329.6, 392], bass: 87.3 },  // Fmaj9
  { chord: [164.8, 196, 246.9, 293.7], bass: 82.4 },       // Em7
  { chord: [146.8, 174.6, 220, 261.6, 329.6], bass: 73.4 },// Dm9
  { chord: [130.8, 164.8, 196, 246.9], bass: 65.4 },       // Cmaj7
];

let lofiBus: BiquadFilterNode | null = null;
let noiseBuf: AudioBuffer | null = null;

function noiseBurst(at: number, dur: number, vol: number, filterType: BiquadFilterType, freq: number) {
  if (!ctx || !lofiBus || !noiseBuf) return;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = filterType;
  f.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, at);
  g.gain.exponentialRampToValueAtTime(0.0008, at + dur);
  src.connect(f).connect(g).connect(lofiBus);
  src.start(at);
  src.stop(at + dur + 0.02);
}

function kick(at: number) {
  if (!ctx || !lofiBus) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.frequency.setValueAtTime(110, at);
  osc.frequency.exponentialRampToValueAtTime(45, at + 0.12);
  g.gain.setValueAtTime(0.5, at);
  g.gain.exponentialRampToValueAtTime(0.001, at + 0.22);
  osc.connect(g).connect(lofiBus);
  osc.start(at);
  osc.stop(at + 0.25);
}

function padNote(freq: number, at: number, dur: number, vol: number) {
  if (!ctx || !lofiBus) return;
  for (const det of [-4, 4]) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    osc.detune.value = det;
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(vol, at + 0.4);
    g.gain.setValueAtTime(vol, at + dur - 0.6);
    g.gain.linearRampToValueAtTime(0.0001, at + dur);
    osc.connect(g).connect(lofiBus);
    osc.start(at);
    osc.stop(at + dur + 0.05);
  }
}

function bassNote(freq: number, at: number, dur: number) {
  if (!ctx || !lofiBus) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(0.4, at + 0.03);
  g.gain.exponentialRampToValueAtTime(0.001, at + dur);
  osc.connect(g).connect(lofiBus);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

function scheduleBar(t0: number, bar: number) {
  const { chord, bass } = PROG[bar % PROG.length];
  // pad chord, whole bar
  for (const f of chord) padNote(f, t0, BAR, 0.05);
  // lazy pentatonic-ish pluck, not every bar
  if (bar % 2 === 1) {
    const f = chord[(bar * 5) % chord.length] * 2;
    padNote(f, t0 + BEAT * 2.55, 0.9, 0.07);
  }
  // bass: root on 1, again on the and-of-2 (swung)
  bassNote(bass, t0, BEAT * 1.4);
  bassNote(bass, t0 + BEAT * (2 + SWING), BEAT * 0.9);
  // drums: kick 1 & and-of-2ish, rim on 2 & 4, dusty swung hats
  kick(t0);
  kick(t0 + BEAT * (2 + SWING));
  noiseBurst(t0 + BEAT, 0.07, 0.09, 'bandpass', 1800); // rim
  noiseBurst(t0 + BEAT * 3, 0.07, 0.09, 'bandpass', 1800);
  for (let i = 0; i < 8; i++) {
    const off = Math.floor(i / 2) + (i % 2 === 0 ? 0 : SWING);
    noiseBurst(t0 + BEAT * off, 0.025, i % 2 === 0 ? 0.035 : 0.02, 'highpass', 6500);
  }
  // vinyl crackle: a few random dusty ticks per bar
  for (let i = 0; i < 5; i++) {
    noiseBurst(t0 + Math.random() * BAR, 0.012, 0.02 + Math.random() * 0.02, 'lowpass', 3000);
  }
}

function startMusic(): void {
  if (!ctx || !musicGain || musicTimer !== null) return;
  // warm master filter for the whole beat, with a slow breathing LFO
  lofiBus = ctx.createBiquadFilter();
  lofiBus.type = 'lowpass';
  lofiBus.frequency.value = 2000;
  lofiBus.Q.value = 0.4;
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.07;
  lfoGain.gain.value = 500;
  lfo.connect(lfoGain).connect(lofiBus.frequency);
  lfo.start();
  lofiBus.connect(musicGain);
  // shared noise buffer for drums/crackle
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  // constant faint tape hiss
  noiseBurst(ctx.currentTime + 0.05, 3600, 0.006, 'lowpass', 4500);

  let bar = 0;
  let nextBarTime = ctx.currentTime + 0.1;
  const tick = () => {
    if (!ctx) return;
    // lookahead scheduler: keep one bar queued ahead
    while (nextBarTime < ctx.currentTime + BAR) {
      scheduleBar(nextBarTime, bar);
      bar += 1;
      nextBarTime += BAR;
    }
  };
  tick();
  musicTimer = window.setInterval(tick, 250);
}
