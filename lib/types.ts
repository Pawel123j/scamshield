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

export interface RiskIndicator {
  id: string;
  label: string;
  description: string;
  points: number;
  severity: RiskLevel;
  matchedTerms?: string[];
  category?:
    | "link"
    | "data"
    | "payment"
    | "pressure"
    | "threat"
    | "delivery"
    | "bank"
    | "investment"
    | "crypto"
    | "formatting"
    | "sender"
    | "secrecy"
    | "remote-access";
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
  summary: string;
  indicators: RiskIndicator[];
  recommendations: string[];
  scoringBreakdown: ScoringBreakdownItem[];
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
}
