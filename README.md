# טאבו (Taboo) בעברית

משחק מסיבות מקומי: שחקן אחד מתאר מילת מטרה לקבוצה **בלי לומר** את המילים האסורות. הממשק כולו בעברית ובכיוון RTL, ומיועד לטלפון שמוחזק ביד המתאר.

הקלפים הם תוכן מקורי למעריצים. **אין קשר ל-Hasbro או למשחק Taboo המסחרי**, והחפיסה אינה העתק של קלפים רשמיים.

## The game

A local party game: one player describes a target word to their team **without saying** the forbidden words. The whole interface is Hebrew and RTL, meant for a phone held by the describer.

The cards are original fan-made content. **This project is not affiliated with Hasbro or the commercial Taboo game**, and the deck is not a copy of official cards.

1. Choose team names (defaults: Red / Blue), a round timer (30 / 45 / 60 seconds), and an optional skip limit.
2. You can filter by category: Home, Food, Sports, Technology, Israeli culture, Professions.
3. The describer sees a card with a target word and 4–5 forbidden words.
4. **Correct** = a point for the describing team. **Buzz** = a forbidden word was said, so a point goes to the opponent. **Pass** = skip with no point.
5. After the round, teams switch. You can end the game at any time to see who won.

Last settings are saved in `localStorage`. There is no server, no accounts, and no sync between devices.

A custom JSON deck can be imported from the setup screen. Example: `public/custom-deck.example.json`. A raw array of cards also works (`[{ "target": "...", "taboos": [...] }]`).

## הרצה מקומית

```bash
npm install
npm run dev
```

ואז פותחים את הכתובת שמופיעה בטרמינל (בדרך כלל `http://localhost:5173`).

## בניית קבצים סטטיים

```bash
npm run build
npm run preview
```

## איך משחקים

1. בוחרים שמות קבוצות (ברירת מחדל: אדום / כחול), שעון סיבוב (30 / 45 / 60 שניות), והגבלת פס אופציונלית.
2. אפשר לסנן לפי קטגוריות: בית, אוכל, ספורט, טכנולוגיה, תרבות ישראלית, מקצועות.
3. המתאר רואה קלף עם מילת מטרה ו־4–5 מילים אסורות.
4. **נכון** = נקודה לקבוצה המתארת. **באז** = נאמרה מילה אסורה, נקודה ליריב. **פס** = דילוג בלי נקודה.
5. בסוף הסיבוב עוברים קבוצה. אפשר לסיים את המשחק בכל עת ולראות מי ניצח.

ההגדרות האחרונות נשמרות ב־`localStorage`. אין שרת, אין חשבונות, ואין סנכרון בין מכשירים.

## חפיסה מותאמת

אפשר לייבא JSON מהמסך הראשי. דוגמה: `public/custom-deck.example.json`.

```json
{
  "cards": [
    {
      "target": "חורף",
      "category": "כללי",
      "taboos": ["קור", "גשם", "מעיל", "שלג"]
    }
  ]
}
```

מתקבל גם מערך קלפים ישירות (`[{ "target": "...", "taboos": [...] }]`).
