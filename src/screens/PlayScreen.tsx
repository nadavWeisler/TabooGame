import { Button } from '../components/Button'
import { GameCard } from '../components/GameCard'
import { Scoreboard } from '../components/Scoreboard'
import { TimerDisplay } from '../components/TimerDisplay'
import type { GameController } from '../hooks/useGame'

type PlayScreenProps = {
  game: GameController
}

export function PlayScreen({ game }: PlayScreenProps) {
  const { state, dispatch, card, currentTeamName, resolveCard } = game
  const passBlocked =
    state.settings.passLimit !== null &&
    state.passesUsed >= state.settings.passLimit

  if (state.paused) {
    return (
      <main className="screen pause-screen">
        <h1>השהיה</h1>
        <p className="lede">השעון עצור. החזירו את המסך למתאר לפני שממשיכים.</p>
        <Button className="cta" onClick={() => dispatch({ type: 'RESUME' })}>
          המשך סיבוב
        </Button>
        <Button variant="danger" onClick={() => dispatch({ type: 'END_GAME' })}>
          סיים משחק
        </Button>
      </main>
    )
  }

  if (!card) {
    return (
      <main className="screen play-screen">
        <p className="lede">נגמרו הקלפים.</p>
        <Button onClick={() => dispatch({ type: 'END_GAME' })}>סיים משחק</Button>
      </main>
    )
  }

  return (
    <main className="screen play-screen">
      <div className="play-top">
        <Scoreboard state={state} compact />
        <button
          type="button"
          className="icon-btn"
          onClick={() => dispatch({ type: 'PAUSE' })}
          aria-label="השהה"
        >
          השהה
        </button>
      </div>
      <p className={`now-playing team-${state.currentTeam}`}>
        {currentTeamName} מתארים
      </p>
      <TimerDisplay
        secondsLeft={state.secondsLeft}
        totalSeconds={state.settings.timerSeconds}
      />
      <GameCard card={card} feedback={state.lastFeedback} />
      <p className="play-count">נותרו {state.remaining.length} קלפים</p>
      <div className="play-actions">
        <Button variant="correct" onClick={() => resolveCard('correct')}>
          נכון
        </Button>
        <div className="play-actions-row">
          <Button
            variant="pass"
            disabled={passBlocked}
            onClick={() => resolveCard('pass')}
          >
            פס
            {state.settings.passLimit
              ? ` (${state.passesUsed}/${state.settings.passLimit})`
              : ''}
          </Button>
          <Button variant="buzz" onClick={() => resolveCard('buzz')}>
            באז
          </Button>
        </div>
      </div>
    </main>
  )
}
