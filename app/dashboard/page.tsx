"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckSquare,
  Database,
  History,
  MessageCircle,
  PlayCircle,
  Send,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  Trophy,
  Users
} from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { RiskBadge } from "@/components/RiskBadge";
import { StatCard } from "@/components/StatCard";
import { safetyChecklist } from "@/data/checklist";
import { lessons } from "@/data/lessons";
import { scamExamples } from "@/data/scams";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { formatDateTime } from "@/lib/date";
import { storageKeys } from "@/lib/storage";

const dashboardActions = [
  {
    title: "Analyze suspicious message",
    description: "Paste an SMS, email or call script and get a clear risk score.",
    href: "/analyze",
    icon: SearchCheck
  },
  {
    title: "Popular scams",
    description: "Browse realistic examples of common fraud patterns in Poland.",
    href: "/scams",
    icon: Database
  },
  {
    title: "Cyber lessons",
    description: "Short, simple lessons with quizzes and local progress.",
    href: "/lessons",
    icon: BookOpen
  },
  {
    title: "Safety checklist",
    description: "Track practical protection habits for everyday online safety.",
    href: "/checklist",
    icon: CheckSquare
  },
  {
    title: "Scenario simulator",
    description: "Practice identifying safe, suspicious and dangerous messages.",
    href: "/scenario-simulator",
    icon: PlayCircle
  },
  {
    title: "Trusted contacts",
    description: "Store local trusted contacts for safer family support workflows.",
    href: "/trusted-contacts",
    icon: Users
  },
  {
    title: "Family help message",
    description: "Generate a message asking family to help verify a suspicious situation.",
    href: "/family-help",
    icon: MessageCircle
  },
  {
    title: "Start Interactive Demo",
    description: "Follow a guided recruiter-friendly walkthrough of the product.",
    href: "/demo",
    icon: PlayCircle
  },
  {
    title: "Report a scam",
    description: "Get practical steps and generate an incident summary for trusted contacts or institutions.",
    href: "/report",
    icon: Send
  },
  {
    title: "Recent analyses",
    description: "Review saved analysis results stored only on this device.",
    href: "/history",
    icon: History
  }
];

export default function DashboardPage() {
  const { history, hasLoaded } = useAnalysisHistory();
  const [lessonProgress] = useLocalStorage<Record<string, boolean>>(storageKeys.lessons, {});
  const [checklistProgress] = useLocalStorage<Record<string, boolean>>(storageKeys.checklist, {});
  const completedLessons = Object.values(lessonProgress).filter(Boolean).length;
  const completedChecklist = Object.values(checklistProgress).filter(Boolean).length;
  const highRiskCount = history.filter((item) => item.level === "high").length;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="font-bold text-tealguard">Security overview</p>
            <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Dashboard</h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              Quick access to message analysis, scam education, safety habits and family support.
            </p>
          </div>
          <Link
            href="/analyze"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-tealguard px-5 py-3 font-bold text-white shadow-soft transition hover:bg-ocean focus:outline-none focus:ring-4 focus:ring-teal-200"
          >
            <SearchCheck aria-hidden="true" size={21} />
            Analyze now
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="Dashboard statistics">
        <StatCard
          label="Messages analyzed"
          value={42 + history.length}
          helper="Seeded demo activity plus your local checks."
          icon={ShieldCheck}
        />
        <StatCard
          label="High risk warnings"
          value={7 + highRiskCount}
          helper="Priority results that deserve careful verification."
          icon={ShieldAlert}
        />
        <StatCard
          label="Lessons completed"
          value={`${completedLessons}/${lessons.length}`}
          helper="Progress is stored privately in this browser."
          icon={Trophy}
        />
        <StatCard
          label="Saved scam examples"
          value={scamExamples.length}
          helper="Common scam patterns available without an account."
          icon={Database}
        />
        <StatCard
          label="Checklist progress"
          value={`${completedChecklist}/${safetyChecklist.length}`}
          helper="Local safety habits checked on this device."
          icon={CheckSquare}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {dashboardActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="focus-card rounded-3xl border border-teal-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-teal-300 focus:outline-none focus:ring-4 focus:ring-teal-200"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-tealguard">
                <Icon aria-hidden="true" size={24} />
              </span>
              <h2 className="mt-5 text-xl font-black text-ink">{action.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{action.description}</p>
            </Link>
          );
        })}
      </section>

      <section className="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-bold text-tealguard">Local history</p>
            <h2 className="mt-1 text-2xl font-black text-ink">Recent analyses</h2>
          </div>
          <Link
            href="/history"
            className="inline-flex min-h-11 items-center rounded-2xl border border-teal-100 px-4 py-2 font-bold text-tealguard hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-teal-200"
          >
            View all
          </Link>
        </div>

        {!hasLoaded || history.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              icon={History}
              title="No analyses saved yet"
              description="Run your first suspicious message check and it will appear here."
              action={
                <Link
                  href="/analyze"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-tealguard px-5 py-3 font-bold text-white focus:outline-none focus:ring-4 focus:ring-teal-200"
                >
                  Analyze a message
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-sm text-slate-500">
                  <th className="py-3 pr-4 font-bold">Date</th>
                  <th className="py-3 pr-4 font-bold">Type</th>
                  <th className="py-3 pr-4 font-bold">Preview</th>
                  <th className="py-3 pr-4 font-bold">Risk</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 3).map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-4 pr-4 text-sm text-slate-600">{formatDateTime(item.createdAt)}</td>
                    <td className="py-4 pr-4 font-semibold text-ink">{item.messageType}</td>
                    <td className="max-w-md py-4 pr-4 text-sm text-slate-600">{item.preview}</td>
                    <td className="py-4 pr-4">
                      <RiskBadge level={item.level} compact />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
