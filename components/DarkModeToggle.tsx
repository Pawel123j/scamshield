"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

interface DarkModeToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function DarkModeToggle({ enabled, onChange }: DarkModeToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-cyan-200",
        enabled ? "border-cyan-300 bg-slate-950 text-cyan-100" : "border-teal-100 bg-white text-ink hover:border-teal-300 hover:bg-teal-50"
      )}
    >
      {enabled ? <Moon aria-hidden="true" size={18} /> : <Sun aria-hidden="true" size={18} />}
      Dark Mode
    </button>
  );
}
