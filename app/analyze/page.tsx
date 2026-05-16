"use client";

import { useState } from "react";
import { ClipboardPaste, RotateCcw, SearchCheck } from "lucide-react";
import { AnalysisResult } from "@/components/AnalysisResult";
import { Disclaimer } from "@/components/Disclaimer";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { analyzeMessage, messageTypes } from "@/lib/scamAnalyzer";
import type { AnalysisResult as AnalysisResultType, MessageType } from "@/lib/types";

const sampleMessages = [
  {
    label: "Bank SMS",
    type: "Bank message" as MessageType,
    text: "Twoje konto zostanie zablokowane w ciągu 24h. Kliknij link i potwierdź dane: https://secure-bank-login.top"
  },
  {
    label: "BLIK request",
    type: "BLIK request" as MessageType,
    text: "Mamo, mam nowy numer. Pilnie potrzebuję zapłacić rachunek. Podaj kod BLIK, oddam wieczorem i nie mów nikomu."
  },
  {
    label: "Delivery fee",
    type: "Delivery message" as MessageType,
    text: "Paczka czeka na doręczenie. Dopłać 1,49 zł za przesyłkę: bit.ly/paczka-doplata"
  }
];

export default function AnalyzePage() {
  const [messageType, setMessageType] = useState<MessageType>("SMS");
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const { addAnalysis } = useAnalysisHistory();

  const handleAnalyze = () => {
    const analysis = analyzeMessage(messageType, text);
    setResult(analysis);

    if (analysis.inputText.trim()) {
      addAnalysis(analysis);
    }
  };

  const handleSample = (sample: (typeof sampleMessages)[number]) => {
    setMessageType(sample.type);
    setText(sample.text);
    const analysis = analyzeMessage(sample.type, sample.text);
    setResult(analysis);
    addAnalysis(analysis);
  };

  const resetForm = () => {
    setText("");
    setResult(null);
    setMessageType("SMS");
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="font-bold text-tealguard">Scam Analyzer</p>
        <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Analyze suspicious message</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Paste an SMS, email, phone script, bank alert, delivery message, BLIK request or investment offer. The local
          rule engine explains the risk in simple language.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
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
                Suspicious text
              </label>
              <textarea
                id="message-text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                rows={11}
                placeholder="Wklej tutaj podejrzaną wiadomość, e-mail albo opisz rozmowę telefoniczną..."
                className="mt-2 w-full resize-y rounded-3xl border border-slate-200 bg-white px-4 py-4 text-ink shadow-sm focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
              />
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
          </div>

          <div className="mt-7 border-t border-slate-100 pt-5">
            <h2 className="text-lg font-black text-ink">Try example cases</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {sampleMessages.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => handleSample(sample)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-teal-100 px-4 py-2 text-sm font-bold text-tealguard transition hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-teal-200"
                >
                  <ClipboardPaste aria-hidden="true" size={17} />
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {result ? (
          <AnalysisResult result={result} />
        ) : (
          <section className="rounded-3xl border border-dashed border-teal-200 bg-white p-8 shadow-soft">
            <div className="flex h-full min-h-[360px] flex-col justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-tealguard">
                <SearchCheck aria-hidden="true" size={28} />
              </span>
              <h2 className="mt-5 text-2xl font-black text-ink">Your analysis will appear here</h2>
              <p className="mt-3 max-w-xl leading-7 text-slate-600">
                The result includes risk score, detected warning signs, a plain-language explanation and recommended
                actions. Analyses are saved only in this browser.
              </p>
            </div>
          </section>
        )}
      </div>

      <Disclaimer />
    </div>
  );
}
