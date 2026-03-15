import type { MathGradeId } from './math/types'

export type SearchAction =
  | { type: 'navigate'; path: string }
  | { type: 'game'; game: 'memory' | 'tictactoe' }
  | { type: 'math'; grade: MathGradeId }
  | { type: 'external'; url: string }

export type SearchItem = {
  id: string
  title: string
  description: string
  keywords: string
  action: SearchAction
}

const SEARCH_ITEMS: SearchItem[] = [
  { id: 'home', title: 'Home', description: 'Main page', keywords: 'home main', action: { type: 'navigate', path: '/' } },
  { id: 'games', title: 'Games', description: 'Games Library', keywords: 'games library play', action: { type: 'navigate', path: '/games' } },
  { id: 'quizzes', title: 'Quizzes', description: 'Take quizzes', keywords: 'quizzes quiz test', action: { type: 'navigate', path: '/quizzes' } },
  { id: 'ai', title: 'AI Assistant', description: 'Ask questions and get help', keywords: 'ai assistant help robot', action: { type: 'navigate', path: '/ai' } },
  { id: 'search', title: 'Search', description: 'Search the site', keywords: 'search find', action: { type: 'navigate', path: '/search' } },
  { id: 'math', title: 'Math Lab', description: 'Math practice by grade', keywords: 'math lab maths practice grade', action: { type: 'navigate', path: '/math' } },
  { id: 'crazygames', title: 'CrazyGames', description: 'Thousands of free online games', keywords: 'crazy games action puzzle sports', action: { type: 'external', url: 'https://www.crazygames.com/' } },
  { id: 'wildkratts', title: 'Wild Kratts', description: 'Animal adventure games', keywords: 'wild kratts animal adventure pbs', action: { type: 'external', url: 'https://pbskids.org/wildkratts/games/' } },
  { id: 'minecraft', title: 'Minecraft', description: 'Build, explore, and survive', keywords: 'minecraft build explore blocks', action: { type: 'external', url: 'https://www.minecraft.net/' } },
  { id: 'scratch', title: 'Scratch', description: 'Create games with block coding', keywords: 'scratch coding code blocks mit create', action: { type: 'external', url: 'https://scratch.mit.edu/' } },
  { id: 'poki', title: 'Poki', description: 'Free online games in your browser', keywords: 'poki games play action puzzle sports', action: { type: 'external', url: 'https://poki.com/' } },
  { id: 'memory', title: 'Memory match', description: 'Play memory match', keywords: 'memory match game play puzzle', action: { type: 'game', game: 'memory' } },
  { id: 'tictactoe', title: 'Tic-tac-toe', description: 'Play tic-tac-toe', keywords: 'tic tac toe game play x o', action: { type: 'game', game: 'tictactoe' } },
  { id: 'math-k2', title: 'Math Lab · Grade K–2', description: 'Number Forest and story problems', keywords: 'math k-2 k2 kindergarten grade number forest', action: { type: 'math', grade: 'K–2' } },
  { id: 'math-35', title: 'Math Lab · Grade 3–5', description: 'Times Table City', keywords: 'math 3-5 grade times table multiplication', action: { type: 'math', grade: '3–5' } },
  { id: 'math-68', title: 'Math Lab · Grade 6–8', description: 'Rational Valley — fractions and decimals', keywords: 'math 6-8 grade rational valley fractions decimals', action: { type: 'math', grade: '6–8' } },
  { id: 'math-912', title: 'Math Lab · Grade 9–12', description: 'Algebra Heights', keywords: 'math 9-12 grade algebra geometry', action: { type: 'math', grade: '9–12' } },
  { id: 'number-forest', title: 'Number Forest', description: 'Math world for K–2', keywords: 'number forest k2 math world', action: { type: 'math', grade: 'K–2' } },
  { id: 'times-table', title: 'Times Table City', description: 'Math world for 3–5', keywords: 'times table city multiplication math', action: { type: 'math', grade: '3–5' } },
  { id: 'rational-valley', title: 'Rational Valley', description: 'Math world for 6–8', keywords: 'rational valley fractions decimals math', action: { type: 'math', grade: '6–8' } },
  { id: 'algebra-heights', title: 'Algebra Heights', description: 'Math world for 9–12', keywords: 'algebra heights math geometry', action: { type: 'math', grade: '9–12' } },
]

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
}

export function searchSite(query: string): SearchItem[] {
  const q = normalize(query).trim()
  if (!q) return []
  const terms = q.split(/\s+/).filter(Boolean)
  return SEARCH_ITEMS.filter((item) => {
    const text = normalize([item.title, item.description, item.keywords].join(' '))
    return terms.every((term) => text.includes(term))
  })
}
