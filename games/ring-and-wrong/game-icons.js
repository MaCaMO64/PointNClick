(() => {
const { rr, ell, circle } = ART;

window.GAME_ICONS = {
    stokk: (c) => {
      c.rotate(-0.6);
      c.strokeStyle = '#8a5a33'; c.lineWidth = 7; c.lineCap = 'round';
      c.beginPath(); c.moveTo(-18, 0); c.lineTo(18, 0); c.stroke();
      c.strokeStyle = '#6b4426'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(-8, -2); c.lineTo(-2, 2); c.stroke();
    },
    eple: (c) => {
      circle(c, 0, 2, 12, '#d9403a', '#8a2018', 2);
      circle(c, -4, -2, 3, 'rgba(255,255,255,0.5)');
      c.strokeStyle = '#5d4230'; c.lineWidth = 2.5;
      c.beginPath(); c.moveTo(0, -9); c.quadraticCurveTo(2, -15, 5, -17); c.stroke();
      ell(c, 8, -15, 6, 3, '#5aa04e');
    },
    ring: (c) => {
      circle(c, 0, 0, 11, null, '#f4c84a', 6);
      circle(c, 0, 0, 11, null, '#c9992e', 2);
      c.strokeStyle = 'rgba(255,255,240,0.95)'; c.lineWidth = 2;
      c.beginPath(); c.arc(0, 0, 11, -1.2, -0.5); c.stroke();
      c.strokeStyle = '#fff'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(13, -13); c.lineTo(17, -17); c.moveTo(15, -15); c.lineTo(15, -15); c.stroke();
    },
    mynter: (c) => {
      circle(c, -6, 4, 9, '#f4c84a', '#c9992e', 2);
      circle(c, 7, 5, 9, '#f4c84a', '#c9992e', 2);
      circle(c, 0, -4, 9, '#ffd76e', '#c9992e', 2);
      c.strokeStyle = '#fff2c8'; c.lineWidth = 2;
      c.beginPath(); c.arc(0, -4, 5, -1.4, -0.4); c.stroke();
    },
    'fløyte': (c) => {
      c.rotate(-0.35);
      rr(c, -18, -4, 34, 8, 4); c.fillStyle = '#b9c2cc'; c.fill(); c.strokeStyle = '#5d666e'; c.lineWidth = 1.6; c.stroke();
      rr(c, -22, -5, 8, 10, 2); c.fillStyle = '#8a939c'; c.fill();
      circle(c, -6, 0, 1.8, '#4a525a'); circle(c, 2, 0, 1.8, '#4a525a'); circle(c, 10, 0, 1.8, '#4a525a');
    },
    'pølse': (c) => {
      c.strokeStyle = '#c96a5a'; c.lineWidth = 9; c.lineCap = 'round';
      c.beginPath(); c.moveTo(-15, -2); c.quadraticCurveTo(0, 10, 15, -2); c.stroke();
      c.strokeStyle = '#a84e40'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(-15, -6); c.lineTo(-15, 2); c.moveTo(15, -6); c.lineTo(15, 2); c.stroke();
    },
    'øl': (c) => {
      rr(c, -10, -8, 18, 24, 3); c.fillStyle = '#e8a83a'; c.fill(); c.strokeStyle = '#8a5a20'; c.lineWidth = 2; c.stroke();
      c.strokeStyle = '#8a5a20'; c.lineWidth = 3;
      c.beginPath(); c.arc(11, 3, 5, -Math.PI / 2, Math.PI / 2); c.stroke();
      circle(c, -6, -10, 4.5, '#fdf6e8'); circle(c, 1, -12, 5.5, '#fdf6e8'); circle(c, 7, -9, 4, '#fdf6e8');
      c.strokeStyle = '#fff'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(-6, -3); c.lineTo(-6, 9); c.stroke();
    },
    skje: (c) => {
      c.rotate(0.5);
      c.strokeStyle = '#c9d2dc'; c.lineWidth = 4; c.lineCap = 'round';
      c.beginPath(); c.moveTo(0, 16); c.lineTo(0, -4); c.stroke();
      ell(c, 0, -11, 7, 9, '#dde5ee', '#8a939c', 1.6);
      c.strokeStyle = '#fff'; c.lineWidth = 1.6;
      c.beginPath(); c.arc(-2, -12, 4, 2.4, 4.2); c.stroke();
    },
    nøkkel: (c) => {
      c.rotate(-0.5);
      circle(c, -10, 0, 7, null, '#d4af37', 4);
      c.strokeStyle = '#d4af37'; c.lineWidth = 5; c.lineCap = 'round';
      c.beginPath(); c.moveTo(-3, 0); c.lineTo(15, 0); c.stroke();
      c.beginPath(); c.moveTo(10, 0); c.lineTo(10, 7); c.moveTo(15, 0); c.lineTo(15, 8); c.stroke();
    },
    'åre': (c) => {
      c.rotate(-0.7);
      c.strokeStyle = '#a8794a'; c.lineWidth = 5; c.lineCap = 'round';
      c.beginPath(); c.moveTo(-20, 0); c.lineTo(14, 0); c.stroke();
      ell(c, 19, 0, 8, 4.5, '#c9a06a', '#7a5a34', 1.6);
      c.strokeStyle = '#8a6238'; c.lineWidth = 2.4;
      c.beginPath(); c.arc(-20, 0, 4, 0, Math.PI * 2); c.stroke();
    },
    avis: (c) => {
      rr(c, -13, -16, 26, 32, 2); c.fillStyle = '#efe9d8'; c.fill(); c.strokeStyle = '#8a8574'; c.lineWidth = 1.6; c.stroke();
      c.fillStyle = '#4a4638'; c.fillRect(-10, -13, 20, 6);
      c.strokeStyle = '#9a958a'; c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(-10, -3); c.lineTo(10, -3); c.moveTo(-10, 1); c.lineTo(10, 1);
      c.moveTo(-10, 5); c.lineTo(4, 5); c.moveTo(-10, 9); c.lineTo(10, 9); c.moveTo(-10, 13); c.lineTo(2, 13);
      c.stroke();
    },
  };
})();