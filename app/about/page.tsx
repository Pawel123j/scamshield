import Link from "next/link";
import { BookOpen, LockKeyhole, SearchCheck, ShieldCheck } from "lucide-react";
import { Disclaimer } from "@/components/Disclaimer";

const principles = [
  {
    title: "Transparent rule engine",
    description: "Every warning is explained through visible indicators such as suspicious links, pressure phrases or data requests.",
    icon: SearchCheck
  },
  {
    title: "Privacy by default",
    description: "History, checklist state, lesson progress and Senior Mode settings are stored locally in the browser.",
    icon: LockKeyhole
  },
  {
    title: "Education first",
    description: "The app helps users learn safer habits instead of only showing a red or green score.",
    icon: BookOpen
  }
];

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="font-bold text-tealguard">About</p>
        <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">ScamShield Senior</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          A portfolio-ready cybersecurity awareness app focused on seniors, families and practical anti-scam education.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {principles.map((principle) => {
          const Icon = principle.icon;

          return (
            <article key={principle.title} className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-tealguard">
                <Icon aria-hidden="true" size={24} />
              </span>
              <h2 className="mt-5 text-xl font-black text-ink">{principle.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{principle.description}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-tealguard">
            <ShieldCheck aria-hidden="true" size={24} />
          </span>
          <div>
            <h2 className="text-2xl font-black text-ink">How the analyzer works</h2>
        <p className="mt-3 leading-7 text-slate-700">
          ScamShield Senior checks text against a local TypeScript rule set. It detects common phishing signals:
          links, shortened URLs, BLIK requests, card data requests, PESEL/login/password prompts, urgency, bank
          threats, delivery fees, fake investments, crypto promises, remote desktop tools and secrecy language.
        </p>
        <p className="mt-3 leading-7 text-slate-700">
          The score is intentionally explainable. The result includes detected indicators, a scoring breakdown,
          recommendations, copy actions and an optional PDF report. A high score means the user should stop, avoid
          clicking, and verify the situation using official contact details or trusted family support.
        </p>
          </div>
        </div>
      </section>

      <Disclaimer />

      <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-black text-ink">Portfolio scope</h2>
        <p className="mt-3 leading-7 text-slate-700">
          This project demonstrates a fullstack-ready Next.js architecture without paid APIs: typed data models,
          reusable UI components, LocalStorage persistence, accessible forms, responsive layout, unit-testable analysis
          logic, incident reporting guidance, privacy-first product thinking and a cybersecurity education flow.
        </p>
        <Link
          href="/analyze"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-tealguard px-5 py-3 font-bold text-white shadow-soft transition hover:bg-ocean focus:outline-none focus:ring-4 focus:ring-teal-200"
        >
          Try the analyzer
        </Link>
      </section>
    </div>
  );
}
