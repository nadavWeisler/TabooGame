import { Button } from '../components/Button'
import { Scoreboard } from '../components/Scoreboard'
import { otherTeam } from '../game/helpers'
import { teamName } from '../game/reducer'
import type { GameController } from '../hooks/useGame'

type ReadyScreenProps = {
  game: GameController
}

export function ReadyScreen({ game }: ReadyScreenProps) {
  const { state, dispatch, currentTeamName } = game
  const emptyDeck = state.remaining.length === 0

  return (
    <main className="screen ready-screen">
      <Scoreboard state={state} />
      <p className="kicker">סיבוב {state.roundNumber}</p>
      <h1 className={`team-headline team-${state.currentTeam}`}>
        {currentTeamName}
      </h1>
      <p className="lede">
        המתאר מחזיק את הטלפון. רק המתאר רואה את הקלף — הקבוצה מנחשת בקול.
      </p>
      <ul className="ready-list">
        <li>אסור לומר את המילה עצמה או את המילים האסורות.</li>
        <li>נכון = נקודה. באז = נקודה ליריב. פס = דילוג.</li>
        <li>
          {state.settings.timerSeconds} שניות
          {state.settings.passLimit
            ? ` · עד ${state.settings.passLimit} פס`
            : ' · פס חופשי'}
        </li>
        <li>נותרו {state.remaining.length} קלפים</li>
      </ul>
      {emptyDeck ? (
        <p className="status-error">נגמרו הקלפים בחפיסה.</p>
      ) : (
        <Button
          className="cta"
          variant={state.currentTeam === 'a' ? 'teamA' : 'teamB'}
          onClick={() => dispatch({ type: 'START_ROUND' })}
        >
          התחל סיבוב
        </Button>
      )}
      <Button variant="ghost" onClick={() => dispatch({ type: 'END_GAME' })}>
        {emptyDeck ? 'למסך הניצחון' : 'סיים משחק'}
      </Button>
      <p className="hint">
        אחרי הסיבוב יעבור התור אל {teamName(state, otherTeam(state.currentTeam))}
      </p>
    </main>
  )
}
