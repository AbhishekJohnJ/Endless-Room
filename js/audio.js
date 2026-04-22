// ═════════════════════════════════════════════════════════════
// AUDIO SYSTEM
// ═════════════════════════════════════════════════════════════

let audioCtx = null;

const getACtx = () =>
  audioCtx || (audioCtx = new (window.AudioContext || window.webkitAudioContext)());

function tone(freq, type, dur, vol, delay = 0) {
  try {
    const ctx = getACtx(), o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    g.gain.setValueAtTime(0, ctx.currentTime + delay);
    g.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + dur);
    o.start(ctx.currentTime + delay);
    o.stop(ctx.currentTime + delay + dur);
  } catch (e) {}
}

export function playAmbience() {
  try {
    const ctx = getACtx(), len = ctx.sampleRate * 3,
          buf = ctx.createBuffer(1, len, ctx.sampleRate),
          d   = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.014;
    const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 260;
    s.connect(f); f.connect(ctx.destination); s.start();
  } catch (e) {}
}

export function playJumpscare() {
  [80, 60, 40].forEach((fr, i) => tone(fr, 'sawtooth', 0.6, 0.42, i * 0.05));
  tone(200, 'square', 0.3, 0.3);
}

export function playCorrect() {
  tone(880, 'sine', 0.15, 0.18);
  tone(1100, 'sine', 0.15, 0.14, 0.1);
}

export function playClick() {
  tone(300, 'sine', 0.07, 0.1);
}
