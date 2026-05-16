import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <section className="rounded-3xl border border-dashed border-teal-200 bg-white p-8 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-tealguard">
        <Icon aria-hidden="true" size={28} />
      </span>
      <h2 className="mt-4 text-xl font-black text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-slate-600">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </section>
  );
}
