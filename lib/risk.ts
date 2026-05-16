import type { RiskLevel } from "@/lib/types";

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) {
    return "Low";
  }

  if (score <= 60) {
    return "Medium";
  }

  return "High";
}

export function getRiskLabel(level: RiskLevel) {
  switch (level) {
    case "Low":
      return "Niskie ryzyko";
    case "Medium":
      return "Średnie ryzyko";
    case "High":
      return "Wysokie ryzyko";
  }
}

export function getRiskTone(level: RiskLevel) {
  switch (level) {
    case "Low":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "Medium":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "High":
      return "border-red-200 bg-red-50 text-red-800";
  }
}
