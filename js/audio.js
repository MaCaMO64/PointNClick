const AudioSys = (() => {
  let ctx = null, master = null, musicBus = null, sfxBus = null;
  let noiseBuf = null;
  let musicOn = true, sfxOn = true;
  let mood = null, timerId = null, nextT = 0, step = 0;

  const MOODS = {
    title:   { bpm: 108, waveL: 'triangle', volL: 0.10, volB: 0.11,
      lead: [0,null,4,null,7,null,9,7, 4,null,0,null,-3,null,0,null],
      bass: [-24,null,-17,null,-19,null,-17,null] },
    shire:   { bpm: 92, waveL: 'triangle', volL: 0.09, volB: 0.10,
      lead: [0,null,4,null,7,4,9,null, 7,null,4,null,2,null,4,null,
             0,null,4,null,7,4,11,null, 9,null,7,null,4,null,2,null],
      bass: [-24,null,null,null,-17,null,null,null,-21,null,null,null,-19,null,null,null] },
    road:    { bpm: 104, waveL: 'triangle', volL: 0.08, volB: 0.10,
      lead: [0,null,3,null,7,null,3,null, 8,null,7,null,3,null,0,null,
             0,null,3,null,7,null,10,null, 8,null,7,null,5,null,3,null],
      bass: [-24,null,null,null,-21,null,null,null,-19,null,null,null,-17,null,null,null] },
    pub:     { bpm: 138, waveL: 'square', volL: 0.06, volB: 0.10,
      lead: [0,4,7,4,0,4,7,4, 5,9,12,9,5,9,7,4,
             0,4,7,4,0,4,7,4, -3,0,4,0,5,4,2,0],
      bass: [-12,null,-12,null,-17,null,-17,null, -14,null,-14,null,-16,null,-16,null] },
    river:   { bpm: 100, waveL: 'sine', volL: 0.10, volB: 0.10,
      lead: [0,4,7,12,7,4,0,4, 5,9,12,16,12,9,5,9,
             7,11,14,19,14,11,7,11, 5,9,12,16,12,9,7,4],
      bass: [-24,null,null,null,-20,null,null,null,-22,null,null,null,-17,null,null,null] },
    forest:  { bpm: 70, waveL: 'sine', volL: 0.09, volB: 0.10,
      lead: [0,null,null,null,7,null,null,null, 6,null,null,null,3,null,null,null,
             0,null,null,null,7,null,null,null, 10,null,null,8,6,null,3,null],
      bass: [-24,null,null,null,null,null,null,null,-25,null,null,null,-27,null,null,null] },
    volcano: { bpm: 58, waveL: 'sawtooth', volL: 0.05, volB: 0.12,
      lead: [null,null,6,null,null,null,13,null, null,null,6,null,null,18,null,null],
      bass: [-29,null,null,null,null,null,-30,null, -29,null,null,null,-31,null,null,null] },
    ending:  { bpm: 96, waveL: 'triangle', volL: 0.11, volB: 0.11,
      lead: [0,null,7,null,12,null,9,null, 7,null,4,null,7,null,0,null],
      bass: [-24,null,null,null,-19,null,null,null,-17,null,null,null,-12,null,null,null] },
  };

  function ensureNoise() {
    if (noiseBuf || !ctx) return;
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  function tone(freq, t, dur, type, bus, vol, endFreq) {
    if (!ctx || !freq) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (endFreq) o.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(bus);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function noise(t, dur, vol, freqStart, freqEnd) {
    if (!ctx) return;
    ensureNoise();
    const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.setValueAtTime(freqStart, t);
    f.frequency.exponentialRampToValueAtTime(Math.max(60, freqEnd), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(sfxBus);
    src.start(t); src.stop(t + dur + 0.05);
  }

  function seq(notes, gap, dur, type, vol) {
    if (!ctx || !sfxOn) return;
    const t0 = ctx.currentTime;
    notes.forEach((n, i) => {
      const f = typeof n === 'number' ? n : n.f;
      tone(f, t0 + i * gap, dur, type || 'square', sfxBus, vol || 0.15, typeof n === 'object' ? n.t : undefined);
    });
  }

  const FX = {
    pickup:  () => seq([660, 880], 0.07, 0.09),
    success: () => seq([523, 659, 784, 1047], 0.09, 0.12, 'triangle', 0.16),
    error:   () => seq([{ f: 200, t: 160 }], 0.02, 0.22, 'sawtooth', 0.10),
    click:   () => seq([1200], 0, 0.04, 'square', 0.06),
    coin:    () => seq([1319, 1760], 0.06, 0.10),
    door:    () => { if (ok()) { const t = ctx.currentTime; tone(90, t, 0.18, 'square', sfxBus, 0.14); noise(t, 0.15, 0.10, 900, 200); } },
    whoosh:  () => { if (ok()) noise(ctx.currentTime, 0.35, 0.14, 2400, 300); },
    splash:  () => { if (ok()) { const t = ctx.currentTime; noise(t, 0.45, 0.18, 1400, 150); tone(220, t, 0.2, 'sine', sfxBus, 0.08, 80); } },
    magic:   () => { if (ok()) { const t = ctx.currentTime; tone(400, t, 0.5, 'sine', sfxBus, 0.12, 1600); tone(800, t + 0.1, 0.4, 'sine', sfxBus, 0.06, 3200); } },
    ringOn:  () => { if (ok()) { const t = ctx.currentTime; tone(900, t, 0.7, 'sine', sfxBus, 0.10, 90); noise(t + 0.05, 0.6, 0.05, 500, 120); } },
    burp:    () => seq([{ f: 130, t: 55 }], 0, 0.3, 'sawtooth', 0.16),
    fanfare: () => seq([392, 392, 392, 523], 0.16, 0.3, 'triangle', 0.16),
    sad:     () => seq([{ f: 330, t: 165 }, { f: 311, t: 155 }, { f: 233, t: 116 }], 0.3, 0.4, 'triangle', 0.13),
  };

  function ok() { return !!ctx && sfxOn; }

  function scheduleStep(m, when) {
    const spb = 60 / m.bpm / 2;
    const li = step % m.lead.length, bi = step % m.bass.length;
    if (musicOn && m.lead[li] !== null && m.lead[li] !== undefined) {
      tone(261.63 * Math.pow(2, m.lead[li] / 12), when, spb * 0.95, m.waveL, musicBus, m.volL);
    }
    if (musicOn && m.bass[bi] !== null && m.bass[bi] !== undefined) {
      tone(261.63 * Math.pow(2, m.bass[bi] / 12), when, spb * 1.7, 'triangle', musicBus, m.volB);
    }
  }

  function tick() {
    if (!ctx || !mood) return;
    const m = MOODS[mood];
    const spb = 60 / m.bpm / 2;
    while (nextT < ctx.currentTime + 0.25) {
      if (nextT < ctx.currentTime) nextT = ctx.currentTime + 0.05;
      scheduleStep(m, nextT);
      nextT += spb;
      step++;
    }
  }

  return {
    init() {
      if (ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.85; master.connect(ctx.destination);
      musicBus = ctx.createGain(); musicBus.gain.value = 0.9; musicBus.connect(master);
      sfxBus = ctx.createGain(); sfxBus.gain.value = 1.0; sfxBus.connect(master);
      this.resume();
    },
    resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); },
    fx(name) {
      if (!ok() || !FX[name]) return;
      try { FX[name](); } catch (e) {}
    },
    voice(seed) {
      if (!ok()) return;
      const base = 170 + (seed % 40) * 7;
      const f = base + Math.random() * 60;
      tone(f, ctx.currentTime, 0.045, 'square', sfxBus, 0.045);
    },
    startMusic(name) {
      if (!ctx || mood === name) return;
      mood = name; step = 0;
      nextT = ctx.currentTime + 0.1;
      if (!timerId) timerId = setInterval(tick, 90);
    },
    stopMusic() { mood = null; },
    toggleMusic() { musicOn = !musicOn; return musicOn; },
    toggleSfx() { sfxOn = !sfxOn; return sfxOn; },
    musicEnabled: () => musicOn,
    sfxEnabled: () => sfxOn,
  };
})();
