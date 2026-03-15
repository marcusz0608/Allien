import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import heroImg from './assets/hero.png'
import { TicTacToe } from './components/TicTacToe'
import { MemoryMatch } from './components/MemoryMatch'
import { Quiz } from './components/Quiz'
import { MathLabGame } from './components/MathLabGame'
import { getLevelQuestions } from './math/source'
import type { MathQuestion, MathGradeId } from './math/types'
import { TOTAL_MATH_LEVELS } from './math/types'
import { searchSite, type SearchItem } from './searchIndex'
import {
  fetchWikipediaSummary,
  looksLikeFactualQuestion,
  getSearchQueryFromMessage,
} from './aiWikipedia'
import { getChatGPTReply } from './aiChatGPT'
import { getGeminiReply } from './aiGemini'
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
  const [mathGameMode, setMathGameMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchResults = searchQuery.trim() ? searchSite(searchQuery) : []
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Hi! I'm the Allien AI assistant. Ask me anything — about math, your homework, games, or something you're curious about!" },
  ])
  const [aiInput, setAiInput] = useState('')
  const aiMessagesEndRef = useRef<HTMLUListElement>(null)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    const el = aiMessagesEndRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [aiMessages, aiLoading])

  useEffect(() => {
    const savedGrade = window.localStorage.getItem('allien-math-grade') as MathGradeId | null
    const savedAt = window.localStorage.getItem('allien-math-grade-answered-at')
    const answeredAt = savedAt ? Number(savedAt) : NaN
    const SIX_MONTHS = 1000 * 60 * 60 * 24 * 30 * 6
    const grade = savedGrade && Number.isFinite(answeredAt) && Date.now() - answeredAt < SIX_MONTHS
      ? savedGrade
      : 'K–2'
    setMathGrade(grade)
    setMathSelectedWorld(grade === 'K–2' ? 'k2-world-1' : grade === '3–5' ? 'g3-5-world-1' : grade === '6–8' ? 'g6-8-world-1' : 'g9-12-world-1')
    setMathQuestionOpen(false)
    const savedLevel = window.localStorage.getItem(`allien-math-max-level-${grade}`)
      ?? window.localStorage.getItem('allien-math-max-level')
    if (savedLevel) {
      const level = Number(savedLevel)
      if (Number.isFinite(level) && level >= 1 && level <= TOTAL_MATH_LEVELS) {
        setMathMaxLevel(level)
      }
    }
  }, [])

  function handleMathOpen() {
    setMathQuestionOpen(true)
  }

  const defaultWorldByGrade: Record<MathGradeId, string> = {
    'K–2': 'k2-world-1',
    '3–5': 'g3-5-world-1',
    '6–8': 'g6-8-world-1',
    '9–12': 'g9-12-world-1',
  }

  function handleSelectMathGrade(label: MathGradeId) {
    setMathGrade(label)
    setMathQuestionOpen(false)
    setMathSelectedWorld(defaultWorldByGrade[label])
    const saved = window.localStorage.getItem(`allien-math-max-level-${label}`)
    const max = saved && Number.isFinite(Number(saved))
      ? Math.min(Number(saved), TOTAL_MATH_LEVELS)
      : 1
    setMathMaxLevel(max)
    setMathSelectedLevel(1)
    setMathIndex(0)
    setMathSelectedOption(null)
    setMathShowAnswer(false)
    setMathScore(0)
    setMathFinished(false)
    window.localStorage.setItem('allien-math-grade', label)
    window.localStorage.setItem('allien-math-grade-answered-at', String(Date.now()))
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
    setMathGameMode(questions.length >= 3)
    setActiveGame('mathLevel')
  }

  function handleMathGameComplete(energy: number) {
    setMathScore(energy)
    const nextMax = Math.min((mathSelectedLevel ?? 1) + 1, TOTAL_MATH_LEVELS)
    if (mathGrade && nextMax > mathMaxLevel) {
      setMathMaxLevel(nextMax)
      window.localStorage.setItem(`allien-math-max-level-${mathGrade}`, String(nextMax))
    }
    setMathGameMode(false)
    setActiveGame(null)
    setMathQuestions(null)
    setMathIndex(0)
    setMathSelectedOption(null)
    setMathShowAnswer(false)
    setMathFinished(false)
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
        const nextMax = Math.min((mathSelectedLevel ?? 1) + 1, TOTAL_MATH_LEVELS)
        if (mathGrade && nextMax > mathMaxLevel) {
          setMathMaxLevel(nextMax)
          window.localStorage.setItem(`allien-math-max-level-${mathGrade}`, String(nextMax))
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
    setMathGameMode(false)
    setMathIndex(0)
    setMathSelectedOption(null)
    setMathShowAnswer(false)
    setMathFinished(false)
  }

  function getMockAiResponse(userText: string): string {
    const t = userText.toLowerCase().trim()
    if (t.length === 0) return "Type a question and I'll help you out!"

    const safe = Number.MAX_SAFE_INTEGER

    // ----- Fractions first (so "1/4+3/4" isn't misread as "4+3") -----
    const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a))
    const simplify = (num: number, den: number): [number, number] => {
      if (den === 0) return [num, den]
      const g = gcd(Math.abs(num), Math.abs(den))
      const d = den < 0 ? -den : den
      return [(den < 0 ? -num : num) / g, d / g]
    }
    const fracAdd = (a: number, b: number, c: number, d: number): [number, number] =>
      simplify(a * d + c * b, b * d)
    const fracSub = (a: number, b: number, c: number, d: number): [number, number] =>
      simplify(a * d - c * b, b * d)
    const fracMul = (a: number, b: number, c: number, d: number): [number, number] =>
      simplify(a * c, b * d)
    const fracDiv = (a: number, b: number, c: number, d: number): [number, number] =>
      simplify(a * d, b * c)
    const formatFrac = (num: number, den: number): string => {
      if (den === 1) return String(num)
      if (den === 0) return "can't divide by zero"
      const [n, d] = simplify(num, den)
      if (d === 1) return String(n)
      const whole = Math.trunc(n / d)
      const r = n % d
      if (whole !== 0 && r !== 0) return `${whole} and ${Math.abs(r)}/${d}`
      if (whole !== 0) return String(whole)
      return `${n}/${d}`
    }
    const fracOpMatch = t.match(/(\d+)\/(\d+)\s*(\+|plus|-|minus|\*|×|x|times|\/|divide|div)\s*(\d+)\/(\d+)/i)
    if (fracOpMatch) {
      const a = Number(fracOpMatch[1])
      const b = Number(fracOpMatch[2])
      const op = fracOpMatch[3]
      const c = Number(fracOpMatch[4])
      const d = Number(fracOpMatch[5])
      if (b === 0 || d === 0) {
        return "Division by zero isn't defined. Try different numbers!"
      }
      let num: number
      let den: number
      if (/^(\+|plus)$/i.test(op)) {
        [num, den] = fracAdd(a, b, c, d)
        return `${a}/${b} + ${c}/${d} = ${formatFrac(num, den)}.`
      }
      if (/^(-|minus)$/.test(op)) {
        [num, den] = fracSub(a, b, c, d)
        return `${a}/${b} − ${c}/${d} = ${formatFrac(num, den)}.`
      }
      if (/\*|×|x|times/i.test(op)) {
        [num, den] = fracMul(a, b, c, d)
        return `${a}/${b} × ${c}/${d} = ${formatFrac(num, den)}.`
      }
      if (/\/|divide|div/i.test(op)) {
        if (c === 0) return "Can't divide by zero!"
        const [divNum, divDen] = fracDiv(a, b, c, d)
        return `${a}/${b} ÷ ${c}/${d} = ${formatFrac(divNum, divDen)}.`
      }
    }
    if (/^(what is )?\d+\/\d+\.?$/i.test(t)) {
      const m = t.match(/(\d+)\/(\d+)/)
      if (m) {
        const num = Number(m[1])
        const den = Number(m[2])
        if (den !== 0) {
          const dec = num / den
          const decStr = Number.isInteger(dec) ? String(dec) : dec.toFixed(6).replace(/\.?0+$/, '')
          return `${num}/${den} = ${decStr} as a decimal.`
        }
      }
    }

    // ----- Powers: 2^10, 2**10, 2 to the power of 10 -----
    const powerMatch = t.match(/(\d+)\s*(?:\^|\*\*|to the power of?)\s*(\d+)/i)
    if (powerMatch) {
      const base = Number(powerMatch[1])
      const exp = Number(powerMatch[2])
      if (Number.isFinite(base) && Number.isFinite(exp) && exp >= 0 && exp <= 1000) {
        const result = Math.pow(base, exp)
        if (Number.isFinite(result) && result <= safe) {
          return `${base}^${exp} = ${result}. That's ${base} to the power of ${exp}!`
        }
        if (Number.isFinite(result)) {
          return `${base}^${exp} = ${result}. That's a big number!`
        }
      }
    }

    // ----- Math: addition, subtraction, multiplication, division (plain numbers) -----
    const addMatch = t.match(/(\d+)\s*(?:\+|plus)\s*(\d+)/i)
    if (addMatch) {
      const a = Number(addMatch[1])
      const b = Number(addMatch[2])
      if (Number.isFinite(a) && Number.isFinite(b) && a <= safe && b <= safe && a + b <= safe) {
        return `${a} + ${b} = ${a + b}. Nice one! You can practice more in Math Lab.`
      }
    }
    const minusMatch = t.match(/(\d+)\s*(?:-|minus)\s*(\d+)/i)
    if (minusMatch) {
      const a = Number(minusMatch[1])
      const b = Number(minusMatch[2])
      if (Number.isFinite(a) && Number.isFinite(b) && a <= safe && b <= safe) {
        return `${a} − ${b} = ${a - b}. Keep practicing in Math Lab if you want more!`
      }
    }
    const timesMatch = t.match(/(\d+)\s*(?:\*|×|x|times|multiplied by)\s*(\d+)/i)
    if (timesMatch) {
      const a = Number(timesMatch[1])
      const b = Number(timesMatch[2])
      if (Number.isFinite(a) && Number.isFinite(b) && a <= safe && b <= safe) {
        const product = a * b
        if (product <= safe) {
          return `${a} × ${b} = ${product}. Times Table City in Math Lab has more multiplication practice.`
        }
      }
    }
    const divMatch = t.match(/(\d+)\s*(?:\/|÷|divided by|divide|div)\s*(\d+)/i)
    if (divMatch) {
      const a = Number(divMatch[1])
      const b = Number(divMatch[2])
      if (Number.isFinite(a) && Number.isFinite(b) && b !== 0 && a <= safe && b <= safe) {
        const quotient = Math.floor(a / b)
        const remainder = a % b
        return remainder === 0
          ? `${a} ÷ ${b} = ${quotient}. Check out Math Lab for more!`
          : `${a} ÷ ${b} = ${quotient} (and ${remainder} left over). Check out Math Lab for more!`
      }
    }

    // ----- Compare two numbers: "0.7 and 0.55 which one is bigger", "which is greater 5 or 3" -----
    const numPattern = '\\d+(?:\\.\\d+)?'
    const compareMatch =
      t.match(new RegExp(`(${numPattern})\\s*(?:and|or)\\s*(${numPattern}).*?(bigger|larger|greater|smaller|less)`, 'i')) ??
      t.match(new RegExp(`(bigger|larger|greater|smaller|less).*?(${numPattern})\\s*(?:or|and)\\s*(${numPattern})`, 'i'))
    if (compareMatch) {
      const g1 = compareMatch[1]
      const g2 = compareMatch[2]
      const g3 = compareMatch[3]
      const isNumFirst = /^\d/.test(g1)
      const a = Number(isNumFirst ? g1 : g2)
      const b = Number(isNumFirst ? g2 : g3)
      const word = (isNumFirst ? g3 : g1).toLowerCase()
      const wantBigger = /bigger|larger|greater/.test(word)
      if (Number.isFinite(a) && Number.isFinite(b)) {
        if (a > b) {
          return wantBigger ? `${a} is bigger than ${b}.` : `${b} is smaller than ${a}.`
        }
        if (a < b) {
          return wantBigger ? `${b} is bigger than ${a}.` : `${a} is smaller than ${b}.`
        }
        return `They're equal! (${a} = ${b})`
      }
    }

    // ----- Simple algebra: "if x + 7 = 15 what is x", "2x = 10", etc. -----
    const varName = 'x'
    let algAnswer: number | null = null
    let algExplain = ''
    const eqMatch = t.match(/\s*=\s*(\d+)/)
    if (eqMatch) {
      const rhs = Number(eqMatch[1])
      const lhsStr = t.replace(/\s*=\s*\d+.*$/, '').replace(/^(if|what is|solve)\s+/i, '').trim()
      if (/^x\s*\+\s*(\d+)$/.test(lhsStr)) {
        const n = Number(lhsStr.match(/^x\s*\+\s*(\d+)$/)![1])
        algAnswer = rhs - n
        algExplain = `${varName} + ${n} = ${rhs}, so ${varName} = ${rhs} − ${n} = ${algAnswer}.`
      } else if (/^(\d+)\s*\+\s*x$/.test(lhsStr)) {
        const n = Number(lhsStr.match(/^(\d+)\s*\+\s*x$/)![1])
        algAnswer = rhs - n
        algExplain = `${n} + ${varName} = ${rhs}, so ${varName} = ${rhs} − ${n} = ${algAnswer}.`
      } else if (/^x\s*-\s*(\d+)$/.test(lhsStr)) {
        const n = Number(lhsStr.match(/^x\s*-\s*(\d+)$/)![1])
        algAnswer = rhs + n
        algExplain = `${varName} − ${n} = ${rhs}, so ${varName} = ${rhs} + ${n} = ${algAnswer}.`
      } else if (/^(\d+)\s*-\s*x$/.test(lhsStr)) {
        const n = Number(lhsStr.match(/^(\d+)\s*-\s*x$/)![1])
        algAnswer = n - rhs
        algExplain = `${n} − ${varName} = ${rhs}, so ${varName} = ${n} − ${rhs} = ${algAnswer}.`
      } else if (/^x\s*[\*×]\s*(\d+)$/.test(lhsStr) || /^(\d+)\s*[\*×]\s*x$/.test(lhsStr) || /^(\d+)\s*x\s*$/.test(lhsStr)) {
        const coefMatch = lhsStr.match(/^x\s*[\*×]\s*(\d+)$/) ?? lhsStr.match(/^(\d+)\s*[\*×]\s*x$/) ?? lhsStr.match(/^(\d+)\s*x\s*$/)
        const coef = Number(coefMatch![1])
        if (coef !== 0 && rhs % coef === 0) {
          algAnswer = rhs / coef
          algExplain = `${coef}${varName} = ${rhs}, so ${varName} = ${rhs} ÷ ${coef} = ${algAnswer}.`
        }
      } else if (/^x\s*\/\s*(\d+)$/.test(lhsStr)) {
        const n = Number(lhsStr.match(/^x\s*\/\s*(\d+)$/)![1])
        if (n !== 0) {
          algAnswer = rhs * n
          algExplain = `${varName} ÷ ${n} = ${rhs}, so ${varName} = ${rhs} × ${n} = ${algAnswer}.`
        }
      } else if (/^(\d+)\s*\/\s*x$/.test(lhsStr)) {
        const n = Number(lhsStr.match(/^(\d+)\s*\/\s*x$/)![1])
        if (rhs !== 0 && n % rhs === 0) {
          algAnswer = n / rhs
          algExplain = `${n} ÷ ${varName} = ${rhs}, so ${varName} = ${n} ÷ ${rhs} = ${algAnswer}.`
        }
      }
    }
    if (algAnswer !== null && Number.isFinite(algAnswer)) {
      return `${varName} = ${algAnswer}. ${algExplain}`
    }

    // ----- Greetings -----
    if (/^(hi|hello|hey|yo|howdy|hiya|sup)\s*!*$/.test(t) || t === "what's up" || t === 'whats up') {
      return "Hey! 👋 I'm Allien, your AI buddy. Ask me about math, homework, games on this site, or anything you're curious about!"
    }

    // ----- Math (general) -----
    if (/\b(math|maths|number|numbers|add|adding|subtract|multiply|division|fraction|equation)\b/.test(t)) {
      if (t.includes('hard') || t.includes('difficult') || t.includes('stuck')) {
        return "Math can feel tricky sometimes! Try breaking the problem into smaller steps. On this site you can go to **Math Lab**, pick your grade (K–2, 3–5, 6–8, or 9–12), and practice with fun levels. If you tell me a specific problem (like 15 + 7 or 6 × 8), I can work it out with you!"
      }
      return "Math is awesome! Here you can practice in **Math Lab** — pick your grade and play through levels. You can do story problems (K–2), times tables (3–5), fractions and decimals (6–8), or algebra (9–12). Want me to solve a specific calculation? Just type it, like \"what is 23 + 19\"!"
    }

    // ----- Games -----
    if (/\b(game|games|play|playing|fun|bored)\b/.test(t)) {
      if (t.includes('scratch') || t.includes('coding') || t.includes('code')) {
        return "If you like making your own games, check out **Scratch** in the Games menu — you can create games and animations with blocks! There's also **Memory match** and **Tic-tac-toe** you can play right here, plus links to Minecraft and more."
      }
      return "There's lots to play here! In **Games** you'll find Memory match and Tic-tac-toe you can play right now, plus links to Scratch (make your own games!), Minecraft, Wild Kratts, and CrazyGames. What do you feel like — puzzles or adventures?"
    }

    // ----- Quizzes -----
    if (/\b(quiz|quizzes|test|practice)\b/.test(t)) {
      return "Head to **Quizzes** in the menu to test your knowledge. And **Math Lab** has tons of practice by grade. Good luck! 🍀"
    }

    // ----- Homework / school -----
    if (/\b(homework|school|class|teacher|assignment)\b/.test(t)) {
      return "I can help you think through stuff! If it's math, type the problem (e.g. \"what is 14 × 5\") and I'll solve it. You can also use **Math Lab** on this site for practice. For other subjects, tell me the question and I'll do my best to explain!"
    }

    // ----- Reading / books -----
    if (/\b(read|reading|book|books|story|stories)\b/.test(t)) {
      return "Reading is great! I don't have books built in here, but I can help you with words, summaries, or ideas. You could also try making stories in **Scratch** (under Games) — you can code your own stories and animations!"
    }

    // ----- Science -----
    if (/\b(science|experiment|planet|space|animal|animals)\b/.test(t)) {
      return "Science is cool! For animal adventures, check out **Wild Kratts** in the Games section. I can answer science questions too — just ask something like \"why is the sky blue\" or \"how do plants grow\" and I'll give you a short answer!"
    }

    // ----- Help / how to use site -----
    if (/\b(help|how do i|how to|where is|find|search)\b/.test(t)) {
      return "Here's the quick tour: **Games** = play Memory, Tic-tac-toe, or open Scratch/Minecraft. **Quizzes** = take a quiz. **Math Lab** = math practice by grade with levels. **Search** = type anything to find a page or game on this site. What do you want to try first?"
    }

    // ----- Thanks / bye -----
    if (/\b(thanks|thank you|bye|goodbye|ok|cool|nice)\b/.test(t) && t.length < 30) {
      return "You're welcome! Come back anytime you have a question. 😊"
    }

    // ----- Why / how / what (curiosity) + harder questions -----
    if (/\b(why|how does|how do|what is|what are|when|where|explain)\b/.test(t)) {
      if (t.includes('sky') && t.includes('blue')) {
        return "The sky looks blue because sunlight is made of all colors. Air scatters the blue part of the light more than the rest, so we see blue! You can look up \"Rayleigh scattering\" for the full science."
      }
      if (t.includes('rainbow')) {
        return "Rainbows happen when sunlight passes through water droplets (like after rain). The light bends and splits into colors: red, orange, yellow, green, blue, indigo, violet. Try making one with a hose in the sun!"
      }
      if (t.includes('plant') || t.includes('grow')) {
        return "Plants grow using sunlight, water, and air! They use their leaves to catch light and roots to get water and nutrients from the soil. It's called photosynthesis. Pretty cool, right?"
      }
      if (t.includes('gravity') || t.includes('fall')) {
        return "Gravity is a force that pulls things toward each other. Earth's gravity pulls you toward the ground — that's why things fall down. Bigger masses pull harder; that's why we orbit the Sun! Newton and Einstein both studied it."
      }
      if (t.includes('evolution') || t.includes('dinosaurs')) {
        return "Evolution means species change over millions of years. Dinosaurs lived long ago; birds are related to some of them! Scientists use fossils and DNA to learn how life changed. It's one of the biggest ideas in science."
      }
      if (t.includes('relativity') || t.includes('einstein')) {
        return "Einstein's relativity says space and time are connected, and nothing goes faster than light. It explains gravity (things bend space) and why clocks run a tiny bit differently when you move fast. It's advanced physics but super cool!"
      }
      if (t.includes('internet') || t.includes('computer') || t.includes('wifi')) {
        return "The internet is millions of computers talking to each other. When you visit a site, your device sends a request, and servers send back the page. WiFi is wireless radio that connects your device to a router, which plugs into the rest of the internet."
      }
      if (t.includes('hard') || t.includes('difficult') || t.includes('complex') || t.length > 60) {
        return "That sounds like a tough question! For really hard stuff I can give much longer, step-by-step answers if you connect me to ChatGPT: see the \"AI + ChatGPT setup\" link in the README (or run the api-proxy and set VITE_AI_PROXY_URL). Until then, try asking in a short sentence or try \"what is [topic]\" — I'll use Wikipedia when I can!"
      }
      return "That's a great question! I'm best at helping with math (try \"what is 8 × 7\") and finding things on this site. For deep or hard questions, set up the ChatGPT proxy and I'll give full step-by-step answers. Otherwise ask in a short sentence and I'll do my best!"
    }

    // ----- Default: helpful and friendly -----
    return "I'm not sure about that one! For very hard questions, connect me to ChatGPT (see docs) and I can give detailed answers. Otherwise I'm great at: (1) **Math** — e.g. \"what is 12 + 15\". (2) **This site** — Games, Math Lab, Quizzes. (3) **Facts** — try \"what is [topic]\" or \"who is [person]\" and I'll look it up!"
  }

  async function handleSendAi() {
    const text = aiInput.trim()
    if (!text || aiLoading) return
    setAiMessages((m) => [...m, { role: 'user', content: text }])
    setAiInput('')
    setAiLoading(true)

    let reply: string | null = null

    // Try Gemini first when API key is set (no backend; model gets memory via full history + system prompt)
    reply = await getGeminiReply(aiMessages, text)
    // Else try ChatGPT (proxy or API key)
    if (!reply) reply = await getChatGPTReply(aiMessages, text)

    if (!reply && looksLikeFactualQuestion(text)) {
      const searchQuery = getSearchQueryFromMessage(text)
      const wikiSummary = await fetchWikipediaSummary(searchQuery)
      if (wikiSummary) {
        reply = `Here's what I found:\n\n${wikiSummary}\n\n(From Wikipedia — you can search for more there!)`
      }
    }
    if (!reply) {
      await new Promise((r) => setTimeout(r, 400))
      reply = getMockAiResponse(text)
    }

    setAiMessages((m) => [...m, { role: 'assistant', content: reply }])
    setAiLoading(false)
  }

  function handleSearchResultClick(item: SearchItem) {
    const a = item.action
    setNavOpen(false)
    if (a.type === 'navigate') {
      navigate(a.path)
    } else if (a.type === 'game') {
      navigate('/games')
      setActiveGame(a.game)
    } else if (a.type === 'math') {
      handleSelectMathGrade(a.grade)
      navigate('/math')
    } else if (a.type === 'external') {
      window.open(a.url, '_blank', 'noopener,noreferrer')
    }
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
        {activeGame === 'mathLevel' && mathGrade && mathSelectedLevel != null && mathQuestions && mathGameMode && mathQuestions.length >= 3 && (
          <MathLabGame
            questions={mathQuestions}
            onComplete={handleMathGameComplete}
            onBack={handleExitMathLevel}
          />
        )}
        {activeGame === 'mathLevel' && mathGrade && mathSelectedLevel != null && mathQuestions && !mathGameMode && (
          <section className="math-level-screen">
            <button type="button" className="tictactoe-back" onClick={handleExitMathLevel}>← Back to Math Lab</button>
            <h2 className="math-level-title">➗ Math Lab</h2>
            <p className="math-level-subtitle">Grade {mathGrade} · Level {mathSelectedLevel}</p>
            {mathQuestions.length > 0 ? (
              <>
                {!mathFinished ? (
                  <>
                    <div className="math-journey">
                      <p className="math-energy-label">
                        Energy: {mathScore} / {mathQuestions.length} — each correct answer moves you across!
                      </p>
                      <div className="math-track-wrap">
                        <span className="math-track-start">Start</span>
                        <div className="math-track">
                          <div
                            className="math-track-character"
                            style={{ left: `${(mathScore / mathQuestions.length) * 100}%` }}
                            role="img"
                            aria-label="Your character"
                          >
                            <img src={heroImg} alt="" width="48" height="50" />
                          </div>
                        </div>
                        <span className="math-track-end">Finish</span>
                      </div>
                    </div>
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
              <a href="https://scratch.mit.edu/" target="_blank" rel="noopener noreferrer" className="game-link game-link-crazy">
                <span className="game-link-emoji">🐱</span>
                <span className="game-link-name">Scratch</span>
                <span className="game-link-desc">Create games, stories, and animations with block coding — by MIT.</span>
              </a>
              <a href="https://poki.com/" target="_blank" rel="noopener noreferrer" className="game-link game-link-crazy">
                <span className="game-link-emoji">🎮</span>
                <span className="game-link-name">Poki</span>
                <span className="game-link-desc">Free online games — action, puzzle, sports, and more. Play in your browser!</span>
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
          <section className="games-section games-section--page ai-page">
            <h2 className="section-title">🤖 Allien AI Assistant</h2>
            <p className="math-intro">Ask me anything — math, games, or stuff you're curious about!</p>
            <div className="ai-chat">
              <ul ref={aiMessagesEndRef} className="ai-messages" aria-live="polite">
                {aiMessages.map((msg, i) => (
                  <li key={i} className={`ai-message ai-message--${msg.role}`}>
                    <span className="ai-message-role" aria-hidden>
                      {msg.role === 'user' ? 'You' : 'Allien'}
                    </span>
                    <p className="ai-message-content">{msg.content}</p>
                  </li>
                ))}
                {aiLoading && (
                  <li className="ai-message ai-message--assistant">
                    <span className="ai-message-role" aria-hidden>Allien</span>
                    <p className="ai-message-content ai-message--typing">Thinking...</p>
                  </li>
                )}
              </ul>
              <form
                className="ai-input-wrap"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendAi()
                }}
              >
                <label htmlFor="ai-input" className="visually-hidden">
                  Your message
                </label>
                <input
                  id="ai-input"
                  type="text"
                  className="ai-input"
                  placeholder="Type your question..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  disabled={aiLoading}
                  autoComplete="off"
                  aria-label="Your message to the AI assistant"
                />
                <button type="submit" className="ai-send-btn" disabled={aiLoading || !aiInput.trim()}>
                  Send
                </button>
              </form>
            </div>
          </section>
        )}

        {!activeGame && location.pathname === '/search' && (
          <section className="games-section games-section--page search-page">
            <h2 className="section-title">🔍 Allien Search</h2>
            <p className="math-intro">Find anything on the site — games, quizzes, Math Lab, and more.</p>
            <form
              className="search-bar-wrap"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="allien-search" className="visually-hidden">
                Search the website
              </label>
              <input
                id="allien-search"
                type="search"
                className="search-bar-input"
                placeholder="Search games, quizzes, math..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                aria-label="Search the website"
                aria-describedby={searchResults.length > 0 ? 'search-results-desc' : undefined}
              />
              <button type="submit" className="search-bar-btn">
                Search
              </button>
            </form>
            {searchResults.length > 0 && (
              <div id="search-results-desc" className="search-results">
                <p className="search-results-heading">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </p>
                <ul className="search-results-list" aria-label="Search results">
                  {searchResults.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="search-result-item"
                        onClick={() => handleSearchResultClick(item)}
                      >
                        <span className="search-result-title">{item.title}</span>
                        <span className="search-result-desc">{item.description}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {searchQuery.trim() && searchResults.length === 0 && (
              <p className="search-no-results">No results for &quot;{searchQuery}&quot;. Try different words.</p>
            )}
          </section>
        )}

        {!activeGame && location.pathname === '/math' && (
          <section id="math" className="games-section games-section--page">
            <h2 className="section-title">➗ Math Lab</h2>
            {mathGrade ? (
              <>
                <p className="math-intro">
                  Math Lab is set to grade {mathGrade}. Pick a world and level (1–{TOTAL_MATH_LEVELS}) to start.
                </p>
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
                        <div className="math-world-tag">Grade K–2 · Levels 1–{TOTAL_MATH_LEVELS}</div>
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
                        <div className="math-world-tag">Grade 3–5 · Levels 1–{TOTAL_MATH_LEVELS}</div>
                      </button>
                    </>
                  )}
                  {mathGrade === '6–8' && (
                    <>
                      <button
                        type="button"
                        className={`math-world-card${mathSelectedWorld === 'g6-8-world-1' ? ' math-world-card--selected' : ''}`}
                        onClick={() => {
                          setMathSelectedWorld('g6-8-world-1')
                          setMathSelectedLevel(1)
                        }}
                      >
                        <div className="math-world-emoji">📐</div>
                        <div className="math-world-title">Rational Valley</div>
                        <div className="math-world-desc">Fractions, decimals, ratios, and negative numbers.</div>
                        <div className="math-world-tag">Grade 6–8 · Levels 1–{TOTAL_MATH_LEVELS}</div>
                      </button>
                    </>
                  )}
                  {mathGrade === '9–12' && (
                    <>
                      <button
                        type="button"
                        className={`math-world-card${mathSelectedWorld === 'g9-12-world-1' ? ' math-world-card--selected' : ''}`}
                        onClick={() => {
                          setMathSelectedWorld('g9-12-world-1')
                          setMathSelectedLevel(1)
                        }}
                      >
                        <div className="math-world-emoji">📈</div>
                        <div className="math-world-title">Algebra Heights</div>
                        <div className="math-world-desc">Algebra, linear equations, and basic geometry.</div>
                        <div className="math-world-tag">Grade 9–12 · Levels 1–{TOTAL_MATH_LEVELS}</div>
                      </button>
                    </>
                  )}
                </div>
                {mathSelectedWorld && (
                  <div className="math-world-actions">
                    <p className="math-intro math-intro-detail">
                      Pick a level (1–{TOTAL_MATH_LEVELS}). You can play up to level {mathMaxLevel}. Complete a level to unlock the next.
                    </p>
                    <div className="math-level-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {Array.from({ length: TOTAL_MATH_LEVELS }, (_, i) => {
                        const n = i + 1
                        const unlocked = n <= mathMaxLevel
                        const selected = mathSelectedLevel === n
                        return (
                          <button
                            key={n}
                            type="button"
                            className={`math-level-btn${selected ? ' math-level-btn--selected' : ''}${!unlocked ? ' math-level-btn--locked' : ''}`}
                            disabled={!unlocked}
                            onClick={() => unlocked && setMathSelectedLevel(n)}
                          >
                            {n}
                          </button>
                        )
                      })}
                    </div>
                    <button type="button" className="math-start-level" onClick={handleStartMathLevel}>
                      Start level {mathSelectedLevel ?? 1}
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
