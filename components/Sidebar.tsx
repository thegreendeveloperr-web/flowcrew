"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  ExternalLink,
  Home,
  Inbox,
  LogOut,
  MessageSquareText,
  PlugZap,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        setUserEmail(data.user?.email ?? null);
      });
    } catch {
      setUserEmail(null);
    }
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

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

      <div className="mt-4 rounded-[1.65rem] border border-slate-200 bg-slate-50 p-4 lg:mt-auto">
        {userEmail ? (
          <>
            <p className="truncate text-xs font-bold text-slate-500">{userEmail}</p>
            <button
              type="button"
              onClick={signOut}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Esci
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-2xl bg-slate-950 px-3 py-2.5 text-sm font-black text-white"
          >
            Accedi
          </Link>
        )}
      </div>
    </aside>
  );
}
