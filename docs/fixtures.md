# Updating fixtures (the Fixtures page)

The Fixtures page shows all five club competitions as tabs. Everything on it comes from one file: **`src/data/fixtures.json`**.

1. On GitHub, open `src/data/fixtures.json`.
2. Click the pencil (✏️ Edit) icon.
3. For each competition, update three things from the printed fixture card:
   - **`rinks`** — the list of teams (Skip / Third / Second / Lead) or pairs.
   - **`reserves`** — the names listed as reserves.
   - **`fixtures`** — the dates, times and matches (e.g. `"1 v 2"`).
4. Scroll to the bottom → **Commit changes**.

Example of one competition entry — copy the shape exactly, just change the values:

```json
{
  "slug": "paterson",
  "name": "The Paterson Trophy",
  "format": "Five rinks playing a round-robin league throughout the season.",
  "rinks": [
    {
      "label": "Rink 1",
      "skip": "I Buchanan",
      "third": "A P Turner",
      "second": "J Ward",
      "lead": "C Jopling"
    },
    {
      "label": "Rink 2",
      "skip": "D Haggart",
      "third": "D Buchanan",
      "second": "E Haggart",
      "lead": "S Turner"
    }
  ],
  "reserves": ["M Barr", "H Burke", "L Haggart"],
  "fixtures": [
    { "date": "2025-10-17", "time": "20:15", "match": "3 v 4" },
    { "date": "2025-10-31", "time": "20:15", "match": "1 v 5" }
  ]
}
```

## Rules of thumb

- **Dates** must be written `YYYY-MM-DD` (year-month-day). The page formats them nicely for you.
- **Times** are 24-hour, e.g. `"20:15"` for 8:15pm.
- For **pairs / singles** competitions, swap the four-player rink for a `players` list:

  ```json
  { "label": "Pair 1", "players": ["S Carson", "C Jopling"] }
  ```

- Don't change `slug` — it's used in the tab links.
- Past dates are automatically greyed out, so you don't have to remove them as the season progresses.
