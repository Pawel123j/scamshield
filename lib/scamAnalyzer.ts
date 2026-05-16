import { getRiskLevel } from "@/lib/risk";
import type { AnalysisResult, MessageType, RiskIndicator, RiskLevel, ScoringBreakdownItem } from "@/lib/types";

type IndicatorCategory = NonNullable<RiskIndicator["category"]>;

type RuleDefinition = {
  id: string;
  label: string;
  description: string;
  points: number;
  severity: RiskLevel;
  category: IndicatorCategory;
  patterns: RegExp[];
};

const rules: RuleDefinition[] = [
  {
    id: "suspicious-link",
    label: "Suspicious link detected",
    description: "The message contains a link. Scam messages often use links to fake bank, delivery or payment pages.",
    points: 18,
    severity: "medium",
    category: "link",
    patterns: [/\bhttps?:\/\/[^\s]+/i, /\bwww\.[^\s]+/i, /\b[a-z0-9-]+\.(?:top|xyz|ru|click|quest|zip|live|info|site|online)\b/i]
  },
  {
    id: "shortened-link",
    label: "Shortened URL",
    description: "Short links hide the real destination, which makes verification harder.",
    points: 18,
    severity: "high",
    category: "link",
    patterns: [/\b(?:bit\.ly|tinyurl\.com|t\.co|cutt\.ly|shorturl\.at|rebrand\.ly|is\.gd|ow\.ly)\/[^\s]*/i]
  },
  {
    id: "fake-bank-wording",
    label: "Fake bank wording",
    description: "The text uses banking language and should be verified only through official bank contact details.",
    points: 17,
    severity: "medium",
    category: "bank",
    patterns: [
      /\b(?:bank|konto|rachunek|przelew|autoryzacja|transakcja|konsultant banku|banking|transaction|verify account)\b/i,
      /\b(?:sesja wygasła|sesja wygasla|dział bezpieczeństwa banku|dzial bezpieczenstwa banku)\b/i
    ]
  },
  {
    id: "delivery-scam-wording",
    label: "Delivery payment wording",
    description: "Small delivery fees are often used to lure people onto fake payment pages.",
    points: 20,
    severity: "high",
    category: "delivery",
    patterns: [
      /\b(?:paczka|przesyłka|przesylka|kurier|inpost|dpd|dhl|fedex|delivery|doręczenie|doreczenie)\b/i,
      /\b(?:dopłać|doplac|opłata celna|oplata celna|brakuje\s+\d+[,.]?\d*\s*zł|brakuje\s+\d+[,.]?\d*\s*zl)\b/i
    ]
  },
  {
    id: "blik-request",
    label: "BLIK code request",
    description: "A BLIK code can move money immediately. Never share it in a message or call.",
    points: 32,
    severity: "high",
    category: "payment",
    patterns: [/\b(?:blik|kod blik|podaj kod|wyślij kod|wyslij kod|wygeneruj kod|prześlij kod|przeslij kod)\b/i]
  },
  {
    id: "card-data-request",
    label: "Card details request",
    description: "Legitimate institutions do not ask for full card data, CVV/CVC or expiry date through a message link.",
    points: 25,
    severity: "high",
    category: "payment",
    patterns: [/\b(?:cvv|cvc|numer karty|dane karty|podaj dane karty|card number|expiry|data ważności|data waznosci)\b/i]
  },
  {
    id: "personal-data-request",
    label: "Sensitive personal data request",
    description: "PESEL, ID number, login, password and PIN are sensitive and should not be shared with a sender.",
    points: 26,
    severity: "high",
    category: "data",
    patterns: [
      /\b(?:pesel|podaj pesel|numer dowodu|dowód osobisty|dowod osobisty|login|hasło|haslo|password|pin)\b/i,
      /\b(?:potwierdź dane|potwierdz dane|confirm your details|verify your identity|verify your account|dane logowania)\b/i
    ]
  },
  {
    id: "urgency-pressure",
    label: "Urgency or time pressure",
    description: "Scammers create pressure so the victim acts before checking the story calmly.",
    points: 15,
    severity: "medium",
    category: "pressure",
    patterns: [/\b(?:pilnie|natychmiast|teraz|w ciągu 24h|w ciagu 24h|ostatnia szansa|urgent|immediately|act now|today only|nie zwlekaj)\b/i]
  },
  {
    id: "threats",
    label: "Threats or consequences",
    description: "Threats about blocked accounts, debt, court, police or prosecution are common manipulation tactics.",
    points: 22,
    severity: "high",
    category: "threat",
    patterns: [
      /\b(?:konto zostanie zablokowane|your account will be blocked|blocked account|blokada konta|zablokujemy konto)\b/i,
      /\b(?:policja|prokuratura|sąd|sad|wezwanie do zapłaty|wezwanie do zaplaty|komornik|dług|dlug|debt|court|police)\b/i
    ]
  },
  {
    id: "investment-promise",
    label: "Investment profit promise",
    description: "Guaranteed or unusually fast investment returns are a strong scam warning sign.",
    points: 24,
    severity: "high",
    category: "investment",
    patterns: [
      /\b(?:inwestycja|platforma inwestycyjna|szybki zysk|gwarantowany zysk|zarób|zarob|pasywny dochód|pasywny dochod)\b/i,
      /\b(?:investment opportunity|guaranteed profit|passive income|financial advisor)\b/i
    ]
  },
  {
    id: "crypto-scam",
    label: "Cryptocurrency scam wording",
    description: "Crypto profit promises and withdrawal fees are common in fake investment platforms.",
    points: 18,
    severity: "high",
    category: "crypto",
    patterns: [/\b(?:bitcoin|btc|ethereum|eth|usdt|krypto|kryptowaluty|crypto profit|crypto|wallet|portfel inwestycyjny)\b/i]
  },
  {
    id: "too-good-to-be-true",
    label: "Too-good-to-be-true offer",
    description: "Very high rewards, guaranteed returns or prizes are designed to lower caution.",
    points: 16,
    severity: "medium",
    category: "investment",
    patterns: [/\b(?:100%|300%|bez ryzyka|zero ryzyka|pewny zysk|odbierz nagrodę|odbierz nagrode|wygrałeś|wygrales|risk free|free money|limited offer)\b/i]
  },
  {
    id: "unknown-sender",
    label: "Unknown sender or new number",
    description: "Unknown numbers and sudden new-number stories often appear in family impersonation scams.",
    points: 12,
    severity: "medium",
    category: "sender",
    patterns: [/\b(?:nieznany numer|unknown number|nowy numer|zgubiłem telefon|zgubilem telefon|tu twój wnuk|tu twoj wnuk|mamo to ja|babciu to ja)\b/i]
  },
  {
    id: "secrecy",
    label: "Secrecy request",
    description: "A request to keep the situation secret can isolate the victim from family or bank support.",
    points: 22,
    severity: "high",
    category: "secrecy",
    patterns: [/\b(?:nie mów nikomu|nie mow nikomu|nie dzwoń teraz|nie dzwon teraz|to tajemnica|keep this secret|do not tell anyone|nie informuj rodziny)\b/i]
  },
  {
    id: "remote-access",
    label: "Remote access tool request",
    description: "AnyDesk, TeamViewer and remote desktop tools can give a criminal control over the device.",
    points: 31,
    severity: "high",
    category: "remote-access",
    patterns: [
      /\b(?:anydesk|teamviewer|zdalny pulpit|remote desktop|remote access|zdalny dostęp|zdalny dostep|screen sharing)\b/i,
      /\b(?:zainstaluj anydesk|zainstaluj teamviewer|udostępnij ekran|udostepnij ekran)\b/i
    ]
  },
  {
    id: "click-or-confirm",
    label: "Instruction to click or confirm",
    description: "Scam messages often use simple commands such as click, confirm, sign in or provide a code.",
    points: 15,
    severity: "medium",
    category: "pressure",
    patterns: [/\b(?:kliknij link|kliknij tutaj|wejdź w link|wejdz w link|potwierdź|potwierdz|zaloguj się|zaloguj sie|click here|confirm now)\b/i]
  }
];

