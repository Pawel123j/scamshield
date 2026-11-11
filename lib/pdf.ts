import { messageTypeLabels, categoryLabels, confidenceLabels } from "@/lib/labels";
import { formatDateTime } from "@/lib/date";
import { getRiskLabel } from "@/lib/risk";
import type { AnalysisResult } from "@/lib/types";

export function buildAnalysisReportText(result: AnalysisResult) {
  const indicators = result.indicators.length
    ? result.indicators.map((indicator) => `- ${indicator.label}: ${indicator.description}`).join("\n")
    : "- Nie wykryto typowych sygnałów oszustwa.";

  const scoring = result.scoringBreakdown.map((item) => `- ${item.label}: +${item.points}`).join("\n");
  const recommendations = result.recommendations.map((item) => `- ${item}`).join("\n");
  const nextSteps = result.nextSteps.map((item, index) => `${index + 1}. ${item}`).join("\n");

  return [
    `Data: ${formatDateTime(result.createdAt)}`,
    `Typ wiadomości: ${messageTypeLabels[result.messageType]}`,
    `Wynik ryzyka: ${result.score}/100`,
    `Poziom ryzyka: ${getRiskLabel(result.level)}`,
    `Dominująca kategoria: ${categoryLabels[result.dominantCategory]}`,
    `Nasilenie sygnałów: ${confidenceLabels[result.confidence]}`,
    `Podgląd: ${result.maskedPreview || result.preview || "Brak podglądu."}`,
    "",
    "Podsumowanie:",
    result.detailedExplanation,
    "",
    "Wykryte sygnały:",
    indicators,
    "",
    "Składniki punktacji:",
    scoring,
    "",
    "Zalecane działania:",
    recommendations,
    "",
    "Co zrobić teraz?",
    nextSteps,
    "",
    "Ograniczenia:",
    "Narzędzie edukacyjne może się mylić. Niski wynik nie gwarantuje bezpieczeństwa. W razie wątpliwości skontaktuj się z bankiem lub policją oficjalnym kanałem."
  ].join("\n");
}
