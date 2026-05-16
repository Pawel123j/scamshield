import type { AnalysisResult, MessageType, RiskIndicator } from "@/lib/types";
import { getRiskLevel } from "@/lib/risk";

type RuleDefinition = Omit<RiskIndicator, "matchedTerms"> & {
  patterns: RegExp[];
};

const rules: RuleDefinition[] = [
  {
    id: "suspicious-link",
    title: "Wiadomość zawiera link",
    description: "Oszuści często kierują ofiary na fałszywe strony banku, kuriera lub sklepu.",
    category: "link",
    severity: "Medium",
    weight: 18,
    patterns: [/\bhttps?:\/\/\S+/i, /\bwww\.\S+/i, /\b[a-z0-9-]+\.(?:top|xyz|ru|click|quest|zip|live)\b/i]
  },
  {
    id: "short-link",
    title: "Wykryto skrócony link",
    description: "Skrócone linki ukrywają prawdziwy adres strony, dlatego są częste w phishingu.",
    category: "link",
    severity: "High",
    weight: 18,
    patterns: [/\b(?:bit\.ly|tinyurl\.com|t\.co|cutt\.ly|shorturl\.at|rebrand\.ly|is\.gd|ow\.ly)\/\S*/i]
  },
  {
    id: "card-data",
    title: "Prośba o dane karty lub płatność",
    description: "Legitne instytucje nie proszą SMS-em o numer karty, CVV ani pełne dane płatnicze.",
    category: "payment",
    severity: "High",
    weight: 24,
    patterns: [/\b(?:cvv|cvc|numer karty|dane karty|card number|expiry|data waznosci|oplac|zapłać|zaplac|dopłać|doplac)\b/i]
  },
  {
    id: "private-data",
    title: "Prośba o poufne dane",
    description: "PESEL, numer dowodu, login i hasło powinny pozostać prywatne.",
    category: "data",
    severity: "High",
    weight: 25,
    patterns: [/\b(?:pesel|numer dowodu|dowód osobisty|dowod osobisty|login|hasło|haslo|password|pin|potwierdź dane|potwierdz dane|verify your identity)\b/i]
  },
  {
    id: "blik-code",
    title: "Prośba o kod BLIK",
    description: "Kod BLIK jest jak gotówka. Nie należy go podawać przez wiadomość ani telefon.",
    category: "payment",
    severity: "High",
    weight: 32,
    patterns: [/\b(?:blik|kod blik|podaj kod|wygeneruj kod|prześlij kod|przeslij kod)\b/i]
  },
  {
    id: "pressure",
    title: "Presja czasu",
    description: "Fraudsterzy próbują wywołać pośpiech, aby użytkownik nie sprawdził sprawy spokojnie.",
    category: "pressure",
    severity: "Medium",
    weight: 15,
    patterns: [/\b(?:pilnie|natychmiast|teraz|w ciągu 24h|w ciagu 24h|ostatnia szansa|today only|urgent|immediately|act now)\b/i]
  },
  {
    id: "threat",
    title: "Groźba blokady, długu lub konsekwencji",
    description: "Groźby blokady konta, policji, sądu lub długu są typowym elementem manipulacji.",
    category: "threat",
    severity: "High",
    weight: 22,
    patterns: [/\b(?:konto zostanie zablokowane|blokada konta|zablokujemy konto|policja|sąd|sad|komornik|dług|dlug|debt|court|police|blocked account)\b/i]
  },
  {
    id: "delivery-fee",
    title: "Motyw dopłaty do przesyłki",
    description: "Fałszywe dopłaty do paczek często prowadzą do stron wyłudzających dane karty.",
    category: "delivery",
    severity: "High",
    weight: 20,
    patterns: [/\b(?:paczka|przesyłka|przesylka|kurier|inpost|dpd|dhl|fedex|delivery|dopłać|doplac|brakuje .*zl|opłata celna|oplata celna)\b/i]
  },
  {
    id: "fake-bank",
    title: "Wiadomość podszywa się pod bank",
    description: "Wiadomości o koncie, autoryzacji lub przelewie wymagają weryfikacji oficjalnym kanałem banku.",
    category: "bank",
    severity: "Medium",
    weight: 17,
    patterns: [/\b(?:bank|konto|rachunek|przelew|autoryzacja|sesja wygasła|sesja wygasla|banking|transaction|verify account)\b/i]
  },
  {
    id: "investment",
    title: "Obietnica szybkiego zysku",
    description: "Gwarantowane inwestycje i nacisk konsultanta są częstym schematem oszustw.",
    category: "investment",
    severity: "High",
    weight: 23,
    patterns: [/\b(?:inwestycja|platforma inwestycyjna|gwarantowany zysk|zarób|zarob|pasywny dochód|passive income|guaranteed profit|financial advisor)\b/i]
  },
  {
    id: "crypto",
    title: "Motyw kryptowalut",
    description: "Fałszywe inwestycje kryptowalutowe często obiecują szybki, pewny zarobek.",
    category: "crypto",
    severity: "High",
    weight: 18,
    patterns: [/\b(?:bitcoin|btc|ethereum|usdt|krypto|kryptowalut|crypto|wallet|portfel inwestycyjny)\b/i]
  },
  {
    id: "too-good",
    title: "Oferta zbyt dobra, aby była prawdziwa",
    description: "Bardzo wysokie rabaty, nagrody lub pewny zysk są sygnałem ostrzegawczym.",
    category: "investment",
    severity: "Medium",
    weight: 16,
    patterns: [/\b(?:100%|300%|bez ryzyka|zero ryzyka|pewny zysk|wygrałeś|wygrales|free money|risk free|limited offer)\b/i]
  },
  {
    id: "unknown-sender",
    title: "Nieznany nadawca lub numer",
    description: "Nieznany rozmówca może podszywać się pod rodzinę, bank lub urzędnika.",
    category: "sender",
    severity: "Medium",
    weight: 12,
    patterns: [/\b(?:nieznany numer|unknown number|nowy numer|zgubiłem telefon|zgubilem telefon|tu twój wnuk|tu twoj wnuk|mamo to ja)\b/i]
  },
  {
    id: "secrecy",
    title: "Prośba, aby nikomu nie mówić",
    description: "Oszust może próbować odciąć ofiarę od pomocy rodziny lub banku.",
    category: "secrecy",
    severity: "High",
    weight: 22,
    patterns: [/\b(?:nie mów nikomu|nie mow nikomu|to tajemnica|keep this secret|do not tell anyone|nie informuj rodziny)\b/i]
  },
  {
    id: "remote-access",
    title: "Prośba o zdalny dostęp",
    description: "AnyDesk, TeamViewer i podobne narzędzia mogą dać przestępcy kontrolę nad telefonem lub komputerem.",
    category: "remote-access",
    severity: "High",
    weight: 30,
    patterns: [/\b(?:anydesk|teamviewer|zdalny pulpit|remote desktop|zdalny dostęp|zdalny dostep|screen sharing|udostępnij ekran|udostepnij ekran)\b/i]
  },
  {
    id: "action-link",
    title: "Polecenie kliknięcia lub potwierdzenia",
    description: "Fraudsterzy używają prostych komend: kliknij, potwierdź, zaloguj się, podaj kod.",
    category: "pressure",
    severity: "Medium",
    weight: 16,
    patterns: [/\b(?:kliknij link|kliknij tutaj|wejdź w link|wejdz w link|potwierdź|potwierdz|zaloguj się|zaloguj sie|confirm now|click here)\b/i]
  }
];

