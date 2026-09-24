# Pulse — AI Sales Copilot

**Live:** https://shreyakat21.github.io/sales-copilot-pulse/

Pulse is an AI copilot for SDRs, BDRs, and AEs. It helps during a sales call and after it:

- **During the call**, it listens to both sides, transcribes them live, and suggests what to say the moment the prospect pushes back.
- **After the call**, it takes the transcript (or your notes) and qualifies the prospect, handles every objection they raised, recommends the right product from *your* catalog, and writes the CRM record, follow-up email, LinkedIn message, and coaching notes.

It's a single static web page with no sign-up. It works for any company: set your company name and product list once and every output is tailored to it.

---

## Features

### Call analysis
Paste a transcript or notes, upload a file, or try a sample, then click **Analyze call** (or press Ctrl/⌘ + Enter). Four stages run in order, each shown with its own progress step and response time:

1. **Qualify** — call type, outcome, sentiment, prospect details, BANT (budget, authority, need, timeline), pain points, competitors and current tools, buying signals, and every objection with the prospect's own words
2. **Recommend** — the best-fit product from your catalog, a fit rating (strong / moderate / weak), and the reason, checked against facts like team size
3. **Objections** — for each objection: what to say and a follow-up question to keep the conversation going, plus the next best action, three discovery questions for next time, and an upsell note
4. **Follow up** — CRM fields shaped like Salesforce `Task` and `Opportunity` records, a follow-up email, a LinkedIn message, and coaching on what went well and what to improve

Every response, the email, the LinkedIn message, and the CRM fields have one-click **Copy** buttons.

### Transcript import
- Accepts WebVTT (`.vtt`) and SubRip (`.srt`) files from Zoom, Teams, and Google Meet; text exports from Gong, Chorus, Otter, and Fireflies; and any plain `Name: text` transcript, with or without timestamps. Paste it, upload it, or drag the file onto the box
- Detects the speakers and guesses which one is the rep (you can change it, and Pulse remembers your name)
- Condenses long calls to fit the model's limits, keeping the prospect's words first since that's where the objections are

### Quote verification
Every objection quote the AI returns is checked against the transcript in code and labeled:
- **✓ Verbatim** — found word-for-word in what the prospect said
- **≈ Near-verbatim** — matches with small differences
- **⚠ Said by rep** — the words came from the rep, not the prospect
- **⚠ Not in transcript** — not found; the AI may have paraphrased or invented it

A summary like "2/2 quotes verified" shows at a glance how much of the output is grounded in the call.

### Call metrics
Computed directly from the transcript (no AI): rep vs. prospect talk time, questions the rep asked, the rep's longest monologue, number of turns, and call length. These numbers are passed to the coaching step, so the coaching is based on measurements rather than the model's guesses.

### Live call
- Click **Start listening**, allow your microphone, and share the tab your call is in (Zoom, Meet, or Teams on the web) with **Share tab audio**, or share your entire screen with **Share system audio** for a desktop app or dialer
- Your mic and the call audio are captured as **separate streams**, so every line is labeled **You** or **Prospect** exactly, with no guessing about who's talking
- Speech is split into utterances and transcribed by Groq Whisper a few seconds after each person finishes speaking
- Each new prospect line is checked for objections in the background; when one comes up, a **suggested response and follow-up question pop up**, ready to copy
- If you're on speakers and your mic picks up the prospect, those duplicate lines are dropped
- When the call ends, **Analyze full call** sends the transcript through the full four-stage analysis
- A typed fallback is below it: type what the prospect just said, or tap a common objection like "Just send me an email", and get a response in about a second
- Works in Chrome and Edge on a computer. Use headphones on real calls

### Saved history and Team Pulse
- Every analysis is saved in the browser. **Recent calls** on the home screen and the Team Pulse call log reopen any past analysis with one click
- **Team Pulse** shows calls analyzed, top objection type, most-recommended product, meetings booked, an objections-by-type chart, and the full call log
- Export the call log to CSV, or clear the history

### Your company and products
Set your company name and product catalog (one product per line: `Name — who it's for / key points`) from the **Selling for** button. Pulse recommends only from that list, handles objections using it, and signs emails with your company name. It ships with an example catalog for a fictional software company (Acme Cloud), so it works right away.

### Samples
One-click samples to try it instantly: an SDR cold call transcript, a Teams discovery call (`.vtt`), and three note-style scenarios (price objection, comparing vendors, just browsing).

---

## How it works

```
                 ┌──────────── Call analysis ────────────┐
 transcript ──►  │ parse speakers → condense → 1 Qualify │──► 2 Recommend ──► 3 Objections ──► 4 Follow up
 or notes        │ (in the browser)          (sees text) │     (all later stages work from Qualify's structured output)
                 └───────────────────────────────────────┘
                     ▲ quote verification + call metrics run in code

 Live call:  mic ─────┐                               ┌─► live transcript (You / Prospect)
                      ├─► voice detection ─► Whisper ─┤
 call audio ──────────┘   (per stream)                └─► new prospect line ─► objection check ─► suggestion pop-up
```

- **Models (Groq):** `openai/gpt-oss-20b` for analysis (JSON-mode structured output, low reasoning effort) and `whisper-large-v3-turbo` for live transcription
- **Staying within the free tier:** only the Qualify stage sees the transcript, and later stages use its structured output. This keeps a full analysis within Groq's free limit of 8,000 tokens per minute. Live audio is sent one utterance at a time and silent clips are skipped
- **Reliability:** automatically waits and retries when the rate limit is hit, retries when the model returns malformed JSON, maps objection categories to a fixed list in code so the dashboard stays consistent, and escapes all model output before displaying it
- **Grounding:** prompts forbid inventing prices, timelines, results, integrations, or attachments that aren't in the call or catalog, and quotes are verified against the transcript in code
- **Storage:** call history, the catalog, and the rep's name are saved in the browser's `localStorage`. There's no server or database
- **Privacy:** transcripts, notes, and live call audio are sent to Groq for processing. Nothing is sent anywhere else

