import { assertNever } from './game/helpers'
import { useGame } from './hooks/useGame'
import { PlayScreen } from './screens/PlayScreen'
import { ReadyScreen } from './screens/ReadyScreen'
import { RoundEndScreen } from './screens/RoundEndScreen'
import { SetupScreen } from './screens/SetupScreen'
import { WinnerScreen } from './screens/WinnerScreen'

export default function App() {
  const game = useGame()
  const { phase, currentTeam, lastFeedback } = game.state

  let screen
  switch (phase) {
    case 'setup':
      screen = <SetupScreen game={game} />
      break
    case 'ready':
      screen = <ReadyScreen game={game} />
      break
    case 'playing':
      screen = <PlayScreen game={game} />
      break
    case 'roundEnd':
      screen = <RoundEndScreen game={game} />
      break
    case 'winner':
      screen = <WinnerScreen game={game} />
      break
    default:
      assertNever(phase)
  }

  return (
    <div
      className={`app phase-${phase} team-${currentTeam} ${lastFeedback ? `flash-${lastFeedback}` : ''}`}
    >
      {screen}
    </div>
  )
}
