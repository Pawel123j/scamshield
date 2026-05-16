# ScamShield Senior

ScamShield Senior is a senior-friendly cybersecurity awareness and anti-scam assistant. It helps users check suspicious SMS messages, e-mails, phone call scripts, bank alerts, delivery messages, BLIK requests, fake investment offers and phishing attempts.

The app is designed for seniors, family members and anyone learning basic scam prevention. It uses a transparent rule-based risk engine instead of a paid AI API, so the analysis is explainable, local and easy to extend.

## Features

- Landing page with trust-focused cybersecurity positioning
- Dashboard with quick actions, seeded statistics and recent analyses
- Scam Analyzer with message type selection, risk score, detected warning signs and recommended actions
- Local analysis history with details and deletion
- Static scam database with realistic Polish examples
- Cyber lessons for seniors with mini quizzes and saved progress
- Safety checklist persisted in LocalStorage
- Family help message generator with copy-to-clipboard
- Senior Mode toggle with larger text, buttons, spacing and higher contrast
- Accessible, responsive UI with semantic HTML and keyboard-friendly controls
- Rule-based TypeScript scam engine with unit-test examples

## Tech Stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- LocalStorage persistence
- Vitest for rule-engine tests
- lucide-react icons

## Screenshots

Add screenshots here after running the app locally:

- Landing page
- Dashboard
- Scam Analyzer result
- Scam database
- Lessons and checklist

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production build:

```bash
npm run build
npm run start
```

Run tests:

```bash
npm run test
```

## Folder Structure

```text
app/
  analyze/        Scam analyzer route
  dashboard/      Dashboard route
  history/        Saved analysis history route
  scams/          Scam database route
  lessons/        Learning route with quizzes
  checklist/      Safety checklist route
  family-help/    Family message generator route
  about/          Project and methodology route
components/       Reusable UI components
data/             Static scams, lessons and checklist content
hooks/            LocalStorage and history hooks
lib/              Types, risk utilities, scam analysis engine
tests/            Scam engine test cases
```

## Cybersecurity Learning Value

ScamShield Senior teaches users to pause before acting. The analyzer highlights common manipulation patterns: suspicious links, shortened URLs, payment requests, BLIK codes, PESEL/login/password requests, pressure language, fake bank threats, delivery fee scams, investment promises, cryptocurrency fraud, secrecy requests and remote desktop tools.

The app includes a clear disclaimer: it supports awareness and triage, but it does not replace a bank, police or cybersecurity authority.

## Portfolio Description

This project demonstrates a complete product-style frontend with local persistence, typed domain models, reusable components, accessible forms, responsive layouts and a deterministic analysis engine. It is intentionally built without paid APIs so it can be cloned, reviewed and extended easily.

## Future Improvements

- Real AI/NLP integration
- Browser extension
- SMS import
- Family accounts
- Admin panel
- Real-time scam alerts
- Polish CERT/NASK scam feed integration
- PDF reports
- Multi-language support

## Disclaimer

This tool helps identify suspicious messages, but it does not replace official bank, police, or cybersecurity support. When in doubt, contact your bank using the official phone number or report the incident to appropriate authorities.
