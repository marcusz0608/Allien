import { useEffect, useRef, useState } from 'react'

type Question = {
  prompt: string
  options: string[]
  answerIndex: number
}

// Big question bank — we pick 25 random ones each game
const QUESTION_BANK: Question[] = [
  {
    prompt: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Neptune'],
    answerIndex: 1,
  },
  {
    prompt: 'What do plants need to make their own food?',
    options: ['Starlight', 'Moon dust', 'Sunlight, water, and air', 'Only water'],
    answerIndex: 2,
  },
  {
    prompt: 'Which animal is the largest on Earth?',
    options: ['Elephant', 'Blue whale', 'Giraffe', 'Giant squid'],
    answerIndex: 1,
  },
  {
    prompt: 'How many sides does a hexagon have?',
    options: ['4', '5', '6', '8'],
    answerIndex: 2,
  },
  {
    prompt: 'What do we call a baby frog?',
    options: ['Puppy', 'Tadpole', 'Calf', 'Kitten'],
    answerIndex: 1,
  },
  {
    prompt: 'What is H2O also called?',
    options: ['Oxygen', 'Hydrogen', 'Water', 'Salt'],
    answerIndex: 2,
  },
  {
    prompt: 'Which continent do lions live on in the wild most often?',
    options: ['Europe', 'Africa', 'Australia', 'Antarctica'],
    answerIndex: 1,
  },
  {
    prompt: 'How many minutes are in one hour?',
    options: ['30', '45', '60', '90'],
    answerIndex: 2,
  },
  {
    prompt: 'What gas do humans need to breathe to stay alive?',
    options: ['Carbon dioxide', 'Oxygen', 'Helium', 'Nitrogen'],
    answerIndex: 1,
  },
  {
    prompt: 'Which instrument has black and white keys?',
    options: ['Guitar', 'Piano', 'Drum', 'Trumpet'],
    answerIndex: 1,
  },
  {
    prompt: 'Which ocean is the largest on Earth?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
    answerIndex: 2,
  },
  {
    prompt: 'In coding, what do we call a mistake in the program?',
    options: ['Bug', 'Cat', 'Star', 'Cloud'],
    answerIndex: 0,
  },
  {
    prompt: 'Which bird cannot fly but can run very fast?',
    options: ['Owl', 'Parrot', 'Ostrich', 'Eagle'],
    answerIndex: 2,
  },
  {
    prompt: 'Which shape has four equal sides and four right angles?',
    options: ['Triangle', 'Rectangle', 'Square', 'Circle'],
    answerIndex: 2,
  },
  {
    prompt: 'What do bees collect from flowers to make honey?',
    options: ['Sand', 'Pollen and nectar', 'Leaves', 'Rain'],
    answerIndex: 1,
  },
  {
    prompt: 'Which hero wears a red cape and has a big “S” on their chest?',
    options: ['Batman', 'Superman', 'Spider-Man', 'Hulk'],
    answerIndex: 1,
  },
  {
    prompt: 'Which animal can change its color to match its surroundings?',
    options: ['Dog', 'Chameleon', 'Horse', 'Penguin'],
    answerIndex: 1,
  },
  {
    prompt: 'How many days are in one week?',
    options: ['5', '6', '7', '8'],
    answerIndex: 2,
  },
  {
    prompt: 'What is the name of our galaxy?',
    options: ['Andromeda', 'Milky Way', 'Whirlpool', 'Cartwheel'],
    answerIndex: 1,
  },
  {
    prompt: 'Which sense do we use our ears for?',
    options: ['Smell', 'Taste', 'Hearing', 'Touch'],
    answerIndex: 2,
  },
  {
    prompt: 'Which sport is played with a bat and a ball and has bases?',
    options: ['Soccer', 'Basketball', 'Baseball', 'Tennis'],
    answerIndex: 2,
  },
  {
    prompt: 'What do you call frozen water?',
    options: ['Steam', 'Ice', 'Rain', 'Cloud'],
    answerIndex: 1,
  },
  {
    prompt: 'Which part of the plant is usually underground?',
    options: ['Leaves', 'Roots', 'Flower', 'Fruit'],
    answerIndex: 1,
  },
  {
    prompt: 'Which animal is known for building dams in rivers?',
    options: ['Beaver', 'Tiger', 'Shark', 'Eagle'],
    answerIndex: 0,
  },
  {
    prompt: 'What do we call the force that pulls things toward Earth?',
    options: ['Magic', 'Electricity', 'Gravity', 'Friction'],
    answerIndex: 2,
  },
  {
    prompt: 'What is 7 + 5?',
    options: ['10', '11', '12', '13'],
    answerIndex: 2,
  },
  {
    prompt: 'What is 15 − 9?',
    options: ['4', '5', '6', '7'],
    answerIndex: 2,
  },
  {
    prompt: 'Which fraction is the same as one half?',
    options: ['2/4', '1/3', '3/4', '2/3'],
    answerIndex: 0,
  },
  {
    prompt: 'What is the value of 3 × 4?',
    options: ['7', '9', '10', '12'],
    answerIndex: 3,
  },
  {
    prompt: 'A triangle has angles 90°, 30°, and ? to make 180°. What is the missing angle?',
    options: ['30°', '45°', '60°', '90°'],
    answerIndex: 2,
  },
  {
    prompt: 'What is the perimeter of a square with side length 5?',
    options: ['10', '15', '20', '25'],
    answerIndex: 2,
  },
  {
    prompt: 'Which number is prime?',
    options: ['9', '10', '11', '12'],
    answerIndex: 2,
  },
  {
    prompt: 'What is 3/4 written as a decimal?',
    options: ['0.25', '0.5', '0.75', '1.25'],
    answerIndex: 2,
  },
  {
    prompt: 'Which unit would you use to measure the length of a pencil?',
    options: ['Kilometers', 'Meters', 'Centimeters', 'Miles'],
    answerIndex: 2,
  },
  {
    prompt: 'A day has 24 hours. How many hours are in 2 days?',
    options: ['12', '24', '36', '48'],
    answerIndex: 3,
  },
  {
    prompt: 'Which shape has exactly three sides?',
    options: ['Circle', 'Square', 'Triangle', 'Pentagon'],
    answerIndex: 2,
  },
  {
    prompt: 'What is 9 × 6?',
    options: ['42', '48', '52', '54'],
    answerIndex: 3,
  },
  {
    prompt: 'Which number is closest to 100?',
    options: ['87', '93', '76', '64'],
    answerIndex: 1,
  },
  {
    prompt: 'If you have 3 quarters, how many cents do you have?',
    options: ['50', '60', '75', '90'],
    answerIndex: 2,
  },
  {
    prompt: 'What is the mean (average) of 4, 6, and 10?',
    options: ['6', '7', '8', '9'],
    answerIndex: 1,
  },
  // Riddle-style questions
  {
    prompt: 'I am an odd number. Take away one letter and I become even. What number am I?',
    options: ['Seven', 'Nine', 'Eleven', 'Thirteen'],
    answerIndex: 0,
  },
  {
    prompt: 'What has hands but cannot clap?',
    options: ['Robot', 'Clock', 'Statue', 'Tree'],
    answerIndex: 1,
  },
  {
    prompt: 'What gets wetter the more it dries?',
    options: ['Towel', 'Raincoat', 'Sponge', 'Cloud'],
    answerIndex: 0,
  },
  {
    prompt: 'I speak without a mouth and hear without ears. What am I?',
    options: ['Radio', 'Echo', 'Wind', 'Shadow'],
    answerIndex: 1,
  },
  {
    prompt: 'What has a face and two hands but no arms or legs?',
    options: ['Robot', 'Clock', 'Mirror', 'Coin'],
    answerIndex: 1,
  },
]

