let ctx = null;
let masterGain = null;

export function init() {
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.15;
    masterGain.connect(ctx.destination);
  } catch (_) {}
}

export function resume() {
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

function tone(freq, duration, type = 'square', vol = 0.3, ramp = 0.02) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration + ramp);
}

function noise(duration, vol = 0.15) {
  if (!ctx) return;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 300 + Math.random() * 800;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  source.start(ctx.currentTime);
  source.stop(ctx.currentTime + duration);
}

export function sfxShoot() { tone(800, 0.06, 'square', 0.12); tone(600, 0.04, 'square', 0.08); }
export function sfxHit() { noise(0.15, 0.2); tone(120, 0.12, 'sawtooth', 0.2); }
export function sfxExplosion() { noise(0.35, 0.25); tone(60, 0.25, 'sawtooth', 0.3); tone(40, 0.3, 'triangle', 0.2); }
export function sfxPowerup() { tone(600, 0.08, 'square', 0.15); setTimeout(() => tone(900, 0.1, 'square', 0.15), 80); }
export function sfxBomb() { noise(0.5, 0.35); tone(30, 0.5, 'sawtooth', 0.4); }
export function sfxWave() { tone(440, 0.12, 'square', 0.1); setTimeout(() => tone(660, 0.12, 'square', 0.1), 120); }
export function sfxGameOver() {
  tone(400, 0.3, 'sawtooth', 0.2);
  setTimeout(() => tone(300, 0.3, 'sawtooth', 0.2), 300);
  setTimeout(() => tone(200, 0.5, 'sawtooth', 0.2), 600);
}