const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
  const indexSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const FILES = [...indexSrc.matchAll(/src="((?:engine|games)\/[^"?]+)/g)].map(m => m[1].replace(/\.js$/, '')).filter(f => !['engine/engine', 'engine/main'].includes(f));

let errors = 0;
let warnings = 0;
const err = (m) => { console.log('  [FEIL] ' + m); errors++; };
const warn = (m) => { console.log('  [ADVAR] ' + m); warnings++; };

const ctx = { window: {}, console, performance };
ctx.window = ctx;
vm.createContext(ctx);
FILES.forEach(f => {
  const src = fs.readFileSync(path.join(ROOT, f + '.js'), 'utf8');
  try {
    vm.runInContext(src, ctx, { filename: f + '.js' });
    if (f.includes('game-icons')) console.log('[dbg] GAME_ICONS after load:', typeof ctx.window.GAME_ICONS, ctx.window.GAME_ICONS ? Object.keys(ctx.window.GAME_ICONS).length : '-');
    if (f === 'games/ring-and-wrong/data') console.log('[dbg] before data: GI=', typeof ctx.GAME_ICONS, typeof ctx.window.GAME_ICONS, 'ctx===window:', ctx === ctx.window);
  }
  catch (e) { err(f + '.js kunne ikke lastes: ' + e.message); }
});

const ROOMS = ctx.window.ROOMS || {};
const ITEMS = ctx.window.ITEMS || {};
const DEFS = ctx.window.NPC_DEFS || {};

console.log('\n=== RING & WRONG - structural validation ===\n');

if (!ITEMS || Object.keys(ITEMS).length === 0) err('ITEMS catalog is empty');
Object.entries(ITEMS).forEach(([id, it]) => {
  if (!it.name || typeof it.name !== 'string') err('Item "' + id + '" missing name');
  if (typeof it.icon !== 'function') err('Item "' + id + '" missing icon function');
});

const roomIds = new Set(Object.keys(ROOMS));
if (!roomIds.has('dal')) err('Start room "dal" does not exist');

const VERB_KEYS = ['look', 'take', 'use', 'talk'];
const flagsSet = new Set(['questStarted']);
const flagsRead = new Set();

