# Updating scores & competition tables (the Scores page)

The Scores page has one tab per competition plus a **Recent Results** tab for external matches. There are two files to know about:

| File                         | What it controls                                                                                   |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| `src/data/competitions.json` | The five internal-club competition tables (Paterson, Cleland, McCall Salver, Bob Wilson, Singles). |
| `src/data/scores.json`       | The "Recent Results" list of matches against other clubs.                                          |

## Recent results (matches vs other clubs)

1. Open `src/data/scores.json` on GitHub → ✏️ Edit.
2. Add a new entry at the top, copying the existing pattern:

   ```json
   {
     "date": "2026-11-09",
     "opponent": "Stirling CC",
     "competition": "League",
     "us": 7,
     "them": 5
   }
   ```

3. **Commit changes**. The Recent Results tab updates automatically — green for a win, red for a loss.

## Internal competition tables

The five club competitions live in **`src/data/competitions.json`**. Each entry becomes a tab on the Scores page. There are three table types — pick the one that matches the printed sheet.

### A. Round-robin grid (Paterson, Cleland, McCall Salver)

```json
{
  "slug": "paterson",
  "name": "Paterson Competition",
  "season": "2025-26",
  "type": "round-robin",
  "players": [
    "Iain Buchanan",
    "David Haggart",
    "John Wilson",
    "Sarah Lean",
    "Jonathan Buchanan"
  ],
  "rows": [
    {
      "player": "Iain Buchanan",
      "scores": ["", "8 - 3", "6 - 5", "5 - 9", "7 - 3"]
    }
  ],
  "stats": [
    { "label": "Points", "values": [2, 6, 2, 2, 8] },
    { "label": "Shots difference", "values": [-6, 9, -11, -14, 22] },
    { "label": "Position", "values": [3, 2, 4, 5, 1] }
  ]
}
```

Rules of thumb:

- `players` = the column headers, left to right.
- Each entry in `rows` is one row of the grid. `scores` must have **the same number of items as `players`** — use `""` for the diagonal (a player vs themselves).
- For **pairs competitions** (e.g. McCall Salver), make a player entry an array so the two names stack in the column header:

  ```json
  "players": [
    ["Stewart Carson", "Callum Jopling"],
    ["Stewart Turner", "Alan Turner"]
  ]
  ```

- `stats` is the footer — add as many rows as you need (`Points`, `Shots difference`, `Shots up`, `Ends won`, `Position`, …). The page automatically highlights `Position` = 1 with a 🏆.
- If the printed sheet has two rows per player (Cleland-style), just add two `rows` entries with the same `player` name.

### B. Knockout cup (Bob Wilson)

```json
{
  "slug": "bob-wilson",
  "name": "Bob Wilson Knock-Out Cup",
  "season": "2025-26",
  "type": "knockout",
  "matches": [
    {
      "date": "15th Feb 2025",
      "round": "Semi-final",
      "team1": "David Buchanan",
      "score1": "6",
      "team2": "Iain Buchanan",
      "score2": "8",
      "winner": 2
    },
    {
      "date": "15th Mar 2025",
      "round": "Final",
      "team1": "Iain Buchanan",
      "score1": "4 (4 ends)",
      "team2": "John Wilson",
      "score2": "4 (3 ends)",
      "winner": 1
    }
  ]
}
```

- `score1` / `score2` are written as text, so you can put things like `"4 (4 ends)"` for tiebreaks.
- `round` is optional — leave it as `""` if you don't want to label it.
- `winner` is optional, and only used on the **Final**. Set it to `1` if `team1` won, or `2` if `team2` won. The winning team gets a 🏆 next to their name.

### C. Singles competition (sections + play-off bracket)

The **Singles** is structured differently: players are split into small round-robin **sections**, and the section winners go through to a **play-off bracket** (quarter-finals → semi-finals → final). The page renders two parts: a grid of section tables, and a play-offs table underneath.

```json
{
  "slug": "singles",
  "name": "Singles",
  "subtitle": "19th Bellshill Singles",
  "season": "2025-26",
  "type": "singles",
  "intro": "Optional paragraph shown above the section tables.",
  "columns": ["Points", "Shots up", "Ends won", "Position"],
  "groups": [
    {
      "name": "Section 1",
      "rows": [
        { "player": "Joyce Cowie", "values": ["3 + 1", "+2  0", "2 + 1", 1] },
        { "player": "Alison Turner", "values": ["1 + 1", "0   0", "1 + 1", 2] },
        {
          "player": "Lindsey Haggart",
          "values": ["1 + 0", "0  -2", "1 + 1", 3]
        }
      ]
    }
  ],
  "bracket": {
    "quarterFinals": [
      {
        "team1": "Joyce Cowie",
        "team2": "Erin Roche",
        "score": "2 - 1",
        "winner": 1
      }
    ],
    "semiFinals": [
      {
        "team1": "Joyce Cowie",
        "team2": "Iain Buchanan",
        "score": "0 - 4",
        "winner": 2
      },
      {
        "team1": "Alan Turner",
        "team2": "Jonathan Buchanan",
        "score": "1 - 2",
        "winner": 2
      }
    ],
    "final": {
      "team1": "Iain Buchanan",
      "team2": "Jonathan Buchanan",
      "score": "1 - 1 + draw shot",
      "winner": 1,
      "notes": "Iain cut the button on the draw-shot decider to claim the title."
    }
  }
}
```

Rules of thumb:

- **`type`** must be exactly `"singles"` — that's what tells the page to render the sections + bracket layout (as opposed to the round-robin grid or the knockout list).
- **`columns`** is the list of column headers used inside every section table, in order. The **last column is treated as the position column** — whoever has a `1` in it gets the 🏆. Today we use `["Points", "Shots up", "Ends won", "Position"]`, but you can change the labels (or add/remove columns) as long as every row's `values` array has the same length.
- **`groups`** — one entry per section. Each `rows` entry needs a `player` and a `values` array matching the `columns`. Values are stored as text so you can copy the printed sheet exactly (e.g. `"3 + 1"`, `"+2  0"`); only the final position column should be a plain number so the 🏆 highlight works.
- **`intro`** is optional — a short paragraph above the section grid. Leave it out or set to `""` if not needed.
- **`bracket`** is optional. Each match takes `team1`, `team2`, a single `score` string (e.g. `"2 - 1"` or `"1 - 1 + draw shot"`), and `winner` set to `1` or `2`. The winner is shown in bold; the **Final winner** also gets a 🏆.
  - `quarterFinals` and `semiFinals` are arrays — add as many matches as were played, or use `[]` if that round wasn't needed.
  - `final` is a single object, not an array. It also supports an optional `notes` field that appears as an italic caption underneath the bracket.
- Leave `groups` empty (`[]`) at the start of the season — the page will show the friendly "Results will appear here…" message until you start filling it in.

## Resetting at the start of a new season

1. Update `season` (e.g. `"2026-27"`).
2. Replace the player names with this season's line-ups.
3. Blank out the scores — easiest is to leave the structure in place and:
   - clear every round-robin `scores` array entry to `""`,
   - set every `stats` value to `0` (or delete the `stats` block entirely),
   - empty the knockout `matches` list to `[]`,
   - for the **singles**, set `groups` to `[]` and either delete the `bracket` block or empty its arrays (`quarterFinals: []`, `semiFinals: []`) and remove the `final` object.
4. Empty competitions automatically show a friendly _"Results will appear here once the competition is under way"_ message until you start adding scores.

Each tab is also linkable directly: `…/scores#paterson`, `…/scores#bob-wilson`, etc. — handy for sharing in WhatsApp / emails.