function createQuiz(): Question[] {
  const pool = [...QUESTION_BANK]
  // Fisher–Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  // Always use 25 questions (or fewer if bank is smaller)
  return pool.slice(0, 25)
}

interface QuizProps {
  onBack: () => void
  hideBack?: boolean
}

export function Quiz({ onBack, hideBack }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>(() => createQuiz())
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [disabledOptions, setDisabledOptions] = useState<number[]>([])
  const [zoomOn, setZoomOn] = useState(false)
  const [penOn, setPenOn] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawing = useRef(false)

  const question = questions[index]
  const total = questions.length
  const finished = index >= total

  function handleOptionClick(i: number) {
    if (showAnswer || finished) return
    setSelected(i)
  }

  function handleCheckAnswer() {
    if (selected == null || showAnswer || finished) return
    if (selected === question.answerIndex) {
      setScore((s) => s + 1)
    }
    setShowAnswer(true)
  }

  function handleNext() {
    if (!showAnswer) return
    const nextIndex = index + 1
    setIndex(nextIndex)
    setSelected(null)
    setShowAnswer(false)
    setDisabledOptions([])
  }

  function handlePlayAgain() {
    setQuestions(createQuiz())
    setIndex(0)
    setScore(0)
    setSelected(null)
    setShowAnswer(false)
    setDisabledOptions([])
  }

  function handleHint() {
    if (showAnswer || finished || !question) return
    const candidates = question.options
      .map((_, i) => i)
      .filter((i) => i !== question.answerIndex && !disabledOptions.includes(i))
    if (candidates.length === 0) return
    const removeIndex = candidates[Math.floor(Math.random() * candidates.length)]
    setDisabledOptions((prev) => [...prev, removeIndex])
    if (selected === removeIndex) {
      setSelected(null)
    }
  }

  function handleReadQuestion() {
    if (!question || typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const text = `${question.prompt}. Options: ${question.options.join(', ')}`
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }, [penOn])

  function handleCanvasPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!penOn) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawing.current = true
    ctx.strokeStyle = '#a78bfa'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  function handleCanvasPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!penOn || !drawing.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  function handleCanvasPointerUp() {
    drawing.current = false
  }

  if (finished) {
    return (
      <div className="quiz">
        {!hideBack && (
          <button type="button" className="tictactoe-back" onClick={onBack}>
            ← Back to home
          </button>
        )}
        <h2 className="quiz-title">🧠 Quiz complete!</h2>
        <p className="quiz-status">
          You scored {score} out of {total}.
        </p>
        <button type="button" className="tictactoe-again" onClick={handlePlayAgain}>
          Play again
        </button>
      </div>
    )
  }

  return (
    <div className={`quiz${zoomOn ? ' quiz--zoom' : ''}`}>
      {!hideBack && (
        <button type="button" className="tictactoe-back" onClick={onBack}>
          ← Back to home
        </button>
      )}
      <h2 className="quiz-title">🧠 Quiz time</h2>
      <p className="quiz-progress">
        Question {index + 1} of {total}
      </p>
      <p className="quiz-question">{question.prompt}</p>
      <div className="quiz-tools">
        <button
          type="button"
          className={`quiz-tool ${zoomOn ? 'quiz-tool--active' : ''}`}
          onClick={() => setZoomOn((z) => !z)}
        >
          🔍 Zoom
        </button>
        <button
          type="button"
          className={`quiz-tool ${penOn ? 'quiz-tool--active' : ''}`}
          onClick={() => setPenOn((p) => !p)}
        >
          🖊️ Pen
        </button>
        <button type="button" className="quiz-tool" onClick={handleHint}>
          💡 Hint
        </button>
        <button type="button" className="quiz-tool" onClick={handleReadQuestion}>
          🔊 Read
        </button>
      </div>
      <div className="quiz-options">
        {question.options.map((option, i) => {
          const isSelected = selected === i
          const isCorrect = showAnswer && i === question.answerIndex
          const isWrong = showAnswer && isSelected && i !== question.answerIndex
          const isDisabled = disabledOptions.includes(i)
          return (
            <button
              key={option}
              type="button"
              className={`quiz-option${isSelected ? ' quiz-option--selected' : ''}${
                isCorrect ? ' quiz-option--correct' : ''
              }${isWrong ? ' quiz-option--wrong' : ''}${isDisabled ? ' quiz-option--disabled' : ''}`}
              onClick={() => handleOptionClick(i)}
              disabled={showAnswer || isDisabled}
            >
              {option}
            </button>
          )
        })}
      </div>
      <div className="quiz-actions">
        {!showAnswer && (
          <button
            type="button"
            className="quiz-check"
            onClick={handleCheckAnswer}
            disabled={selected == null}
          >
            Check answer
          </button>
        )}
        {showAnswer && (
          <button type="button" className="quiz-next" onClick={handleNext}>
            Next question
          </button>
        )}
      </div>
      {penOn && (
        <div className="quiz-notes">
          <p className="quiz-notes-label">Scratch pad</p>
          <canvas
            ref={canvasRef}
            className="quiz-canvas"
            width={500}
            height={160}
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handleCanvasPointerMove}
            onPointerUp={handleCanvasPointerUp}
            onPointerLeave={handleCanvasPointerUp}
          />
        </div>
      )}
    </div>
  )
}

