import { useEffect, useMemo, useState } from 'react'

type Card = {
  id: number
  symbol: string
  matched: boolean
}

const SYMBOLS = ['🌙', '⭐', '🚀', '🪐', '👾', '☄️']

function createShuffledDeck(): Card[] {
  const deck: Card[] = []
  let id = 0
  for (const symbol of SYMBOLS) {
    deck.push({ id: id++, symbol, matched: false })
    deck.push({ id: id++, symbol, matched: false })
  }
  // Fisher–Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

interface MemoryMatchProps {
  onBack: () => void
}

export function MemoryMatch({ onBack }: MemoryMatchProps) {
  const [cards, setCards] = useState<Card[]>(() => createShuffledDeck())
  const [flipped, setFlipped] = useState<number[]>([])
  const [locked, setLocked] = useState(false)
  const [moves, setMoves] = useState(0)

  const allMatched = useMemo(
    () => cards.length > 0 && cards.every((c) => c.matched),
    [cards],
  )

  useEffect(() => {
    if (flipped.length !== 2) return
    const [firstId, secondId] = flipped
    const first = cards.find((c) => c.id === firstId)
    const second = cards.find((c) => c.id === secondId)
    if (!first || !second) return

    setLocked(true)
    const timer = setTimeout(() => {
      setCards((prev) =>
        prev.map((card) =>
          card.id === firstId || card.id === secondId
            ? { ...card, matched: card.matched || first.symbol === second.symbol }
            : card,
        ),
      )
      setFlipped([])
      setLocked(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [flipped, cards])

  function handleCardClick(card: Card) {
    if (locked || card.matched) return
    if (flipped.includes(card.id)) return
    if (flipped.length === 2) return

    setFlipped((prev) => [...prev, card.id])
    if (flipped.length === 1) {
      setMoves((m) => m + 1)
    }
  }

  function handlePlayAgain() {
    setCards(createShuffledDeck())
    setFlipped([])
    setLocked(false)
    setMoves(0)
  }

  return (
    <div className="memory">
      <button type="button" className="tictactoe-back" onClick={onBack}>
        ← Back to games
      </button>
      <h2 className="memory-title">🧩 Memory Match</h2>
      <p className="memory-subtitle">Flip two cards. Remember where the pairs are!</p>
      <p className="memory-status">
        {allMatched ? `Nice! You found all pairs in ${moves} moves.` : `Moves: ${moves}`}
      </p>
      <div className="memory-grid">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || card.matched
          return (
            <button
              key={card.id}
              type="button"
              className={`memory-card ${isFlipped ? 'memory-card--flipped' : ''} ${
                card.matched ? 'memory-card--matched' : ''
              }`}
              onClick={() => handleCardClick(card)}
              disabled={locked || card.matched}
              aria-label={isFlipped ? card.symbol : 'Hidden card'}
            >
              <span className="memory-card-inner">{isFlipped ? card.symbol : '❔'}</span>
            </button>
          )
        })}
      </div>
      {allMatched && (
        <button type="button" className="tictactoe-again" onClick={handlePlayAgain}>
          Play again
        </button>
      )}
    </div>
  )
}

