"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  variant?: "primary" | "secondary";
}

export function CopyButton({ text, label = "Copy", copiedLabel = "Copied!", variant = "primary" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className={cn(
        "inline-flex min-h-12 items-center gap-2 rounded-2xl px-5 py-3 font-bold shadow-soft transition focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:bg-slate-300",
        variant === "primary"
          ? "bg-tealguard text-white hover:bg-ocean"
          : "border border-teal-100 bg-white text-tealguard hover:bg-teal-50"
      )}
    >
      {copied ? <Check aria-hidden="true" size={20} /> : <Copy aria-hidden="true" size={20} />}
      {copied ? copiedLabel : label}
    </button>
  );
}
