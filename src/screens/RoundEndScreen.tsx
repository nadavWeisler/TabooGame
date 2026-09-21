import { Button } from '../components/Button'
import { Scoreboard } from '../components/Scoreboard'
import { assertNever, otherTeam } from '../game/helpers'
import { roundCounts, teamName } from '../game/reducer'
import type { CardResult } from '../types'
import type { GameController } from '../hooks/useGame'

function resultLabel(result: CardResult): string {
  switch (result) {
    case 'correct':
      return 'נכון'
    case 'pass':
      return 'פס'
    case 'buzz':
      return 'באז'
    default:
      return assertNever(result)
  }
}

type RoundEndScreenProps = {
  game: GameController
}

export function RoundEndScreen({ game }: RoundEndScreenProps) {
  const { state, dispatch, currentTeamName } = game
  const counts = roundCounts(state)
  const next = teamName(state, otherTeam(state.currentTeam))
  const noCardsLeft = state.remaining.length === 0

  return (
    <main className="screen round-end-screen">
      <p className="kicker">
        {noCardsLeft ? 'נגמרו הקלפים' : 'נגמר הזמן'}
      </p>
      <h1>סוף הסיבוב</h1>
      <p className={`team-headline team-${state.currentTeam}`}>
        {currentTeamName}
      </p>
      <Scoreboard state={state} />
      <ul className="round-stats">
        <li>
          <strong>{counts.correct}</strong>
          <span>נכונים</span>
        </li>
        <li>
          <strong>{counts.pass}</strong>
          <span>פס</span>
        </li>
        <li>
          <strong>{counts.buzz}</strong>
          <span>באז</span>
        </li>
      </ul>
      {state.roundEvents.length === 0 ? (
        <p className="empty-state">לא נפתרו קלפים בסיבוב הזה.</p>
      ) : (
        <ul className="round-log">
          {state.roundEvents.map((event) => (
            <li key={`${event.card.id}-${event.result}`}>
              <span className={`log-result is-${event.result}`}>
                {resultLabel(event.result)}
              </span>
              <span>{event.card.target}</span>
            </li>
          ))}
        </ul>
      )}
      {noCardsLeft ? (
        <Button className="cta" onClick={() => dispatch({ type: 'END_GAME' })}>
          למסך הניצחון
        </Button>
      ) : (
        <Button
          className="cta"
          variant={state.currentTeam === 'a' ? 'teamB' : 'teamA'}
          onClick={() => dispatch({ type: 'NEXT_ROUND' })}
        >
          התור של {next}
        </Button>
      )}
      <Button variant="ghost" onClick={() => dispatch({ type: 'END_GAME' })}>
        סיים משחק
      </Button>
    </main>
  )
}
