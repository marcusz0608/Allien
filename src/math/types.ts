/** Number of levels per grade band (1 through this value). */
export const TOTAL_MATH_LEVELS = 25

export type MathGradeId = 'K–2' | '3–5' | '6–8' | '9–12'

export type MathQuestionType = 'single'

export type MathQuestion = {
  id: string
  type: MathQuestionType
  prompt: string
  options: string[]
  answerIndex: number
  kangarooStyle?: boolean
  /** Boss question: uses larger numbers (e.g. 3-digit); used for the boss enemy in the game */
  isBoss?: boolean
}

export type MathLevelId = {
  gradeId: MathGradeId
  levelNumber: number
}

export type MathLevelConfig = MathLevelId & {
  title: string
  description: string
  questions: MathQuestion[]
}

