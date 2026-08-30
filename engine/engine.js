const W = 1280, H = 720, UI_TOP = 624;
const LOW_W = 320, LOW_H = 156;
const KX = LOW_W / W, KY = LOW_H / UI_TOP;
const GAME = window.GAME;
const GAME_VERSION = GAME.meta.version;

const Settings = {
  data: { music: true, sfx: true, display: 'auto', difficulty: 'normal' },
  onApply: null,
  load() {
    try {
      const raw = localStorage.getItem(GAME.meta.storageKey + '_settings');
      if (raw) Object.assign(this.data, JSON.parse(raw));
    } catch (e) {}
    this.apply();
  },
  save() {
    try { localStorage.setItem(GAME.meta.storageKey + '_settings', JSON.stringify(this.data)); } catch (e) {}
  },
  apply() {
    if (typeof AudioSys !== 'undefined' && AudioSys.setEnabled) AudioSys.setEnabled(this.data.music, this.data.sfx);
    if (typeof this.onApply === 'function') this.onApply();
  },
  cycle(key) {
    const order = { display: ['auto', 'fill', 'pixel'], difficulty: GAME.difficulty.levels };
    if (order[key]) {
      const i = order[key].indexOf(this.data[key]);
      this.data[key] = order[key][(i + 1) % order[key].length];
    } else {
      this.data[key] = !this.data[key];
    }
    this.save();
    this.apply();
  },
};
const VERBS = [
  { id: 'walk', label: 'WALK' },
  { id: 'look', label: 'LOOK AT' },
  { id: 'take', label: 'TAKE' },
  { id: 'use',  label: 'USE' },
  { id: 'talk', label: 'TALK TO' },
];

