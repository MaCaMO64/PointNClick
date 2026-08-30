const AudioSys = (() => {
  let ctx = null, master = null, comp = null;
  let musicBus = null, musicDuck = null, sfxBus = null;
  let revConv = null, revGain = null, delayNode = null, delayGain = null;
  let noiseBuf = null;
  let musicOn = true, sfxOn = true, duck = false;
  let procMood = null, trackId = null, timerId = null;
  let nextT = 0, step = 0;
  let ambNodes = [];
  let trackSrc = null, trackGain = null;
  const trackBuf = {};

  function MOODS() { return (window.GAME && window.GAME.audio && window.GAME.audio.moods) || {}; }

  function initGraph() {
    master = ctx.createGain(); master.gain.value = 0.85;
    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 24; comp.ratio.value = 3;
    master.connect(comp); comp.connect(ctx.destination);

    musicBus = ctx.createGain(); applyMusicGain(); musicBus.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = sfxOn ? 0.9 : 0; sfxBus.connect(master);

    revConv = ctx.createConvolver();
    const len = Math.floor(ctx.sampleRate * 2.2);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
      }
    }
    revConv.buffer = ir;
    revGain = ctx.createGain(); revGain.gain.value = 0.34;
    revConv.connect(revGain); revGain.connect(master);

    delayNode = ctx.createDelay(1.0); delayNode.delayTime.value = 0.29;
    delayGain = ctx.createGain(); delayGain.gain.value = 0.34;
    delayNode.connect(delayGain); delayGain.connect(delayNode);
    const delayOut = ctx.createGain(); delayOut.gain.value = 0.5;
    delayGain.connect(delayOut); delayOut.connect(musicBus);
    const delayRev = ctx.createGain(); delayRev.gain.value = 0.25;
    delayGain.connect(delayRev); delayRev.connect(revConv);

    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  }

  function applyMusicGain() {
    if (!musicBus) return;
    const target = musicOn ? (duck ? 0.3 : 1) * 0.85 : 0;
    try {
      musicBus.gain.cancelScheduledValues(ctx.currentTime);
      musicBus.gain.setTargetAtTime(target, ctx.currentTime, 0.25);
    } catch (e) {}
  }

  function sendRev(node, amt) {
    const g = ctx.createGain(); g.gain.value = amt;
    node.connect(g); g.connect(revConv);
  }

  function tone(freq, t, dur, type, bus, vol, endFreq, revAmt, destOverride) {
    if (!ctx || !freq) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (endFreq) o.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.02, dur * 0.3));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(destOverride || sfxBus);
    if (revAmt) { const rg = ctx.createGain(); rg.gain.value = revAmt; g.connect(rg); rg.connect(revConv); }
    o.start(t); o.stop(t + dur + 0.08);
  }

  function noiseHit(t, dur, vol, f0, f1, type, bus) {
    if (!ctx) return;
    const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = type || 'lowpass';
    lp.frequency.setValueAtTime(f0, t);
    lp.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(lp); lp.connect(g); g.connect(bus || sfxBus);
    src.start(t); src.stop(t + dur + 0.05);
  }

  function pluck(freq, t, dur, vol, bus) {
    tone(freq, t, dur, 'triangle', bus, vol, undefined, 0.3, getDelayIn(bus));
  }
  let delayIn = null;
  function delayInFor() {
    if (!delayIn) {
      delayIn = ctx.createGain(); delayIn.gain.value = 0.45;
      delayIn.connect(delayNode);
    }
    return delayIn;
  }
  function getDelayIn(bus) {
    const din = delayInFor();
    if (bus === musicBus || !bus) return din;
    const g = ctx.createGain(); g.gain.value = 0.3; g.connect(din); return g;
  }

  function padChord(m, chord, t, dur) {
    const cutoff = m.pad === 'dark' ? 520 : 1050;
    const type = m.pad === 'dark' ? 'sawtooth' : 'triangle';
    const f = (semi) => m.root * Math.pow(2, semi / 12) * 2;
    chord.concat([chord[0] + 12]).forEach((semi, i) => {
      const o = ctx.createOscillator(); o.type = type;
      o.frequency.value = f(semi);
      o.detune.value = (i % 2 === 0 ? -5 : 5);
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = cutoff;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.035, t + 1.1);
      g.gain.setValueAtTime(0.035, t + dur * 0.7);
      g.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(lp); lp.connect(g); g.connect(musicBus);
      const rg = ctx.createGain(); rg.gain.value = 0.5; g.connect(rg); rg.connect(revConv);
      o.start(t); o.stop(t + dur + 0.1);
    });
  }

  function bassNote(m, chordRoot, t, dur) {
    const f = m.root * Math.pow(2, chordRoot / 12) / 2;
    tone(f, t, dur * 0.9, 'sine', musicBus, 0.16);
    tone(f * 2, t, dur * 0.5, 'triangle', musicBus, 0.05);
  }

  let lastMel = 7;
  function melodyNote(m, chord, t) {
    let idx = lastMel + (Math.floor(Math.random() * 5) - 2);
    idx = Math.max(0, Math.min(m.scale.length * 2 - 1, idx));
    lastMel = idx;
    const oct = Math.floor(idx / m.scale.length);
    const semi = m.scale[idx % m.scale.length] + 12 * oct;
    const f = m.root * Math.pow(2, semi / 12) * 2;
    pluck(f, t, m.pattern === 'arp' ? 0.3 : 0.5, 0.09, musicBus);
  }

  function arpNote(m, chord, t, s8) {
    const tones = chord.concat([chord[0] + 12]);
    const seq = [0, 1, 2, 3, 2, 1];
    const semi = tones[seq[s8 % seq.length]] + 12;
    const f = m.root * Math.pow(2, semi / 12) * 2;
    pluck(f, t, 0.25, 0.07, musicBus);
  }

  function scheduleStep(m, t) {
    const bar = Math.floor(step / 8), s8 = step % 8;
    const chord = m.prog[Math.floor(bar / 2) % m.prog.length];
    const barDur = (60 / m.bpm) * 4;
    if (s8 === 0 && bar % 2 === 0) padChord(m, chord, t, barDur * 2);
    if (s8 === 0 || s8 === 4 || (m.pattern === 'arp' && s8 % 2 === 0)) bassNote(m, chord[0], t, (60 / m.bpm) * 0.9);
    if (m.pattern === 'arp') arpNote(m, chord, t, s8);
    else if (Math.random() < m.density) melodyNote(m, chord, t);
    if (m.amb.indexOf('fire') !== -1 && Math.random() < 0.22) {
      noiseHit(t + Math.random() * 0.1, 0.05, 0.05 * Math.random() + 0.015, 2600, 900, 'highpass');
    }
    if (m.amb.indexOf('birds') !== -1 && Math.random() < 0.035) birdChirp(t + Math.random() * 0.3);
  }

  function birdChirp(t) {
    const n = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      const f = 2300 + Math.random() * 900;
      tone(f, t + i * 0.09, 0.06, 'sine', musicBus, 0.028, f + 500, 0.4);
    }
  }

  function stopAmbience() {
    ambNodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch (e) {} });
    ambNodes = [];
  }

  function startAmbience(m) {
    stopAmbience();
    if (!ctx) return;
    const t = ctx.currentTime;
    m.amb.forEach(kind => {
      const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
      const g = ctx.createGain(); g.gain.value = 0.0001;
      let chainEnd = src;
      if (kind === 'wind') {
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 420; bp.Q.value = 0.5;
        const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
        const lfoG = ctx.createGain(); lfoG.gain.value = 160;
        lfo.connect(lfoG); lfoG.connect(bp.frequency); lfo.start(t);
        ambNodes.push(lfo);
        src.connect(bp); chainEnd = bp;
        g.gain.linearRampToValueAtTime(0.05, t + 2);
      } else if (kind === 'river') {
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 750;
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
        src.connect(hp); hp.connect(lp); chainEnd = lp;
        g.gain.linearRampToValueAtTime(0.055, t + 1.5);
      } else if (kind === 'murmur') {
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 360; bp.Q.value = 0.8;
        const lfo = ctx.createOscillator(); lfo.frequency.value = 0.4;
        const lfoG = ctx.createGain(); lfoG.gain.value = 0.015;
        lfo.connect(lfoG); lfoG.connect(g.gain); lfo.start(t);
        ambNodes.push(lfo);
        src.connect(bp); chainEnd = bp;
        g.gain.linearRampToValueAtTime(0.045, t + 2);
      } else if (kind === 'rumble') {
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 85;
        const lfo = ctx.createOscillator(); lfo.frequency.value = 0.045;
        const lfoG = ctx.createGain(); lfoG.gain.value = 0.03;
        lfo.connect(lfoG); lfoG.connect(g.gain); lfo.start(t);
        ambNodes.push(lfo);
        src.connect(lp); chainEnd = lp;
        g.gain.linearRampToValueAtTime(0.11, t + 3);
      }
      chainEnd.connect(g); g.connect(musicBus);
      src.start(t);
      ambNodes.push(src, g);
    });
  }

  function stopProcMusic() {
    procMood = null;
    stopAmbience();
  }

  const trackPending = {};

  function ensureTrack(id) {
    if (trackBuf[id]) return Promise.resolve(trackBuf[id]);
    if (trackPending[id]) return trackPending[id];
    const src = (window.MUSIC_DATA && window.MUSIC_DATA[id]) || null;
    if (!src || !ctx) return Promise.reject(new Error('no track'));
    trackPending[id] = fetch(src)
      .then(r => r.arrayBuffer())
      .then(ab => ctx.decodeAudioData(ab))
      .then(b => { trackBuf[id] = b; delete trackPending[id]; return b; })
      .catch(e => { delete trackPending[id]; throw e; });
    return trackPending[id];
  }

  function stopTrack() {
    if (trackSrc) {
      try { trackGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4); const s = trackSrc; setTimeout(() => { try { s.stop(); } catch (e) {} }, 1200); } catch (e) {}
      trackSrc = null;
    }
  }

  function playTrack(id) {
    stopProcMusic();
    stopTrack();
    ensureTrack(id).then(b => {
      if (trackId !== id) return;
      trackSrc = ctx.createBufferSource();
      trackSrc.buffer = b; trackSrc.loop = true;
      trackGain = ctx.createGain(); trackGain.gain.value = 0.0001;
      trackSrc.connect(trackGain); trackGain.connect(musicBus);
      trackGain.gain.setTargetAtTime(applyMusicVol(), ctx.currentTime, 0.6);
      trackSrc.start();
    }).catch(() => { if (trackId === id) startProcedural(trackId); });
  }

  function applyMusicVol() { return musicOn ? (duck ? 0.3 : 1) * 0.8 : 0; }

  function startProcedural(name) {
    stopTrack();
    procMood = name;
    step = 0;
    nextT = ctx.currentTime + 0.08;
    startAmbience(MOODS()[name]);
  }

  const FX = {
    pickup:  () => { pluck(659, ctx.currentTime, 0.3, 0.12); pluck(880, ctx.currentTime + 0.08, 0.35, 0.12); },
    success: () => seq([523, 659, 784, 1047], 0.09, 0.3, 'triangle', 0.14, 0.5),
    error:   () => { const t = ctx.currentTime; tone(140, t, 0.22, 'sawtooth', sfxBus, 0.09, 90); noiseHit(t, 0.08, 0.05, 900, 300); },
    click:   () => tone(1150, ctx.currentTime, 0.03, 'sine', sfxBus, 0.05),
    coin:    () => seq([1319, 1760], 0.06, 0.14, 'sine', 0.12, 0.35),
    door:    () => { const t = ctx.currentTime; tone(88, t, 0.16, 'square', sfxBus, 0.11); noiseHit(t, 0.14, 0.08, 500, 160); tone(310, t + 0.05, 0.22, 'sawtooth', sfxBus, 0.03, 190); },
    whoosh:  () => noiseHit(ctx.currentTime, 0.36, 0.16, 500, 2600, 'bandpass'),
    splash:  () => { const t = ctx.currentTime; noiseHit(t, 0.5, 0.2, 2800, 180); [620, 840, 1100].forEach((f, i) => tone(f, t + 0.12 + i * 0.09, 0.1, 'sine', sfxBus, 0.04, f * 0.6)); },
    magic:   () => { const t = ctx.currentTime; [400, 520, 640].forEach((f, i) => tone(f, t + i * 0.03, 0.55, 'sine', sfxBus, 0.07, 1750, 0.5)); noiseHit(t, 0.5, 0.03, 3000, 5000, 'highpass'); },
    ringOn:  () => { const t = ctx.currentTime; tone(880, t, 0.8, 'sine', sfxBus, 0.1, 75, 0.5); noiseHit(t + 0.05, 0.6, 0.04, 1400, 500, 'bandpass'); },
    burp:    () => { const t = ctx.currentTime; tone(150, t, 0.32, 'sawtooth', sfxBus, 0.16, 62); noiseHit(t, 0.2, 0.05, 700, 200); },
    fanfare: () => { const t = ctx.currentTime; [[392, 494, 587], [392, 494, 587], [523, 659, 784]].forEach((ch, i) => ch.forEach(f => tone(f, t + i * 0.17, i === 2 ? 0.7 : 0.2, 'triangle', sfxBus, 0.08, undefined, 0.5))); },
    sad:     () => seq([330, 262, 220], 0.32, 0.6, 'triangle', 0.11, 0.55),
  };

  function seq(notes, gap, dur, type, vol, revAmt) {
    if (!ctx || !sfxOn) return;
    const t0 = ctx.currentTime;
    notes.forEach((f, i) => tone(f, t0 + i * gap, dur, type, sfxBus, vol, undefined, revAmt));
  }

  function ok() { return !!ctx && sfxOn; }

  function scheduleTick() {
    if (!ctx || !procMood) return;
    const m = MOODS()[procMood];
    while (nextT < ctx.currentTime + 0.35) {
      if (nextT < ctx.currentTime) nextT = ctx.currentTime + 0.05;
      scheduleStep(m, nextT);
      nextT += (60 / m.bpm) / 2;
      step++;
    }
  }

  function applyMusicGainPublic() { applyMusicGain(); }

  return {
    init() {
      if (ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      initGraph();
      this.resume();
    },
    resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); },
    fx(name) {
      if (!ok() || !FX[name]) return;
      try { FX[name](); } catch (e) {}
    },
    voice(seed) {
      if (!ok()) return;
      const f = 160 + (seed % 40) * 6 + Math.random() * 40;
      tone(f, ctx.currentTime, 0.045, 'triangle', sfxBus, 0.032, undefined, 0, sfxBus);
    },
    startMusic(name) {
      if (!ctx) return;
      const tracks = (window.GAME && window.GAME.audio && window.GAME.audio.tracks) || {};
      const tid = tracks[name] || name;
      if (trackId === tid && (trackSrc || procMood)) return;
      trackId = tid;
      if (window.MUSIC_DATA && window.MUSIC_DATA[tid]) {
        playTrack(tid);
      } else if (window.MUSIC_DATA) {
        ensureTrack(tid).then(() => { if (trackId === tid) playTrack(tid); }).catch(() => { if (trackId === tid) startProcedural(name); });
        stopProcMusic();
      } else {
        startProcedural(name);
      }
      applyMusicGainPublic();
    },
    stopMusic() {
      trackId = null;
      stopProcMusic();
      stopTrack();
    },
    setDuck(on) { duck = on; applyMusicGainPublic(); },
    toggleMusic() { musicOn = !musicOn; applyMusicGainPublic(); return musicOn; },
    toggleSfx() { sfxOn = !sfxOn; if (sfxBus) sfxBus.gain.value = sfxOn ? 0.9 : 0; return sfxOn; },
    setEnabled(m, s) { musicOn = m; sfxOn = s; applyMusicGainPublic(); if (sfxBus) sfxBus.gain.value = s ? 0.9 : 0; },
    musicEnabled: () => musicOn,
    sfxEnabled: () => sfxOn,
  };

})();
