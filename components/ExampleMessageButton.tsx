"use client";

import { ClipboardPaste } from "lucide-react";
import type { ExampleMessage } from "@/data/examples";

interface ExampleMessageButtonProps {
  example: ExampleMessage;
  onLoad: (example: ExampleMessage) => void;
}

export function ExampleMessageButton({ example, onLoad }: ExampleMessageButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onLoad(example)}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-bold text-tealguard transition hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-teal-200"
    >
      <ClipboardPaste aria-hidden="true" size={17} />
      {example.label}
    </button>
  );
}
