export const BUILTIN_CATEGORIES = [
  'בית',
  'אוכל',
  'ספורט',
  'טכנולוגיה',
  'תרבות ישראלית',
  'מקצועות',
] as const

export type BuiltinCategory = (typeof BUILTIN_CATEGORIES)[number]

export type Card = {
  id: string
  target: string
  taboos: string[]
  category: string
}

export type TeamId = 'a' | 'b'

export type TimerSeconds = 30 | 45 | 60

export type PassLimit = 1 | 2 | 3 | null

export type GameSettings = {
  teamAName: string
  teamBName: string
  timerSeconds: TimerSeconds
  passLimit: PassLimit
  categories: string[]
}

export type Phase = 'setup' | 'ready' | 'playing' | 'roundEnd' | 'winner'

export type CardResult = 'correct' | 'pass' | 'buzz'

export type RoundEvent = {
  card: Card
  result: CardResult
}

export type Feedback = CardResult | null

export type GameState = {
  phase: Phase
  paused: boolean
  settings: GameSettings
  customCards: Card[] | null
  remaining: Card[]
  currentTeam: TeamId
  scores: { a: number; b: number }
  secondsLeft: number
  passesUsed: number
  roundEvents: RoundEvent[]
  roundNumber: number
  lastFeedback: Feedback
  deckEmpty: boolean
}

export const DEFAULT_SETTINGS: GameSettings = {
  teamAName: 'אדום',
  teamBName: 'כחול',
  timerSeconds: 60,
  passLimit: null,
  categories: [...BUILTIN_CATEGORIES],
}
