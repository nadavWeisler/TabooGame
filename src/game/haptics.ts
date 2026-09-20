export function vibrateCorrect(): void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return
  }
  navigator.vibrate(18)
}

export function vibratePass(): void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return
  }
  navigator.vibrate(12)
}

export function vibrateBuzz(): void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return
  }
  navigator.vibrate([40, 40, 80, 30, 140])
}

export function vibrateTick(): void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return
  }
  navigator.vibrate(8)
}
