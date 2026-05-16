import type { RiskLevel } from "@/lib/types";

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) {
    return "low";
  }

  if (score <= 60) {
    return "medium";
  }

  return "high";
}

export function getRiskLabel(level: RiskLevel) {
  switch (level) {
    case "low":
      return "Low risk";
    case "medium":
      return "Medium risk";
    case "high":
      return "High risk";
  }
}

export function getRiskRange(level: RiskLevel) {
  switch (level) {
    case "low":
      return "0-30";
    case "medium":
      return "31-60";
    case "high":
      return "61-100";
  }
}

export function getRiskTone(level: RiskLevel) {
  switch (level) {
    case "low":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "medium":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "high":
      return "border-red-200 bg-red-50 text-red-800";
  }
}

export function getRiskBarColor(level: RiskLevel) {
  switch (level) {
    case "low":
      return "bg-emerald-500";
    case "medium":
      return "bg-amber-500";
    case "high":
      return "bg-red-500";
  }
}
