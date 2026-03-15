import type { MathLevelConfig } from '../types'
import { TOTAL_MATH_LEVELS } from '../types'

const K2_LEVEL_1: MathLevelConfig = {
  gradeId: 'K–2',
  levelNumber: 1,
  title: 'Number Forest',
  description: 'Solve short stories about balloons, birds, cars, and more.',
  questions: [
      {
        id: 'k2-l1-q1',
        type: 'single',
        prompt:
          'Mia has 12 red balloons and 7 blue balloons. Her friend gives her 5 more red balloons. How many red balloons does Mia have now?',
        options: ['17', '19', '24', '27'],
        answerIndex: 0,
        kangarooStyle: true,
      },
      {
        id: 'k2-l1-q2',
        type: 'single',
        prompt:
          'There are 25 birds on a fence. 10 birds fly away and then 3 new birds land. How many birds are on the fence now?',
        options: ['15', '18', '22', '28'],
        answerIndex: 1,
        kangarooStyle: true,
      },
      {
        id: 'k2-l1-q3',
        type: 'single',
        prompt: 'Leo has 14 toy cars. He gets 11 more for his birthday. How many toy cars does Leo have now?',
        options: ['23', '25', '27', '30'],
        answerIndex: 1,
      },
      {
        id: 'k2-l1-q4',
        type: 'single',
        prompt: 'On the table there are 15 apples and 12 bananas. How many pieces of fruit are on the table?',
        options: ['25', '27', '28', '30'],
        answerIndex: 1,
      },
      {
        id: 'k2-l1-q5',
        type: 'single',
        prompt: 'A box holds exactly 10 crayons. You have 24 crayons. How many crayons will NOT fit in the box?',
        options: ['4', '14', '20', '34'],
        answerIndex: 1,
        kangarooStyle: true,
      },
      {
        id: 'k2-l1-q6',
        type: 'single',
        prompt: 'Jake has 18 stickers. He gives 6 to his sister. How many stickers does Jake have left?',
        options: ['10', '12', '14', '24'],
        answerIndex: 1,
      },
      {
        id: 'k2-l1-q7',
        type: 'single',
        prompt: 'Fourteen ducks are in the pond. Twelve more ducks swim over. How many ducks are in the pond now?',
        options: ['24', '26', '28', '30'],
        answerIndex: 1,
      },
      {
        id: 'k2-l1-q8',
        type: 'single',
        prompt: 'Emma has 28 beads. She uses 15 to make a bracelet. How many beads does she have left?',
        options: ['11', '13', '14', '43'],
        answerIndex: 1,
      },
      {
        id: 'k2-l1-q9',
        type: 'single',
        prompt: 'Which number is bigger: 47 or 74?',
        options: ['47', '74', 'They are the same', 'I don\'t know'],
        answerIndex: 1,
      },
      {
        id: 'k2-l1-q10',
        type: 'single',
        prompt: 'Sam has 13 green marbles and 14 blue marbles. How many marbles does Sam have in total?',
        options: ['26', '27', '28', '29'],
        answerIndex: 1,
      },
      {
        id: 'k2-l1-q11',
        type: 'single',
        prompt: 'Twenty cookies are on a plate. The family eats 6. How many cookies are left?',
        options: ['12', '14', '16', '26'],
        answerIndex: 1,
      },
      {
        id: 'k2-l1-q12',
        type: 'single',
        prompt: 'A basket has 12 peaches and 16 plums. How many pieces of fruit are in the basket?',
        options: ['26', '28', '30', '32'],
        answerIndex: 1,
      },
      {
        id: 'k2-l1-q13',
        type: 'single',
        prompt: 'Which number is smaller: 35 or 53?',
        options: ['35', '53', 'They are the same', 'I don\'t know'],
        answerIndex: 0,
      },
      {
        id: 'k2-l1-q14',
        type: 'single',
        prompt: 'Lily picks 14 flowers in the morning and 15 in the afternoon. How many flowers did she pick in all?',
        options: ['27', '28', '29', '30'],
        answerIndex: 2,
      },
      {
        id: 'k2-l1-q15',
        type: 'single',
        prompt: 'Seventeen fish are in a tank. The teacher moves 8 to another tank. How many fish stay in the first tank?',
        options: ['7', '8', '9', '25'],
        answerIndex: 2,
      },
      {
        id: 'k2-l1-q16',
        type: 'single',
        prompt: 'Tom has 11 red balls and 18 blue balls. How many balls does Tom have?',
        options: ['27', '28', '29', '30'],
        answerIndex: 2,
      },
      {
        id: 'k2-l1-q17',
        type: 'single',
        prompt: 'A shelf has 19 books. Mom adds 12 more books. How many books are on the shelf now?',
        options: ['28', '30', '31', '32'],
        answerIndex: 2,
      },
      {
        id: 'k2-l1-q18',
        type: 'single',
        prompt: 'Sixteen rabbits are in the garden. Seven run into the woods. How many rabbits are still in the garden?',
        options: ['7', '8', '9', '23'],
        answerIndex: 2,
      },
      {
        id: 'k2-l1-q19',
        type: 'single',
        prompt: 'Zara has 15 toy dinosaurs. Her brother gives her 14 more. How many dinosaurs does Zara have now?',
        options: ['27', '28', '29', '30'],
        answerIndex: 2,
      },
      {
        id: 'k2-l1-q20',
        type: 'single',
        prompt: 'Twenty seeds are on the ground. A bird eats 7 of them. How many seeds are left?',
        options: ['11', '12', '13', '14'],
        answerIndex: 2,
      },
      {
        id: 'k2-l1-boss1',
        type: 'single',
        prompt: 'There are 25 red marbles and 14 blue marbles. How many marbles in all?',
        options: ['37', '39', '41', '49'],
        answerIndex: 0,
        isBoss: true,
      },
      {
        id: 'k2-l1-boss2',
        type: 'single',
        prompt: 'A store had 50 toy cars. They sold 12. How many toy cars are left?',
        options: ['36', '38', '42', '62'],
        answerIndex: 1,
        isBoss: true,
      },
      {
        id: 'k2-l1-boss3',
        type: 'single',
        prompt: 'Jake has 11 stickers. His sister gives him 11 more. How many stickers does Jake have now?',
        options: ['20', '21', '22', '24'],
        answerIndex: 2,
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
      description: `Story problems and number sense — mission ${n}.`,
      questions: base.questions,
    })
  }
  return levels
}

export const K2_LEVELS: MathLevelConfig[] = buildLevels(K2_LEVEL_1)
