"use client";

import { Accessibility } from "lucide-react";
import { cn } from "@/lib/cn";

interface SeniorModeToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function SeniorModeToggle({ enabled, onChange }: SeniorModeToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-teal-200",
        enabled
          ? "border-ink bg-ink text-white"
          : "border-teal-100 bg-white text-ink hover:border-teal-300 hover:bg-teal-50"
      )}
    >
      <Accessibility aria-hidden="true" size={19} />
      Senior Mode
    </button>
  );
}
