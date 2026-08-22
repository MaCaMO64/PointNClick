const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

const gradientStub = () => ({ addColorStop() {} });

function makeCtx(canvas) {
  const target = {};
  const fin = (...ns) => { ns.forEach(n => { if (!Number.isFinite(n)) throw new TypeError('NonFinite canvas arg'); }); };
  const pos = (n) => { fin(n); if (n < 0) throw new DOMExceptionMock(); };
  function DOMExceptionMock() { this.message = 'IndexSizeError'; this.name = 'IndexSizeError'; }
  return new Proxy(target, {
    get(t, prop) {
      if (prop === 'canvas') return canvas;
      switch (prop) {
        case 'arc':
        case 'ellipse':
          return (x, y, ...rest) => { fin(x, y); const radii = prop === 'ellipse' ? [rest[0], rest[1]] : [rest[0]]; radii.forEach(pos); t[prop] = () => {}; };
        case 'arcTo':
          return (x1, y1, x2, y2, r) => { fin(x1, y1, x2, y2); pos(r); t.arcTo = () => {}; };
        case 'createLinearGradient':
          return (x0, y0, x1, y1) => { fin(x0, y0, x1, y1); return gradientStub(); };
        case 'createRadialGradient':
          return (x0, y0, r0, x1, y1, r1) => { fin(x0, y0, x1, y1); pos(r0); pos(r1); return gradientStub(); };
        case 'measureText':
          return (s) => ({ width: String(s == null ? '' : s).length * 8 });
        default:
          break;
      }
      if (!(prop in t)) t[prop] = () => {};
      return t[prop];
    },
    set(t, prop, v) { t[prop] = v; return true; },
  });
}

function makeCanvas(id) {
  const listeners = {};
  const canvas = {
    id,
    width: 0,
    height: 0,
    style: {},
    listeners,
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    removeEventListener() {},
    getBoundingClientRect() { return { left: 0, top: 0, width: 1280, height: 720 }; },
    getContext() { if (!canvas._ctx) canvas._ctx = makeCtx(canvas); return canvas._ctx; },
  };
  return canvas;
}

