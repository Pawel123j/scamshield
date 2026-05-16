import type { AnalysisResult, ConfidenceLevel, RiskLevel, ScamCategory } from "@/lib/types";

export const storageKeys = {
  analysisHistory: "scamshield.analysisHistory",
  checklist: "scamshield.checklist",
  lessons: "scamshield.lessons",
  seniorMode: "scamshield.seniorMode",
  darkMode: "scamshield.darkMode",
  trustedContacts: "scamshield.trustedContacts",
  scenarioScore: "scamshield.scenarioScore"
} as const;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getLocalStorageItem<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setLocalStorageItem<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // LocalStorage can fail in private modes or when quota is exceeded.
  }
}

export function removeLocalStorageItem(key: string) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage failures so the UI remains usable.
  }
}

export function clearScamShieldStorage() {
  Object.values(storageKeys).forEach((key) => removeLocalStorageItem(key));
}

export function readAnalysisHistory(): AnalysisResult[] {
  const rawHistory = getLocalStorageItem<unknown>(storageKeys.analysisHistory, []);

  if (!Array.isArray(rawHistory)) {
    return [];
  }

  return rawHistory
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item) => normalizeAnalysisItem(item))
    .filter((item): item is AnalysisResult => Boolean(item));
}

export function saveAnalysisHistory(history: AnalysisResult[]) {
  setLocalStorageItem(storageKeys.analysisHistory, history.slice(0, 75));
}

function normalizeLevel(level: unknown): RiskLevel {
  const value = String(level).toLowerCase();

  if (value === "high" || value === "medium" || value === "low") {
    return value;
  }

  return "low";
}

function normalizeConfidence(confidence: unknown): ConfidenceLevel {
  const value = String(confidence).toLowerCase();

  if (value === "high" || value === "medium" || value === "low") {
    return value;
  }

  return "low";
}

function normalizeCategory(category: unknown): ScamCategory {
  const value = String(category);
  const allowed: ScamCategory[] = [
    "phishing",
    "banking_fraud",
    "blik_fraud",
    "delivery_scam",
    "investment_scam",
    "crypto_scam",
    "remote_access_scam",
    "identity_theft",
    "social_engineering",
    "safe_message"
  ];

  return allowed.includes(value as ScamCategory) ? (value as ScamCategory) : "phishing";
}

function normalizeAnalysisItem(item: Record<string, unknown>): AnalysisResult | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const score = Number(item.score);
  const originalText = String(item.originalText ?? item.inputText ?? "");
  const indicators = Array.isArray(item.indicators)
    ? item.indicators
    : Array.isArray(item.detectedIndicators)
      ? item.detectedIndicators
      : [];
  const recommendations = Array.isArray(item.recommendations)
    ? item.recommendations
    : Array.isArray(item.recommendedActions)
      ? item.recommendedActions
      : [];
  const normalizedIndicators = indicators
    .filter((indicator): indicator is Record<string, unknown> => Boolean(indicator && typeof indicator === "object"))
    .map((indicator) => ({
      id: String(indicator.id ?? indicator.label ?? indicator.title ?? "legacy-indicator"),
      label: String(indicator.label ?? indicator.title ?? "Saved warning sign"),
      description: String(indicator.description ?? ""),
      points: Number(indicator.points ?? indicator.weight ?? 0),
      severity: normalizeLevel(indicator.severity),
      category: normalizeCategory(indicator.category),
      matchedKeywords: Array.isArray(indicator.matchedKeywords)
        ? indicator.matchedKeywords.map((keyword) => String(keyword))
        : Array.isArray(indicator.matchedTerms)
          ? indicator.matchedTerms.map((keyword) => String(keyword))
          : []
    }));

  if (!item.id || !item.createdAt || !item.messageType || Number.isNaN(score)) {
    return null;
  }

  return {
    id: String(item.id),
    createdAt: String(item.createdAt),
    messageType: item.messageType as AnalysisResult["messageType"],
    originalText,
    preview: String(item.preview ?? (originalText.length > 140 ? `${originalText.slice(0, 137)}...` : originalText)),
    maskedPreview: String(item.maskedPreview ?? item.preview ?? (originalText.length > 140 ? `${originalText.slice(0, 137)}...` : originalText)),
    score,
    level: normalizeLevel(item.level),
    dominantCategory: normalizeCategory(item.dominantCategory),
    confidence: normalizeConfidence(item.confidence),
    shortSummary: String(item.shortSummary ?? item.summary ?? "Saved analysis"),
    detailedExplanation: String(item.detailedExplanation ?? item.summary ?? "Saved analysis"),
    summary: String(item.summary ?? "Saved analysis"),
    indicators: normalizedIndicators,
    recommendations: recommendations.map((recommendation) => String(recommendation)),
    nextSteps: Array.isArray(item.nextSteps)
      ? item.nextSteps.map((step) => String(step))
      : recommendations.map((recommendation) => String(recommendation)),
    scoringBreakdown: Array.isArray(item.scoringBreakdown)
      ? (item.scoringBreakdown as AnalysisResult["scoringBreakdown"])
      : [{ label: "Legacy saved score", points: score }],
    wasTruncated: Boolean(item.wasTruncated)
  };
}
