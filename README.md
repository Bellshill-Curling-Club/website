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

### Update scores
Same as fixtures, but edit `src/data/scores.json`. Use whole numbers for `us` and `them`.

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
   - API location: *(leave blank)*
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
│  ├─ data/                  # club.json, fixtures.json, scores.json
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