const sandbox = {
  console,
  performance,
  setTimeout,
  setInterval,
  clearTimeout,
  clearInterval,
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.window.addEventListener = () => {};
sandbox.window.removeEventListener = () => {};
sandbox.document = {
  createElement(tag) { return makeCanvas(tag); },
  getElementById(id) {
    if (!sandbox.document._root) sandbox.document._root = makeCanvas(id);
    return sandbox.document._root;
  },
};
sandbox.localStorage = (() => {
  const store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
})();
let rafQueue = [];
sandbox.requestAnimationFrame = (cb) => { rafQueue.push(cb); return rafQueue.length; };
sandbox.window.innerWidth = 1600;
sandbox.window.innerHeight = 900;

let clock = 0;
let fatal = null;
function pump(frames) {
  for (let i = 0; i < frames; i++) {
    clock += 16.7;
    const q = rafQueue;
    rafQueue = [];
    q.forEach(cb => {
      try { cb(clock); }
      catch (e) {
        fatal = e;
        throw e;
      }
    });
    if (fatal) throw fatal;
  }
}

function click(x, y, rightBtn = false) {
  const hs = sandbox.document.getElementById('game').listeners.mousedown || [];
  hs.forEach(fn => fn({
    clientX: x, clientY: y,
    button: rightBtn ? 2 : 0,
    preventDefault() {},
  }));
}

vm.createContext(sandbox);
const FILES = ['audio', 'art', 'scenes', 'data', 'npcs1', 'npcs2', 'rooms1', 'rooms2', 'rooms3', 'engine', 'main'];
try {
  FILES.forEach(f => {
    const src = fs.readFileSync(path.join(ROOT, 'js', f + '.js'), 'utf8');
    vm.runInContext(src, sandbox, { filename: f + '.js' });
  });
  } catch (e) {
    console.log('LOAD FAILURE in', e.stack && e.stack.split('\n')[0]);
    process.exit(1);
  }
  vm.runInContext('window.Game = Game; window.AudioSys = AudioSys;', sandbox);

console.log('== BOOT ==');
pump(5);

console.log('== TITLE: klikk NYTT EVENTYR ==');
click(640, 460);
pump(3);
console.log('state etter tittel:', sandbox.Game.state);

console.log('== INTRO: 3 klikk ==');
for (let i = 0; i < 3; i++) { click(640, 360); pump(3); }
console.log('state etter intro:', sandbox.Game.state, '| rom:', sandbox.Game.roomId);
pump(120);

console.log('== ADVANCE SPEECH (narrasjon ma bli synlig, sa laases input opp) ==');
pump(20);
if (!sandbox.Game._debugSpeech() && !sandbox.Game._debugQueue()) {
  console.log('FEIL: ingen replikk ble startet etter intro (klassisk deadlock)!'); process.exit(1);
}
console.log('  narrasjon synlig OK');
for (let i = 0; i < 80 && sandbox.Game.inScript(); i++) { click(640, 200); pump(8); }
pump(10);
if (sandbox.Game.inScript()) { console.log('FEIL: input forble laast – script hang evig!'); process.exit(1); }
console.log('  input laast opp OK');

console.log('== INTERAKSJON: se pa vedstabbel (ma gi replikk) ==');
click(130, 520);
pump(60);
let spoke = sandbox.Game._debugSpeech();
for (let i = 0; i < 25 && !spoke; i++) { pump(10); spoke = sandbox.Game._debugSpeech(); }
if (!spoke) { console.log('FEIL: hotspot ga ingen synlig replikk!'); process.exit(1); }
console.log('  hotspot-respons OK');
for (let i = 0; i < 30 && (sandbox.Game._debugSpeech() || sandbox.Game._debugQueue()); i++) { click(640, 200); pump(8); }

console.log('== BESØK ALLE ROM ==');
const rooms = Object.keys(sandbox.ROOMS);
rooms.forEach(r => {
  try {
    sandbox.Game.goto(r, 400, 500);
    pump(10);
    console.log('  rom OK:', r);
  } catch (e) {
    console.log('  ROM-KRASJ:', r, '->', e.message);
    console.log(e.stack.split('\n').slice(0, 4).join('\n'));
    process.exit(1);
  }
});

console.log('== NPC-SNAKK (rask gjennomgang) ==');
const talks = [
  () => sandbox.NPC_DEFS.bongo.talk(),
  () => sandbox.NPC_DEFS.perr.talk(),
  () => sandbox.NPC_DEFS.dora.talk(),
  () => sandbox.NPC_DEFS.halvor.talk(),
  () => sandbox.NPC_DEFS.rando.talk(),
  () => sandbox.NPC_DEFS.grim.talk(),
  () => sandbox.NPC_DEFS.bjarne.talk(),
  () => sandbox.NPC_DEFS.goblin.itemActions['fløyte'](),
];
talks.forEach((t, i) => {
  try {
    sandbox.Game.closeDialog();
    sandbox.Game.inv = ['stokk', 'eple', 'ring', 'mynter', 'fløyte', 'pølse', 'øl', 'skje'];
    t();
    pump(30);
    for (let k = 0; k < 8; k++) { click(640, 200); pump(15); }
    console.log('  npc-dialog OK #' + (i + 1));
  } catch (e) {
    console.log('  NPC-KRASJ #' + (i + 1), '->', e.message);
    console.log(e.stack.split('\n').slice(0, 4).join('\n'));
    process.exit(1);
  }
});

console.log('== HOTSPOT-VERBER (alle rom, alle verber) ==');
Object.entries(sandbox.ROOMS).forEach(([rid, room]) => {
  sandbox.Game.goto(rid, 400, 500);
  pump(5);
  (room.hotspots || []).forEach(hs => {
    ['look', 'use', 'take'].forEach(v => {
      const val = (hs.verbs || {})[v];
      if (typeof val === 'function') {
        try { val(); pump(2); } catch (e) {
          console.log('  HOTSPOT-KRASJ:', rid + '/' + hs.id, v, '->', e.message);
          process.exit(1);
        }
      }
    });
  });
});
console.log('  alle hotspot-funksjoner OK');

console.log('\n=== RØYKTEST: PASS ===');
