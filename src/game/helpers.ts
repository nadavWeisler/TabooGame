export function assertNever(value: never): never {
  throw new Error(`Unhandled value: ${JSON.stringify(value)}`)
}

export function otherTeam(team: 'a' | 'b'): 'a' | 'b' {
  switch (team) {
    case 'a':
      return 'b'
    case 'b':
      return 'a'
    default:
      return assertNever(team)
  }
}

export function shuffle<T>(items: readonly T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = next[i]
    const swap = next[j]
    if (current === undefined || swap === undefined) {
      continue
    }
    next[i] = swap
    next[j] = current
  }
  return next
}
