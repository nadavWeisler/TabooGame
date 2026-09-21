import { BUILTIN_CARDS, filterDeck } from './deck'
import { assertNever, otherTeam, shuffle } from './helpers'
import {
  DEFAULT_SETTINGS,
  type CardResult,
  type GameSettings,
  type GameState,
} from '../types'

export const initialState: GameState = {
  phase: 'setup',
  paused: false,
  settings: DEFAULT_SETTINGS,
  customCards: null,
  remaining: [],
  currentTeam: 'a',
  scores: { a: 0, b: 0 },
  secondsLeft: DEFAULT_SETTINGS.timerSeconds,
  passesUsed: 0,
  roundEvents: [],
  roundNumber: 1,
  lastFeedback: null,
  deckEmpty: false,
}

export type GameAction =
  | { type: 'HYDRATE_SETTINGS'; settings: GameSettings }
  | { type: 'UPDATE_SETTINGS'; patch: Partial<GameSettings> }
  | { type: 'IMPORT_DECK'; cards: GameState['customCards'] }
  | { type: 'START_GAME' }
  | { type: 'START_ROUND' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'TICK' }
  | { type: 'RESOLVE_CARD'; result: CardResult }
  | { type: 'CLEAR_FEEDBACK' }
  | { type: 'NEXT_ROUND' }
  | { type: 'END_GAME' }
  | { type: 'PLAY_AGAIN' }
  | { type: 'BACK_TO_SETUP' }

function activeCards(state: GameState) {
  return state.customCards ?? BUILTIN_CARDS
}

function startFreshGame(state: GameState): GameState {
  const source = filterDeck(activeCards(state), state.settings.categories)
  return {
    ...state,
    phase: 'ready',
    paused: false,
    remaining: shuffle(source),
    currentTeam: 'a',
    scores: { a: 0, b: 0 },
    secondsLeft: state.settings.timerSeconds,
    passesUsed: 0,
    roundEvents: [],
    roundNumber: 1,
    lastFeedback: null,
    deckEmpty: source.length === 0,
  }
}

function applyCardResult(state: GameState, result: CardResult): GameState {
  const currentCard = state.remaining[0]
  if (!currentCard || state.phase !== 'playing' || state.paused) {
    return state
  }
  if (
    result === 'pass' &&
    state.settings.passLimit !== null &&
    state.passesUsed >= state.settings.passLimit
  ) {
    return state
  }

  const rest = state.remaining.slice(1)
  const scores = { ...state.scores }
  let passesUsed = state.passesUsed
  switch (result) {
    case 'correct':
      scores[state.currentTeam] += 1
      break
    case 'buzz':
      scores[otherTeam(state.currentTeam)] += 1
      break
    case 'pass':
      passesUsed += 1
      break
    default:
      assertNever(result)
  }

  const deckEmpty = rest.length === 0
  return {
    ...state,
    remaining: rest,
    scores,
    passesUsed,
    roundEvents: [...state.roundEvents, { card: currentCard, result }],
    lastFeedback: result,
    phase: deckEmpty ? 'roundEnd' : 'playing',
    paused: false,
    deckEmpty,
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'HYDRATE_SETTINGS':
      if (state.phase !== 'setup') {
        return state
      }
      return { ...state, settings: action.settings }
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.patch },
      }
    case 'IMPORT_DECK':
      return { ...state, customCards: action.cards }
    case 'START_GAME':
      return startFreshGame(state)
    case 'START_ROUND':
      if (state.remaining.length === 0) {
        return { ...state, phase: 'winner', paused: false, deckEmpty: true }
      }
      return {
        ...state,
        phase: 'playing',
        paused: false,
        secondsLeft: state.settings.timerSeconds,
        passesUsed: 0,
        roundEvents: [],
        lastFeedback: null,
        deckEmpty: false,
      }
    case 'PAUSE':
      if (state.phase !== 'playing') {
        return state
      }
      return { ...state, paused: true }
    case 'RESUME':
      if (state.phase !== 'playing') {
        return state
      }
      return { ...state, paused: false }
    case 'TICK':
      if (state.phase !== 'playing' || state.paused) {
        return state
      }
      if (state.secondsLeft <= 1) {
        return {
          ...state,
          secondsLeft: 0,
          phase: 'roundEnd',
          paused: false,
          lastFeedback: null,
        }
      }
      return { ...state, secondsLeft: state.secondsLeft - 1 }
    case 'RESOLVE_CARD':
      return applyCardResult(state, action.result)
    case 'CLEAR_FEEDBACK':
      return { ...state, lastFeedback: null }
    case 'NEXT_ROUND':
      if (state.remaining.length === 0) {
        return { ...state, phase: 'winner', paused: false, deckEmpty: true }
      }
      return {
        ...state,
        phase: 'ready',
        paused: false,
        currentTeam: otherTeam(state.currentTeam),
        roundNumber: state.roundNumber + 1,
        roundEvents: [],
        lastFeedback: null,
        secondsLeft: state.settings.timerSeconds,
        passesUsed: 0,
        deckEmpty: false,
      }
    case 'END_GAME':
      return { ...state, phase: 'winner', paused: false }
    case 'PLAY_AGAIN':
      return startFreshGame(state)
    case 'BACK_TO_SETUP':
      return {
        ...initialState,
        settings: state.settings,
        customCards: state.customCards,
      }
    default:
      return assertNever(action)
  }
}

export function currentCard(state: GameState) {
  return state.remaining[0] ?? null
}

export function teamName(state: GameState, team: GameState['currentTeam']) {
  switch (team) {
    case 'a':
      return state.settings.teamAName
    case 'b':
      return state.settings.teamBName
    default:
      return assertNever(team)
  }
}

export function winnerTeam(state: GameState): GameState['currentTeam'] | 'tie' {
  if (state.scores.a === state.scores.b) {
    return 'tie'
  }
  return state.scores.a > state.scores.b ? 'a' : 'b'
}

export function roundCounts(state: GameState) {
  let correct = 0
  let pass = 0
  let buzz = 0
  for (const event of state.roundEvents) {
    switch (event.result) {
      case 'correct':
        correct += 1
        break
      case 'pass':
        pass += 1
        break
      case 'buzz':
        buzz += 1
        break
      default:
        assertNever(event.result)
    }
  }
  return { correct, pass, buzz }
}
