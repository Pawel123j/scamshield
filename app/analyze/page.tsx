"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RotateCcw, SearchCheck } from "lucide-react";
import { AnalysisResult } from "@/components/AnalysisResult";
import { Disclaimer } from "@/components/Disclaimer";
import { ExampleMessageButton } from "@/components/ExampleMessageButton";
import { exampleMessages, type ExampleMessage } from "@/data/examples";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { analyzeMessage, MAX_ANALYSIS_INPUT_LENGTH, messageTypes } from "@/lib/scamAnalyzer";
import { messageTypeLabels } from "@/lib/labels";
import type { AnalysisResult as Result, MessageType } from "@/lib/types";

export default function AnalyzePage() {
  const [messageType, setMessageType] = useState<MessageType>("SMS");
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);
  const { addAnalysis, saveError, retrySave } = useAnalysisHistory();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const example = params.get("example");
    const type = params.get("type") as MessageType | null;
    if (example) {
      setMessageType(type && messageTypes.includes(type) ? type : "SMS");
      setText(example.slice(0, MAX_ANALYSIS_INPUT_LENGTH));
    }
  }, []);

  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

  const runAnalysis = (type: MessageType, content: string) => {
    if (!content.trim()) { setError("Wklej wiadomość lub wybierz przykład poniżej."); return; }
    setError("");
    const analysis = analyzeMessage(type, content);
    setResult(analysis);
    addAnalysis(analysis);
  };
  const handleSample = (example: ExampleMessage) => {
    setMessageType(example.type);
    setText(example.text.slice(0, MAX_ANALYSIS_INPUT_LENGTH));
    runAnalysis(example.type, example.text);
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-black sm:text-4xl">Sprawdź podejrzaną wiadomość</h1>
        <p className="mt-2 text-slate-600">Zatrzymaj się. Sprawdź sygnały ostrzegawcze przed odpowiedzią.</p>
      </header>
      {saveError && <div role="status" className="rounded-2xl bg-amber-50 p-4 text-amber-950">Nie zapisano historii. Wynik pozostaje w tej karcie; skopiuj go przed zamknięciem. <button className="min-h-12 underline" onClick={retrySave}>Ponów zapis</button></div>}
      <div className="grid items-start gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-3xl border border-teal-100 bg-white p-4 shadow-soft sm:p-6">
          <form onSubmit={(event) => { event.preventDefault(); runAnalysis(messageType, text); }} className="space-y-4">
            <div>
              <label htmlFor="message-type" className="block font-bold">Typ wiadomości</label>
              <select id="message-type" value={messageType} onChange={(event) => setMessageType(event.target.value as MessageType)} className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 focus:ring-4 focus:ring-teal-200">
                {messageTypes.map(type => <option key={type} value={type}>{messageTypeLabels[type]}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="message-text" className="block font-bold">Treść wiadomości</label>
              <textarea id="message-text" value={text} maxLength={MAX_ANALYSIS_INPUT_LENGTH} onChange={(event) => setText(event.target.value.slice(0, MAX_ANALYSIS_INPUT_LENGTH))} rows={4} placeholder="Wklej SMS, e-mail lub opisz rozmowę…" aria-describedby="input-privacy input-error" aria-invalid={Boolean(error)} className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-white px-3 py-3 focus:ring-4 focus:ring-teal-200" />
              <p id="input-privacy" className="mt-1 text-sm text-slate-600">Analiza działa lokalnie. Nie wpisuj haseł, PESEL ani danych karty. {text.length}/{MAX_ANALYSIS_INPUT_LENGTH}</p>
              <p id="input-error" role="alert" className="text-red-800">{error}</p>
            </div>
            <button type="submit" className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-tealguard px-5 py-3 font-black text-white shadow-soft hover:bg-ocean focus:ring-4 focus:ring-teal-200"><SearchCheck aria-hidden="true" size={22} />Sprawdź wiadomość</button>
            <button type="button" onClick={() => { setText(""); setResult(null); setError(""); }} className="inline-flex min-h-12 items-center gap-2 rounded-2xl px-3 py-2 font-bold text-tealguard hover:bg-teal-50"><RotateCcw aria-hidden="true" size={20} />Wyczyść</button>
          </form>
          <details className="mt-3 border-t border-slate-100 pt-3">
            <summary className="min-h-12 cursor-pointer py-3 font-bold">Wypróbuj przykładową wiadomość</summary>
            <div className="mt-3 flex flex-wrap gap-2">{exampleMessages.map(example => <ExampleMessageButton key={example.label} example={example} onLoad={handleSample} />)}</div>
          </details>
          <Link href="/privacy-security" className="mt-3 inline-flex min-h-12 items-center font-bold text-tealguard underline">Jak chronimy prywatność</Link>
        </section>
        <div ref={resultRef} tabIndex={-1} aria-label="Wynik analizy" className="scroll-mt-24 rounded-3xl focus:outline-none focus:ring-4 focus:ring-teal-200">
          {result ? <AnalysisResult result={result} /> : <section className="rounded-3xl border border-dashed border-teal-200 bg-white p-6"><h2 className="text-xl font-black">Tutaj pojawi się wynik</h2><p className="mt-3 text-slate-600">Zobaczysz wykryte sygnały, punktację i wskazówki. Narzędzie może się mylić; niski wynik nie jest gwarancją bezpieczeństwa.</p></section>}
        </div>
      </div>
      <Disclaimer />
    </div>
  );
}
