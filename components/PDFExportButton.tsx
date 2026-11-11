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
      const response = await fetch("/fonts/DejaVuSans.ttf");
      if (!response.ok) throw new Error("Font unavailable");
      const bytes = new Uint8Array(await response.arrayBuffer());
      let binary = "";
      for (const byte of bytes) binary += String.fromCharCode(byte);
      doc.addFileToVFS("DejaVuSans.ttf", btoa(binary));
      doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
      doc.setFont("DejaVuSans", "normal");
      doc.setFontSize(18);
      doc.text("ScamShield Senior — raport analizy", 48, 56);
      doc.setFontSize(11);
      const lines: string[] = doc.splitTextToSize(buildAnalysisReportText(result), 500);
      let y = 88;
      for (const line of lines) {
        if (y > 790) { doc.addPage(); y = 48; }
        doc.text(line, 48, y);
        y += 16;
      }
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
      disabled={status === "saving"}
      className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-teal-100 bg-white px-5 py-3 font-bold text-tealguard shadow-soft transition hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-teal-200"
    >
      <FileText aria-hidden="true" size={20} />
      {status === "saving" ? "Generowanie…" : status === "error" ? "PDF niedostępny — ponów" : "Pobierz raport PDF"}
    </button>
  );
}
