const ART = (() => {
  const OUT = '#20263a';
  const T = () => performance.now() / 1000;

  function rr(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }
  function ell(c, x, y, rx, ry, fill, stroke, lw) {
    c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 2; c.stroke(); }
  }
  function circle(c, x, y, r, fill, stroke, lw) {
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 2; c.stroke(); }
  }
  function poly(c, pts, fill, stroke, lw) {
    c.beginPath();
    pts.forEach((p, i) => i === 0 ? c.moveTo(p[0], p[1]) : c.lineTo(p[0], p[1]));
    c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 2; c.stroke(); }
  }
  function vgrad(c, x0, y0, x1, y1, stops) {
    const g = c.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(s => g.addColorStop(s[0], s[1]));
    return g;
  }
  function glow(c, x, y, r, colInner, alpha) {
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, colInner);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.save();
    c.globalAlpha = alpha === undefined ? 1 : alpha;
    c.fillStyle = g;
    c.fillRect(x - r, y - r, r * 2, r * 2);
    c.restore();
  }

  function cloud(c, x, y, s, col) {
    c.fillStyle = col || 'rgba(255,255,255,0.9)';
    ell(c, x, y, 46 * s, 16 * s, null); ell(c, x - 26 * s, y + 6 * s, 28 * s, 11 * s, col || 'rgba(255,255,255,0.9)');
    ell(c, x + 28 * s, y + 5 * s, 30 * s, 12 * s, col || 'rgba(255,255,255,0.9)');
    ell(c, x - 8 * s, y - 8 * s, 24 * s, 13 * s, col || 'rgba(255,255,255,0.9)');
  }
  function pine(c, x, baseY, h, col) {
    c.fillStyle = '#3a2a20';
    c.fillRect(x - h * 0.04, baseY - h * 0.15, h * 0.08, h * 0.15);
    c.fillStyle = col;
    for (let i = 0; i < 3; i++) {
      const ty = baseY - h * (0.12 + i * 0.27);
      const w = h * (0.34 - i * 0.08);
      poly(c, [[x - w, ty], [x + w, ty], [x, ty - h * 0.34]], col);
    }
  }
  function treeRound(c, x, baseY, s, leafA, leafB, trunkCol) {
    c.strokeStyle = trunkCol || '#5d4230';
    c.lineWidth = 8 * s;
    c.lineCap = 'round';
    c.beginPath(); c.moveTo(x, baseY); c.quadraticCurveTo(x - 4 * s, baseY - 30 * s, x, baseY - 52 * s); c.stroke();
    c.lineWidth = 5 * s;
    c.beginPath(); c.moveTo(x, baseY - 30 * s); c.lineTo(x + 18 * s, baseY - 42 * s); c.stroke();
    ell(c, x, baseY - 72 * s, 40 * s, 34 * s, leafA);
    ell(c, x - 22 * s, baseY - 58 * s, 24 * s, 20 * s, leafA);
    ell(c, x + 22 * s, baseY - 60 * s, 25 * s, 21 * s, leafA);
    ell(c, x - 6 * s, baseY - 80 * s, 22 * s, 17 * s, leafB);
  }
  function bush(c, x, y, s, col) {
    ell(c, x, y, 26 * s, 15 * s, col);
    ell(c, x - 14 * s, y - 4 * s, 15 * s, 11 * s, col);
    ell(c, x + 13 * s, y - 3 * s, 16 * s, 11 * s, col);
  }
  function grassTufts(c, pts, col) {
    c.strokeStyle = col; c.lineWidth = 2; c.lineCap = 'round';
    pts.forEach(([x, y]) => {
      c.beginPath();
      c.moveTo(x, y); c.lineTo(x - 3, y - 8);
      c.moveTo(x + 3, y); c.lineTo(x + 4, y - 9);
      c.moveTo(x, y); c.lineTo(x, y - 10);
      c.stroke();
    });
  }
  function flowerDots(c, arr) {
    arr.forEach(([x, y, col]) => {
      c.strokeStyle = '#4a7a3a'; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 7); c.stroke();
      circle(c, x, y - 9, 3, col);
      circle(c, x, y - 9, 1.2, '#fff8');
    });
  }
  function mountainLayer(c, baseY, amp, seed, col) {
    const pts = [];
    for (let x = -50; x <= 1330; x += 100) {
      const n = Math.sin((x + seed) * 0.008) * amp + Math.sin((x + seed) * 0.023) * amp * 0.45;
      pts.push([x, baseY - Math.abs(n)]);
    }
    poly(c, [...pts, [1340, baseY + 200], [-60, baseY + 200]], col);
  }
  function vignette(c, W, H, strength) {
    const g = c.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 0.95);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(10,8,16,' + strength + ')');
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
  }
  function shadow(c, rx) { ell(c, 0, 3, rx, rx * 0.28, 'rgba(10,12,20,0.25)'); }


  function title(c, W, H, t) {
  const M = (window.GAME && window.GAME.meta) || { title: 'UNTITLED', version: '', subtitle: '', tagline: '' };
    c.fillStyle = vgrad(c, 0, 0, 0, H, [[0, '#0d1030'], [0.5, '#1c2a50'], [1, '#2c3a60']]);
    c.fillRect(0, 0, W, H);
    let seedS = 7;
    for (let i = 0; i < 90; i++) {
      seedS = (seedS * 16807) % 2147483647;
      const sx = seedS % W, sy = (seedS >> 3) % (H * 0.6);
      const a = 0.35 + 0.55 * Math.abs(Math.sin(t * 1.4 + i));
      circle(c, sx, sy, i % 9 === 0 ? 1.8 : 1, 'rgba(255,255,240,' + a.toFixed(2) + ')');
    }
    circle(c, 1090, 110, 34, '#e8ecf4', 'rgba(200,210,230,0.6)', 3);
    ell(c, 1078, 102, 8, 8, 'rgba(180,190,210,0.5)');
    ell(c, 1102, 122, 6, 6, 'rgba(180,190,210,0.5)');
    mountainLayer(c, 500, 130, 300, '#161e3a');
    mountainLayer(c, 560, 100, 900, '#111731');
    const rg = glow(c, 640, 250, 170, 'rgba(255,214,90,0.35)');
    circle(c, 640, 250, 74, null, '#f4c84a', 22);
    circle(c, 640, 250, 74, null, 'rgba(120,80,10,0.55)', 4);
    c.save();
    c.strokeStyle = 'rgba(255,255,235,0.9)';
    c.lineWidth = 5;
    c.beginPath(); c.arc(640, 250, 74, t * 0.7 - 0.5, t * 0.7 + 0.35); c.stroke();
    c.restore();
    for (let x = -40; x < W + 60; x += 90) {
      pine(c, x + (x % 180 === 50 ? 30 : 0), 720, 150 + ((x * 7) % 90), '#0a0f20');
    }
    c.textAlign = 'center';
    c.font = 'bold 88px Georgia, serif';
    c.lineWidth = 8;
    c.strokeStyle = '#1a1408';
    c.strokeText(M.title, W / 2, 128);
    const lg = vgrad(c, 0, 60, 0, 150, [[0, '#ffe9a0'], [1, '#c9861f']]);
    c.fillStyle = lg;
    c.fillText(M.title, W / 2, 128);
    c.font = 'italic 22px Georgia, serif';
    c.fillStyle = '#cfd6f0';
    c.fillText(M.subtitle, W / 2, 172);
    c.font = '13px Consolas, monospace';
    c.fillStyle = 'rgba(210,215,235,0.6)';
    c.fillText(M.title + ' ' + M.version, W / 2, 204);
    c.font = '15px Verdana, sans-serif';
    c.fillStyle = 'rgba(210,215,235,0.55)';
    c.fillText(M.tagline, W / 2, 396);
  }

  function introBg(c, W, H, t) {
    c.fillStyle = '#15101c';
    c.fillRect(0, 0, W, H);
    c.save();
    c.globalAlpha = 0.07;
    circle(c, W / 2, H / 2, 150, null, '#f4c84a', 26);
    c.restore();
    for (let i = 0; i < 26; i++) {
      const px = (i * 173 + t * 12 * (1 + (i % 3))) % W;
      const py = (i * 97 + t * 7) % H;
      circle(c, px, py, 1.4, 'rgba(220,205,160,0.25)');
    }
    c.strokeStyle = 'rgba(212,175,55,0.3)';
    c.lineWidth = 2;
    c.strokeRect(34, 34, W - 68, H - 68);
    c.strokeRect(42, 42, W - 84, H - 84);
    [[34, 34], [W - 34, 34], [34, H - 34], [W - 34, H - 34]].forEach(p => {
      c.save();
      c.translate(p[0], p[1]);
      c.rotate(Math.PI / 4);
      c.strokeRect(-7, -7, 14, 14);
      c.restore();
    });
    vignette(c, W, H, 0.55);
  }

  function endingBg(c, W, H, t, type) {
    if (type === 'good') {
      c.fillStyle = vgrad(c, 0, 0, 0, H, [[0, '#ffd9a0'], [0.45, '#ffb36b'], [1, '#ffe8c0']]);
      c.fillRect(0, 0, W, H);
      glow(c, 340, 260, 260, 'rgba(255,240,190,0.9)');
      circle(c, 340, 260, 52, '#fff3cf');
      mountainLayer(c, 420, 90, 500, '#c9a86a');
      c.fillStyle = vgrad(c, 0, 460, 0, H, [[0, '#8fc46a'], [1, '#5a9a48']]);
      c.fillRect(0, 460, W, H - 460);
      mountainLayer(c, 520, 60, 1200, '#6fae54');
      const ex = ((t * 70) % (W + 400)) - 200;
      const ey = 150 + Math.sin(t * 0.7) * 30;
      c.strokeStyle = '#3a3020'; c.lineWidth = 4; c.lineCap = 'round';
      const flap = Math.sin(t * 5) * 10;
      c.beginPath();
      c.moveTo(ex - 26, ey - flap); c.quadraticCurveTo(ex - 8, ey + 6, ex, ey);
      c.quadraticCurveTo(ex + 8, ey + 6, ex + 26, ey - flap);
      c.stroke();
      for (let i = 0; i < 24; i++) {
        const cx = (i * 211 + t * 40) % W;
        const cy = (i * 137 + t * 55) % H;
        c.save();
        c.translate(cx, cy);
        c.rotate(t * 2 + i);
        c.fillStyle = ['#e05a5a', '#e0c84a', '#5aa0e0', '#5ac87a'][i % 4];
        c.globalAlpha = 0.75;
        c.fillRect(-3, -2, 6, 4);
        c.restore();
      }
    } else {
      c.fillStyle = '#171018';
      c.fillRect(0, 0, W, H);
      const wg = vgrad(c, 380, 60, 380, 480, [[0, '#4a1420'], [1, '#7a2a24']]);
      c.fillStyle = wg;
      c.fillRect(360, 60, 560, 420);
      poly(c, [[640, 140], [740, 380], [540, 380]], '#2a0e14');
      glow(c, 640, 148, 60, 'rgba(255,110,40,0.9)');
      c.fillStyle = '#120a10';
      for (let y = 60; y < 480; y += 46) c.fillRect(350, y, 580, 22);
      c.fillStyle = '#241820';
      c.fillRect(280, 480, 720, 240);
      c.fillStyle = '#3a2832';
      c.fillRect(320, 460, 640, 26);
      for (let i = 0; i < 5; i++) {
        c.fillStyle = '#e8e0cc';
        c.save();
        c.translate(420 + i * 40, 448 - (i % 3) * 6);
        c.rotate(-0.06 * i);
        c.fillRect(0, 0, 34, 8);
        c.restore();
      }
      for (let i = 0; i < 14; i++) {
        const px = 380 + ((i * 163 + t * 30) % 520);
        const py = 80 + ((i * 211 + t * 60) % 400);
        c.save();
        c.translate(px, py);
        c.rotate(t * 3 + i);
        c.fillStyle = 'rgba(235,228,208,0.8)';
        c.fillRect(-5, -7, 10, 14);
        c.restore();
      }
      glow(c, 640, 300, 420, 'rgba(200,30,20,0.12)', 0.8);
    }
    vignette(c, W, H, 0.4);
  }

  return {
    title, introBg, endingBg,
    rr, ell, circle, poly, vgrad, glow, cloud, pine, treeRound, bush,
    grassTufts, flowerDots, mountainLayer, vignette,
  };
})();
window.ART = ART;
