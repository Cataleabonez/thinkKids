// All game content lives here. Each activity has a type and a config object
// that the matching game component knows how to render.

export const AVATARS = [
  { id: 'bear',     emoji: '🐻', name: 'Boo'  },
  { id: 'fox',      emoji: '🦊', name: 'Finn' },
  { id: 'frog',     emoji: '🐸', name: 'Pip'  },
  { id: 'octopus',  emoji: '🐙', name: 'Olly' },
  { id: 'butterfly',emoji: '🦋', name: 'Bea'  },
  { id: 'robot',    emoji: '🤖', name: 'Zap'  },
];

export const BADGES = [
  { id: 'first_star',    emoji: '🌟', name: 'First Star',       desc: 'Earn your very first star',         trigger: 'stars',   value: 1  },
  { id: 'ten_stars',     emoji: '⭐', name: 'Star Collector',   desc: 'Earn 10 stars',                     trigger: 'stars',   value: 10 },
  { id: 'level2',        emoji: '🚀', name: 'Blast Off',        desc: 'Reach Level 2',                     trigger: 'level',   value: 2  },
  { id: 'level5',        emoji: '🗺️', name: 'Explorer',         desc: 'Reach Level 5',                     trigger: 'level',   value: 5  },
  { id: 'streak3',       emoji: '🔥', name: 'Hot Streak',       desc: 'Play 3 days in a row',              trigger: 'streak',  value: 3  },
  { id: 'streak7',       emoji: '🏆', name: 'Week Warrior',     desc: 'Play 7 days in a row',              trigger: 'streak',  value: 7  },
  { id: 'pattern_pro',   emoji: '🧩', name: 'Pattern Pro',      desc: 'Get 3 stars on 3 pattern activities', trigger: 'activity_type', value: 'pattern_match', count: 3 },
  { id: 'first_mission', emoji: '📖', name: 'Story Hero',       desc: 'Complete your first mission',       trigger: 'mission', value: 1  },
];

// Check which new badges a state update unlocks; returns array of badge ids
export function checkBadges(state, prevState) {
  const unlocked = [];
  for (const badge of BADGES) {
    if (state.earnedBadges.includes(badge.id)) continue;
    let earned = false;
    if (badge.trigger === 'stars'  && state.totalStars  >= badge.value) earned = true;
    if (badge.trigger === 'level'  && state.level       >= badge.value) earned = true;
    if (badge.trigger === 'streak' && state.streakDays  >= badge.value) earned = true;
    if (badge.trigger === 'activity_type') {
      const threeStarCount = Object.entries(state.activityStars)
        .filter(([id, s]) => s === 3 && id.startsWith(badge.value))
        .length;
      if (threeStarCount >= badge.count) earned = true;
    }
    if (earned) unlocked.push(badge.id);
  }
  return unlocked;
}

// ─── CURRICULUM ────────────────────────────────────────────────────────────

