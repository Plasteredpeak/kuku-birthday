// Original, procedurally played music + sound effects (Web Audio, no files).
// Moods inspired by melancholic cave-game soundtracks: music box, soft pads, lots of reverb.

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12)

let ctx, master, musicBus, sfxBus, reverb, reverbSend
let muted = false
try { muted = localStorage.getItem('kuku-muted') === '1' } catch {}

function impulse(seconds = 3.2, decay = 2.6) {
  const len = ctx.sampleRate * seconds
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
  }
  return buf
}

export function initAudio() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return }
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  ctx = new AC()
  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -16; comp.ratio.value = 4
  master = ctx.createGain(); master.gain.value = muted ? 0 : 0.9
  master.connect(comp).connect(ctx.destination)
  reverb = ctx.createConvolver(); reverb.buffer = impulse()
  reverbSend = ctx.createGain(); reverbSend.gain.value = 0.55
  reverbSend.connect(reverb).connect(master)
  musicBus = ctx.createGain(); musicBus.gain.value = 0.0
  musicBus.connect(master); musicBus.connect(reverbSend)
  sfxBus = ctx.createGain(); sfxBus.gain.value = 0.7
  sfxBus.connect(master)
  const sfxVerb = ctx.createGain(); sfxVerb.gain.value = 0.25
  sfxBus.connect(sfxVerb).connect(reverbSend)
  startScheduler()
  if (current) {
    nextTime = ctx.currentTime + 0.1
    musicBus.gain.setTargetAtTime(0.85, ctx.currentTime, 0.8)
  }
}

export const isMuted = () => muted
export function setMuted(m) {
  muted = m
  try { localStorage.setItem('kuku-muted', m ? '1' : '0') } catch {}
  if (master) master.gain.setTargetAtTime(m ? 0 : 0.9, ctx.currentTime, 0.1)
}

/* ---------------- instruments ---------------- */
function env(g, t, a, peak, d, sustainEnd) {
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + a)
  g.gain.exponentialRampToValueAtTime(0.0001, sustainEnd ?? t + a + d)
}
function osc(type, freq, t, end, out, gainNode, detune = 0) {
  const o = ctx.createOscillator()
  o.type = type; o.frequency.value = freq; o.detune.value = detune
  o.connect(gainNode); o.start(t); o.stop(end + 0.05)
  return o
}
// music box / celesta
function bell(m, t, vol = 0.18, dur = 2.2, out = musicBus) {
  const f = mtof(m)
  const g = ctx.createGain(); g.connect(out)
  env(g, t, 0.004, vol, dur)
  osc('sine', f, t, t + dur, out, g)
  const g2 = ctx.createGain(); g2.connect(out)
  env(g2, t, 0.002, vol * 0.35, dur * 0.35)
  osc('sine', f * 3.01, t, t + dur, out, g2)
  const g3 = ctx.createGain(); g3.connect(out)
  env(g3, t, 0.001, vol * 0.12, dur * 0.15)
  osc('sine', f * 5.4, t, t + dur, out, g3)
}
function pluck(m, t, vol = 0.12, dur = 0.5, out = musicBus) {
  const g = ctx.createGain()
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400
  lp.frequency.setTargetAtTime(500, t, dur / 3)
  g.connect(lp).connect(out)
  env(g, t, 0.003, vol, dur)
  osc('triangle', mtof(m), t, t + dur, out, g)
}
function pad(notes, t, dur, vol = 0.05, out = musicBus) {
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 0.3
  const g = ctx.createGain(); g.connect(lp).connect(out)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + Math.min(1.4, dur * 0.4))
  g.gain.setValueAtTime(vol, t + dur * 0.75)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 1.2)
  for (const m of notes) {
    osc('sawtooth', mtof(m), t, t + dur + 1.2, out, g, -7)
    osc('sawtooth', mtof(m), t, t + dur + 1.2, out, g, 7)
  }
}
function bass(m, t, dur, vol = 0.14, out = musicBus) {
  const g = ctx.createGain(); g.connect(out)
  env(g, t, 0.02, vol, dur * 0.9)
  osc('sine', mtof(m), t, t + dur, out, g)
}
function piano(m, t, vol = 0.12, dur = 1.8, out = musicBus) {
  const f = mtof(m)
  const g = ctx.createGain()
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3000
  lp.frequency.setTargetAtTime(900, t, 0.3)
  g.connect(lp).connect(out)
  env(g, t, 0.005, vol, dur)
  osc('triangle', f, t, t + dur, out, g)
  osc('sine', f * 2, t, t + dur, out, g)
}
function noise(t, dur, vol, freq = 1200, type = 'bandpass', out = sfxBus) {
  const len = Math.ceil(ctx.sampleRate * dur)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource(); src.buffer = buf
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq
  const g = ctx.createGain()
  env(g, t, 0.005, vol, dur)
  src.connect(f).connect(g).connect(out)
  src.start(t)
}

