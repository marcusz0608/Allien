import { useState, useEffect, useMemo } from 'react'

type SquareValue = 'X' | 'O' | null

const COLS = 6
const ROWS = 6
const SIZE = COLS * ROWS
const WIN_LENGTH = 5

const PLAYER = 'X'
const BOT = 'O'

/** All lines of WIN_LENGTH on a COLS x ROWS board */
function getLines(): number[][] {
  const lines: number[][] = []
  const idx = (r: number, c: number) => r * COLS + c

  // Rows
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c + WIN_LENGTH <= COLS; c++) {
      lines.push(Array.from({ length: WIN_LENGTH }, (_, i) => idx(r, c + i)))
    }
  }
  // Columns
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r + WIN_LENGTH <= ROWS; r++) {
      lines.push(Array.from({ length: WIN_LENGTH }, (_, i) => idx(r + i, c)))
    }
  }
  // Diagonals \
  for (let r = 0; r + WIN_LENGTH <= ROWS; r++) {
    for (let c = 0; c + WIN_LENGTH <= COLS; c++) {
      lines.push(Array.from({ length: WIN_LENGTH }, (_, i) => idx(r + i, c + i)))
    }
  }
  // Diagonals /
  for (let r = 0; r + WIN_LENGTH <= ROWS; r++) {
    for (let c = WIN_LENGTH - 1; c < COLS; c++) {
      lines.push(Array.from({ length: WIN_LENGTH }, (_, i) => idx(r + i, c - i)))
    }
  }
  return lines
}

const LINES = getLines()

function getWinner(squares: SquareValue[]): SquareValue | 'draw' {
  for (const line of LINES) {
    const first = squares[line[0]]
    if (!first) continue
    if (line.every((i) => squares[i] === first)) return first
  }
  if (squares.every((s) => s !== null)) return 'draw'
  return null
}

/** Returns the index where the given side can complete 5 in a row in one move, or -1 */
function findWinningMove(squares: SquareValue[], side: SquareValue): number {
  for (const line of LINES) {
    const vals = line.map((i) => squares[i])
    const count = vals.filter((v) => v === side).length
    const empty = vals.filter((v) => v === null).length
    if (count === WIN_LENGTH - 1 && empty === 1) {
      const pos = line[vals.findIndex((v) => v === null)]
      return pos
    }
  }
  return -1
}

/** Medium bot: usually blocks and wins when it can, otherwise picks a good spot */
function getBotMove(squares: SquareValue[]): number {
  const empty: number[] = []
  for (let i = 0; i < SIZE; i++) if (squares[i] === null) empty.push(i)
  if (empty.length === 0) return -1

  // Almost always take the win if we can
  const win = findWinningMove(squares, BOT)
  if (win >= 0) return win
  // Almost always block the player when they're one move from winning
  const block = findWinningMove(squares, PLAYER)
  if (block >= 0) return block
  // Prefer center and middle cells, then random from the rest (a bit harder than full random)
  const center = [14, 15, 20, 21, 16, 9, 10, 17, 22, 23] // middle of 6x6
  const preferred = center.filter((i) => squares[i] === null)
  if (preferred.length > 0 && Math.random() < 0.7) {
    return preferred[Math.floor(Math.random() * preferred.length)]
  }
  return empty[Math.floor(Math.random() * empty.length)]
}

interface TicTacToeProps {
  onBack: () => void
}

export function TicTacToe({ onBack }: TicTacToeProps) {
  const [squares, setSquares] = useState<SquareValue[]>(Array(SIZE).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [botThinking, setBotThinking] = useState(false)

  const winner = useMemo(() => getWinner(squares), [squares])
  const status = botThinking
    ? 'Bot is thinking...'
    : winner === 'draw'
      ? "It's a draw! 🤝"
      : winner === PLAYER
        ? 'You win! 🎉'
        : winner === BOT
          ? 'Bot wins! 🤖'
          : 'Your turn — click a square!'

  useEffect(() => {
    if (winner || isPlayerTurn) return
    const emptyCount = squares.filter((s) => s === null).length
    if (emptyCount === 0) return

    setBotThinking(true)
    const timer = setTimeout(() => {
      const move = getBotMove(squares)
      if (move >= 0) {
        const next = [...squares]
        next[move] = BOT
        setSquares(next)
        setIsPlayerTurn(true)
      }
      setBotThinking(false)
    }, 80)

    return () => clearTimeout(timer)
  }, [squares, isPlayerTurn, winner])

  function handleClick(i: number) {
    if (squares[i] || winner || !isPlayerTurn || botThinking) return
    const next = [...squares]
    next[i] = PLAYER
    setSquares(next)
    setIsPlayerTurn(false)
  }

  function handlePlayAgain() {
    setSquares(Array(SIZE).fill(null))
    setIsPlayerTurn(true)
    setBotThinking(false)
  }

  return (
    <div className="tictactoe">
      <button type="button" className="tictactoe-back" onClick={onBack}>
        ← Back to games
      </button>
      <h2 className="tictactoe-title">⭕ 5 in a row (6×6)</h2>
      <p className="tictactoe-vs">You (X) vs Bot (O) — get 5 in a row to win!</p>
      <p className="tictactoe-status">{status}</p>
      <div className="tictactoe-board tictactoe-board--6x6">
        {squares.map((value, i) => (
          <button
            key={i}
            type="button"
            className={`tictactoe-cell ${value ? `tictactoe-cell--${value}` : ''}`}
            onClick={() => handleClick(i)}
            disabled={!!value || !!winner || !isPlayerTurn || botThinking}
            aria-label={value ? `Cell ${i + 1}: ${value}` : `Cell ${i + 1}: empty`}
          >
            {value}
          </button>
        ))}
      </div>
      {(winner === 'draw' || winner) && (
        <button type="button" className="tictactoe-again" onClick={handlePlayAgain}>
          Play again
        </button>
      )}
    </div>
  )
}
