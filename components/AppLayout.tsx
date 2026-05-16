"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SeniorModeToggle } from "@/components/SeniorModeToggle";
import { Sidebar } from "@/components/Sidebar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { storageKeys } from "@/lib/storage";
import { cn } from "@/lib/cn";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [seniorMode, setSeniorMode] = useLocalStorage<boolean>(storageKeys.seniorMode, false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isLanding = pathname === "/";

  return (
    <div className={cn("min-h-screen bg-mist text-ink antialiased", seniorMode && "senior-mode")}>
      <Navbar seniorMode={seniorMode} setSeniorMode={setSeniorMode} onOpenMenu={() => setMenuOpen(true)} />

      <div className={cn("mx-auto w-full", isLanding ? "max-w-none" : "grid max-w-7xl grid-cols-1 md:grid-cols-[260px_1fr]")}>
        {!isLanding && (
          <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] border-r border-teal-100 bg-mist/80 md:block">
            <Sidebar />
          </aside>
        )}
        <main className={cn(isLanding ? "w-full" : "min-w-0 px-4 py-6 sm:px-6 lg:px-8")}>{children}</main>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu nawigacji">
          <button
            type="button"
            aria-label="Zamknij menu"
            className="absolute inset-0 bg-ink/45"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[88vw] max-w-sm flex-col bg-mist shadow-soft">
            <div className="flex items-center justify-between border-b border-teal-100 p-4">
              <SeniorModeToggle enabled={seniorMode} onChange={setSeniorMode} />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ink shadow-sm focus:outline-none focus:ring-4 focus:ring-teal-200"
                aria-label="Zamknij menu"
              >
                <X aria-hidden="true" size={24} />
              </button>
            </div>
            <Sidebar mobile onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