/* ---------------- themes (all original) ---------------- */
// melody: per-step MIDI (null = rest). bars: [{ chord, bass }]
const expand = (pairs) => pairs.flatMap(([n, s]) => [n, ...Array(s - 1).fill(null)])

const THEMES = {
  // clock-tower waltz: music box in A minor, a quiet tick on each beat
  gate: {
    bpm: 84, spb: 6, lead: 'bell', tick: true, leadVol: 0.24, padVol: 0.06,
    bars: [
      { chord: [57, 60, 64], bass: 45 }, { chord: [53, 57, 60], bass: 41 },
      { chord: [55, 60, 64], bass: 48 }, { chord: [55, 59, 62], bass: 43 },
    ],
    melody: [69, null, 72, null, 76, null, 77, null, 76, null, 72, null,
      72, null, 74, null, 76, null, 74, null, 71, null, 67, null],
  },
  // light, plucky puzzle loop in C
  wordle: {
    bpm: 108, spb: 8, lead: 'pluck', arp: [0, 1, 2, 3, 2, 1, 0, 1],
    bars: [
      { chord: [60, 64, 67, 72], bass: 48 }, { chord: [57, 60, 64, 69], bass: 45 },
      { chord: [53, 57, 60, 65], bass: 41 }, { chord: [55, 59, 62, 67], bass: 43 },
    ],
    melody: null, padVol: 0.045, arpVol: 0.13,
  },
  // the cave: D minor drone, sparse bell, huge reverb
  cave: {
    bpm: 58, spb: 8, lead: 'bell', leadVol: 0.16,
    bars: [
      { chord: [50, 57, 62, 65], bass: 38 }, { chord: [46, 53, 58, 62], bass: 34 },
      { chord: [43, 50, 55, 58], bass: 31 }, { chord: [45, 52, 57, 61], bass: 33 },
    ],
    melody: [74, null, null, null, 77, null, 76, null, null, null, 74, null, null, null, 70, null,
      72, null, null, null, 70, null, 69, null, null, null, null, null, 73, null, null, null],
    padVol: 0.06,
  },
  // bouncy anime-opening energy in G
  anime: {
    bpm: 128, spb: 8, lead: 'bell', leadVol: 0.13, arp: [0, 2, 1, 2, 0, 2, 1, 2], bassEvery: 2,
    bars: [
      { chord: [55, 59, 62], bass: 43 }, { chord: [52, 55, 59], bass: 40 },
      { chord: [48, 52, 55], bass: 36 }, { chord: [50, 54, 57], bass: 38 },
    ],
    melody: [79, null, 79, 81, 83, null, 81, 79, 76, null, 79, null, 76, 74, null, null,
      72, null, 76, 79, 81, null, 79, 76, 74, null, null, 78, 81, null, null, null],
    padVol: 0.02,
  },
  // "Happy Birthday" (public domain) on music box, in F
  cake: {
    bpm: 100, spb: 6, lead: 'bell', leadVol: 0.2,
    bars: [
      { chord: [53, 57, 60], bass: 41 }, { chord: [48, 52, 55, 58], bass: 36 },
      { chord: [48, 52, 55, 58], bass: 36 }, { chord: [53, 57, 60], bass: 41 },
      { chord: [53, 57, 60], bass: 41 }, { chord: [46, 50, 53], bass: 34 },
      { chord: [48, 52, 55], bass: 36 }, { chord: [53, 57, 60], bass: 41 },
    ],
    melody: expand([[null, 4], [60, 1], [60, 1], [62, 2], [60, 2], [65, 2], [64, 4], [60, 1], [60, 1],
      [62, 2], [60, 2], [67, 2], [65, 4], [60, 1], [60, 1], [72, 2], [69, 2], [65, 2],
      [64, 2], [62, 2], [70, 1], [70, 1], [69, 2], [65, 2], [67, 2], [65, 6]]).map((n) => (n === null ? null : n + 12)),
    padVol: 0.03,
  },
  // soft piano for the timeline + letter, F major
  letter: {
    bpm: 66, spb: 8, lead: 'piano', leadVol: 0.1, arp: [0, 1, 2, 3, 2, 1, 2, 1], arpInst: 'piano', arpVol: 0.06,
    bars: [
      { chord: [53, 60, 65, 69], bass: 41 }, { chord: [50, 57, 62, 65], bass: 38 },
      { chord: [46, 53, 58, 62], bass: 34 }, { chord: [48, 55, 60, 64], bass: 36 },
    ],
    melody: [81, null, null, null, 79, null, 77, null, 77, null, null, null, 76, null, 74, null,
      74, null, null, null, 72, null, 70, null, 72, null, null, null, null, null, null, null],
    padVol: 0.025,
  },
}
THEMES.time = THEMES.letter

