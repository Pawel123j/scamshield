import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  LockKeyhole,
  PlayCircle,
  SearchCheck,
  ShieldCheck,
  Users
} from "lucide-react";
import { Disclaimer } from "@/components/Disclaimer";

const howItWorks = [
  "Paste a suspicious message, link or call description.",
  "The local rule engine detects warning signs and calculates risk.",
  "You receive simple next steps and can save or export the result."
];

const keyFeatures = [
  {
    title: "Explainable scam analysis",
    description: "Risk score, detected indicators and point-by-point scoring show exactly why a message is risky.",
    icon: SearchCheck
  },
  {
    title: "Senior Mode",
    description: "Larger text, bigger actions, more spacing and stronger contrast improve comfort across the app.",
    icon: Users
  },
  {
    title: "Scam knowledge base",
    description: "Common fraud patterns include fake bank calls, delivery fees, BLIK scams and investment traps.",
    icon: Database
  },
  {
    title: "Privacy-first design",
    description: "No account and no paid AI API. History is stored locally in the browser, not sent to an external service.",
    icon: LockKeyhole
  }
];

const scamTypes = ["Fake bank alerts", "BLIK fraud", "Delivery payment scams", "Investment promises", "Crypto scams", "Remote access fraud"];

export default function LandingPage() {
  return (
    <div className="bg-mist">
      <section className="hero-scene relative isolate overflow-hidden px-4 py-10 text-white sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto grid min-h-[calc(100svh-14rem)] max-w-7xl gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-white/30 bg-white/12 px-4 py-2 text-sm font-bold">
              Privacy-first cybersecurity awareness for seniors
            </p>
            <h1 className="mt-7 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
              ScamShield Senior
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-cyan-50 sm:text-xl sm:leading-9">
              A privacy-first cybersecurity awareness app that helps seniors and families recognize phishing, scam
              messages, fake bank alerts, BLIK fraud and social engineering attempts.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/analyze"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-ink shadow-soft transition hover:bg-cyan-50 focus:outline-none focus:ring-4 focus:ring-white/40"
              >
                <SearchCheck aria-hidden="true" size={21} />
                Analyze suspicious message
              </Link>
              <Link
                href="/scams"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/35 bg-white/10 px-6 py-4 font-black text-white transition hover:bg-white/18 focus:outline-none focus:ring-4 focus:ring-white/40"
              >
                <Database aria-hidden="true" size={21} />
                Explore scam database
              </Link>
              <Link
                href="/demo"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-cyan-200 bg-cyan-200 px-6 py-4 font-black text-ink transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/40"
              >
                <PlayCircle aria-hidden="true" size={21} />
                Start Interactive Demo
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/20 bg-white/12 p-5 shadow-soft backdrop-blur">
            <div className="rounded-3xl bg-white p-5 text-ink">
              <p className="text-sm font-black uppercase text-tealguard">Example analysis</p>
              <div className="mt-4 rounded-3xl bg-red-50 p-5">
                <p className="text-sm font-bold text-red-700">High risk</p>
                <p className="mt-2 text-5xl font-black">82/100</p>
                <div className="mt-4 h-3 rounded-full bg-red-100">
                  <div className="h-3 w-4/5 rounded-full bg-coral" />
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {["Suspicious link", "Urgency pressure", "Sensitive banking data"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                    <CheckCircle2 aria-hidden="true" className="text-tealguard" size={20} />
                    <span className="font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="font-bold text-tealguard">How it works</p>
              <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">Simple enough for daily use, clear enough to teach safety.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {howItWorks.map((step, index) => (
                <article key={step} className="rounded-3xl border border-teal-100 bg-white p-5 shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 font-black text-tealguard">
                    {index + 1}
                  </span>
                  <p className="mt-4 font-bold leading-7 text-ink">{step}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="font-bold text-tealguard">Why it matters</p>
            <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">Scams are designed to create fear, urgency and confusion.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              ScamShield Senior helps users pause, check warning signs and ask for trusted support before clicking,
              sharing data, installing remote access tools or sending money.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {keyFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <article key={feature.title} className="rounded-3xl border border-teal-100 bg-mist p-6 shadow-soft">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-tealguard">
                    <Icon aria-hidden="true" size={24} />
                  </span>
                  <h3 className="mt-5 text-xl font-black text-ink">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="font-bold text-tealguard">Common scam types</p>
            <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">Built around realistic threats seniors and families actually see.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {scamTypes.map((type) => (
              <div key={type} className="rounded-2xl border border-teal-100 bg-white p-4 font-bold text-ink shadow-sm">
                {type}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-cyan-200">
            <ShieldCheck aria-hidden="true" size={34} />
          </div>
          <div>
            <p className="font-bold text-cyan-200">Privacy-first approach</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">No account. No paid AI API. No external message analysis.</h2>
            <p className="mt-4 text-lg leading-8 text-cyan-50">
              The analyzer uses local TypeScript rules and stores history in browser LocalStorage. It is an educational
              safety assistant, not a replacement for official bank, police or cybersecurity support.
            </p>
            <Link
              href="/privacy-security"
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-ink transition hover:bg-cyan-50 focus:outline-none focus:ring-4 focus:ring-white/40"
            >
              Read privacy details
              <ArrowRight aria-hidden="true" size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <Disclaimer />
          <div className="rounded-3xl border border-teal-100 bg-white p-8 text-center shadow-soft">
            <h2 className="text-3xl font-black text-ink">Ready to check a suspicious message?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Use the analyzer, review the recommendation, then ask a trusted person or official institution when in doubt.
            </p>
            <Link
              href="/analyze"
              className="mt-6 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-tealguard px-6 py-4 font-black text-white shadow-soft transition hover:bg-ocean focus:outline-none focus:ring-4 focus:ring-teal-200"
            >
              Analyze suspicious message
              <ArrowRight aria-hidden="true" size={21} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
