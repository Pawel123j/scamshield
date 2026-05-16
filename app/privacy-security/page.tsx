import Link from "next/link";
import { Database, LockKeyhole, ShieldCheck, Trash2 } from "lucide-react";
import { Disclaimer } from "@/components/Disclaimer";

const privacyPoints = [
  {
    title: "Local rule-based analysis",
    description: "The analyzer uses TypeScript rules in the app. It does not call a paid AI API.",
    icon: ShieldCheck
  },
  {
    title: "No account required",
    description: "You can use the app without creating a profile or sending login details.",
    icon: LockKeyhole
  },
  {
    title: "LocalStorage history",
    description: "Saved analyses, checklist state, lesson progress and Senior Mode are stored in browser LocalStorage.",
    icon: Database
  },
  {
    title: "Clearable data",
    description: "History can be deleted from the History page. LocalStorage is not encrypted, so do not store secrets.",
    icon: Trash2
  }
];

export default function PrivacySecurityPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="font-bold text-tealguard">Privacy & security</p>
        <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">How ScamShield Senior handles your data</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          ScamShield Senior is designed as a privacy-first educational tool. It helps you reason about suspicious
          messages without creating an account or sending content to an external analysis service.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {privacyPoints.map((point) => {
          const Icon = point.icon;

          return (
            <article key={point.title} className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-tealguard">
                <Icon aria-hidden="true" size={24} />
              </span>
              <h2 className="mt-5 text-xl font-black text-ink">{point.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{point.description}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-black text-ink">Important safety notes</h2>
        <ul className="mt-5 space-y-3 text-slate-700">
          {[
            "Do not enter real passwords, full card numbers, PINs, PESEL numbers or authorization codes.",
            "LocalStorage is convenient but not encrypted. Anyone with access to the browser profile may see saved history.",
            "The tool is educational and supportive. Real incidents should be handled with banks, police or official cybersecurity support.",
            "If money or banking data may be at risk, contact your bank immediately using official contact details."
          ].map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-tealguard" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/history"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl border border-teal-100 px-5 py-3 font-bold text-tealguard transition hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-teal-200"
        >
          Manage analysis history
        </Link>
      </section>

      <Disclaimer />
    </div>
  );
}
