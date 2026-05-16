import Link from "next/link";
import { ArrowRight, BookOpen, Database, LockKeyhole, SearchCheck, ShieldCheck, Users } from "lucide-react";
import { Disclaimer } from "@/components/Disclaimer";

const featureSections = [
  {
    title: "Phishing protection",
    description: "Rule-based checks look for suspicious links, payment pressure, fake bank language and requests for private data.",
    icon: ShieldCheck
  },
  {
    title: "Senior-friendly interface",
    description: "Large actions, clear labels, friendly explanations and a persistent Senior Mode make the app comfortable to use.",
    icon: Users
  },
  {
    title: "Scam database",
    description: "Local examples explain common scams such as fake delivery fees, BLIK requests, investment traps and remote access fraud.",
    icon: Database
  },
  {
    title: "Family safety support",
    description: "A simple helper message generator makes it easier to ask a trusted person for a second opinion.",
    icon: LockKeyhole
  }
];

export default function LandingPage() {
  return (
    <div className="bg-mist">
      <section className="hero-scene relative isolate overflow-hidden px-4 py-10 text-white sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100svh-14rem)] max-w-6xl flex-col justify-center">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-white/30 bg-white/12 px-4 py-2 text-sm font-bold">
              Cybersecurity assistant for seniors and families
            </p>
            <h1 className="mt-7 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
              ScamShield Senior
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-teal-50 sm:text-xl sm:leading-9">
              Spokojny, prosty sposób na sprawdzenie podejrzanych SMS-ów, e-maili, telefonów, próśb BLIK i fałszywych
              ofert inwestycyjnych.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/analyze"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-black text-ink shadow-soft transition hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-white/40"
              >
                <SearchCheck aria-hidden="true" size={21} />
                Check a suspicious message
              </Link>
              <Link
                href="/lessons"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/35 bg-white/10 px-6 py-4 font-black text-white transition hover:bg-white/18 focus:outline-none focus:ring-4 focus:ring-white/40"
              >
                <BookOpen aria-hidden="true" size={21} />
                Learn about scams
              </Link>
            </div>
          </div>

          <div className="mt-8 grid max-w-4xl gap-3 sm:mt-12 sm:grid-cols-3" aria-label="App preview">
            <div className="rounded-3xl border border-white/22 bg-white/14 p-4 backdrop-blur">
              <p className="text-sm font-bold text-teal-50">Risk score</p>
              <p className="mt-2 text-4xl font-black">82/100</p>
              <div className="mt-4 h-3 rounded-full bg-white/20">
                <div className="h-3 w-4/5 rounded-full bg-coral" />
              </div>
            </div>
            <div className="hidden rounded-3xl border border-white/22 bg-white/14 p-4 backdrop-blur sm:block">
              <p className="text-sm font-bold text-teal-50">Detected</p>
              <p className="mt-2 text-lg font-black">Link + pressure + card data</p>
            </div>
            <div className="hidden rounded-3xl border border-white/22 bg-white/14 p-4 backdrop-blur sm:block">
              <p className="text-sm font-bold text-teal-50">Recommendation</p>
              <p className="mt-2 text-lg font-black">Call bank official number</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featureSections.map((feature) => {
              const Icon = feature.icon;

              return (
                <article key={feature.title} className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-tealguard">
                    <Icon aria-hidden="true" size={24} />
                  </span>
                  <h2 className="mt-5 text-xl font-black text-ink">{feature.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-bold text-tealguard">Built for calm decisions</p>
            <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">
              Clear warnings, plain Polish explanations and practical next steps.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
              The analyzer does not need a paid AI API. It uses transparent rules to highlight why a message may be
              risky, then saves the result locally so the user can review it later.
            </p>
            <Link
              href="/dashboard"
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-ink px-5 py-3 font-bold text-white transition hover:bg-ocean focus:outline-none focus:ring-4 focus:ring-teal-200"
            >
              Open dashboard
              <ArrowRight aria-hidden="true" size={20} />
            </Link>
          </div>
          <div className="grid gap-4">
            {["Nie klikaj linku", "Nie podawaj kodu BLIK", "Zadzwoń do banku samodzielnie"].map((item) => (
              <div key={item} className="rounded-3xl border border-teal-100 bg-mist p-5">
                <p className="text-lg font-black text-ink">{item}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Krótka zasada bezpieczeństwa widoczna wprost, bez technicznego języka.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Disclaimer />
        </div>
      </section>
    </div>
  );
}
