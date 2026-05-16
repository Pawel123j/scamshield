import type { ChecklistItem } from "@/lib/types";

export const safetyChecklist: ChecklistItem[] = [
  {
    id: "no-suspicious-links",
    label: "Nie klikam podejrzanych linków",
    description: "Adres banku, poczty lub kuriera wpisuję samodzielnie albo używam oficjalnej aplikacji."
  },
  {
    id: "no-card-details",
    label: "Nie udostępniam danych karty",
    description: "Nie podaję numeru karty, daty ważności ani CVV po kliknięciu linku z wiadomości."
  },
  {
    id: "no-blik-codes",
    label: "Nie przekazuję kodów BLIK",
    description: "Kod BLIK podaję tylko wtedy, gdy samodzielnie wykonuję płatność."
  },
  {
    id: "verify-bank-calls",
    label: "Samodzielnie weryfikuję telefony z banku",
    description: "Rozłączam się i dzwonię na oficjalny numer banku, gdy sprawa dotyczy pieniędzy."
  },
  {
    id: "ask-family",
    label: "Pytam rodzinę, gdy mam wątpliwości",
    description: "Nie działam pod presją i proszę zaufaną osobę o drugą opinię."
  },
  {
    id: "strong-passwords",
    label: "Używam silnych haseł",
    description: "Hasła są długie, unikalne i nie są zapisywane w widocznych miejscach."
  },
  {
    id: "two-factor",
    label: "Mam włączone 2FA",
    description: "Dodatkowe potwierdzenie logowania chroni konto nawet po wycieku hasła."
  },
  {
    id: "updates",
    label: "Aktualizuję telefon i aplikacje",
    description: "Aktualizacje zamykają znane luki bezpieczeństwa."
  }
];
