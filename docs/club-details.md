# Club details, history, pages, images & contact form

## Update club details

Edit `src/data/club.json` (address, season, contact email, etc).

## Update the committee list

The Committee page is generated from `src/data/club.json`, under the
`committee` key. There are two lists:

- `officeBearers` — each entry has a `role` (e.g. `"President"`) and a `name`.
- `members` — each entry has a `name` and an optional `note`
  (e.g. `"Immediate Past President"`).

Each entry also takes an optional `photo` field (see _Committee photos_ below).
If you don't want to set one, use `"photo": null` (or just leave the field out).

**Do not add phone numbers or personal addresses here** — the file is public.
Members can be contacted via the contact form.

### Add a new committee member

Open `src/data/club.json` and add a new entry to the relevant list. Examples:

```json
{ "role": "Junior Convenor", "name": "Jane Smith", "photo": null }
```

or, for an ordinary committee member:

```json
{ "name": "John Smith", "photo": null }
```

Commit the change and the page updates on the next deploy.

### Change someone's role

Edit the `role` value on their entry in `officeBearers`. If the same person
holds two roles (e.g. President and Treasurer), they appear twice — once per
role. That's intentional.

### Remove someone

Delete their entry (the whole `{ ... }` block including the trailing comma if
it's not the last item in the list) and commit.

### Committee photos

The Committee page automatically shows a round headshot for each person. If no
photo is available, it shows a coloured circle with the person's initials as a
placeholder — no action needed.

To add a real photo:

1. Crop the image to a **square** (roughly 320 × 320 px), centred on the face.
   JPEG is best for photos; PNG is fine if you need transparency.
2. Name the file using the person's name, **lowercase with hyphens**, e.g.:
   - Joyce Cowie → `joyce-cowie.jpg`
   - David Haggart → `david-haggart.jpg`
3. Upload it to `public/images/committee/` (in GitHub: navigate to that folder,
   then **Add file → Upload files**).
4. Commit. That's it — no JSON edit needed. The page picks it up automatically.

Supported extensions: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.

**Override the auto-match.** If you want to use a different filename, or share
one photo between two roles for the same person, set the `photo` field on the
entry in `club.json`:

```json
{
  "role": "President",
  "name": "Joyce Cowie",
  "photo": "/images/committee/joyce-2025.jpg"
}
```

An explicit `photo` always wins over auto-discovery.

**Replacing a photo.** Upload a new file with the same name (GitHub will ask
you to confirm overwriting it). Browsers may cache the old image for a short
while — a hard refresh (Ctrl+Shift+R / Cmd+Shift+R) shows the new one
immediately.

**Removing a photo.** Delete the file from `public/images/committee/` (and
unset the `photo` field if you'd set one). The card reverts to the initials
placeholder.

## Edit the History page

Edit `src/pages/history.astro` — change the text between the headings.

## Edit the Constitution page

Edit `src/pages/constitution.astro` — the constitution, bye-laws and etiquette
are plain HTML headings and paragraphs. Change the wording in place and commit.

## Add a new page

1. Copy `src/pages/history.astro` and rename, e.g. `src/pages/juniors.astro`.
2. Edit the title and content.
3. Open `src/components/Header.astro` and add a new link to the `links` array.

## Upload images

1. In GitHub, go to `public/images/`.
2. Click **Add file → Upload files**.
3. Reference the image as `/images/your-photo.jpg` in any page.

## Configuring the contact form (Formspree + Cloudflare Turnstile)

The contact form has two moving parts:

1. **Formspree** — delivers submissions to a real email address.
2. **Cloudflare Turnstile** — a privacy-friendly, invisible CAPTCHA that stops
   bot spam. Users stay on our site the whole time.

### Formspree setup

1. Sign up free at <https://formspree.io/>.
2. Create a new form. Set the recipient email (e.g. the secretary's address).
3. Copy the form's endpoint URL — it looks like `https://formspree.io/f/abcdwxyz`.
4. Edit `src/pages/contact.astro` and replace the value of `FORMSPREE_ENDPOINT`
   with your endpoint.
5. In the Formspree dashboard for the form, go to **Settings** and
   **disable the built-in reCAPTCHA**. If it's left on, the form will fail
   with a `403 Forbidden` error because Formspree's reCAPTCHA is not
   compatible with AJAX submissions.
6. Commit. Done.

To change the recipient email later, just update it in the Formspree dashboard
— no code change needed.

### Cloudflare Turnstile setup

1. Sign in to <https://dash.cloudflare.com/> (free account).
2. Go to **Turnstile** in the left sidebar → **Add site**.
3. Give it a name (e.g. "Bellshill Curling Club contact form"), pick
   **Managed** widget mode.
4. Under **Hostname management**, add every hostname the form will load on:
   - `bellshillcurlingclub.com`
   - `www.bellshillcurlingclub.com`
   - `localhost` (only if you plan to test with `npm run dev`)
   - Any Azure Static Web App preview URL you want to test on
     (e.g. `salmon-ground-…-preview-….azurestaticapps.net`)
5. Copy the **Site key** (starts with `0x...`).
6. Edit `src/pages/contact.astro` and replace the value of
   `TURNSTILE_SITE_KEY`.
7. **Never commit or share the Secret Key.** It is not used by this website
   (we have no backend to verify tokens with) and would be a security risk
   if leaked. If you accidentally exposed it, rotate it in the Cloudflare
   dashboard.

The Content Security Policy in `staticwebapp.config.json` already permits
Cloudflare Turnstile. If you ever move to a different CAPTCHA or spam
protection service, you'll need to update the CSP too — see the note in
`docs/project-structure.md`.
