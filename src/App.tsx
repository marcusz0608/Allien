import { useEffect, useState } from 'react'
import heroImg from './assets/hero.png'
import { TicTacToe } from './components/TicTacToe'
import { MemoryMatch } from './components/MemoryMatch'
import { Quiz } from './components/Quiz'
import './App.css'

type ActiveGame = 'tictactoe' | 'memory' | 'quiz' | 'mathLevel' | null
type NavView = 'home' | 'games' | 'quizzes' | 'ai' | 'search' | 'math'

function App() {
  const [navView, setNavView] = useState<NavView>('home')
  const [navOpen, setNavOpen] = useState(false)
  const [activeGame, setActiveGame] = useState<ActiveGame>(null)
  const [mathQuestionOpen, setMathQuestionOpen] = useState(false)
  const [mathGrade, setMathGrade] = useState<string | null>(null)
  const [mathMaxLevel, setMathMaxLevel] = useState<number>(1)
  const [mathSelectedLevel, setMathSelectedLevel] = useState<number | null>(null)

  useEffect(() => {
    const savedGrade = window.localStorage.getItem('allien-math-grade')
    const savedAt = window.localStorage.getItem('allien-math-grade-answered-at')
    const savedLevel = window.localStorage.getItem('allien-math-max-level')
    if (!savedAt || !savedGrade) return
    const answeredAt = Number(savedAt)
    const SIX_MONTHS = 1000 * 60 * 60 * 24 * 30 * 6
    if (Number.isFinite(answeredAt) && Date.now() - answeredAt < SIX_MONTHS) {
      setMathGrade(savedGrade)
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

  function handleSelectMathGrade(label: string) {
    setMathGrade(label)
    setMathQuestionOpen(false)
    setMathMaxLevel(1)
    setMathSelectedLevel(1)
    window.localStorage.setItem('allien-math-grade', label)
    window.localStorage.setItem('allien-math-grade-answered-at', String(Date.now()))
    window.localStorage.setItem('allien-math-max-level', '1')
  }

  const isNavItemActive = (view: NavView) => navView === view && !activeGame

  return (
    <div className="allien-app">
      <header className="nav-header">
        <a href="/" className="nav-logo" onClick={(e) => { e.preventDefault(); setNavView('home'); setActiveGame(null); setNavOpen(false); }}>
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
          <button type="button" className={`nav-link ${isNavItemActive('home') ? 'nav-link--active' : ''}`} onClick={() => { setNavView('home'); setActiveGame(null); setNavOpen(false); }}>Home</button>
          <button type="button" className={`nav-link ${isNavItemActive('games') ? 'nav-link--active' : ''}`} onClick={() => { setNavView('games'); setActiveGame(null); setNavOpen(false); }}>Games</button>
          <button type="button" className={`nav-link ${isNavItemActive('quizzes') ? 'nav-link--active' : ''}`} onClick={() => { setNavView('quizzes'); setActiveGame(null); setNavOpen(false); }}>Quizzes</button>
          <button type="button" className={`nav-link ${isNavItemActive('ai') ? 'nav-link--active' : ''}`} onClick={() => { setNavView('ai'); setActiveGame(null); setNavOpen(false); }}>AI</button>
          <button type="button" className={`nav-link ${isNavItemActive('search') ? 'nav-link--active' : ''}`} onClick={() => { setNavView('search'); setActiveGame(null); setNavOpen(false); }}>Search</button>
          <button type="button" className={`nav-link ${isNavItemActive('math') ? 'nav-link--active' : ''}`} onClick={() => { setNavView('math'); setActiveGame(null); setNavOpen(false); }}>Math Lab</button>
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
        {activeGame === 'mathLevel' && mathGrade && mathSelectedLevel != null && (
          <section className="math-level-screen">
            <button type="button" className="tictactoe-back" onClick={() => setActiveGame(null)}>← Back to Math Lab</button>
            <h2 className="math-level-title">➗ Math Lab</h2>
            <p className="math-level-subtitle">Grade {mathGrade} · Level {mathSelectedLevel}</p>
            <p className="math-intro math-intro-detail">This is where the Level {mathSelectedLevel} math questions will live. For now, you&apos;ve successfully entered the level screen!</p>
          </section>
        )}
        {activeGame === 'tictactoe' && <TicTacToe onBack={() => setActiveGame(null)} />}
        {activeGame === 'memory' && <MemoryMatch onBack={() => setActiveGame(null)} />}
        {activeGame === 'quiz' && <Quiz onBack={() => setActiveGame(null)} />}

        {!activeGame && navView === 'home' && (
          <section className="intro-section">
            <img src={heroImg} className="hero-mascot" width="100" height="105" alt="Allien mascot" />
            <h1 className="intro-title">Allien</h1>
            <p className="intro-tagline">Learn, play, and explore — all in one place!</p>
            <p className="intro-desc">Use the menu above to open Games, Quizzes, AI, Search, or Math Lab.</p>
          </section>
        )}

        {!activeGame && navView === 'games' && (
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

        {!activeGame && navView === 'quizzes' && (
          <section className="quizzes-page">
            <Quiz onBack={() => {}} hideBack />
          </section>
        )}

        {!activeGame && navView === 'ai' && (
          <section className="games-section games-section--page">
            <h2 className="section-title">🤖 Allien AI Assistant</h2>
            <p className="math-intro">Coming soon — ask questions and get help learning new things!</p>
          </section>
        )}

        {!activeGame && navView === 'search' && (
          <section className="games-section games-section--page">
            <h2 className="section-title">🔍 Allien Search</h2>
            <p className="math-intro">Coming soon — find games, quizzes, and help topics super fast.</p>
          </section>
        )}

        {!activeGame && navView === 'math' && (
          <section id="math" className="games-section games-section--page">
            <h2 className="section-title">➗ Math Lab</h2>
            {mathGrade ? (
              <>
                <p className="math-intro">Math Lab is set to grade {mathGrade}. Pick a level to start — finish one level to unlock the next!</p>
                <div className="math-levels">
                  {Array.from({ length: 25 }, (_, i) => i + 1).map((level) => {
                    const locked = level > mathMaxLevel
                    const isSelected = level === mathSelectedLevel
                    return (
                      <button
                        key={level}
                        type="button"
                        className={`math-level${locked ? ' math-level--locked' : ''}${isSelected ? ' math-level--selected' : ''}`}
                        disabled={locked}
                        onClick={() => setMathSelectedLevel(level)}
                      >
                        {level}
                      </button>
                    )
                  })}
                </div>
                {mathSelectedLevel && (
                  <>
                    <p className="math-intro math-intro-detail">Level {mathSelectedLevel}: this level will focus on a different math skill. (Levels and questions coming next!)</p>
                    <button type="button" className="math-start-level" onClick={() => setActiveGame('mathLevel')}>Start Level {mathSelectedLevel}</button>
                  </>
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
