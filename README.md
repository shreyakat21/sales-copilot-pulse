# Pulse — Sales Call Copilot

Built for the iFIT Junior AI Engineer take-home assignment.

## What it is

A single-page tool that helps a sales rep during and after a customer call:

1. **Extract** — pulls structured facts (budget, space, goals, objection) out of raw call notes
2. **Recommend** — matches the best-fit product with a reason tied to what the customer said
3. **Respond** — drafts a tailored objection rebuttal and flags the upsell moment
4. **Log** — writes a CRM-ready call summary and follow-up email draft

Every call run also rolls up into a **Team Pulse** dashboard — objection counts and a running call log, so a manager can see patterns across the team without compiling anything by hand.

## Running it locally

No build step, no dependencies. Just open the file:

```bash
open index.html
```

Or serve it locally (recommended — some browsers restrict local file fetch calls):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Setup

1. Get a free API key at https://console.groq.com/keys
2. Open the page, paste your key into the "Groq key" field at the top (it's saved in your browser's local storage, never sent anywhere but Groq's API)
3. Try one of the sample scenarios or paste in your own call notes, hit "Run call"

## Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "Pulse: sales call copilot"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pulse.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Deploy from branch → main → save**. Live at `https://YOUR_USERNAME.github.io/pulse/`.

## Notes on architecture

- Single HTML file, vanilla JS, no framework — kept intentionally simple for a 90-minute build
- Uses Groq's free API (Llama 3.3 70B) via four sequential chat completion calls, one per stage
- The API key is entered client-side and stored in `localStorage`, not committed to the repo — this avoids putting a secret in a public GitHub repo. In production this would route through a backend proxy instead of a client-supplied key.
- "Team Pulse" data is in-memory only (resets on page reload) — a real version would persist this server-side, but the front end already renders the aggregate view it would need.
