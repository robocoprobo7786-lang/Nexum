"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Publications",
    href: "/publications",
    icon: BookOpen,
  },
  {
    label: "Faculty",
    href: "/faculty",
    icon: Users,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden sm:flex flex-col border-r border-border bg-card shrink-0 transition-all duration-200 w-16 lg:w-60 min-h-screen sticky top-0">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-4 border-b border-border gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-control bg-primary text-primary-foreground font-heading text-lg font-bold shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="font-heading font-bold text-foreground text-lg leading-none">
              Nexum
            </span>
            <span className="text-[11px] text-muted-foreground font-medium leading-tight">
              Research & Accreditation
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-4 px-2 lg:px-3 space-y-1">
          <div className="hidden lg:block px-3 py-2 text-[11px] font-heading font-bold text-muted-foreground uppercase tracking-wider">
            Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isLinkActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-control text-sm font-medium transition-colors group relative",
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 shrink-0 transition-colors",
                      active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span className="hidden lg:inline truncate">{item.label}</span>
                  {active && (
                    <span className="hidden lg:block absolute right-2 w-1.5 h-1.5 rounded-pill bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info (Desktop) */}
        <div className="hidden lg:block p-4 border-t border-border bg-card">
          <div className="text-xs font-medium text-muted-foreground">
            V10 Accreditation MVP
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex items-center justify-around py-2 px-2 shadow-lg">
        {navItems.map((item) => {
          const active = isLinkActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-control text-[11px] font-medium transition-colors flex-1",
                active ? "text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
