# Bellshill Curling Club Website

Modern static website built with [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com), hosted on **Azure Static Web Apps**, with a contact form powered by **Formspree**, spam protection from **Cloudflare Turnstile**, and cookieless analytics from **Lite Analytics**.


## Quick start (developers)

```bash
npm install
npm run dev      # local preview at http://localhost:4321
npm run build    # production build into ./dist
npm run preview  # preview the production build
```

Requires Node.js 18+.

## Documentation

All maintainer documentation lives in [`docs/`](docs/). Pick the topic you need:

### For committee members (editing the site content)

- **[Editing the website content](docs/editing-content.md)** — overview, the start-of-season checklist, and a "where to find each thing" table.
- **[Updating fixtures](docs/fixtures.md)** — how to edit `src/data/fixtures.json` for rinks, reserves and match dates.
- **[Updating scores & competition tables](docs/scores.md)** — how to edit `src/data/scores.json` and `src/data/competitions.json` (round-robin, knockout, singles).
- **[Club details, history, new pages, images & contact form](docs/club-details.md)** — everything else you might want to change.

### For developers / repo owners

- **[Deployment (Azure Static Web Apps)](docs/deployment.md)** — what the workflows do and why, full one-time auth setup (Entra ID App Registration, OIDC federated credentials, secrets & variables), how to run the nightly cleanup manually, and a troubleshooting table.
- **[Project structure & tech choices](docs/project-structure.md)** — the folder layout and why each tool was picked.
