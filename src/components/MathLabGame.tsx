import { useEffect, useState, useCallback } from 'react'
import type { MathQuestion } from '../math/types'

const MAP_COLS = 8
const MAP_ROWS = 6

const ENEMY_POSITIONS: { x: number; y: number; questionIndex: number }[] = [
  { x: 2, y: 1, questionIndex: 0 },
  { x: 4, y: 2, questionIndex: 1 },
  { x: 6, y: 1, questionIndex: 2 },
]

type MathLabGameProps = {
  questions: MathQuestion[]
  onComplete: (energy: number) => void
  onBack: () => void
}

export function MathLabGame({ questions, onComplete, onBack }: MathLabGameProps) {
  const [char, setChar] = useState({ x: 0, y: 0 })
  const [defeated, setDefeated] = useState<number[]>([])
  const [energy, setEnergy] = useState(0)
  const [modal, setModal] = useState<{
    enemyIndex: number
    questionIndex: number
    selectedOption: number | null
    showAnswer: boolean
  } | null>(null)

  const hasEnemy = useCallback(
    (x: number, y: number) => {
      const idx = ENEMY_POSITIONS.findIndex((e) => e.x === x && e.y === y)
      return idx >= 0 ? idx : -1
    },
    [],
  )

  const isDefeated = useCallback(
    (enemyIndex: number) => defeated.includes(enemyIndex),
    [defeated],
  )

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

      const enemyIdx = hasEnemy(nx, ny)
      if (enemyIdx >= 0 && !isDefeated(enemyIdx)) {
        const qIndex = ENEMY_POSITIONS[enemyIdx].questionIndex
        if (qIndex < questions.length) {
          setModal({
            enemyIndex: enemyIdx,
            questionIndex: qIndex,
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
    [char, modal, defeated, hasEnemy, isDefeated, questions.length],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const handleCheckAnswer = () => {
    if (!modal || modal.selectedOption == null) return
    const q = questions[modal.questionIndex]
    const correct = modal.selectedOption === q.answerIndex
    if (!modal.showAnswer) {
      if (correct) {
        setEnergy((e) => e + 1)
        setDefeated((d) => [...d, modal!.enemyIndex])
        setChar((c) => {
          const e = ENEMY_POSITIONS[modal!.enemyIndex]
          return { x: e.x, y: e.y }
        })
        setModal(null)
      } else {
        setModal((m) => m ? { ...m, showAnswer: true } : null)
      }
    } else {
      setModal(null)
    }
  }

  const handleCloseModal = () => {
    setModal(null)
  }

  const allDefeated = ENEMY_POSITIONS.every((_, i) => defeated.includes(i))

  useEffect(() => {
    if (allDefeated) {
      // Small delay so player sees the last enemy disappear
      const t = setTimeout(() => {}, 400)
      return () => clearTimeout(t)
    }
  }, [allDefeated])

  if (allDefeated) {
    return (
      <section className="math-level-screen">
        <button type="button" className="tictactoe-back" onClick={() => onComplete(energy)}>
          ← Back to Math Lab
        </button>
        <h2 className="math-level-title">🎉 Level complete!</h2>
        <p className="math-intro math-intro-detail">
          You defeated all enemies and earned <strong>{energy} energy</strong>. Great job!
        </p>
        <button type="button" className="math-start-level" onClick={() => onComplete(energy)}>
          Back to Math Lab
        </button>
      </section>
    )
  }

  const currentQuestion = modal != null ? questions[modal.questionIndex] : null

  return (
    <section className="math-level-screen math-game-screen">
      <button type="button" className="tictactoe-back" onClick={onBack}>
        ← Back to Math Lab
      </button>
      <p className="math-energy-label math-game-energy">
        Energy: {energy} — Use arrow keys to move. Step on an enemy to answer a question!
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
          const enemyIdx = hasEnemy(x, y)
          const isChar = char.x === x && char.y === y
          const hasEnemyHere = enemyIdx >= 0 && !isDefeated(enemyIdx)
          return (
            <div key={i} className="math-game-cell">
              {hasEnemyHere && !isChar && <span className="math-game-enemy" aria-hidden>👾</span>}
              {isChar && <span className="math-game-character" aria-hidden>🧑</span>}
            </div>
          )
        })}
      </div>

      {modal != null && currentQuestion && (
        <div className="math-modal-backdrop" onClick={handleCloseModal}>
          <div className="math-modal math-game-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="math-modal-title">👾 Enemy asks:</h2>
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
