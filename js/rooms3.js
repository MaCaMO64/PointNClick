(() => {
  window.ROOMS.vulkan = {
    id: 'vulkan', name: 'Foot of Mount Pleasant', mood: 'volcano',
    paint: ART.vulkan,
    walk: { minY: 485, maxY: 560 },
    animateOver(c, t) { ART.animVulkanOver(c, t, Game); },
    npcs: [ { ref: 'bjarne', x: 760, y: 505 } ],
    hotspots: [
      { id: 'vestvei', label: 'the path back', x: 0, y: 500, w: 70, h: 110,
        standX: 80, standY: 528,
        verbs: {
          look: 'The path back toward Trollwood and the bridge. Bent is probably still composing.',
          use() { Game.goto('skog', 1190, 505); },
        } },
      { id: 'fjellet', label: 'Mount Pleasant', x: 80, y: 170, w: 480, h: 300,
        standX: 330, standY: 540,
        verbs: {
          look: 'Mount Pleasant. The name was chosen by a tourism board. The volcano was NOT consulted. It smokes, offended.',
          use: 'You cannot climb an entire volcano on attitude alone.',
        } },
      { id: 'advarsel', label: 'the warning sign', x: 146, y: 408, w: 76, h: 126,
        standX: 186, standY: 540,
        verbs: {
          look: '"FIRE HAZARD" with a skull. Thanks. Very helpful. I would NEVER have guessed that a volcano was hot.',
          use: 'The sign wobbles, threatened. Even the signs are tired out here.',
        } },
      { id: 'drageskilt', label: 'the dragon sign', x: 366, y: 408, w: 116, h: 118,
        standX: 424, standY: 540,
        verbs: {
          look: '"NO PARKING FOR DRAGONS." Something has parked here anyway. The tracks are large and hurtful to the grass.',
          use: 'No dragons in sight. The rules hold. For now.',
        } },
      { id: 'sprekk', label: 'the lava crack', x: 96, y: 514, w: 120, h: 40,
        standX: 156, standY: 552,
        verbs: {
          look: 'A crack with glowing contents. It smells like Uncle Bongo\'s kitchen when he "experiments".',
          use: 'No. We dip NOTHING into lava until we have thought VERY carefully. ESPECIALLY not fingers.',
        } },
      { id: 'tauko', label: 'the queue barrier', x: 584, y: 494, w: 88, h: 74,
        standX: 628, standY: 552,
        verbs: {
          look: 'A queue barrier. The queue is empty. People rarely line up for an active volcano. Mystery solved.',
          use: 'You step into the queue. You are number one! And number everything. Congratulations.',
        } },
      { id: 'vaktbord', label: 'the guard desk', x: 648, y: 430, w: 150, h: 86,
        standX: 722, standY: 552,
        verbs: {
          look: 'The guard desk. Form FD-66: "Application to Throw Things Into Lava", in triplicate, stamped by someone who no longer exists.',
          use: 'The papers are stacked according to a system only Bjarne (and possibly the lava) understands.',
        } },
      { id: 'port', label: 'the iron gate', x: 848, y: 306, w: 184, h: 184,
        standX: 940, standY: 545,
        verbs: {
          look() {
            if (!Game.flag('finaleStarted')) return 'An enormous iron gate set straight into the rock. Behind it: the caldera. Above it: "CLOSED FOR MAINTENANCE". Below it: your destiny, roughly.';
            return 'The iron gate stands wide open. Maintenance postponed due to Glum.';
          },
          talk() { window.NPC_DEFS.bjarne.talk(); },
          use() {
            if (!Game.flag('finaleStarted')) {
              Game.sayLines([
                ['narrator', 'The gate does not move. It is locked, closed, stamped and filed. Bjarne\'s world has OPINIONS about this door.'],
              ]);
            } else Game.goto('krater', 140, 520);
          },
        } },
      { id: 'vskilt', label: 'the CLOSED sign', x: 866, y: 324, w: 148, h: 62,
        standX: 940, standY: 545,
        verbs: {
          look: '"CLOSED FOR MAINTENANCE – reopens next age." Below, in smaller print: "(sorry for the inconvenience)"',
          use: 'The sign swings a little. It has no power left here. Not over you, at least.',
        } },
    ],
    onRingToggle(on) {
      if (on && !Game.flag('finaleStarted')) {
        Game.setFlag('finaleStarted');
        Game.script([
          { say: ['narrator', 'The world turns grey. The ash falls quietly. Bjarne\'s gaze slides right through you – twice, three times.'] },
          { say: ['bjarne', 'HELLO? WHERE DID YOU GO?! You cannot JUST disappear! There are RULES about this! Paragraph– where is my paragraph?'] },
          { fx: 'whoosh' },
          { say: ['narrator', 'Something small and grey comes skimming over the lava ridges at a speed no grey thing should manage.'] },
          { say: ['glum', 'THE TREASURE! Glum sees it! Glum SMELLS it! Here! HERE!'] },
          { say: ['bjarne', 'WHAT THE– two invisible ones?! NO. No. I just took a job at a BAKERY. VACATION! I AM TAKING VACATION!'] },
          { say: ['narrator', 'Bjarne throws his guard cap onto the desk and vanishes into the dust. The iron gate stands open behind him – wide open.'] },
          { fx: 'door' },
          { say: ['glum', 'In! IN! Glum knows the way! Glum ALWAYS knows the way! *hissing*'] },
          { goto: { room: 'krater', x: 140, y: 520 } },
        ]);
      }
    },
  };

  window.ROOMS.krater = {
    id: 'krater', name: 'The Caldera', mood: 'volcano',
    paint: ART.krater,
    walk: { minY: 470, maxY: 545 },
    animateOver(c, t) { ART.animKraterOver(c, t, Game); },
    npcs: [ { ref: 'glumfinale', x: 900, y: 505 } ],
    hotspots: [
      { id: 'lava', label: 'the lava', x: 620, y: 472, w: 340, h: 80,
        standX: 700, standY: 500,
        verbs: {
          look: 'Below: lava. Lots of lava. a CONCERNING amount of lava. It bubbles like soup at Dora\'s, just more ambitious.',
          use: 'No. We do not throw things in RANDOMLY. We throw things in WITH A PLAN. Or not at all.',
        } },
      { id: 'bskilt', label: 'the broken sign', x: 1076, y: 396, w: 96, h: 64,
        standX: 1120, standY: 500,
        verbs: {
          look: '"DO NOT THROW THINGS HERE!" – the sign itself lies half inside the crater. The house of irony has found its headquarters.',
          use: 'The sign gave up on its own rule. Respect for following through.',
        } },
      { id: 'ravine', label: 'the crater rim', x: 980, y: 430, w: 260, h: 130,
        standX: 1060, standY: 505,
        verbs: {
          look() {
            if (!Game.flag('craterReady')) return 'The edge of the caldera itself. The heat pushes against your face. The Ring in your pocket feels… restless.';
            return 'The rim. The lava. The moment. Everything waits on one small hand movement from one big-footed halfling.';
          },
          talk() { Ravine_attempt(); },
          use() { Ravine_attempt(); },
        },
        itemActions: {
          ring() { Ravine_attempt(); },
        } },
    ],
    onEnter() {
      if (Game.flag('craterSeen')) return;
      Game.setFlag('craterSeen');
      Game.script([
        { say: ['narrator', 'The caldera. The heat hits you like a wall. Below, the lava glows a color no paint box dares promise.'] },
        { flag: ['craterGlum'] },
        { say: ['glum', 'There! The RIM! Glum knows the rim! Glum and the rim are OLD friends!'] },
        { say: ['narrator', 'Glum creeps genuinely closer to the Ring than anyone has been since you put it in your pocket.'] },
        { wait: 0.3 },
        { say: ['bjarne', '*from far away* AND TAKE THE FORMS WITH YOU!'] },
        { flag: ['craterReady'] },
        { say: ['toke', '(The crater rim lies up ahead in the east. The Ring already knows the way.)'] },
      ]);
    },
  };

  function Ravine_attempt() {
    if (!Game.ringWorn || !Game.has('ring')) {
      Game.sayLines([
        ['toke', 'The Ring needs to be close to the fire for this. It almost wants it itself…'],
        ['narrator', '(Put on the Ring from your bag if you want to finish the journey.)'],
      ]);
      return;
    }
    if (!Game.flag('craterReady')) {
      Game.think('Not yet. Glum stares. It disturbs my concentration.');
      return;
    }
    Game.openDialog([
      { text: 'Throw the Ring into the lava.', effect() { GoodEnding(); }, keep: false },
      { text: 'Keep it. Just ONE little while longer.', effect() { BadEnding(); }, keep: false },
    ]);
  }

  function GoodEnding() {
    Game.script([
      { move: { who: 'player', x: 1080, y: 498 } },
      { say: ['toke', 'It was nice while it lasted, Ring. But every relationship needs boundaries.'] },
      { say: ['ring', 'NOOOO! I had SO much left to give! Discounts! Membership perks! A COMPLETE MAKEOVER OF YOU!'] },
      { fx: 'magic' },
      { wait: 0.4 },
      { fx: 'splash' },
      { say: ['narrator', 'The Ring falls. It screams. It negotiates. Then it meets the lava – and the lava is not interested in negotiating.'] },
      { fx: 'fanfare' },
      { say: ['narrator', 'A small confetti-bang of golden sparks marks the end of a very long ownership arrangement.'] },
      { wait: 0.4 },
      { fn: () => {
        if (Game.flag('joinedRando')) Game.say('rando', 'Finally! I finished my sandwich. What did I miss? …Everything? I missed EVERYTHING?');
      } },
      { say: ['narrator', 'Above you, something enormous casts a shadow. An eagle. On its back sits an old hobbit with glasses on his forehead, waving wildly.'] },
      { say: ['bongo', 'I TOLD you I would come get you! My marker was in the mail! TOMBLE! YOU ARE SO SLOW!'] },
      { say: ['toke', 'Uncle BONGO?!'] },
      { say: ['bongo', 'Pensioners get WEDNESDAYS off! Come, the flight departs! There is cocoa at home!'] },
      { say: ['narrator', 'And so it ended – with lava, confetti, an eagle with capacity issues, and cocoa. So much cocoa.'] },
      { fn: () => Game.showEnding('good') },
    ]);
  }

  function BadEnding() {
    Game.script([
      { say: ['ring', '(Good choice. A wise investment. A LONG-TERM outlook.)'] },
      { say: ['toke', 'Just for a bit. Just until I find out what it DOES. Just–'] },
      { say: ['narrator', 'Three weeks later: Tomble Bagshot, middle manager at Mordor Inc., responsible for meeting minutes and evil looks.'] },
      { say: ['ring', '(The minutes. Write the minutes. The minutes matter. WE matter. YOU matter. ONLY US.)'] },
      { fx: 'sad' },
      { say: ['narrator', 'The pay was bad. The coffee was worse. Uncle Bongo sent a card: "Regards, grandma. PS: MY RING?"'] },
      { fn: () => Game.showEnding('bad') },
    ]);
  }
})();
