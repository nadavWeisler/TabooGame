import { useEffect, useMemo, useReducer } from 'react'
import { BUILTIN_CARDS, uniqueCategories } from '../game/deck'
import { vibrateBuzz, vibrateCorrect, vibratePass, vibrateTick } from '../game/haptics'
import { currentCard, gameReducer, initialState, teamName } from '../game/reducer'
import { loadSettings, saveSettings } from '../game/storage'
import type { CardResult, GameSettings } from '../types'

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  useEffect(() => {
    dispatch({ type: 'HYDRATE_SETTINGS', settings: loadSettings() })
  }, [])

  useEffect(() => {
    saveSettings(state.settings)
  }, [state.settings])

  useEffect(() => {
    if (state.phase !== 'playing' || state.paused) {
      return
    }
    const id = window.setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1000)
    return () => window.clearInterval(id)
  }, [state.phase, state.paused])

  useEffect(() => {
    if (state.phase !== 'playing' || state.paused) {
      return
    }
    if (state.secondsLeft <= 5 && state.secondsLeft > 0) {
      vibrateTick()
    }
  }, [state.phase, state.paused, state.secondsLeft])

  useEffect(() => {
    if (!state.lastFeedback) {
      return
    }
    const id = window.setTimeout(() => {
      dispatch({ type: 'CLEAR_FEEDBACK' })
    }, 420)
    return () => window.clearTimeout(id)
  }, [state.lastFeedback, state.roundEvents.length])

  const deck = state.customCards ?? BUILTIN_CARDS
  const categories = useMemo(() => uniqueCategories(deck), [deck])
  const card = currentCard(state)
  const currentTeamName = teamName(state, state.currentTeam)

  const resolveCard = (result: CardResult) => {
    switch (result) {
      case 'correct':
        vibrateCorrect()
        break
      case 'pass':
        vibratePass()
        break
      case 'buzz':
        vibrateBuzz()
        break
      default: {
        const exhaustive: never = result
        void exhaustive
      }
    }
    dispatch({ type: 'RESOLVE_CARD', result })
  }

  const updateSettings = (patch: Partial<GameSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', patch })
  }

  return {
    state,
    dispatch,
    card,
    categories,
    deckSize: deck.length,
    currentTeamName,
    resolveCard,
    updateSettings,
  }
}

export type GameController = ReturnType<typeof useGame>
