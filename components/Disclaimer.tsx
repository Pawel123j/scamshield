import { ShieldAlert } from "lucide-react";

export function Disclaimer() {
  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
      <div className="flex gap-3">
        <ShieldAlert aria-hidden="true" className="mt-1 shrink-0" size={22} />
        <p className="leading-7">
          This tool helps identify suspicious messages, but it does not replace official bank, police, or cybersecurity
          support. When in doubt, contact your bank using the official phone number or report the incident to appropriate
          authorities.
        </p>
      </div>
    </section>
  );
}
