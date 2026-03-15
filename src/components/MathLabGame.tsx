import { useEffect, useState, useMemo, useCallback } from 'react'
import type { MathQuestion } from '../math/types'

const MAP_COLS = 8
const MAP_ROWS = 6

type Foe = { x: number; y: number; questionIndex: number; isBoss: boolean }

function buildFoePositions(questions: MathQuestion[], bossIndices: number[]): Foe[] {
  const firstBossQ = bossIndices.length > 0 ? bossIndices[0] : Math.min(5, questions.length - 1)
  return [
    { x: 2, y: 1, questionIndex: 0, isBoss: false },
    { x: 4, y: 1, questionIndex: 1, isBoss: false },
    { x: 6, y: 1, questionIndex: 2, isBoss: false },
    { x: 1, y: 3, questionIndex: 3, isBoss: false },
    { x: 5, y: 3, questionIndex: 4, isBoss: false },
    { x: 4, y: 4, questionIndex: firstBossQ, isBoss: true },
  ]
}

type MathLabGameProps = {
  questions: MathQuestion[]
  onComplete: (energy: number) => void
  onBack: () => void
}

const BOSS_QUESTION_COUNT = 3

export function MathLabGame({ questions, onComplete, onBack }: MathLabGameProps) {
  const bossIndices = useMemo(
    () => questions.map((q, i) => (q.isBoss ? i : -1)).filter((i) => i >= 0).slice(0, BOSS_QUESTION_COUNT),
    [questions],
  )
  const foePositions = useMemo(() => buildFoePositions(questions, bossIndices), [questions, bossIndices])
  const [char, setChar] = useState({ x: 0, y: 0 })
  const [defeated, setDefeated] = useState<number[]>([])
  const [energy, setEnergy] = useState(0)
  const [modal, setModal] = useState<{
    foeIndex: number
    questionIndex: number
    isBoss: boolean
    bossQuestionOffset: number // 0, 1, or 2 for boss's 3 questions
    selectedOption: number | null
    showAnswer: boolean
  } | null>(null)

  const hasFoe = useCallback(
    (x: number, y: number) => {
      const idx = foePositions.findIndex((f) => f.x === x && f.y === y)
      return idx >= 0 ? idx : -1
    },
    [foePositions],
  )

  const isDefeated = useCallback((foeIndex: number) => defeated.includes(foeIndex), [defeated])

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
    if (modal) return
    let dx = 0
    let dy = 0
    if (e.key === 'ArrowUp') dy = -1
    else if (e.key === 'ArrowDown') dy = 1
    else if (e.key === 'ArrowLeft') dx = -1
    else if (e.key === 'ArrowRight') dx = 1
    else return
    e.preventDefault()

    const nx = char.x + dx
    const ny = char.y + dy
    if (nx < 0 || nx >= MAP_COLS || ny < 0 || ny >= MAP_ROWS) return

    const foeIdx = hasFoe(nx, ny)
    if (foeIdx >= 0 && !isDefeated(foeIdx)) {
      const foe = foePositions[foeIdx]
      if (foe.isBoss ? bossIndices.length >= BOSS_QUESTION_COUNT : foe.questionIndex < questions.length) {
        setModal({
          foeIndex: foeIdx,
          questionIndex: foe.questionIndex,
          isBoss: foe.isBoss,
          bossQuestionOffset: 0,
          selectedOption: null,
          showAnswer: false,
        })
      } else {
        setChar({ x: nx, y: ny })
      }
    } else {
      setChar({ x: nx, y: ny })
    }
  },
    [char, modal, defeated, hasFoe, isDefeated, foePositions, questions.length, bossIndices.length],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const handleCheckAnswer = () => {
    if (!modal || modal.selectedOption == null) return
    const questionIndex = modal.isBoss ? bossIndices[modal.bossQuestionOffset] : modal.questionIndex
    const q = questions[questionIndex]
    const correct = modal.selectedOption === q.answerIndex
    if (!modal.showAnswer) {
      if (correct) {
        if (modal.isBoss && modal.bossQuestionOffset < BOSS_QUESTION_COUNT - 1) {
          setModal((m) =>
            m
              ? {
                  ...m,
                  bossQuestionOffset: m.bossQuestionOffset + 1,
                  questionIndex: bossIndices[m.bossQuestionOffset + 1],
                  selectedOption: null,
                  showAnswer: false,
                }
              : null,
          )
        } else {
          const bonus = modal.isBoss ? 2 : 1
          setEnergy((e) => e + bonus)
          setDefeated((d) => [...d, modal!.foeIndex])
          setChar(() => {
            const f = foePositions[modal!.foeIndex]
            return { x: f.x, y: f.y }
          })
          setModal(null)
        }
      } else {
        setModal((m) => (m ? { ...m, showAnswer: true } : null))
      }
    } else {
      setModal(null)
    }
  }

  const handleCloseModal = () => {
    setModal(null)
  }

  const allDefeated = foePositions.every((_, i) => defeated.includes(i))

  if (allDefeated) {
    return (
      <section className="math-level-screen">
        <button type="button" className="tictactoe-back" onClick={() => onComplete(energy)}>
          ← Back to Math Lab
        </button>
        <h2 className="math-level-title">🎉 Level complete!</h2>
        <p className="math-intro math-intro-detail">
          You defeated all enemies and the boss! You earned <strong>{energy} energy</strong>. Great job!
        </p>
        <button type="button" className="math-start-level" onClick={() => onComplete(energy)}>
          Back to Math Lab
        </button>
      </section>
    )
  }

  const currentQuestion =
    modal != null
      ? questions[modal.isBoss ? bossIndices[modal.bossQuestionOffset] : modal.questionIndex]
      : null

  return (
    <section className="math-level-screen math-game-screen">
      <button type="button" className="tictactoe-back" onClick={onBack}>
        ← Back to Math Lab
      </button>
      <p className="math-energy-label math-game-energy">
        Energy: {energy} — Use arrow keys to move. Step on enemies (👾) or the boss (🐉). Boss asks 3 questions (2-digit) and gives +2 energy!
      </p>

      <div
        className="math-game-grid"
        style={{
          gridTemplateColumns: `repeat(${MAP_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${MAP_ROWS}, 1fr)`,
        }}
      >
        {Array.from({ length: MAP_ROWS * MAP_COLS }, (_, i) => {
          const x = i % MAP_COLS
          const y = Math.floor(i / MAP_COLS)
          const foeIdx = hasFoe(x, y)
          const isChar = char.x === x && char.y === y
          const hasFoeHere = foeIdx >= 0 && !isDefeated(foeIdx)
          const foe = foeIdx >= 0 ? foePositions[foeIdx] : null
          return (
            <div key={i} className="math-game-cell">
              {hasFoeHere && !isChar && (
                <span
                  className={foe?.isBoss ? 'math-game-boss' : 'math-game-enemy'}
                  aria-hidden
                >
                  {foe?.isBoss ? '🐉' : '👾'}
                </span>
              )}
              {isChar && <span className="math-game-character" aria-hidden>🧑</span>}
            </div>
          )
        })}
      </div>

      {modal != null && currentQuestion && (
        <div className="math-modal-backdrop" onClick={handleCloseModal}>
          <div className="math-modal math-game-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="math-modal-title">
              {modal.isBoss
                ? `🐉 Boss question ${modal.bossQuestionOffset + 1} of ${BOSS_QUESTION_COUNT} (2-digit!):`
                : '👾 Enemy asks:'}
            </h2>
            <p className="quiz-question">{currentQuestion.prompt}</p>
            <div className="quiz-options">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = idx === modal!.selectedOption
                const isCorrect = idx === currentQuestion.answerIndex
                let extraClass = ''
                if (modal.showAnswer) {
                  if (isCorrect) extraClass = ' quiz-option--correct'
                  else if (isSelected) extraClass = ' quiz-option--wrong'
                } else if (isSelected) extraClass = ' quiz-option--selected'
                return (
                  <button
                    key={opt}
                    type="button"
                    className={`quiz-option${extraClass}`}
                    onClick={() =>
                      !modal.showAnswer &&
                      setModal((m) => (m ? { ...m, selectedOption: idx } : null))
                    }
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            <div className="math-modal-buttons">
              <button
                type="button"
                className="math-modal-close"
                onClick={modal.showAnswer ? handleCloseModal : handleCheckAnswer}
                disabled={!modal.showAnswer && modal.selectedOption == null}
              >
                {modal.showAnswer ? 'Continue' : 'Check answer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
