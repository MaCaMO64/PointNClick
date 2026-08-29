const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const FILES = [...src.matchAll(/src="(js\/[^?"]+)/g)].map(m => m[1].replace(/^js\//, '').replace(/\.js$/, ''));
const ctx = { window: {}, console, performance };
ctx.window = ctx;
vm.createContext(ctx);
FILES.forEach(f => {
  if (f === 'engine' || f === 'main') return;
  try {
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
  } catch (e) {
    console.log('FAIL', f, e.message);
    process.exit(1);
  }
});
console.log('ALL LOAD OK');
console.log('GAME_ICONS fløyte:', ctx.GAME_ICONS ? !!ctx.GAME_ICONS['fløyte'] : 'GAME_ICONS missing');