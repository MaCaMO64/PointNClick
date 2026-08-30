/**
 * story-tool.js — enkelt historieverktøy inspirert av AGS «Dialog Editor» og Escoria «dialogue resources».
 *
 *  node tools/story-tool.js dump    → leser all historietekst fra spillpakken → games/<spill>/story/story.json (UTF-8)
 *  node tools/story-tool.js list    → skriver oversikt over alle tekster til konsollen
 *  node tools/story-tool.js build   → skriver endrede tekster i story.json tilbake i kildefilene
 *  node tools/story-tool.js build --dry  → viser hva som VILLE blitt skrevet uten å endre filer
 *
 * Bare «data»-tekster (intro, endings, item-navn, npc navn/look/take, hotspot-verbs) skrives tilbake.
 * Dialoger (talk/sayLines/openDialog) dumps for oversikt, men redigeres i JS-filene direkte.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const GAME_DIR = path.join(ROOT, 'games', 'ring-and-wrong');
const STORY_JSON = path.join(GAME_DIR, 'story', 'story.json');

const LIST = ['dump', 'list', 'build'];
const cmd = process.argv[2];
const isDry = process.argv.includes('--dry');
if (!LIST.includes(cmd)) {
  console.log('Bruk: node tools/story-tool.js ' + LIST.join(' | ') + ' [--dry]');
  process.exit(1);
}

// ---- vm-sandbox for å parse spillpakken (som validate/smoke) ----
const stubGame = new Proxy({}, {
  get(t, p) {
    if (!(p in t)) t[p] = () => ({});
    return t[p];
  },
});
const sandbox = { console, window: null, Game: stubGame };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const FILES = [...indexHtml.matchAll(/src="((?:engine|games)\/[^"?]+)/g)].map(m => m[1].replace(/\.js$/, ''))
  .filter(f => f.startsWith('games/ring-and-wrong') || f === 'engine/art');

// attribusjon: hvilke ROOMS-/NPC_DEFS-id-er bidrar hver fil med
const roomFile = {};   // roomId -> filnavn
const npcFile = {};    // npcId -> filnavn
FILES.forEach(f => {
  const beforeR = new Set(Object.keys(sandbox.ROOMS || {}));
  const beforeN = new Set(Object.keys(sandbox.NPC_DEFS || {}));
  const src = fs.readFileSync(path.join(ROOT, f + '.js'), 'utf8');
  vm.runInContext(src, sandbox, { filename: f + '.js' });
  const fname = path.basename(f) + '.js';
  Object.keys(sandbox.ROOMS || {}).forEach(id => { if (!beforeR.has(id)) roomFile[id] = fname; });
  Object.keys(sandbox.NPC_DEFS || {}).forEach(id => { if (!beforeN.has(id)) npcFile[id] = fname; });
});

// ---- ekstraksjon ----
const GAME = sandbox.GAME;
const ITEMS = sandbox.ITEMS || {};
const NPC_DEFS = sandbox.NPC_DEFS || {};
const ROOMS = sandbox.ROOMS || {};

function fileOf(name) { return name === 'game.js' ? 'games/ring-and-wrong/game.js' : 'games/ring-and-wrong/' + name; }
function strLit(s) {
  if (typeof s !== 'string') return null;
  return s.indexOf('\'') >= 0 ? '"' + s.replace(/"/g, '\\"') + '"' : '\'' + s + '\'';
}

// tekst-poster: { key, file, old }
const texts = [];
function add(key, file, old) {
  if (typeof old !== 'string' || !old) return;
  texts.push({ key, file, old });
}

// game.js: intro (paneler av linjer), endings, start.script
if (GAME) {
  if (Array.isArray(GAME.intro)) {
    GAME.intro.forEach((panel, pi) => {
      if (Array.isArray(panel)) panel.forEach((line, li) => add('intro:' + pi + ':' + li, fileOf('game.js'), line));
    });
  }
  const E = GAME.endings || {};
  ['good', 'bad'].forEach(type => {
    const e = E[type];
    if (!e) return;
    if (e.title) add('endings:' + type + ':title', fileOf('game.js'), e.title);
    (e.lines || []).forEach((l, i) => add('endings:' + type + ':lines:' + i, fileOf('game.js'), l));
    (e.script || []).forEach((st, i) => {
      if (st && st.say && Array.isArray(st.say)) add('endings:' + type + ':script:' + i, fileOf('game.js'), st.say[1]);
    });
  });
  (GAME.start && GAME.start.script || []).forEach((st, i) => {
    if (st && st.say && Array.isArray(st.say)) add('start:script:' + i, fileOf('game.js'), st.say[1]);
  });
}

// items
Object.keys(ITEMS).forEach(id => {
  const it = ITEMS[id];
  if (it && it.name) add('items:' + id + ':name', fileOf('data.js'), it.name);
});

// npcs (data-felt: navn/look/take; dialoger dumps readonly under talk)
Object.keys(NPC_DEFS).forEach(id => {
  const n = NPC_DEFS[id];
  if (!n) return;
  const nfile = fileOf(npcFile[id] || 'npcs1.js');
  if (n.name) add('npcs:' + id + ':name', nfile, n.name);
  if (n.look) add('npcs:' + id + ':look', nfile, n.look);
  if (n.take && typeof n.take === 'string') add('npcs:' + id + ':take', nfile, n.take);
  if (typeof n.use === 'function') {
    const m = /Game\.say\(\s*['"]([^'"]+)['"]\s*,\s*['"]((?:[^'"]|\\['"])+)['"]\s*\)/.exec(n.use.toString());
    if (m) add('npcs:' + id + ':use', nfile, m[2]);
  }
  if (typeof n.talk === 'function') {
    const src = n.talk.toString();
    let i = 0;
    // sayLines([[who, text], ...])
    const slRe = /\[(?:'|")([^'"]+)(?:'|")\s*,\s*(?:'|")((?:[^'"]|\\['"])+)(?:'|")\]/g;
    let m;
    while ((m = slRe.exec(src))) texts.push({ key: 'npcs:' + id + ':talk:say:' + i++, file: nfile, old: m[2], readonly: true });
    // openDialog option texts
    const optRe = /text:\s*(?:'|")((?:[^'"]|\\['"])+)(?:'|")/g;
    let j = 0;
    while ((m = optRe.exec(src))) texts.push({ key: 'npcs:' + id + ':talk:opt:' + j++, file: nfile, old: m[1], readonly: true });
    // enkelt Game.say('who', 'text')
    const sayRe = /Game\.say\(\s*['"]([^'"]+)['"]\s*,\s*(?:'|")((?:[^'"]|\\['"])+)(?:'|")\s*\)/g;
    let k = 0;
    while ((m = sayRe.exec(src))) texts.push({ key: 'npcs:' + id + ':talk:say:' + k++, file: nfile, old: m[2], readonly: true });
  }
});

// rooms: hotspot label + verbs
Object.keys(ROOMS).forEach(rid => {
  const room = ROOMS[rid];
  if (!room || !Array.isArray(room.hotspots)) return;
  room.hotspots.forEach(hs => {
    const base = 'rooms:' + rid + ':hs:' + hs.id;
    if (hs.label) add(base + ':label', fileOf(roomFile[rid] || 'rooms1.js'), hs.label);
    const v = hs.verbs || {};
    ['look', 'use', 'take'].forEach(verb => {
      const val = v[verb];
      if (typeof val === 'string') add(base + ':' + verb, fileOf(roomFile[rid] || 'rooms1.js'), val);
    });
  });
});

// ---- kommandoer ----
function dump() {
  fs.mkdirSync(path.dirname(STORY_JSON), { recursive: true });
  const doc = {
    meta: { game: GAME && GAME.meta && GAME.meta.title, version: GAME && GAME.meta && GAME.meta.version, generated: new Date().toISOString() },
    howto: 'Rediger .new-felt, så kjør node tools/story-tool.js build. Bildefelter (name/look/verbs/intro/endings) skrives tilbake. Dialoger (readonly) redigeres i JS-filene.',
    texts,
  };
  fs.writeFileSync(STORY_JSON, JSON.stringify(doc, null, 2), 'utf8');
  console.log('dump → games/ring-and-wrong/story/story.json (' + texts.length + ' tekster)');
}

function list() {
  texts.forEach(t => console.log((t.readonly ? '[d] ' : '    ') + t.key + '  ←  ' + t.old.slice(0, 60)));
  console.log('\n' + texts.length + ' tekster totalt.');
}

function build() {
  if (!fs.existsSync(STORY_JSON)) { console.log('Mangler games/<spill>/story/story.json — kjør dump først.'); process.exit(1); }
  const doc = JSON.parse(fs.readFileSync(STORY_JSON, 'utf8'));
  const edits = []; const skipped = [];
  doc.texts.forEach(t => {
    if (t.readonly) return;
    if (t.new === undefined || t.new === t.old) return;
    if (t.new == null) { skipped.push([t.key, 'tom new']); return; }
    const file = path.join(ROOT, t.file);
    let content = fs.readFileSync(file, 'utf8');
    let count = 0; let idx = -1;
    for (let p = 0; (p = content.indexOf(t.old, p)) !== -1; p += t.old.length) { count++; idx = p; }
    if (count !== 1) { skipped.push([t.key, 'fant ' + count + ' treff (må være nøyaktig 1) — rediger manuelt']); return; }
    content = content.slice(0, idx) + t.new + content.slice(idx + t.old.length);
    if (isDry) { edits.push([t.key, t.old.slice(0, 40) + ' → ' + t.new.slice(0, 40)]); }
    else { fs.writeFileSync(file, content, 'utf8'); edits.push([t.key, t.old.slice(0, 40) + ' → ' + t.new.slice(0, 40)]); }
  });
  console.log((isDry ? 'DRY-RUN (ikke skrevet):\n' : 'Skrevet:\n'));
  edits.forEach(e => console.log('  ✔ ' + e[0] + '\n    ' + e[1]));
  console.log('\nSkippet (' + skipped.length + '):');
  skipped.forEach(s => console.log('  ! ' + s[0] + ' — ' + s[1]));
  if (!isDry && edits.length) {
    doc.texts.forEach(t => { if (t.new !== undefined) t.old = t.new; delete t.new; });
    fs.writeFileSync(STORY_JSON, JSON.stringify(doc, null, 2), 'utf8');
    console.log('\nstory.json oppdatert (old = new).');
  }
}

({ dump, list, build })[cmd]();