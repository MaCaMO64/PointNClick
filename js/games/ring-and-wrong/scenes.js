(() => {
  const { rr, ell, circle, poly, vgrad, glow, cloud, pine, treeRound, bush,
    grassTufts, flowerDots, mountainLayer, vignette } = ART;
  const NOW = () => performance.now() / 1000;

  function apples(c, arr) {
    arr.forEach(([x, y]) => {
      circle(c, x, y, 6.5, '#e0483e');
      circle(c, x - 2, y - 2, 2, 'rgba(255,255,255,0.55)');
    });
  }

  function pathStrip(c, pts, w0, w1, fill, edge) {
    const top = [], bot = [];
    pts.forEach(([x, y], i) => {
      const w = w0 + (w1 - w0) * (i / (pts.length - 1));
      top.push([x, y - w / 2]); bot.push([x, y + w / 2]);
    });
    poly(c, [...top, ...bot.reverse()], fill);
    if (edge) { c.strokeStyle = edge; c.lineWidth = 2; c.stroke(); }
  }

  function logRow(c, x, y, n) {
    for (let i = 0; i < n; i++) {
      const lx = x + i * 66;
      rr(c, lx, y, 62, 17, 8);
      c.fillStyle = '#7a4e2a'; c.fill();
      c.strokeStyle = '#54371c'; c.lineWidth = 2; c.stroke();
      circle(c, lx + 8, y + 8.5, 7.5, '#caa06a', '#7a5230', 1.6);
      circle(c, lx + 8, y + 8.5, 3.5, null, '#a87c4a', 1.2);
    }
  }

  function bottle(c, x, y, col) {
    rr(c, x, y, 11, 26, 3); c.fillStyle = col; c.fill();
    rr(c, x + 3.5, y - 8, 4, 10, 1.5); c.fillStyle = col; c.fill();
    c.fillStyle = 'rgba(255,255,255,0.35)';
    c.fillRect(x + 2, y + 3, 2.5, 14);
  }

  function reeds(c, x, baseY) {
    c.strokeStyle = '#4a7a3a'; c.lineWidth = 2.5; c.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const rx = x + i * 7 - 18;
      const h = 34 + ((i * 37) % 26);
      c.beginPath(); c.moveTo(rx, baseY);
      c.quadraticCurveTo(rx + 4, baseY - h * 0.6, rx + 8, baseY - h);
      c.stroke();
      if (i % 2 === 0) ell(c, rx + 8, baseY - h - 4, 3.2, 8, '#7a5a34');
    }
  }

  function mugSmall(c, x, y, s) {
    rr(c, x, y, 12 * s, 15 * s, 2 * s);
    c.fillStyle = '#e8a83a'; c.fill();
    c.strokeStyle = '#8a5a20'; c.lineWidth = 1.6; c.stroke();
    ell(c, x + 6 * s, y - 1, 6.4 * s, 3 * s, '#fdf6e8');
  }

  const P = {};

  P.dal = (c, W, H) => {
    c.fillStyle = vgrad(c, 0, 0, 0, 570, [[0, '#8fd3f4'], [0.65, '#cfeef7'], [1, '#fdf3cf']]);
    c.fillRect(0, 0, W, H);
    glow(c, 1060, 120, 160, 'rgba(255,244,190,0.85)');
    circle(c, 1060, 120, 44, '#fff6cf');
    cloud(c, 260, 110, 1.1);
    cloud(c, 700, 78, 0.9);
    cloud(c, 950, 155, 0.7, 'rgba(255,255,255,0.8)');
    mountainLayer(c, 430, 60, 400, '#b7d98c');
    mountainLayer(c, 470, 45, 1100, '#93c374');
    c.fillStyle = vgrad(c, 0, 470, 0, H, [[0, '#79b95c'], [1, '#4f8f43']]);
    c.fillRect(0, 470, W, H - 470);
    ell(c, 330, 560, 215, 152, '#6fae54');
    c.strokeStyle = 'rgba(60,110,50,0.35)'; c.lineWidth = 2;
    for (let i = 1; i < 4; i++) {
      c.beginPath(); c.ellipse(330, 560, 215 - i * 40, 152 - i * 32, 0, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
    }
    rr(c, 418, 318, 26, 62, 4); c.fillStyle = '#8a7a6a'; c.fill();
    c.strokeStyle = '#5d5248'; c.lineWidth = 3; c.stroke();
    rr(c, 412, 312, 38, 10, 3); c.fillStyle = '#7a6a5c'; c.fill();
    circle(c, 330, 438, 38, '#4e8f57', '#2f6b3c', 5);
    c.save();
    c.beginPath(); c.arc(330, 438, 34, 0, Math.PI * 2); c.clip();
    c.strokeStyle = 'rgba(30,70,40,0.5)'; c.lineWidth = 2;
    for (let x = 308; x <= 354; x += 9) { c.beginPath(); c.moveTo(x, 404); c.lineTo(x, 472); c.stroke(); }
    c.restore();
    circle(c, 344, 442, 4.5, '#e8c84a', '#8a6a20', 1.5);
    ell(c, 330, 480, 42, 9, '#c9b89a', '#8a7a5c', 2);
    [[262, 455], [398, 455]].forEach(wx => {
      circle(c, wx[0], wx[1], 14, '#ffd76e', '#7a5230', 3);
      c.strokeStyle = '#7a5230'; c.lineWidth = 1.6;
      c.beginPath(); c.moveTo(wx[0] - 14, wx[1]); c.lineTo(wx[0] + 14, wx[1]);
      c.moveTo(wx[0], wx[1] - 14); c.lineTo(wx[0], wx[1] + 14); c.stroke();
    });
    c.fillStyle = '#6b4a2f';
    c.fillRect(500, 478, 8, 28); c.fillRect(568, 478, 8, 28);
    rr(c, 492, 462, 92, 16, 4); c.fillStyle = '#8a5f3c'; c.fill();
    c.strokeStyle = '#5d3c22'; c.lineWidth = 2; c.stroke();
    logRow(c, 74, 528, 2); logRow(c, 90, 508, 2); logRow(c, 106, 488, 1);
    rr(c, 600, 502, 56, 46, 3); c.fillStyle = '#c9a86a'; c.fill();
    c.strokeStyle = '#8a6a3c'; c.lineWidth = 2.5; c.stroke();
    c.strokeStyle = '#a8814e'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(600, 525); c.lineTo(656, 525); c.stroke();
    rr(c, 650, 512, 52, 38, 3); c.fillStyle = '#d9b87c'; c.fill();
    c.strokeStyle = '#8a6a3c'; c.lineWidth = 2.5; c.stroke();
    rr(c, 662, 500, 20, 13, 3); c.fillStyle = '#5d442e'; c.fill();
    c.save();
    c.translate(676, 532); c.rotate(-0.06);
    c.font = 'bold 10px Verdana'; c.fillStyle = '#6b4a2f';
    c.fillText('BONGO', -18, 0);
    c.restore();
    pathStrip(c, [[350, 486], [520, 506], [760, 520], [1000, 524], [1220, 532]], 40, 66, '#cfa76a', '#a8814e');
    c.fillStyle = '#6b4a2f';
    c.fillRect(1068, 442, 8, 84);
    rr(c, 1036, 424, 74, 36, 4); c.fillStyle = '#caa06a'; c.fill();
    c.strokeStyle = '#6b4a2f'; c.lineWidth = 2.5; c.stroke();
    c.font = 'bold 11px Verdana'; c.textAlign = 'center'; c.fillStyle = '#5d3c22';
    c.fillText('BLOOM-', 1073, 440); c.fillText('DALE', 1073, 453);
    c.fillStyle = '#7a5230';
    [[1148], [1190], [1234], [1268]].forEach(px => c.fillRect(px[0], 468, 9, 74));
    c.fillStyle = '#8a5f3c';
    c.fillRect(1148, 480, 47, 8); c.fillRect(1148, 512, 47, 8);
    c.fillRect(1243, 480, 27, 8); c.fillRect(1243, 512, 27, 8);
    treeRound(c, 962, 552, 2.1, '#4e9e4a', '#63b854');
    apples(c, [[905, 330], [945, 298], [1000, 318], [1032, 365], [878, 382], [960, 395], [1012, 412], [924, 416]]);
    grassTufts(c, [[420, 545], [700, 552], [900, 540], [180, 560], [560, 566]], '#3f7d3a');
    flowerDots(c, [[440, 530, '#ff9ec4'], [470, 545, '#ffe066'], [820, 535, '#fff'], [860, 550, '#ff9ec4'], [260, 540, '#ffe066'], [640, 545, '#fff']]);
    bush(c, 760, 500, 1, '#4f8f43');
    vignette(c, W, H, 0.18);
  };

  P.kryss = (c, W, H) => {
    c.fillStyle = vgrad(c, 0, 0, 0, 570, [[0, '#2e2350'], [0.45, '#6b3f63'], [0.78, '#c96a4e'], [1, '#ffb46b']]);
    c.fillRect(0, 0, W, H);
    circle(c, 210, 336, 42, '#ffdf9e');
    glow(c, 210, 336, 110, 'rgba(255,200,120,0.5)');
    mountainLayer(c, 400, 110, 300, '#3a2a4e');
    mountainLayer(c, 445, 80, 900, '#462f5c');
    poly(c, [[1120, 452], [1120, 420], [1150, 420], [1150, 452]], '#33253f');
    poly(c, [[1114, 420], [1156, 420], [1135, 404]], '#33253f');
    c.fillStyle = vgrad(c, 0, 430, 0, 570, [[0, '#57704e'], [1, '#3c5340']]);
    c.fillRect(0, 430, W, 140);
    poly(c, [[600, 490], [690, 490], [648, 296], [616, 296]], '#b08c60');
    poly(c, [[616, 296], [648, 296], [656, 380], [606, 380]], 'rgba(255,180,120,0.15)');
    rr(c, 0, 486, W, 86, 0); c.fillStyle = '#a8845c'; c.fill();
    c.strokeStyle = 'rgba(120,84,52,0.7)'; c.lineWidth = 6;
    c.beginPath(); c.moveTo(0, 512); c.quadraticCurveTo(400, 504, 1280, 516); c.stroke();
    c.beginPath(); c.moveTo(0, 546); c.quadraticCurveTo(500, 556, 1280, 544); c.stroke();
    c.strokeStyle = '#2e2030'; c.lineWidth = 11; c.lineCap = 'round';
    c.beginPath(); c.moveTo(88, 470); c.quadraticCurveTo(80, 380, 96, 320); c.stroke();
    c.lineWidth = 6;
    c.beginPath(); c.moveTo(92, 380); c.lineTo(56, 340); c.moveTo(93, 350); c.lineTo(128, 316); c.moveTo(94, 400); c.lineTo(130, 380); c.stroke();
    c.fillStyle = '#6b4a2f'; c.fillRect(416, 364, 9, 160);
    c.strokeStyle = '#4a3018'; c.lineWidth = 2;
    c.strokeRect(416, 364, 9, 160);
    poly(c, [[300, 372], [404, 372], [404, 398], [300, 398], [282, 385]], '#caa06a');
    c.strokeStyle = '#6b4a2f'; c.lineWidth = 2; c.stroke();
    poly(c, [[436, 404], [540, 404], [558, 417], [540, 430], [436, 430]], '#caa06a');
    c.stroke();
    c.strokeStyle = '#6b5230'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(312, 381); c.lineTo(380, 381); c.moveTo(312, 389); c.lineTo(366, 389); c.stroke();
    c.beginPath(); c.moveTo(452, 413); c.lineTo(520, 413); c.moveTo(452, 421); c.lineTo(506, 421); c.stroke();
    const crow = (x, y, flip) => {
      c.save(); c.translate(x, y); if (flip) c.scale(-1, 1);
      ell(c, 0, 0, 10, 6, '#16141c');
      circle(c, 8, -5, 4.4, '#16141c');
      poly(c, [[11, -5], [17, -3.6], [11, -2.4]], '#e8963a');
      poly(c, [[-9, -1], [-16, -6], [-8, -4]], '#16141c');
      circle(c, 9, -6, 1.2, '#fff');
      c.restore();
    };
    crow(350, 366, false); crow(470, 398, true);
    c.fillStyle = '#6b4a2f'; c.fillRect(176, 466, 7, 62);
    rr(c, 146, 436, 66, 36, 9); c.fillStyle = '#c0392b'; c.fill();
    c.strokeStyle = '#7a1f14'; c.lineWidth = 3; c.stroke();
    c.fillStyle = '#4a100c'; c.fillRect(154, 452, 32, 5);
    poly(c, [[208, 436], [216, 436], [216, 418], [212, 418], [212, 436]], '#e8c84a');
    rr(c, 700, 512, 152, 44, 21); c.fillStyle = '#5a4632'; c.fill();
    c.strokeStyle = '#3a2c1e'; c.lineWidth = 3; c.stroke();
    c.strokeStyle = 'rgba(30,22,12,0.5)'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(740, 516); c.lineTo(736, 552); c.moveTo(790, 514); c.lineTo(794, 552); c.moveTo(830, 518); c.lineTo(826, 550); c.stroke();
    ell(c, 706, 534, 17, 20, '#17110a', '#2e2418', 4);
    grassTufts(c, [[560, 480], [940, 476], [300, 478], [1100, 472]], '#6a7a4a');
    bush(c, 640, 470, 0.8, '#42573c');
    c.fillStyle = 'rgba(255,180,120,0.10)';
    c.fillRect(0, 380, W, 110);
    vignette(c, W, H, 0.3);
  };

  P.pub = (c, W, H) => {
    c.fillStyle = vgrad(c, 0, 0, 0, 500, [[0, '#6b4a2f'], [1, '#54381f']]);
    c.fillRect(0, 0, W, 500);
    c.strokeStyle = 'rgba(30,18,8,0.3)'; c.lineWidth = 2;
    for (let x = 84; x < W; x += 84) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 430); c.stroke(); }
    rr(c, 0, 206, W, 14, 0); c.fillStyle = '#3f2a14'; c.fill();
    rr(c, 0, 326, W, 14, 0); c.fillStyle = '#3f2a14'; c.fill();
    rr(c, 0, 430, W, 72, 0); c.fillStyle = '#4a3018'; c.fill();
    c.fillStyle = '#6b4a2f'; c.fillRect(0, 426, W, 5);
    c.fillStyle = vgrad(c, 0, 500, 0, H, [[0, '#8a5f3c'], [1, '#63401f']]);
    c.fillRect(0, 500, W, H - 500);
    c.strokeStyle = 'rgba(40,24,10,0.4)'; c.lineWidth = 2;
    for (let x = 0; x <= W; x += 128) {
      c.beginPath(); c.moveTo(640 + (x - 640) * 0.55, 500); c.lineTo(x, H); c.stroke();
    }
    c.beginPath(); c.moveTo(0, 545); c.lineTo(W, 545); c.moveTo(0, 600); c.lineTo(W, 600); c.stroke();
    ell(c, 560, 548, 185, 36, '#7a3a3a');
    c.strokeStyle = '#9a5a4a'; c.lineWidth = 3;
    c.beginPath(); c.ellipse(560, 548, 165, 28, 0, 0, Math.PI * 2); c.stroke();
    rr(c, 96, 340, 172, 172, 12); c.fillStyle = '#7d7468'; c.fill();
    c.strokeStyle = 'rgba(40,36,30,0.4)'; c.lineWidth = 2;
    for (let yy = 340; yy < 512; yy += 28) {
      c.beginPath(); c.moveTo(96, yy); c.lineTo(268, yy); c.stroke();
    }
    c.beginPath();
    c.moveTo(122, 512); c.lineTo(122, 412);
    c.arc(182, 412, 60, Math.PI, 0);
    c.lineTo(242, 512);
    c.closePath();
    c.fillStyle = '#120c08'; c.fill();
    c.save();
    c.translate(182, 500);
    c.rotate(-0.4); rr(c, -40, -8, 80, 14, 6); c.fillStyle = '#4a3018'; c.fill();
    c.rotate(0.8); rr(c, -40, -8, 80, 14, 6); c.fillStyle = '#5d442e'; c.fill();
    c.restore();
    [[160, 508], [182, 502], [204, 510]].forEach(p => circle(c, p[0], p[1], 3, '#ff7a2a'));
    rr(c, 88, 330, 188, 16, 3); c.fillStyle = '#5d442e'; c.fill();
    c.strokeStyle = '#3a2a18'; c.lineWidth = 2; c.stroke();
    c.fillStyle = '#efe6d2'; c.fillRect(144, 306, 7, 24);
    poly(c, [[147.5, 300], [153, 308], [142, 308]], '#ffce54');
    rr(c, 214, 300, 14, 30, 3); c.fillStyle = '#c97a2a'; c.fill();
    c.strokeStyle = '#8a5a20'; c.lineWidth = 1.5; c.stroke();
    rr(c, 860, 414, 420, 22, 6); c.fillStyle = '#c9a06a'; c.fill();
    c.strokeStyle = '#7a5230'; c.lineWidth = 3; c.stroke();
    rr(c, 868, 436, 404, 118, 4); c.fillStyle = '#5d3c22'; c.fill();
    c.strokeStyle = '#3a2412'; c.lineWidth = 2.5; c.stroke();
    c.strokeStyle = 'rgba(30,18,8,0.5)';
    for (let x = 908; x < 1268; x += 44) { c.beginPath(); c.moveTo(x, 440); c.lineTo(x, 550); c.stroke(); }
    rr(c, 868, 554, 404, 8, 4); c.fillStyle = '#d4af37'; c.fill();
    rr(c, 884, 232, 382, 152, 4); c.fillStyle = '#2e3a4a'; c.fill();
    c.strokeStyle = '#4a3018'; c.lineWidth = 4; c.stroke();
    const bc = ['#7aa04a', '#c97a2a', '#8a4ac9', '#c9c94a', '#4ac9b0', '#c94a6a', '#7a8ac9'];
    for (let i = 0; i < 8; i++) bottle(c, 900 + i * 44, 224, bc[i % bc.length]);
    for (let i = 0; i < 7; i++) bottle(c, 916 + i * 46, 286, bc[(i + 3) % bc.length]);
    rr(c, 890, 348, 370, 12, 3); c.fillStyle = '#4a3018'; c.fill();
    for (let i = 0; i < 6; i++) {
      const gx = 906 + i * 58;
      rr(c, gx, 360, 16, 20, 3); c.strokeStyle = '#c9d2dc'; c.lineWidth = 2.5; c.stroke();
    }
    [[920], [988]].forEach(bx => {
      circle(c, bx[0], 476, 27, '#7a5230', '#4a3018', 3);
      c.strokeStyle = 'rgba(40,24,10,0.5)'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(bx[0] - 27, 476); c.lineTo(bx[0] + 27, 476); c.stroke();
      circle(c, bx[0], 476, 8, '#5d3c22', '#3a2412', 2);
    });
    [[480], [760]].forEach(lx => {
      const x = lx[0];
      c.strokeStyle = '#2a1c10'; c.lineWidth = 3;
      c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 128); c.stroke();
      poly(c, [[x - 26, 152], [x + 26, 152], [x + 16, 128], [x - 16, 128]], '#d9a05b', '#8a5f2c', 2);
      glow(c, x, 162, 66, 'rgba(255,210,120,0.5)');
      circle(c, x, 158, 6, '#fff0c0');
    });
    rr(c, 300, 300, 124, 90, 6); c.fillStyle = '#2e2a24'; c.fill();
    c.strokeStyle = '#8a6a3c'; c.lineWidth = 5; c.stroke();
    c.font = 'bold 13px Verdana'; c.textAlign = 'center'; c.fillStyle = '#e8e0cc';
    c.fillText('TODAY:', 362, 324); c.fillText('SOUP.', 362, 342);
    c.fillText('TOMORROW:', 362, 364); c.fillText('ALSO SOUP.', 362, 382);
    c.save();
    c.beginPath();
    c.moveTo(736, 424); c.lineTo(736, 352);
    c.arc(771, 352, 35, Math.PI, 0);
    c.lineTo(806, 424);
    c.closePath();
    c.fillStyle = vgrad(c, 0, 330, 0, 424, [[0, '#4a3860'], [1, '#c96a4e']]); c.fill();
    c.strokeStyle = '#3f2a14'; c.lineWidth = 6; c.stroke();
    c.restore();
    poly(c, [[748, 416], [762, 396], [780, 416]], '#33253f');
    circle(c, 830, 296, 21, '#3a2a1a', '#c9a86a', 3);
    circle(c, 830, 296, 13, null, '#c94a3a', 3);
    circle(c, 830, 296, 5, '#c9a86a');
    c.fillStyle = '#6b4527'; c.fillRect(464, 540, 12, 28);
    ell(c, 470, 538, 50, 14, '#8a5f3c', '#5d3c22', 2.5);
    mugSmall(c, 448, 522, 1); mugSmall(c, 488, 519, 1);
    ell(c, 556, 560, 20, 7, '#5d3c22', '#3a2412', 2);
    c.strokeStyle = '#4a3018'; c.lineWidth = 4;
    c.beginPath(); c.moveTo(548, 560); c.lineTo(544, 578); c.moveTo(564, 560); c.lineTo(568, 578); c.stroke();
    circle(c, 70, 522, 30, '#7a5230', '#4a3018', 3);
    c.strokeStyle = 'rgba(40,24,10,0.5)'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(40, 522); c.lineTo(100, 522); c.stroke();
    ell(c, 74, 492, 23, 10, '#16141c');
    circle(c, 94, 488, 7, '#16141c');
    poly(c, [[99, 486], [105, 488], [99, 491]], '#c9988a');
    poly(c, [[86, 480], [90, 473], [94, 480]], '#16141c');
    rr(c, 756, 548, 124, 20, 4); c.fillStyle = '#6b4a2f'; c.fill();
    c.strokeStyle = '#4a3018'; c.lineWidth = 2; c.stroke();
    c.font = 'bold 10px Verdana'; c.fillStyle = '#caa06a'; c.textAlign = 'center';
    c.fillText('E X I T', 818, 561);
    vignette(c, W, H, 0.32);
  };

  P.elv = (c, W, H) => {
    c.fillStyle = vgrad(c, 0, 0, 0, 300, [[0, '#8fd0ea'], [1, '#eafaf0']]);
    c.fillRect(0, 0, W, 300);
    glow(c, 1120, 90, 110, 'rgba(255,248,210,0.8)');
    cloud(c, 240, 90, 1);
    cloud(c, 620, 60, 0.8);
    cloud(c, 940, 120, 0.65, 'rgba(255,255,255,0.85)');
    c.fillStyle = '#8fc46a'; c.fillRect(0, 238, W, 24);
    for (let i = 0; i < 9; i++) pine(c, 60 + i * 145, 258, 26 + (i % 3) * 8, '#5a9a48');
    c.fillStyle = vgrad(c, 0, 258, 0, 438, [[0, '#5fb7c9'], [1, '#3f93ad']]);
    c.fillRect(0, 258, W, 180);
    c.fillStyle = '#d9c99a'; c.fillRect(0, 252, W, 7);
    c.fillStyle = '#c9b184'; c.fillRect(0, 430, W, 10);
    [[505], [625], [745]].forEach(px => {
      c.fillStyle = '#6b4a2f'; c.fillRect(px[0] - 5, 392, 10, 56);
      c.fillStyle = 'rgba(30,60,70,0.25)'; c.fillRect(px[0] - 4, 448, 8, 22);
    });
    poly(c, [[470, 388], [800, 378], [812, 398], [482, 410]], '#9a7040');
    c.strokeStyle = '#7a5230'; c.lineWidth = 2;
    for (let x = 492; x < 800; x += 22) {
      c.beginPath(); c.moveTo(x, 384 - (x - 470) * 0.02); c.lineTo(x + 4, 404 + (x - 470) * 0.02); c.stroke();
    }
    c.fillStyle = '#6b4527'; c.fillRect(482, 408, 330, 7);
    rr(c, 768, 366, 13, 36, 3); c.fillStyle = '#5d442e'; c.fill();
    c.strokeStyle = '#3a2a18'; c.lineWidth = 2; c.stroke();
    c.strokeStyle = '#c9b184'; c.lineWidth = 3;
    c.beginPath(); c.arc(774, 404, 8, 0, Math.PI * 1.6); c.stroke();
    rr(c, 140, 360, 200, 180, 4); c.fillStyle = '#7a5230'; c.fill();
    c.strokeStyle = '#4a3018'; c.lineWidth = 3; c.stroke();
    c.strokeStyle = 'rgba(40,24,10,0.4)'; c.lineWidth = 2;
    for (let x = 170; x < 340; x += 26) { c.beginPath(); c.moveTo(x, 364); c.lineTo(x, 536); c.stroke(); }
    poly(c, [[118, 366], [362, 366], [240, 292]], '#8a4a3a', '#5d3028', 3);
    c.strokeStyle = '#5d3028'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(150, 344); c.lineTo(330, 344); c.moveTo(180, 322); c.lineTo(300, 322); c.stroke();
    rr(c, 198, 442, 84, 98, 3); c.fillStyle = '#5d3c22'; c.fill();
    c.strokeStyle = '#3a2412'; c.lineWidth = 3; c.stroke();
    c.strokeStyle = 'rgba(20,12,6,0.5)';
    c.beginPath(); c.moveTo(226, 444); c.lineTo(226, 538); c.moveTo(254, 444); c.lineTo(254, 538); c.stroke();
    circle(c, 240, 494, 8, '#d4af37', '#8a6a20', 2);
    circle(c, 310, 470, 13, '#ffd76e', '#3f2a14', 3);
    c.strokeStyle = '#3f2a14'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(297, 470); c.lineTo(323, 470); c.moveTo(310, 457); c.lineTo(310, 483); c.stroke();
    rr(c, 158, 402, 164, 34, 4); c.fillStyle = '#caa06a'; c.fill();
    c.strokeStyle = '#6b4a2f'; c.lineWidth = 3; c.stroke();
    c.font = 'bold 17px Verdana'; c.textAlign = 'center'; c.fillStyle = '#5d3c22';
    c.fillText('B O A T H O U S E', 240, 425);
    reeds(c, 430, 476); reeds(c, 905, 470); reeds(c, 1160, 464);
    ell(c, 522, 474, 20, 11, '#7d7468', '#4a4438', 2);
    ell(c, 516, 466, 12, 5, '#5a9a48');
    poly(c, [[1046, 496], [1082, 496], [1074, 524], [1054, 524]], '#5a6a7a', '#38424e', 2.5);
    c.strokeStyle = '#38424e'; c.lineWidth = 2.5;
    c.beginPath(); c.arc(1064, 496, 14, Math.PI, 0); c.stroke();
    poly(c, [[1068, 494], [1078, 478], [1084, 494]], '#8ab0c0', '#5a7a8a', 1.6);
    pathStrip(c, [[0, 540], [60, 532], [120, 528]], 50, 40, '#c9b184');
    c.fillStyle = 'rgba(20,40,50,0.12)';
    c.fillRect(0, 258, W, 180);
    vignette(c, W, H, 0.16);
  };

  P.skog = (c, W, H) => {
    c.fillStyle = vgrad(c, 0, 0, 0, H, [[0, '#0e1626'], [1, '#182a44']]);
    c.fillRect(0, 0, W, H);
    [[420, 40], [520, 70], [610, 30], [700, 55]].forEach(s => circle(c, s[0], s[1], 1.4, 'rgba(255,255,240,0.7)'));
    c.fillStyle = '#0a1220';
    for (let x = -40; x < W + 80; x += 110) {
      circle(c, x, 30, 90);
      circle(c, x + 55, 10, 70);
    }
    poly(c, [[300, 0], [370, 0], [540, 560], [440, 560]], 'rgba(170,200,255,0.05)');
    poly(c, [[880, 0], [940, 0], [1080, 500], [990, 500]], 'rgba(170,200,255,0.04)');
    [[80, 26], [150, 30], [220, 24], [1050, 28], [1120, 26], [1190, 30]].forEach(tk => {
      c.fillStyle = '#131f33';
      c.beginPath();
      c.moveTo(tk[0] - tk[1] / 2, 0); c.lineTo(tk[0] + tk[1] / 2, 0);
      c.lineTo(tk[0] + tk[1] / 2 + 6, 570); c.lineTo(tk[0] - tk[1] / 2 - 6, 570);
      c.closePath(); c.fill();
    });
    c.fillStyle = '#1c2a40';
    c.beginPath(); c.moveTo(30, 0); c.lineTo(105, 0); c.lineTo(125, 570); c.lineTo(0, 570); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(1175, 0); c.lineTo(1252, 0); c.lineTo(1280, 570); c.lineTo(1155, 570); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(10,14,24,0.7)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(60, 60); c.lineTo(70, 560); c.moveTo(1210, 80); c.lineTo(1198, 560); c.stroke();
    c.fillStyle = vgrad(c, 0, 470, 0, H, [[0, '#20304a'], [1, '#141f36']]);
    c.fillRect(0, 470, W, H - 470);
    c.strokeStyle = 'rgba(10,14,26,0.8)'; c.lineWidth = 4;
    c.beginPath(); c.moveTo(180, 540); c.quadraticCurveTo(260, 528, 330, 542); c.moveTo(700, 552); c.quadraticCurveTo(770, 542, 830, 552); c.stroke();
    poly(c, [[840, 470], [1140, 470], [1140, 570], [840, 570]], '#05070c');
    c.fillStyle = vgrad(c, 0, 470, 0, 570, [[0, '#0a0e18'], [1, '#03040a']]);
    c.beginPath(); c.moveTo(840, 470); c.lineTo(1140, 470); c.lineTo(1140, 570); c.lineTo(840, 570); c.closePath(); c.fill();
    c.strokeStyle = '#3a4a66'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(840, 470); c.lineTo(840, 570); c.moveTo(1140, 470); c.lineTo(1140, 570); c.stroke();
    c.fillStyle = '#3a3040'; c.fillRect(876, 470, 22, 100);
    c.fillStyle = '#2e2636'; c.fillRect(1082, 470, 22, 100);
    c.strokeStyle = '#4a5060'; c.lineWidth = 30; c.lineCap = 'round';
    c.beginPath(); c.moveTo(826, 470); c.quadraticCurveTo(985, 428, 1150, 470); c.stroke();
    c.strokeStyle = '#6a7180'; c.lineWidth = 24;
    c.beginPath(); c.moveTo(826, 466); c.quadraticCurveTo(985, 424, 1150, 466); c.stroke();
    c.strokeStyle = '#7a8194'; c.lineWidth = 7;
    c.beginPath(); c.moveTo(826, 452); c.quadraticCurveTo(985, 410, 1150, 452); c.stroke();
    c.strokeStyle = '#565d6e'; c.lineWidth = 2;
    for (let i = 0; i <= 8; i++) {
      const bx = 840 + i * 39;
      const by = 466 - Math.sin((i / 8) * Math.PI) * 40;
      c.beginPath(); c.moveTo(bx, by - 12); c.lineTo(bx, by + 12); c.stroke();
    }
    ell(c, 940, 448, 16, 6, 'rgba(90,154,72,0.55)');
    ell(c, 1060, 458, 12, 5, 'rgba(90,154,72,0.45)');
    c.fillStyle = '#3a3040'; c.fillRect(792, 396, 7, 86);
    c.fillRect(792, 396, 30, 6);
    rr(c, 812, 398, 22, 26, 3); c.fillStyle = '#2a3444'; c.fill();
    c.strokeStyle = '#171d28'; c.lineWidth = 2.5; c.stroke();
    poly(c, [[810, 398], [836, 398], [833, 392], [813, 392]], '#171d28');
    [[300], [305], [295]].forEach((sx, i) => circle(c, sx[0] + (i - 1) * 16, 528 + (i % 2) * 3, 6, '#565d6e', '#3a4050', 2));
    c.save();
    c.translate(300, 516);
    c.rotate(-0.5); rr(c, -26, -6, 52, 12, 6); c.fillStyle = '#4a3018'; c.fill();
    c.rotate(1.0); rr(c, -26, -6, 52, 12, 6); c.fillStyle = '#3a2a18'; c.fill();
    c.restore();
    circle(c, 300, 512, 10, '#1a120a');
    glow(c, 300, 512, 80, 'rgba(255,150,50,0.28)');
    const shroom = (mx, my, s) => {
      glow(c, mx, my - 6 * s, 16 * s, 'rgba(110,225,255,0.35)');
      c.fillStyle = '#dfe8ee'; c.fillRect(mx - 2 * s, my - 8 * s, 4 * s, 8 * s);
      ell(c, mx, my - 9 * s, 7 * s, 4.5 * s, '#6fe3ff', '#3a9ec0', 1.4);
    };
    shroom(352, 560, 1); shroom(344, 562, 0.7); shroom(1085, 560, 0.9); shroom(770, 564, 0.75);
    c.fillStyle = '#141d30';
    c.beginPath(); c.moveTo(556, 570); c.lineTo(566, 240); c.lineTo(634, 240); c.lineTo(648, 570); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(8,12,22,0.8)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(576, 100); c.lineTo(586, 566); c.moveTo(622, 90); c.lineTo(616, 566); c.stroke();
    ell(c, 598, 432, 17, 24, '#0a0f1a', '#050810', 3);
    c.strokeStyle = '#141d30'; c.lineWidth = 8; c.lineCap = 'round';
    c.beginPath(); c.moveTo(596, 260); c.lineTo(500, 190); c.stroke();
    ell(c, 200, 176, 12, 16, '#3a3040', '#221c2a', 2);
    poly(c, [[192, 162], [196, 152], [200, 162]], '#3a3040');
    poly(c, [[202, 162], [207, 152], [211, 162]], '#3a3040');
    circle(c, 195, 172, 2.6, '#ffd24a'); circle(c, 205, 172, 2.6, '#ffd24a');
    vignette(c, W, H, 0.42);
  };

  P.vulkan = (c, W, H) => {
    c.fillStyle = vgrad(c, 0, 0, 0, 570, [[0, '#1a0a12'], [0.5, '#3a1420'], [1, '#6b2a24']]);
    c.fillRect(0, 0, W, H);
    poly(c, [[80, 480], [330, 178], [430, 296], [560, 480]], '#241018');
    poly(c, [[300, 200], [362, 200], [332, 246]], '#3a1420');
    c.strokeStyle = '#ff7a3a'; c.lineWidth = 5; c.lineCap = 'round';
    c.beginPath(); c.moveTo(298, 202); c.quadraticCurveTo(330, 218, 364, 202); c.stroke();
    glow(c, 331, 208, 60, 'rgba(255,120,50,0.5)');
    c.strokeStyle = 'rgba(168,58,26,0.65)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(330, 224); c.lineTo(310, 330); c.moveTo(334, 226); c.lineTo(360, 340); c.moveTo(322, 300); c.lineTo(280, 400); c.stroke();
    c.fillStyle = '#2a1a20';
    c.beginPath(); c.moveTo(580, 480); c.lineTo(640, 260); c.lineTo(900, 230); c.lineTo(1280, 250); c.lineTo(1280, 480); c.closePath(); c.fill();
    poly(c, [[640, 260], [900, 230], [880, 300], [700, 330]], '#33202a');
    poly(c, [[900, 230], [1280, 250], [1280, 330], [920, 310]], '#22141c');
    c.fillStyle = '#15100e';
    circle(c, 940, 398, 96);
    circle(c, 940, 398, 92, '#333a46', '#3c414c', 14);
    c.strokeStyle = '#5a6270'; c.lineWidth = 3;
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      circle(c, 940 + Math.cos(a) * 85, 398 + Math.sin(a) * 85, 3.5, '#5a6270');
    }
    c.strokeStyle = 'rgba(16,20,26,0.7)'; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(940, 322); c.lineTo(940, 474); c.moveTo(890, 398); c.lineTo(990, 398); c.stroke();
    poly(c, [[918, 366], [962, 366], [948, 378], [932, 378]], '#0a0c10');
    circle(c, 940, 372, 2.6, '#a82a1a');
    rr(c, 903, 430, 74, 26, 4); c.fillStyle = '#222831'; c.fill();
    c.strokeStyle = '#454e5c'; c.lineWidth = 2; c.stroke();
    c.strokeStyle = '#454e5c'; c.lineWidth = 3.5;
    for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(912 + i * 14, 432); c.lineTo(912 + i * 14, 454); c.stroke(); }
    c.save();
    c.translate(940, 336); c.rotate(-0.03);
    c.strokeStyle = '#3a2a1a'; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(-38, -22); c.lineTo(-38, -8); c.moveTo(38, -22); c.lineTo(38, -8); c.stroke();
    rr(c, -72, -8, 144, 52, 5); c.fillStyle = '#c9a86a'; c.fill();
    c.strokeStyle = '#6b4a2f'; c.lineWidth = 3; c.stroke();
    c.font = 'bold 15px Verdana'; c.textAlign = 'center'; c.fillStyle = '#4a3018';
    c.fillText('CLOSED FOR', 0, 12); c.fillText('MAINTENANCE', 0, 31);
    c.font = '9px Verdana';
    c.fillText('(reopens next age)', 0, 41);
    c.restore();
    rr(c, 650, 444, 140, 12, 3); c.fillStyle = '#6b4550'; c.fill();
    c.strokeStyle = '#3a2028'; c.lineWidth = 2; c.stroke();
    rr(c, 662, 456, 116, 56, 3); c.fillStyle = '#4a3038'; c.fill();
    c.strokeStyle = '#2a181f'; c.lineWidth = 2.5; c.stroke();
    for (let i = 0; i < 3; i++) {
      const px = 676 + i * 34;
      for (let j = 0; j < 3; j++) {
        c.fillStyle = '#e8e0cc';
        c.fillRect(px + j, 444 - j * 4 - 8, 24 - j * 2, 5);
        c.strokeStyle = '#b0a890'; c.lineWidth = 1; c.strokeRect(px + j, 444 - j * 4 - 8, 24 - j * 2, 5);
      }
    }
    rr(c, 742, 434, 16, 10, 2); c.fillStyle = '#c0392b'; c.fill();
    c.strokeStyle = '#3a2a1a'; c.lineWidth = 3;
    [[600, 522], [632, 542], [668, 552]].forEach(p => {
      c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[0], p[1] - 26); c.stroke();
      circle(c, p[0], p[1] - 28, 3, '#3a2a1a');
    });
    c.strokeStyle = '#b03a3a'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(600, 498); c.quadraticCurveTo(616, 522, 632, 518); c.stroke();
    c.beginPath(); c.moveTo(632, 518); c.quadraticCurveTo(650, 540, 668, 528); c.stroke();
    c.fillStyle = '#3a2a1a'; c.fillRect(180, 462, 7, 70);
    rr(c, 152, 414, 64, 46, 4); c.fillStyle = '#d9c99a'; c.fill();
    c.strokeStyle = '#6b5a3a'; c.lineWidth = 2.5; c.stroke();
    circle(c, 184, 432, 9, '#f4efe2');
    circle(c, 181, 431, 2, '#2a2a2a'); circle(c, 187, 431, 2, '#2a2a2a');
    c.strokeStyle = '#6b5a3a'; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(166, 448); c.lineTo(202, 448); c.moveTo(166, 453); c.lineTo(202, 453); c.stroke();
    c.fillStyle = '#3a2a1a'; c.fillRect(420, 452, 7, 70);
    rr(c, 372, 414, 104, 40, 4); c.fillStyle = '#d9c99a'; c.fill();
    c.strokeStyle = '#6b5a3a'; c.lineWidth = 2.5; c.stroke();
    c.font = 'bold 10px Verdana'; c.textAlign = 'center'; c.fillStyle = '#4a3018';
    c.fillText('NO PARKING', 424, 431); c.fillText('FOR DRAGONS', 424, 444);
    c.fillStyle = vgrad(c, 0, 470, 0, H, [[0, '#33262a'], [1, '#20161a']]);
    c.fillRect(0, 470, W, H - 470);
    c.strokeStyle = '#120c0e'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(100, 540); c.lineTo(160, 528); c.lineTo(220, 542); c.moveTo(500, 548); c.lineTo(560, 534); c.moveTo(1020, 552); c.lineTo(1080, 540); c.stroke();
    c.strokeStyle = '#ff6a2a'; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(130, 536); c.lineTo(190, 530); c.moveTo(520, 542); c.lineTo(575, 537); c.moveTo(1030, 548); c.lineTo(1090, 543); c.stroke();
    pathStrip(c, [[240, 560], [480, 528], [760, 520], [900, 524]], 60, 46, '#4a3438');
    vignette(c, W, H, 0.34);
  };

  P.krater = (c, W, H) => {
    c.fillStyle = vgrad(c, 0, 0, 0, 570, [[0, '#12060c'], [1, '#3a0e14']]);
    c.fillRect(0, 0, W, H);
    c.fillStyle = '#1c0a10';
    c.beginPath(); c.moveTo(0, 320); c.quadraticCurveTo(640, 250, 1280, 330); c.lineTo(1280, 440); c.lineTo(0, 440); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(255,138,74,0.3)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(0, 322); c.quadraticCurveTo(640, 252, 1280, 332); c.stroke();
    glow(c, 900, 480, 380, 'rgba(255,110,40,0.28)');
    poly(c, [[0, 570], [0, 470], [180, 452], [420, 444], [700, 452], [940, 442], [1120, 452], [1280, 430], [1280, 570]], '#2e2226');
    poly(c, [[430, 570], [540, 470], [880, 440], [1280, 452], [1280, 570]], null);
    const lavaPts = [[520, 570], [600, 480], [900, 452], [1280, 460], [1280, 570]];
    poly(c, lavaPts, vgrad(c, 0, 440, 0, 570, [[0, '#ff9a3a'], [1, '#d43a1a']]));
    [[700, 500, 40, 14], [860, 520, 55, 16], [1020, 496, 34, 12], [1150, 530, 48, 15], [620, 540, 30, 10], [940, 552, 42, 13]].forEach(p => {
      ell(c, p[0], p[1], p[2], p[3], 'rgba(138,42,18,0.6)');
    });
    c.strokeStyle = '#ffd24a'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(660, 490); c.lineTo(760, 512); c.moveTo(900, 470); c.lineTo(980, 494); c.moveTo(1080, 510); c.lineTo(1180, 522); c.stroke();
    c.fillStyle = '#2e2226';
    poly(c, [[0, 570], [0, 480], [140, 462], [320, 452], [480, 458], [540, 480], [500, 570]]);
    poly(c, [[940, 570], [960, 470], [1120, 458], [1280, 470], [1280, 570]], '#2e2226');
    c.strokeStyle = 'rgba(255,138,74,0.55)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(140, 462); c.lineTo(320, 452); c.lineTo(480, 458); c.stroke();
    c.beginPath(); c.moveTo(960, 470); c.lineTo(1120, 458); c.lineTo(1280, 470); c.stroke();
    c.strokeStyle = 'rgba(20,12,10,0.6)'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(200, 490); c.lineTo(260, 484); c.moveTo(380, 500); c.lineTo(440, 494); c.moveTo(1020, 500); c.lineTo(1080, 494); c.stroke();
    c.save();
    c.translate(1122, 452); c.rotate(0.16);
    c.strokeStyle = '#3a2a20'; c.lineWidth = 5;
    c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(6, -30, -4, -56); c.stroke();
    rr(c, -46, -84, 92, 34, 4); c.fillStyle = '#c9a86a'; c.fill();
    c.strokeStyle = '#6b4a2f'; c.lineWidth = 2.5; c.stroke();
    c.font = 'bold 11px Verdana'; c.textAlign = 'center'; c.fillStyle = '#4a3018';
    c.fillText('DO NOT', 0, -68); c.fillText('THROW THINGS!', 0, -56);
    c.restore();
    c.fillStyle = 'rgba(255,255,240,0.05)';
    for (let i = 0; i < 40; i++) circle(c, (i * 137) % W, (i * 89) % 300, 1.2);
    vignette(c, W, H, 0.45);
  };

  const A = {};

  A.dalUnder = (c, t, G) => {
    c.fillStyle = '#7a4e2a'; c.strokeStyle = '#4e3018'; c.lineWidth = 2;
    [[40, 556], [96, 556], [58, 540], [114, 540], [76, 524]].forEach(lx => {
      rr(c, lx[0], lx[1], 52, 15, 7); c.fill(); c.stroke();
      circle(c, lx[0] + 7, lx[1] + 7.5, 6, '#c9a06a', '#7a5230', 1.6);
    });
    rr(c, 300, 500, 56, 48, 3); c.fillStyle = '#c8a468'; c.fill();
    c.strokeStyle = '#8a6a3c'; c.lineWidth = 2.5; c.stroke();
    c.strokeStyle = 'rgba(160,120,70,0.9)'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(326, 500); c.lineTo(332, 548); c.stroke();
    rr(c, 348, 512, 50, 38, 3); c.fillStyle = '#d6b87e'; c.fill();
    c.strokeStyle = '#8a6a3c'; c.lineWidth = 2.5; c.stroke();
    [[930, 340], [960, 316], [992, 342], [1006, 382], [918, 392], [958, 398], [978, 362]].forEach(p => {
      circle(c, p[0], p[1], 6.5, '#d94038');
      circle(c, p[0] - 2, p[1] - 2, 2, 'rgba(255,255,255,0.55)');
    });
    if (!G.has('fløyte')) {
      c.save(); c.translate(150, 514); c.scale(0.8, 0.8);
      GAME_ICONS['fløyte'](c);
      c.restore();
    }
    if (!G.has('stokk')) {
      c.strokeStyle = '#8a5a33'; c.lineWidth = 7; c.lineCap = 'round';
      c.beginPath(); c.moveTo(178, 558); c.lineTo(198, 522); c.stroke();
    }
    if (G.flag('appleGround') && !G.has('eple')) {
      circle(c, 988, 548, 8, '#d9403a', '#8a2018', 2);
      circle(c, 985, 545, 2, 'rgba(255,255,255,0.5)');
    }
  };

  A.dalOver = (c, t, G) => {
    [[620, 300, '#e8963a'], [520, 250, '#7ab0e0']].forEach((bf, i) => {
      const bx = bf[0] + Math.sin(t * 0.7 + i * 2) * 60;
      const by = bf[1] + Math.sin(t * 1.1 + i) * 30;
      const flap = Math.sin(t * 18 + i * 3);
      c.fillStyle = bf[2];
      ell(c, bx - 4, by, 5, 2.4 * Math.abs(flap) + 1);
      ell(c, bx + 4, by, 5, 2.4 * Math.abs(flap) + 1);
      c.fillStyle = '#2a2020';
      ell(c, bx, by, 1.8, 4);
    });
    if (G.flag('appleFalling') && G.room && G.room._appleT) {
      const ft = NOW() - G.room._appleT;
      if (ft >= 0 && ft < 0.85) {
        const p = ft / 0.85;
        const ay = 330 + p * p * 218;
        circle(c, 988, ay, 8, '#d9403a', '#8a2018', 2);
      }
    }
  };

  A.kryssUnder = (c, t, G) => {
    if (G.flag('avisOut') && !G.has('avis')) {
      c.save();
      c.translate(214, 552); c.rotate(0.12);
      rr(c, -20, -14, 40, 28, 2); c.fillStyle = '#efe9d8'; c.fill();
      c.strokeStyle = '#8a8574'; c.lineWidth = 1.5; c.stroke();
      c.fillStyle = '#4a4638'; c.fillRect(-16, -10, 32, 6);
      c.strokeStyle = '#9a958a'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(-16, 0); c.lineTo(16, 0); c.moveTo(-16, 5); c.lineTo(8, 5); c.stroke();
      c.restore();
    }
  };

  A.kryssOver = (c, t, G) => {
    const cyc = 13;
    const ph = (t % cyc) / cyc;
    if (ph > 0.06 && ph < 0.94) {
      const tx = -80 + ph * (1280 + 160);
      const ty = 536 - Math.abs(Math.sin(ph * Math.PI * 4)) * 12;
      c.save();
      c.translate(tx, ty); c.rotate(tx * 0.05);
      circle(c, 0, 0, 13, null, '#8a7a4a', 2.5);
      c.strokeStyle = '#8a7a4a'; c.lineWidth = 1.5;
      for (let i = 0; i < 5; i++) {
        const a = i * Math.PI * 2 / 5;
        c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * 13, Math.sin(a) * 13); c.stroke();
      }
      c.restore();
    }
    if (Math.floor(t / 7) % 2 === 0) {
      const wob = Math.sin(t * 10) * 0.12;
      c.save();
      c.translate(350, 366); c.rotate(wob);
      ell(c, -12, -2, 9, 3.4, '#16141c');
      ell(c, 12, -2, 9, 3.4, '#16141c');
      c.restore();
    }
    for (let i = 0; i < 5; i++) {
      const fx = 700 + Math.sin(t * 0.5 + i * 2.2) * 90 + i * 30;
      const fy = 470 + Math.cos(t * 0.8 + i * 1.4) * 40;
      const al = 0.25 + 0.5 * Math.abs(Math.sin(t * 1.6 + i * 2));
      circle(c, fx, fy, 1.8, 'rgba(255,220,140,' + al.toFixed(2) + ')');
    }
  };

  A.pubUnder = (c, t, G) => {
    if (!G.flag('sausageGone')) {
      ell(c, 328, 432, 21, 6, '#e8e2d2', '#b0a890', 1.5);
      c.save();
      c.translate(328, 426); c.scale(0.85, 0.85);
      GAME_ICONS['pølse'](c);
      c.restore();
    }
    if (G.flag('spoonFloor') && !G.has('skje')) {
      c.save();
      c.translate(764, 550);
      c.rotate(0.5);
      GAME_ICONS.skje(c);
      c.restore();
    }
  };

  A.pubOver = (c, t, G) => {
    const fl = (fx, fy, s) => {
      glow(c, fx, fy, 70 * s, 'rgba(255,140,50,' + (0.2 + 0.07 * Math.sin(t * 7)).toFixed(2) + ')');
      [['#ff8a2a', 1], ['#ffc84a', 0.72], ['#fff0a0', 0.45]].forEach((L, li) => {
        const hh = (14 + li * 6) * s * (1 + 0.25 * Math.sin(t * (7 + li * 2) + li * 2));
        poly(c, [
          [fx - 10 * s * (1 - li * 0.2), fy],
          [fx - 4 * s, fy - hh * 0.4],
          [fx - 1 * s, fy - hh],
          [fx + 4 * s, fy - hh * 0.5],
          [fx + 10 * s * (1 - li * 0.2), fy],
        ], L[0]);
      });
    };
    fl(614, 452, 1.05);
    glow(c, 588, 358, 16, 'rgba(255,200,90,0.5)');
    poly(c, [[588, 352 - Math.sin(t * 9) * 1.5], [592.5, 360], [583.5, 360]], '#ffce54');
    for (let i = 0; i < 8; i++) {
      const dx = 700 + ((i * 67 + t * 6) % 140);
      const dy = 200 + ((i * 43 + t * 3) % 220);
      circle(c, dx, dy, 1.2, 'rgba(255,230,170,0.3)');
    }
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.5 + i * 0.33) % 1;
      c.strokeStyle = 'rgba(240,240,240,' + ((1 - ph) * 0.3).toFixed(2) + ')';
      c.lineWidth = 1.6;
      c.beginPath();
      c.moveTo(852 + Math.sin(ph * 7 + i) * 4, 514 - ph * 26);
      c.quadraticCurveTo(856 + Math.sin(ph * 9 + i) * 5, 506 - ph * 26, 852 + Math.sin(ph * 5 + i) * 4, 498 - ph * 26);
      c.stroke();
    }
  };

  A.elvUnder = (c, t, G) => {
    c.strokeStyle = 'rgba(255,255,255,0.16)';
    c.lineWidth = 3; c.lineCap = 'round';
    [285, 315, 348, 385, 415].forEach((sy, ri) => {
      const off = Math.sin(t * 1.2 + ri) * 26;
      for (let seg = 0; seg < 7; seg++) {
        const sx = 40 + seg * 190 + off + ri * 30;
        c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + 42, sy); c.stroke();
      }
    });
    if (G.flag('boatUnlocked')) {
      c.save();
      c.beginPath(); c.rect(198, 442, 84, 98); c.clip();
      c.fillStyle = '#0e0a06';
      c.fillRect(198, 442, 84, 98);
      poly(c, [[204, 516], [276, 516], [266, 494], [214, 494]], '#6f4a2c', '#3a2412', 2);
      rr(c, 226, 500, 28, 7, 2); c.fillStyle = '#7a5230'; c.fill();
      c.restore();
    }
  };

  A.elvOver = (c, t, G) => {
    if (!G.flag('chainOff')) {
      circle(c, 774.5, 372, 5, '#d4af37', '#8a6a20', 2);
      c.strokeStyle = '#8a6a20'; c.lineWidth = 2;
      c.beginPath(); c.arc(774.5, 366, 3.5, Math.PI, 0); c.stroke();
    }
    c.save();
    c.translate(735, 398 + Math.sin(t * 1.3) * 2);
    c.rotate(Math.sin(t * 1.1) * 0.05);
    poly(c, [[-58, -10], [58, -10], [44, 14], [-44, 14]], '#8a5f3c', '#5d3c22', 3);
    poly(c, [[-58, -10], [58, -10], [52, -16], [-52, -16]], '#a87c4a', '#5d3c22', 2);
    rr(c, -30, -22, 60, 8, 3); c.fillStyle = '#6b4527'; c.fill();
    c.strokeStyle = '#3a2a18'; c.lineWidth = 1.5; c.stroke();
    c.restore();
    c.strokeStyle = '#c9b184'; c.lineWidth = 2.4;
    c.beginPath(); c.moveTo(780, 384); c.quadraticCurveTo(760, 376, 738, 382); c.stroke();
    reeds(c, 430, 476); reeds(c, 905, 470); reeds(c, 1160, 464);
    const dgx = 440 + Math.sin(t * 2.6) * 46;
    const dgy = 416 + Math.sin(t * 4.1) * 18;
    c.fillStyle = '#4ac9b0';
    ell(c, dgx - 4, dgy, 4, 1.4, 'rgba(180,255,240,0.7)');
    ell(c, dgx + 4, dgy, 4, 1.4, 'rgba(180,255,240,0.7)');
    ell(c, dgx, dgy, 4, 1.6, '#3a8a7a');
    const minT = t % 9;
    if (minT < 0.7 && minT > 0.15) {
      const mp = (minT - 0.15) / 0.55;
      const mx = 600 + mp * 70;
      const my = 330 - Math.sin(mp * Math.PI) * 36;
      c.save();
      c.translate(mx, my); c.rotate(mp * 5);
      ell(c, 0, 0, 8, 3, '#c9dde8');
      poly(c, [[-8, 0], [-14, -5], [-13, 3]], '#aac4d0');
      c.restore();
    }
    if (G.room && G.room._fishT) {
      const ft = NOW() - G.room._fishT;
      if (ft > 0 && ft < 1.35) {
        const p = ft / 1.35;
        const fx = 930 + p * 145;
        const fy = 300 - Math.sin(p * Math.PI) * 125;
        c.save();
        c.translate(fx, fy);
        c.rotate(-0.8 + p * 1.6);
        ell(c, 0, 0, 22, 9, '#9ab8c8', '#5a7a8a', 2);
        poly(c, [[-20, 0], [-34, -10], [-32, 8]], '#7a9aab');
        circle(c, 12, -2, 2, '#1c2230');
        c.restore();
        if (p < 0.15 || p > 0.85) {
          c.strokeStyle = 'rgba(230,245,250,' + (0.7 - p * 0.5).toFixed(2) + ')';
          c.lineWidth = 2;
          circle(c, 930 + p * 145, 300, 10 + p * 30, null, null);
          c.stroke();
        }
      }
    }
    ell(c, 870, 480, 38, 24, '#7d7468', '#4a4438', 2.5);
    ell(c, 858, 462, 20, 8, '#5a9a48');
    ell(c, 888, 470, 12, 5, 'rgba(90,154,72,0.5)');
  };

  A.skogOver = (c, t, G) => {
    for (let i = 0; i < 14; i++) {
      const fx = 180 + ((i * 173) % 920) + Math.sin(t * 0.7 + i * 1.3) * 42;
      const fy = 360 + ((i * 97) % 190) + Math.cos(t * 0.5 + i * 2.1) * 26;
      const al = 0.2 + 0.65 * Math.abs(Math.sin(t * 1.8 + i * 1.7));
      glow(c, fx, fy, 9, 'rgba(190,255,175,' + (al * 0.5).toFixed(2) + ')');
      circle(c, fx, fy, 1.7, 'rgba(210,255,190,' + al.toFixed(2) + ')');
    }
    glow(c, 300, 508, 90, 'rgba(255,150,50,' + (0.22 + 0.09 * Math.sin(t * 8)).toFixed(2) + ')');
    [['#ff8a2a', 1], ['#ffc84a', 0.7], ['#fff0a0', 0.42]].forEach((L, li) => {
      const hh = 26 + li * 8 + Math.sin(t * (8 + li * 3)) * 6;
      poly(c, [
        [288 - li * 3, 514], [294, 514 - hh * 0.5], [300, 514 - hh], [306, 514 - hh * 0.55], [312 + li * 3, 514],
      ], L[0]);
    });
    for (let i = 0; i < 5; i++) {
      const sp = (t * 0.6 + i * 0.37) % 1;
      circle(c, 290 + Math.sin(i * 5) * 20, 500 - sp * 70, 1.6, 'rgba(255,190,90,' + ((1 - sp) * 0.8).toFixed(2) + ')');
    }
    const mg = 0.4 + 0.3 * Math.sin(t * 2 + 1);
    glow(c, 352, 552, 20, 'rgba(110,225,255,' + (mg * 0.5).toFixed(2) + ')');
    glow(c, 770, 556, 16, 'rgba(110,225,255,' + (mg * 0.45).toFixed(2) + ')');
    const blink = (t % 5.2) > 0.25;
    if (blink) {
      glow(c, 195, 172, 8, 'rgba(255,210,74,0.4)');
      glow(c, 205, 172, 8, 'rgba(255,210,74,0.4)');
    }
    if (G.has && G.has('ring') && !(G.flag && G.flag('finaleStarted'))) {
      const gb = (t % 4.4) > 0.2;
      if (gb) {
        glow(c, 592, 428, 10, 'rgba(150,220,255,0.35)');
        glow(c, 604, 428, 10, 'rgba(150,220,255,0.35)');
        ell(c, 592, 428, 3.4, 4.2, '#bfe8ff');
        ell(c, 604, 428, 3.4, 4.2, '#bfe8ff');
        circle(c, 593, 428, 1.4, '#2a6ea8');
        circle(c, 605, 428, 1.4, '#2a6ea8');
      }
    }
    c.fillStyle = 'rgba(190,210,240,0.045)';
    const mx = (t * 9) % (W1280());
    ell(c, mx, 500, 300, 40, 'rgba(190,210,240,0.05)');
    ell(c, mx - 700, 520, 260, 34, 'rgba(190,210,240,0.04)');
    function W1280() { return 1500; }
  };

  A.vulkanOver = (c, t, G) => {
    glow(c, 331, 206, 70, 'rgba(255,120,50,' + (0.4 + 0.22 * Math.sin(t * 2.4)).toFixed(2) + ')');
    for (let i = 0; i < 4; i++) {
      const ph = (t * 0.22 + i * 0.25) % 1;
      const px = 332 + ph * 130;
      const py = 190 - ph * 60;
      c.fillStyle = 'rgba(60,40,45,' + ((1 - ph) * 0.4).toFixed(2) + ')';
      circle(c, px, py, 12 + ph * 26);
    }
    for (let i = 0; i < 16; i++) {
      const lp = (t * 0.35 + i * 0.113) % 1;
      const ex = 200 + ((i * 271) % 980) + Math.sin(t * 2 + i) * 14;
      const ey = 560 - lp * 420;
      circle(c, ex, ey, 1.8, 'rgba(255,150,60,' + ((1 - lp) * 0.85).toFixed(2) + ')');
    }
    for (let i = 0; i < 18; i++) {
      const ap = (t * 0.1 + i * 0.059) % 1;
      const ax = ((i * 331) % 1280 + Math.sin(t + i) * 20);
      const ay = ap * 570;
      circle(c, ax, ay, 1.3, 'rgba(160,150,150,' + (0.35 - ap * 0.2).toFixed(2) + ')');
    }
    c.strokeStyle = 'rgba(255,106,42,' + (0.18 + 0.16 * Math.sin(t * 3)).toFixed(2) + ')';
    c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(130, 536); c.lineTo(190, 530); c.moveTo(520, 542); c.lineTo(575, 537); c.moveTo(1030, 548); c.lineTo(1090, 543); c.stroke();
  };

  A.kraterOver = (c, t, G) => {
    for (let i = 0; i < 8; i++) {
      const bp = (t * 0.5 + i * 0.149) % 1;
      const bx = 620 + ((i * 277) % 620);
      const by = 545 - bp * 60;
      const br = 3 + bp * 11;
      c.strokeStyle = 'rgba(255,210,90,' + ((1 - bp) * 0.8).toFixed(2) + ')';
      c.lineWidth = 2;
      circle(c, bx, by, br);
    }
    for (let i = 0; i < 22; i++) {
      const ep = (t * 0.5 + i * 0.067) % 1;
      const ex = 560 + ((i * 311) % 700) + Math.sin(t * 3 + i) * 18;
      const ey = 500 - ep * 430;
      circle(c, ex, ey, 2, 'rgba(255,170,70,' + ((1 - ep) * 0.9).toFixed(2) + ')');
    }
    glow(c, 900, 490, 420, 'rgba(255,110,40,' + (0.22 + 0.1 * Math.sin(t * 1.6)).toFixed(2) + ')');
    for (let i = 0; i < 3; i++) {
      const sp = (t * 0.3 + i * 0.33) % 1;
      const sx = [760, 980, 1140][i];
      c.fillStyle = 'rgba(50,35,40,' + ((1 - sp) * 0.35).toFixed(2) + ')';
      circle(c, sx + Math.sin(sp * 6 + i) * 22, 460 - sp * 240, 16 + sp * 34);
    }
  };

  Object.assign(ART, { dal: P.dal, kryss: P.kryss, pub: P.pub, elv: P.elv, skog: P.skog, vulkan: P.vulkan, krater: P.krater });
  Object.assign(ART, {
    animDalUnder: A.dalUnder, animDalOver: A.dalOver,
    animKryssUnder: A.kryssUnder, animKryssOver: A.kryssOver,
    animPubUnder: A.pubUnder, animPubOver: A.pubOver,
    animElvUnder: A.elvUnder, animElvOver: A.elvOver,
    animSkogOver: A.skogOver,
    animVulkanOver: A.vulkanOver,
    animKraterOver: A.kraterOver,
  });
})();
