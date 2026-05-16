"use client";

import Link from "next/link";
import { Menu, SearchCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SeniorModeToggle } from "@/components/SeniorModeToggle";

interface NavbarProps {
  seniorMode: boolean;
  setSeniorMode: (enabled: boolean) => void;
  onOpenMenu: () => void;
}

export function Navbar({ seniorMode, setSeniorMode, onOpenMenu }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-teal-100 bg-white/92 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/analyze"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-tealguard px-5 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-ocean focus:outline-none focus:ring-4 focus:ring-teal-200"
          >
            <SearchCheck aria-hidden="true" size={19} />
            Check a suspicious message
          </Link>
          <SeniorModeToggle enabled={seniorMode} onChange={setSeniorMode} />
        </div>

        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-100 bg-white text-ink shadow-sm transition hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-teal-200 md:hidden"
          aria-label="Otwórz menu"
        >
          <Menu aria-hidden="true" size={24} />
        </button>
      </div>
    </header>
  );
}
