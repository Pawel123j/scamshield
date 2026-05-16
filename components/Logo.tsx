import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-teal-200">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tealguard text-white shadow-soft">
        <ShieldCheck aria-hidden="true" size={26} />
      </span>
      <span className="leading-tight">
        <span className="block text-lg font-bold text-ink">ScamShield</span>
        <span className="block text-sm font-semibold text-tealguard">Senior</span>
      </span>
    </Link>
  );
}
