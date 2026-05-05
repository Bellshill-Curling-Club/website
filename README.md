# Bellshill Curling Club Website

Modern static website built with [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com), hosted on **Azure Static Web Apps**, with a contact form powered by **Formspree**.

---

## Quick start (developers)

```bash
npm install
npm run dev      # local preview at http://localhost:4321
npm run build    # production build into ./dist
npm run preview  # preview the production build
```

Requires Node.js 18+.

---

## How committee members update the site

All edits can be made directly on github.com — no software to install.

### Update fixtures

1. Open `src/data/fixtures.json` on GitHub.
2. Click the pencil (Edit) icon.
3. Add or edit an entry, copying the existing pattern:
   ```json
   {
     "date": "2026-11-09",
     "time": "19:00",
     "opponent": "Stirling CC",
     "venue": "Lanarkshire Ice Rink",
     "competition": "League"
   }
   ```
4. Scroll down → **Commit changes**. The site updates within ~1 minute.

### Update scores (recent match results)

Same as fixtures, but edit `src/data/scores.json`. Use whole numbers for `us` and `them`. These appear under the **Recent Results** tab on the Scores page.

### Update internal competitions

The five club competitions live in **`src/data/competitions.json`**. Each entry becomes a tab on the Scores page. There are two table types — pick the one that matches the printed sheet you already produce.

#### A. Round-robin grid (Paterson, Cleland, McCall Salver, etc.)

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

#### B. Knockout cup (Bob Wilson, etc.)

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
      "score2": "8"
    },
    {
      "date": "15th Mar 2025",
      "round": "Final",
      "team1": "Iain Buchanan",
      "score1": "4 (4 ends)",
      "team2": "John Wilson",
      "score2": "4 (3 ends)"
    }
  ]
}
```

`score1` / `score2` are strings, so you can write things like `"4 (4 ends)"` for tiebreaks. `round` is optional — leave it as `""` if you don't want to label it.

#### Starting a new season

1. Update `season` (e.g. `"2026-27"`).
2. Replace the player names and clear the scores — easiest is to leave the structure in place and blank out the `scores` arrays and `stats` values. Empty competitions automatically show a "Results will appear here…" message.
3. Add results week by week as games are played.

Each tab is also linkable directly: `…/scores#paterson`, `…/scores#bob-wilson`, etc. — handy for sharing in WhatsApp / emails.

### Update club details

Edit `src/data/club.json` (address, season, contact email, etc).

### Edit the History page

Edit `src/pages/history.astro` — change the text between the headings.

### Add a new page

1. Copy `src/pages/history.astro` and rename, e.g. `src/pages/juniors.astro`.
2. Edit the title and content.
3. Open `src/components/Header.astro` and add a new link to the `links` array.

### Upload images

1. In GitHub, go to `public/images/`.
2. Click **Add file → Upload files**.
3. Reference the image as `/images/your-photo.jpg` in any page.

---

## Configuring the contact form (Formspree)

1. Sign up free at <https://formspree.io/>.
2. Create a new form. Set the recipient email (e.g. the secretary's address).
3. Copy the form's endpoint URL — it looks like `https://formspree.io/f/abcdwxyz`.
4. Edit `src/pages/contact.astro` and replace the value of `FORMSPREE_ENDPOINT` with your endpoint.
5. Commit. Done.

To change the recipient email later, just update it in the Formspree dashboard — no code change needed.

---

## Deployment (Azure Static Web Apps)

### One-time setup

1. Push this repo to GitHub.
2. In the Azure Portal: **Create a resource → Static Web App**.
3. Plan: **Free**. Source: **GitHub**. Pick your repo and the `main` branch.
4. Build presets: **Astro** (or set manually):
   - App location: `/`
   - Output location: `dist`
   - API location: _(leave blank)_
5. Click **Review + create**.

Azure will:

- Add a workflow file under `.github/workflows/` (this repo already includes a compatible one).
- Add the secret `AZURE_STATIC_WEB_APPS_API_TOKEN` to your GitHub repo automatically.
- Deploy your site to `https://<random-name>.azurestaticapps.net`.

### Custom domain

In your Static Web App resource → **Custom domains** → **Add** → follow the CNAME instructions for your DNS provider. SSL certificates are issued automatically.

### Subsequent deployments

Every push to `main` triggers a deploy. Every pull request gets a temporary preview URL.

---

## Project structure

```
.
├─ .github/workflows/        # GitHub Actions (Azure SWA deploy)
├─ public/                   # static assets served as-is (favicon, images)
├─ src/
│  ├─ components/            # Reusable UI (Header, Footer, Card, Button)
│  ├─ data/                  # club.json, fixtures.json, scores.json, competitions.json
│  ├─ layouts/               # BaseLayout.astro
│  ├─ pages/                 # Each .astro file becomes a route
│  └─ styles/                # global.css (Tailwind entry)
├─ astro.config.mjs
├─ tailwind.config.mjs
├─ staticwebapp.config.json  # Azure SWA routing/headers
└─ package.json
```

---

## Tech choices

- **Astro** — static HTML output, zero JS by default, great Lighthouse scores, simple file-based routing.
- **Tailwind CSS** — utility-first styling, no custom CSS to maintain.
- **Markdown / JSON in repo** — content lives next to the code, edited via GitHub web UI, no CMS to host.
- **Formspree** — handles contact form submissions without a backend.
- **Azure Static Web Apps (Free tier)** — global CDN, free SSL, GitHub-integrated CI/CD, PR previews.
