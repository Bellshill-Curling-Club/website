# Updating the Past Winners page

The **Past Winners** page (`/past-winners/`) lists every recorded winner and runner-up of the club's four internal trophies going back to 2004:

- The Paterson Trophy (four-person league)
- The Bob Wilson Knock-Out Cup (four-person knock-out)
- The McCall Salver (pairs)
- The Cleland Trophy (four-person "Thirds'" league)

All the data lives in a single file: **`src/data/trophy-winners.json`**. Editing that file and committing is all you need to do — the page rebuilds automatically.

> **Bigger picture:** the file also drives the research document [`bellshill-curling-club-trophy-results-2004-2026.md`](../bellshill-curling-club-trophy-results-2004-2026.md) which records the sources behind older results. You don't need to touch that document to add a new season — just the JSON.

## 📅 End-of-season checklist

When the AGM has confirmed the season's winners:

1. Open `src/data/trophy-winners.json` on GitHub.
2. Add a new entry at the **end** of each of the four `results` arrays (`paterson.results`, `wilson.results`, `mccall.results`, `cleland.results`). See the templates below.
3. Commit. The page re-orders entries most-recent-first automatically.

## File structure

The file has four top-level keys — one per trophy — plus a `sourceNote` at the top:

```json
{
  "sourceNote": "...",
  "paterson": { "name": "...", "format": "...", "type": "team", "results": [ ... ] },
  "wilson":   { "name": "...", "format": "...", "type": "team", "results": [ ... ] },
  "mccall":   { "name": "...", "format": "...", "type": "pairs", "results": [ ... ] },
  "cleland":  { "name": "...", "format": "...", "type": "team", "results": [ ... ] }
}
```

You never need to touch `name`, `format` or `type`. Everything else is inside `results`.

## Team competitions (Paterson, Bob Wilson KO, Cleland)

### With full positions (preferred — when you know who was Skip/Third/Second/Lead)

This is the format the club now uses for all recent seasons, taken straight from the fixture card.

```json
{
  "year": 2026,
  "season": "2025-26",
  "winner": {
    "skip": "Jonathan Buchanan",
    "third": "Erin Roche",
    "second": "Stewart Carson",
    "lead": "Matthew Gray"
  },
  "runnerUp": {
    "skip": "David Haggart",
    "third": "David Buchanan",
    "second": "Emily Haggart",
    "lead": "Stewart Turner",
    "note": "Runners-up receive the Mercer Rosebowl"
  }
}
```

Field-by-field:

| Field                                       | What it means                                                                                                 |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `year`                                      | The calendar year the trophy was **awarded** (spring). So the 2025-26 season → `2026`.                        |
| `season`                                    | The two-year season label, e.g. `"2025-26"`.                                                                  |
| `winner.skip` / `third` / `second` / `lead` | The four position names. All four are required for a labelled team.                                           |
| `runnerUp.*`                                | Same four fields for the runner-up.                                                                           |
| `runnerUp.note` _(optional)_                | Trophy given to the runner-up, e.g. Mercer Rosebowl (Paterson), Clark Trophy (Cleland). See existing entries. |

### With a substitution

If someone substituted on the day, add a `note` to the winner/runner-up block:

```json
"winner": {
  "skip":   "David Buchanan",
  "third":  "Michael Barr",
  "second": "Emily Haggart",
  "lead":   "Emily Ward",
  "note":   "Michael Barr substituted for David Haggart, who appeared as Third on the fixture card"
}
```

### If you don't know the positions

You can list the four players in the order the source gave you and set `positionsLabelled: false`. The page will show a plain bullet list instead of a position table.

```json
"winner": {
  "players": ["Player A", "Player B", "Player C", "Player D"],
  "positionsLabelled": false
}
```

This is the fallback the older 2022-24 entries used before the fixture cards were checked. Prefer the labelled format above whenever you can.

### If a runner-up wasn't recorded

Use `null`:

```json
"runnerUp": null,
"runnerUpNote": "Runner-up not supplied"
```

## McCall Salver (pairs)

Pairs entries are simpler — just two names, no positions:

```json
{
  "year": 2026,
  "season": "2025-26",
  "winner": { "players": ["Iain Buchanan", "Joyce Cowie"] },
  "runnerUp": { "players": ["Jonathan Buchanan", "David Buchanan"] }
}
```

Notes on substitutions or trophies awarded to the runner-up use the same `note` field as team entries.

## Where to check your JSON is valid

If the site fails to build after your edit, it's almost certainly a JSON syntax error — a missing comma between entries, or a trailing comma after the last entry. You can paste the file into <https://jsonlint.com/> to see the exact line that's wrong before you commit.

## Removing or correcting an old entry

To fix a name spelling or a position, edit the entry in place. To remove an entry entirely, delete the whole `{ ... }` block (including its trailing comma if it's not the last entry in the array).

## Adding a new competition

The four trophies are hard-coded in the page (`src/pages/past-winners.astro`, in the `trophyOrder` array). If the club ever adds a fifth internal competition to the trophy list, add a new top-level key to `trophy-winners.json` (following the same shape as `paterson`) and add it to `trophyOrder` in the page.
