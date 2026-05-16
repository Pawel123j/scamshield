"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ClipboardList, CreditCard, Link2, MonitorX, Smartphone, ShieldAlert } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

const guidanceSections = [
  {
    title: "If you only received a suspicious message",
    icon: ShieldAlert,
    items: [
      "Do not click links.",
      "Do not reply.",
      "Do not provide data.",
      "Ask a trusted person for help.",
      "Contact the organization using official contact details."
    ]
  },
  {
    title: "If you clicked a suspicious link",
    icon: Link2,
    items: [
      "Close the page.",
      "Do not enter data.",
      "Change passwords if needed.",
      "Enable 2FA.",
      "Scan the device if anything was downloaded.",
      "Contact the bank if banking data may be at risk."
    ]
  },
  {
    title: "If you shared card details",
    icon: CreditCard,
    items: [
      "Contact the bank immediately.",
      "Block the card.",
      "Check transactions.",
      "Change online banking password.",
      "Report the incident."
    ]
  },
  {
    title: "If you shared a BLIK code",
    icon: Smartphone,
    items: ["Contact the bank immediately.", "Check account history.", "Report the fraud attempt."]
  },
  {
    title: "If someone asked to install AnyDesk or TeamViewer",
    icon: MonitorX,
    items: [
      "Disconnect the internet if needed.",
      "Uninstall the remote access tool.",
      "Contact the bank.",
      "Change passwords from another safe device."
    ]
  }
];

export default function ReportPage() {
  const [incidentType, setIncidentType] = useState("Suspicious message");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [whatHappened, setWhatHappened] = useState("");
  const [dataShared, setDataShared] = useState("");
  const [contact, setContact] = useState("");
  const [actionsTaken, setActionsTaken] = useState("");

  const report = useMemo(() => {
    return [
      "ScamShield Senior - incident summary",
      "",
      `Incident type: ${incidentType}`,
      `Date: ${date}`,
      "",
      "What happened:",
      whatHappened.trim() || "Not described yet.",
      "",
      "Data shared:",
      dataShared.trim() || "No data shared or not sure.",
      "",
      "Suspicious phone, email or link:",
      contact.trim() || "Not provided.",
      "",
      "Actions already taken:",
      actionsTaken.trim() || "No actions listed yet.",
      "",
      "Recommended next step: contact the relevant organization through official details and ask a trusted person for help."
    ].join("\n");
  }, [actionsTaken, contact, dataShared, date, incidentType, whatHappened]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="font-bold text-tealguard">Incident guidance</p>
        <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Report a scam or suspicious attempt</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Practical steps for different incident types, plus a copyable summary you can share with a bank, family member
          or support contact.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {guidanceSections.map((section) => {
          const Icon = section.icon;

          return (
            <article key={section.title} className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
              <h2 className="flex items-start gap-3 text-xl font-black text-ink">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-tealguard">
                  <Icon aria-hidden="true" size={22} />
                </span>
                {section.title}
              </h2>
              <ul className="mt-5 space-y-3 text-slate-700">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-tealguard" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      <section className="rounded-3xl border border-cyan-100 bg-cyan-50 p-6 text-cyan-950 shadow-soft">
        <h2 className="text-2xl font-black">Official reporting guidance</h2>
        <p className="mt-3 leading-7">
          For real incidents, use official channels only. Search manually for CERT Polska, NASK, Policja and your bank
          official hotline. Do not use links from suspicious messages to report or verify an incident.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-2xl font-black text-ink">
            <ClipboardList aria-hidden="true" className="text-tealguard" size={24} />
            Incident report generator
          </h2>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-black text-ink">Incident type</span>
                <select
                  value={incidentType}
                  onChange={(event) => setIncidentType(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
                >
                  <option>Suspicious message</option>
                  <option>Clicked suspicious link</option>
                  <option>Shared card details</option>
                  <option>Shared BLIK code</option>
                  <option>Remote access request</option>
                  <option>Investment scam</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-black text-ink">Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 px-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-black text-ink">What happened?</span>
              <textarea
                value={whatHappened}
                onChange={(event) => setWhatHappened(event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-3xl border border-slate-200 px-4 py-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-black text-ink">What data was shared?</span>
              <textarea
                value={dataShared}
                onChange={(event) => setDataShared(event.target.value)}
                rows={3}
                placeholder="Np. kod BLIK, dane karty, login, telefon, brak danych"
                className="mt-2 w-full rounded-3xl border border-slate-200 px-4 py-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-black text-ink">Suspicious phone, email or link</span>
              <input
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 px-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
              />
            </label>

            <label className="block">
              <span className="text-sm font-black text-ink">Actions already taken</span>
              <textarea
                value={actionsTaken}
                onChange={(event) => setActionsTaken(event.target.value)}
                rows={3}
                placeholder="Np. nie kliknięto linku, zablokowano kartę, kontakt z bankiem"
                className="mt-2 w-full rounded-3xl border border-slate-200 px-4 py-4 focus:border-tealguard focus:outline-none focus:ring-4 focus:ring-teal-200"
              />
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-700">
              <AlertTriangle aria-hidden="true" size={22} />
            </span>
            <h2 className="text-2xl font-black text-ink">Copyable summary</h2>
          </div>
          <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <pre className="whitespace-pre-wrap font-sans text-base leading-7 text-ink">{report}</pre>
          </div>
          <div className="mt-5">
            <CopyButton text={report} label="Copy incident report" />
          </div>
        </div>
      </section>
    </div>
  );
}