/* ---------------- scheduler ---------------- */
let current = null, step = 0, nextTime = 0, timer
function playStep(th, s, t) {
  const stepDur = 60 / th.bpm / 2
  const barIdx = Math.floor(s / th.spb) % th.bars.length
  const pos = s % th.spb
  const bar = th.bars[barIdx]
  if (pos === 0) {
    pad(bar.chord, t, stepDur * th.spb, th.padVol ?? 0.04)
    if (!th.bassEvery) bass(bar.bass, t, stepDur * th.spb)
  }
  if (th.bassEvery && pos % th.bassEvery === 0) bass(bar.bass, t, stepDur * 1.6, 0.12)
  if (th.arp) {
    const m = bar.chord[th.arp[pos] % bar.chord.length] + 12
    if (th.arpInst === 'piano') piano(m, t, th.arpVol ?? 0.05, 1.4)
    else pluck(m, t, th.arpVol ?? 0.07, 0.4)
  }
  if (th.tick && pos % 2 === 0) noise(t, 0.03, pos === 0 ? 0.05 : 0.025, 3500, 'highpass', musicBus)
  if (th.melody) {
    const n = th.melody[s % th.melody.length]
    if (n != null) {
      if (th.lead === 'piano') piano(n, t, th.leadVol ?? 0.1)
      else if (th.lead === 'pluck') pluck(n, t, th.leadVol ?? 0.1)
      else bell(n, t, th.leadVol ?? 0.15)
    }
  }
}
function startScheduler() {
  clearInterval(timer)
  timer = setInterval(() => {
    if (!current || !ctx || ctx.state !== 'running') return
    const th = THEMES[current]
    const stepDur = 60 / th.bpm / 2
    if (nextTime < ctx.currentTime) nextTime = ctx.currentTime + 0.05
    while (nextTime < ctx.currentTime + 0.25) {
      playStep(th, step, nextTime)
      nextTime += stepDur
      step++
    }
  }, 50)
}
export function playTheme(name) {
  if (!THEMES[name] || name === current) return
  if (!ctx) { current = name; return }
  const t = ctx.currentTime
  musicBus.gain.cancelScheduledValues(t)
  musicBus.gain.setTargetAtTime(0.0001, t, 0.25)
  setTimeout(() => {
    current = name; step = 0; nextTime = ctx.currentTime + 0.1
    musicBus.gain.cancelScheduledValues(ctx.currentTime)
    musicBus.gain.setTargetAtTime(0.85, ctx.currentTime + 0.1, 0.6)
  }, 700)
}
export function startMusic() {
  if (!ctx) return
  const t = ctx.currentTime
  if (current) { step = 0; nextTime = t + 0.1; musicBus.gain.setTargetAtTime(0.85, t, 0.6) }
}