export const CURRICULUM = {
  '4-5': {
    label: 'Explorers World',
    zones: [
      {
        id: 'zone1_45',
        name: 'Puzzle Beach',
        emoji: '🏖️',
        color: '#3B82F6',
        missions: [
          {
            id: 'mission1_45',
            title: 'The Colour Cave',
            emoji: '🎨',
            activities: [
              {
                id: 'pattern_match_colour_1',
                title: 'What Comes Next?',
                type: 'pattern_match',
                config: {
                  instruction: 'Tap the shape that comes next!',
                  sequences: [
                    { pattern: ['🔴','🔵','🔴','🔵','🔴'], answer: '🔵', choices: ['🔵','🟢','🟡','🔴'] },
                    { pattern: ['🟡','🟡','🔵','🟡','🟡'], answer: '🔵', choices: ['🔵','🔴','🟡','🟢'] },
                    { pattern: ['🔴','🟢','🔴','🟢','🔴'], answer: '🟢', choices: ['🔴','🟢','🟡','🔵'] },
                    { pattern: ['🔵','🔵','🔴','🔵','🔵'], answer: '🔴', choices: ['🟡','🔵','🔴','🟢'] },
                  ]
                }
              },
              {
                id: 'pattern_match_shape_1',
                title: 'Shape Matcher',
                type: 'pattern_match',
                config: {
                  instruction: 'What shape comes next?',
                  sequences: [
                    { pattern: ['⭐','🔷','⭐','🔷','⭐'], answer: '🔷', choices: ['🔷','⭐','🔶','🟥'] },
                    { pattern: ['🔶','🔶','⭐','🔶','🔶'], answer: '⭐', choices: ['🔷','⭐','🟥','🔶'] },
                    { pattern: ['🟥','⭐','🟥','⭐','🟥'], answer: '⭐', choices: ['🟥','⭐','🔶','🔷'] },
                  ]
                }
              },
              {
                id: 'sequence_story_1',
                title: 'Story Order',
                type: 'sequence',
                config: {
                  instruction: 'Put the pictures in the right order!',
                  steps: [
                    { emoji: '🌱', label: 'Plant a seed' },
                    { emoji: '💧', label: 'Water it'     },
                    { emoji: '☀️', label: 'Sun shines'   },
                    { emoji: '🌸', label: 'Flower grows' },
                  ]
                }
              },
            ]
          },
          {
            id: 'mission2_45',
            title: 'Sorting Surprise',
            emoji: '🍎',
            activities: [
              {
                id: 'sort_fruit_1',
                title: 'Sort the Fruit',
                type: 'sort',
                config: {
                  instruction: 'Drag each item to the right basket!',
                  items: [
                    { emoji: '🍎', category: 'fruit'  },
                    { emoji: '🥕', category: 'veggie' },
                    { emoji: '🍌', category: 'fruit'  },
                    { emoji: '🥦', category: 'veggie' },
                    { emoji: '🍇', category: 'fruit'  },
                    { emoji: '🧅', category: 'veggie' },
                  ],
                  categories: [
                    { id: 'fruit',  emoji: '🧺', label: 'Fruit'    },
                    { id: 'veggie', emoji: '🪣', label: 'Veggies'  },
                  ]
                }
              },
              {
                id: 'pattern_match_colour_2',
                title: 'Rainbow Repeats',
                type: 'pattern_match',
                config: {
                  instruction: 'What colour comes next in the rainbow?',
                  sequences: [
                    { pattern: ['🔴','🟠','🔴','🟠','🔴'], answer: '🟠', choices: ['🔴','🟡','🟠','🔵'] },
                    { pattern: ['🟢','🔵','🟢','🔵','🟢'], answer: '🔵', choices: ['🟢','🔵','🟡','🔴'] },
                    { pattern: ['🟡','🟣','🟡','🟣','🟡'], answer: '🟣', choices: ['🟠','🔴','🟣','🟡'] },
                  ]
                }
              },
            ]
          }
        ]
      },
      {
        id: 'zone2_45',
        name: 'Pattern Forest',
        emoji: '🌲',
        color: '#10B981',
        locked: true,
        missions: [
          {
            id: 'mission3_45',
            title: 'The Magic Sequence',
            emoji: '✨',
            activities: [
              {
                id: 'pattern_match_abba_1',
                title: 'ABBA Patterns',
                type: 'pattern_match',
                config: {
                  instruction: 'Find the missing piece!',
                  sequences: [
                    { pattern: ['🐱','🐶','🐶','🐱','🐱'], answer: '🐶', choices: ['🐶','🐱','🐸','🐻'] },
                    { pattern: ['🌙','⭐','⭐','🌙','🌙'], answer: '⭐', choices: ['🌙','⭐','☀️','🌈'] },
                  ]
                }
              },
            ]
          }
        ]
      }
    ]
  },

  '6-8': {
    label: "Problem Solvers Island",
    zones: [
      {
        id: 'zone1_68',
        name: 'Logic Lagoon',
        emoji: '🏝️',
        color: '#8B5CF6',
        missions: [
          {
            id: 'mission1_68',
            title: 'Odd One Out',
            emoji: '🔍',
            activities: [
              {
                id: 'logic_odd_one_1',
                title: "Which Doesn't Belong?",
                type: 'odd_one_out',
                config: {
                  instruction: 'Tap the one that does NOT belong!',
                  puzzles: [
                    { items: ['🍎','🍌','🍇','🥕'],       answer: '🥕',   reason: 'The carrot is a vegetable, not a fruit.' },
                    { items: ['🚗','🚌','✈️','🚲'],         answer: '✈️',  reason: 'The plane flies — the others drive on roads.' },
                    { items: ['2','4','6','7'],             answer: '7',    reason: '7 is odd — the others are all even numbers.' },
                    { items: ['🐟','🐬','🦈','🐘'],         answer: '🐘',  reason: 'The elephant lives on land — the others live in water.' },
                    { items: ['🔴','🔵','🟢','🔲'],         answer: '🔲',  reason: 'The black square is a shape, not a colour circle.' },
                  ]
                }
              },
              {
                id: 'sequence_algo_1',
                title: 'Recipe Steps',
                type: 'sequence',
                config: {
                  instruction: 'Drag the steps into the correct order to make a sandwich!',
                  steps: [
                    { emoji: '🍞', label: 'Get two slices of bread' },
                    { emoji: '🧈', label: 'Spread butter on bread'  },
                    { emoji: '🥗', label: 'Add your filling'        },
                    { emoji: '🍞', label: 'Put the top slice on'    },
                    { emoji: '✂️', label: 'Cut it in half'          },
                  ]
                }
              },
            ]
          },
          {
            id: 'mission2_68',
            title: 'Debug Jungle',
            emoji: '🐛',
            activities: [
              {
                id: 'debug_sequence_1',
                title: 'Fix the Robot!',
                type: 'debug_sequence',
                config: {
                  instruction: 'One step is in the wrong place. Tap it to fix the robot\'s plan!',
                  puzzles: [
                    {
                      goal: 'The robot wants to make hot chocolate.',
                      steps: ['Boil water 🫖','Add cocoa powder ☕','Pour milk 🥛','Stir well 🥄','Enjoy! 😊'],
                      wrongIndex: 2,
                      wrongStep: 'Pour milk 🥛',
                      fixedSteps: ['Boil water 🫖','Pour milk 🥛','Add cocoa powder ☕','Stir well 🥄','Enjoy! 😊'],
                      explanation: 'Milk should go in before the cocoa powder!'
                    },
                    {
                      goal: 'The robot wants to brush its teeth.',
                      steps: ['Get toothbrush 🪥','Spit and rinse 💧','Add toothpaste 🧴','Brush teeth 😁','Rinse brush 🚿'],
                      wrongIndex: 1,
                      wrongStep: 'Spit and rinse 💧',
                      fixedSteps: ['Get toothbrush 🪥','Add toothpaste 🧴','Brush teeth 😁','Spit and rinse 💧','Rinse brush 🚿'],
                      explanation: 'You spit and rinse AFTER brushing, not before!'
                    },
                  ]
                }
              },
            ]
          }
        ]
      }
    ]
  },

  '9-10': {
    label: 'Code Builders Academy',
    zones: [
      {
        id: 'zone1_910',
        name: 'Block City',
        emoji: '🏙️',
        color: '#EF4444',
        missions: [
          {
            id: 'mission1_910',
            title: 'Move the Robot',
            emoji: '🤖',
            activities: [
              {
                id: 'coding_blocks_1',
                title: 'Build a Path',
                type: 'coding_blocks',
                config: {
                  instruction: 'Drag blocks to move the robot to the 🏁 flag!',
                  gridSize: 5,
                  startPos: { x: 0, y: 4 },
                  goalPos:  { x: 4, y: 0 },
                  availableBlocks: ['move_right','move_up','move_left','move_down'],
                  solution: ['move_right','move_right','move_right','move_right','move_up','move_up','move_up','move_up'],
                  maxBlocks: 10,
                }
              },
              {
                id: 'sequence_decompose_1',
                title: 'Break It Down',
                type: 'sequence',
                config: {
                  instruction: 'A programmer needs to send an email. Put the steps in order!',
                  steps: [
                    { emoji: '💻', label: 'Open the email app'    },
                    { emoji: '✏️', label: 'Click "New Email"'     },
                    { emoji: '📧', label: 'Type the address'      },
                    { emoji: '📝', label: 'Write your message'    },
                    { emoji: '📎', label: 'Attach a file'         },
                    { emoji: '📤', label: 'Press Send'            },
                  ]
                }
              },
            ]
          }
        ]
      }
    ]
  }
};
