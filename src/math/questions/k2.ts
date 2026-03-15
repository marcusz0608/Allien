import type { MathLevelConfig } from '../types'

export const K2_LEVELS: MathLevelConfig[] = [
  {
    gradeId: 'K–2',
    levelNumber: 1,
    title: 'Story problems up to 10',
    description: 'Solve short stories about balloons, birds, cars, and crayons.',
    questions: [
      {
        id: 'k2-l1-q1',
        type: 'single',
        prompt:
          'Mia has 3 red balloons and 2 blue balloons. Her friend gives her 2 more red balloons. How many red balloons does Mia have now?',
        options: ['3', '4', '5', '7'],
        answerIndex: 2,
        kangarooStyle: true,
      },
      {
        id: 'k2-l1-q2',
        type: 'single',
        prompt:
          'There are 5 birds on a fence. 2 birds fly away and then 1 new bird lands. How many birds are on the fence now?',
        options: ['3', '4', '5', '6'],
        answerIndex: 1,
        kangarooStyle: true,
      },
      {
        id: 'k2-l1-q3',
        type: 'single',
        prompt: 'Leo has 4 toy cars. He gets 3 more toy cars for his birthday. How many toy cars does Leo have now?',
        options: ['5', '6', '7', '8'],
        answerIndex: 2,
      },
      {
        id: 'k2-l1-q4',
        type: 'single',
        prompt: 'On the table there are 2 apples and 5 bananas. How many pieces of fruit are on the table?',
        options: ['5', '6', '7', '8'],
        answerIndex: 2,
      },
      {
        id: 'k2-l1-q5',
        type: 'single',
        prompt:
          'A box holds exactly 5 crayons. You have 9 crayons. How many crayons will NOT fit in the box?',
        options: ['1', '2', '3', '4'],
        answerIndex: 1,
        kangarooStyle: true,
      },
    ],
  },
]

