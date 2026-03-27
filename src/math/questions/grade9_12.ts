import type { MathLevelConfig } from '../types'
import { TOTAL_MATH_LEVELS } from '../types'

const G9_12_LEVEL_1: MathLevelConfig = {
  gradeId: '9–12',
  levelNumber: 1,
  title: 'Algebra Heights',
  description: 'Harder algebra, quadratics, and geometry.',
  questions: [
    { id: 'g912-l1-q1', type: 'single', prompt: 'Solve for x: 4x − 7 = 2x + 9', options: ['x = 8', 'x = 7', 'x = −8', 'x = −7'], answerIndex: 0 },
    { id: 'g912-l1-q2', type: 'single', prompt: 'Simplify: (2x − 3) + (5x + 7)', options: ['7x + 4', '3x − 10', '7x − 4', '7x + 10'], answerIndex: 3 },
    { id: 'g912-l1-q3', type: 'single', prompt: 'Solve: 3(x − 2) = 2(x + 5)', options: ['x = 4', 'x = 11', 'x = 16', 'x = −4'], answerIndex: 0 },
    { id: 'g912-l1-q4', type: 'single', prompt: 'Which is the solution set of x² − 9 = 0?', options: ['x = 9', 'x = −9', 'x = ±3', 'x = 0, 9'], answerIndex: 2 },
    { id: 'g912-l1-q5', type: 'single', prompt: 'The line y = 2x − 5 is shifted up 3 units. What is the new equation?', options: ['y = 2x − 2', 'y = 2x − 8', 'y = 2x + 3', 'y = 5x − 2'], answerIndex: 0 },
    { id: 'g912-l1-q6', type: 'single', prompt: 'Solve the inequality: 5x − 4 > 2x + 8', options: ['x > 4', 'x > −4', 'x > 12', 'x > 0'], answerIndex: 0 },
    { id: 'g912-l1-q7', type: 'single', prompt: 'In a right triangle, the legs are 6 and 8. What is the hypotenuse?', options: ['10', '12', '14', '√100'], answerIndex: 0 },
    { id: 'g912-l1-q8', type: 'single', prompt: 'Simplify: (x + 4)²', options: ['x² + 8x + 16', 'x² + 16', 'x² + 4x + 4', 'x² − 8x + 16'], answerIndex: 0 },
    { id: 'g912-l1-q9', type: 'single', prompt: 'Solve: x² − 4x − 12 = 0', options: ['x = −2, 6', 'x = 2, 6', 'x = −3, 4', 'x = −6, 2'], answerIndex: 0 },
    { id: 'g912-l1-q10', type: 'single', prompt: 'Which expression is equivalent to (3x − 2)(x + 5)?', options: ['3x² + 13x − 10', '3x² − 13x − 10', '3x² + 15x − 2', '3x² − 15x − 2'], answerIndex: 0 },
    { id: 'g912-l1-q11', type: 'single', prompt: 'If the slope of a line is 3 and it passes through (1, 2), what is its equation?', options: ['y = 3x + 2', 'y = 3x − 1', 'y = 3x − 2', 'y = 2x + 3'], answerIndex: 1 },
    { id: 'g912-l1-q12', type: 'single', prompt: 'What is the distance between the points (−1, 2) and (3, 5)?', options: ['4', '5', '√25', '√18'], answerIndex: 3 },
    { id: 'g912-l1-q13', type: 'single', prompt: 'Factor completely: x² − 5x + 6', options: ['(x − 2)(x − 3)', '(x + 2)(x + 3)', '(x − 1)(x − 6)', '(x − 3)(x + 2)'], answerIndex: 0 },
    { id: 'g912-l1-q14', type: 'single', prompt: 'Solve for t: 7(t − 2) + 3 = 4t + 12', options: ['t = 3', 't = 4', 't = 5', 't = 6'], answerIndex: 2 },
    { id: 'g912-l1-q15', type: 'single', prompt: 'A rectangle has perimeter 50 and length 15. What is its width?', options: ['10', '5', '12.5', '20'], answerIndex: 1 },
    { id: 'g912-l1-q16', type: 'single', prompt: 'Simplify: (2x³y²)(3x²y)', options: ['6x⁵y³', '5x⁵y²', '6x⁶y³', '6x⁵y²'], answerIndex: 0 },
    { id: 'g912-l1-q17', type: 'single', prompt: 'If f(x) = 2x² − 3x + 1, what is f(−1)?', options: ['6', '0', '−4', '2'], answerIndex: 1 },
    { id: 'g912-l1-q18', type: 'single', prompt: 'Solve: log₁₀(x) = 2', options: ['x = 20', 'x = 100', 'x = 2', 'x = 10'], answerIndex: 1 },
    { id: 'g912-l1-q19', type: 'single', prompt: 'The radius of a circle is doubled. What happens to its area?', options: ['Stays the same', 'Doubles', 'Triples', 'Quadruples'], answerIndex: 3 },
    { id: 'g912-l1-q20', type: 'single', prompt: 'Solve the system: x + y = 7 and x − y = 1', options: ['(x, y) = (4, 3)', '(x, y) = (3, 4)', '(x, y) = (7, 1)', '(x, y) = (1, 7)'], answerIndex: 0 },
    { id: 'g912-l1-boss1', type: 'single', prompt: 'Solve: 2x² − 7x − 4 = 0', options: ['x = 4, −1/2', 'x = −4, 1/2', 'x = 2, −2', 'x = 7, −4'], answerIndex: 0, isBoss: true },
    { id: 'g912-l1-boss2', type: 'single', prompt: 'A line has equation 2y − 4x = 8. What is its slope-intercept form?', options: ['y = 2x + 4', 'y = x + 4', 'y = 2x − 4', 'y = −2x + 4'], answerIndex: 0, isBoss: true },
    { id: 'g912-l1-boss3', type: 'single', prompt: 'Simplify: (x + 2)(x − 5) − (x − 1)(x + 3)', options: ['−3x − 1', '−3x − 7', '3x − 7', '3x + 1'], answerIndex: 1, isBoss: true },
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
