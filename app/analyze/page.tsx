"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eraser, RotateCcw, SearchCheck, ShieldCheck } from "lucide-react";
import { AnalysisResult } from "@/components/AnalysisResult";
import { Disclaimer } from "@/components/Disclaimer";
import { ExampleMessageButton } from "@/components/ExampleMessageButton";
import { exampleMessages, type ExampleMessage } from "@/data/examples";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { analyzeMessage, MAX_ANALYSIS_INPUT_LENGTH, messageTypes } from "@/lib/scamAnalyzer";
import type { AnalysisResult as AnalysisResultType, MessageType } from "@/lib/types";

export default function AnalyzePage() {
  const [messageType, setMessageType] = useState<MessageType>("SMS");
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const { addAnalysis } = useAnalysisHistory();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const example = searchParams.get("example");
    const type = searchParams.get("type") as MessageType | null;

    if (example) {
      const safeType = type && messageTypes.includes(type) ? type : "SMS";
      setMessageType(safeType);
      setText(example.slice(0, MAX_ANALYSIS_INPUT_LENGTH));
    }
  }, []);

  const runAnalysis = (type: MessageType, content: string) => {
    const analysis = analyzeMessage(type, content);
    setResult(analysis);

    if (analysis.originalText.trim()) {
      addAnalysis(analysis);
    }
  };

  const handleAnalyze = () => {
    runAnalysis(messageType, text);
  };

  const handleSample = (example: ExampleMessage) => {
    setMessageType(example.type);
    setText(example.text.slice(0, MAX_ANALYSIS_INPUT_LENGTH));
    runAnalysis(example.type, example.text);
  };

  const resetForm = () => {
    setText("");
    setResult(null);
    setMessageType("SMS");
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-soft">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="font-bold text-cyan-200">Scam Analyzer</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Analyze suspicious message</h1>
            <p className="mt-3 max-w-3xl text-cyan-50">
              Paste an SMS, email, phone call script, bank alert, delivery message, BLIK request or investment offer.
              The local rule engine explains the risk without sending content to an external AI service.
            </p>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck aria-hidden="true" className="text-cyan-200" size={26} />
              <p className="font-black">Privacy-first analysis</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-cyan-50">
              Analysis runs in the browser. Avoid entering real passwords, full card numbers, PESEL or banking credentials.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
          <div className="space-y-5">
            <div>
              <label htmlFor="message-type" className="block text-sm font-black text-ink">
                Message type
              </label>
              <select
                id="message-type"
                value={messageType}
                onChange={(event) => setMessageType(event.target.value as MessageType)}
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-ink shadow-sm focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
              >
                {messageTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message-text" className="block text-sm font-black text-ink">
                Suspicious content
              </label>
              <textarea
                id="message-text"
                value={text}
                maxLength={MAX_ANALYSIS_INPUT_LENGTH}
                onChange={(event) => setText(event.target.value.slice(0, MAX_ANALYSIS_INPUT_LENGTH))}
                rows={12}
                placeholder="Paste a suspicious SMS, email, link or describe a phone call..."
                className="mt-2 w-full resize-y rounded-3xl border border-slate-200 bg-white px-4 py-4 text-ink shadow-sm focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
              />
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Tip: do not paste real passwords, full card numbers, PESEL numbers or banking credentials. {text.length}/
                {MAX_ANALYSIS_INPUT_LENGTH} characters.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAnalyze}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-tealguard px-5 py-3 font-black text-white shadow-soft transition hover:bg-ocean focus:outline-none focus:ring-4 focus:ring-teal-200"
              >
                <SearchCheck aria-hidden="true" size={22} />
                Analyze
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-ink transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-teal-200"
              >
                <RotateCcw aria-hidden="true" size={21} />
                Reset
              </button>
            </div>
            <button
              type="button"
              onClick={() => setText("")}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-ink transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-teal-200"
            >
              <Eraser aria-hidden="true" size={20} />
              Clear input
            </button>
          </div>

          <div className="mt-7 border-t border-slate-100 pt-5">
            <h2 className="text-lg font-black text-ink">Load realistic examples</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {exampleMessages.map((example) => (
                <ExampleMessageButton key={example.label} example={example} onLoad={handleSample} />
              ))}
            </div>
          </div>
        </section>

        {result ? (
          <AnalysisResult result={result} />
        ) : (
          <section className="rounded-3xl border border-dashed border-teal-200 bg-white p-8 shadow-soft">
            <div className="flex h-full min-h-[420px] flex-col justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-tealguard">
                <SearchCheck aria-hidden="true" size={28} />
              </span>
              <h2 className="mt-5 text-2xl font-black text-ink">Your explainable analysis will appear here</h2>
              <p className="mt-3 max-w-xl leading-7 text-slate-600">
                You will see a risk score, risk level, detected indicators, point-by-point scoring, recommended actions,
                copy buttons and an optional PDF report.
              </p>
              <Link
                href="/privacy-security"
                className="mt-6 inline-flex min-h-12 w-fit items-center rounded-2xl border border-teal-100 px-5 py-3 font-bold text-tealguard hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-teal-200"
              >
                How privacy works
              </Link>
            </div>
          </section>
        )}
      </div>

      <Disclaimer />
    </div>
  );
}
