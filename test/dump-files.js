const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const FILES = [...src.matchAll(/src="((?:engine|games)\/[^"?]+)/g)].map(m => m[1].replace(/\.js$/, ''));
console.log(FILES.join('\n'));
