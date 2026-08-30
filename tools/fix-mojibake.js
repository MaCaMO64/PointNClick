// fix-mojibake.js — reparerer dobbelt-encodet UTF-8 i spillpakken (en-tank, em-tank, ellipsis, ø)
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const map = [
  ['\u00c3\u00b8', '\u00f8'],   // Ã¸  -> ø  (0xC3 0xB8 mis-avkodet)
  ['\u00e2\u20ac\u00a6', '\u2026'], // â€¦ -> …  (ellipsis)
  ['\u00e2\u20ac\u201c', '\u2013'], // â€“ -> –  (en dash)
  ['\u00e2\u20ac\u201d', '\u2014'], // â€” -> —  (em dash)
];
const dir = path.join(ROOT, 'games', 'ring-and-wrong');
fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'art-data.js' && f !== 'music-data.js').forEach(f => {
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, 'utf8');
  let changed = 0;
  map.forEach(([a, b]) => {
    const n = s.split(a).length - 1;
    if (n) { s = s.split(a).join(b); changed += n; }
  });
  if (changed) { fs.writeFileSync(p, s, 'utf8'); console.log(f + ': ' + changed + ' tegn reparert'); }
});
['tools/build-art.js', 'games/ring-and-wrong/art-data.js'].forEach(p => {
  const full = path.join(ROOT, p);
  let s = fs.readFileSync(full, 'utf8');
  const n = s.split('\u00e2\u20ac\u201d').length - 1;
  if (n) { fs.writeFileSync(full, s.split('\u00e2\u20ac\u201d').join('\u2014'), 'utf8'); console.log(p + ': ' + n + ' tegn reparert'); }
});