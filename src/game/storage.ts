import { DEFAULT_SETTINGS, type GameSettings } from '../types'
import { BUILTIN_CATEGORIES } from '../types'

const STORAGE_KEY = 'taboo-he-settings-v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseTimer(value: unknown): GameSettings['timerSeconds'] {
  if (value === 30 || value === 45 || value === 60) {
    return value
  }
  return DEFAULT_SETTINGS.timerSeconds
}

function parsePassLimit(value: unknown): GameSettings['passLimit'] {
  if (value === 1 || value === 2 || value === 3 || value === null) {
    return value
  }
  return DEFAULT_SETTINGS.passLimit
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return DEFAULT_SETTINGS
    }
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) {
      return DEFAULT_SETTINGS
    }
    const teamAName =
      typeof parsed.teamAName === 'string' && parsed.teamAName.trim()
        ? parsed.teamAName.trim()
        : DEFAULT_SETTINGS.teamAName
    const teamBName =
      typeof parsed.teamBName === 'string' && parsed.teamBName.trim()
        ? parsed.teamBName.trim()
        : DEFAULT_SETTINGS.teamBName
    const categories = Array.isArray(parsed.categories)
      ? parsed.categories.filter(
          (item): item is string =>
            typeof item === 'string' && item.trim().length > 0,
        )
      : [...BUILTIN_CATEGORIES]
    return {
      teamAName,
      teamBName,
      timerSeconds: parseTimer(parsed.timerSeconds),
      passLimit: parsePassLimit(parsed.passLimit),
      categories: categories.length > 0 ? categories : [...BUILTIN_CATEGORIES],
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Private mode or disabled storage — settings just won't persist.
  }
}
