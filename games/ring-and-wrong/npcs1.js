(() => {
  const H = window.NPC_HELPERS;

  window.NPC_DEFS = {
    bongo: {
      id: 'bongo', name: 'Uncle Bongo', height: 130, width: 90,
      draw: H.person('bongo'),
      look: 'Uncle Bongo. He has reading glasses on his forehead and the Ring in his eyes – in that order.',
      take: 'You cannot pack uncles. They arrive voluntarily.',
      use: () => Game.say('bongo', 'Ew. We are RELATED.'),
      talk() {
        if (!Game.flag('questStarted')) {
          Game.sayLines([
            ['bongo', 'Tomble! Finally! The moving truck is late, the box marked "fragile" went in backwards, but NONE of that matters right now.'],
            ['toke', 'Uncle Bongo… why is all your furniture in the garden?'],
            ['bongo', 'Retirement! Selling the hole. "Includes parking space," said the ad. It\'s just the garden, but people fall for it every time.'],
          ]);
          Game.openDialog([
            { text: 'You seem worried. What is going on?', effect() {
              Game.sayLines([
                ['bongo', 'The Ring, Tomble. THE Great Ring. I inherited it from my uncle, who inherited it from HIS uncle.'],
                ['bongo', 'We are clearly terrible at throwing things away.'],
              ]);
              Game.openDialog(bongoTopics());
            }},
            { text: 'Are you even fit to travel? You keep hunting for your glasses.', effect() {
              Game.sayLines([
                ['bongo', 'My glasses? They must be in a box… or a pocket… or…'],
                ['narrator', 'Uncle Bongo characteristically reaches for his forehead. There sit the glasses. They have ALWAYS sat there.'],
                ['bongo', 'Found them. As always. Not a word of this to anyone.'],
              ]);
            }, keep: true },
            { text: 'Why are you moving out again?', effect() {
              Game.sayLines([['bongo', 'After sixty years, a hole needs someone who does NOT live in it. We call those "boundaries".']]);
            }},
          ]);
        } else {
          Game.openDialog(bongoTopics());
        }
      },
    },

    tommel: {
      id: 'tommel', name: 'Billy the Goat', height: 80, width: 80,
      draw: H.person('goat'),
      look: 'A goat. She is evaluating me as a food item that has feelings.',
      talk() {
        Game.sayLines([
          ['tommel', 'BAAAAH.'],
          ['toke', '(I speak fluent goat. That either meant "hello" or "I own this road now".)'],
        ]);
      },
      itemActions: {
        eple() {
          Game.removeItem('eple');
          Game.script([
            { say: ['toke', 'Here you go, Billy. One apple. Tree-fresh. Stick-assisted.'] },
            { say: ['tommel', 'BAAAAH!'] },
            { wait: 0.6 },
            { fx: 'burp' },
            { say: ['narrator', 'The goat chews with great ceremony. Then she blinks at you like a neighbor approving your application. She struts proudly along the fence.'] },
            { flag: ['goatGone'] },
          ]);
        },
      },
      use: () => Game.think('She looks at me like I owe her money. Goats remember everything.'),
    },

    perr: {
      id: 'perr', name: 'Black Rider', height: 190, width: 150,
      draw: H.rider,
      look() {
        if (Game.flag('perrPaid')) return 'He is reading the Mordor Times. The headline "EYE WANTED – APPLY WITHIN" seems to fascinate him.';
        return 'A black rider on a black horse. He is SNIFFING the air. I hope I smell thoroughly average.';
      },
      talk() {
        if (Game.flag('perrPaid')) {
          Game.say('perr', 'Shh. "…and the Eye of Darkness still seeks part-time staff. Experience in staring required."');
          return;
        }
        Game.sayLines([
          ['perr', 'Toll. One coin. Or a favor. Or just some company. This shift is LOOOONG.'],
          ['toke', '(He sounds less "terror from the dark" and more "underpaid clerk with poor work conditions".)'],
        ]);
        const opts = [
          { text: 'A toll? Out here?', effect() {
            Game.sayLines([
              ['perr', 'Mordor Roadworks. We operate a toll station now. Payment accepted in coins, information or entertainment.'],
              ['perr', 'Nobody has paid since Tuesday. LAST Tuesday.'],
            ]);
          }, keep: true },
          { text: 'What kind of favor are we talking?', effect() {
            Game.say('perr', 'Something to READ. I have been staring into this road for six weeks. Even the gravel avoids eye contact now.');
          }},
          { text: 'Aren\'t you afraid of… dark powers?', effect() {
            Game.sayLines([
              ['perr', 'I AM a dark power. You know what it\'s like working in the family business? Like that. But with more cloak regulations.'],
            ]);
          }},
        ];
        if (Game.has('avis') && !Game.flag('perrPaid')) {
          opts.push({ text: 'Give him the Mordor Times.', effect() { Perr_bribe(); } });
        }
        Game.openDialog(opts);
      },
      itemActions: {
        avis() { Perr_bribe(); },
        mynter() {
          Game.sayLines([
            ['perr', 'Coins? BRIBING an official of Mordor Roadworks? That is a slippery slope. There would be paperwork. Also NO.'],
            ['toke', '(The toll-taker has a toll-ethics code. Noted.)'],
          ]);
        },
      },
      use: 'He is busy smelling things. How rude.',
      take: () => { Game.think('Steal a Nazgul? I have heard rumors about how that ends.'); },
    },

    dora: {
      id: 'dora', name: 'Dora (innkeeper)', height: 120, width: 84,
      draw: H.person('dora'),
      look: 'Dora, innkeeper of The Wobbly Pony. She is drying a mug that was already dry. Twice.',
      use: () => Game.say('dora', 'The bar is served FROM behind it. Not ON it. Compose yourself.'),
      take: 'The innkeeper is not on the menu. People have asked.',
      talk() {
        Game.say('dora', 'Welcome to The Wobbly Pony! We serve soup, beds and scandal. What will it be?');
        Dora_menu();
      },
      itemActions: {
        skje() { Dora_giveSpoon(); },
        'øl'() { Game.think('She serves drinks herself. Where would the fun be in that?'); },
      },
    },

    halvor: {
      id: 'halvor', name: 'Halvor Halfpint', height: 118, width: 86,
      draw: H.person('halvor'),
      look: 'Halvor. His elbow rests on the table. The table does not rest back.',
      use: () => Game.say('halvor', 'Heyyy! Table is my best friend. I like YOU too. About the same amount.'),
      take: 'He is heavy. And he has friends. Well, ONE friend. The table.',
      talk() {
        if (Game.flag('spoonFloor')) {
          Game.say('halvor', 'Your spoon… it was pretty… gonna just… close my eyes a bit… *hic*');
          return;
        }
        Game.sayLines([
          ['halvor', 'I am NOT drunk. I am… horizontally optimistic. *hic*'],
          ['halvor', 'You look like someone who needs something. Everyone needs something. I need something to DRINK.'],
        ]);
        Halvor_menu();
      },
      itemActions: {
        skje() {
          Game.sayLines([['halvor', 'My spoon?! She LEFT me. We are DONE. …Is she happy, at least?']]);
        },
        'øl'() {
          Game.removeItem('øl');
          Game.script([
            { say: ['halvor', 'TO HEALTH AND HALF-MOONS! Cheers, little buddy!'] },
            { wait: 0.5 },
            { fx: 'burp' },
            { say: ['narrator', 'Halvor empties the mug in one continuous motion. It is impressive. It borders on art.'] },
            { say: ['halvor', '*HIIIC!* Oopsie…'] },
            { fx: 'coin' },
            { say: ['narrator', 'Something metallic drops off the table and rolls underneath. It GLINTS. It looks suspiciously spoon-shaped.'] },
            { flag: ['spoonFloor'] },
            { say: ['halvor', 'My spoon… she has gone home… farewell, spoon… *snore*'] },
          ]);
        },
      },
    },

    rando: {
      id: 'rando', name: 'Rando the Wanderer', height: 132, width: 92,
      draw: H.person('rando'),
      hidden: () => Game.flag('joinedRando'),
      look: 'A dark wanderer in the corner, trying very hard to look mysterious. It works slightly too well.',
      use: () => Game.say('rando', 'Do not touch me. I am in "mysterious mode". It takes a while to switch off.'),
      take: 'He weighs roughly as much as a library with shoulders.',
      talk() {
        Game.sayLines([
          ['rando', 'Psst. Over here. No – HERE. I\'m just your average mountain wanderer™. No special background. No secrets.'],
          ['toke', 'You are sitting in the shadows, staring dramatically at the door.'],
          ['rando', 'Exactly. Standard wanderer behavior.'],
        ]);
        const opts = [
          { text: 'Who ARE you exactly?', effect() {
            Game.sayLines([
              ['rando', 'Rando. Rando the Wanderer. I guarded the south road for three years. Before that: two years guarding another road.'],
              ['rando', 'I have seen things. Things you wouldn\'t believe. Among them: a man eating soup with a fork.'],
            ]);
          }, keep: true },
          { text: 'Is the road to Mount Pleasant dangerous?', effect() {
            Game.sayLines([
              ['rando', 'Dangerous? Nah. Just a Black Rider running a toll booth, a troll with poetic ambitions, and a volcano with a renovation plan.'],
              ['rando', '…Maybe a LITTLE dangerous.'],
            ]);
          }, keep: true },
          { text: 'Will you come with me?', effect() {
            Game.say('rando', 'On an adventure? Without a contract? Hmm. What are the stakes? What is the pay? What about–');
          }},
        ];
        if (Game.has('ring') && !Game.flag('joinedRando')) {
          opts.push(Rando_joinOption());
        }
        Game.openDialog(opts);
      },
      itemActions: {
        ring() { Game.think('No no no. You do not show the Ring to STRANGERS. …Or do you?'); },
      },
    },
  };

  function bongoTopics() {
    const opts = [];
    if (!Game.has('ring') && !Game.flag('gaveRing')) {
      opts.push({ text: 'Tell me about the Ring.', effect() { Bongo_giveRing(); } });
    }
    opts.push(
      { text: 'How do I get to Mount Pleasant?', effect() {
        Game.sayLines([
          ['bongo', 'East through the gate, past the crossroads, to Grumblingdale. Ask for Rando at the tavern – he knows the way.'],
          ['bongo', 'Then the river, then Trollwood, and finally the mountain. Bring snacks. Bring luck. Ideally bring Randos.'],
          ['bongo', 'And pack light, but pack LOUD: if you own anything musical, bring it. The forest folk have STRICT entertainment policies.'],
        ]);
      }, keep: true },
      { text: 'What if the Black Rider shows up?', effect() {
        Game.sayLines([
          ['bongo', 'Don\'t put the Ring on! They SMELL the Ring. Be boring. Be so boring that even darkness loses interest.'],
          ['bongo', 'That should be easy for you. Sorry. That was meant to be encouraging.'],
        ]);
      }, keep: true },
      { text: 'About those glasses you were looking for.', effect() {
        Game.sayLines([
          ['bongo', 'They are in one of the boxes… or my pocket… or…'],
          ['narrator', 'His hand drifts up to his forehead. The glasses are there. They have always been there.'],
          ['bongo', 'Found them. As always. This joke never gets old. For me.'],
        ]);
      }, keep: true },
      { text: 'Goodbye, Uncle Bongo.', effect() {
        Game.sayLines([
          ['bongo', 'Good LUCK? No. Luck is for amateurs. YOU have heritage, stubbornness and enormous feet. It will carry you.'],
          ['bongo', '…And bring the goat an apple. She bribes easily.'],
        ]);
        Game.closeDialog();
      }},
    );
    return opts;
  }

  function Bongo_giveRing() {
    Game.script([
      { say: ['bongo', 'Behold. The gold ring. Found in a cake forty years ago. The cake was terrible, but the ring… the ring has personality.'] },
      { say: ['toke', 'It is whispering something about "treasure", uncle. Rings should not say treasure.'] },
      { say: ['bongo', 'All old heirlooms mumble. Grandfather\'s clock said "Tuesday" for twenty years.'] },
      { say: ['bongo', 'It must go to Mount Pleasant. Into the lava. Before the Dark Lord\'s Vice-Chancellor of Evil collects it – he has "pickup" penciled into his calendar.'] },
      { fn: () => { Game.addItem('ring'); Game.addItem('mynter'); Game.setFlag('questStarted'); Game.setFlag('gaveRing'); } },
      { fx: 'magic' },
      { say: ['narrator', 'The Ring is yours. It is lighter than it should be and heavier than it pretends. The coins come too – Uncle Bongo insists that "adventures cost money".'] },
      { say: ['bongo', 'And Tomble… no spontaneous decisions. Think FIRST. Or at the very least AFTERWARD.'] },
    ]);
  }

  function Perr_bribe() {
    Game.removeItem('avis');
    Game.script([
      { say: ['toke', 'I happen to have… the Mordor Times. Full week\'s edition. Crossword included.'] },
      { say: ['perr', 'CROSSWORD?'] },
      { say: ['narrator', 'Something beneath the hood resembles a smile. The rider grabs the paper with gauntlet-clad longing.'] },
      { flag: ['perrPaid'] },
      { fx: 'success' },
      { say: ['perr', 'The road is open. Deliver the crossword UNSOLVED or we shall have problems.'] },
      { say: ['narrator', 'The Black Rider turns his horse toward the sunset and begins to read. The road east is free.'] },
    ]);
  }

  function Rando_joinOption() {
    return { text: 'PS: I have a magic ring in my pocket.', effect() {
      Game.script([
        { say: ['narrator', 'The chair screeches against the floor. Faster than any "casual hiker" should move, Rando stands up.'] },
        { say: ['rando', 'A MAGIC RING? Do you have ANY idea what kind of responsibility that is? Enough food? Spare socks? A PLAN?'] },
        { say: ['toke', 'I have… a pocket.'] },
        { say: ['rando', 'THAT IS NOT A PLAN, THAT IS A POCKET. I am coming with you. Non-negotiable. Someone has to watch over you – and your lunch.'] },
        { flag: ['joinedRando'] },
        { fx: 'fanfare' },
        { say: ['narrator', 'Rando has joined the party! He follows you everywhere now, with commentary.'] },
      ]);
    }};
  }

  function Dora_giveSpoon() {
    Game.removeItem('skje');
    AudioSys.fx('success');
    Game.sayLines([
      ['dora', 'MY LUCKY SPOON! Halvor won it off me arm-wrestling. Then he LOST it under his table.'],
      ['narrator', 'Dora hugs the spoon like a golden child, and hands you a key from under the bar.'],
      ['dora', 'The boathouse key, as promised. The rowboat is inside – though last I heard, it is missing its oars.'],
      ['dora', 'Ask Grim by the river. He fishes up everything. Literally. Once he found an entire municipality.'],
    ]);
    Game.addItem('nøkkel');
    Game.setFlag('spoonReturned');
  }

  function Dora_menu() {
    const opts = [
      { text: 'What\'s new around the neighborhood?', keep: true, effect() {
        Game.say('dora', doraHint());
      }},
      { text: 'I need to get further east.', keep: true, effect() {
        Game.sayLines([
          ['dora', 'The river is past the crossroads. The boathouse there holds a rowboat – minus its oars, these days.'],
          ['dora', 'Grim by the river fixes anything for food. The question is which food he wants today.'],
        ]);
      }},
    ];
    if (!Game.flag('spoonReturned') && !Game.has('skje')) {
      opts.push({ text: 'Did I hear right – you are missing a spoon?', effect() {
        Game.sayLines([
          ['dora', 'My lucky spoon! Halvor won it arm-wrestling, then DROPPED it under his table. He refuses to bend down.'],
          ['dora', 'Get it back and I give you the boathouse key. Plus a warm feeling in your chest. That part is free.'],
        ]);
      }, keep: true });
    }
    if (Game.has('skje') && !Game.flag('spoonReturned')) {
      opts.push({ text: 'About a certain LUCKY SPOON…', effect() { Dora_giveSpoon(); } });
    }
    if (!Game.has('øl')) {
      if (Game.has('mynter')) {
        opts.push({ text: 'One ale for the thirsty gentleman over there.', effect() {
          Game.removeItem('mynter');
          Game.addItem('øl');
          AudioSys.fx('coin');
          Game.sayLines([
            ['narrator', 'Dora trades the coins for a huge foaming mug. Halvor\'s eyebrows twitch in his sleep.'],
            ['dora', 'Tell him he owes me ONE rematch.'],
          ]);
        }, keep: true });
      } else {
        opts.push({ text: 'An ale… on credit?', effect() {
          Game.sayLines([['dora', 'Credit? HERE? The last guy who tried washed dishes until the next blue moon. He goes by "Soap-Halvar" now.']]);
        }});
      }
    }
    Game.openDialog(opts);
  }

  function doraHint() {
    const rules = window.GAME.difficulty.rules;
    const lvl = rules.hintLevel[Game.difficulty] === undefined ? 1 : rules.hintLevel[Game.difficulty];
    let s;
    if (!Game.flag('perrPaid') && !Game.flag('visitedPub')) s = 'A Black Rider set up a toll booth at the crossroads. He wants payment in "entertainment". I recommend newspapers.';
    else if (!Game.flag('spoonReturned') && !Game.has('skje') && !Game.flag('spoonFloor')) s = 'Halvor over there is sitting on my lucky spoon – figuratively, in elbow-wrestle territory. A cold drink loosens many things.';
    else if (Game.flag('spoonFloor') && !Game.has('skje')) s = 'Something shiny rolled under HALVOR\'S table. Look under it. Bend down. You can do it. Probably.';
    else if (!Game.flag('joinedRando')) s = 'Rando in the corner is a "casual hiker". He has been watching the Ring since you walked in. Very casual behavior.';
    else if (!Game.flag('trollPassed')) s = 'The bridge-troll in Trollwood takes payment in POETRY. Rhyme badly and you rhyme LONG.';
    else s = 'Soup? Anyone want soup? …No? As always.';
    if (lvl >= 2 && !s.startsWith('Soup?')) return 'GOAL: ' + s;
    if (lvl <= 0 && !s.startsWith('Soup?')) return 'You seem to have everything under control. Probably. Talk to everyone. Touch everything. Trust no lock.';
    return s;
  }

  function Halvor_menu() {
    const opts = [
      { text: 'Got anything to drink here?', effect() {
        Game.say('halvor', 'The bar HAS drink. I have COIN-problems. That is the definition of tragedy.');
      }, keep: true },
      { text: 'How is your spoon doing?', effect() {
        Game.sayLines([
          ['halvor', 'My spoon is the FINEST. Won her off Dora arm-wrestling. She cried. Great day.'],
          ['halvor', 'Spoon lives on this table now. We have a relationship.'],
        ]);
      }, keep: true },
      { text: 'Do you know the way to Mount Pleasant?', effect() {
        Game.sayLines([
          ['halvor', 'Everything I know about mountains is that they are UP. *hic* Solid answer, yes? I think so too.'],
        ]);
      }},
    ];
    Game.openDialog(opts);
  }
})();
