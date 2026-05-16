export type MessageType =
  | "SMS"
  | "Email"
  | "Phone call"
  | "Bank message"
  | "Delivery message"
  | "BLIK request"
  | "Investment offer"
  | "Other";

export type RiskLevel = "low" | "medium" | "high";
export type ConfidenceLevel = "low" | "medium" | "high";

export type ScamCategory =
  | "phishing"
  | "banking_fraud"
  | "blik_fraud"
  | "delivery_scam"
  | "investment_scam"
  | "crypto_scam"
  | "remote_access_scam"
  | "identity_theft"
  | "social_engineering"
  | "safe_message";

export interface RiskIndicator {
  id: string;
  label: string;
  description: string;
  points: number;
  severity: RiskLevel;
  category: ScamCategory;
  matchedKeywords?: string[];
}

export interface ScoringBreakdownItem {
  label: string;
  points: number;
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  messageType: MessageType;
  originalText: string;
  preview: string;
  score: number;
  level: RiskLevel;
  dominantCategory: ScamCategory;
  confidence: ConfidenceLevel;
  shortSummary: string;
  detailedExplanation: string;
  summary: string;
  indicators: RiskIndicator[];
  recommendations: string[];
  nextSteps: string[];
  scoringBreakdown: ScoringBreakdownItem[];
  wasTruncated: boolean;
  maskedPreview: string;
}

export interface ScamExample {
  id: string;
  title: string;
  category: string;
  riskLevel: RiskLevel;
  howItWorks: string;
  warningSigns: string[];
  whatToDo: string[];
  exampleMessage: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  explanation: string;
  bullets: string[];
  quiz: QuizQuestion[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
}

export interface UserSettings {
  seniorMode: boolean;
  darkMode: boolean;
}

export interface TrustedContact {
  id: string;
  name: string;
  relation: string;
  phone?: string;
  email?: string;
  preferredContactMethod: "Phone" | "SMS" | "WhatsApp" | "Messenger" | "Email";
}
