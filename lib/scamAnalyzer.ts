import { categoryLabels } from "@/lib/labels";
import { getRiskLevel } from "@/lib/risk";
import type {
  AnalysisResult,
  ConfidenceLevel,
  MessageType,
  RiskIndicator,
  RiskLevel,
  ScamCategory,
  ScoringBreakdownItem
} from "@/lib/types";

export const MAX_ANALYSIS_INPUT_LENGTH = 5000;

type RuleDefinition = {
  id: string;
  label: string;
  description: string;
  points: number;
  severity: RiskLevel;
  category: ScamCategory;
  patterns: RegExp[];
};

const rules: RuleDefinition[] = [
  {
    id: "suspicious-link",
    label: "Wiadomość zawiera link",
    description: "Link może prowadzić do fałszywej strony banku, kuriera lub płatności. Sam link nie dowodzi oszustwa.",
    points: 18,
    severity: "medium",
    category: "phishing",
    patterns: [/\bhttps?:\/\/[^\s]+/i, /\bwww\.[^\s]+/i, /\b[a-z0-9-]+\.(?:top|xyz|ru|click|quest|zip|live|info|site|online)\b/i]
  },
  {
    id: "shortened-link",
    label: "Skrócony link",
    description: "Skrócony link ukrywa adres docelowy i utrudnia jego sprawdzenie.",
    points: 22,
    severity: "high",
    category: "phishing",
    patterns: [/\b(?:bit\.ly|tinyurl\.com|t\.co|cutt\.ly|shorturl\.at|rebrand\.ly|is\.gd|ow\.ly)\/[^\s]*/i]
  },
  {
    id: "fake-bank-wording",
    label: "Treść związana z bankiem",
    description: "Wiadomość dotyczy bankowości. Sprawdź ją przez oficjalną aplikację lub numer banku.",
    points: 18,
    severity: "medium",
    category: "banking_fraud",
    patterns: [
      /\b(?:bank|konto|rachunek|przelew|autoryzacja|transakcja|konsultant banku|banking|transaction|verify account)\b/i,
      /\b(?:sesja wygasła|sesja wygasla|dział bezpieczeństwa banku|dzial bezpieczenstwa banku)\b/i
    ]
  },
  {
    id: "delivery-scam-wording",
    label: "Treść związana z przesyłką lub dopłatą",
    description: "Niewielkie dopłaty do przesyłki bywają pretekstem do przekierowania na fałszywą stronę płatności.",
    points: 24,
    severity: "high",
    category: "delivery_scam",
    patterns: [
      /\b(?:paczka|przesyłka|przesylka|kurier|inpost|dpd|dhl|fedex|delivery|doręczenie|doreczenie)\b/i,
      /\b(?:dopłać|doplac|opłata celna|oplata celna|brakuje\s+\d+[,.]?\d*\s*zł|brakuje\s+\d+[,.]?\d*\s*zl)\b/i
    ]
  },
  {
    id: "blik-request",
    label: "Wzmianka o BLIK lub prośba o kod",
    description: "Kod BLIK może umożliwić natychmiastową wypłatę pieniędzy. Nie podawaj go w wiadomości ani podczas rozmowy.",
    points: 34,
    severity: "high",
    category: "blik_fraud",
    patterns: [/\b(?:blik|kod blik|podaj kod|wyślij kod|wyslij kod|wygeneruj kod|prześlij kod|przeslij kod)\b/i]
  },
  {
    id: "card-data-request",
    label: "Prośba o dane karty",
    description: "Nie przekazuj pełnych danych karty, CVV/CVC ani daty ważności przez link otrzymany w wiadomości.",
    points: 25,
    severity: "high",
    category: "identity_theft",
    patterns: [/\b(?:cvv|cvc|numer karty|dane karty|podaj dane karty|card number|expiry|data ważności|data waznosci)\b/i]
  },
  {
    id: "personal-data-request",
    label: "Wzmianka o poufnych danych",
    description: "PESEL, numer dowodu, login, hasło i PIN to dane poufne. Nie przekazuj ich nadawcy.",
    points: 26,
    severity: "high",
    category: "identity_theft",
    patterns: [
      /\b(?:pesel|podaj pesel|numer dowodu|dowód osobisty|dowod osobisty|login|hasło|haslo|password|pin)\b/i,
      /\b(?:potwierdź dane|potwierdz dane|confirm your details|verify your identity|verify your account|dane logowania)\b/i
    ]
  },
  {
    id: "urgency-pressure",
    label: "Presja czasu",
    description: "Oszuści wywierają presję, aby skłonić do działania bez spokojnego sprawdzenia sytuacji.",
    points: 15,
    severity: "medium",
    category: "social_engineering",
    patterns: [/\b(?:pilnie|natychmiast|teraz|w ciągu 24h|w ciagu 24h|ostatnia szansa|urgent|immediately|act now|today only|nie zwlekaj)\b/i]
  },
  {
    id: "threats",
    label: "Groźby lub konsekwencje",
    description: "Groźby blokady konta, długu, sądu lub policji mogą służyć manipulacji.",
    points: 22,
    severity: "high",
    category: "social_engineering",
    patterns: [
      /\b(?:konto zostanie zablokowane|your account will be blocked|blocked account|blokada konta|zablokujemy konto)\b/i,
      /\b(?:policja|prokuratura|sąd|sad|wezwanie do zapłaty|wezwanie do zaplaty|komornik|dług|dlug|debt|court|police)\b/i
    ]
  },
  {
    id: "investment-promise",
    label: "Obietnica zysku z inwestycji",
    description: "Gwarantowany lub bardzo szybki zysk jest silnym sygnałem ostrzegawczym.",
    points: 24,
    severity: "high",
    category: "investment_scam",
    patterns: [
      /\b(?:inwestycja|platforma inwestycyjna|szybki zysk|gwarantowany zysk|zarób|zarob|pasywny dochód|pasywny dochod)\b/i,
      /\b(?:investment opportunity|guaranteed profit|passive income|financial advisor)\b/i
    ]
  },
  {
    id: "crypto-scam",
    label: "Treść związana z kryptowalutami",
    description: "Obietnice zysku i opłaty za wypłatę środków często występują na fałszywych platformach inwestycyjnych.",
    points: 18,
    severity: "high",
    category: "crypto_scam",
    patterns: [/\b(?:bitcoin|btc|ethereum|eth|usdt|krypto|kryptowaluty|crypto profit|crypto|wallet|portfel inwestycyjny)\b/i]
  },
  {
    id: "too-good-to-be-true",
    label: "Nierealistyczna oferta",
    description: "Wysokie nagrody, pewny zysk i prezenty mogą mieć na celu uśpienie czujności.",
    points: 16,
    severity: "medium",
    category: "social_engineering",
    patterns: [/(?:100|300)%|\b(?:bez ryzyka|zero ryzyka|pewny zysk|odbierz nagrodę|odbierz nagrode|wygrałeś|wygrales|risk free|free money|limited offer)\b/i]
  },
  {
    id: "unknown-sender",
    label: "Nieznany nadawca lub nowy numer",
    description: "Historia o nowym numerze telefonu może być próbą podszycia się pod kogoś z rodziny.",
    points: 12,
    severity: "medium",
    category: "social_engineering",
    patterns: [/\b(?:nieznany numer|unknown number|nowy numer|zgubiłem telefon|zgubilem telefon|tu twój wnuk|tu twoj wnuk|mamo to ja|babciu to ja)\b/i]
  },
  {
    id: "secrecy",
    label: "Prośba o zachowanie tajemnicy",
    description: "Prośba o tajemnicę może odciąć od pomocy rodziny lub banku.",
    points: 22,
    severity: "high",
    category: "social_engineering",
    patterns: [/\b(?:nie mów nikomu|nie mow nikomu|nie dzwoń teraz|nie dzwon teraz|to tajemnica|keep this secret|do not tell anyone|nie informuj rodziny)\b/i]
  },
  {
    id: "remote-access",
    label: "Prośba o zdalny dostęp",
    description: "AnyDesk, TeamViewer i zdalny pulpit mogą dać przestępcy kontrolę nad urządzeniem.",
    points: 32,
    severity: "high",
    category: "remote_access_scam",
    patterns: [
      /\b(?:anydesk|teamviewer|zdalny pulpit|remote desktop|remote access|zdalny dostęp|zdalny dostep|screen sharing)\b/i,
      /\b(?:zainstaluj anydesk|zainstaluj teamviewer|udostępnij ekran|udostepnij ekran)\b/i
    ]
  },
  {
    id: "click-or-confirm",
    label: "Polecenie kliknięcia lub potwierdzenia",
    description: "Polecenie kliknięcia, potwierdzenia, logowania lub podania kodu wymaga sprawdzenia nadawcy.",
    points: 15,
    severity: "medium",
    category: "phishing",
    patterns: [/\b(?:kliknij link|kliknij tutaj|wejdź w link|wejdz w link|potwierdź|potwierdz|zaloguj się|zaloguj sie|click here|confirm now)\b/i]
  }
];

