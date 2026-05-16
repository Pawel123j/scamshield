import type { AnalysisResult } from "@/lib/types";

export const storageKeys = {
  analysisHistory: "scamshield.analysisHistory",
  checklist: "scamshield.checklist",
  lessons: "scamshield.lessons",
  seniorMode: "scamshield.seniorMode"
} as const;

export function readAnalysisHistory(): AnalysisResult[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(storageKeys.analysisHistory);
    return raw ? (JSON.parse(raw) as AnalysisResult[]) : [];
  } catch {
    return [];
  }
}

export function saveAnalysisHistory(history: AnalysisResult[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKeys.analysisHistory, JSON.stringify(history.slice(0, 50)));
}
