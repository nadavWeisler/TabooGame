import { Button } from '../components/Button'
import { Scoreboard } from '../components/Scoreboard'
import { assertNever } from '../game/helpers'
import { teamName, winnerTeam } from '../game/reducer'
import type { GameController } from '../hooks/useGame'

type WinnerScreenProps = {
  game: GameController
}

export function WinnerScreen({ game }: WinnerScreenProps) {
  const { state, dispatch } = game
  const winner = winnerTeam(state)

  let headline: string
  let sub: string
  switch (winner) {
    case 'tie':
      headline = 'תיקו!'
      sub = 'שתי הקבוצות סיימו עם אותו ניקוד.'
      break
    case 'a':
    case 'b':
      headline = `ניצחון ל${teamName(state, winner)}!`
      sub = 'סיבוב נוסף? או חזרה להגדרות.'
      break
    default:
      assertNever(winner)
  }

  return (
    <main className="screen winner-screen">
      <p className="kicker">סוף המשחק</p>
      <h1 className={winner === 'tie' ? '' : `team-headline team-${winner}`}>
        {headline}
      </h1>
      <p className="lede">{sub}</p>
      <Scoreboard state={state} />
      <p className="hint">
        {state.roundNumber} סיבובים · {state.scores.a + state.scores.b} נקודות
        בסך הכול
      </p>
      <Button className="cta" onClick={() => dispatch({ type: 'PLAY_AGAIN' })}>
        משחק חדש
      </Button>
      <Button variant="ghost" onClick={() => dispatch({ type: 'BACK_TO_SETUP' })}>
        חזרה להגדרות
      </Button>
    </main>
  )
}
