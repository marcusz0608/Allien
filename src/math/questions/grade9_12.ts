import type { MathLevelConfig } from '../types'
import { TOTAL_MATH_LEVELS } from '../types'

const G9_12_LEVEL_1: MathLevelConfig = {
  gradeId: '9–12',
  levelNumber: 1,
  title: 'Algebra Heights',
  description: 'Algebra, linear equations, and basic geometry.',
  questions: [
    { id: 'g912-l1-q1', type: 'single', prompt: 'If x + 7 = 15, what is x?', options: ['6', '7', '8', '22'], answerIndex: 2 },
    { id: 'g912-l1-q2', type: 'single', prompt: 'Simplify: 3x + 2x', options: ['5x', '6x', '5x²', '6x²'], answerIndex: 0 },
    { id: 'g912-l1-q3', type: 'single', prompt: 'What is the area of a rectangle with length 12 and width 5?', options: ['34', '60', '17', '72'], answerIndex: 1 },
    { id: 'g912-l1-q4', type: 'single', prompt: 'If 2n − 4 = 10, what is n?', options: ['3', '6', '7', '14'], answerIndex: 2 },
    { id: 'g912-l1-q5', type: 'single', prompt: 'What is (−2)³?', options: ['−8', '8', '−6', '6'], answerIndex: 0 },
    { id: 'g912-l1-q6', type: 'single', prompt: 'Simplify: 5a − 2a + a', options: ['3a', '4a', '8a', '7a'], answerIndex: 1 },
    { id: 'g912-l1-q7', type: 'single', prompt: 'What is the perimeter of a square with side length 6?', options: ['12', '24', '36', '18'], answerIndex: 1 },
    { id: 'g912-l1-q8', type: 'single', prompt: 'If 3y = 27, what is y?', options: ['6', '8', '9', '24'], answerIndex: 2 },
    { id: 'g912-l1-q9', type: 'single', prompt: 'What is √49?', options: ['6', '7', '8', '9'], answerIndex: 1 },
    { id: 'g912-l1-q10', type: 'single', prompt: 'Expand: 2(x + 5)', options: ['2x + 5', '2x + 10', 'x + 10', '2x + 7'], answerIndex: 1 },
    { id: 'g912-l1-q11', type: 'single', prompt: 'What is the slope of the line y = 4x + 1?', options: ['1', '4', '0', '−4'], answerIndex: 1 },
    { id: 'g912-l1-q12', type: 'single', prompt: 'If 4m + 3 = 19, what is m?', options: ['3', '4', '5', '6'], answerIndex: 1 },
    { id: 'g912-l1-q13', type: 'single', prompt: 'What is 5²?', options: ['10', '25', '15', '32'], answerIndex: 1 },
    { id: 'g912-l1-q14', type: 'single', prompt: 'Solve: x/4 = 5', options: ['x = 1', 'x = 9', 'x = 20', 'x = 4/5'], answerIndex: 2 },
    { id: 'g912-l1-q15', type: 'single', prompt: 'What is the area of a triangle with base 10 and height 4?', options: ['14', '20', '40', '24'], answerIndex: 1 },
    { id: 'g912-l1-q16', type: 'single', prompt: 'Simplify: 6b ÷ 2', options: ['3b', '4b', '12b', '3'], answerIndex: 0 },
    { id: 'g912-l1-q17', type: 'single', prompt: 'What is 2⁴?', options: ['8', '16', '6', '12'], answerIndex: 1 },
    { id: 'g912-l1-q18', type: 'single', prompt: 'If 2k + 8 = 18, what is k?', options: ['3', '5', '10', '13'], answerIndex: 1 },
    { id: 'g912-l1-q19', type: 'single', prompt: 'What is the circumference of a circle with radius 5? (Use π ≈ 3.14)', options: ['15.7', '31.4', '78.5', '10'], answerIndex: 1 },
    { id: 'g912-l1-q20', type: 'single', prompt: 'Factor: 6x + 12', options: ['6(x + 2)', '3(2x + 4)', '2(3x + 6)', '6x + 12'], answerIndex: 0 },
    { id: 'g912-l1-boss1', type: 'single', prompt: 'If 5p − 3 = 2p + 9, what is p?', options: ['2', '4', '6', '12'], answerIndex: 2, isBoss: true },
    { id: 'g912-l1-boss2', type: 'single', prompt: 'What is the area of a circle with radius 6? (Use π ≈ 3.14)', options: ['18.84', '113.04', '37.68', '36'], answerIndex: 1, isBoss: true },
    { id: 'g912-l1-boss3', type: 'single', prompt: 'Simplify: (x + 3)(x + 2)', options: ['x² + 5x + 6', 'x² + 6', '2x + 5', 'x² + 5'], answerIndex: 0, isBoss: true },
  ],
}

function buildLevels(base: MathLevelConfig): MathLevelConfig[] {
  const levels: MathLevelConfig[] = [base]
  for (let n = 2; n <= TOTAL_MATH_LEVELS; n++) {
    levels.push({
      ...base,
      levelNumber: n,
      title: `Level ${n}`,
      description: `Algebra and geometry — mission ${n}.`,
      questions: base.questions,
    })
  }
  return levels
}

export const G9_12_LEVELS: MathLevelConfig[] = buildLevels(G9_12_LEVEL_1)
