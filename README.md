# Pulse — Sales Call Copilot

Built for the iFIT Junior AI Engineer take-home assignment.

## What it is

A single-page tool that helps a sales rep during and after a customer call:

1. **Extract** — pulls structured facts (budget, space, goals, objection) out of raw call notes
2. **Recommend** — matches the best-fit product with a reason tied to what the customer said
3. **Respond** — drafts a tailored objection rebuttal and flags the upsell moment
4. **Log** — writes CRM record fields (shaped as Salesforce `Task`/`Opportunity` fields) and a follow-up email draft

Every call run also rolls up into a **Team Pulse** dashboard — objection counts, most-recommended product, and a running call log a manager can export to CSV, so patterns across the team are visible without compiling anything by hand.

## Features

**Call Assistant**
- Free-form input, or one-click sample scenarios to try it instantly
- Four-stage pipeline, each stage visible as its own card as it completes
- Per-stage latency badge (e.g. `434ms`) showing real API response time
- One-click copy on the generated follow-up email
- "New call" button to reset and run another scenario

**Team Pulse**
- Session stats: calls logged, top objection, most-recommended product
- Objection frequency bar chart
- Full call log table, exportable to CSV

## Technologies used

- **HTML5** — single-page structure, no templating
- **CSS3** — custom properties (CSS variables) for theming, flexbox/grid layout, no framework or preprocessor
- **JavaScript (ES6+, vanilla)** — no build step, no bundler, no frontend framework
- **Groq API** (`openai/gpt-oss-20b`) — LLM inference, called via `fetch` with JSON-mode structured output
- **Fetch API** — all HTTP calls to Groq
- **Web Storage API (`localStorage`)** — persists the user's API key client-side between visits
- **Clipboard API** (`navigator.clipboard`) — one-click copy on the generated email draft
- **Blob / URL API** — generates and downloads the CSV export client-side, no server involved
- **Git & GitHub** — version control and source hosting
- **GitHub Pages** — static hosting/deployment, no backend server

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

- Single HTML file, vanilla JS, no framework — kept intentionally simple for a fast build
- Uses Groq's free API (`openai/gpt-oss-20b`) via four sequential chat completion calls, one per stage, each using JSON mode for structured output
- The API key is entered client-side and stored in `localStorage`, not committed to the repo — this avoids putting a secret in a public GitHub repo. In production this would route through a backend proxy instead of a client-supplied key.
- "Team Pulse" data is in-memory only (resets on page reload) — a real version would persist this server-side, but the front end already renders the aggregate view and CSV export it would need.

## Design decisions — why I built it this way

- **Four sequential stages instead of one big prompt.** Each stage (Extract → Recommend → Respond → Log) is a separate, inspectable API call rather than one call doing everything. That makes the reasoning traceable — a rep or manager can see exactly what the AI concluded at each step instead of getting an opaque final answer, which matters for a role that requires explaining solutions to both technical and non-technical teammates.

- **Two stages for productivity, two for revenue.** Extract and Log eliminate the manual work of taking notes and writing them up. Recommend and Respond are the "help them close more deals" half — better product fit, better objection handling in the moment. I split it this way on purpose so the tool visibly addresses both halves of the assignment prompt, not just one.

- **Fully interactive, not a canned demo.** The input is a free-text box, not a fixed scenario — anyone reviewing it can type their own customer conversation and get a live result. Sample buttons exist only to make it easy to try instantly, not to replace real input.

- **A Team Pulse dashboard, not just a single-call tool.** Most versions of this assignment probably stop at "type in a call, get a response." I added a rollup view because the actual JD calls out building "dashboards, reporting tools, and lightweight applications" for Commercial teams — a single-rep tool doesn't show that, a team-level view does.

- **Groq instead of a hosted AI-platform demo.** I originally prototyped this using Claude directly, but switched to a real, standalone deployment (Groq API + GitHub Pages) so this is an actual shipped artifact — a live link, a real repo, a real API integration — rather than something that only runs inside another product's environment. That's a closer match to "built automations, AI tools, scripts, or applications" in the qualifications.

- **API key entered client-side and stored in `localStorage`, not hardcoded.** A real production tool would route this through a backend so the key is never exposed. For a static, no-backend deployment, hardcoding a key into a public repo would be worse than asking the user to supply their own — so I made that tradeoff explicit rather than hiding it.

- **Log stage output shaped as Salesforce fields (`Task.Subject`, `Task.Description`, `Opportunity.StageName`)**, instead of generic "summary" text. Salesforce isn't required for this role, but it is one of the platforms mentioned, so I shaped the output to show I understand what a real integration target would look like, even without building real OAuth.

- **Per-stage latency badges.** This is the one addition that's about being an *AI engineer* specifically rather than just a builder — it surfaces real model response time per call, which is a first step toward the kind of performance/cost awareness the JD asks for under "evaluate emerging AI tools and recommend opportunities to improve efficiency."

- **CSV export on the Team Pulse log.** A dashboard a manager can look at but not export from is only half useful — exporting ties directly back to the "reporting tools" line in the JD and is the kind of thing a rep's manager would actually ask for first.

- **Copy-to-clipboard on the follow-up email.** A small detail, but it's the difference between "the AI wrote something" and "the rep can actually use it in one click" — consistent with the tool's whole goal of removing manual steps, not just generating text.
