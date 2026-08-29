(function () {
  const LS_KEY = () => (window.GAME && GAME.meta && GAME.meta.storageKey || 'game') + '_hs_overrides';
  const E = {
    active: false,
    room: null,
    selId: null,
    drag: null,
    overrides: {},      // roomId -> { hsId -> patch|full | _walk: {minY,maxY} }
    hud: [],
    changed: false,
  };

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY());
      if (raw) E.overrides = JSON.parse(raw);
    } catch (e) { E.overrides = {}; }
  }
  function save() {
    try { localStorage.setItem(LS_KEY(), JSON.stringify(E.overrides)); } catch (e) {}
  }

  function mergeOverrides(room) {
    const src = (window.HOTSPOT_OVERRIDES && window.HOTSPOT_OVERRIDES[room.id]) || {};
    const local = E.overrides[room.id] || {};
    applyMerge(room, src);
    applyMerge(room, local);
    if (src._walk) applyWalk(room, src._walk);
    if (local._walk) applyWalk(room, local._walk);
  }
  function applyMerge(room, src) {
    Object.keys(src).forEach(id => {
      if (id === '_walk') return;
      const def = src[id];
      const hs = room.hotspots.find(h => h.id === id);
      if (hs) { Object.assign(hs, def); }
      else if (def && typeof def === 'object') {
        room.hotspots.push(Object.assign({ id, verbs: {}, itemActions: {} }, def));
      }
    });
  }
  function applyWalk(room, w) {
    if (!room.walk) room.walk = {};
    if (typeof w.minY === 'number') room.walk.minY = w.minY;
    if (typeof w.maxY === 'number') room.walk.maxY = w.maxY;
  }

  function roomPatch(room) {
    if (!E.overrides[room.id]) E.overrides[room.id] = {};
    return E.overrides[room.id];
  }

  function onRoom(room) {
    E.room = room;
    E.selId = null;
    E.drag = null;
    mergeOverrides(room);
  }

  function pointIn(r, x, y) {
    return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
  }
  function handlePos(hs, corner) {
    const cx = corner.includes('e') ? hs.x + hs.w : hs.x;
    const cy = corner.includes('s') ? hs.y + hs.h : hs.y;
    return { x: cx, y: cy };
  }

  function down(x, y) {
    if (!E.active || !E.room) return false;
    // HUD buttons first
    for (const b of E.hud) {
      if (pointIn(b, x, y)) {
        if (b.act === 'eks') { exportFile(); }
        else if (b.act === 'reset') { resetOverrides(); }
        else if (b.act === 'rename') { renameSelected(); }
        else if (b.act === 'slett') { removeSelectedOverride(); }
        else if (b.act === 'lukk') { E.active = false; }
        else if (b.act === 'sel') { E.selId = b.id; E.drag = null; }
        return true;
      }
    }
    // Handle resize of selected
    const sel = selectedHs();
    if (sel) {
      for (const corner of ['nw', 'ne', 'sw', 'se']) {
        const p = handlePos(sel, corner);
        if (Math.abs(x - p.x) <= 12 && Math.abs(y - p.y) <= 12) {
          E.drag = { type: 'resize', id: sel.id, corner, sx: x, sy: y,
            ox: sel.x, oy: sel.y, ow: sel.w, oh: sel.h };
          return true;
        }
      }
      if (pointIn(sel, x, y)) {
        E.drag = { type: 'move', id: sel.id, sx: x, sy: y, ox: sel.x, oy: sel.y };
        return true;
      }
    }
    // Click existing hotspot (select + move)
    for (const hs of E.room.hotspots) {
      if (pointIn(hs, x, y)) {
        E.selId = hs.id;
        E.drag = { type: 'move', id: hs.id, sx: x, sy: y, ox: hs.x, oy: hs.y };
        return true;
      }
    }
    // Walk band lines
    const w = E.room.walk;
    if (w) {
      if (Math.abs(y - w.minY) < 10) { E.drag = { type: 'bandMin', sy: y, oy: w.minY }; return true; }
      if (Math.abs(y - w.maxY) < 10) { E.drag = { type: 'bandMax', sy: y, oy: w.maxY }; return true; }
    }
    // New hotspot: start draw rect
    E.selId = null;
    E.drag = { type: 'new', sx: x, sy: y, x: x, y: y, w: 0, h: 0 };
    return true;
  }

  function move(x, y) {
    if (!E.active || !E.room || !E.drag) return;
    const d = E.drag;
    if (d.type === 'move') {
      const hs = findHs(d.id);
      if (hs) { hs.x = Math.round(d.ox + (x - d.sx)); hs.y = Math.round(d.oy + (y - d.sy)); }
    } else if (d.type === 'resize') {
      const hs = findHs(d.id);
      if (hs) {
        let x1 = d.ox, y1 = d.oy, x2 = d.ox + d.ow, y2 = d.oy + d.oh;
        if (d.corner.includes('w')) x1 = x;
        if (d.corner.includes('e')) x2 = x;
        if (d.corner.includes('n')) y1 = y;
        if (d.corner.includes('s')) y2 = y;
        hs.x = Math.min(x1, x2); hs.y = Math.min(y1, y2);
        hs.w = Math.max(8, Math.round(Math.abs(x2 - x1)));
        hs.h = Math.max(8, Math.round(Math.abs(y2 - y1)));
      }
    } else if (d.type === 'bandMin' || d.type === 'bandMax') {
      const w = E.room.walk;
      const ny = Math.max(0, Math.min(UI_TOP, Math.round(y)));
      if (d.type === 'bandMin') w.minY = Math.min(ny, w.maxY - 20);
      else w.maxY = Math.max(ny, w.minY + 20);
    } else if (d.type === 'new') {
      d.x = x; d.y = y;
      d.w = x - d.sx; d.h = y - d.sy;
    }
    E.changed = true;
  }

  function up() {
    if (!E.active || !E.drag) return;
    const d = E.drag;
    if (d.type === 'new') {
      const x = Math.min(d.sx, d.x), y = Math.min(d.sy, d.y);
      const w = Math.max(8, Math.abs(d.w)), h = Math.max(8, Math.abs(d.h));
      const id = 'ny_' + (E.room.hotspots.length + 1);
      const full = { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h), label: 'ny hotspot', verbs: { look: 'Et mysterium.' } };
      roomPatch(E.room)[id] = full;
      applyMerge(E.room, { [id]: full });
      E.selId = id;
    } else if (d.type === 'move' || d.type === 'resize') {
      const hs = findHs(d.id);
      if (hs) {
        const p = roomPatch(E.room);
        const existing = p[d.id];
        if (existing && existing.verbs) { existing.x = hs.x; existing.y = hs.y; existing.w = hs.w; existing.h = hs.h; }
        else { p[d.id] = { x: hs.x, y: hs.y, w: hs.w, h: hs.h }; }
      }
    } else if (d.type === 'bandMin' || d.type === 'bandMax') {
      roomPatch(E.room)._walk = { minY: E.room.walk.minY, maxY: E.room.walk.maxY };
    }
    E.drag = null;
    if (E.changed) { save(); E.changed = false; }
  }

  function findHs(id) { return E.room.hotspots.find(h => h.id === id); }
  function selectedHs() { return E.selId ? findHs(E.selId) : null; }

  function removeSelectedOverride() {
    const hs = selectedHs();
    if (!hs) return;
    const p = E.overrides[E.room.id];
    if (p && p[hs.id]) { delete p[hs.id]; save(); }
    mergeOverrides(E.room);
    E.selId = null;
  }
  function renameSelected() {
    const hs = selectedHs();
    if (!hs) return;
    const name = prompt('Label for "' + hs.id + '":', hs.label || '');
    if (name === null) return;
    const p = roomPatch(E.room);
    const existing = p[hs.id];
    if (existing && existing.verbs) { existing.label = name; }
    else { p[hs.id] = { label: name }; }
    hs.label = name;
    save();
  }
  function resetOverrides() {
    if (!confirm('Slett alle hotspot-overrides (gjenopprett DSL)?')) return;
    E.overrides = {};
    save();
    if (E.room) { E.selId = null; mergeOverrides(E.room); }
  }

  function exportFile() {
    const js = '// GENERERT av hotspot-editoren (E-tasten). Lim inn under GAME i index.html-rekkefolgen, eller commit som js/games/<spill>/hotspot-overrides.js\n'
      + 'window.HOTSPOT_OVERRIDES = ' + JSON.stringify(E.overrides, null, 2) + ';\n';
    const blob = new Blob([js], { type: 'text/javascript' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'hotspot-overrides.js';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function render(c) {
    if (!E.active || !E.room) return;
    E.hud = [];
    const room = E.room;

    // walk band
    c.strokeStyle = 'rgba(255,120,80,0.9)'; c.lineWidth = 2;
    c.setLineDash([6, 6]);
    c.beginPath(); c.moveTo(0, room.walk.minY); c.lineTo(W, room.walk.minY); c.stroke();
    c.beginPath(); c.moveTo(0, room.walk.maxY); c.lineTo(W, room.walk.maxY); c.stroke();
    c.setLineDash([]);
    c.font = '12px Consolas'; c.fillStyle = '#ff8855';
    c.fillText('minY ' + room.walk.minY, 8, room.walk.minY - 4);
    c.fillText('maxY ' + room.walk.maxY, 8, room.walk.maxY - 4);

    // hotspots
    room.hotspots.forEach(hs => {
      const sel = hs.id === E.selId;
      c.strokeStyle = sel ? '#ffcc00' : 'rgba(0,220,255,0.85)';
      c.lineWidth = sel ? 3 : 2;
      c.strokeRect(hs.x, hs.y, hs.w, hs.h);
      if (sel) {
        ['nw', 'ne', 'sw', 'se'].forEach(corner => {
          const p = handlePos(hs, corner);
          c.fillStyle = '#ffcc00';
          c.fillRect(p.x - 5, p.y - 5, 10, 10);
          c.strokeStyle = '#000'; c.lineWidth = 1;
          c.strokeRect(p.x - 5, p.y - 5, 10, 10);
        });
        c.font = '12px Consolas'; c.fillStyle = '#ffcc00';
        c.fillText(hs.id + '  ' + hs.x + ',' + hs.y + '  ' + hs.w + 'x' + hs.h, hs.x, hs.y - 8);
      }
    });
    if (E.drag && E.drag.type === 'new') {
      const x = Math.min(E.drag.sx, E.drag.x), y = Math.min(E.drag.sy, E.drag.y);
      c.strokeStyle = '#00ff88'; c.lineWidth = 2;
      c.strokeRect(x, y, Math.abs(E.drag.w), Math.abs(E.drag.h));
    }

    // HUD panel
    const pw = 220, ph = 40 + room.hotspots.length * 18 + 60;
    const px = W - pw - 12, py = 12;
    c.fillStyle = 'rgba(10,12,20,0.82)';
    c.fillRect(px, py, pw, Math.min(ph, H - 40));
    c.strokeStyle = '#ffcc00'; c.lineWidth = 1;
    c.strokeRect(px, py, pw, Math.min(ph, H - 40));
    c.font = 'bold 13px Verdana'; c.fillStyle = '#ffe9a8'; c.textAlign = 'left';
    c.fillText('HOTSPOTS (' + room.hotspots.length + ')', px + 8, py + 18);

    let yy = py + 32;
    const maxRows = Math.floor((H - 40 - py - 60) / 18);
    room.hotspots.slice(0, maxRows).forEach(hs => {
      const row = { x: px, y: yy - 14, w: pw, h: 18, act: 'sel', id: hs.id };
      const sel = hs.id === E.selId;
      if (sel) { c.fillStyle = 'rgba(255,204,0,0.2)'; c.fillRect(px + 2, yy - 14, pw - 4, 16); }
      c.font = '11px Consolas'; c.fillStyle = sel ? '#ffe9a8' : '#cfe7ff';
      const label = (hs.label || hs.id).slice(0, 18);
      c.fillText(label, px + 8, yy);
      c.fillStyle = '#8899aa';
      c.fillText(hs.id, px + 8, yy + 12);
      E.hud.push(row);
      yy += 34;
    });

    // buttons
    const btns = [
      { label: 'EKS', act: 'eks' },
      { label: 'RENAME', act: 'rename' },
      { label: 'SLETT', act: 'slett' },
      { label: 'RESET', act: 'reset' },
      { label: 'LUKK', act: 'lukk' },
    ];
    let bx = px + 8, by = yy;
    btns.forEach(b => {
      const bw = 38, bh = 22;
      c.fillStyle = 'rgba(60,50,30,0.9)'; c.strokeStyle = '#ffcc00';
      c.fillRect(bx, by, bw, bh); c.strokeRect(bx, by, bw, bh);
      c.font = '10px Verdana'; c.fillStyle = '#ffe9a8'; c.textAlign = 'center';
      c.fillText(b.label, bx + bw / 2, by + 15);
      E.hud.push({ x: bx, y: by, w: bw, h: bh, act: b.act });
      bx += bw + 4;
      if (bx + bw > px + pw - 6) { bx = px + 8; by += bh + 4; }
    });
    c.textAlign = 'left';
    c.font = '10px Consolas'; c.fillStyle = '#8899aa';
    c.fillText('Tast E = av/på', px + 8, H - 8);
  }

  load();

  window.GAME_EDITOR = {
    get active() { return E.active; },
    set active(v) { E.active = v; if (!v) E.drag = null; },
    onRoom, down, move, up, render, mergeOverrides,
    isDirty: () => E.changed,
  };
})();