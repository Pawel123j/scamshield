"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

export default function FamilyHelpPage() {
  const [whatHappened, setWhatHappened] = useState("");
  const [description, setDescription] = useState("");
  const [suspiciousText, setSuspiciousText] = useState("");
  const [urgency, setUrgency] = useState("Nie wiem");
  const [contactMethod, setContactMethod] = useState("Telefon");

  const generatedMessage = useMemo(() => {
    return [
      "Cześć, dostałem/am podejrzaną wiadomość lub telefon. Możesz mi pomóc sprawdzić, czy to oszustwo?",
      "",
      "Co się stało:",
      whatHappened.trim() || "Nie jestem pewien/pewna, jak to opisać.",
      "",
      "Opis sytuacji:",
      description.trim() || "Potrzebuję spokojnej weryfikacji.",
      "",
      `Pilność według nadawcy: ${urgency}`,
      `Najwygodniejszy kontakt: ${contactMethod}`,
      "",
      suspiciousText.trim() ? `Treść wiadomości:\n${suspiciousText.trim()}\n` : "Treść wiadomości:\nBrak wklejonej treści.\n",
      "Nie klikam żadnych linków, nie podaję kodów ani danych i czekam na Twoją pomoc."
    ].join("\n");
  }, [contactMethod, description, suspiciousText, urgency, whatHappened]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="font-bold text-tealguard">Family support</p>
        <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Family help message generator</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Create a calm, copyable message for a trusted family member before clicking links, sharing codes or sending money.
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
                placeholder="Np. SMS z banku, telefon od konsultanta, prośba o BLIK"
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 px-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-black text-ink">Message or call description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                placeholder="Opisz, kto napisał lub zadzwonił i o co prosił..."
                className="mt-2 w-full rounded-3xl border border-slate-200 px-4 py-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-black text-ink">Urgency level</span>
                <select
                  value={urgency}
                  onChange={(event) => setUrgency(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
                >
                  <option>Nie wiem</option>
                  <option>Nadawca naciska bardzo mocno</option>
                  <option>Prosi o szybkie działanie</option>
                  <option>Nie było presji czasu</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-black text-ink">Preferred contact method</span>
                <select
                  value={contactMethod}
                  onChange={(event) => setContactMethod(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
                >
                  <option>Telefon</option>
                  <option>SMS</option>
                  <option>WhatsApp</option>
                  <option>Messenger</option>
                  <option>E-mail</option>
                </select>
              </label>
            </div>

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
                Send this to a trusted person and wait for help before taking any action.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <pre className="whitespace-pre-wrap font-sans text-base leading-7 text-ink">{generatedMessage}</pre>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <CopyButton text={generatedMessage} label="Copy family message" />
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
