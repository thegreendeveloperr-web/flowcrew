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
  WandSparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navGroups = [
  {
    label: "Command",
    items: [
      { href: "/dashboard", label: "Oggi", Icon: BarChart3 },
      { href: "/leads", label: "Leads", Icon: Inbox },
      { href: "/trial", label: "Nuovo lead", Icon: WandSparkles },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/import", label: "Import", Icon: ClipboardList },
      { href: "/integrations", label: "Canali", Icon: PlugZap },
      { href: "/chat", label: "Demo", Icon: MessageSquareText, separatePage: true },
    ],
  },
  {
    label: "Public",
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
    <aside className="relative z-20 flex w-full flex-col border-b border-white/[0.06] bg-[#0b0b0b]/92 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-[260px] lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:block lg:px-4 lg:py-5">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="FlowCrew landing">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--fc-accent)] text-sm font-extrabold tracking-[-0.04em] text-[#080808]">
            F
          </span>
          <span className="min-w-0">
            <span className="block text-base font-bold tracking-[-0.03em] text-[var(--fc-text)]">
              FlowCrew
            </span>
            <span className="flow-mono block truncate text-[0.65rem] uppercase tracking-[0.14em] text-[var(--fc-text-soft)]">
              AI command center
            </span>
          </span>
        </Link>

        <Link href="/trial" className="fc-button fc-button-primary lg:mt-5 lg:w-full">
          <Plus aria-hidden="true" className="h-4 w-4" />
          Prova gratis
        </Link>
      </div>

      <nav className="flex gap-2 overflow-x-auto border-t border-white/[0.04] px-3 py-2 lg:flex-1 lg:flex-col lg:gap-6 lg:overflow-visible lg:border-t-0 lg:px-3 lg:py-2">
        {navGroups.map((group) => (
          <div className="min-w-max lg:min-w-0" key={group.label}>
            <p className="flow-mono hidden px-2 text-[0.64rem] uppercase tracking-[0.16em] text-[var(--fc-text-soft)] lg:block">
              {group.label}
            </p>
            <div className="flex gap-1.5 lg:mt-2 lg:flex-col">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                const Icon = item.Icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex min-h-9 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "border-[rgba(200,245,66,0.24)] bg-[rgba(200,245,66,0.09)] text-[var(--fc-accent)]"
                        : "border-transparent text-[var(--fc-text-muted)] hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-[var(--fc-text)]"
                    }`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                    <span className="truncate">{item.label}</span>
                    {item.separatePage ? (
                      <ExternalLink aria-hidden="true" className="ml-auto hidden h-3.5 w-3.5 opacity-55 lg:block" />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] px-4 py-3 lg:mt-auto">
        <div className="mb-3 rounded-2xl border border-white/[0.06] bg-white/[0.035] p-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--fc-accent)] shadow-[0_0_18px_rgba(200,245,66,0.45)]" />
            <p className="flow-mono text-[0.65rem] uppercase tracking-[0.12em] text-[var(--fc-text-muted)]">
              Tutti gli agenti operativi
            </p>
          </div>
        </div>

        {userEmail ? (
          <div className="flex items-center justify-between gap-3 lg:block">
            <div className="min-w-0">
              <p className="flow-mono text-[0.64rem] uppercase tracking-[0.14em] text-[var(--fc-text-soft)]">
                Account
              </p>
              <p className="mt-1 truncate text-xs font-medium text-[var(--fc-text-muted)]">{userEmail}</p>
            </div>
            <button type="button" onClick={signOut} className="fc-button shrink-0 lg:mt-3 lg:w-full">
              <LogOut aria-hidden="true" className="h-4 w-4" />
              Esci
            </button>
          </div>
        ) : (
          <Link href="/login" className="fc-button w-full">
            Accedi
          </Link>
        )}
      </div>
    </aside>
  );
}
