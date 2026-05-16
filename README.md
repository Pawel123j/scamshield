# ScamShield Senior

**ScamShield Senior** is a cybersecurity awareness web app that helps seniors detect phishing, scam messages, fake bank alerts, BLIK fraud, delivery scams, and social engineering attempts using a rule-based risk analysis engine.

Live demo: _Add deployment link here._

GitHub short description:

```txt
ScamShield Senior is a cybersecurity awareness web app that helps seniors detect phishing, scam messages, fake bank alerts, BLIK fraud, delivery scams, and social engineering attempts using a rule-based risk analysis engine.
```

## Screenshots

### Landing Page
![Landing Page](public/screenshots/landing-page.png)

### Dashboard
![Dashboard](public/screenshots/dashboard.png)

### Scam Analyzer
![Scam Analyzer](public/screenshots/analyzer.png)

### Analysis Result
![Analysis Result](public/screenshots/analysis-result.png)

### Scam Database
![Scam Database](public/screenshots/scam-database.png)

### Cyber Lessons
![Cyber Lessons](public/screenshots/lessons.png)

### Senior Mode
![Senior Mode](public/screenshots/senior-mode.png)

## Features

- Modern landing page for a cybersecurity awareness product
- Dashboard with quick actions, local stats, education progress and recent analyses
- Explainable scam analyzer with 0-100 risk scoring
- Risk levels: low, medium and high
- Detected indicators with point values and matched warning terms
- Scoring breakdown that explains how the score was calculated
- Recommended actions for safe next steps
- Analysis history stored in LocalStorage with filters and delete controls
- Scam database with realistic Polish examples
- Senior-friendly cybersecurity lessons with quizzes and saved progress
- Safety checklist with persistent progress
- Family help message generator with copy-to-clipboard
- Incident report guide and copyable incident summary
- Privacy & Security page explaining local analysis and LocalStorage limits
- Senior Mode for larger text, bigger actions and improved contrast
- Optional PDF report export for analysis results
- GitHub Actions CI workflow
- Vitest test cases for the rule engine

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- LocalStorage
- lucide-react
- jsPDF
- Vitest
- GitHub Actions

## Project Structure

```txt
app/
  page.tsx
  dashboard/
  analyze/
  history/
  scams/
  lessons/
  checklist/
  family-help/
  report/
  privacy-security/
  about/
components/
  AppLayout.tsx
  Navbar.tsx
  Sidebar.tsx
  RiskBadge.tsx
  RiskScoreCard.tsx
  ScamCard.tsx
  LessonCard.tsx
  ChecklistItem.tsx
  EmptyState.tsx
  SeniorModeToggle.tsx
  StatCard.tsx
  CopyButton.tsx
  AnalysisResult.tsx
  ScoringBreakdown.tsx
  PDFExportButton.tsx
  ExampleMessageButton.tsx
data/
  scams.ts
  lessons.ts
  checklist.ts
  examples.ts
hooks/
  useAnalysisHistory.ts
  useLocalStorage.ts
lib/
  scamAnalyzer.ts
  localStorage.ts
  pdf.ts
  risk.ts
  types.ts
tests/
  scamAnalyzer.test.ts
public/
  screenshots/
```

## Cybersecurity Value

ScamShield Senior helps users pause before acting on manipulative messages. The rule engine detects warning signs such as:

- suspicious links and shortened URLs
- fake bank wording
- fake delivery payment requests
- BLIK code requests
- card, PESEL, login and password requests
- urgency and pressure language
- police, court, debt and blocked-account threats
- fake investment and cryptocurrency profit promises
- AnyDesk, TeamViewer and remote desktop scams
- secrecy requests and unknown-sender stories

The app does not claim to prove whether something is safe. It teaches safer decision-making and gives practical next steps.

## Privacy-First Approach

- Analysis is rule-based and local to the app.
- No real AI API is used.
- No account is required.
- Message history is stored in browser LocalStorage.
- LocalStorage is not encrypted, so users should not store real passwords, full card numbers, PESEL numbers or authorization codes.
- Users can clear history from the History page.
- Real incidents should be verified through official bank, police or cybersecurity support channels.

## Accessibility Notes

- Semantic pages and headings
- Clear labels for forms
- Keyboard-friendly buttons and links
- Large click targets
- Visible focus rings
- Strong risk colors for low, medium and high results
- Senior Mode for larger text, spacing and contrast
- Responsive layouts for mobile and desktop

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Test and Build

```bash
npm run lint
npm test -- --run
npm run build
```

## Portfolio Description

ScamShield Senior is a cybersecurity-focused web application created to help seniors and their families recognize phishing, scam messages, fake bank alerts, BLIK fraud, delivery scams, and social engineering attempts.

The application includes a rule-based risk analysis engine that calculates a risk score from 0 to 100, detects warning signs, explains threats in simple language, and suggests safe next steps. It also contains a scam database, cybersecurity lessons, safety checklist, analysis history, family help message generator, incident reporting guidance, privacy and security page, and a senior-friendly interface mode.

The project was built with Next.js, TypeScript, React, Tailwind CSS and LocalStorage. It demonstrates practical knowledge of frontend development, cybersecurity awareness, phishing detection logic, accessibility, privacy-first design and user-centered product thinking.

## CV Description

```txt
ScamShield Senior — Cybersecurity Awareness Web App

Designed and developed a Next.js web application that helps seniors detect phishing, scam messages, fake bank alerts, BLIK fraud and social engineering attempts. Built a rule-based risk analysis engine in TypeScript, implemented risk scoring, analysis history, scam database, cybersecurity lessons, safety checklist, incident reporting guide, Senior Mode and privacy-first LocalStorage persistence.
```

## GitHub Topics

```txt
cybersecurity
phishing
scam-detection
nextjs
typescript
react
tailwindcss
security-awareness
senior-friendly
accessibility
social-engineering
portfolio-project
```

## Future Improvements

- Real AI/NLP integration for more advanced scam detection
- Browser extension for checking suspicious websites
- SMS import and mobile app version
- Family account system
- Admin panel for managing scam examples
- Real-time scam alerts
- CERT Polska / NASK feed integration
- PDF export improvements
- Multi-language support
- Voice assistant mode for seniors
- Offline PWA support
- Dark mode
- Admin dashboard with scam statistics
- Report sharing with trusted contacts

## Disclaimer

This tool helps identify suspicious messages, but it does not replace official bank, police, or cybersecurity support. When in doubt, contact your bank using the official phone number or report the incident to appropriate authorities.
