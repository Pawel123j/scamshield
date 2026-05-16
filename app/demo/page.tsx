import Link from "next/link";
import { ArrowRight, Database, FileText, History, PlayCircle, SearchCheck, ShieldAlert } from "lucide-react";
import { exampleMessages } from "@/data/examples";

const bankExample = exampleMessages.find((example) => example.label === "Fake bank SMS") ?? exampleMessages[0];

const demoSteps = [
  {
    title: "Load a fake bank SMS",
    description: "Start with a realistic Polish bank phishing message.",
    href: `/analyze?type=${encodeURIComponent(bankExample.type)}&example=${encodeURIComponent(bankExample.text)}`,
    icon: SearchCheck
  },
  {
    title: "Run analysis",
    description: "Show the high-risk result, explanation and detected warning signs.",
    href: "/analyze",
    icon: ShieldAlert
  },
  {
    title: "Review scoring breakdown",
    description: "Explain how each indicator contributes to the final 0-100 score.",
    href: "/analyze",
    icon: FileText
  },
  {
    title: "Open history",
    description: "Show locally saved analyses and filter high-risk results.",
    href: "/history",
    icon: History
  },
  {
    title: "Explore scam database",
    description: "Review common scam patterns and copy examples into the analyzer.",
    href: "/scams",
    icon: Database
  },
  {
    title: "Open report guide",
    description: "Generate an incident report summary after a suspicious attempt.",
    href: "/report",
    icon: FileText
  }
];

export default function DemoPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-ink p-6 text-white shadow-soft">
        <p className="font-bold text-cyan-200">Interactive portfolio demo</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Start Interactive Demo</h1>
        <p className="mt-3 max-w-3xl text-cyan-50">
          A guided path for recruiters and reviewers: analyze a fake bank message, review explainability, export/report,
          and explore the education features.
        </p>
        <Link
          href={demoSteps[0].href}
          className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-white px-5 py-3 font-black text-ink hover:bg-cyan-50 focus:outline-none focus:ring-4 focus:ring-white/40"
        >
          <PlayCircle aria-hidden="true" size={21} />
          Load demo message
        </Link>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {demoSteps.map((step, index) => {
          const Icon = step.icon;

          return (
            <Link
              key={step.title}
              href={step.href}
              className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-teal-300 focus:outline-none focus:ring-4 focus:ring-teal-200"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-tealguard">
                  <Icon aria-hidden="true" size={24} />
                </span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-sm font-black text-slate-600">Step {index + 1}</span>
              </div>
              <h2 className="mt-5 text-xl font-black text-ink">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-bold text-tealguard">
                Open
                <ArrowRight aria-hidden="true" size={18} />
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
