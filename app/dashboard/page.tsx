import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import AgentAvatar from "@/components/AgentAvatar";
import AppShell from "@/components/AppShell";
import { activities } from "@/lib/data";
import { getLeadDisplayName, getStoredLeads, scoreLead, type StoredLead } from "@/lib/leads";

export const dynamic = "force-dynamic";

const workflow = [
  ["Jackie", "Cleaned the client context", "Done"],
  ["Milo", "Tagged urgency and intent", "91%"],
  ["Nora", "Drafted a premium reply", "Ready"],
  ["Dex", "Created follow-up actions", "Set"],
];

const agentIds = ["jackie", "milo", "nora", "dex"] as const;

function urgentCount(leads: StoredLead[]) {
  return leads.filter((lead) => {
    const text = `${lead.urgency ?? ""} ${(lead.tags ?? []).join(" ")}`.toLowerCase();
    return text.includes("alta") || text.includes("high") || text.includes("urgent");
  }).length;
}

function replyCount(leads: StoredLead[]) {
  return leads.filter((lead) => Boolean(lead.suggested_reply)).length;
}

function followUpCount(leads: StoredLead[]) {
  return leads.filter((lead) => Boolean(lead.next_action || lead.follow_up)).length;
}

export default async function DashboardPage() {
  const leads = await getStoredLeads(12);
  const topLeads = leads.slice(0, 4);
  const stats = [
    { label: "Saved leads", value: String(leads.length), detail: "from Supabase", Icon: Sparkles },
    { label: "Replies ready", value: String(replyCount(leads)), detail: "waiting approval", Icon: MessageSquareText },
    { label: "Follow-ups", value: String(followUpCount(leads)), detail: "next actions found", Icon: CalendarClock },
    { label: "Urgent leads", value: String(urgentCount(leads)), detail: "high priority", Icon: Clock3 },
  ];

  return (
    <AppShell>
      <div className="space-y-5">
        <section className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white/82 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-8">
          <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" />
                Live operations
              </div>
              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.075em] text-slate-950 md:text-7xl">
                Your saved client work, organized at a glance.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                The dashboard now reads real lead cards from Supabase: incoming messages, AI summaries, replies, tags and next actions in one clean workspace.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/trial" className="rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 px-5 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(37,99,235,0.25)]">
                  Import message
                </Link>
                <Link href="/leads" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
                  View leads
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Crew performance</p>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.05em]">Today pipeline</h2>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-emerald-200">Healthy</div>
              </div>

              <div className="mt-6 grid gap-3">
                {workflow.map(([name, detail, status], index) => (
                  <div key={name} className="grid grid-cols-[42px_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-sm font-black text-slate-950">{index + 1}</div>
                    <div>
                      <p className="font-black">{name}</p>
                      <p className="text-sm text-slate-400">{detail}</p>
                    </div>
                    <span className="rounded-full bg-blue-400/15 px-3 py-1 text-xs font-black text-blue-100">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.Icon;
            return (
              <article key={stat.label} className="rounded-[1.75rem] border border-slate-200 bg-white/82 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                </div>
                <p className="mt-5 text-4xl font-black tracking-[-0.06em] text-slate-950">{stat.value}</p>
                <h2 className="mt-1 font-black text-slate-800">{stat.label}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{stat.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Hot leads</p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-slate-950">Ready to move</h2>
              </div>
              <Link href="/leads" className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700">
                All leads <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {topLeads.length ? (
              <div className="grid gap-3">
                {topLeads.map((lead) => {
                  const score = scoreLead(lead);
                  return (
                    <article key={lead.id} className="grid gap-4 rounded-3xl border border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-black text-slate-950">{getLeadDisplayName(lead)}</h3>
                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-100">{lead.urgency ?? lead.status}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{lead.request ?? "Client request"} · {lead.source}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-500" style={{ width: `${score}%` }} />
                        </div>
                        <b className="text-sm text-slate-950">{score}</b>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center">
                <h3 className="text-xl font-black tracking-[-0.04em] text-slate-950">No real leads yet</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Create one from the trial page and it will appear here.</p>
                <Link href="/trial" className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
                  Create lead <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Active crew</p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-slate-950">Agents are visible</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {agentIds.map((id) => (
                <div key={id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4 text-center">
                  <AgentAvatar agentId={id} decorative size="lg" className="mx-auto" />
                  <p className="mt-3 text-sm font-black capitalize text-slate-950">{id}</p>
                  <p className="text-xs font-semibold text-slate-500">Online</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-[-0.05em] text-slate-950">Recent activity</h2>
              <p className="text-sm text-slate-500">Mock activity for now. Database activity log comes next.</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {activities.map((activity) => (
              <article key={activity.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                  <div>
                    <h3 className="font-black text-slate-950">{activity.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{activity.message}</p>
                    <p className="mt-2 text-xs font-bold text-slate-400">{activity.time}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
