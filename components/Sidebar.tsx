"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, Inbox, Sparkles } from "lucide-react";

const navItems = [
  { href: "/", label: "Landing", Icon: Home },
  { href: "/dashboard", label: "Dashboard", Icon: BarChart3 },
  { href: "/leads", label: "Leads", Icon: Inbox },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel sticky top-4 z-20 flex w-full flex-col rounded-[1.6rem] p-3 lg:h-[calc(100vh-2rem)] lg:w-72 lg:p-4">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-white/[0.04]"
        aria-label="FlowCrew landing"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-200 text-slate-950 shadow-[0_0_34px_rgba(81,229,255,0.28)]">
          <Sparkles aria-hidden="true" className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-base font-semibold tracking-tight text-white">
            FlowCrew
          </span>
          <span className="block text-xs text-slate-500">AI crew OS</span>
        </span>
      </Link>

      <nav className="mt-3 grid grid-cols-3 gap-2 lg:grid-cols-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.Icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium transition lg:justify-start ${
                isActive
                  ? "bg-white text-slate-950 shadow-[0_0_28px_rgba(255,255,255,0.16)]"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-3 hidden rounded-[1.35rem] border border-violet-300/20 bg-violet-300/10 p-4 lg:mt-auto lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">
          Current plan
        </p>
        <p className="mt-2 text-lg font-semibold text-white">Pro - Smart Brain</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Jackie, Nora, Milo and Dex are unlocked for the demo flow.
        </p>
      </div>
    </aside>
  );
}
