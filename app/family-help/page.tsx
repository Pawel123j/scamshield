"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

export default function FamilyHelpPage() {
  const [whatHappened, setWhatHappened] = useState("");
  const [description, setDescription] = useState("");
  const [suspiciousText, setSuspiciousText] = useState("");

  const generatedMessage = useMemo(() => {
    const parts = [
      "Cześć, dostałem/am podejrzaną wiadomość lub telefon. Możesz mi pomóc sprawdzić, czy to oszustwo?",
      whatHappened.trim() ? `Co się stało: ${whatHappened.trim()}.` : "",
      description.trim() ? `Opis: ${description.trim()}.` : "",
      suspiciousText.trim() ? `Treść: ${suspiciousText.trim()}` : ""
    ].filter(Boolean);

    return parts.join("\n");
  }, [description, suspiciousText, whatHappened]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="font-bold text-tealguard">Family support</p>
        <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Family help message generator</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Create a simple message that asks a trusted family member to help verify a suspicious situation.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-black text-ink">What happened?</span>
              <input
                value={whatHappened}
                onChange={(event) => setWhatHappened(event.target.value)}
                placeholder="Np. dostałem SMS z banku, ktoś zadzwonił, ktoś prosi o BLIK"
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 px-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-black text-ink">Message or call description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                placeholder="Opisz spokojnie, kto napisał lub zadzwonił i o co prosił..."
                className="mt-2 w-full rounded-3xl border border-slate-200 px-4 py-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-black text-ink">Optional suspicious text</span>
              <textarea
                value={suspiciousText}
                onChange={(event) => setSuspiciousText(event.target.value)}
                rows={5}
                placeholder="Wklej treść SMS-a, e-maila lub fragment rozmowy..."
                className="mt-2 w-full rounded-3xl border border-slate-200 px-4 py-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-tealguard">
              <Sparkles aria-hidden="true" size={24} />
            </span>
            <div>
              <h2 className="text-2xl font-black text-ink">Generated message</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Send this to a trusted person before clicking links, sending money or sharing codes.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <pre className="whitespace-pre-wrap font-sans text-base leading-7 text-ink">{generatedMessage}</pre>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <CopyButton text={generatedMessage} />
            <a
              href={`sms:?body=${encodeURIComponent(generatedMessage)}`}
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-teal-100 bg-white px-5 py-3 font-bold text-tealguard transition hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-teal-200"
            >
              <MessageCircle aria-hidden="true" size={20} />
              Open SMS
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
