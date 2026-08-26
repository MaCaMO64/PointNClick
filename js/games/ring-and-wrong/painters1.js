(() => {
  const A = ART;
  const { rr, ell, circle, poly, vgrad, glow, cloud, pine, treeRound, bush, grassTufts, flowerDots, mountainLayer, vignette } = A;

  function rng(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function grain(c, x, y, w, h, cols, n, seed) {
    const r = rng(seed || 7);
    c.save();
    c.beginPath(); c.rect(x, y, w, h); c.clip();
    for (let i = 0; i < n; i++) {
      c.fillStyle = cols[(r() * cols.length) | 0];
      const s = 1 + r() * 2.5;
      c.fillRect(x + r() * w, y + r() * h, s, s);
    }
    c.restore();
  }

  function dither(c, x, y, w, h, a, b, cell) {
    c.fillStyle = a;
    c.fillRect(x, y, w, h);
    c.fillStyle = b;
    const k = cell || 4;
    for (let yy = 0; yy < h; yy += k * 2) {
      for (let xx = 0; xx < w; xx += k * 2) {
        c.fillRect(x + xx, y + yy, k, k);
        c.fillRect(x + xx + k, y + yy + k, k, k);
      }
    }
  }

  function bricks(c, x, y, w, h, bw, bh, pal, seed) {
    const r = rng(seed || 11);
    for (let row = 0; y + row * bh < y + h; row++) {
      const off = (row % 2) * bw * 0.5;
      for (let bx = x - off; bx < x + w; bx += bw) {
        const t = pal[(r() * pal.length) | 0];
        c.fillStyle = t;
        c.fillRect(bx, y + row * bh, bw - 2, bh - 2);
        c.fillStyle = 'rgba(255,255,255,0.14)';
        c.fillRect(bx, y + row * bh, bw - 2, 2);
        c.fillStyle = 'rgba(0,0,0,0.25)';
        c.fillRect(bx, y + row * bh + bh - 4, bw - 2, 2);
      }
    }
  }

  function planks(c, x, y, w, h, pw, vertical, pal, seed) {
    const r = rng(seed || 13);
    if (vertical) {
      for (let px = x; px < x + w; px += pw) {
        c.fillStyle = pal[(r() * pal.length) | 0];
        c.fillRect(px, y, pw - 2, h);
        c.strokeStyle = 'rgba(30,18,8,0.35)';
        c.lineWidth = 2;
        for (let g = 0; g < 3; g++) {
          const gx = px + 4 + r() * (pw - 10);
          c.beginPath(); c.moveTo(gx, y + r() * h * 0.3); c.lineTo(gx + (r() * 6 - 3), y + h); c.stroke();
        }
        c.fillStyle = 'rgba(255,230,180,0.08)';
        c.fillRect(px, y, 2, h);
        c.fillStyle = 'rgba(20,12,6,0.35)';
        c.fillRect(px + pw - 3, y, 2, h);
      }
    } else {
      for (let py = y; py < y + h; py += pw) {
        c.fillStyle = pal[(r() * pal.length) | 0];
        c.fillRect(x, py, w, pw - 2);
        c.strokeStyle = 'rgba(30,18,8,0.3)';
        c.lineWidth = 1.6;
        c.beginPath();
        for (let g = 0; g < 3; g++) {
          const gy = py + 4 + r() * (pw - 9);
          c.moveTo(x + r() * w * 0.3, gy); c.lineTo(x + w, gy + (r() * 4 - 2));
        }
        c.stroke();
        c.fillStyle = 'rgba(20,12,6,0.35)';
        c.fillRect(x, py + pw - 3, w, 2);
      }
    }
  }

  function roofTiles(c, x, y, w, h, tw, th, pal, seed) {
    const r = rng(seed || 17);
    for (let ty = y; ty < y + h; ty += th) {
      for (let tx = x; tx < x + w; tx += tw) {
        c.fillStyle = pal[(r() * pal.length) | 0];
        ell(c, tx + tw / 2, ty + th, tw * 0.62, th * 0.72, null);
        c.beginPath();
        c.arc(tx + tw / 2, ty + th * 0.4, tw * 0.55, 0, Math.PI);
        c.fill();
        c.fillStyle = 'rgba(255,220,170,0.16)';
        c.fillRect(tx + tw * 0.1, ty, tw * 0.7, 2);
        c.fillStyle = 'rgba(40,10,0,0.28)';
        c.fillRect(tx, ty + th - 3, tw, 2);
      }
    }
  }

  function stones(c, x, y, w, h, n, pal, seed) {
    const r = rng(seed || 23);
    for (let i = 0; i < n; i++) {
      const sx = x + r() * w, sy = y + r() * h;
      const rx = 6 + r() * 14, ryv = rx * (0.55 + r() * 0.35);
      const col = pal[(r() * pal.length) | 0];
      ell(c, sx, sy + 2, rx, ryv, 'rgba(0,0,0,0.22)');
      ell(c, sx, sy, rx, ryv, col);
      ell(c, sx - rx * 0.22, sy - ryv * 0.28, rx * 0.42, ryv * 0.34, 'rgba(255,255,255,0.14)');
    }
  }

  function foliage(c, cx, cy, rad, pal, n, seed) {
    const r = rng(seed || 31);
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * rad;
      const fx = cx + Math.cos(a) * d;
      const fy = cy + Math.sin(a) * d * 0.85;
      const fr = rad * (0.16 + r() * 0.2);
      let col = pal[(r() * pal.length) | 0];
      if ((fx - cx) / rad + (fy - cy) / rad > 0.45 && r() < 0.65) col = pal[1] || col;
      if ((fx - cx) / rad + (fy - cy) / rad < -0.55 && r() < 0.6) col = pal[pal.length - 1] || col;
      circle(c, fx, fy, fr, col);
    }
  }

  function grassPatch(c, x, y, w, h, n, cols, seed) {
    const r = rng(seed || 41);
    c.lineWidth = 2; c.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const gx = x + r() * w, gy = y + r() * h;
      const gh = 5 + r() * 9;
      c.strokeStyle = cols[(r() * cols.length) | 0];
      c.beginPath();
      c.moveTo(gx, gy); c.lineTo(gx + (r() * 5 - 2.5), gy - gh);
      if (r() < 0.5) { c.moveTo(gx + 3, gy); c.lineTo(gx + 5 + r() * 3, gy - gh * 0.7); }
      c.stroke();
    }
  }

  function shadowBlob(c, x, y, rx, ry) { ell(c, x, y, rx, ry || rx * 0.32, 'rgba(15,12,24,0.30)'); }

  window._PX = { rng, grain, dither, bricks, planks, roofTiles, stones, foliage, grassPatch, shadowBlob };
  window.PAINTERS = {};

  const PX = window._PX;

  window.PAINTERS.dal = (c, W, H) => {
    dither(c, 0, 0, W, 240, '#aee2f7', '#cdeefb', 8);
    dither(c, 0, 240, W, 130, '#cdeefb', '#fdf3cf', 8);
    dither(c, 0, 370, W, 110, '#fdf3cf', '#ffeec2', 6);
    glow(c, 1050, 110, 190, 'rgba(255,246,200,0.95)');
    circle(c, 1060, 112, 46, '#fffbe2');
    circle(c, 1046, 100, 10, 'rgba(255,255,255,0.75)');
    cloud(c, 250, 96, 1.25, 'rgba(255,255,255,0.94)');
    cloud(c, 700, 66, 1.05, 'rgba(255,255,255,0.9)');
    cloud(c, 950, 150, 0.8, 'rgba(255,255,255,0.82)');
    cloud(c, 430, 150, 0.7, 'rgba(255,255,255,0.7)');
    mountainLayer(c, 420, 70, 400, '#a9d48e');
    mountainLayer(c, 462, 52, 1100, '#8cc273');
    grain(c, 0, 380, W, 90, ['#9ccb84', '#93c47b', '#a5d38f'], 500, 91);
    c.fillStyle = vgrad(c, 0, 460, 0, H, [[0, '#7cb95e'], [0.6, '#63a54e'], [1, '#477f3c']]);
    c.fillRect(0, 460, W, H - 460);
    grain(c, 0, 460, W, H - 460, ['#86bd68', '#74ad58', '#6aa251', '#8ac26e'], 900, 92);

    ell(c, 330, 566, 232, 158, '#69ab51');
    grain(c, 120, 470, 420, 160, ['#79bb5e', '#6fb055', '#83c468'], 700, 93);
    c.strokeStyle = 'rgba(44,88,38,0.5)';
    c.lineWidth = 2;
    for (let i = 1; i < 5; i++) {
      c.beginPath(); c.ellipse(330, 564, 232 - i * 42, 156 - i * 30, 0, Math.PI * 1.12, Math.PI * 1.88); c.stroke();
    }
    grassPatch(c, 140, 480, 380, 130, 90, ['#3f7d34', '#4c8f3e', '#579a47'], 94);
    flowerDots(c, [[210, 520, '#ff9ec4'], [245, 545, '#ffe066'], [300, 555, '#fff'], [395, 540, '#ff9ec4'], [430, 520, '#ffd166'], [270, 505, '#ff8f6b']]);

    rr(c, 414, 306, 30, 76, 5); c.fillStyle = '#8d8074'; c.fill();
    c.strokeStyle = '#5f564c'; c.lineWidth = 3; c.stroke();
    rr(c, 406, 298, 46, 12, 4); c.fillStyle = '#776b60'; c.fill();
    grain(c, 414, 306, 30, 70, ['#9c9084', '#847a70'], 60, 95);

    circle(c, 330, 438, 41, '#2f6b3c');
    circle(c, 330, 438, 37, '#47864f');
    c.save();
    c.beginPath(); c.arc(330, 438, 33, 0, Math.PI * 2); c.clip();
    for (let i = 0; i < 5; i++) {
      c.fillStyle = i % 2 ? '#3f7a46' : '#528f57';
      c.fillRect(297 + i * 14, 405, 13, 66);
    }
    c.fillStyle = 'rgba(0,0,0,0.18)';
    c.fillRect(297, 460, 66, 11);
    c.restore();
    circle(c, 345, 441, 5, '#e8c84a', '#8a6a20', 2);
    circle(c, 345, 441, 2, '#fff2b0');
    ell(c, 330, 481, 46, 10, '#cabfa2', '#93876c', 2);
    grain(c, 290, 474, 80, 12, ['#d8cfb4', '#bdb193'], 40, 96);

    [[262, 455], [398, 455]].forEach(wx => {
      circle(c, wx[0], wx[1], 16, '#7a5230');
      circle(c, wx[0], wx[1], 13.5, '#ffd76e');
      c.strokeStyle = '#7a5230'; c.lineWidth = 2.4;
      c.beginPath(); c.moveTo(wx[0] - 13, wx[1]); c.lineTo(wx[0] + 13, wx[1]);
      c.moveTo(wx[0], wx[1] - 13); c.lineTo(wx[0], wx[1] + 13); c.stroke();
      circle(c, wx[0] - 4, wx[1] - 4, 3, 'rgba(255,255,255,0.5)');
    });

    c.fillStyle = '#5f4426';
    c.fillRect(498, 480, 9, 30); c.fillRect(569, 480, 9, 30);
    planks(c, 490, 462, 96, 18, 18, false, ['#9a6c40', '#8a5f36', '#a5764a'], 97);
    c.strokeStyle = '#4a3016'; c.lineWidth = 2;
    c.strokeRect(490, 462, 96, 18);

    logRow2(c, 70, 530, 2); logRow2(c, 86, 510, 2); logRow2(c, 102, 490, 1);
    grain(c, 66, 486, 150, 62, ['#6b4426', '#7a4e2a'], 120, 98);

    box2(c, 600, 502, 56, 46, '#c8a468', '#8a6a3c');
    box2(c, 650, 512, 52, 38, '#d6b87e', '#8a6a3c');
    rr(c, 664, 498, 22, 15, 4); c.fillStyle = '#5d442e'; c.fill();
    c.strokeStyle = '#3a2a1a'; c.lineWidth = 2; c.stroke();

    pathCobble(c, [[350, 486], [520, 508], [760, 521], [1000, 525], [1225, 532]], 42, 68);

    c.fillStyle = '#6b4a2f'; c.fillRect(1072, 440, 9, 88);
    grain(c, 1072, 440, 9, 88, ['#5d4028', '#7a5638'], 40, 99);
    rr(c, 1034, 420, 78, 40, 4); c.fillStyle = '#caa06a'; c.fill();
    c.strokeStyle = '#5d3c22'; c.lineWidth = 3; c.stroke();
    rr(c, 1038, 424, 70, 32, 3); c.fillStyle = '#b98f58'; c.fill();
    c.font = 'bold 13px Verdana'; c.textAlign = 'center'; c.fillStyle = '#4a3018';
    c.fillText('BLOOM-', 1073, 438); c.fillText('DALE', 1073, 453);

    c.fillStyle = '#7a5230';
    [[1148], [1190], [1234], [1268]].forEach(pxx => {
      c.fillRect(pxx[0], 462, 10, 82);
      grain(c, pxx[0], 462, 10, 82, ['#6b4a2f', '#8a623c'], 14, 100 + pxx[0]);
      circle(c, pxx[0] + 5, 470, 2, '#4a3016');
    });
    planks(c, 1148, 476, 48, 10, 10, false, ['#8a623c', '#9a6f45'], 101);
    planks(c, 1243, 476, 28, 10, 10, false, ['#8a623c', '#9a6f45'], 102);
    planks(c, 1148, 512, 48, 10, 10, false, ['#7a5533', '#8a623c'], 103);
    planks(c, 1243, 512, 28, 10, 10, false, ['#7a5533', '#8a623c'], 104);

    treeRoundBig(c, 962, 556, '#4a8f43', '#5da84f', '#6fbe5c', '#3f7d3a');
    grain(c, 880, 300, 170, 160, ['#57a04c', '#63b257'], 260, 105);
    APPLES.forEach(p => {
      ell(c, p[0], p[1] + 3, 7.5, 4, 'rgba(60,20,10,0.25)');
      circle(c, p[0], p[1], 7.5, '#d94038');
      circle(c, p[0] - 2.4, p[1] - 2.4, 2.4, '#ff9d8a');
      circle(c, p[0] + 2, p[1] + 3, 2, '#a82818');
    });

    bush2(c, 760, 502, '#4c8f43', '#5da84f');
    bush2(c, 850, 540, '#477f3c', '#579a47');
    grassTufts(c, [[420, 548], [700, 556], [900, 544], [180, 562], [560, 568], [1080, 556]], '#3f7d34');
    vignette(c, W, H, 0.22);
  };

  function logRow2(c, x, y, n) {
    for (let i = 0; i < n; i++) {
      const lx = x + i * 68;
      rr(c, lx, y, 64, 18, 8);
      c.fillStyle = '#7a4e2a'; c.fill();
      c.strokeStyle = '#4e3018'; c.lineWidth = 2; c.stroke();
      c.strokeStyle = 'rgba(50,30,14,0.5)'; c.lineWidth = 1.4;
      c.beginPath(); c.moveTo(lx + 14, y + 4); c.lineTo(lx + 52, y + 4);
      c.moveTo(lx + 16, y + 13); c.lineTo(lx + 50, y + 13); c.stroke();
      circle(c, lx + 9, y + 9, 8, '#c9a06a', '#7a5230', 2);
      circle(c, lx + 9, y + 9, 3.6, null, '#a87c4a', 1.6);
      circle(c, lx + 9, y + 9, 1.2, '#6b4426');
    }
  }

  function box2(c, x, y, w, h, fill, stroke) {
    rr(c, x, y, w, h, 3); c.fillStyle = fill; c.fill();
    c.strokeStyle = stroke; c.lineWidth = 2.5; c.stroke();
    grain(c, x + 2, y + 2, w - 4, h - 4, ['rgba(120,90,50,0.25)', 'rgba(255,235,190,0.18)'], 26, x + y);
    c.strokeStyle = 'rgba(160,120,70,0.8)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(x + w / 2 - 4, y); c.lineTo(x + w / 2 + 4, y + h); c.stroke();
    poly(c, [[x, y], [x + w, y], [x + w, y + 6], [x, y + 6]], 'rgba(0,0,0,0.12)');
  }

  function treeRoundBig(c, x, baseY, la, lb, lc, trunk) {
    c.strokeStyle = trunk; c.lineWidth = 16; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x, baseY); c.quadraticCurveTo(x - 8, baseY - 60, x + 2, baseY - 108); c.stroke();
    c.lineWidth = 8;
    c.beginPath(); c.moveTo(x - 2, baseY - 62); c.quadraticCurveTo(x - 40, baseY - 84, x - 58, baseY - 96); c.stroke();
    c.beginPath(); c.moveTo(x + 3, baseY - 70); c.quadraticCurveTo(x + 42, baseY - 92, x + 60, baseY - 100); c.stroke();
    grain(c, x - 14, baseY - 100, 30, 104, ['rgba(60,38,20,0.4)', 'rgba(140,100,60,0.25)'], 60, 106);
    foliage(c, x - 2, baseY - 152, 92, [lb, la, lc, '#3f7d3a'], 90, 107);
    foliage(c, x - 52, baseY - 122, 46, [la, lb, '#3f7d3a'], 40, 108);
    foliage(c, x + 50, baseY - 128, 48, [lb, la, lc], 44, 109);
    foliage(c, x + 4, baseY - 176, 52, [lc, lb, la], 46, 110);
  }

  function bush2(c, x, y, da, li) {
    shadowBlob(c, x, y + 4, 30, 9);
    foliage(c, x, y - 10, 26, [li, da, '#3f7d34'], 26, x * 3);
  }

  function pathCobble(c, pts, w0, w1) {
    const top = [], bot = [];
    pts.forEach(([x, y], i) => {
      const w = w0 + (w1 - w0) * (i / (pts.length - 1));
      top.push([x, y - w / 2]); bot.push([x, y + w / 2]);
    });
    poly(c, [...top, ...bot.reverse()], '#c2a06b');
    c.save();
    c.beginPath();
    const all = [...top, ...bot];
    all.forEach((p, i) => i === 0 ? c.moveTo(p[0], p[1]) : c.lineTo(p[0], p[1]));
    c.closePath(); c.clip();
    stones(c, 320, 470, 920, 80, 90, ['#cbb083', '#b89a68', '#d4ba8e', '#a8875a'], 111);
    grain(c, 320, 470, 920, 90, ['#a8875a', '#8f7148'], 200, 112);
    c.restore();
    c.strokeStyle = '#8f7148'; c.lineWidth = 3;
    const all2 = [...top, ...bot.reverse()];
    c.beginPath();
    all2.forEach((p, i) => i === 0 ? c.moveTo(p[0], p[1]) : c.lineTo(p[0], p[1]));
    c.stroke();
  }

  const APPLES = [[905, 328], [945, 296], [1000, 316], [1032, 362], [878, 380], [960, 393], [1012, 410], [924, 414]];
})();
