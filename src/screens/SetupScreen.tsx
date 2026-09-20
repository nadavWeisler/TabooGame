import { useRef, useState } from 'react'
import { Button } from '../components/Button'
import { parseImportedDeck } from '../game/deck'
import type { GameController } from '../hooks/useGame'
import { BUILTIN_CATEGORIES, type PassLimit, type TimerSeconds } from '../types'

const TIMER_OPTIONS: TimerSeconds[] = [30, 45, 60]
const PASS_OPTIONS: Array<{ value: PassLimit; label: string }> = [
  { value: null, label: 'ללא הגבלה' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
]

type SetupScreenProps = {
  game: GameController
}

export function SetupScreen({ game }: SetupScreenProps) {
  const { state, dispatch, categories, deckSize, updateSettings } = game
  const fileRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [importNote, setImportNote] = useState<string | null>(
    state.customCards
      ? `חפיסה מותאמת: ${state.customCards.length} קלפים`
      : null,
  )

  const selected = new Set(state.settings.categories)
  const usingCustom = state.customCards !== null

  const toggleCategory = (category: string) => {
    const next = selected.has(category)
      ? state.settings.categories.filter((item) => item !== category)
      : [...state.settings.categories, category]
    updateSettings({ categories: next })
  }

  const onImportFile = async (file: File) => {
    setImportError(null)
    try {
      const text = await file.text()
      const parsed: unknown = JSON.parse(text)
      const cards = parseImportedDeck(parsed)
      dispatch({ type: 'IMPORT_DECK', cards })
      updateSettings({
        categories: [...new Set(cards.map((card) => card.category))],
      })
      setImportNote(`נטענו ${cards.length} קלפים מהקובץ`)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'לא ניתן לקרוא את הקובץ'
      setImportError(message)
      setImportNote(null)
    }
  }

  const canStart = deckSize > 0

  return (
    <main className="screen setup-screen">
      <header className="hero">
        <p className="eyebrow">משחק מסיבות</p>
        <h1 className="logo">טאבו</h1>
        <p className="lede">
          מתאר אחד, קבוצה מנחשת — בלי לומר את המילים האסורות.
        </p>
      </header>

      <section className="panel">
        <h2>קבוצות</h2>
        <label className="field">
          <span>קבוצה א׳</span>
          <input
            className="input team-a-input"
            value={state.settings.teamAName}
            maxLength={18}
            onChange={(event) =>
              updateSettings({ teamAName: event.target.value })
            }
          />
        </label>
        <label className="field">
          <span>קבוצה ב׳</span>
          <input
            className="input team-b-input"
            value={state.settings.teamBName}
            maxLength={18}
            onChange={(event) =>
              updateSettings({ teamBName: event.target.value })
            }
          />
        </label>
      </section>

      <section className="panel">
        <h2>שעון סיבוב</h2>
        <div className="chip-row">
          {TIMER_OPTIONS.map((seconds) => (
            <button
              key={seconds}
              type="button"
              className={`chip ${state.settings.timerSeconds === seconds ? 'is-selected' : ''}`}
              onClick={() => updateSettings({ timerSeconds: seconds })}
            >
              {seconds} שניות
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>הגבלת פס</h2>
        <div className="chip-row">
          {PASS_OPTIONS.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              className={`chip ${state.settings.passLimit === option.value ? 'is-selected' : ''}`}
              onClick={() => updateSettings({ passLimit: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>קטגוריות</h2>
        <p className="hint">
          {selected.size === 0
            ? 'לא נבחרו קטגוריות — ייכללו כל הקלפים.'
            : `${selected.size} קטגוריות · ${deckSize} קלפים בחפיסה`}
        </p>
        <div className="chip-row wrap">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`chip ${selected.has(category) ? 'is-selected' : ''}`}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>חפיסה מותאמת</h2>
        <p className="hint">
          אפשר לייבא JSON עם מערך קלפים, או אובייקט עם שדה cards. לכל קלף
          נדרשים target ו־taboos.
        </p>
        <input
          ref={fileRef}
          className="visually-hidden"
          type="file"
          accept="application/json,.json"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) {
              void onImportFile(file)
            }
            event.target.value = ''
          }}
        />
        <div className="row-actions">
          <Button variant="ghost" onClick={() => fileRef.current?.click()}>
            ייבוא חפיסה
          </Button>
          {usingCustom ? (
            <Button
              variant="ghost"
              onClick={() => {
                dispatch({ type: 'IMPORT_DECK', cards: null })
                updateSettings({ categories: [...BUILTIN_CATEGORIES] })
                setImportNote('חזרתם לחפיסה המובנית')
                setImportError(null)
              }}
            >
              חפיסה מובנית
            </Button>
          ) : null}
        </div>
        {importNote ? <p className="status-ok">{importNote}</p> : null}
        {importError ? <p className="status-error">{importError}</p> : null}
      </section>

      <div className="rules">
        <p>
          <strong>נכון</strong> — נקודה לקבוצה המתארת. <strong>באז</strong> —
          נקודה ליריב. <strong>פס</strong> — בלי נקודה.
        </p>
      </div>

      <Button
        className="cta"
        disabled={!canStart}
        onClick={() => dispatch({ type: 'START_GAME' })}
      >
        התחל משחק
      </Button>
      {!canStart ? (
        <p className="status-error">אין קלפים בחפיסה. ייבאו קובץ או בחרו קטגוריה.</p>
      ) : null}
    </main>
  )
}
