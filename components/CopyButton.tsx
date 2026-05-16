"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-tealguard px-5 py-3 font-bold text-white shadow-soft transition hover:bg-ocean focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {copied ? <Check aria-hidden="true" size={20} /> : <Copy aria-hidden="true" size={20} />}
      {copied ? "Skopiowano" : "Kopiuj wiadomość"}
    </button>
  );
}