const typeRiskBoost: Partial<Record<MessageType, { label: string; category: ScamCategory; ruleIds: string[]; points: number }>> = {
  "BLIK request": { label: "Kontekst prośby o BLIK", category: "blik_fraud", ruleIds: ["blik-request", "unknown-sender", "secrecy"], points: 12 },
  "Delivery message": { label: "Kontekst przesyłki", category: "delivery_scam", ruleIds: ["delivery-scam-wording", "suspicious-link", "shortened-link", "card-data-request"], points: 15 },
  "Bank message": { label: "Kontekst bankowy", category: "banking_fraud", ruleIds: ["fake-bank-wording", "personal-data-request", "threats", "suspicious-link"], points: 10 },
  "Investment offer": { label: "Kontekst inwestycji", category: "investment_scam", ruleIds: ["investment-promise", "crypto-scam", "too-good-to-be-true", "remote-access"], points: 12 },
  "Phone call": { label: "Kontekst rozmowy telefonicznej", category: "social_engineering", ruleIds: ["remote-access", "fake-bank-wording", "unknown-sender", "secrecy"], points: 8 }
};

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

function normalize(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function truncateInput(text: string) {
  return text.length > MAX_ANALYSIS_INPUT_LENGTH ? text.slice(0, MAX_ANALYSIS_INPUT_LENGTH) : text;
}

export function maskSensitiveNumbers(text: string) {
  return text.replace(/(?:\d[\s-]?){9,19}\d/g, (match) => {
    const digits = match.replace(/\D/g, "");

    if (digits.length < 10) {
      return match;
    }

    const lastFour = digits.slice(-4);
    const maskedGroups = Math.max(1, Math.ceil((digits.length - 4) / 4));
    return `${Array.from({ length: maskedGroups }, () => "****").join(" ")} ${lastFour}`;
  });
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createPreview(text: string) {
  const normalized = maskSensitiveNumbers(normalize(text));
  return normalized.length > 160 ? `${normalized.slice(0, 157)}...` : normalized;
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
  const matchedKeywords = findMatches(text, [
    /!!!|\?\?\?/,
    /\b[A-ZĄĆĘŁŃÓŚŹŻ]{8,}\b/,
    /[^\s]{45,}/,
    /(?:\d[\s-]?){9,}/
  ]);

  if (matchedKeywords.length === 0) {
    return null;
  }

  return {
    id: "suspicious-formatting",
    label: "Nietypowy zapis wiadomości",
    description: "Wiele wykrzykników, długie ciągi znaków, wielkie litery lub numery mogą występować w masowych wiadomościach.",
    points: 10,
    severity: "medium",
    category: "phishing",
    matchedKeywords
  };
}

function getDominantCategory(indicators: RiskIndicator[], fallback: ScamCategory): ScamCategory {
  if (indicators.length === 0) {
    return "safe_message";
  }

  const totals = indicators.reduce<Record<string, number>>((acc, indicator) => {
    acc[indicator.category] = (acc[indicator.category] ?? 0) + indicator.points;
    return acc;
  }, {});

  return (Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] as ScamCategory) ?? fallback;
}

function getConfidence(score: number, indicators: RiskIndicator[]): ConfidenceLevel {
  const highSeverityCount = indicators.filter((indicator) => indicator.severity === "high").length;

  if (score >= 70 || highSeverityCount >= 2 || indicators.length >= 5) {
    return "high";
  }

  if (score >= 31 || indicators.length >= 2 || highSeverityCount === 1) {
    return "medium";
  }

  return "low";
}

function buildRecommendations(indicators: RiskIndicator[]): string[] {
  const categories = new Set(indicators.map((indicator) => indicator.category));
  const recommendations = new Set<string>();

  if (categories.has("phishing")) {
    recommendations.add("Nie klikaj linków w wiadomości. Wpisz oficjalny adres strony samodzielnie.");
  }

  if (categories.has("identity_theft") || categories.has("blik_fraud")) {
    recommendations.add("Nie podawaj danych karty, BLIK, PESEL, loginu, hasła ani kodów autoryzacji.");
  }

  if (categories.has("banking_fraud")) {
    recommendations.add("Zadzwoń do banku pod oficjalny numer z karty, aplikacji lub strony banku.");
  }

  if (categories.has("delivery_scam")) {
    recommendations.add("Sprawdź przesyłkę w oficjalnej aplikacji kuriera lub wpisz jego adres samodzielnie.");
  }

  if (categories.has("investment_scam") || categories.has("crypto_scam")) {
    recommendations.add("Nie przelewaj pieniędzy i nie instaluj aplikacji poleconych przez nieznanego doradcę.");
  }

  if (categories.has("remote_access_scam")) {
    recommendations.add("Nie instaluj AnyDesk, TeamViewer ani innego narzędzia zdalnego dostępu na prośbę nieznanej osoby.");
  }

  if (categories.has("social_engineering")) {
    recommendations.add("Przerwij rozmowę i poproś zaufaną osobę o pomoc w ocenie sytuacji.");
  }

  recommendations.add("Zachowaj zrzut ekranu lub kopię wiadomości do ewentualnego zgłoszenia.");
  recommendations.add("W razie wątpliwości skontaktuj się z bankiem, policją lub odpowiednią instytucją oficjalnym kanałem.");

  return Array.from(recommendations);
}

function buildNextSteps(level: RiskLevel): string[] {
  if (level === "high") {
    return [
      "Nie klikaj linków.",
      "Nie odpowiadaj.",
      "Nie podawaj danych.",
      "Jeśli sprawa dotyczy pieniędzy lub danych bankowych, zadzwoń do banku pod oficjalny numer.",
      "Poproś zaufaną osobę z rodziny o pomoc.",
      "W razie potrzeby zgłoś incydent."
    ];
  }

  if (level === "medium") {
    return [
      "Sprawdź nadawcę niezależnym kanałem.",
      "Nie korzystaj z linków w wiadomości.",
      "Samodzielnie znajdź oficjalną stronę.",
      "W razie wątpliwości poproś rodzinę lub pomoc techniczną."
    ];
  }

  return ["Zachowaj ostrożność.", "Nie przekazuj poufnych danych.", "Sprawdzaj nieoczekiwane prośby."];
}

function buildShortSummary(score: number, indicators: RiskIndicator[]) {
  if (indicators.length === 0) {
    return "Nie wykryto typowych sygnałów oszustwa.";
  }

  const topSignals = indicators
    .slice()
    .sort((a, b) => b.points - a.points)
    .slice(0, 3)
    .map((indicator) => indicator.label.toLowerCase());

  if (score > 60) {
    return `Wysokie ryzyko: ${topSignals.join(", ")}.`;
  }

  return `Zachowaj ostrożność: ${topSignals.join(", ")}.`;
}

function buildDetailedExplanation(score: number, indicators: RiskIndicator[], dominantCategory: ScamCategory) {
  if (indicators.length === 0) {
    return "Tekst nie pasuje do typowych wzorców w tym zestawie reguł. To nie gwarantuje bezpieczeństwa, zwłaszcza gdy ktoś prosi o pieniądze, dostęp do konta lub dane.";
  }

  const topSignals = indicators
    .slice()
    .sort((a, b) => b.points - a.points)
    .slice(0, 4)
    .map((indicator) => indicator.label.toLowerCase())
    .join(", ");

  return `Dominujący wzorzec: ${categoryLabels[dominantCategory]}. Wynik ${score}/100 wynika z sygnałów: ${topSignals}. To punktacja reguł, nie prawdopodobieństwo oszustwa. Sprawdź sprawę oficjalnym kanałem przed działaniem.`;
}

function addSynergyBreakdown(ruleIds: Set<string>): ScoringBreakdownItem[] {
  const bonuses: ScoringBreakdownItem[] = [];

  if (ruleIds.has("suspicious-link") && (ruleIds.has("personal-data-request") || ruleIds.has("card-data-request"))) {
    bonuses.push({ label: "Link i prośba o poufne dane", points: 10 });
  }

  if (ruleIds.has("urgency-pressure") && ruleIds.has("threats")) {
    bonuses.push({ label: "Presja czasu i groźby", points: 8 });
  }

  if (ruleIds.has("investment-promise") && ruleIds.has("too-good-to-be-true")) {
    bonuses.push({ label: "Inwestycja i nierealistyczna obietnica", points: 8 });
  }

  if (ruleIds.has("remote-access") && (ruleIds.has("fake-bank-wording") || ruleIds.has("investment-promise"))) {
    bonuses.push({ label: "Zdalny dostęp w kontekście finansowym", points: 10 });
  }

  return bonuses;
}

export function analyzeMessage(messageType: MessageType, rawText: string): AnalysisResult {
  const sourceText = truncateInput(rawText);
  const text = normalize(sourceText);
  const createdAt = new Date().toISOString();
  const wasTruncated = rawText.length > MAX_ANALYSIS_INPUT_LENGTH;

  if (!text) {
    return {
      id: createId(),
      createdAt,
      messageType,
      originalText: "",
      preview: "",
      maskedPreview: "",
      score: 0,
      level: "low",
      dominantCategory: "safe_message",
      confidence: "low",
      shortSummary: "Wklej treść do sprawdzenia.",
      detailedExplanation: "Wklej wiadomość lub opis rozmowy, aby obliczyć wynik.",
      summary: "Wklej podejrzaną wiadomość lub opis rozmowy.",
      indicators: [],
      recommendations: ["Wklej treść i ponownie uruchom analizę."],
      nextSteps: buildNextSteps("low"),
      scoringBreakdown: [{ label: "Brak treści do analizy", points: 0 }],
      wasTruncated: false
    };
  }

  const indicators = rules.reduce<RiskIndicator[]>((matches, rule) => {
    const matchedKeywords = findMatches(text, rule.patterns);

    if (matchedKeywords.length > 0) {
      matches.push({
        id: rule.id,
        label: rule.label,
        description: rule.description,
        points: rule.points,
        severity: rule.severity,
        category: rule.category,
        matchedKeywords
      });
    }

    return matches;
  }, []);

  const formattingIndicator = detectSuspiciousFormatting(text);
  if (formattingIndicator) {
    indicators.push(formattingIndicator);
  }

  const matchedRuleIds = new Set(indicators.map((indicator) => indicator.id));
  const scoringBreakdown: ScoringBreakdownItem[] = indicators.map((indicator) => ({
    label: indicator.label,
    points: indicator.points
  }));

  const contextualBoost = typeRiskBoost[messageType];
  const contextualBoostApplied = Boolean(contextualBoost?.ruleIds.some((ruleId) => matchedRuleIds.has(ruleId)));
  if (contextualBoost && contextualBoostApplied) {
    scoringBreakdown.push({ label: contextualBoost.label, points: contextualBoost.points });
  }

  scoringBreakdown.push(...addSynergyBreakdown(matchedRuleIds));

  if (indicators.length === 0) {
    scoringBreakdown.push({ label: "Nie wykryto głównych sygnałów ostrzegawczych", points: 8 });
  }

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(scoringBreakdown.reduce((total, item) => total + item.points, 0))
    )
  );
  const level = getRiskLevel(score);
  const fallbackCategory = contextualBoost?.category ?? "phishing";
  const dominantCategory = contextualBoost && contextualBoostApplied ? contextualBoost.category : getDominantCategory(indicators, fallbackCategory);
  const confidence = getConfidence(score, indicators);
  const shortSummary = buildShortSummary(score, indicators);
  const detailedExplanation = buildDetailedExplanation(score, indicators, dominantCategory);

  return {
    id: createId(),
    createdAt,
    messageType,
    originalText: sourceText,
    preview: createPreview(sourceText),
    maskedPreview: createPreview(sourceText),
    score,
    level,
    dominantCategory,
    confidence,
    shortSummary,
    detailedExplanation,
    summary: detailedExplanation,
    indicators,
    recommendations: buildRecommendations(indicators),
    nextSteps: buildNextSteps(level),
    scoringBreakdown,
    wasTruncated
  };
}
