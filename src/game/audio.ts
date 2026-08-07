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

const BPM = 66;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const SWING = 0.6; // offbeat lands lazy-late

// Fmaj9 → Em7 → Dm9 → Cmaj7, with bass roots
const PROG: { chord: number[]; bass: number }[] = [
  { chord: [174.6, 220, 261.6, 329.6, 392], bass: 87.3 },  // Fmaj9
  { chord: [164.8, 196, 246.9, 293.7], bass: 82.4 },       // Em7
  { chord: [146.8, 174.6, 220, 261.6, 329.6], bass: 73.4 },// Dm9
  { chord: [130.8, 164.8, 196, 246.9], bass: 65.4 },       // Cmaj7
];

let lofiBus: BiquadFilterNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let wobble: GainNode | null = null; // shared wow/flutter LFO feeding note detune

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
  osc.frequency.setValueAtTime(85, at);
  osc.frequency.exponentialRampToValueAtTime(42, at + 0.14);
  g.gain.setValueAtTime(0.34, at);
  g.gain.exponentialRampToValueAtTime(0.001, at + 0.28);
  osc.connect(g).connect(lofiBus);
  osc.start(at);
  osc.stop(at + 0.3);
}

// Rhodes-ish key: fast attack, long mellow decay, slight detune pair,
// all riding the shared wow/flutter wobble. No drones.
function keyNote(freq: number, at: number, vol: number, decay = 2.4) {
  if (!ctx || !lofiBus) return;
  for (const [det, v] of [
    [-3, vol],
    [4, vol * 0.6],
  ] as const) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = det < 0 ? 'triangle' : 'sine';
    osc.frequency.value = freq;
    osc.detune.value = det;
    wobble?.connect(osc.detune);
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(v, at + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0006, at + decay);
    osc.connect(g).connect(lofiBus);
    osc.start(at);
    osc.stop(at + decay + 0.05);
  }
}

// Gentle strum: chord notes staggered like lazy fingers.
function strum(chord: number[], at: number, vol: number) {
  chord.forEach((f, i) => keyNote(f, at + i * 0.045, vol));
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
  // Rhodes chord strummed on the 1, echoed softly on the and-of-2
  strum(chord, t0, 0.085);
  strum(chord.slice(1), t0 + BEAT * (2 + SWING - 1), 0.045);
  // sparse pentatonic melody: one or two lazy notes, not every bar
  if (bar % 2 === 0) {
    const mel = chord[(bar * 3) % chord.length] * 2;
    keyNote(mel, t0 + BEAT * (1 + SWING), 0.06, 1.6);
    if (bar % 4 === 0) keyNote(chord[1] * 2, t0 + BEAT * 3.2, 0.05, 1.4);
  }
  // bass: root on 1, again on the and-of-2 (swung)
  bassNote(bass, t0, BEAT * 1.5);
  bassNote(bass * (bar % 4 === 3 ? 1.5 : 1), t0 + BEAT * (2 + SWING), BEAT * 0.9);
  // boom-bap: kick 1 & lazy and-of-2, soft snare on 2 & 4, dusty swung hats
  kick(t0);
  kick(t0 + BEAT * (2 + SWING));
  noiseBurst(t0 + BEAT, 0.09, 0.07, 'bandpass', 1500); // soft snare
  noiseBurst(t0 + BEAT * 3, 0.09, 0.07, 'bandpass', 1500);
  for (let i = 0; i < 8; i++) {
    const off = Math.floor(i / 2) + (i % 2 === 0 ? 0 : SWING);
    noiseBurst(t0 + BEAT * off, 0.02, i % 2 === 0 ? 0.022 : 0.013, 'highpass', 7000);
  }
  // vinyl crackle: a few random dusty ticks per bar
  for (let i = 0; i < 6; i++) {
    noiseBurst(t0 + Math.random() * BAR, 0.01, 0.015 + Math.random() * 0.02, 'lowpass', 2800);
  }
}

function startMusic(): void {
  if (!ctx || !musicGain || musicTimer !== null) return;
  // warm, muffled master filter with a slow breathing LFO
  lofiBus = ctx.createBiquadFilter();
  lofiBus.type = 'lowpass';
  lofiBus.frequency.value = 1400;
  lofiBus.Q.value = 0.5;
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.06;
  lfoGain.gain.value = 350;
  lfo.connect(lfoGain).connect(lofiBus.frequency);
  lfo.start();
  lofiBus.connect(musicGain);
  // tape wow/flutter: slow pitch wobble shared by every key note
  const wob = ctx.createOscillator();
  wobble = ctx.createGain();
  wob.frequency.value = 0.6;
  wobble.gain.value = 7; // ±7 cents
  wob.connect(wobble);
  wob.start();
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