const SPEAKER_COLORS = GAME.speakers.colors;
const SPEAKER_NAMES = GAME.speakers.names;

  const trace = (s) => { try { require('fs').appendFileSync('ring-og-vrang/test/trace.txt', s + '\n'); } catch (e) {} }; Game = (() => {
  let canvas, ctx;
  let scaleX = 1, scaleY = 1;
  let mx = -1, my = -1, mouseInside = false;

  const G = {
    state: 'title',
    roomId: null,
    room: null,
    bgCache: {},
    inv: [],
    flags: {},
    worn: null,
    ending: null,
  };

  const player = {
    x: 300, y: 430, tx: null, ty: null,
    moving: false, facing: 1, phase: 0,
  };

  let activeVerb = 'look';
  let selectedItem = null;
  let pendingAction = null;

  const speech = { queue: [], current: null };
  const dialog = { open: false, options: [], rects: [], dirty: false, closedByEffect: false };
  const scriptState = { steps: null, idx: 0, waiting: null };
  let pendingAuto = false;
  let invPage = 0;
  let hoverRects = [];
  let uiClicks = [];
  let paused = false, pauseRects = [];
  let settingsOpen = false, settingsFrom = 'title', settingsRects = [];
  let aboutOpen = false, aboutRects = [];
  let introStep = 0;
  let titleRects = [];
  let endingRects = [];
  let whispers = [];
  let whisperTimer = 0;
  let tGlobal = 0;
  let lastTime = 0;

  const FALLBACK_LOOK = [
    'Fascinating. Almost.',
    'I have seen prettier. I have also seen uglier.',
    'That is definitely SOMETHING.',
    'Think of all the history in that. Probably.',
  ];
  const FALLBACK_USE = [
    'No. That would be weird.',
    'I tried. The universe said no.',
    'It did not work. As expected.',
    'Hmm. No.',
  ];
  const FALLBACK_TAKE = [
    'I do not really NEED that.',
    'Leave it be. It is happy here.',
    'It would not fit in my pockets. And I have ALL the pockets.',
    'Theft is a lifestyle choice. I am more of a tourist.',
  ];
  const FALLBACK_TALK = [
    'It does not have much to say. The quiet type.',
    'I tried small talk. It was mutually embarrassing.',
  ];
  const GENERIC_COMBO_FAIL = [
    'That was not one of my better ideas.',
    'No. They simply do not belong together.',
    'Creative. Wrong, but creative.',
  ];

  function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }

  G.rnd = rnd;
  G.hashStr = hashStr;
  G.FALLBACK_USE = FALLBACK_USE;
  G._debugSpeech = () => !!speech.current;
  G._debugQueue = () => speech.queue.length > 0;
  G._debugPlayer = () => ({ x: player.x, y: player.y, moving: player.moving });
  G._debugNpcs = false;
  G.version = GAME_VERSION;

  G.flag = (name) => !!G.flags[name];
  G.setFlag = (name, val) => { G.flags[name] = (val === undefined ? true : val); };
  G.has = (id) => G.inv.includes(id);
  G.addItem = (id) => {
    if (!G.has(id)) { G.inv.push(id); AudioSys.fx('pickup'); }
  };
  G.removeItem = (id) => {
    const i = G.inv.indexOf(id);
    if (i >= 0) G.inv.splice(i, 1);
    if (selectedItem === id) selectedItem = null;
  };

  G.say = (who, text) => { speech.queue.push({ who, text }); };
  G.sayLines = (lines) => lines.forEach(l => speech.queue.push({ who: l[0], text: l[1] }));
  G.think = (text) => speech.queue.push({ who: 'toke', text: '( ' + text + ' )' });

  G.openDialog = (options) => {
    dialog.open = true;
    dialog.options = options.map(o => ({ ...o, _used: false }));
    dialog.rects = [];
    dialog.closedByEffect = false;
  };
  G.closeDialog = () => { dialog.open = false; dialog.options = []; };

  G.script = (steps) => {
    dialog.open = false;
    dialog.options = [];
    dialog.rects = [];
    scriptState.steps = steps.slice();
    scriptState.idx = 0;
    scriptState.waiting = null;
  };
  G.inScript = () => scriptState.steps !== null;

  G.goto = (roomId, x, y) => enterRoom(roomId, x, y);

  G.npc = (id) => {
    if (!G.room) return null;
    if (!G.room._npcs) return null;
    return G.room._npcs.find(n => n.def.id === id || n.uid.split('_')[0] === id) || null;
  };
  G.hotspot = (id) => {
    if (!G.room) return null;
    return G.room.hotspots.find(hs => hs.id === id);
  };

  function resolveNpcs(room) {
    room._npcs = [];
    (room.npcs || []).forEach((entry, i) => {
      const def = typeof entry === 'string' ? window.NPC_DEFS[entry] : Object.assign({}, window.NPC_DEFS[entry.ref], entry);
      const uid = (typeof entry === 'string' ? entry : entry.ref) + '_' + i;
      room._npcs.push({ uid, def, x: entry.x, y: entry.y, phase: 0, talking: false });
      delete def.x; delete def.y;
    });
  }

  function buildBg(roomId) {
    const room = window.ROOMS[roomId];
    if (!room) return;
    const cv = document.createElement('canvas');
    cv.width = LOW_W; cv.height = LOW_H;
    const bctx = cv.getContext('2d');
    bctx.imageSmoothingEnabled = false;
    bctx.setTransform(KX, 0, 0, KY, 0, 0);
    room.paint(bctx, W, H);
    const im = G._bgImages && G._bgImages[roomId];
    if (im) {
      bctx.setTransform(1, 0, 0, 1, 0, 0);
      bctx.imageSmoothingEnabled = true;
      const s = Math.max(LOW_W / im.width, LOW_H / im.height);
      const dw = im.width * s, dh = im.height * s;
      bctx.drawImage(im, (LOW_W - dw) / 2, (LOW_H - dh) / 2, dw, dh);
      if (room.pngTint) {
        bctx.fillStyle = room.pngTint;
        bctx.fillRect(0, 0, LOW_W, LOW_H);
      }
      (room.bgHeal || []).forEach(p => {
        const lx = p.dx * KX, ly = p.dy * KY, lw = p.w * KX, lh = p.h * KY;
        bctx.save();
        if (p.sx !== undefined) {
          bctx.imageSmoothingEnabled = false;
          if (p.flip) {
            bctx.translate(lx + lw / 2, ly + lh / 2);
            bctx.scale(-1, 1);
            bctx.drawImage(cv, p.sx / 4, p.sy / 4, lw, lh, -lw / 2, -lh / 2, lw, lh);
          } else {
            bctx.drawImage(cv, p.sx / 4, p.sy / 4, lw, lh, lx, ly, lw, lh);
          }
        } else {
          const tw = Math.max(2, Math.round(lw / 5));
          const th = Math.max(2, Math.round(lh / 5));
          const tmp = document.createElement('canvas');
          tmp.width = tw; tmp.height = th;
          const tc = tmp.getContext('2d');
          tc.imageSmoothingEnabled = true;
          tc.drawImage(cv, lx, ly, lw, lh, 0, 0, tw, th);
          bctx.imageSmoothingEnabled = true;
          bctx.drawImage(tmp, 0, 0, tw, th, lx, ly, lw, lh);
        }
        bctx.restore();
      });
    }
    G.bgCache[roomId] = cv;
  }

  function enterRoom(roomId, x, y) {
    const room = window.ROOMS[roomId];
    if (!room) { console.error('Ukjent rom:', roomId); return; }
    G.roomId = roomId;
    G.room = room;
    resolveNpcs(room);
    if (!G.bgCache[roomId]) buildBg(roomId);
    player.x = x !== undefined ? x : 400;
    player.y = y !== undefined ? y : 450;
    player.tx = player.x; player.ty = player.y;
    player.moving = false;
    selectedItem = null;
    pendingAction = null;
    whispers = [];
    AudioSys.startMusic(room.mood || GAME.defaultMood);
    pendingAuto = !!scriptState.steps;
    invPage = 0;
if (room.onEnter) room.onEnter();
    if (!pendingAuto) autosave();
    if (window.GAME_EDITOR) window.GAME_EDITOR.onRoom(room);
  }

  function walkableClamp(x, y) {
    const band = G.room.walk || { minY: 380, maxY: 545 };
    return {
      x: Math.max(50, Math.min(W - 50, x)),
      y: Math.max(band.minY, Math.min(band.maxY, y)),
    };
  }

  function walkTo(x, y) {
    const p = walkableClamp(x, y);
    player.tx = p.x; player.ty = p.y;
    player.moving = true;
  }

  function depthScale(y) {
    const band = G.room.walk || { minY: 380, maxY: 545 };
    return 0.78 + 0.32 * Math.max(0, Math.min(1, (y - band.minY) / (band.maxY - band.minY)));
  }

  function hotspotBounds(hs) {
    return { x: hs.x, y: hs.y, w: hs.w, h: hs.h };
  }

  function visibleHotspots() {
    if (!G.room) return [];
    const out = [];
    (G.room.hotspots || []).forEach(hs => {
      if (!hs.hidden || !hs.hidden()) out.push({ kind: 'hs', hs });
    });
    (G.room._npcs || []).forEach(npc => {
      if (npc.def.hidden && npc.def.hidden()) return;
      const hgt = npc.def.height || 120;
      const wdt = npc.def.width || 80;
      out.push({
        kind: 'npc', npc,
        hs: {
          id: 'npc_' + npc.uid,
          label: npc.def.name,
          x: npc.x - wdt / 2, y: npc.y - hgt, w: wdt, h: hgt,
          standX: npc.x, standY: npc.y,
        },
      });
    });
    return out;
  }

  function pickAt(wx, wy) {
    const list = visibleHotspots();
    for (let i = list.length - 1; i >= 0; i--) {
      const e = list[i];
      if (wx >= e.hs.x && wx <= e.hs.x + e.hs.w && wy >= e.hs.y && wy <= e.hs.y + e.hs.h) return e;
    }
    return null;
  }

  function executeVerb(entry) {
    const hs = entry.hs;
    const verb = activeVerb;
    if (entry.kind === 'npc') {
      const d = entry.npc.def;
      if (selectedItem) {
        const ia = d.itemActions || {};
        const h = ia[selectedItem];
        if (h) respond(h);
        else respond(() => {
          G.think('Give the ' + ITEMS[selectedItem].name.toLowerCase() + ' to ' + d.name.toLowerCase() + '? ' + rnd(GENERIC_COMBO_FAIL));
          AudioSys.fx('error');
        });
        return;
      }
      if (verb === 'talk') { if (d.talk) d.talk(entry.npc); else G.say('toke', rnd(FALLBACK_TALK)); return; }
      if (verb === 'look') { respond(d.look !== undefined ? d.look : rnd(FALLBACK_LOOK)); return; }
      if (verb === 'take') { respond(d.take !== undefined ? d.take : rnd(FALLBACK_TAKE)); return; }
      if (verb === 'use') { respond(d.use !== undefined ? d.use : rnd(FALLBACK_USE)); return; }
    }
    const actions = hs.verbs || hs;
    if (selectedItem) {
      const ia = hs.itemActions || {};
      const h = ia[selectedItem];
      if (h) respond(h);
      else respond(() => {
        G.think('Using the ' + ITEMS[selectedItem].name.toLowerCase() + ' on the ' + hs.label.toLowerCase() + 'â€¦ ' + rnd(GENERIC_COMBO_FAIL));
        AudioSys.fx('error');
      });
      return;
    }
    const h = actions[verb];
    if (h !== undefined) respond(h);
    else {
      if (verb === 'look') respond(rnd(FALLBACK_LOOK));
      else if (verb === 'take') respond(rnd(FALLBACK_TAKE));
      else if (verb === 'use') respond(rnd(FALLBACK_USE));
      else respond(rnd(FALLBACK_TALK));
    }
  }

  function respond(h) {
    if (typeof h === 'function') h();
    else if (typeof h === 'string') G.say('toke', h);
  }

  function tryCombine(a, b) {
    const combo = window.COMBOS[a + '+' + b] || window.COMBOS[b + '+' + a];
    if (combo) combo();
    else {
      AudioSys.fx('error');
      G.think(rnd(GENERIC_COMBO_FAIL));
    }
  }

  function advanceSpeech() {
    if (!speech.current) return;
    if (!speech.fullShown) { speech.fullShown = true; return; }
    speech.current = null;
    if (speech.queue.length > 0) {
      startCurrentSpeech();
    } else {
      if (typeof AudioSys !== 'undefined' && AudioSys.setDuck) AudioSys.setDuck(false);
      if (dialog.open && !dialog.closedByEffect) dialog.dirty = true;
    }
  }

  function startCurrentSpeech() {
    const s = speech.queue.shift();
    s.shown = 0;
    s.t0 = performance.now();
    s.blipCount = 0;
    speech.current = s;
    speech.fullShown = false;
    if (typeof AudioSys !== 'undefined' && AudioSys.setDuck) AudioSys.setDuck(true);
    const npcObj = G.npc(s.who);
    (G.room._npcs || []).forEach(n => n.talking = false);
    if (npcObj) npcObj.talking = true;
  }

  function updateSpeech(dt) {
    if (!speech.current && speech.queue.length > 0) startCurrentSpeech();
    const s = speech.current;
    if (!s) return;
    const elapsed = performance.now() - s.t0;
    const chars = Math.floor(elapsed / 26);
    if (chars > s.shown && chars <= s.text.length) {
      const ch = s.text[Math.min(chars, s.text.length - 1)];
      if (/\S/.test(ch)) {
        s.blipCount++;
        if (s.blipCount % 2 === 0) AudioSys.voice(hashStr(s.who));
      }
    }
    s.shown = Math.min(chars, s.text.length);
    if (chars >= s.text.length) {
      speech.fullShown = true;
      const minMs = 1500 + s.text.length * 22;
      if (elapsed > minMs) advanceSpeech();
    }
  }

  function updateScript(dt) {
    if (!scriptState.steps) return;
    if (speech.current || speech.queue.length > 0) return;
    if (scriptState.waiting !== null) {
      scriptState.waiting -= dt;
      if (scriptState.waiting > 0) return;
      scriptState.waiting = null;
    }
    if (scriptState.movingPlayer) {
      if (player.moving) return;
      scriptState.movingPlayer = false;
    }
    if (scriptState.movingNpc) {
      if (scriptState.movingNpc.scriptMoving) return;
      scriptState.movingNpc = null;
    }
    while (true) {
      if (scriptState.idx >= scriptState.steps.length) {
        scriptState.steps = null;
        if (pendingAuto) { pendingAuto = false; autosave(); }
        break;
      }
      const st = scriptState.steps[scriptState.idx++];
      if (st.say) { G.say(st.say[0], st.say[1]); break; }
      if (st.sayLines) { st.sayLines.forEach(l => G.say(l[0], l[1])); break; }
      if (st.wait !== undefined) { scriptState.waiting = st.wait; break; }
      if (st.move) {
        const who = st.move.who;
        if (who === 'player') { walkTo(st.move.x, st.move.y); scriptState.movingPlayer = true; break; }
        else {
          const npc = G.npc(who);
          if (npc) { npc.tx = st.move.x; npc.ty = st.move.y; npc.scriptMoving = true; scriptState.movingNpc = npc; }
          break;
        }
      }
      if (st.fn) { st.fn(); continue; }
      if (st.music) { AudioSys.startMusic(st.music); continue; }
      if (st.fx) { AudioSys.fx(st.fx); continue; }
      if (st.flag) { G.setFlag(st.flag[0], st.flag[1]); continue; }
      if (st.wear !== undefined) { G.wear(st.wear); continue; }
      if (st.goto) { enterRoom(st.goto.room, st.goto.x, st.goto.y); continue; }
      if (st.dialog) { G.openDialog(st.dialog); scriptState.steps = null; break; }
    }
  }

  G.wear = (id) => {
    G.worn = id || null;
    const w = GAME.wearable || {};
    AudioSys.fx(id ? (w.fxOn || 'pickup') : (w.fxOff || 'pickup'));
    if (G.room && G.room.onWearToggle) G.room.onWearToggle(id);
  };
  G.toggleWear = () => {
    const w = GAME.wearable;
    if (!w || !G.has(w.itemId)) return;
    G.wear(G.worn === w.itemId ? null : w.itemId);
  };

  function storageKey(suffix) { return (GAME.meta.storageKey || 'ringandwrong') + '_' + suffix; }
  function autosave() {
    try {
      const prev = localStorage.getItem(storageKey('auto'));
      if (prev) localStorage.setItem(storageKey('auto_prev'), prev);
      localStorage.setItem(storageKey('auto'), JSON.stringify(saveData()));
    } catch (e) {}
  }
  function saveData() {
    return {
      room: G.roomId, x: player.x, y: player.y,
      inv: G.inv.slice(), flags: { ...G.flags }, worn: G.worn,
      ts: Date.now(),
    };
  }
  G.saveGame = () => {
    try { localStorage.setItem(storageKey('save'), JSON.stringify(saveData())); return true; }
    catch (e) { return false; }
  };
  G.loadGame = () => {
    let raw = localStorage.getItem(storageKey('save'));
    if (!raw) raw = localStorage.getItem(storageKey('auto'));
    if (!raw) raw = localStorage.getItem(storageKey('auto_prev'));
    if (!raw) return false;
    try {
      const d = JSON.parse(raw);
      if (!window.ROOMS[d.room]) return false;
      G.inv = d.inv || [];
      G.flags = d.flags || {};
      G.worn = d.worn || null;
      G.state = 'play';
      paused = false;
      dialog.open = false; dialog.options = [];
      speech.queue = []; speech.current = null;
      scriptState.steps = null;
      enterRoom(d.room, d.x, d.y);
      return true;
    } catch (e) { return false; }
  };
  G.hasSave = () => {
    return !!(localStorage.getItem(storageKey('save')) || localStorage.getItem(storageKey('auto')));
  };
  G.newGame = () => {
    G.inv = []; G.flags = {}; G.worn = null; G.ending = null;
    G.difficulty = Settings.data.difficulty;
    introStep = 0;
    G.state = 'intro';
    AudioSys.stopMusic();
  };
  G.showEnding = (type) => {
    G.ending = type;
    G.state = 'ending';
    AudioSys.startMusic((GAME.endings[type] && GAME.endings[type].music) || GAME.defaultMood);
    AudioSys.fx(type === 'good' ? 'fanfare' : 'sad');
  };

  function update(dt) {
    if (G._skipUpdate) return;
    tGlobal += dt;
    updateScript(dt);
    updateSpeech(dt);

    if (player.moving && !dialog.open) {
      const dx = player.tx - player.x, dy = player.ty - player.y;
      const dist = Math.hypot(dx, dy);
      const speed = 250 * depthScale(player.y);
      if (dist < 4) {
        player.x = player.tx; player.y = player.ty;
        player.moving = false;
        if (pendingAction && scriptState.steps === null && !speech.current && speech.queue.length === 0 && !dialog.open) {
          const pa = pendingAction;
          pendingAction = null;
          if (pa.entry) executeVerb(pa.entry);
        }
      } else {
        const vx = dx / dist * speed * dt, vy = dy / dist * speed * dt;
        player.x += vx; player.y += vy;
        player.phase += dt * 9;
        if (Math.abs(dx) > 2) player.facing = dx > 0 ? 1 : -1;
      }
    }

    (G.room._npcs || []).forEach(npc => {
      if (npc.scriptMoving) {
        const dx = npc.tx - npc.x, dy = npc.ty - npc.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 4) { npc.x = npc.tx; npc.y = npc.ty; npc.scriptMoving = false; }
        else {
          const sp = (npc.def.speed || 200) * dt;
          npc.x += dx / dist * sp; npc.y += dy / dist * sp;
          npc.phase = (npc.phase || 0) + dt * 9;
        }
      } else {
        npc.phase = (npc.phase || 0) + dt;
      }
    });

    const wear = GAME.wearable;
    if (G.worn && wear && wear.whispers) {
      whisperTimer -= dt;
      if (whisperTimer <= 0) {
        whisperTimer = 2.5 + Math.random() * 3;
        whispers.push({ text: rnd(wear.whispers), x: 200 + Math.random() * 800, y: 420 + Math.random() * 100, life: 4 });
      }
    }
    whispers.forEach(wsp => { wsp.life -= dt; wsp.y -= dt * 14; });
    whispers = whispers.filter(wsp => wsp.life > 0);
  }

  function wrapText(text, maxW) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    words.forEach(word => {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; }
      else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }
  G.roundRect = roundRect;

  function drawWorld() {
    const l = G._lctx;
    if (!G.bgCache[G.roomId]) return;
    l.setTransform(KX, 0, 0, KY, 0, 0);
    l.clearRect(0, 0, W, H);
    l.save();
    l.setTransform(1, 0, 0, 1, 0, 0);
    l.drawImage(G.bgCache[G.roomId], 0, 0);
    l.restore();

    if (G.room.animateUnder) G.room.animateUnder(l, tGlobal); 
    const ents = [];
    const pArgs = player._drawArgs || (player._drawArgs = {});
    Object.assign(pArgs, {
      x: player.x, y: player.y, scale: depthScale(player.y),
      style: 'toke', facing: player.facing,
      phase: player.moving ? player.phase : 0,
      walking: player.moving, talking: speech.current && speech.current.who === 'toke',
    });
    ents.push({ y: player.y, draw: () => GAME.paint.person(l, pArgs) });
    (G.room._npcs || []).forEach(npc => {
      if (npc.def.hidden && npc.def.hidden()) return;
      const nArgs = npc._drawArgs || (npc._drawArgs = {});
      Object.assign(nArgs, {
        x: npc.x, y: npc.y, scale: depthScale(npc.y),
        phase: npc.phase, talking: npc.talking, npc,
      });
      ents.push({ y: npc.y, draw: () => npc.def.draw(l, nArgs) });
    });
    (GAME.followers || []).forEach(f => {
      if (!G.flag(f.flag) || G.npc(f.style) || (f.excludeRooms || []).includes(G.roomId)) return;
      const fxp = player.x + (f.offsetX || -60) * player.facing;
      const fArgs = f._drawArgs || (f._drawArgs = {});
      Object.assign(fArgs, {
        x: fxp, y: player.y + 2, scale: depthScale(player.y),
        style: f.style, facing: player.facing,
        phase: player.moving ? player.phase + 2 : 0,
        walking: player.moving, talking: false,
      });
      ents.push({ y: player.y - 1, draw: () => GAME.paint.person(l, fArgs) });
    });
    ents.sort((a, b) => a.y - b.y).forEach(e => {
      try { e.draw(); }
      catch (err) {
        console.error('[RING & WRONG] entity draw failed - skipping so the scene survives:', err);
        G.toast('Draw error (see console F12)');
      }
    });

    if (G._debugNpcs) {
      l.save();
      l.setTransform(1, 0, 0, 1, 0, 0);
      l.imageSmoothingEnabled = false;
      const canary = GAME.paint.canary();
      l.drawImage(canary, 24, 56);
      l.strokeStyle = '#40ff40';
      l.lineWidth = 1;
      l.strokeRect(24, 56, 32, 40);
      l.font = '10px Consolas, monospace';
      l.fillStyle = '#40ff40';
      l.fillText('CANARY', 24, 52);
      l.restore();
      ctx.font = 'bold 14px Consolas, monospace';
      ctx.textAlign = 'center';
      const tag = (label, x, y) => {
        const s = label + ' ' + Math.round(x) + ',' + Math.round(y);
        const w = ctx.measureText(s).width;
        ctx.fillStyle = 'rgba(0,0,0,0.78)';
        ctx.fillRect(x - w / 2 - 6, y - 152, w + 12, 22);
        ctx.fillStyle = '#7dff7d';
        ctx.fillText(s, x, y - 136);
      };
      (G.room._npcs || []).forEach(npc => {
        const b = (npc._drawArgs && npc._drawArgs._blit) || { lx: '?', ly: '?' };
        tag(npc.def.name + ' def:' + Math.round(npc.x) + ',' + Math.round(npc.y) + ' blit:' + b.lx + ',' + b.ly, npc.x, npc.y);
      });
      const pb = (player._drawArgs && player._drawArgs._blit) || { lx: '?', ly: '?' };
      tag('TOMBLE blit:' + pb.lx + ',' + pb.ly, player.x, player.y);
    }

    if (G.room.animateOver) G.room.animateOver(l, tGlobal);

    const wear = GAME.wearable;
    if (G.worn && wear && wear.overlay) {
      l.fillStyle = wear.overlay.veil;
      l.fillRect(0, 0, W, UI_TOP);
      const pulse = 0.12 + 0.08 * Math.sin(tGlobal * 3);
      const grad = l.createRadialGradient(W / 2, UI_TOP / 2, UI_TOP * 0.3, W / 2, UI_TOP / 2, UI_TOP * 0.85);
      grad.addColorStop(0, wear.overlay.vignette + '0)');
      grad.addColorStop(1, wear.overlay.vignette + pulse.toFixed(3) + ')');
      l.fillStyle = grad;
      l.fillRect(0, 0, W, UI_TOP);
    }

    hoverRects.forEach(r => {
      l.strokeStyle = 'rgba(255,250,220,0.75)';
      l.lineWidth = 5;
      roundRect(l, r.x + 2, r.y + 2, r.w - 4, r.h - 4, 8);
      l.stroke();
    });
  }

  function drawSpeechLayer() {
    whispers.forEach(wsp => {
      ctx.save();
      ctx.globalAlpha = Math.min(0.55, wsp.life * 0.28);
      ctx.font = 'italic 26px Georgia, serif';
      ctx.fillStyle = '#ffdddd';
      ctx.textAlign = 'center';
      ctx.fillText(wsp.text, wsp.x, wsp.y);
      ctx.restore();
    });

    const s = speech.current;
    if (s) {
      const color = SPEAKER_COLORS[s.who] || '#ffffff';
      const shownText = s.text.slice(0, s.shown);
      ctx.font = 'bold 22px Verdana, sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'left';
      const name = SPEAKER_NAMES[s.who] !== undefined ? SPEAKER_NAMES[s.who] : s.who.toUpperCase();
      let ty = 24;
      if (name) { ctx.fillText(name + ':', 24, ty); ty += 30; }
      ctx.font = '21px Verdana, sans-serif';
      const lines = wrapText(shownText, 1000);
      lines.forEach((ln, i) => {
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillText(ln, 25, ty + 31 + i * 27 + 1);
        ctx.fillStyle = '#f4f0e6';
        ctx.fillText(ln, 24, ty + 30 + i * 27);
      });
      if (speech.fullShown) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath();
        ctx.moveTo(W - 40, 34); ctx.lineTo(W - 24, 42); ctx.lineTo(W - 40, 50);
        ctx.fill();
      }
    }

    if (dialog.open && dialog.dirty && !G.inScript() && speech.queue.length === 0) {
      renderDialogMenu();
    }
  }

  function renderDialogMenu() {
    dialog.rects = [];
    const opts = dialog.options.filter(o => o.keep || !o._used);
    const bx = 652, bw = 420;
    const rows = opts.length + 1;
    const lh = Math.min(26, (H - UI_TOP - 24) / rows);
    ctx.font = '15px Verdana, sans-serif';
    ctx.textAlign = 'left';
    let oy = UI_TOP + 18 + lh * 0.72;
    opts.forEach(o => {
      const r = { x: bx - 4, y: oy - lh * 0.78, w: bw + 8, h: lh, opt: o };
      const hovered = mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h;
      if (hovered) {
        ctx.fillStyle = 'rgba(255,215,110,0.14)';
        roundRect(ctx, r.x, r.y, r.w, r.h, 5);
        ctx.fill();
      }
      let text = 'â€º ' + o.text;
      while (ctx.measureText(text).width > bw - 10 && text.length > 5) text = text.slice(0, -2) + 'â€¦';
      ctx.fillStyle = hovered ? '#fff6d8' : '#ffe08a';
      ctx.fillText(text, bx + 2, oy);
      dialog.rects.push(r);
      oy += lh;
    });
    const er = { x: bx - 4, y: oy - lh * 0.78, w: bw + 8, h: lh, opt: '__exit__' };
    const hoveredExit = mx >= er.x && mx <= er.x + er.w && my >= er.y && my <= er.y + er.h;
    ctx.font = 'italic 14px Verdana, sans-serif';
    ctx.fillStyle = hoveredExit ? '#cfc7b0' : '#8f8470';
    ctx.fillText(GAME.ui.leave, bx + 2, oy);
    dialog.rects.push(er);
  }

  function drawInventorySlot(x, y, size, itemId, hovered) {
    ctx.fillStyle = hovered ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.06)';
    roundRect(ctx, x, y, size, size, 6);
    ctx.fill();
    ctx.strokeStyle = selectedItem === itemId ? 'rgba(255,215,90,0.95)' : 'rgba(180,160,110,0.35)';
    ctx.lineWidth = selectedItem === itemId ? 3 : 1.5;
    roundRect(ctx, x, y, size, size, 6);
    ctx.stroke();
    if (itemId && ITEMS[itemId] && ITEMS[itemId].icon) {
      ctx.save();
      ctx.translate(x + size / 2, y + size / 2);
      ITEMS[itemId].icon(ctx, size);
      ctx.restore();
    }
  }

  function drawUI() {
    ctx.fillStyle = '#120a04';
    ctx.fillRect(0, UI_TOP, W, H - UI_TOP);
    const grad = ctx.createLinearGradient(0, UI_TOP, 0, H);
    grad.addColorStop(0, '#33220f');
    grad.addColorStop(0.5, '#2a1b0c');
    grad.addColorStop(1, '#191006');
    ctx.fillStyle = grad;
    ctx.fillRect(3, UI_TOP + 3, W - 6, H - UI_TOP - 6);
    ctx.strokeStyle = 'rgba(255,215,150,0.05)';
    ctx.lineWidth = 2;
    for (let y = UI_TOP + 18; y < H; y += 18) {
      ctx.beginPath(); ctx.moveTo(6, y); ctx.lineTo(W - 6, y + Math.sin(y * 1.7) * 1.5); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,220,160,0.16)';
    ctx.fillRect(3, UI_TOP + 3, W - 6, 2);
    ctx.fillRect(3, UI_TOP + 3, 2, H - UI_TOP - 6);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(3, H - 5, W - 6, 2);
    ctx.fillRect(W - 5, UI_TOP + 3, 2, H - UI_TOP - 6);
    ctx.fillStyle = '#c9a24a';
    ctx.fillRect(0, UI_TOP, W, 2);

    VERBS.forEach(v => {
      const r = verbRect(v.id);
      const isActive = activeVerb === v.id;
      const hov = mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h;
      ctx.fillStyle = isActive ? '#3d2a12' : hov ? '#241708' : '#1c1208';
      roundRect(ctx, r.x, r.y, r.w, r.h, 6);
      ctx.fill();
      ctx.strokeStyle = isActive ? '#ffd76e' : hov ? 'rgba(255,215,110,0.55)' : '#57401f';
      ctx.lineWidth = 2;
      roundRect(ctx, r.x, r.y, r.w, r.h, 6);
      ctx.stroke();
      drawVerbIcon(v.id, r.x + r.w / 2, r.y + 19, isActive || hov);
      ctx.font = 'bold 12px Verdana, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = isActive ? '#ffe9a8' : '#d8c79a';
      ctx.fillText(v.label, r.x + r.w / 2, r.y + r.h - 8);
      uiClicks.push({ x: r.x, y: r.y, w: r.w, h: r.h, act: 'verb', id: v.id });
    });

    if (dialog.open && dialog.dirty && !G.inScript() && speech.queue.length === 0) {
      renderDialogMenu();
    } else {
      const midCx = 862;
      let sentence = '';
      if (selectedItem) {
        sentence = hoverLabel
          ? 'Use ' + ITEMS[selectedItem].name.toLowerCase() + ' on ' + hoverLabel.toLowerCase()
          : 'Use ' + ITEMS[selectedItem].name.toLowerCase() + ' withâ€¦';
      } else if (hoverLabel) {
        const l = hoverLabel.toLowerCase();
        sentence = activeVerb === 'walk' ? 'Walk to ' + l :
                   activeVerb === 'talk' ? 'Talk to ' + l :
                   activeVerb === 'look' ? 'Look at ' + l :
                   activeVerb === 'take' ? 'Pick up ' + l :
                   'Use ' + l;
      }
      ctx.font = 'italic 16px Verdana, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(240,225,190,0.92)';
      ctx.fillText(sentence, midCx, UI_TOP + 32);
      ctx.font = '12px Verdana, sans-serif';
      ctx.fillStyle = 'rgba(200,185,150,0.6)';
      ctx.fillText(GAME.ui.hintRightClick, midCx, UI_TOP + 60);
      ctx.fillText(GAME.ui.hintEsc, midCx, UI_TOP + 78);
    }

    const slotSize = 38, stride = 44;
    const cols = 4, rows = 2;
    const perPage = cols * rows;
    const pageCount = Math.max(1, Math.ceil(G.inv.length / perPage));
    if (invPage >= pageCount) invPage = pageCount - 1;
    if (invPage < 0) invPage = 0;
    const gx = W - 22 - cols * stride + 6, gy = UI_TOP + 12;
    const visItems = G.inv.slice(invPage * perPage, invPage * perPage + perPage);
    for (let i = 0; i < perPage; i++) {
      const cx = gx + (i % cols) * stride;
      const cy = gy + Math.floor(i / cols) * stride;
      const item = visItems[i];
      const hovered = item && mx >= cx && mx <= cx + slotSize && my >= cy && my <= cy + slotSize;
      drawInventorySlot(cx, cy, slotSize, item, hovered);
      if (item && hovered) {
        uiClicks.push({ x: cx, y: cy, w: slotSize, h: slotSize, act: 'invitem', id: item });
      }
    }
    if (pageCount > 1) {
      ctx.font = 'bold 14px Verdana, sans-serif';
      ctx.fillStyle = 'rgba(240,225,190,0.85)';
      ctx.textAlign = 'center';
      const ayL = gy + perPage / 2 * stride + 2;
      const lx = gx - 12, rx2 = gx + cols * stride + 4;
      ctx.fillText('â€¹', lx, ayL);
      ctx.fillText('â€º', rx2, ayL);
      uiClicks.push({ x: lx - 10, y: ayL - 16, w: 20, h: 22, act: 'invpage', dir: -1 });
      uiClicks.push({ x: rx2 - 6, y: ayL - 16, w: 20, h: 22, act: 'invpage', dir: 1 });
      ctx.font = '11px Verdana, sans-serif';
      ctx.fillStyle = 'rgba(200,185,150,0.7)';
      ctx.fillText((invPage + 1) + '/' + pageCount, gx + cols * stride - 10, gy - 6);
    }
    ctx.font = '12px Verdana, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(200,185,150,0.6)';
    ctx.fillText('BAG', gx, gy - 8);

    ctx.font = '11px Consolas, monospace';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(200,185,150,0.55)';
    ctx.fillText(GAME_VERSION + '  (N = debug)', W - 10, H - 8);
  }

  const verbRects = {};
  function verbRect(id) {
    if (verbRects[id]) return verbRects[id];
    const i = VERBS.findIndex(v => v.id === id);
    const r = { x: 14 + i * 126, y: UI_TOP + 14, w: 118, h: 56 };
    verbRects[id] = r;
    return r;
  }

  function drawVerbIcon(id, cx, cy, on) {
    const c1 = on ? '#ffe9a8' : '#cbb27f';
    const c2 = 'rgba(0,0,0,0.5)';
    ctx.save();
    ctx.translate(cx, cy);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    function strokeTwice(fn) {
      ctx.lineWidth = 2.6;
      ctx.save();
      ctx.translate(1.3, 1.3);
      ctx.strokeStyle = c2;
      ctx.beginPath(); fn(); ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = c1;
      ctx.beginPath(); fn(); ctx.stroke();
    }
    switch (id) {
      case 'walk':
        strokeTwice(() => {
          ctx.arc(0, -8, 3.4, 0, Math.PI * 2);
          ctx.moveTo(0, -4.5); ctx.lineTo(0, 3);
          ctx.moveTo(-4.4, -0.5); ctx.lineTo(4.4, -0.5);
          ctx.moveTo(0, 3); ctx.lineTo(-4.2, 11);
          ctx.moveTo(0, 3); ctx.lineTo(4.2, 11);
        });
        break;
      case 'look':
        strokeTwice(() => {
          ctx.moveTo(-10, 0);
          ctx.quadraticCurveTo(0, -8.5, 10, 0);
          ctx.quadraticCurveTo(0, 8.5, -10, 0);
          ctx.moveTo(2.7, 0);
          ctx.arc(0, 0, 2.7, 0, Math.PI * 2, true);
        });
        break;
      case 'take':
        strokeTwice(() => {
          ctx.moveTo(-7, 1); ctx.lineTo(-7, 8); ctx.lineTo(7, 8); ctx.lineTo(7, 1);
          ctx.moveTo(0, -9); ctx.lineTo(0, -2);
          ctx.moveTo(-3.4, -5.4); ctx.lineTo(0, -1.6); ctx.lineTo(3.4, -5.4);
        });
        break;
      case 'use':
        strokeTwice(() => {
          ctx.moveTo(4, 0); ctx.arc(0, 0, 4, 0, Math.PI * 2, true);
          for (let a = 0; a < 8; a++) {
            const ang = a * Math.PI / 4;
            ctx.moveTo(Math.cos(ang) * 5.4, Math.sin(ang) * 5.4);
            ctx.lineTo(Math.cos(ang) * 8.4, Math.sin(ang) * 8.4);
          }
        });
        break;
      case 'talk':
        strokeTwice(() => {
          roundRect(ctx, -8.5, -10, 17, 12, 3.4);
          ctx.moveTo(-2, 2); ctx.lineTo(0.4, 7.4); ctx.lineTo(3.4, 2);
        });
        break;
    }
    ctx.restore();
  }

  function drawSceneTitle() {
    if (!G.room || !G.room.name) return;
    const t = G.room.name.toUpperCase();
    ctx.font = 'bold 21px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(0,0,0,0.75)';
    ctx.strokeText(t, W / 2, UI_TOP - 12);
    ctx.fillStyle = '#8ee06a';
    ctx.fillText(t, W / 2, UI_TOP - 12);
  }

  function drawSettings() {
    ctx.fillStyle = 'rgba(5,6,10,0.85)';
    ctx.fillRect(0, 0, W, H);
    settingsRects = [];
    ctx.textAlign = 'center';
    ctx.font = 'bold 26px Georgia, serif';
    ctx.fillStyle = '#f0dfae';
    ctx.fillText('SETTINGS', W / 2, 110);
    const rows = [
      { key: 'music', label: 'MUSIC' },
      { key: 'sfx', label: 'SOUND EFFECTS' },
      { key: 'display', label: 'DISPLAY' },
      { key: 'difficulty', label: 'DIFFICULTY' },
    ];
    const bw = 560, bh = 54, gap = 12;
    let by = 170;
    rows.forEach(rw => {
      const val = Settings.data[rw.key];
      let valText;
      if (rw.key === 'display') valText = { auto: 'AUTO (FIT)', fill: 'FILL WINDOW', pixel: '1:1 PIXELS' }[val];
      else if (rw.key === 'difficulty') valText = GAME.difficulty.labels[val] || val.toUpperCase();
      else valText = val ? 'ON' : 'OFF';
      const hovered = mx >= W / 2 - bw / 2 && mx <= W / 2 + bw / 2 && my >= by && my <= by + bh;
      ctx.fillStyle = hovered ? 'rgba(212,175,55,0.16)' : 'rgba(40,34,24,0.92)';
      roundRect(ctx, W / 2 - bw / 2, by, bw, bh, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(212,175,55,0.5)';
      ctx.lineWidth = 1.5;
      roundRect(ctx, W / 2 - bw / 2, by, bw, bh, 10);
      ctx.stroke();
      ctx.font = 'bold 17px Verdana, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#eadfc4';
      ctx.fillText(rw.label, W / 2 - bw / 2 + 22, by + bh / 2 + 6);
      ctx.textAlign = 'right';
      ctx.fillStyle = hovered ? '#ffe08a' : '#c9a24a';
      ctx.fillText(valText + '  ▸', W / 2 + bw / 2 - 22, by + bh / 2 + 6);
      settingsRects.push({ x: W / 2 - bw / 2, y: by, w: bw, h: bh, key: rw.key });
      by += bh + gap;
    });
    const backBh = 50;
    const hoveredBack = mx >= W / 2 - 160 && mx <= W / 2 + 160 && my >= by && my <= by + backBh;
    ctx.fillStyle = hoveredBack ? 'rgba(212,175,55,0.9)' : 'rgba(40,34,24,0.92)';
    roundRect(ctx, W / 2 - 160, by, 320, backBh, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212,175,55,0.5)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, W / 2 - 160, by, 320, backBh, 10);
    ctx.stroke();
    ctx.font = 'bold 17px Verdana, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = hoveredBack ? '#181206' : '#eadfc4';
    ctx.fillText('BACK', W / 2, by + backBh / 2 + 6);
    settingsRects.push({ x: W / 2 - 160, y: by, w: 320, h: backBh, key: '__back' });
    ctx.font = '12px Consolas, monospace';
    ctx.fillStyle = 'rgba(200,185,150,0.55)';
    ctx.fillText('Difficulty changes hints and puzzles. Applies to new games and hints immediately.', W / 2, Math.min(H - 16, by + backBh + 30));
  }

  function drawPause() {
    ctx.fillStyle = 'rgba(5,6,10,0.72)';
    ctx.fillRect(0, 0, W, H);
    pauseRects = [];
    const items = [
      { label: 'RESUME', act: 'resume' },
      { label: 'SAVE GAME', act: 'save' },
      { label: 'LOAD GAME', act: 'load' },
      { label: 'SETTINGS', act: 'settings' },
      { label: 'MUSIC: ' + (AudioSys.musicEnabled() ? 'ON' : 'OFF'), act: 'music' },
      { label: 'SOUND: ' + (AudioSys.sfxEnabled() ? 'ON' : 'OFF'), act: 'sfx' },
      { label: 'MAIN MENU', act: 'title' },
    ];
    const bw = 340, bh = 56, gap = 14;
    const bx = (W - bw) / 2;
    let by = H / 2 - (items.length * (bh + gap) - gap) / 2;
    ctx.textAlign = 'center';
    items.forEach(it => {
      const hovered = mx >= bx && mx <= bx + bw && my >= by && my <= by + bh;
      ctx.fillStyle = hovered ? 'rgba(212,175,55,0.9)' : 'rgba(40,34,24,0.92)';
      roundRect(ctx, bx, by, bw, bh, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(212,175,55,0.5)';
      ctx.lineWidth = 1.5;
      roundRect(ctx, bx, by, bw, bh, 10);
      ctx.stroke();
      ctx.font = 'bold 19px Verdana, sans-serif';
      ctx.fillStyle = hovered ? '#181206' : '#eadfc4';
      ctx.fillText(it.label, W / 2, by + bh / 2 + 7);
      pauseRects.push({ x: bx, y: by, w: bw, h: bh, act: it.act });
      by += bh + gap;
    });
    ctx.font = '12px Consolas, monospace';
    ctx.fillStyle = 'rgba(200,185,150,0.55)';
    ctx.fillText('RING & WRONG ' + GAME_VERSION, W / 2, H - 14);
  }

  function drawCursor() {
    if (!mouseInside) return;
    ctx.font = '15px Verdana, sans-serif';
    ctx.textAlign = 'left';
    if (hoverLabel && G.state === 'play' && !paused && !dialog.open && !speech.current) {
      const txt = hoverLabel;
      const tw = ctx.measureText(txt).width;
      ctx.fillStyle = 'rgba(8,8,12,0.75)';
      roundRect(ctx, mx + 14, my + 8, tw + 18, 24, 6);
      ctx.fill();
      ctx.fillStyle = '#ffe9a8';
      ctx.fillText(txt, mx + 23, my + 25);
    }
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mx, my); ctx.lineTo(mx, my + 14); ctx.lineTo(mx + 4, my + 10);
    ctx.lineTo(mx + 7, my + 16); ctx.lineTo(mx + 10, my + 14.5);
    ctx.lineTo(mx + 7, my + 9); ctx.lineTo(mx + 11, my + 9);
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function render() {
    if (G._skipRender) return;
    ctx.clearRect(0, 0, W, H);
    uiClicks = [];
    hoverRects = [];

    if (G.state === 'title') { renderTitle(); drawCursor(); return; }
    if (G.state === 'intro') { renderIntro(); drawCursor(); return; }
    if (G.state === 'ending') { renderEnding(); drawCursor(); return; }

    if (!G._skipDW) drawWorld();
    ctx.imageSmoothingEnabled = false;
    if (!G._skipBLIT) ctx.drawImage(G._low, 0, 0, LOW_W, LOW_H, 0, 0, W, UI_TOP);
    if (!G._skipSL) drawSpeechLayer();
    drawSceneTitle();
    if (!G._skipUI) drawUI();

    if (settingsOpen) drawSettings();
    else if (paused) drawPause();
    drawCursor();
  }

  function renderTitle() {
    GAME.paint.title(ctx, W, H, tGlobal);
    titleRects = [];
    const btns = [
      { label: 'NEW ADVENTURE', act: 'new' },
    ];
    if (Game_hasSave()) btns.unshift({ label: 'CONTINUE', act: 'continue' });
    btns.push({ label: 'SETTINGS', act: 'settings' });
    btns.push({ label: 'ABOUT', act: 'about' });
    const bw = 320, bh = 58, gap = 16;
    let by = 430;
    ctx.textAlign = 'center';
    btns.forEach(b => {
      const bx = (W - bw) / 2;
      const hovered = mx >= bx && mx <= bx + bw && my >= by && my <= by + bh;
      ctx.fillStyle = hovered ? 'rgba(212,175,55,0.92)' : 'rgba(30,24,16,0.85)';
      roundRect(ctx, bx, by, bw, bh, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(212,175,55,0.6)';
      ctx.lineWidth = 2;
      roundRect(ctx, bx, by, bw, bh, 10);
      ctx.stroke();
      ctx.font = 'bold 21px Verdana, sans-serif';
      ctx.fillStyle = hovered ? '#171006' : '#f0dfae';
      ctx.fillText(b.label, W / 2, by + bh / 2 + 8);
      titleRects.push({ x: bx, y: by, w: bw, h: bh, act: b.act });
      by += bh + gap;
    });
    if (aboutOpen) renderAbout();
  }

  function Game_hasSave() { return G.hasSave(); }

  function renderAbout() {
    ctx.fillStyle = 'rgba(5,6,10,0.85)';
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f0dfae';
    ctx.font = 'bold 26px Georgia, serif';
    ctx.fillText(GAME.meta.title, W / 2, 130);
    ctx.font = '17px Verdana, sans-serif';
    ctx.fillStyle = '#cfc7b0';
    const lines = GAME.meta.about;

    lines.forEach((ln, i) => ctx.fillText(ln, W / 2, 190 + i * 30));
    aboutRects = [{ x: 0, y: 0, w: W, h: H, act: 'closeabout' }];
  }

  const INTRO_PANELS = GAME.intro;

  function renderIntro() {
    GAME.paint.introBg(ctx, W, H, tGlobal);
    const p = INTRO_PANELS[introStep];
    ctx.textAlign = 'center';
    p.forEach((ln, i) => {
      ctx.font = (i === 3 ? 'italic ' : '') + '24px Georgia, serif';
      ctx.fillStyle = '#efe6cf';
      ctx.fillText(ln, W / 2, 260 + i * 44);
    });
    ctx.font = '15px Verdana, sans-serif';
    ctx.fillStyle = 'rgba(230,220,190,0.55)';
    ctx.fillText('- click to continue -', W / 2, 620);
  }

  const ENDING_TEXTS = GAME.endings;

  function renderEnding() {
    GAME.paint.ending(ctx, W, H, tGlobal, G.ending);
    const e = ENDING_TEXTS[G.ending] || ENDING_TEXTS.good;
    ctx.textAlign = 'center';
    ctx.font = 'bold 40px Georgia, serif';
    ctx.fillStyle = '#f4d97b';
    ctx.fillText(e.title, W / 2, 170);
    ctx.font = '21px Georgia, serif';
    ctx.fillStyle = '#e8e0cc';
    e.lines.forEach((ln, i) => ctx.fillText(ln, W / 2, 250 + i * 40));
    endingRects = [];
    const bw = 280, bh = 54, bx = (W - bw) / 2, by = 520;
    const hovered = mx >= bx && mx <= bx + bw && my >= by && my <= by + bh;
    ctx.fillStyle = hovered ? 'rgba(212,175,55,0.92)' : 'rgba(30,24,16,0.85)';
    roundRect(ctx, bx, by, bw, bh, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212,175,55,0.6)';
    ctx.lineWidth = 2;
    roundRect(ctx, bx, by, bw, bh, 10);
    ctx.stroke();
    ctx.font = 'bold 19px Verdana, sans-serif';
    ctx.fillStyle = hovered ? '#171006' : '#f0dfae';
    ctx.fillText('PLAY AGAIN', W / 2, by + bh / 2 + 7);
    endingRects.push({ x: bx, y: by, w: bw, h: bh, act: 'restart' });
  }

  let hoverLabel = null;

  function computeHover() {
    hoverLabel = null;
    if (G.state !== 'play' || paused || dialog.open || speech.current || G.inScript()) return;
    if (my >= UI_TOP) return;
    const pick = pickAt(mx, my);
    if (pick) {
      hoverLabel = pick.hs.label;
      hoverRects.push(hotspotBounds(pick.hs));
    }
  }

  function toLogical(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) / rect.width * W,
      y: (evt.clientY - rect.top) / rect.height * H,
    };
  }

