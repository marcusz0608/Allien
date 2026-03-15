import type { MathLevelConfig } from '../types'

export const G3_5_LEVELS: MathLevelConfig[] = [
  {
    gradeId: '3–5',
    levelNumber: 1,
    title: 'Times Table City',
    description: 'Practice multiplication facts with ×2, ×5, and ×10.',
    questions: [
      {
        id: 'g3-5-l1-q1',
        type: 'single',
        prompt: 'There are 4 boxes with 2 pencils in each box. How many pencils are there in total?',
        options: ['4', '6', '8', '10'],
        answerIndex: 2,
      },
      {
        id: 'g3-5-l1-q2',
        type: 'single',
        prompt: 'A spider has 8 legs. How many legs do 5 spiders have?',
        options: ['30', '35', '40', '45'],
        answerIndex: 2,
      },
      {
        id: 'g3-5-l1-q3',
        type: 'single',
        prompt: 'Each star badge is worth 5 points. If you have 6 star badges, how many points is that?',
        options: ['25', '30', '35', '40'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-q4',
        type: 'single',
        prompt: 'There are 3 bags. Each bag has 10 marbles. How many marbles are there in all?',
        options: ['13', '20', '30', '33'],
        answerIndex: 2,
      },
      {
        id: 'g3-5-l1-q5',
        type: 'single',
        prompt: 'You jump 5 steps each time. After 7 jumps, how many steps have you moved?',
        options: ['25', '30', '35', '40'],
        answerIndex: 2,
      },
    ],
  },
]

