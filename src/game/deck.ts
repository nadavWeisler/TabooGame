import deckFile from '../data/cards.json'
import type { Card } from '../types'

type DeckFile = {
  cards: Array<{
    id?: string
    target: string
    taboos: string[]
    category?: string
  }>
}

const builtinDeck = deckFile as DeckFile

export const BUILTIN_CARDS: Card[] = builtinDeck.cards.map((card, index) => ({
  id: card.id ?? `builtin-${index + 1}`,
  target: card.target.trim(),
  taboos: card.taboos.map((word) => word.trim()).filter(Boolean),
  category: card.category?.trim() || 'כללי',
}))

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseCard(value: unknown, index: number): Card | null {
  if (!isRecord(value)) {
    return null
  }
  if (typeof value.target !== 'string' || value.target.trim().length === 0) {
    return null
  }
  if (!Array.isArray(value.taboos)) {
    return null
  }
  const taboos = value.taboos
    .filter((word): word is string => typeof word === 'string')
    .map((word) => word.trim())
    .filter(Boolean)
  if (taboos.length < 3) {
    return null
  }
  const category =
    typeof value.category === 'string' && value.category.trim().length > 0
      ? value.category.trim()
      : 'כללי'
  const id =
    typeof value.id === 'string' && value.id.trim().length > 0
      ? value.id.trim()
      : `custom-${index + 1}`
  return {
    id,
    target: value.target.trim(),
    taboos: taboos.slice(0, 6),
    category,
  }
}

export function parseImportedDeck(data: unknown): Card[] {
  const list = Array.isArray(data)
    ? data
    : isRecord(data) && Array.isArray(data.cards)
      ? data.cards
      : null
  if (!list) {
    throw new Error('הקובץ צריך להיות מערך קלפים או אובייקט עם שדה cards.')
  }
  const cards = list
    .map((item, index) => parseCard(item, index))
    .filter((card): card is Card => card !== null)
  if (cards.length === 0) {
    throw new Error('לא נמצאו קלפים תקינים. לכל קלף צריכים target ו־taboos.')
  }
  return cards
}

export function uniqueCategories(cards: readonly Card[]): string[] {
  const seen = new Set<string>()
  const categories: string[] = []
  for (const card of cards) {
    if (!seen.has(card.category)) {
      seen.add(card.category)
      categories.push(card.category)
    }
  }
  return categories
}

export function filterDeck(
  cards: readonly Card[],
  selectedCategories: readonly string[],
): Card[] {
  if (selectedCategories.length === 0) {
    return [...cards]
  }
  const allowed = new Set(selectedCategories)
  return cards.filter((card) => allowed.has(card.category))
}
