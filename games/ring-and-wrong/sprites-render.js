(() => {
  const C = window.SPRITE_CORE;
  const CELL = 2;
  const LETTER_FALLBACK = { K: '#20263a', C: '#e8a090', W: '#ffffff', N: '#d8aab2' };
  const vecPerson = C.vecPerson;

  // --- Nano Banana sheets — chroma-keyed at runtime (magenta #FF00FF, JPEG-tolerant) ---
  const CHAR_FRAMES = {}; // style -> [idle, walkA, walkB]
  const STYLE_MAP = { tomble_sheet: 'toke', bongo_sheet: 'bongo', billy_sheet: 'goat' };
  (function initSheets() {
    if (typeof Image === 'undefined' || typeof document === 'undefined') return;
    const loadSheet = (key, style) => {
      const img = new Image();
      const embedded = window.CHARS_DATA && window.CHARS_DATA[key];
      img.src = embedded || ('games/ring-and-wrong/art/chars/' + key + '.jpeg?v=29');
      if (!embedded) {
        const altJpg = 'games/ring-and-wrong/art/chars/' + key + '.jpg?v=29';
        img.onerror = () => { const f2 = new Image(); f2.src = altJpg; f2.onload = img.onload; };
      }
      img.onload = () => {
        try {
          const fw = Math.floor(img.width / 3);
          const fh = img.height;
          const frames = [];
          for (let i = 0; i < 3; i++) {
            const cv = document.createElement('canvas');
            cv.width = fw; cv.height = fh;
            const cx = cv.getContext('2d');
            cx.drawImage(img, i * fw, 0, fw, fh, 0, 0, fw, fh);
            // Bongo-arket har "MASTER-STIL" tekst i bunn — overskriv med magenta før nøkling
            if (key === 'bongo_sheet') { cx.fillStyle = '#FF00FF'; cx.fillRect(0, fh - 58, fw, 58); }
            const id = cx.getImageData(0, 0, fw, fh);
            const d = id.data;
            for (let p = 0; p < d.length; p += 4) {
              const r = d[p], g = d[p + 1], b = d[p + 2];
              const dist = Math.abs(r - 255) + g + Math.abs(b - 255);
              const isMag = r > 140 && b > 140 && g < 130;
              if (dist < 115 || (isMag && dist < 260)) d[p + 3] = 0;
            }
            cx.putImageData(id, 0, 0);
            const w = fw, h = fh;
            let minX = w, maxX = -1, minY = h, maxY = -1;
            const d2 = cx.getImageData(0, 0, w, h).data;
            for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d2[(y * w + x) * 4 + 3] > 10) {
              if (x < minX) minX = x; if (x > maxX) maxX = x;
              if (y < minY) minY = y; if (y > maxY) maxY = y;
            }
            if (maxX >= 0) {
              const tw = maxX - minX + 1, th = maxY - minY + 1;
              const tc = document.createElement('canvas');
              tc.width = tw; tc.height = th;
              tc.getContext('2d').drawImage(cv, minX, minY, tw, th, 0, 0, tw, th);
              frames.push(tc);
            } else frames.push(cv);
          }
          CHAR_FRAMES[style] = frames;
        } catch (e) { console.warn(key + ' sheet failed', e); }
      };
      img.onerror = () => {};
    };
    const src = window.CHARS_DATA || {};
    const keys = Object.keys(src).length ? Object.keys(src) : ['tomble_sheet', 'bongo_sheet'];
    keys.forEach(k => loadSheet(k, STYLE_MAP[k] || k.replace('_sheet', '')));
  })();

  function SnapCtx(c) {
    const r = v => Math.round(v);
    return {
      set fillStyle(v) { c.fillStyle = v; },
      set strokeStyle(v) { c.strokeStyle = v; },
      set lineWidth(v) { c.lineWidth = v; },
      fillRect(x, y, w, h) { c.fillRect(r(x), r(y), Math.max(1, r(w)), Math.max(1, r(h))); },
      strokeRect(x, y, w, h) { c.strokeRect(r(x), r(y), Math.max(1, r(w)), Math.max(1, r(h))); },
      beginPath() { c.beginPath(); },
      moveTo(x, y) { c.moveTo(r(x), r(y)); },
      lineTo(x, y) { c.lineTo(r(x), r(y)); },
      arc(x, y, rad) { c.arc(r(x), r(y), Math.max(1, r(rad)), 0, Math.PI * 2); },
      stroke() { c.stroke(); },
      fill() { c.fill(); },
    };
  }

  function drawGrid(c, rows, pal, cell) {
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let q = 0; q < row.length; q++) {
        const ch = row[q];
        if (ch === '.') continue;
        const col = pal[ch] || LETTER_FALLBACK[ch];
        if (!col) continue;
        c.fillStyle = col;
        c.fillRect(q * cell, r * cell, cell, cell);
      }
    }
  }

  function spriteSpace(c, o, w, h) {
    const KXl = 320 / 1280, KYl = 156 / 624;
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.imageSmoothingEnabled = false;
    const ox = Math.round(o.x * KXl - w / 2);
    const oy = Math.round(o.y * KYl) - h + 1;
    c.translate(ox, oy);
    if ((o.facing || 1) < 0) { c.translate(w, 0); c.scale(-1, 1); }
    return { ox, oy, w, h };
  }

  function drawHumanoid(c, o) {
    const FR = CHAR_FRAMES[o.style];
    if (FR && FR.length === 3) {
      const now = performance.now() / 1000;
      c.fillStyle = 'rgba(10,12,20,0.28)';
      c.beginPath(); c.ellipse(o.x, o.y + 2, 17 * (o.scale || 1), 5 * (o.scale || 1), 0, 0, Math.PI * 2); c.fill();
      let idx = 0;
      if (o.walking) { const seq = [1, 0, 2, 0]; idx = seq[Math.floor(o.phase) % 4]; }
      const frame = FR[idx];
      const targetH = 52;
      const scale = targetH / frame.height;
      const w = Math.round(frame.width * scale);
      const h = Math.round(frame.height * scale);
      const bob = o.walking && (Math.floor(o.phase) % 4) % 2 === 1 ? -1 : 0;
      const sp = spriteSpace(c, o, w, h);
      if (bob) c.translate(0, bob);
      c.imageSmoothingEnabled = false;
      c.drawImage(frame, 0, 0, frame.width, frame.height, 0, 0, w, h);
      if (o.talking) {
        const open = Math.floor(now * 9) % 2 === 0;
        c.fillStyle = '#5a3a32';
        c.fillRect(Math.round(w * 0.42), Math.round(h * 0.38), Math.round(w * 0.10), open ? Math.max(1, Math.round(h * 0.05)) : 1);
      }
      c.restore();
      o._blit = { lx: sp.ox, ly: sp.oy, wPx: w, hPx: h };
      return;
    }

    const st = C.STYLES[o.style] || C.STYLES.toke;
    const now = performance.now() / 1000;

    c.fillStyle = 'rgba(10,12,20,0.28)';
    c.beginPath();
    c.ellipse(o.x, o.y + 2, 17 * (o.scale || 1), 5 * (o.scale || 1), 0, 0, Math.PI * 2);
    c.fill();

    let frame = 0;
    if (o.walking) frame = Math.floor(o.phase) % 4;
    const seq = [C.LEG_A, C.LEG_STAND, C.LEG_B, C.LEG_STAND];
    const legs = st.robe ? (o.walking && frame % 2 === 0 ? C.ROBE_A : C.ROBE_B) : seq[frame];
    const bob = o.walking && frame % 2 === 1 ? -CELL : 0;
    const h = (C.UPPER.length + legs.length) * CELL;
    const sp = spriteSpace(c, o, 16 * CELL, h);
    c.translate(0, bob);

    drawGrid(c, C.UPPER, st.pal, CELL);
    drawGrid(c, legs, st.pal, CELL);
    if (st.acc) st.acc(SnapCtx(c), 0, 0, CELL, null);

    if (o.sleeping) {
      c.fillStyle = st.pal.S;
      c.fillRect(3 * CELL, 5 * CELL, 2 * CELL, 2 * CELL);
      c.fillRect(10 * CELL, 5 * CELL, 2 * CELL, 2 * CELL);
    } else if (o.style !== 'rando') {
      const blink = ((now + (o.blinkSeed || 0)) % 3.4) < 0.12;
      if (blink) {
        c.fillStyle = st.pal.S;
        c.fillRect(3 * CELL, 5 * CELL, 2 * CELL, 2 * CELL);
        c.fillRect(10 * CELL, 5 * CELL, 2 * CELL, 2 * CELL);
      }
    }
    if (o.talking) {
      const open = Math.floor(now * 9) % 2 === 0;
      c.fillStyle = st.pal.M;
      c.fillRect(6.5 * CELL, 8 * CELL, 2 * CELL, open ? 1.4 * CELL : 0.7 * CELL);
    }
    c.restore();
    o._blit = { lx: sp.ox, ly: sp.oy, wPx: sp.w, hPx: sp.h };
  }

  function drawSpecial(c, o, rows, pal, key, opt, overlay) {
    const mul = (opt && opt.scaleMul) || 1;
    const cell = Math.max(1, Math.round(CELL * mul));
    const w = rows[0].length * cell, h = rows.length * cell;

    c.fillStyle = 'rgba(10,12,20,0.28)';
    c.beginPath();
    c.ellipse(o.x, o.y + 2, (rows[0].length / 2) * 0.8 * cell, 2.2 * cell, 0, 0, Math.PI * 2);
    c.fill();

    const sp = spriteSpace(c, o, w, h);
    if (opt && opt.overlayFirst && overlay) overlay(SnapCtx(c), cell, performance.now() / 1000);
    drawGrid(c, rows, pal, cell);
    if (overlay && !(opt && opt.overlayFirst)) overlay(SnapCtx(c), cell, performance.now() / 1000);
    c.restore();
    o._blit = { lx: sp.ox, ly: sp.oy, wPx: w, hPx: h };
  }

  const newPerson = (c, o) => {
    // Generic Nano Banana sheet for any style (e.g. goat via billy_sheet)
    const GFR = CHAR_FRAMES[o.style];
    if (GFR && GFR.length === 3) {
      const now = performance.now() / 1000;
      c.fillStyle = 'rgba(10,12,20,0.28)';
      c.beginPath(); c.ellipse(o.x, o.y + 2, (o.style === 'goat' ? 12 : 17) * (o.scale || 1), 5 * (o.scale || 1), 0, 0, Math.PI * 2); c.fill();
      let idx = 0;
      if (o.style === 'goat') {
        // Geita går aldri — vis idle-varianter som sakte blunk/hale-vrikk
        const t = now * 0.9;
        idx = Math.floor(t) % 7 === 0 ? 2 : Math.floor(t * 0.6) % 3 === 1 ? 1 : 0;
      } else if (o.walking) { const seq = [1, 0, 2, 0]; idx = seq[Math.floor(o.phase) % 4]; }
      const frame = GFR[idx];
      const targetH = o.style === 'goat' ? 38 : 52;
      const scale = targetH / frame.height;
      const w = Math.round(frame.width * scale), h = Math.round(frame.height * scale);
      const bob = o.walking && (Math.floor(o.phase) % 4) % 2 === 1 ? -1 : 0;
      const sp = spriteSpace(c, o, w, h);
      if (bob) c.translate(0, bob);
      c.imageSmoothingEnabled = false;
      c.drawImage(frame, 0, 0, frame.width, frame.height, 0, 0, w, h);
      c.restore();
      o._blit = { lx: sp.ox, ly: sp.oy, wPx: w, hPx: h };
      return;
    }
    switch (o.style) {
      case 'goat':
        drawSpecial(c, o, C.GOAT, { B: '#f2ede0', D: '#d8d0bc', H: '#6d5c3a', K: '#1c1c1c', S: '#c98f9d' }, 'goat', { scaleMul: 1.5, overlayFirst: true }, (sc, cell) => {
          sc.strokeStyle = '#4a4438';
          sc.lineWidth = Math.max(1, cell * 0.3);
          sc.beginPath();
          for (let r = 0; r < C.GOAT.length; r++) {
            const row = C.GOAT[r];
            for (let q = 0; q < row.length; q++) {
              if (row[q] === '.') continue;
              sc.strokeRect(q * cell, r * cell, cell, cell);
            }
          }
          sc.stroke();
        });
        return;
      case 'glum':
        drawSpecial(c, o, C.GLUM, { P: '#cdd6da', L: '#5a4632', W: '#eef7ff', K: '#2a6ea8', M: '#4a3038', F: '#cdd6da' }, 'glum', null, (sc, cell, t) => {
          const blink = ((t + 1.3) % 4.1) < 0.15;
          if (blink) { sc.fillStyle = '#cdd6da'; sc.fillRect(3 * cell, 2 * cell, 6 * cell, 2 * cell); }
          if (o.talking) {
            const open = Math.floor(t * 9) % 2 === 0;
            sc.fillStyle = '#4a3038';
            sc.fillRect(7 * cell, (open ? 3.6 : 4) * cell, cell, open ? 1.2 * cell : 0.6 * cell);
          }
        });
        return;
      case 'troll':
        drawSpecial(c, o, C.TROLL, { B: '#8d94a4', D: '#69707f', L: '#9aa1b1', T: '#5f6674', W: '#e8ecf4', K: '#20263a', M: '#4a3038', S: '#8d94a4' }, 'troll', { scaleMul: 1.5 });
        return;
      case 'perr':
        drawSpecial(c, o, C.RIDER, C.HORSE_PAL, 'perr', { scaleMul: 1.5 }, (sc, cell, t) => {
          const pulse = 0.6 + 0.4 * Math.sin(t * 2.6);
          sc.fillStyle = 'rgba(255,48,32,' + (0.35 + 0.4 * pulse).toFixed(2) + ')';
          sc.fillRect(18 * cell, 2 * cell, 2 * cell, cell);
          if (o.reading) { sc.fillStyle = '#e8e2d2'; sc.fillRect(11 * cell, 5 * cell, 5 * cell, 5 * cell); }
        });
        return;
      default:
        if (C.STYLES[o.style]) { drawHumanoid(c, o); return; }
        vecPerson(c, o);
    }
  };

  ART.person = newPerson;
  ART.rider = (c, o) => newPerson(c, Object.assign({}, o, { style: 'perr' }));

  ART._canary = (c) => {
    c.save();
    drawGrid(c, C.UPPER, C.STYLES.toke.pal, CELL);
    drawGrid(c, C.LEG_STAND, C.STYLES.toke.pal, CELL);
    c.restore();
  };
})();
