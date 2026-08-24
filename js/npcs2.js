(() => {
  const H = window.NPC_HELPERS;

  Object.assign(window.NPC_DEFS, {

    grim: {
      id: 'grim', name: 'Grim Greybeard', height: 110, width: 80,
      draw: H.person('grim'),
      look: 'Grim Greybeard, fisher-gnome. He stares at his bobber like it owes him money.',
      use: () => Game.say('grim', 'Do not disturb a man mid-conflict with a catfish.'),
      take: 'He is small but tough as tar. And he has friends. Many, many fish friends.',
      talk() {
        Game.say('grim', 'Hm. Tourist. Fine. Fish don\'t bite on tourists anyway. Already tested.');
        const opts = [
          { text: 'Small catch today?', effect() {
            Game.sayLines([
              ['grim', 'TODAY? Yesterday I landed a catfish so big she had her own postal code.'],
              ['grim', 'Proof? Proof is for people who get believed.'],
            ]);
          }, keep: true },
          { text: 'Aren\'t you hungry, after all that fishing?', effect() {
            Game.sayLines([
              ['grim', 'Hungry? I am SO hungry I considered eating the bait. The bait is A HOOK.'],
              ['grim', 'What I need is real food. Salty. Meaty. Sausage-shaped, if you must know.'],
            ]);
          }, keep: true },
          { text: 'Who is that grey thing sneaking by the rock?', effect() {
            Game.sayLines([
              ['grim', 'Glum. Small grey fellow. Sneaks around singing about "the treasure". His treasure. Your treasure. Unclear ownership situation.'],
              ['grim', 'If he follows you: hit him with something long. Or give him a fish. No – hit him.'],
            ]);
          }, keep: true },
        ];
        if (Game.has('pølse') && !Game.has('åre')) {
          opts.push({ text: 'Trade a salted sausage for an oar?', effect() { Grim_trade(); } });
        }
        Game.openDialog(opts);
      },
      itemActions: {
        mynter() { Game.sayLines([['grim', 'Coins cannot be eaten. Well—ONCE. Not a good story.']]); },
        'pølse'() { Grim_trade(); },
      },
    },

    glumpeek: {
      id: 'glumpeek', name: 'Something grey behind the rock', height: 90, width: 70,
      draw: H.person('glum'),
      hidden: () => !Game.has('ring') || Game.flag('finaleStarted'),
      look: 'Two big, wet eyes peek over the rock. They seem to recognize you. That worries me most of all.',
      use: () => Game.say('glumpeek', '*hissing* Don\'t touch! Glum is gentle! Glum is FRIENDLY! Almost!'),
      take: () => Game.think('Take something from THAT? No. No thank you.'),
      talk() {
        Game.sayLines([
          ['glum', '*hissing* You have it, yes? WE know you have it. It SCREAMS. The whole river screams.'],
          ['toke', 'Have what? I have many things. I have a sausage. Do you want the sausage?'],
          ['glum', 'NOT THE SAUSAGE! *hissing* THE TREASURE. My treasure! I mean… nobody\'s treasure. Officially. *dives*'],
        ]);
        Game.setFlag('metGlum');
      },
    },

    bent: {
      id: 'bent', name: 'Bent the Bridge-Troll', height: 210, width: 130,
      draw: H.person('troll'),
      hidden: () => Game.flag('trollPassed'),
      look: () => Game.flag('trollPassed')
        ? 'Bent sits further off, composing poetry. It sounds suspiciously like he rhymes "lava" with "flavor".'
        : 'Bent, a bridge-troll of the old school. The bridge is his. The toll is his idea. The poems are unfortunately also his.',
      use: () => Game.say('bent', 'My bridge. My rules. My poems. Also my go-backwards.'),
      talk() {
        if (Game.flag('trollPassed')) {
          Game.say('bent', 'Pass, poet friend. And greet the lava for me. We have… history together.');
          return;
        }
        const seq = Bent_sequence();
        const idx = Game.flags.bentIdx || 0;
        if (idx >= seq.length) { Game.say('bent', 'You already paid. In VERSE. G onward.'); return; }
        if (idx === 0) {
          const count = seq.length === 1 ? 'ONE riddle (merciful mood today)' : 'Three riddles';
          Game.script([
            { say: ['bent', 'HALT! My bridge, my rules. Payment accepted in POETRY.'] },
            { say: ['toke', 'Poetry? Not coins? Not blood?'] },
            { say: ['bent', 'Blood tastes wrong against flagstones. ' + count + '. Answer them right – or at least rhyme-adjacent. BEGIN!'] },
            { fn: () => { Game.setFlag('bentIdx', 0); } },
            { fn: () => Bent_ask(0) },
          ]);
        } else {
          Bent_ask(idx);
        }
      },
    },

    goblin: {
      id: 'goblin', name: 'Goblin', height: 84, width: 64,
      draw: H.person('goblin', () => ({ sleeping: Game.flag('goblinsAsleep') })),
      look: () => Game.flag('goblinsAsleep')
        ? 'The goblin sleeps standing up. Impressive balance. Alarming lifestyle.'
        : 'A goblin with plans. None of them involve you in a friendly way.',
      use: () => Game.say('goblin', '*growl* Goblin has knife. Goblin has mood. Don\'t ruin the mood.'),
      take: () => Game.think('Adopt a goblin? Uncle Bongo always said: "Never bring home things that bring THEMSELVES back."'),
      talk() {
        if (Game.flag('goblinsAsleep')) {
          Game.say('goblin', 'Zzzz… five gold rings… two small… one BIG one… zzzz…');
          return;
        }
        Game.sayLines([
          ['goblin', '*sniff* Hobbit! Soft! Good with mustard! …No wait. We are on a DIET. Leader\'s orders.'],
          ['toke', '(They aren\'t listening to me. But they ARE listening FOR me. Which is almost worse.)'],
        ]);
      },
      itemActions: {
        'fløyte'() { Goblin_sleep(); },
      },
    },

    bjarne: {
      id: 'bjarne', name: 'Bjarne (guard)', height: 140, width: 96,
      draw: H.person('bjarne'),
      look: 'Bjarne the orc. He wears a hi-vis vest OVER his chainmail. Safety first, tradition later.',
      use: () => Game.say('bjarne', 'Do not touch the vest. It is certified by the workplace safety board of TWO ages.'),
      take: () => Game.think('Steal an orc\'s vest? I have seen how that movie ends.'),
      talk() {
        Game.say('bjarne', 'CLOSED. Maintenance. No entry. No, you can\'t just– no. Read the sign. The sign is CLEAR.');
        Bjarne_menu();
      },
      itemActions: {
        mynter() {
          Game.sayLines([['bjarne', 'I cannot accept BRIBES. Form FD-88, "Receiving Bribes", was lost in a fire. A suspicious fire.']]);
        },
        ring() {
          Game.sayLines([
            ['narrator', 'You hold out the Ring. Bjarne\'s eyes narrow.'],
            ['bjarne', 'No. NO. Do not hand me magical items during WORK HOURS. Magic requires form FD-77. Form FD-77 does NOT exist.'],
            ['bjarne', '…But if someone WORE such a thing in here, invisible-like… then technically I would see NOTHING. Understand?'],
          ]);
        },
      },
    },

    glumfinale: {
      id: 'glumfinale', name: 'Glum', height: 90, width: 70,
      draw: H.person('glum'),
      hidden: () => !Game.flag('craterGlum'),
      look: 'Glum. He oscillates between "menace" and "pleading". The distance between them is shorter than you think.',
      use: () => Game.say('glumfinale', '*hissing* Glum helps! Glum only wants treasure to bathe! A little! Only a bit!'),
      take: () => Game.think('No.'),
      talk() {
        Game.sayLines([
          ['glumfinale', 'Throw it! Don\'t throw it! THROW IT! Don\'t– GLUM! Calm yourself!'],
          ['glumfinale', 'Glum is TWO goblins in one body. It is difficult for EVERYONE.'],
        ]);
      },
    },
  });

  function Grim_trade() {
    Game.removeItem('pølse');
    Game.addItem('åre');
    AudioSys.fx('success');
    Game.script([
      { say: ['narrator', 'Grims eyes fill with tears of pure gastronomic joy. He hands you a sturdy oar from his own boat.'] },
      { say: ['grim', 'An oar. For a sausage. An HONEST trade. My wife says I am bad at negotiating. She is correct, but LET HER REST.'] },
      { say: ['grim', 'The rowboat in the boathouse needs about one oar. Maybe two. Maybe just one. It is a long river, but a MOTIVATED rower.'] },
      { say: ['grim', 'And listen: if that grey fellow follows you… don\'t do what I did and give him a fish. Now he sings ABOUT me. Weekly.'] },
    ]);
  }

  function Bent_sequence() {
    const rules = window.GAME.difficulty.rules;
    const n = rules.riddleRounds[Game.difficulty] === undefined ? 3 : rules.riddleRounds[Game.difficulty];
    return [1, 2, 3].slice(0, Math.max(1, Math.min(3, n)));
  }

  const BENT_HINTS = {
    1: 'It holds something you DRINK. Often too much.',
    2: 'You use it directly AFTER a bath. The wetter-it-gets joke writes itself.',
    3: 'Farmers harvest it in autumn. It has ears AND leaves.',
  };

  function Bent_ask(seqIdx) {
    const round = seqIdx;
    const R = [
      null,
      {
        q: ['"RIDDLE ONE", Bent bellows.', '"I have a neck, but no head. What am I?"'],
        hint: BENT_HINTS[1],
        opts: [
          { text: 'A bottle!', ok: true },
          { text: 'A troll!', wrong: ['bent', 'A TROLL?! Do I have a neck? …We do not speak of this. Try again.'] },
          { text: 'Me, before coffee.', wrong: ['bent', '…That was personal. And WRONG. Try again.'] },
        ],
      },
      {
        q: ['"RIDDLE TWO", bellows Bent, proud of his numbering system.', '"What gets wetter the more it dries?"'],
        hint: BENT_HINTS[2],
        opts: [
          { text: 'The rain!', wrong: ['bent', 'The rain does not DRY. The rain is the JOB. Wrong!'] },
          { text: 'A towel!', ok: true },
          { text: 'Troll feet.', wrong: ['bent', 'My feet are DRY as old bread. Pride! Also incorrect answer.'] },
        ],
      },
      {
        q: ['"FINAL RIDDLE!" Bent pounds the bridge for drama.', '"I have ears but never hear. I have leaves but never fall. What am I?"'],
        hint: BENT_HINTS[3],
        opts: [
          { text: 'Goblins!', wrong: ['bent', 'Goblins HAVE blades. Knife-blades. They fall. OFTEN. Wrong!'] },
          { text: 'A book!', wrong: ['bent', 'A book has LEAVES, yes! But ears? Ears sit on the READER. Half-right is ALL-WRONG here!'] },
          { text: 'A stalk of wheat!', ok: true },
        ],
      },
    ][round];
    if (!R) return;
    Game.sayLines(R.q.map(l => ['bent', l]));
    const opts = R.opts.map(o => ({
      text: o.text,
      keep: !o.ok,
      effect() {
        if (o.ok) { Bent_correct(round); }
        else {
          Game.say(o.wrong[0], o.wrong[1]);
          AudioSys.fx('error');
          const STANZAS = [
            '"O lava bright, my appetite, O brook of ember night—" THAT is what you interrupted!',
            '"And bridge-stone grey beneath the day, the goats all flee away—" You OWE me a verse now.',
            '"Sweet sulfur breeze that brings the wheeze—" hm. Needs work anyway.',
          ];
          Game.say('bent', STANZAS[Math.floor(Math.random() * STANZAS.length)]);
        }
      },
    }));
    const hintLevel = (window.GAME.difficulty.rules.hintLevel[Game.difficulty]) === undefined ? 1 : window.GAME.difficulty.rules.hintLevel[Game.difficulty];
    if (hintLevel >= 2 && R.hint) {
      opts.push({ text: 'Psst… ask Bent for a HINT.', keep: true, effect() {
        Game.sayLines([
          ['toke', 'Psst… a hint?'],
          ['bent', '…Fine. FINE! ' + R.hint],
        ]);
      } });
    }
    Game.openDialog(opts);
  }

  function Bent_correct(seqIdx) {
    const seq = Bent_sequence();
    const praise = [
      ['bent', '…CORRECT. A bottle. I AM a bottle enthusiast. Do not judge me.'],
      ['bent', 'CORRECT! A towel. Your wisdom is disturbingly dry – I mean thorough. NEXT!'],
    ];
    const nextIdx = seqIdx + 1;
    if (nextIdx < seq.length) {
      Game.script([
        { say: [praise[seqIdx - 1][0], praise[seqIdx - 1][1]] },
        { fn: () => { Game.setFlag('bentIdx', nextIdx); } },
        { fn: () => Bent_ask(nextIdx) },
      ]);
    } else {
      Game.script([
        { say: ['bent', 'CORRECT! WHEAT-STALK! ' + (seq.length === 1 ? 'A perfect single riddle!' : 'Three out of three!')] },
        { say: ['bent', 'Nobody has passed since the fellow with your kind of feet. Kept talking to a RING the whole way across. Strange times.'] },
        { fx: 'success' },
        { flag: ['trollPassed'] },
        { say: ['narrator', 'Bent stomps proudly off the bridge and settles down to finish his epic. Something about lava and flavor. The road east is open!'] },
      ]);
    }
  }

  function Goblin_sleep() {
    if (Game.flag('goblinsAsleep')) {
      Game.think('They are already asleep. Playing more would be bullying.');
      return;
    }
    Game.script([
      { say: ['toke', 'Shhh. One tiny musical number, dear goblins…'] },
      { fx: 'magic' },
      { wait: 0.4 },
      { say: ['narrator', 'The whistle chirps. The goblins sway like reeds in the wind. Then, one after another, they fall asleep STANDING UP. With dignity. Roughly.'] },
      { flag: ['goblinsAsleep'] },
      { say: ['goblin', 'Zzzz… soup… with mustard… zzz…'] },
      { say: ['narrator', 'The path past the camp is clear!'] },
    ]);
  }

  function Bjarne_menu() {
    const opts = [
      { text: 'Why is the gate closed?', keep: true, effect() {
        Game.sayLines([
          ['bjarne', 'MAINTENANCE. We are installing new flooring inside the caldera. Marble. Management called it "branding".'],
          ['bjarne', 'No entry until next age. OR until paperwork is in order. Paperwork is NEVER in order.'],
        ]);
      }},
      { text: 'Can you make an exception? Just a little lava.', keep: true, effect() {
        Game.sayLines([
          ['bjarne', '"A little lava." Do you know how many people have said THAT? Everyone. Everyone says that. Hence form FD-66.'],
          ['bjarne', 'No stamp: no throwing. Rules are RULES. I love rules. They are like hugs you can trust.'],
        ]);
      }},
      { text: 'Who was the last person who tried?', effect() {
        Game.sayLines([
          ['bjarne', 'Old fellow, feet like yours. Talked to a ring the whole time. Very chatty.'],
          ['bjarne', 'Then a HUGE bird came and fetched him. Eagle. Unwilling elevator. He actually waved. Nice old fellow.'],
        ]);
      }, keep: true },
    ];
    if (!Game.ringWorn && Game.has('ring')) {
      opts.push({ text: '(Think: what if someone wore something invisibility-ish in here?)', effect() {
        Game.sayLines([
          ['toke', '(The Ring could make me invisible. Bjarne\'s eyes could not see me. The gate… the gate has no eyes.)'],
          ['toke', '(But the Ring also attracts Things. Big, grey, possessive Things.)'],
        ]);
      }, keep: true });
    }
    Game.openDialog(opts);
  }
})();
