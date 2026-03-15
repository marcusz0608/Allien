import type { MathGradeId, MathLevelConfig, MathQuestion } from './types'
import { K2_LEVELS } from './questions/k2'
import { G3_5_LEVELS } from './questions/grade3_5'
import { G6_8_LEVELS } from './questions/grade6_8'
import { G9_12_LEVELS } from './questions/grade9_12'

const ALL_LEVELS: MathLevelConfig[] = [
  ...K2_LEVELS,
  ...G3_5_LEVELS,
  ...G6_8_LEVELS,
  ...G9_12_LEVELS,
]

export async function getLevelQuestions(
  gradeId: MathGradeId,
  levelNumber: number,
): Promise<{ level: MathLevelConfig | null; questions: MathQuestion[] }> {
  const level =
    ALL_LEVELS.find((lvl) => lvl.gradeId === gradeId && lvl.levelNumber === levelNumber) ?? null
  return {
    level,
    questions: level ? level.questions : [],
  }
}

