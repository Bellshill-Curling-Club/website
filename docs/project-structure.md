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
- **Cloudflare Turnstile** — privacy-friendly, cookieless spam protection on the contact form (see [`docs/club-details.md`](club-details.md#cloudflare-turnstile-setup)).
- **Azure Static Web Apps (Free tier)** — global CDN, free SSL, GitHub-integrated CI/CD, PR previews.

## Content Security Policy (CSP)

`staticwebapp.config.json` sets a strict `Content-Security-Policy` header
that only allows scripts, styles, images, fonts, iframes and network
connections from a specific allow-list of origins. Currently permitted:

- `self` (this site)
- `https://formspree.io` — contact form submissions
- `https://challenges.cloudflare.com` — Cloudflare Turnstile widget + iframe

**If you add any new third-party script, iframe, font, image host or API
endpoint, you must also update the CSP** in
`staticwebapp.config.json` or the browser will block it (you will see a
`Content Security Policy directive` error in the console). Update the
matching directive: `script-src` for scripts, `frame-src` for iframes,
`connect-src` for `fetch`/`XMLHttpRequest`, `img-src` for images,
`font-src` for fonts, `style-src` for stylesheets.
