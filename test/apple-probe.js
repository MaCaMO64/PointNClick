const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const FILES = [...src.matchAll(/src="(js\/[^?"]+)/g)].map(m => m[1].replace(/^js\//, '').replace(/\.js$/, '')).filter(f => f !== 'engine' && f !== 'main');
const ctx = { window: {}, console, performance, Math, Object, Array, Date };
ctx.window = ctx;
vm.createContext(ctx);
FILES.forEach(f => {
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', f + '.js'), 'utf8'), ctx, { filename: f + '.js' }); }
  catch (e) { console.log('LOAD FAIL', f, e.message); process.exit(1); }
});

// Reproduce: set appleGround flag, no eple, call ART.animDalUnder with a tracking canvas
let called = [];
const fakeCtx = new Proxy({}, {
  get(t, prop) {
    if (prop === 'arc') return (x, y, r) => called.push(['arc', x, y, r]);
    if (prop === 'fill') return () => called.push(['fill']);
    if (prop === 'beginPath') return () => called.push(['beginPath']);
    if (prop === 'fillStyle') return t.fillStyle;
    if (prop === 'strokeStyle') return t.strokeStyle;
    if (!(prop in t)) t[prop] = (...a) => { called.push([prop, ...a]); };
    return t[prop];
  },
  set(t, prop, v) { t[prop] = v; return true; },
});

// Minimal Game stub (engine needs DOM; scenes only uses flag/has)
const flags = { appleGround: true };
const G = {
  flags,
  inv: [],
  flag: (n) => !!flags[n],
  has: (id) => G.inv.includes(id),
  room: { _appleT: 9999 },
};
G.flags.appleGround = true;

try {
  ctx.window.ART.animDalUnder(fakeCtx, 1.0, G);
  const appleArcs = called.filter(x => x[0] === 'arc' && x[1] >= 950 && x[1] <= 1020 && x[2] >= 500 && x[2] <= 600);
  console.log('apple arcs found:', JSON.stringify(appleArcs));
  const filled = called.filter(x => x[0] === 'fill').length;
  console.log('total arc calls:', called.filter(x => x[0] === 'arc').length, '| fill calls:', filled);
} catch (e) {
  console.log('animDalUnder threw:', e.message);
  console.log('called so far:', JSON.stringify(called.slice(-10)));
}