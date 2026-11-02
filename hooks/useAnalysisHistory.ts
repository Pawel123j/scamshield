"use client";
import { useEffect, useSyncExternalStore } from "react";
import type { AnalysisResult } from "@/lib/types";
import { readAnalysisHistory, saveAnalysisHistory } from "@/lib/storage";

const initial = { history: [] as AnalysisResult[], saveError: false, hasLoaded: false };
let snapshot = initial;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
function publish(next: typeof initial) { snapshot = next; listeners.forEach(listener => listener()); }
function save(history: AnalysisResult[]) {
  publish({ history, hasLoaded: true, saveError: !saveAnalysisHistory(history) });
}

/** Shared tab memory preserves unsaved analyses when navigating to History. */
export function useAnalysisHistory() {
  const state = useSyncExternalStore(subscribe, () => snapshot, () => initial);
  useEffect(() => {
    if (!snapshot.hasLoaded) publish({ history: readAnalysisHistory(), saveError: false, hasLoaded: true });
  }, []);
  return {
    ...state,
    addAnalysis: (result: AnalysisResult) => save([result, ...snapshot.history].slice(0, 50)),
    deleteAnalysis: (id: string) => save(snapshot.history.filter(item => item.id !== id)),
    clearHistory: () => save([]),
    retrySave: () => save(snapshot.history)
  };
}
