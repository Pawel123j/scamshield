# Architecture

ScamShield Senior is a local-first cybersecurity awareness application built with Next.js App Router, React, TypeScript and Tailwind CSS.

## Rule-Based Engine Instead of AI API

The MVP uses a deterministic TypeScript rule engine instead of an external AI/NLP service. This keeps the project:

- privacy-first,
- easy to test,
- inexpensive to run,
- explainable for seniors and families,
- safe to demo without API keys.

Each rule has a label, category, severity, points and matched keywords. The analyzer returns a risk score, dominant scam category, confidence level, detailed explanation, recommendations and next steps.

## LocalStorage Persistence

LocalStorage is used for:

- analysis history,
- checklist progress,
- lesson progress,
- Senior Mode,
- Dark Mode,
- trusted contacts,
- scenario simulator score.

This avoids backend complexity and prevents accidental server-side collection of sensitive content. The app clearly explains that LocalStorage is not encrypted.

## Privacy-First Design

The app does not require an account and does not send suspicious messages to an AI API. Users are warned not to enter real passwords, full card numbers, PESEL numbers or banking credentials.

## Senior Mode

Senior Mode is implemented as a global class on the app shell. It increases base font size, click target comfort, spacing and border visibility without changing the route structure.

## No Backend in MVP

The current version is intentionally frontend-only. This keeps deployment simple and protects demo users from uploading sensitive incident data.

Future backend possibilities:

- family accounts,
- encrypted trusted-contact sync,
- admin panel for scam examples,
- CERT/NASK feed ingestion,
- anonymous scam trend analytics,
- secure PDF report storage.
