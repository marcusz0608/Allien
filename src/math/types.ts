export type MathGradeId = 'K–2' | '3–5' | '6–8' | '9–12'

export type MathQuestionType = 'single'

export type MathQuestion = {
  id: string
  type: MathQuestionType
  prompt: string
  options: string[]
  answerIndex: number
  kangarooStyle?: boolean
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

