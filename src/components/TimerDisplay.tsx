import type { CSSProperties } from 'react'

type TimerDisplayProps = {
  secondsLeft: number
  totalSeconds: number
}

function formatTime(seconds: number): string {
  const safe = Math.max(0, seconds)
  const minutes = Math.floor(safe / 60)
  const rest = safe % 60
  return `${minutes}:${rest.toString().padStart(2, '0')}`
}

export function TimerDisplay({ secondsLeft, totalSeconds }: TimerDisplayProps) {
  const ratio = totalSeconds > 0 ? secondsLeft / totalSeconds : 0
  let tone = 'timer-ok'
  if (secondsLeft <= 5) {
    tone = 'timer-critical'
  } else if (secondsLeft <= 10) {
    tone = 'timer-warn'
  }

  return (
    <div
      className={`timer ${tone}`}
      role="timer"
      aria-live="polite"
      aria-label={`נשארו ${secondsLeft} שניות`}
      style={{ '--timer-ratio': String(ratio) } as CSSProperties}
    >
      <span className="timer-digits">{formatTime(secondsLeft)}</span>
    </div>
  )
}