/* ---------------- sound effects ---------------- */
const ok = () => ctx && ctx.state === 'running' && !muted
const now = () => ctx.currentTime + 0.005
export const sfx = {
  tap() { if (!ok()) return; pluck(84, now(), 0.06, 0.12, sfxBus) },
  key() { if (!ok()) return; noise(now(), 0.025, 0.12, 2200, 'bandpass') },
  back() { if (!ok()) return; pluck(72, now(), 0.06, 0.1, sfxBus) },
  error() { if (!ok()) return; const t = now(); pluck(52, t, 0.14, 0.18, sfxBus); pluck(51, t + 0.1, 0.14, 0.25, sfxBus) },
  tile(kind, i) {
    if (!ok()) return
    const base = { hit: 79, near: 74, miss: 62 }[kind] ?? 67
    bell(base + i, now(), kind === 'miss' ? 0.05 : 0.09, 0.6, sfxBus)
  },
  win() { if (!ok()) return; const t = now(); [72, 76, 79, 84, 88].forEach((m, i) => bell(m, t + i * 0.09, 0.14, 1.4, sfxBus)) },
  lose() { if (!ok()) return; const t = now(); [67, 63, 60, 55].forEach((m, i) => piano(m, t + i * 0.18, 0.12, 1, sfxBus)) },
  egg() { if (!ok()) return; const t = now(); [76, 81, 85, 88].forEach((m, i) => bell(m, t + i * 0.07, 0.13, 1.2, sfxBus)) },
  lantern(i) { if (!ok()) return; const t = now(); bell(74 + [0, 3, 5, 7, 10][i % 5], t, 0.16, 2.4, sfxBus); noise(t, 0.4, 0.04, 6000, 'highpass') },
  geo() { if (!ok()) return; const t = now(); for (let i = 0; i < 5; i++) bell(96 + Math.floor(Math.random() * 6), t + i * 0.05 + Math.random() * 0.03, 0.035, 0.3, sfxBus) },
  bench() { if (!ok()) return; const t = now(); [50, 57, 62, 66, 69].forEach((m, i) => bell(m + 12, t + i * 0.12, 0.1, 2.5, sfxBus)) },
  meow(happy = false) {
    if (!ok()) return
    const t = now()
    const o = ctx.createOscillator(); o.type = 'sawtooth'
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 6
    const g = ctx.createGain()
    const base = happy ? 760 : 520
    o.frequency.setValueAtTime(base, t)
    o.frequency.linearRampToValueAtTime(base * 1.5, t + 0.12)
    o.frequency.linearRampToValueAtTime(base * (happy ? 1.3 : 0.9), t + 0.32)
    f.frequency.setValueAtTime(900, t); f.frequency.linearRampToValueAtTime(1800, t + 0.12); f.frequency.linearRampToValueAtTime(1100, t + 0.32)
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.04); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38)
    o.connect(f).connect(g).connect(sfxBus); o.start(t); o.stop(t + 0.4)
  },
  hiss() { if (!ok()) return; noise(now(), 0.45, 0.12, 4000, 'highpass') },
  thud() { if (!ok()) return; const t = now(); bass(33, t, 0.3, 0.35, sfxBus); noise(t, 0.12, 0.12, 200, 'lowpass') },
  pop() { if (!ok()) return; const t = now(); noise(t, 0.08, 0.2, 1800, 'bandpass'); bell(88, t + 0.02, 0.05, 0.4, sfxBus) },
  blow() { if (!ok()) return; noise(now(), 0.25, 0.08, 700, 'lowpass') },
  crunch() { if (!ok()) return; const t = now(); for (let i = 0; i < 3; i++) noise(t + i * 0.04, 0.04, 0.12, 1500 + i * 600, 'bandpass') },
  shimmer() { if (!ok()) return; const t = now(); [84, 88, 91, 96].forEach((m, i) => bell(m, t + i * 0.05, 0.06, 1.2, sfxBus)) },
  whoosh() { if (!ok()) return; const t = now(); const len = 0.5; noise(t, len, 0.12, 600, 'bandpass') },
  batman() {
    if (!ok()) return
    const t = now()
    ;[38, 38, 37, 37, 36, 36, 37, 37].forEach((m, i) => { bass(m, t + i * 0.14, 0.13, 0.25, sfxBus); pluck(m + 24, t + i * 0.14, 0.08, 0.12, sfxBus) })
  },
  domain() { if (!ok()) return; const t = now(); pad([48, 55, 62, 67, 74], t, 1.2, 0.07, sfxBus); [86, 91, 98].forEach((m, i) => bell(m, t + 0.2 + i * 0.12, 0.08, 2, sfxBus)) },
}