function onClick(x, y, rightBtn) {
    AudioSys.init(); AudioSys.resume();

    if (window.GAME_EDITOR && window.GAME_EDITOR.active) {
      if (window.GAME_EDITOR.down(x, y)) return;
    }

    if (settingsOpen) {
      for (const r of settingsRects) {
        if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
          AudioSys.fx('click');
          if (r.key === '__back') settingsOpen = false;
          else Settings.cycle(r.key);
          return;
        }
      }
      return;
    }

    if (G.state === 'intro') {
      introStep++;
      AudioSys.fx('click');
      if (introStep >= INTRO_PANELS.length) {
        G.state = 'play';
        enterRoom(GAME.start.room, GAME.start.x, GAME.start.y);
        if (GAME.start.script) G.script(GAME.start.script);
      }
      return;
    }
    if (G.state === 'title') {
      if (aboutOpen) { aboutOpen = false; return; }
      for (const r of titleRects) {
        if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
          AudioSys.fx('click');
          if (r.act === 'new') G.newGame();
          else if (r.act === 'continue') G.loadGame();
          else if (r.act === 'about') aboutOpen = true;
          else if (r.act === 'settings') { settingsOpen = true; settingsFrom = 'title'; }
          return;
        }
      }
      return;
    }
    if (G.state === 'ending') {
      for (const r of endingRects) {
        if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
          AudioSys.fx('click');
          G.state = 'title';
        }
      }
      return;
    }

    if (paused) {
      for (const r of pauseRects) {
        if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
          AudioSys.fx('click');
          if ((r.act === 'save' || r.act === 'load') && G.inScript()) {
            toast('Not during a cutscene.');
            return;
          }
          if (r.act === 'resume') paused = false;
          else if (r.act === 'settings') { settingsOpen = true; settingsFrom = 'pause'; }
          else if (r.act === 'save') { G.saveGame(); paused = false; toast('Game saved.'); }
          else if (r.act === 'load') { G.loadGame(); toast('Game loaded.'); }
          else if (r.act === 'music') Settings.cycle('music');
          else if (r.act === 'sfx') Settings.cycle('sfx');
          else if (r.act === 'title') { G.state = 'title'; paused = false; aboutOpen = false; AudioSys.stopMusic(); AudioSys.startMusic('title'); }
          return;
        }
      }
      return;
    }

    if (speech.current) { advanceSpeech(); return; }

    if (dialog.open) {
      if (dialog.dirty) {
        for (const r of dialog.rects) {
          if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
            AudioSys.fx('click');
            if (r.opt === '__exit__') { G.closeDialog(); return; }
            r.opt._used = true;
            r.opt.effect();
            return;
          }
        }
      }
      return;
    }

    if (my >= UI_TOP) {
      for (const r of uiClicks) {
        if (rightBtn) break;
        if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
          if (r.act === 'verb') { activeVerb = r.id; AudioSys.fx('click'); return; }
          if (r.act === 'invpage') { invPage += r.dir; AudioSys.fx('click'); return; }
          if (r.act === 'invitem') {
            if (selectedItem === r.id) { selectedItem = null; }
            else if (selectedItem) { const other = selectedItem; selectedItem = null; tryCombine(other, r.id); }
            else {
              const wearItem = GAME.wearable && GAME.wearable.itemId;
              if (wearItem && r.id === wearItem) {
                G.toggleWear();
                toast(G.worn ? (GAME.wearable.toastOn || 'Worn.') : (GAME.wearable.toastOff || 'Removed.'));
              }
              else { selectedItem = r.id; }
            }
            AudioSys.fx('click');
            return;
          }
        }
      }
      if (selectedItem && rightBtn) { selectedItem = null; return; }
      return;
    }

    if (rightBtn) {
      if (selectedItem) { selectedItem = null; return; }
      const pick = pickAt(x, y);
      if (pick) {
        const savedVerb = activeVerb;
        activeVerb = 'look';
        executeVerb(pick);
        activeVerb = savedVerb;
      }
      return;
    }

    if (G.inScript()) return;

    const pick = pickAt(x, y);
    if (pick) {
      if (activeVerb === 'walk') {
        const wxp = pick.hs.standX !== undefined ? pick.hs.standX : pick.hs.x + pick.hs.w / 2;
        const wyp = pick.hs.standY !== undefined ? pick.hs.standY : pick.hs.y + pick.hs.h + 10;
        const wp = walkableClamp(wxp, wyp);
        walkTo(wp.x, wp.y);
        return;
      }
      const sx = pick.hs.standX !== undefined ? pick.hs.standX : pick.hs.x + pick.hs.w / 2;
      const sy = pick.hs.standY !== undefined ? pick.hs.standY : pick.hs.y + pick.hs.h + 10;
      const standPt = walkableClamp(
        sx + (player.x > sx ? 46 : -46) * (pick.kind === 'npc' ? 1 : 0),
        sy
      );
      if (Math.hypot(player.x - sx, player.y - sy) > 60 || pick.kind === 'npc') {
        walkTo(standPt.x, standPt.y);
        pendingAction = { kind: pick.kind, hs: pick.hs, npc: pick.npc, entry: pick };
      } else {
        executeVerb(pick);
      }
    } else {
      pendingAction = null;
      walkTo(x, y);
    }
  }

  let toastMsg = null, toastT = 0;
  function toast(msg) {
    toastMsg = msg; toastT = 2.4;
  }

  let crashMsg = null;

  function loop(ts) {
    const dt = Math.min(0.05, (ts - lastTime) / 1000 || 0.016);
    lastTime = ts;
    try {
      if (G.state === 'play' && !paused) { update(dt); }
      else tGlobal += dt * 0.4;
      if (toastT > 0) toastT -= dt;
      computeHover();
      render();
if (toastMsg && toastT > 0) {
        ctx.font = 'bold 18px Verdana, sans-serif';
        ctx.textAlign = 'center';
        const tw = ctx.measureText(toastMsg).width;
        ctx.fillStyle = 'rgba(8,8,12,0.8)';
        roundRect(ctx, W / 2 - tw / 2 - 18, 84, tw + 36, 36, 8);
        ctx.fill();
        ctx.fillStyle = '#ffe9a8';
        ctx.fillText(toastMsg, W / 2, 108);
        ctx.textAlign = 'left';
      }
      if (window.GAME_EDITOR && window.GAME_EDITOR.active) {
        window.GAME_EDITOR.render(ctx);
      }
    } catch (e) {
      console.error('[RING & WRONG] frame error:', e);
      crashMsg = (e && e.message) ? e.message : String(e);
    }
    if (crashMsg) {
      ctx.font = 'bold 16px Verdana, sans-serif';
      ctx.textAlign = 'center';
      const tw = ctx.measureText(crashMsg).width;
      ctx.fillStyle = 'rgba(40,6,6,0.85)';
      roundRect(ctx, W / 2 - tw / 2 - 14, 8, tw + 28, 30, 6);
      ctx.fill();
      ctx.fillStyle = '#ff9a8a';
      ctx.fillText('Feil: ' + crashMsg + ' (se konsoll â€“ F12)', W / 2, 28);
    }
    requestAnimationFrame(loop);
  }

  G.toast = toast;

  function resize() {
    const winW = window.innerWidth, winH = window.innerHeight;
    const mode = Settings.data.display;
    if (mode === 'fill') {
      canvas.style.width = winW + 'px';
      canvas.style.height = winH + 'px';
    } else if (mode === 'pixel') {
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
    } else {
      const s = Math.min(winW / W, winH / H);
      canvas.style.width = Math.floor(W * s) + 'px';
      canvas.style.height = Math.floor(H * s) + 'px';
    }
  }

  G.boot = (cv) => {
    canvas = cv;
    Settings.onApply = () => { Game.difficulty = Settings.data.difficulty; resize(); };
    Settings.load();
    ctx = canvas.getContext('2d');
    console.log('%cRING & WRONG ' + GAME_VERSION + '  (difficulty: ' + Settings.data.difficulty + ', display: ' + Settings.data.display + ')', 'color:#8ee06a;font-weight:bold');
    ctx.imageSmoothingEnabled = false;
    G._low = document.createElement('canvas');
    G._low.width = LOW_W; G._low.height = LOW_H;
    G._lctx = G._low.getContext('2d');
    G._lctx.imageSmoothingEnabled = false;
    G._lctx.setTransform(KX, 0, 0, KY, 0, 0);
    G._bgImages = {};
    if (typeof Image !== 'undefined' && window.ROOMS) {
      Object.keys(window.ROOMS).forEach(id => {
        const img = new Image();
        img.onload = () => {
          G._bgImages[id] = img;
          if (G.roomId === id) buildBg(id);
        };
        if (window.ART_DATA && window.ART_DATA[id]) {
          img.src = window.ART_DATA[id];
        } else {
          const exts = ['png', 'jpeg', 'jpg'];
          let extIdx = 0;
          img.onerror = () => {
            extIdx += 1;
            if (extIdx < exts.length) img.src = GAME.assets.artPath + id + '.' + exts[extIdx];
          };
          img.src = GAME.assets.artPath + id + '.' + exts[0];
        }
      });
    }
    resize();
    window.addEventListener('resize', resize);
canvas.addEventListener('mousemove', evt => {
      const p = toLogical(evt);
      mx = p.x; my = p.y; mouseInside = true;
      if (window.GAME_EDITOR) window.GAME_EDITOR.move(p.x, p.y);
    });
    canvas.addEventListener('mouseup', evt => {
      if (window.GAME_EDITOR) window.GAME_EDITOR.up();
    });
    canvas.addEventListener('mouseleave', () => { mouseInside = false; });
    canvas.addEventListener('contextmenu', evt => evt.preventDefault());
    canvas.addEventListener('mousedown', evt => {
      evt.preventDefault();
      const p = toLogical(evt);
      onClick(p.x, p.y, evt.button === 2);
    });
    window.addEventListener('keydown', evt => {
      if (evt.key === 'Escape') {
        if (settingsOpen) { settingsOpen = false; AudioSys.fx('click'); }
        else if (G.state === 'play') { paused = !paused; AudioSys.fx('click'); }
      }
if (evt.key === 'n' || evt.key === 'N') {
        G._debugNpcs = !G._debugNpcs;
      }
      if (evt.key === 'e' || evt.key === 'E') {
        if (G.state === 'play' && window.GAME_EDITOR) {
          window.GAME_EDITOR.active = !window.GAME_EDITOR.active;
          AudioSys.fx('click');
        }
      }
      if (evt.key === ' ') {
        if (speech.current) { advanceSpeech(); evt.preventDefault(); }
      }
    });
    AudioSys.startMusic('title');
    requestAnimationFrame(loop);
  };

  return G;
})();
