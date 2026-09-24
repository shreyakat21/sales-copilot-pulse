# Pulse — Sales Call Copilot

An AI copilot for SDRs, BDRs, and AEs. Drop in a call transcript from Zoom, Teams, Gong, Otter, or any other recorder (or just your notes), and Pulse qualifies the prospect, handles every objection they raised, recommends the right product from *your* catalog, and writes the CRM record, follow-up email, LinkedIn message, and call coaching. A live mode gives you a response to an objection in about a second while you're still on the call.

## What it is

A single-page tool that helps a sales rep during and after a customer call, for any company and product line:

1. **Extract** — reads the transcript or notes and pulls out BANT qualification, pain points, every objection (with the prospect's exact words), competitors, buying signals, and the call outcome
2. **Recommend** — matches the best-fit product from your catalog, rates the fit, and explains why using what the prospect said
3. **Objections** — for each objection: what to say, and a follow-up question to keep the conversation going; plus the next best action and discovery questions for next time
4. **Log & follow up** — CRM fields (shaped as Salesforce `Task`/`Opportunity` fields), a follow-up email, a LinkedIn message, and coaching on what went well and what to improve

Every analyzed call also rolls up into a **Team Pulse** dashboard — objections by type, meetings booked, most-recommended product, and a running call log a manager can export to CSV, so patterns across the team are visible without compiling anything by hand.

## Features

**Your company & products**
- Set your company name and product catalog (one product per line) — Pulse recommends only from that list and signs follow-up emails with your company name
- Ships with an example catalog (a fictional B2B software company) so it works out of the box
- Saved in the browser, so each rep's catalog sticks between visits

**Transcript import**
- Paste a transcript or upload / drag in a file: WebVTT (`.vtt`) and SubRip (`.srt`) from Zoom, Teams, and Google Meet; text exports from Gong, Chorus, Otter, and Fireflies; or any plain `Name: text` transcript, with or without timestamps
- Detects speakers automatically, guesses which one is the rep (you can change it, and Pulse remembers your name)
- Call metrics computed in the browser, no AI needed: rep vs. prospect talk time, questions asked, longest rep monologue, and call length
- Long calls are condensed to fit the model's limits, keeping the prospect's words first since that's where objections are

**Call Analysis**
- Transcript, notes, or one-click samples (a cold call, a Teams discovery call, and three note-style scenarios)
- Four-stage pipeline, each stage visible as its own card as it completes, with a per-stage latency badge
- One-click copy on each objection response, the follow-up email, and the LinkedIn message
- Automatically waits and retries if the free Groq rate limit is hit

**Live Objections**
- For use during a call: type what the prospect just said (or tap a common one like "Just send me an email") and press Enter
- Returns what to say, a follow-up question, and an alternative approach, based on your catalog
- Keeps a running list of the objections from the current call

**Team Pulse** dashboard — objections by type, meetings booked, most-recommended product, and a running call log a manager can export to CSV, so patterns across the team are visible without compiling anything by hand.

## Features

**Your company & products**
- Set your company name and product catalog (one product per line) — Pulse recommends only from that list and signs follow-up emails with your company name
- Ships with an example catalog (a fictional B2B software company) so it works out of the box
- Saved in the browser, so each rep's catalog sticks between visits

**Call Assistant**
- Free-form input, or one-click sample scenarios to try it instantly
- Four-stage pipeline, each stage visible as its own card as it completes
- Per-stage latency badge (e.g. `434ms`) showing real API response time
- One-click copy on the generated follow-up email
- "New call" button to reset and run another scenario

**Team Pulse**
- Session stats: calls logged, top objection type, most-recommended product, meetings booked
- Objections-by-type bar chart
- Full call log table, exportable to CSV

## Technologies used

- **HTML5** — single-page structure, no templating
- **CSS3** — custom properties (CSS variables) for theming, flexbox/grid layout, no framework or preprocessor
- **JavaScript (ES6+, vanilla)** — no build step, no bundler, no frontend framework
- **Groq API** (`openai/gpt-oss-20b`) — LLM inference with JSON-mode structured output
- **Fetch API** — all HTTP calls to Groq
- **Web Storage API (`localStorage`)** — remembers each user's company name, product catalog, and rep name
- **FileReader API** — reads uploaded transcript files in the browser; nothing is uploaded to a server
- **Clipboard API** (`navigator.clipboard`) — one-click copy on the generated email draft
- **Blob / URL API** — generates and downloads the CSV export client-side, no server involved
- **Git & GitHub** — version control and source hosting
- **GitHub Pages** — static hosting/deployment, no backend server

## Running it locally

No build step, no dependencies, no API key needed:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

Push to `main`; GitHub Pages deploys from the `main` branch. The Groq key ships in `config.js`, so the live site works for anyone with the link.

## Notes on architecture

- Single HTML file, vanilla JS, no framework — kept intentionally simple for a fast build
- Uses Groq's API (`openai/gpt-oss-20b`, low reasoning effort) via four sequential chat completion calls, one per stage, each using JSON mode for structured output
- Transcripts are parsed in the browser into speaker turns, relabeled as `REP` / `PROSPECT`, and condensed to ~10k characters if needed. Only the Extract stage sees the transcript; later stages work from its structured output, which keeps each run within Groq's free-tier limit of 8,000 tokens per minute
- The Groq key is bundled in `config.js` so visitors can use the tool without signing up for anything. Because it's a static site, that key is visible to anyone who inspects the page; the tradeoff is accepted for a demo, and the fix for production is a small backend proxy (e.g. a serverless function) that holds the key server-side.
- "Team Pulse" data is in-memory only (resets on page reload) — a real version would persist this server-side, but the front end already renders the aggregate view and CSV export it would need.

## Design decisions — why I built it this way

- **Transcripts in, not just notes.** Reps don't take good notes during calls, but almost every team already records them. Accepting the transcript exports those tools produce means Pulse works from what the prospect *actually* said, which is also what makes verbatim objection quotes and talk-time coaching possible.

- **Metrics in code, judgment in the model.** Talk ratio, question count, and monologue length are computed deterministically from the parsed transcript instead of asking the model to estimate them. The model gets those numbers as input for coaching, so it can't make them up.

- **A live mode for objections.** Post-call analysis helps next time; SDRs also need help in the moment. The Live Objections tab is a single fast call with a short prompt, built to answer in about a second.

- **Four sequential stages instead of one big prompt.** Each stage (Extract → Recommend → Objections → Log & follow up) is a separate, inspectable API call rather than one call doing everything. That makes the reasoning traceable — a rep or manager can see exactly what the AI concluded at each step instead of getting an opaque final answer, which matters when reps and managers need to trust and explain what the tool suggested.

- **Two stages for productivity, two for revenue.** Extract and Log eliminate the manual work of taking notes and writing them up. Recommend and Objections are the "help them close more deals" half — better product fit, better objection handling in the moment. Splitting it this way means the tool saves reps time *and* helps them sell, not just one or the other.

- **Fully interactive, not a canned demo.** The input is a free-text box, not a fixed scenario — anyone can type their own customer conversation and get a live result. Sample buttons exist only to make it easy to try instantly, not to replace real input.

- **Bring-your-own catalog instead of hardcoded products.** Pulse started as a tool for a single company's product line. Making the company name and catalog editable turns it into a general sales copilot: the same four-stage pipeline works for SaaS plans, hardware, services, or anything else a rep sells, and the model is constrained to recommend only what's actually in the list.

- **A Team Pulse dashboard, not just a single-call tool.** A "type in a call, get a response" tool only helps one rep in the moment. The rollup view shows a manager patterns across calls — which objections keep coming up, which products get recommended most — without anyone compiling notes by hand.

- **Groq instead of a hosted AI-platform demo.** I originally prototyped this using Claude directly, but switched to a real, standalone deployment (Groq API + GitHub Pages) so this is an actual shipped artifact — a live link, a real repo, a real API integration — rather than something that only runs inside another product's environment.

- **A bundled API key instead of a user-supplied one.** The first version asked each user to paste their own Groq key, which meant nobody could try the tool without signing up for Groq first. I bundled a key with the site so anyone with the link can use it immediately. On a static host that key is public, so I capped output tokens per call and would move it behind a serverless proxy (with origin checks and rate limiting) before any real production use.

- **Log stage output shaped as Salesforce fields (`Task.Subject`, `Task.Description`, `Opportunity.StageName`)**, instead of generic "summary" text. Salesforce is the most common CRM, so shaping the output to its fields shows what a real integration target would look like, even without building real OAuth.

- **Per-stage latency badges.** This surfaces real model response time per call — a first step toward the performance and cost awareness needed to evaluate and compare AI models in production.

- **CSV export on the Team Pulse log.** A dashboard a manager can look at but not export from is only half useful — exporting is the kind of thing a sales manager would actually ask for first.

- **Copy-to-clipboard on the follow-up email.** A small detail, but it's the difference between "the AI wrote something" and "the rep can actually use it in one click" — consistent with the tool's whole goal of removing manual steps, not just generating text.
