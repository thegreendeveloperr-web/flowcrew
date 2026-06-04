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
  Plus,
  PlugZap,
  ShieldCheck,
  WandSparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { href: "/dashboard", label: "Overview", Icon: BarChart3 },
      { href: "/leads", label: "Lead inbox", Icon: Inbox },
      { href: "/trial", label: "New lead", Icon: WandSparkles },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/import", label: "Import", Icon: ClipboardList },
      { href: "/integrations", label: "Integrations", Icon: PlugZap },
      { href: "/chat", label: "Live demo", Icon: MessageSquareText, separatePage: true },
    ],
  },
  {
    label: "Site",
    items: [{ href: "/", label: "Landing", Icon: Home }],
  },
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
      // Keep the signed-out state when Supabase is not available.
    }
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="sticky top-3 z-20 flex w-full flex-col rounded-[1.25rem] border border-slate-200 bg-white p-3 shadow-[0_8px_28px_rgba(15,23,42,0.06)] lg:h-[calc(100vh-2rem)] lg:w-[280px] lg:p-3.5">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-[0.95rem] px-2.5 py-2.5 transition hover:bg-slate-50"
        aria-label="FlowCrew landing"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold tracking-[-0.04em] text-white shadow-[0_10px_24px_rgba(15,23,42,0.14)]">
          FC
        </span>
        <span className="min-w-0">
          <span className="block text-base font-bold tracking-[-0.035em] text-slate-950">
            FlowCrew
          </span>
          <span className="block truncate text-xs font-medium text-slate-500">
            Client operations workspace
          </span>
        </span>
      </Link>

      <Link
        href="/trial"
        className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-3.5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition hover:bg-slate-800"
      >
        <Plus aria-hidden="true" className="h-4 w-4" />
        Capture lead
      </Link>

      <nav className="mt-4 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-2.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-400">
              {group.label}
            </p>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5 lg:grid-cols-1">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                const Icon = item.Icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex min-h-10 items-center justify-center gap-2 rounded-xl px-2.5 py-2.5 text-sm font-semibold transition lg:justify-start ${
                      isActive
                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                    <span className="truncate">{item.label}</span>
                    {item.separatePage ? (
                      <ExternalLink aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 lg:mt-auto">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <ShieldCheck aria-hidden="true" className="h-4 w-4 text-emerald-600" />
          Approval-first replies
        </div>
        {userEmail ? (
          <>
            <p className="mt-3 truncate text-xs font-medium text-slate-500">{userEmail}</p>
            <button
              type="button"
              onClick={signOut}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="mt-3 flex w-full items-center justify-center rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            Sign in
          </Link>
        )}
      </div>
    </aside>
  );
}
