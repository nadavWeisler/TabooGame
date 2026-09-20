import type { Card } from '../types'

type GameCardProps = {
  card: Card
  feedback: 'correct' | 'pass' | 'buzz' | null
}

export function GameCard({ card, feedback }: GameCardProps) {
  return (
    <article className={`game-card ${feedback ? `is-${feedback}` : ''}`}>
      <p className="game-card-category">{card.category}</p>
      <h2 className="game-card-target">{card.target}</h2>
      <div className="game-card-taboos">
        <p className="game-card-taboos-label">אסור לומר</p>
        <ul>
          {card.taboos.map((word) => (
            <li key={word}>{word}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}
