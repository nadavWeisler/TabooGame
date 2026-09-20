import { teamName } from '../game/reducer'
import type { GameState } from '../types'

type ScoreboardProps = {
  state: GameState
  compact?: boolean
}

export function Scoreboard({ state, compact = false }: ScoreboardProps) {
  return (
    <div className={compact ? 'scoreboard scoreboard-compact' : 'scoreboard'}>
      <div
        className={`score-pill team-a ${state.currentTeam === 'a' ? 'is-active' : ''}`}
      >
        <span className="score-name">{teamName(state, 'a')}</span>
        <strong className="score-value">{state.scores.a}</strong>
      </div>
      <div
        className={`score-pill team-b ${state.currentTeam === 'b' ? 'is-active' : ''}`}
      >
        <span className="score-name">{teamName(state, 'b')}</span>
        <strong className="score-value">{state.scores.b}</strong>
      </div>
    </div>
  )
}
