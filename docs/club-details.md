# Club details, history, pages, images & contact form

## Update club details

Edit `src/data/club.json` (address, season, contact email, etc).

## Edit the History page

Edit `src/pages/history.astro` — change the text between the headings.

## Add a new page

1. Copy `src/pages/history.astro` and rename, e.g. `src/pages/juniors.astro`.
2. Edit the title and content.
3. Open `src/components/Header.astro` and add a new link to the `links` array.

## Upload images

1. In GitHub, go to `public/images/`.
2. Click **Add file → Upload files**.
3. Reference the image as `/images/your-photo.jpg` in any page.

## Configuring the contact form (Formspree)

1. Sign up free at <https://formspree.io/>.
2. Create a new form. Set the recipient email (e.g. the secretary's address).
3. Copy the form's endpoint URL — it looks like `https://formspree.io/f/abcdwxyz`.
4. Edit `src/pages/contact.astro` and replace the value of `FORMSPREE_ENDPOINT` with your endpoint.
5. Commit. Done.

To change the recipient email later, just update it in the Formspree dashboard — no code change needed.
