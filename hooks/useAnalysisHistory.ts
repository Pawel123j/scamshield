"use client";

import { useEffect, useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import { readAnalysisHistory, saveAnalysisHistory } from "@/lib/storage";

export function useAnalysisHistory() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setHistory(readAnalysisHistory());
    setHasLoaded(true);
  }, []);

  const addAnalysis = (result: AnalysisResult) => {
    setHistory((currentHistory) => {
      const nextHistory = [result, ...currentHistory].slice(0, 50);
      saveAnalysisHistory(nextHistory);
      return nextHistory;
    });
  };

  const deleteAnalysis = (id: string) => {
    setHistory((currentHistory) => {
      const nextHistory = currentHistory.filter((item) => item.id !== id);
      saveAnalysisHistory(nextHistory);
      return nextHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    saveAnalysisHistory([]);
  };

  return {
    history,
    hasLoaded,
    addAnalysis,
    deleteAnalysis,
    clearHistory
  };
}
