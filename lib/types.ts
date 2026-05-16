export type MessageType =
  | "SMS"
  | "Email"
  | "Phone call"
  | "Bank message"
  | "Delivery message"
  | "BLIK request"
  | "Investment offer"
  | "Other";

export type RiskLevel = "Low" | "Medium" | "High";

export interface RiskIndicator {
  id: string;
  title: string;
  description: string;
  category:
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
  severity: RiskLevel;
  weight: number;
  matchedTerms: string[];
}

export interface AnalysisResult {
  id: string;
  messageType: MessageType;
  inputText: string;
  score: number;
  level: RiskLevel;
  summary: string;
  explanation: string;
  detectedIndicators: RiskIndicator[];
  recommendedActions: string[];
  createdAt: string;
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
