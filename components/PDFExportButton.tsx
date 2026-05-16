"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import { buildAnalysisReportText } from "@/lib/pdf";

interface PDFExportButtonProps {
  result: AnalysisResult;
}

export function PDFExportButton({ result }: PDFExportButtonProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  const handleExport = async () => {
    setStatus("saving");

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const lines = doc.splitTextToSize(buildAnalysisReportText(result), 500);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("ScamShield Senior - Analysis Report", 48, 56);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(lines, 48, 88);
      doc.save(`scamshield-report-${result.id.slice(0, 8)}.pdf`);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-teal-100 bg-white px-5 py-3 font-bold text-tealguard shadow-soft transition hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-teal-200"
    >
      <FileText aria-hidden="true" size={20} />
      {status === "saving" ? "Generating..." : status === "error" ? "PDF unavailable" : "Generate PDF report"}
    </button>
  );
}