const roomSources = {};
FILES.forEach(f => {
  const src = fs.readFileSync(path.join(ROOT, f + '.js'), 'utf8');
  const re = /window\.ROOMS\.([a-zA-Z]+)\s*=\s*\{/g;
  let m;
  const marks = [];
  while ((m = re.exec(src))) marks.push({ id: m[1], start: m.index });
  marks.forEach((mk, i) => {
    const end = i + 1 < marks.length ? marks[i + 1].start : src.length;
    roomSources[mk.id] = src.slice(mk.start, end);
  });
});

Object.entries(roomSources).forEach(([rid, s]) => {
  let m;
  const reSet = /\.setFlag\(\s*['"]([a-zA-Z]+)['"]/g;
  while ((m = reSet.exec(s))) flagsSet.add(m[1]);
  const reFlagStep = /\{\s*flag:\s*\[\s*['"]([a-zA-Z]+)['"]/g;
  while ((m = reFlagStep.exec(s))) flagsSet.add(m[1]);
  const reReadRoom = /\.flag\(\s*['"]([a-zA-Z]+)['"]/g;
  while ((m = reReadRoom.exec(s))) flagsRead.add(m[1]);
});
['npcs1.js', 'npcs2.js'].forEach(f => {
  const src = fs.readFileSync(path.join(ROOT, 'games', 'ring-and-wrong', f), 'utf8');
  let m;
  const reSet = /\.setFlag\(\s*['"]([a-zA-Z]+)['"]/g;
  while ((m = reSet.exec(src))) flagsSet.add(m[1]);
  const reRead = /\.flag\(\s*['"]([a-zA-Z]+)['"]/g;
  while ((m = reRead.exec(src))) flagsRead.add(m[1]);
  const reStepFlag = /\{\s*flag:\s*\[\s*['"]([a-zA-Z]+)['"]/g;
  while ((m = reStepFlag.exec(src))) flagsSet.add(m[1]);
});

Object.entries(ROOMS).forEach(([rid, room]) => {
  console.log('ROOM: ' + rid + ' ("' + (room.name || '?') + '")');
  if (room.id !== rid) err(rid + ': room.id mismatch');
  if (typeof room.paint !== 'function') err(rid + ': missing paint()');
  if (!room.walk || typeof room.walk.minY !== 'number' || typeof room.walk.maxY !== 'number') err(rid + ': invalid walk band');
  if (!Array.isArray(room.hotspots)) { err(rid + ': hotspots array missing'); return; }
  if (!Array.isArray(room.npcs)) warn(rid + ': no npcs array');

  const seen = new Set();
  room.hotspots.forEach(hs => {
    if (!hs.id) { err(rid + ': hotspot without id'); return; }
    if (seen.has(hs.id)) err(rid + ': duplicate hotspot id "' + hs.id + '"');
    seen.add(hs.id);
    ['x', 'y', 'w', 'h'].forEach(k => {
      if (typeof hs[k] !== 'number') err(rid + '/' + hs.id + ': ' + k + ' is not a number');
      else if (hs[k] < -20) err(rid + '/' + hs.id + ': ' + k + ' far outside canvas');
    });
    if (hs.x > 1280 || hs.y > 720) err(rid + '/' + hs.id + ': outside canvas bounds');
    if (!hs.label) err(rid + '/' + hs.id + ': missing label');
    const acts = hs.verbs || {};
    Object.keys(acts).forEach(v => {
      if (!VERB_KEYS.includes(v)) err(rid + '/' + hs.id + ': unknown verb "' + v + '"');
      else {
        const val = acts[v];
        if (typeof val !== 'string' && typeof val !== 'function') err(rid + '/' + hs.id + ': verb "' + v + '" must be string or function');
      }
    });
    if (Object.keys(acts).length === 0 && !hs.itemActions) warn(rid + '/' + hs.id + ': no verbs and no itemActions (dead spot?)');
    if (hs.itemActions) Object.keys(hs.itemActions).forEach(iid => {
      if (!ITEMS[iid]) err(rid + '/' + hs.id + ': itemAction points at unknown item "' + iid + '"');
    });
  });

  (room.npcs || []).forEach((entry) => {
    const ref = entry.ref;
    if (!DEFS[ref]) { err(rid + ': npc ref "' + ref + '" not found in NPC_DEFS'); return; }
    if (typeof entry.x !== 'number' || typeof entry.y !== 'number') err(rid + ': npc "' + ref + '" missing x/y');
    if (typeof DEFS[ref].draw !== 'function') err(rid + ': npc "' + ref + '" missing draw()');
    if (DEFS[ref].itemActions) Object.keys(DEFS[ref].itemActions).forEach(iid => {
      if (!ITEMS[iid]) err(rid + ': npc "' + ref + '" itemAction points at unknown item "' + iid + '"');
    });
  });

  if (room.onEnter && typeof room.onEnter !== 'function') err(rid + ': onEnter is not a function');
  if (room.onRingToggle && typeof room.onRingToggle !== 'function') err(rid + ': onRingToggle is not a function');
});

console.log('\nGRAPH / EXITS:');
const edges = [];
Object.entries(roomSources).forEach(([rid, s]) => {
  const re = /goto\(\s*['"]([a-zA-Z]+)['"]/g;
  let m;
  while ((m = re.exec(s))) edges.push([rid, m[1]]);
  const re2 = /goto:\s*\{\s*room:\s*['"]([a-zA-Z]+)['"]/g;
  while ((m = re2.exec(s))) edges.push([rid, m[1]]);
  const re3 = /goto:\s*\{[^}]*'([a-zA-Z]+)'[^}]*\}/g;
  while ((m = re3.exec(s))) if (!edges.some(e => e[0] === rid && e[1] === m[1])) edges.push([rid, m[1]]);
});
edges.forEach(([from, to]) => {
  if (!roomIds.has(to)) err(from + ': goto points at unknown room "' + to + '"');
  else console.log('  ' + from + ' -> ' + to);
});

const visited = new Set();
if (roomIds.has('dal')) {
  const q = ['dal'];
  while (q.length) {
    const cur = q.shift();
    if (visited.has(cur)) continue;
    visited.add(cur);
    edges.forEach(([from, to]) => { if (from === cur && !visited.has(to)) q.push(to); });
  }
  roomIds.forEach(r => { if (!visited.has(r)) warn('Room "' + r + '" cannot be reached from start (static analysis)'); });
}

console.log('\nFLAGS:');
flagsRead.forEach(f => {
  if (!flagsSet.has(f)) warn('Flag "' + f + '" is read but never set');
});

console.log('\n=== RESULT: ' + (errors === 0 ? 'PASS' : 'FAIL') + ' (' + errors + ' errors, ' + warnings + ' warnings) ===');
process.exit(errors === 0 ? 0 : 1);
