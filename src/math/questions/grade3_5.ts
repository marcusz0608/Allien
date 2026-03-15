import type { MathLevelConfig } from '../types'
import { TOTAL_MATH_LEVELS } from '../types'

const G3_5_LEVEL_1: MathLevelConfig = {
  gradeId: '3–5',
  levelNumber: 1,
  title: 'Times Table City',
  description: 'Practice multiplication with ×2, ×5, and ×10.',
  questions: [
      {
        id: 'g3-5-l1-q1',
        type: 'single',
        prompt: 'There are 12 boxes with 2 pencils in each box. How many pencils are there in total?',
        options: ['14', '24', '26', '122'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-q2',
        type: 'single',
        prompt: 'A spider has 8 legs. How many legs do 12 spiders have?',
        options: ['20', '96', '98', '128'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-q3',
        type: 'single',
        prompt: 'Each star badge is worth 5 points. If you have 11 star badges, how many points is that?',
        options: ['50', '55', '60', '115'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-q4',
        type: 'single',
        prompt: 'Four bags each have 10 marbles. How many marbles are there in all?',
        options: ['14', '40', '44', '104'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-q5',
        type: 'single',
        prompt: 'You jump 5 steps each time. After 12 jumps, how many steps have you moved?',
        options: ['50', '55', '60', '65'],
        answerIndex: 2,
      },
      {
        id: 'g3-5-l1-q6',
        type: 'single',
        prompt: 'Ten times four equals …',
        options: ['14', '40', '44', '400'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-q7',
        type: 'single',
        prompt: 'A pack of stickers has 5 stickers. How many stickers are in 9 packs?',
        options: ['35', '40', '45', '50'],
        answerIndex: 2,
      },
      {
        id: 'g3-5-l1-q8',
        type: 'single',
        prompt: 'Double 9. What number do you get?',
        options: ['11', '18', '27', '92'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-q9',
        type: 'single',
        prompt: 'Six rows of chairs, 10 chairs in each row. How many chairs in total?',
        options: ['16', '60', '66', '106'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-q10',
        type: 'single',
        prompt: 'Multiply 5 by 8.',
        options: ['35', '40', '45', '58'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-q11',
        type: 'single',
        prompt: 'Each basket holds 2 apples. How many apples do 12 baskets hold?',
        options: ['14', '24', '26', '122'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-q12',
        type: 'single',
        prompt: 'How many is 10 × 10?',
        options: ['20', '100', '101', '1000'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-q13',
        type: 'single',
        prompt: 'A robot walks 5 meters every second. How far does it walk in 6 seconds?',
        options: ['11', '25', '30', '56'],
        answerIndex: 2,
      },
      {
        id: 'g3-5-l1-q14',
        type: 'single',
        prompt: 'Two times seven is …',
        options: ['9', '14', '27', '72'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-q15',
        type: 'single',
        prompt: 'Four boxes, each with 5 toy cars. How many toy cars in total?',
        options: ['9', '20', '45', '54'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-q16',
        type: 'single',
        prompt: 'If you have 10 groups of 7, how many do you have in all?',
        options: ['17', '70', '77', '107'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-q17',
        type: 'single',
        prompt: 'Each necklace needs 5 beads. How many beads do you need for 8 necklaces?',
        options: ['13', '35', '40', '58'],
        answerIndex: 2,
      },
      {
        id: 'g3-5-l1-q18',
        type: 'single',
        prompt: 'Double 12. What is the answer?',
        options: ['14', '24', '26', '122'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-q19',
        type: 'single',
        prompt: 'A ferry carries 10 cars each trip. How many cars can it carry in 5 trips?',
        options: ['15', '50', '55', '105'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-q20',
        type: 'single',
        prompt: 'Five times five equals …',
        options: ['10', '25', '55', '255'],
        answerIndex: 1,
      },
      {
        id: 'g3-5-l1-boss1',
        type: 'single',
        prompt: 'What is 12 × 5?',
        options: ['50', '60', '65', '72'],
        answerIndex: 1,
        isBoss: true,
      },
      {
        id: 'g3-5-l1-boss2',
        type: 'single',
        prompt: 'What is 15 × 4?',
        options: ['45', '54', '60', '65'],
        answerIndex: 2,
        isBoss: true,
      },
      {
        id: 'g3-5-l1-boss3',
        type: 'single',
        prompt: 'What is 11 × 9?',
        options: ['90', '99', '108', '119'],
        answerIndex: 1,
        isBoss: true,
      },
    ],
}

function buildLevels(base: MathLevelConfig): MathLevelConfig[] {
  const levels: MathLevelConfig[] = [base]
  for (let n = 2; n <= TOTAL_MATH_LEVELS; n++) {
    levels.push({
      ...base,
      levelNumber: n,
      title: `Level ${n}`,
      description: `Multiplication and number sense — mission ${n}.`,
      questions: base.questions,
    })
  }
  return levels
}

export const G3_5_LEVELS: MathLevelConfig[] = buildLevels(G3_5_LEVEL_1)