### Project structure
```
index.html                     the entire app: markup, styles, and JavaScript
scripts/build-config.mjs       writes config.js (the Groq key) from .env or a GitHub secret
.github/workflows/deploy.yml   builds config.js from the secret and deploys to GitHub Pages
```

---

## Tech stack

- **HTML, CSS, and vanilla JavaScript** — one file, no framework, no bundler
- **Groq API** — `openai/gpt-oss-20b` (chat, JSON mode) and `whisper-large-v3-turbo` (speech-to-text)
- **Browser APIs** — MediaDevices (`getUserMedia`, `getDisplayMedia`), MediaRecorder, and Web Audio for live listening and voice detection; FileReader for transcript uploads; Clipboard; `localStorage`; Blob/URL for CSV export
- **GitHub Actions + GitHub Pages** — builds with the key from a repository secret and deploys on every push to `main`
- **Node.js** — a small build script that generates `config.js`

---

## Running it locally

1. Create a `.env` file next to `index.html` (it's gitignored):
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```
   Get a free key at https://console.groq.com/keys.
2. Generate `config.js` from it (also gitignored):
   ```bash
   node scripts/build-config.mjs
   ```
3. Serve the folder and open it (the Live call mode needs `localhost` or `https` to use the mic):
   ```bash
   python3 -m http.server 8000
   # then visit http://localhost:8000
   ```

## Deploying

The Groq key is never committed. It's stored as a GitHub Actions secret and written into `config.js` at deploy time.

One-time setup in the GitHub repo:
1. **Settings → Secrets and variables → Actions → New repository secret:** name `GROQ_API_KEY`, value your Groq key
2. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**

After that, every push to `main` builds and deploys the site automatically (see the **Actions** tab).

---

## Limitations and what I'd do next

- **The key is visible on the live page.** It's kept out of the repo, but a static site has to hand the key to the browser. For production I'd move model calls behind a small serverless proxy with origin checks and per-user rate limits.
- **Free-tier limits.** Groq's free tier allows about an hour of two-sided live audio per hour and 8,000 analysis tokens per minute. Pulse waits and retries when it hits a limit, but heavy use would need a paid tier.
- **Live mode needs Chrome or Edge on a computer**, since other browsers can't share tab or system audio.
- **History is per browser.** A team version would store calls in a shared database so managers see every rep's calls.
- **CRM output is formatted, not synced.** The fields are shaped for Salesforce but copied by hand; a real integration would write them through the Salesforce API.
- **Evaluation.** Next I'd add a small test set of labeled transcripts to measure objection recall and quote accuracy across models and prompts.

---

## Design decisions — why I built it this way

- **Transcripts in, not just notes.** Reps don't take good notes during calls, but most teams already record them. Working from the transcript means Pulse knows what the prospect actually said, which is also what makes quote verification and talk-time coaching possible.

- **Listen to the call instead of integrating with every dialer.** Tools like Gong, Zoom, or dialers only share live transcripts through server-side APIs, which a static site can't receive. Capturing the rep's mic and the shared call audio in the browser works with any call software, and because the two sides arrive as separate streams, speaker labels are exact rather than guessed. Speech is cut into natural turns with a simple voice-activity detector, so each Whisper request is one utterance, which keeps latency low and stays within free-tier limits.

- **Help in the moment, not just after.** New prospect lines are checked for objections in the background with a short, fast prompt, so a suggested response shows up a few seconds after the prospect pushes back.

- **Verify the model's quotes instead of trusting them.** Language models sometimes paraphrase or invent quotes. Pulse fuzzy-matches each quote against what the prospect said and flags anything it can't find, including quotes the model attributed to the prospect that the rep actually said.

- **Metrics in code, judgment in the model.** Talk ratio, question count, and monologue length are computed from the parsed transcript instead of asking the model to estimate them. The model receives those numbers for coaching, so it can't make them up.

- **Prompts tuned against real output.** Testing against the live model surfaced specific failures: a missed "just send me an email" brush-off, a missed security-review blocker, a made-up "Budget" category, a plan recommended outside its team-size range, an email claiming an attachment that didn't exist, and an invented Salesforce integration. Each one got a targeted fix in the prompts or in code.

- **Four sequential stages instead of one big prompt.** Each stage is a separate, inspectable call, so a rep or manager can see what the AI concluded at each step instead of getting one opaque answer. Two stages save time (Qualify, Follow up) and two help close deals (Recommend, Objections).

- **Bring-your-own catalog.** Pulse started as a take-home for one company's product line. Making the company and catalog editable turned it into a general sales copilot that works for SaaS plans, hardware, services, or anything else a rep sells, while keeping the model limited to products that actually exist.

- **A Team Pulse dashboard, not just a single-call tool.** The rollup shows a manager patterns across calls, like which objections keep coming up and how many meetings get booked, without anyone compiling notes by hand. CSV export is there because it's the first thing a sales manager would ask for.

- **Salesforce-shaped CRM output.** The Follow up stage writes `Task.Subject`, `Task.Description`, `Opportunity.StageName`, and a next step instead of a generic summary, which shows what a real CRM integration would look like.

- **Per-stage latency.** Each stage shows its real response time, a first step toward the performance and cost awareness needed to compare models in production.

- **A real deployment.** I first prototyped this with Claude, then rebuilt it as a standalone app on the Groq API with a GitHub Actions deploy to GitHub Pages, so it's a working product with a live link rather than a demo that only runs inside another tool.
