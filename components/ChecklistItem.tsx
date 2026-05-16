"use client";

import { Check } from "lucide-react";
import type { ChecklistItem as ChecklistItemType } from "@/lib/types";
import { cn } from "@/lib/cn";

interface ChecklistItemProps {
  item: ChecklistItemType;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ChecklistItem({ item, checked, onChange }: ChecklistItemProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer gap-4 rounded-3xl border p-5 shadow-soft transition",
        checked ? "border-emerald-200 bg-emerald-50" : "border-teal-100 bg-white hover:border-teal-300"
      )}
    >
      <span
        className={cn(
          "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border",
          checked ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 bg-white text-transparent"
        )}
      >
        <Check aria-hidden="true" size={20} />
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span>
        <span className="block text-lg font-black text-ink">{item.label}</span>
        <span className="mt-1 block text-sm leading-6 text-slate-600">{item.description}</span>
      </span>
    </label>
  );
}
