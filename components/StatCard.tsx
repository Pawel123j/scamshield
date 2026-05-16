import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, helper, icon: Icon }: StatCardProps) {
  return (
    <article className="rounded-3xl border border-teal-100 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-black text-ink">{value}</p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-tealguard">
          <Icon aria-hidden="true" size={24} />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{helper}</p>
    </article>
  );
}
