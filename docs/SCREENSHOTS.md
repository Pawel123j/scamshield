# Screenshot Guide

Zrzuty ekranu w `public/screenshots/` są **generowane automatycznie**
z produkcyjnego builda, a nie robione ręcznie. Dzięki temu da się je odtworzyć
po każdej zmianie interfejsu i nie rozjeżdżają się z kodem.

## Co jest w repozytorium

| Plik | Strona | Stan |
|---|---|---|
| `landing-page.png` | `/` | — |
| `dashboard.png` | `/dashboard` | — |
| `analyzer-empty.png` | `/analyze` | formularz pusty |
| `analyzer-high-risk.png` | `/analyze` | po analizie wiadomości 100/100 |
| `history.png` | `/history` | po zapisaniu jednej analizy |
| `scam-database.png` | `/scams` | — |
| `scenario-simulator.png` | `/scenario-simulator` | — |
| `trusted-contacts.png` | `/trusted-contacts` | — |
| `report-page.png` | `/report` | — |
| `privacy-security.png` | `/privacy-security` | — |
| `senior-mode.png` | `/analyze` | Senior Mode włączony |
| `dark-mode.png` | `/dashboard` | Dark Mode włączony |
| `mobile-landing.png` | `/` | 390 px szerokości |
| `mobile-analyzer.png` | `/analyze` | 390 px szerokości |

## Jak je odtworzyć

```bash
npm run build
npx next start -p 3210
```

W drugim terminalu, przeglądarką sterowaną skryptem (Playwright), dla każdej
pozycji z tabeli: ustaw `scamshield.seniorMode` / `scamshield.darkMode`
w `localStorage`, wejdź na adres, poczekaj na `networkidle`, zrób zrzut
całej strony.

Dwie rzeczy, o których łatwo zapomnieć:

1. **Elementy `sticky` i `fixed`** duplikują się na pełnostronicowym zrzucie —
   nagłówek przykleja się w połowie obrazka. Przed zrzutem trzeba im ustawić
   `position: relative`, ale **po wyliczonym stylu**, a nie po nazwie klasy:
   dopasowanie po `[class*="fixed"]` trafia też w zwykłe elementy układu
   i rozjeżdża layout.
2. **Tabele w `overflow-x-auto`** rozciągają zrzut ponad szerokość okna.
   Obrazek trzeba przyciąć do szerokości viewportu, żeby pokazywał to, co
   naprawdę widzi użytkownik.

Zrzuty są zapisywane jako PNG z paletą (`sharp`, `palette: true`) — cały
komplet waży wtedy ~2 MB zamiast ~6 MB.

## Czego tu nie ma

Zrzutów zainscenizowanych: żadnego ekranu, który nie wyszedłby z aplikacji
uruchomionej z tego commita.
