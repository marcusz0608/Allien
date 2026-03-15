import { useState } from 'react'
import heroImg from './assets/hero.png'
import { TicTacToe } from './components/TicTacToe'
import './App.css'

function App() {
  const [activeGame, setActiveGame] = useState<null | 'tictactoe'>(null)

  return (
    <div className="allien-app">
      <header className="header">
        <img src={heroImg} className="hero-mascot" width="120" height="126" alt="Allien mascot" />
        <h1>Allien</h1>
        <p className="tagline">Learn, play, and explore — all in one place!</p>
      </header>

      <main className="main">
        {activeGame === 'tictactoe' ? (
          <TicTacToe onBack={() => setActiveGame(null)} />
        ) : (
          <>
        <section className="cards">
          <a href="#games" className="card card-games">
            <span className="card-emoji">🎮</span>
            <h2>Games Library</h2>
            <p>CrazyGames, memory match, tic-tac-toe, and more!</p>
          </a>

          <a href="#quizzes" className="card card-quizzes">
            <span className="card-emoji">🧠</span>
            <h2>Quizzes</h2>
            <p>Test what you know with cool multiple-choice questions.</p>
          </a>

          <a href="#ai" className="card card-ai">
            <span className="card-emoji">🤖</span>
            <h2>Allien AI Assistant</h2>
            <p>Ask questions and get help learning new things!</p>
          </a>

          <a href="#search" className="card card-search">
            <span className="card-emoji">🔍</span>
            <h2>Allien Search</h2>
            <p>Find games, quizzes, and help topics super fast.</p>
          </a>
        </section>

        <section id="games" className="games-section">
          <h2 className="section-title">🎮 Games Library</h2>
          <div className="game-links">
            <a
              href="https://www.crazygames.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="game-link game-link-crazy"
            >
              <span className="game-link-emoji">🕹️</span>
              <span className="game-link-name">CrazyGames</span>
              <span className="game-link-desc">Thousands of free online games — action, puzzle, sports & more!</span>
            </a>
            <div className="game-link game-link-soon">
              <span className="game-link-emoji">🧩</span>
              <span className="game-link-name">Memory match</span>
              <span className="game-link-desc">Coming soon</span>
            </div>
            <button
              type="button"
              className="game-link game-link-play"
              onClick={() => setActiveGame('tictactoe')}
            >
              <span className="game-link-emoji">⭕</span>
              <span className="game-link-name">Tic-tac-toe</span>
              <span className="game-link-desc">Play now</span>
            </button>
          </div>
        </section>
          </>
        )}
      </main>

      <footer className="footer">
        <p>Made with 💜 by an 8-year-old coder. Dream big, code bigger!</p>
      </footer>
    </div>
  )
}

export default App
