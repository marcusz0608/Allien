import type { MathLevelConfig } from '../types'
import { TOTAL_MATH_LEVELS } from '../types'

const G6_8_LEVEL_1: MathLevelConfig = {
  gradeId: '6–8',
  levelNumber: 1,
  title: 'Rational Valley',
  description: 'Fractions, decimals, ratios, and negative numbers.',
  questions: [
    { id: 'g68-l1-q1', type: 'single', prompt: 'What is 5/6 + 1/3?', options: ['6/9', '7/6', '3/6', '2/3'], answerIndex: 1 },
    { id: 'g68-l1-q2', type: 'single', prompt: 'What is 0.6 + 0.4?', options: ['0.10', '1.0', '1.2', '0.24'], answerIndex: 1 },
    { id: 'g68-l1-q3', type: 'single', prompt: 'Simplify: 12/16', options: ['6/8', '3/4', '4/6', '2/3'], answerIndex: 1 },
    { id: 'g68-l1-q4', type: 'single', prompt: 'What is 5 − (−3)?', options: ['2', '8', '−2', '−8'], answerIndex: 1 },
    { id: 'g68-l1-q5', type: 'single', prompt: 'A recipe uses 2 cups flour and 3 cups sugar. What is the ratio of flour to sugar?', options: ['2:5', '3:2', '2:3', '5:2'], answerIndex: 2 },
    { id: 'g68-l1-q6', type: 'single', prompt: 'What is 1/2 × 4/5?', options: ['4/10', '2/5', '5/7', '4/7'], answerIndex: 1 },
    { id: 'g68-l1-q7', type: 'single', prompt: 'What is −7 + 10?', options: ['−17', '3', '−3', '17'], answerIndex: 1 },
    { id: 'g68-l1-q8', type: 'single', prompt: 'Convert 0.25 to a fraction in lowest terms.', options: ['25/100', '1/4', '2/5', '1/5'], answerIndex: 1 },
    { id: 'g68-l1-q9', type: 'single', prompt: 'What is 2/3 − 1/6?', options: ['1/3', '1/2', '1/6', '3/9'], answerIndex: 1 },
    { id: 'g68-l1-q10', type: 'single', prompt: 'What is 15% of 60?', options: ['6', '9', '12', '15'], answerIndex: 1 },
    { id: 'g68-l1-q11', type: 'single', prompt: 'What is (−4) × (−5)?', options: ['−20', '20', '−9', '9'], answerIndex: 1 },
    { id: 'g68-l1-q12', type: 'single', prompt: 'What is 3/5 ÷ 2?', options: ['6/5', '3/10', '5/6', '2/5'], answerIndex: 1 },
    { id: 'g68-l1-q13', type: 'single', prompt: 'What is 0.8 × 12?', options: ['9', '9.6', '10', '96'], answerIndex: 1 },
    { id: 'g68-l1-q14', type: 'single', prompt: 'Which is greater: −3 or −7?', options: ['−7', '−3', 'Same', 'Neither'], answerIndex: 1 },
    { id: 'g68-l1-q15', type: 'single', prompt: 'What is 3 + 4 × 5?', options: ['23', '35', '17', '20'], answerIndex: 0 },
    { id: 'g68-l1-q16', type: 'single', prompt: 'What is 1/3 + 1/6?', options: ['2/9', '1/2', '1/9', '2/6'], answerIndex: 1 },
    { id: 'g68-l1-q17', type: 'single', prompt: 'What is 50% of 24?', options: ['10', '12', '14', '48'], answerIndex: 1 },
    { id: 'g68-l1-q18', type: 'single', prompt: 'What is −12 ÷ 4?', options: ['3', '−3', '8', '−8'], answerIndex: 1 },
    { id: 'g68-l1-q19', type: 'single', prompt: 'What is 4/5 as a decimal?', options: ['0.45', '0.8', '0.54', '4.5'], answerIndex: 1 },
    { id: 'g68-l1-q20', type: 'single', prompt: 'What is 6 − 9?', options: ['−3', '3', '15', '−15'], answerIndex: 0 },
    { id: 'g68-l1-boss1', type: 'single', prompt: 'What is 3/4 + 5/8?', options: ['11/8', '1 3/8', '7/8', '2 1/8'], answerIndex: 1, isBoss: true },
    { id: 'g68-l1-boss2', type: 'single', prompt: 'Evaluate: 2(3 − 5) − 4', options: ['−8', '−4', '0', '4'], answerIndex: 0, isBoss: true },
    { id: 'g68-l1-boss3', type: 'single', prompt: 'A shirt costs $48 and is on sale for 25% off. What is the sale price?', options: ['$24', '$32', '$36', '$40'], answerIndex: 2, isBoss: true },
  ],
}

function buildLevels(base: MathLevelConfig): MathLevelConfig[] {
  const levels: MathLevelConfig[] = [base]
  for (let n = 2; n <= TOTAL_MATH_LEVELS; n++) {
    levels.push({
      ...base,
      levelNumber: n,
      title: `Level ${n}`,
      description: `Fractions, decimals, and integers — mission ${n}.`,
      questions: base.questions,
    })
  }
  return levels
}

export const G6_8_LEVELS: MathLevelConfig[] = buildLevels(G6_8_LEVEL_1)