const typeRiskBoost: Partial<Record<MessageType, { label: string; ruleIds: string[]; points: number }>> = {
  "BLIK request": { label: "BLIK request context", ruleIds: ["blik-request", "unknown-sender", "secrecy"], points: 12 },
  "Delivery message": { label: "Delivery message context", ruleIds: ["delivery-scam-wording", "suspicious-link", "card-data-request"], points: 10 },
  "Bank message": { label: "Bank message context", ruleIds: ["fake-bank-wording", "personal-data-request", "threats", "suspicious-link"], points: 10 },
  "Investment offer": { label: "Investment offer context", ruleIds: ["investment-promise", "crypto-scam", "too-good-to-be-true", "remote-access"], points: 12 },
  "Phone call": { label: "Phone call social-engineering context", ruleIds: ["remote-access", "fake-bank-wording", "unknown-sender", "secrecy"], points: 8 }
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

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createPreview(text: string) {
  const normalized = normalize(text);
  return normalized.length > 140 ? `${normalized.slice(0, 137)}...` : normalized;
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
  const matchedTerms = findMatches(text, [
    /!!!|\?\?\?/,
    /\b[A-ZĄĆĘŁŃÓŚŹŻ]{8,}\b/,
    /[^\s]{45,}/,
    /(?:\d[\s-]?){9,}/
  ]);

  if (matchedTerms.length === 0) {
    return null;
  }

  return {
    id: "suspicious-formatting",
    label: "Suspicious formatting",
    description: "Chaotic punctuation, very long strings, all-caps text or phone-like number blocks can indicate a mass scam message.",
    points: 10,
    severity: "medium",
    category: "formatting",
    matchedTerms
  };
}

function buildRecommendations(indicators: RiskIndicator[]): string[] {
  const categories = new Set(indicators.map((indicator) => indicator.category));
  const recommendations = new Set<string>();

  if (categories.has("link")) {
    recommendations.add("Do not click the link. Open the organization website manually or use the official app.");
  }

  if (categories.has("payment") || categories.has("data")) {
    recommendations.add("Do not provide card details, BLIK codes, PESEL, login, password or authorization codes.");
  }

  if (categories.has("bank")) {
    recommendations.add("Contact the bank using the official phone number from your card, banking app or bank website.");
  }

  if (categories.has("delivery")) {
    recommendations.add("Check delivery status in the official courier app or by typing the courier address yourself.");
  }

  if (categories.has("investment") || categories.has("crypto")) {
    recommendations.add("Do not send money or install investment apps recommended by an unknown consultant.");
  }

  if (categories.has("remote-access")) {
    recommendations.add("Do not install AnyDesk, TeamViewer or any remote access tool for an unknown caller.");
  }

  if (categories.has("secrecy") || categories.has("pressure") || categories.has("sender")) {
    recommendations.add("Pause the conversation and ask a trusted family member for a second opinion.");
  }

  recommendations.add("Save a screenshot or copy of the message if you need to report the incident.");
  recommendations.add("When in doubt, contact your bank, police or the relevant organization through official channels.");

  return Array.from(recommendations);
}

function buildSummary(score: number, indicators: RiskIndicator[]) {
  if (indicators.length === 0) {
    return "No common scam indicators were detected. Keep using caution, especially before sending money or personal data.";
  }

  const topSignals = indicators
    .slice()
    .sort((a, b) => b.points - a.points)
    .slice(0, 3)
    .map((indicator) => indicator.label.toLowerCase());

  if (score > 60) {
    return `This message is high risk because it contains ${topSignals.join(", ")}. Do not follow the instructions before independent verification.`;
  }

  return `This message needs caution because it contains ${topSignals.join(", ")}. Verify it through an official channel before acting.`;
}

function addSynergyBreakdown(ruleIds: Set<string>): ScoringBreakdownItem[] {
  const bonuses: ScoringBreakdownItem[] = [];

  if (ruleIds.has("suspicious-link") && (ruleIds.has("personal-data-request") || ruleIds.has("card-data-request"))) {
    bonuses.push({ label: "Link combined with sensitive data request", points: 10 });
  }

  if (ruleIds.has("urgency-pressure") && ruleIds.has("threats")) {
    bonuses.push({ label: "Urgency combined with threats", points: 8 });
  }

  if (ruleIds.has("investment-promise") && ruleIds.has("too-good-to-be-true")) {
    bonuses.push({ label: "Investment offer combined with too-good-to-be-true promise", points: 8 });
  }

  if (ruleIds.has("remote-access") && (ruleIds.has("fake-bank-wording") || ruleIds.has("investment-promise"))) {
    bonuses.push({ label: "Remote access request in financial context", points: 10 });
  }

  return bonuses;
}

export function analyzeMessage(messageType: MessageType, rawText: string): AnalysisResult {
  const text = normalize(rawText);
  const createdAt = new Date().toISOString();

  if (!text) {
    return {
      id: createId(),
      createdAt,
      messageType,
      originalText: rawText,
      preview: "",
      score: 0,
      level: "low",
      summary: "Paste a suspicious message, e-mail or call description to receive an analysis.",
      indicators: [],
      recommendations: ["Paste suspicious content and run the analysis again."],
      scoringBreakdown: [{ label: "No content to analyze", points: 0 }]
    };
  }

  const indicators: RiskIndicator[] = rules
    .map((rule) => {
      const matchedTerms = findMatches(text, rule.patterns);

      if (matchedTerms.length === 0) {
        return null;
      }

      return {
        id: rule.id,
        label: rule.label,
        description: rule.description,
        points: rule.points,
        severity: rule.severity,
        category: rule.category,
        matchedTerms
      };
    })
    .filter((indicator): indicator is RiskIndicator => Boolean(indicator));

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
  if (contextualBoost?.ruleIds.some((ruleId) => matchedRuleIds.has(ruleId))) {
    scoringBreakdown.push({ label: contextualBoost.label, points: contextualBoost.points });
  }

  scoringBreakdown.push(...addSynergyBreakdown(matchedRuleIds));

  if (indicators.length === 0) {
    scoringBreakdown.push({ label: "No major warning signs detected", points: 8 });
  }

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(scoringBreakdown.reduce((total, item) => total + item.points, 0))
    )
  );
  const level = getRiskLevel(score);

  return {
    id: createId(),
    createdAt,
    messageType,
    originalText: rawText,
    preview: createPreview(rawText),
    score,
    level,
    summary: buildSummary(score, indicators),
    indicators,
    recommendations: buildRecommendations(indicators),
    scoringBreakdown
  };
}
