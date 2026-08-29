window.GAME = {
  meta: {
    title: 'RING & WRONG',
    version: 'v0.11.0',
    storageKey: 'ringandwrong',
    subtitle: 'A thoroughly unnecessary hero\'s tale',
    tagline: 'A point-and-click adventure in the spirit of LucasArts',
    about: [
      'A point-and-click adventure in a spirit of loving parody.',
      '',
      'No hobbits were harmed during production.',
      '(Several pumpkins, however, were grossly mistreated.)',
      '',
      'Right-click: look at things. Left-click: do things.',
      'You CANNOT die. That is the entire point.',
      'Uncle Bongo wishes you a pleasant evening.',
      '',
      'Click anywhere to go back.',
    ],
  },

  ui: {
    hintRightClick: 'right-click = look / cancel',
    hintEsc: 'ESC = menu',
    leave: '( leave )',
  },

  speakers: {
    colors: {
      toke:    '#ffd94a',
      bongo:   '#7fd4ff',
      rando:   '#9be37b',
      dora:    '#ff9e64',
      halvor:  '#ff7f7f',
      grim:    '#c9a7ff',
      perr:    '#ff5555',
      bent:    '#b8b8ff',
      goblin:  '#8ee06a',
      bjarne:  '#ffb14a',
      glum:    '#aef3d2',
      glumpeek:'#aef3d2',
      glumfinale:'#aef3d2',
      goblin:  '#8ee06a',
      tommel:  '#ffffff',
      narrator:'#e8e8e8',
      ring:    '#ffd700',
    },
    names: {
      toke: 'TOMBLE',
      bongo: 'UNCLE BONGO',
      rando: 'RANDO',
      dora: 'DORA',
      halvor: 'HALVOR',
      grim: 'GRIM',
      perr: 'BLACK RIDER',
      bent: 'BENT',
      goblin: 'GOBLIN',
      bjarne: 'BJARNE',
      glum: 'GLUM',
      glumpeek: 'GLUM',
      glumfinale: 'GLUM',
      tommel: 'BILLY',
      ring: 'THE RING',
      narrator: '',
    },
  },

  intro: [
    ['In an age before ages got late,',
     'the Great Rings were forged in the factories of Middle-earth.',
     'Three for the elves. Seven for the dwarves. Nine for men â€“',
     'and one to rule them all â€¦ plus the service agreement.'],
    ['But one day, the Great Ring went missing.',
     'It turned up in the pocket of UNCLE BONGO,',
     'a retired adventurer who refused to believe it was more than loose change.',
     '"Probably from a vending machine," he said. He said it often. Nervously.'],
    ['Now the Dark Lord\'s Vice-Chancellor has booked a pickup.',
     'The only one who can save the neighborhood is a small halfling',
     'with big feet and a poor sense of planning:',
     'TOMBLE BAGSHOT. That is you. Sorry.'],
  ],

  endings: {
    good: {
      music: 'ending',
      title: 'THE END â€” the good kind!',
      lines: [
        'The Ring screamed "NOOO! I had SO much left to give!"',
        'and melted away with a tiny confetti-bang.',
        'The Dark Lord lost his job and opened a bakery instead.',
        'Uncle Bongo flew past on an eagle: "I TOLD you I would come!"',
        'Rando\'s first comment: "So the food at your uncle\'s WAS free, right?"',
      ],
    },
    bad: {
      music: 'volcano',
      title: 'THE END â€¦ or is it?',
      lines: [
        'Tomble kept the Ring. The Ring kept Tomble.',
        'Three weeks later he was middle manager at Mordor Inc.,',
        'in charge of meeting minutes and evil looks.',
        'The pay was poor. The coffee was worse.',
        'Uncle Bongo sent a card: "Regards, grandma. PS: My ring?"',
      ],
    },
  },

  difficulty: {
    levels: ['easy', 'normal', 'hard'],
    labels: { easy: 'EASY', normal: 'NORMAL', hard: 'HARD' },
    rules: {
      riddleRounds: { easy: 1, normal: 3, hard: 3 },
      hintLevel: { easy: 2, normal: 1, hard: 0 },
    },
  },
};
  GAME.paint = {
    title: (c, W, H, t) => ART.title(c, W, H, t),
    introBg: (c, W, H, t) => ART.introBg(c, W, H, t),
    ending: (c, W, H, t, type) => ART.endingBg(c, W, H, t, type),
    person: (c, o) => ART.person(c, o),
    canary: () => ART._canary(),
  };

  GAME.start = {
    room: 'dal', x: 620, y: 545,
    script: [
      { say: ['narrator', 'Bloomdale. Nine in the morning. The birds are singing, the grass is green, and someone has packed an entire house into boxes.'] },
      { say: ['toke', 'Uncle Bongo? Why is all your furniture standing out in the garden?'] },
    ],
  };

  GAME.assets = { artPath: 'js/games/ring-and-wrong/art/' };
  GAME.audio = {
    tracks: { title: 'title', shire: 'dal', road: 'kryss', pub: 'pub', river: 'elv', forest: 'skog', volcano: 'vulkan', ending: 'ending' },
    moods: {
      title:  { bpm: 96,  root: 130.81, pad: 'warm', pattern: 'rand', density: 0.32, amb: [],
        prog: [[0, 4, 7], [-3, 0, 4], [-7, -3, 0], [-5, -1, 2]], scale: [0, 2, 4, 7, 9] },
      shire:  { bpm: 82,  root: 130.81, pad: 'warm', pattern: 'rand', density: 0.28, amb: ['birds'],
        prog: [[0, 4, 7], [-7, -3, 0], [-3, 0, 4], [-5, -1, 2]], scale: [0, 2, 4, 7, 9] },
      road:   { bpm: 100, root: 220.00, pad: 'warm', pattern: 'rand', density: 0.25, amb: ['wind'],
        prog: [[0, 3, 7], [3, 7, 10], [-2, 2, 5], [-5, -1, 2]], scale: [0, 3, 5, 7, 10] },
      pub:    { bpm: 116, root: 174.61, pad: 'warm', pattern: 'rand', density: 0.40, amb: ['fire', 'murmur'],
        prog: [[0, 4, 7], [-5, -1, 2], [-3, 0, 4], [-7, -3, 0]], scale: [0, 2, 4, 7, 9] },
      river:  { bpm: 96,  root: 146.83, pad: 'warm', pattern: 'arp', density: 0.55, amb: ['river'],
        prog: [[0, 4, 7], [-5, -1, 2], [-3, 0, 4], [-7, -3, 0]], scale: [0, 2, 4, 7, 9] },
      forest: { bpm: 66,  root: 164.81, pad: 'dark', pattern: 'rand', density: 0.16, amb: ['wind'],
        prog: [[0, 3, 7], [-4, 0, 3], [-7, -3, 0], [-5, -1, 2]], scale: [0, 3, 5, 7, 10] },
      volcano:{ bpm: 60,  root: 98.00,  pad: 'dark', pattern: 'rand', density: 0.12, amb: ['rumble'],
        prog: [[0, 3, 7], [1, 4, 8], [0, 3, 7], [-5, -1, 2]], scale: [0, 3, 5, 7, 10] },
      krater: { bpm: 63,  root: 98.00,  pad: 'dark', pattern: 'rand', density: 0.18, amb: ['rumble'],
        prog: [[0, 3, 7], [1, 4, 8], [-5, -1, 2], [0, 3, 7]], scale: [0, 3, 5, 7, 10] },
      ending: { bpm: 88,  root: 130.81, pad: 'warm', pattern: 'rand', density: 0.30, amb: ['birds'],
        prog: [[0, 4, 7], [-3, 0, 4], [-7, -3, 0], [-5, -1, 2]], scale: [0, 2, 4, 7, 9] },
    },
  };

  GAME.defaultMood = 'shire';
  GAME.followers = [
    { style: 'rando', flag: 'joinedRando', offsetX: -60, excludeRooms: ['dal', 'krater'] },
  ];
  GAME.wearable = {
    itemId: 'ring',
    whispers: ['the treasure...', 'give it to us...', 'they will take it from you...', 'keep it safe...', 'just a little while...', 'mine... mine...'],
    overlay: { veil: 'rgba(120,130,160,0.30)', vignette: 'rgba(180,20,10,' },
    fxOn: 'ringOn', fxOff: 'pickup',
    toastOn: 'You put on the Ring. The world turns... greyer.',
    toastOff: 'You take off the Ring.',
  };
