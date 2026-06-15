# Editing the website content

All edits can be made directly on [github.com](https://github.com/Bellshill-Curling-Club/website) — no software to install. After you save (commit) a change, the website rebuilds itself automatically and goes live in about a minute.

> **Tip — try it safely first:** instead of clicking "Commit directly to the main branch", choose "Create a new branch and start a pull request". That gives you a temporary preview link to check before publishing. Anyone with edit rights can then click **Merge pull request** to make it live.

## 📅 Start-of-season checklist (do this each October)

When the new season begins and the fixture card is printed, follow these steps in order. You should not need to touch anything except the two files below.

1. **Update the fixtures page** — see [Updating fixtures](fixtures.md). This is where you put the rinks, reserves and match dates straight from the printed fixture card.
2. **Reset the competition standings** — see [Updating scores & competition tables](scores.md). At the start of the season you blank out last year's scores so each league starts fresh.
3. **Update the season label** — open `src/data/club.json`, change the `season` value (e.g. `"2026-27"`) and commit.
4. **Optional: archive last season's results** — if you want to keep a record, copy the old `competitions.json` into a file called something like `competitions-2024-25.json` in the same folder before you overwrite it. (It won't appear on the site, but it's there for reference.)

That's it. Through the season you only need to come back to add scores as games are played.

## Where to find each thing

| What you want to change                  | Go to                                          |
| ---------------------------------------- | ---------------------------------------------- |
| Fixtures (dates, rinks, reserves)        | [Updating fixtures](fixtures.md)               |
| Scores and competition tables            | [Updating scores](scores.md)                   |
| Club address, email, season label        | [Club details, history, pages, images](club-details.md) |
| History page wording                     | [Club details, history, pages, images](club-details.md#edit-the-history-page) |
| Add a new page (e.g. Juniors)            | [Club details, history, pages, images](club-details.md#add-a-new-page) |
| Upload a photo                           | [Club details, history, pages, images](club-details.md#upload-images) |
| Contact-form recipient                   | [Club details, history, pages, images](club-details.md#configuring-the-contact-form-formspree) |
