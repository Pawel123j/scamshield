"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CheckSquare,
  Database,
  History,
  Home,
  Info,
  LayoutDashboard,
  MessageCircle,
  SearchCheck
} from "lucide-react";
import { cn } from "@/lib/cn";

export const navItems = [
  { href: "/", label: "Start", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analyze", label: "Analizuj", icon: SearchCheck },
  { href: "/history", label: "Historia", icon: History },
  { href: "/scams", label: "Baza oszustw", icon: Database },
  { href: "/lessons", label: "Lekcje", icon: BookOpen },
  { href: "/checklist", label: "Checklista", icon: CheckSquare },
  { href: "/family-help", label: "Pomoc rodziny", icon: MessageCircle },
  { href: "/about", label: "O aplikacji", icon: Info }
] as const;

interface SidebarProps {
  onNavigate?: () => void;
  mobile?: boolean;
}

export function Sidebar({ onNavigate, mobile = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Główna nawigacja" className={cn("flex flex-col gap-2", mobile ? "p-4" : "p-4")}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-12 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-teal-200",
              active
                ? "bg-tealguard text-white shadow-soft"
                : "text-slate-700 hover:bg-white hover:text-ink hover:shadow-sm"
            )}
          >
            <Icon aria-hidden="true" size={20} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
