# Project structure & tech choices

## Project structure

```text
.
├─ .github/workflows/        # GitHub Actions (Azure SWA deploy + nightly cleanup)
├─ docs/                     # Maintainer documentation
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

## Tech choices

- **Astro** — static HTML output, zero JS by default, great Lighthouse scores, simple file-based routing.
- **Tailwind CSS** — utility-first styling, no custom CSS to maintain.
- **Markdown / JSON in repo** — content lives next to the code, edited via GitHub web UI, no CMS to host.
- **Formspree** — handles contact form submissions without a backend.
- **Azure Static Web Apps (Free tier)** — global CDN, free SSL, GitHub-integrated CI/CD, PR previews.
