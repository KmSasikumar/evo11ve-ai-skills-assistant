# Evo11ve AI Skills Assistant — Voice Conversational Assistant

A voice conversational assistant scoped specifically to **Evo11ve's AI Skills
Program** (https://www.evo11ve.ai/for-ai), built for the Evo11ve technical
assessment. It answers questions about the program, and triggers emails when
needed (enrollment, callback request, escalation to a human).

## Live demo

- **App:** https://kmsasikumar.github.io/evo11ve-ai-skills-assistant/
- **Video walkthrough:** `demo.mp4` in this repo (captioned screen capture of
  the real working app — no narration, no synthesized voice or face).

## How it works (architecture)

Fully static, client-side. No server, no API keys, no paid services, no build
step — open `index.html` or serve the folder statically.

```
Visitor question (typed, spoken, or picked from a suggestion)
        │
        ▼
kb.js — keyword matcher over a knowledge base built ONLY from
        evo11ve.ai/for-ai (fetched 29 Oct 2026)
        │
        ├── match ──► program fact answer (spoken aloud if voice replies on)
        ├── intent ─► email trigger (enroll / callback / human escalation)
        └── no match ► honest "not stated on the program page" answer
                        + callback / human-escalation offer
```

- **Voice input:** the browser's built-in SpeechRecognition API
  (`SpeechRecognition` / `webkitSpeechRecognition`). If the browser does not
  support it, the assistant says so and text chat works everywhere.
- **Voice output:** the browser's `speechSynthesis` API, behind a
  "Voice replies" toggle.
- **Text fallback:** the chat input always works, with or without a mic.
- **Shareable question links:** append `#ask=your question` to the page URL
  and the assistant answers it on load (a shipped feature, also used to
  capture the demo video frames).

## Honesty rule (the important part)

Every program fact in `kb.js` comes from the official program page, and
nothing else. Facts used: ₹9,999 per student; Classes 6–12; 50 hours
(12 live mentor-led + 36 guided project-building + 2 doubt-clearing);
1 portfolio-ready capstone project; 9 project categories; blockchain-based
certification; 12 months of ongoing mentor support; project showcase on the
website and social media; 350+ students trained; limited seats per cohort.

Where the page does **not** state something — batch dates, weekly timings,
online vs in-person mode, refunds, discounts — the assistant says so
explicitly and offers a callback / human-escalation email instead of
guessing. Out-of-scope questions ("What is the capital of France?") get the
same honest treatment.

## Email triggers

When the assistant detects an enrollment, callback, or human-escalation
intent, it composes the exact email (recipient, subject, body) and shows it
in the email panel with:

- **"Open in your mail app"** — a `mailto:` handoff that opens the visitor's
  own mail app with everything filled in, so they review and press Send.
- **"Copy email text"** — copies the full email for any mail app.

The status always reads **"Prepared"**, never "Sent": a web page cannot
confirm delivery through `mailto:`, so this app never fakes a sent
confirmation.

**Wiring point for automatic server-side sending:** in `app.js`, replace
`sendViaMailto()` with a POST to `EMAIL_ENDPOINT` — a backend that sends
through the program team's mailbox. No credentials are bundled with this app.
The default recipient (`EMAIL_RECIPIENT` in `app.js`) is the program team's
contact from the assessment correspondence; change that one constant to
re-point it.

## Project layout

- `index.html` — chat UI, suggestions, voice controls, email panel.
- `styles.css` — styling.
- `kb.js` — knowledge base + matcher (pure logic, unit-testable with node).
- `app.js` — chat rendering, voice I/O, email drafts, `#ask=` deep links.
- `demo.mp4` — captioned demo video (frames captured from the real app).

## Run locally

```sh
# any static server, e.g.
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Test the matcher

```sh
node -e "
const kb = require('./kb.js');
for (const q of [
  'What is the price of the program?',
  'What certificate do students get?',
  'When does the next batch start?',
  'I want to enroll',
  'What is the capital of France?'
]) {
  const r = kb.answer(q);
  console.log(q, '=>', r.type === 'answer' ? r.entry.id : r.type);
}"
```

## Verification performed (29 Oct 2026)

- Matcher: 24 representative questions pass (price, hours, certificate,
  categories, mentors, eligibility, dates/refund/mode as "not stated",
  enroll/callback/human intents, out-of-scope fallback).
- Live URL: loaded and asked program questions; answers match the page.
- Video: captioned frames of the real app; under 5 minutes; silent
  (captions only).

## Disclaimer

Demonstration built for a technical assessment. It is not an official
Evo11ve service. Program facts are quoted from the public program page.
