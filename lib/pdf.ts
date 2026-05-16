import { formatDateTime } from "@/lib/date";
import { getRiskLabel } from "@/lib/risk";
import type { AnalysisResult } from "@/lib/types";

export function buildAnalysisReportText(result: AnalysisResult) {
  const indicators = result.indicators.length
    ? result.indicators.map((indicator) => `- ${indicator.label}: ${indicator.description}`).join("\n")
    : "- No common scam indicators detected.";

  const scoring = result.scoringBreakdown.map((item) => `- ${item.label}: +${item.points}`).join("\n");
  const recommendations = result.recommendations.map((item) => `- ${item}`).join("\n");

  return [
    `Date: ${formatDateTime(result.createdAt)}`,
    `Message type: ${result.messageType}`,
    `Risk score: ${result.score}/100`,
    `Risk level: ${getRiskLabel(result.level)}`,
    `Preview: ${result.preview || "No preview saved."}`,
    "",
    "Summary:",
    result.summary,
    "",
    "Detected indicators:",
    indicators,
    "",
    "Scoring breakdown:",
    scoring,
    "",
    "Recommended actions:",
    recommendations,
    "",
    "Disclaimer:",
    "This tool helps identify suspicious messages, but it does not replace official bank, police, or cybersecurity support."
  ].join("\n");
}