const typeRiskBoost: Partial<Record<MessageType, { ruleIds: string[]; boost: number }>> = {
  "BLIK request": { ruleIds: ["blik-code", "unknown-sender", "secrecy"], boost: 12 },
  "Delivery message": { ruleIds: ["delivery-fee", "suspicious-link", "card-data"], boost: 10 },
  "Bank message": { ruleIds: ["fake-bank", "private-data", "threat", "suspicious-link"], boost: 10 },
  "Investment offer": { ruleIds: ["investment", "crypto", "too-good", "remote-access"], boost: 12 },
  "Phone call": { ruleIds: ["remote-access", "fake-bank", "unknown-sender", "secrecy"], boost: 8 }
};

function normalize(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function findMatches(text: string, patterns: RegExp[]) {
  const matches = new Set<string>();

  patterns.forEach((pattern) => {
    const result = text.match(pattern);
    if (result?.[0]) {
      matches.add(result[0]);
    }
  });

  return Array.from(matches);
}

function detectSuspiciousFormatting(text: string): RiskIndicator | null {
  const signals = [
    /!!!|\?\?\?/,
    /\b[A-ZĄĆĘŁŃÓŚŹŻ]{8,}\b/,
    /[^\s]{45,}/,
    /(?:\d[\s-]?){9,}/
  ];

  const matchedTerms = findMatches(text, signals);

  if (matchedTerms.length === 0) {
    return null;
  }

  return {
    id: "formatting",
    title: "Podejrzane formatowanie",
    description: "Nadmierne wykrzykniki, długie ciągi znaków lub chaotyczny zapis mogą wskazywać na masową wiadomość.",
    category: "formatting",
    severity: "Medium",
    weight: 10,
    matchedTerms
  };
}

function buildRecommendations(indicators: RiskIndicator[]): string[] {
  const categories = new Set(indicators.map((indicator) => indicator.category));
  const recommendations = new Set<string>();

  if (categories.has("link")) {
    recommendations.add("Nie klikaj linku i nie wpisuj danych na stronie z wiadomości.");
  }

  if (categories.has("payment") || categories.has("data")) {
    recommendations.add("Nie podawaj numeru karty, kodu BLIK, loginu, hasła ani numeru PESEL.");
  }

  if (categories.has("bank")) {
    recommendations.add("Skontaktuj się z bankiem wyłącznie przez oficjalny numer z karty, aplikacji lub strony banku.");
  }

  if (categories.has("delivery")) {
    recommendations.add("Sprawdź status paczki w oficjalnej aplikacji lub na stronie przewoźnika, wpisując adres samodzielnie.");
  }

  if (categories.has("investment") || categories.has("crypto")) {
    recommendations.add("Nie instaluj aplikacji inwestycyjnych z linku i nie wpłacaj pieniędzy pod presją konsultanta.");
  }

  if (categories.has("remote-access")) {
    recommendations.add("Nie instaluj AnyDesk, TeamViewer ani innych aplikacji do zdalnego dostępu na prośbę rozmówcy.");
  }

  if (categories.has("secrecy") || categories.has("pressure") || categories.has("sender")) {
    recommendations.add("Zatrzymaj rozmowę i skonsultuj sytuację z zaufanym członkiem rodziny.");
  }

  recommendations.add("Zrób zrzut ekranu lub zapisz treść wiadomości, jeśli będziesz zgłaszać incydent.");
  recommendations.add("W razie wątpliwości zgłoś sprawę do banku, operatora lub odpowiednich służb.");

  return Array.from(recommendations);
}

function buildSummary(score: number, detectedIndicators: RiskIndicator[]) {
  if (detectedIndicators.length === 0) {
    return "Nie znaleziono typowych sygnałów oszustwa, ale nadal warto zachować ostrożność.";
  }

  if (score > 60) {
    return "Wiadomość zawiera kilka poważnych sygnałów oszustwa. Najbezpieczniej jej nie wykonywać.";
  }

  return "Wiadomość ma elementy, które wymagają ostrożności i dodatkowej weryfikacji.";
}

function buildExplanation(score: number, detectedIndicators: RiskIndicator[]) {
  if (detectedIndicators.length === 0) {
    return "Treść wygląda spokojnie i nie zawiera linków, presji ani próśb o poufne dane. To nie daje stuprocentowej pewności, dlatego decyzje finansowe warto potwierdzać osobnym kanałem.";
  }

  const topSignals = detectedIndicators
    .slice()
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((indicator) => indicator.title.toLowerCase());

  return `Najważniejsze sygnały to: ${topSignals.join(", ")}. Wynik ${score}/100 oznacza, że wiadomość powinna zostać sprawdzona przed kliknięciem, płatnością lub rozmową z nadawcą.`;
}

export function analyzeMessage(messageType: MessageType, rawText: string): AnalysisResult {
  const text = normalize(rawText);

  if (!text) {
    return {
      id: createId(),
      messageType,
      inputText: rawText,
      score: 0,
      level: "Low",
      summary: "Wklej treść wiadomości, aby otrzymać analizę.",
      explanation: "Analiza wymaga treści SMS-a, e-maila lub opisu rozmowy.",
      detectedIndicators: [],
      recommendedActions: ["Wklej podejrzaną treść i uruchom analizę ponownie."],
      createdAt: new Date().toISOString()
    };
  }

  const detectedIndicators: RiskIndicator[] = rules
    .map((rule) => {
      const matchedTerms = findMatches(text, rule.patterns);

      if (matchedTerms.length === 0) {
        return null;
      }

      return {
        id: rule.id,
        title: rule.title,
        description: rule.description,
        category: rule.category,
        severity: rule.severity,
        weight: rule.weight,
        matchedTerms
      };
    })
    .filter((indicator): indicator is RiskIndicator => Boolean(indicator));

  const formattingIndicator = detectSuspiciousFormatting(text);
  if (formattingIndicator) {
    detectedIndicators.push(formattingIndicator);
  }

  let score = detectedIndicators.reduce((total, indicator) => total + indicator.weight, 0);
  const matchedRuleIds = new Set(detectedIndicators.map((indicator) => indicator.id));
  const contextualBoost = typeRiskBoost[messageType];

  if (contextualBoost?.ruleIds.some((ruleId) => matchedRuleIds.has(ruleId))) {
    score += contextualBoost.boost;
  }

  if (matchedRuleIds.has("suspicious-link") && (matchedRuleIds.has("private-data") || matchedRuleIds.has("card-data"))) {
    score += 10;
  }

  if (matchedRuleIds.has("pressure") && matchedRuleIds.has("threat")) {
    score += 8;
  }

  if (matchedRuleIds.has("investment") && matchedRuleIds.has("too-good")) {
    score += 8;
  }

  if (detectedIndicators.length === 0) {
    score = 8;
  }

  const cappedScore = Math.max(0, Math.min(100, Math.round(score)));
  const level = getRiskLevel(cappedScore);

  return {
    id: createId(),
    messageType,
    inputText: rawText,
    score: cappedScore,
    level,
    summary: buildSummary(cappedScore, detectedIndicators),
    explanation: buildExplanation(cappedScore, detectedIndicators),
    detectedIndicators,
    recommendedActions: buildRecommendations(detectedIndicators),
    createdAt: new Date().toISOString()
  };
}

export const messageTypes: MessageType[] = [
  "SMS",
  "Email",
  "Phone call",
  "Bank message",
  "Delivery message",
  "BLIK request",
  "Investment offer",
  "Other"
];
