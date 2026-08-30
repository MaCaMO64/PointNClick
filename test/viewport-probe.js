const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const FILES = [...src.matchAll(/src="((?:engine|games)\/[^?"]+)/g)].map(m => m[1].replace(/\.js$/, '')).filter(f => !['engine/engine', 'engine/main', 'engine/editor'].includes(f));
const ctx = { window: {}, console, performance, Math, Object, Array, Date };
ctx.window = ctx;
vm.createContext(ctx);
FILES.forEach(f => {
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, f + '.js'), 'utf8'), ctx, { filename: f + '.js' }); }
  catch (e) { console.log('LOAD FAIL', f, e.message); process.exit(1); }
});
// KX/KY live fra engine-const? engine filtrert. Beregn her:
const W = 1280, H = 720, UI_TOP = 624, LOW_W = 320, LOW_H = 156;
const KX = LOW_W / W, KY = LOW_H / UI_TOP;
// Blit-oppskalering: low -> canvas
const blitX = W / LOW_W, blitY = UI_TOP / LOW_H;
// world -> canvas nett
const netX = KX * blitX, netY = KY * blitY;
console.log('net vertical factor (world->canvas):', netY, '(forventet 1.0)');
console.log('net horizontal factor:', netX, '(forventet 1.0)');
// Apple: hotspot world (988,548) vs draw
const appleDraw = { x: 988, y: 548 };
const canvasY = appleDraw.y * netY;
console.log('apple world y=548 -> canvas y=', canvasY, '(hotspot forventer 548)');
console.log(KY === 0.25 ? 'KY=0.25 OK' : 'KY feil: ' + KY);