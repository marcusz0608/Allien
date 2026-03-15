import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import heroImg from './assets/hero.png'
import { TicTacToe } from './components/TicTacToe'
import { MemoryMatch } from './components/MemoryMatch'
import { Quiz } from './components/Quiz'
import { getLevelQuestions } from './math/source'
import type { MathQuestion, MathGradeId } from './math/types'
import './App.css'

type ActiveGame = 'tictactoe' | 'memory' | 'quiz' | 'mathLevel' | null

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [navOpen, setNavOpen] = useState(false)
  const [activeGame, setActiveGame] = useState<ActiveGame>(null)
  const [mathQuestionOpen, setMathQuestionOpen] = useState(false)
  const [mathGrade, setMathGrade] = useState<MathGradeId | null>(null)
  const [mathMaxLevel, setMathMaxLevel] = useState<number>(1)
  const [mathSelectedLevel, setMathSelectedLevel] = useState<number | null>(null)
  const [mathQuestions, setMathQuestions] = useState<MathQuestion[] | null>(null)
  const [mathIndex, setMathIndex] = useState(0)
  const [mathSelectedOption, setMathSelectedOption] = useState<number | null>(null)
  const [mathShowAnswer, setMathShowAnswer] = useState(false)
  const [mathScore, setMathScore] = useState(0)
  const [mathFinished, setMathFinished] = useState(false)
  const [mathSelectedWorld, setMathSelectedWorld] = useState<string | null>(null)

  useEffect(() => {
    const savedGrade = window.localStorage.getItem('allien-math-grade') as MathGradeId | null
    const savedAt = window.localStorage.getItem('allien-math-grade-answered-at')
    const savedLevel = window.localStorage.getItem('allien-math-max-level')
    const answeredAt = savedAt ? Number(savedAt) : NaN
    const SIX_MONTHS = 1000 * 60 * 60 * 24 * 30 * 6
    if (savedGrade && Number.isFinite(answeredAt) && Date.now() - answeredAt < SIX_MONTHS) {
      setMathGrade(savedGrade)
      setMathQuestionOpen(false)
    } else {
      // Default to K–2 for now because that is the only grade
      // with a fully implemented level.
      setMathGrade('K–2')
      setMathQuestionOpen(false)
    }
    if (savedLevel) {
      const level = Number(savedLevel)
      if (Number.isFinite(level) && level >= 1 && level <= 25) {
        setMathMaxLevel(level)
      }
    }
  }, [])

  function handleMathOpen() {
    setMathQuestionOpen(true)
  }

  function handleSelectMathGrade(label: MathGradeId) {
    setMathGrade(label)
    setMathQuestionOpen(false)
    setMathMaxLevel(1)
    setMathSelectedLevel(1)
    setMathIndex(0)
    setMathSelectedOption(null)
    setMathShowAnswer(false)
    setMathScore(0)
    setMathFinished(false)
    window.localStorage.setItem('allien-math-grade', label)
    window.localStorage.setItem('allien-math-grade-answered-at', String(Date.now()))
    window.localStorage.setItem('allien-math-max-level', '1')
  }

  async function handleStartMathLevel() {
    if (!mathGrade || !mathSelectedLevel) return
    const { questions } = await getLevelQuestions(mathGrade, mathSelectedLevel)
    setMathQuestions(questions)
    setMathIndex(0)
    setMathSelectedOption(null)
    setMathShowAnswer(false)
    setMathScore(0)
    setMathFinished(false)
    setActiveGame('mathLevel')
  }

  function handleMathCheckAnswer() {
    if (mathSelectedOption == null || !mathQuestions || mathQuestions.length === 0) return
    if (!mathShowAnswer) {
      const current = mathQuestions[mathIndex]
      if (mathSelectedOption === current.answerIndex) {
        setMathScore((s) => s + 1)
      }
      setMathShowAnswer(true)
    } else {
      const isLast = mathIndex === mathQuestions.length - 1
      if (isLast) {
        setMathFinished(true)
        if (mathMaxLevel < 2) {
          setMathMaxLevel(2)
          window.localStorage.setItem('allien-math-max-level', '2')
        }
      } else {
        setMathIndex((i) => i + 1)
        setMathSelectedOption(null)
        setMathShowAnswer(false)
      }
    }
  }

  function handleExitMathLevel() {
    setActiveGame(null)
    setMathQuestions(null)
    setMathIndex(0)
    setMathSelectedOption(null)
    setMathShowAnswer(false)
    setMathFinished(false)
  }

  const isNavItemActive = (path: string) => location.pathname === path && !activeGame

  return (
    <div className="allien-app">
      <header className="nav-header">
        <a
          href="/"
          className="nav-logo"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
            setActiveGame(null)
            setNavOpen(false)
          }}
        >
          <img src={heroImg} className="nav-logo-img" width="36" height="38" alt="" />
          <span className="nav-logo-text">Allien</span>
        </a>
        <button
          type="button"
          className="nav-hamburger"
          onClick={() => setNavOpen((o) => !o)}
          aria-label="Menu"
        >
          <span className="nav-hamburger-bar" />
          <span className="nav-hamburger-bar" />
          <span className="nav-hamburger-bar" />
        </button>
        <nav className={`nav-bar ${navOpen ? 'nav-bar--open' : ''}`}>
          <button
            type="button"
            className={`nav-link ${isNavItemActive('/') ? 'nav-link--active' : ''}`}
            onClick={() => {
              navigate('/')
              setActiveGame(null)
              setNavOpen(false)
            }}
          >
            Home
          </button>
          <button
            type="button"
            className={`nav-link ${isNavItemActive('/games') ? 'nav-link--active' : ''}`}
            onClick={() => {
              navigate('/games')
              setActiveGame(null)
              setNavOpen(false)
            }}
          >
            Games
          </button>
          <button
            type="button"
            className={`nav-link ${isNavItemActive('/quizzes') ? 'nav-link--active' : ''}`}
            onClick={() => {
              navigate('/quizzes')
              setActiveGame(null)
              setNavOpen(false)
            }}
          >
            Quizzes
          </button>
          <button
            type="button"
            className={`nav-link ${isNavItemActive('/ai') ? 'nav-link--active' : ''}`}
            onClick={() => {
              navigate('/ai')
              setActiveGame(null)
              setNavOpen(false)
            }}
          >
            AI
          </button>
          <button
            type="button"
            className={`nav-link ${isNavItemActive('/search') ? 'nav-link--active' : ''}`}
            onClick={() => {
              navigate('/search')
              setActiveGame(null)
              setNavOpen(false)
            }}
          >
            Search
          </button>
          <button
            type="button"
            className={`nav-link ${isNavItemActive('/math') ? 'nav-link--active' : ''}`}
            onClick={() => {
              navigate('/math')
              setActiveGame(null)
              setNavOpen(false)
            }}
          >
            Math Lab
          </button>
        </nav>
      </header>

      {mathQuestionOpen && (
        <div className="math-modal-backdrop" onClick={() => setMathQuestionOpen(false)}>
          <div className="math-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="math-modal-title">➗ Math Lab</h2>
            <p className="math-modal-text">What grade are you in?</p>
            <div className="math-grades">
              <button type="button" className="math-grade" onClick={() => handleSelectMathGrade('K–2')}>K–2</button>
              <button type="button" className="math-grade" onClick={() => handleSelectMathGrade('3–5')}>3–5</button>
              <button type="button" className="math-grade" onClick={() => handleSelectMathGrade('6–8')}>6–8</button>
              <button type="button" className="math-grade" onClick={() => handleSelectMathGrade('9–12')}>9–12</button>
            </div>
            <button type="button" className="math-modal-close" onClick={() => setMathQuestionOpen(false)}>Close</button>
          </div>
        </div>
      )}

      <main className="main">
        {activeGame === 'mathLevel' && mathGrade && mathSelectedLevel != null && mathQuestions && (
          <section className="math-level-screen">
            <button type="button" className="tictactoe-back" onClick={handleExitMathLevel}>← Back to Math Lab</button>
            <h2 className="math-level-title">➗ Math Lab</h2>
            <p className="math-level-subtitle">Grade {mathGrade} · Level {mathSelectedLevel}</p>
            {mathQuestions.length > 0 ? (
              <>
                {!mathFinished ? (
                  <>
                    <p className="math-intro math-intro-detail">
                      Read the problem and choose the best answer.
                    </p>
                    <p className="quiz-progress">
                      Question {mathIndex + 1} of {mathQuestions.length}
                    </p>
                    <div className="quiz-question">
                      {mathQuestions[mathIndex].prompt}
                    </div>
                    <div className="quiz-options">
                      {mathQuestions[mathIndex].options.map((opt, idx) => {
                        const isSelected = idx === mathSelectedOption
                        const isCorrect = idx === mathQuestions[mathIndex].answerIndex
                        let extraClass = ''
                        if (mathShowAnswer) {
                          if (isCorrect) extraClass = ' quiz-option--correct'
                          else if (isSelected && !isCorrect) extraClass = ' quiz-option--wrong'
                        } else if (isSelected) {
                          extraClass = ' quiz-option--selected'
                        }
                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`quiz-option${extraClass}`}
                            onClick={() => !mathShowAnswer && setMathSelectedOption(idx)}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                    <button
                      type="button"
                      className="tictactoe-back"
                      disabled={mathSelectedOption == null}
                      onClick={handleMathCheckAnswer}
                    >
                      {mathShowAnswer
                        ? mathIndex === mathQuestions.length - 1
                          ? 'Finish level'
                          : 'Next question'
                        : 'Check answer'}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="math-intro math-intro-detail">
                      Great job! You answered {mathScore} out of {mathQuestions.length} questions correctly.
                    </p>
                  </>
                )}
              </>
            ) : (
              <p className="math-intro math-intro-detail">
                This level is coming soon. Try a different world for now.
              </p>
            )}
          </section>
        )}
        {activeGame === 'tictactoe' && <TicTacToe onBack={() => setActiveGame(null)} />}
        {activeGame === 'memory' && <MemoryMatch onBack={() => setActiveGame(null)} />}
        {activeGame === 'quiz' && <Quiz onBack={() => setActiveGame(null)} />}

        {!activeGame && location.pathname === '/' && (
          <section className="intro-section">
            <img src={heroImg} className="hero-mascot" width="100" height="105" alt="Allien mascot" />
            <h1 className="intro-title">Allien</h1>
            <p className="intro-tagline">Learn, play, and explore — all in one place!</p>
            <p className="intro-desc">Use the menu above to open Games, Quizzes, AI, Search, or Math Lab.</p>
          </section>
        )}

        {!activeGame && location.pathname === '/games' && (
          <section className="games-section games-section--page">
            <h2 className="section-title">🎮 Games Library</h2>
            <div className="game-links">
              <a href="https://www.crazygames.com/" target="_blank" rel="noopener noreferrer" className="game-link game-link-crazy">
                <span className="game-link-emoji">🕹️</span>
                <span className="game-link-name">CrazyGames</span>
                <span className="game-link-desc">Thousands of free online games — action, puzzle, sports & more!</span>
              </a>
              <a href="https://pbskids.org/wildkratts/games/" target="_blank" rel="noopener noreferrer" className="game-link game-link-crazy">
                <span className="game-link-emoji">🦁</span>
                <span className="game-link-name">Wild Kratts</span>
                <span className="game-link-desc">Animal adventure games from the Wild Kratts show.</span>
              </a>
              <a href="https://www.minecraft.net/" target="_blank" rel="noopener noreferrer" className="game-link game-link-crazy">
                <span className="game-link-emoji">⛏️</span>
                <span className="game-link-name">Minecraft</span>
                <span className="game-link-desc">Build, explore, and survive in blocky worlds.</span>
              </a>
              <button type="button" className="game-link game-link-play" onClick={() => setActiveGame('memory')}>
                <span className="game-link-emoji">🧩</span>
                <span className="game-link-name">Memory match</span>
                <span className="game-link-desc">Play now</span>
              </button>
              <button type="button" className="game-link game-link-play" onClick={() => setActiveGame('tictactoe')}>
                <span className="game-link-emoji">⭕</span>
                <span className="game-link-name">Tic-tac-toe</span>
                <span className="game-link-desc">Play now</span>
              </button>
            </div>
          </section>
        )}

        {!activeGame && location.pathname === '/quizzes' && (
          <section className="quizzes-page">
            <Quiz onBack={() => {}} hideBack />
          </section>
        )}

        {!activeGame && location.pathname === '/ai' && (
          <section className="games-section games-section--page">
            <h2 className="section-title">🤖 Allien AI Assistant</h2>
            <p className="math-intro">Coming soon — ask questions and get help learning new things!</p>
          </section>
        )}

        {!activeGame && location.pathname === '/search' && (
          <section className="games-section games-section--page">
            <h2 className="section-title">🔍 Allien Search</h2>
            <p className="math-intro">Coming soon — find games, quizzes, and help topics super fast.</p>
          </section>
        )}

        {!activeGame && location.pathname === '/math' && (
          <section id="math" className="games-section games-section--page">
            <h2 className="section-title">➗ Math Lab</h2>
            {mathGrade ? (
              <>
                <p className="math-intro">
                  Math Lab is set to grade {mathGrade}. Pick a world to start your math adventure.
                </p>
                {mathGrade !== 'K–2' && (
                  <p className="math-intro math-intro-detail">
                    Right now only grade K–2, Level 1 has practice questions. Other grades are coming soon.
                  </p>
                )}
                <div className="math-grades" style={{ marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    className="math-grade"
                    onClick={handleMathOpen}
                  >
                    Change grade
                  </button>
                </div>
                <div className="math-worlds">
                  {mathGrade === 'K–2' && (
                    <>
                      <button
                        type="button"
                        className={`math-world-card${mathSelectedWorld === 'k2-world-1' ? ' math-world-card--selected' : ''}`}
                        onClick={() => {
                          setMathSelectedWorld('k2-world-1')
                          setMathSelectedLevel(1)
                        }}
                      >
                        <div className="math-world-emoji">🌲</div>
                        <div className="math-world-title">Number Forest</div>
                        <div className="math-world-desc">Story problems with adding and subtracting small numbers.</div>
                        <div className="math-world-tag">Grade K–2 · Missions 1–3</div>
                      </button>
                      <button
                        type="button"
                        className="math-world-card math-world-card--locked"
                        disabled
                      >
                        <div className="math-world-emoji">⛰️</div>
                        <div className="math-world-title">Minus Mountain</div>
                        <div className="math-world-desc">More practice with take-away problems and number lines.</div>
                        <div className="math-world-tag">Coming soon</div>
                      </button>
                      <button
                        type="button"
                        className="math-world-card math-world-card--locked"
                        disabled
                      >
                        <div className="math-world-emoji">🧩</div>
                        <div className="math-world-title">Puzzle Lake</div>
                        <div className="math-world-desc">Kangaroo-style puzzles where you think before you count.</div>
                        <div className="math-world-tag">Coming soon</div>
                      </button>
                    </>
                  )}
                  {mathGrade === '3–5' && (
                    <>
                      <button
                        type="button"
                        className={`math-world-card${mathSelectedWorld === 'g3-5-world-1' ? ' math-world-card--selected' : ''}`}
                        onClick={() => {
                          setMathSelectedWorld('g3-5-world-1')
                          setMathSelectedLevel(1)
                        }}
                      >
                        <div className="math-world-emoji">🏙️</div>
                        <div className="math-world-title">Times Table City</div>
                        <div className="math-world-desc">Practice multiplication with ×2, ×5, and ×10.</div>
                        <div className="math-world-tag">Grade 3–5 · Missions 1–3</div>
                      </button>
                    </>
                  )}
                </div>
                {mathSelectedWorld && (
                  <div className="math-world-actions">
                    <p className="math-intro math-intro-detail">
                      Start your first mission in this world. We&apos;ll add more missions next.
                    </p>
                    <button type="button" className="math-start-level" onClick={handleStartMathLevel}>
                      Start mission
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="math-intro">Choose your grade to start. You&apos;ll get 25 levels per grade.</p>
                <button type="button" className="math-start-level" onClick={handleMathOpen}>Choose your grade</button>
              </>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Made with 💜 by an 8-year-old coder. Dream big, code bigger!</p>
      </footer>
    </div>
  )
}

export default App
