"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardList, ExternalLink, Home, Inbox, MessageSquareText, PlugZap, Sparkles, WandSparkles } from "lucide-react";

const navItems = [
  { href: "/", label: "Landing", Icon: Home },
  { href: "/trial", label: "Trial", Icon: WandSparkles },
  { href: "/chat", label: "Live Demo", Icon: MessageSquareText, separatePage: true },
  { href: "/dashboard", label: "Dashboard", Icon: BarChart3 },
  { href: "/import", label: "Import", Icon: ClipboardList },
  { href: "/leads", label: "Leads", Icon: Inbox },
  { href: "/integrations", label: "Integrations", Icon: PlugZap },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-5 z-20 flex w-full flex-col rounded-[2rem] border border-slate-200/90 bg-white/82 p-3 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl lg:h-[calc(100vh-2.5rem)] lg:w-76 lg:p-4">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-3xl px-3 py-3 transition hover:bg-slate-50"
        aria-label="FlowCrew landing"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-500 text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)]">
          <Sparkles aria-hidden="true" className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-lg font-black tracking-[-0.055em] text-slate-950">
            FlowCrew
          </span>
          <span className="block text-xs font-bold text-slate-500">AI client workspace</span>
        </span>
      </Link>

      <Link
        href="/trial"
        className="mt-3 rounded-[1.35rem] bg-gradient-to-br from-blue-600 to-indigo-500 px-4 py-3 text-center text-sm font-black text-white shadow-[0_18px_40px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5"
      >
        Try one lead free
      </Link>

      <nav className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.Icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-black transition lg:justify-start ${
                isActive
                  ? "bg-slate-950 text-white shadow-[0_18px_38px_rgba(15,23,42,0.15)]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              <span>{item.label}</span>
              {item.separatePage ? <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 hidden rounded-[1.65rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 lg:mt-auto lg:block">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
          Product direction
        </p>
        <p className="mt-2 text-xl font-black tracking-[-0.045em] text-slate-950">Light premium UI</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Same system across landing, trial, dialogue, dashboard and leads.
        </p>
      </div>
    </aside>
  );
}
