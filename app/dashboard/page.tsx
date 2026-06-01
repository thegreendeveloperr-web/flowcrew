import {
  AlertTriangle,
  ArrowRight,
  BadgeEuro,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  PlayCircle,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import ActivityLog from "@/components/ActivityLog";
import AgentCard from "@/components/AgentCard";
import AppShell from "@/components/AppShell";
import CrewStatus from "@/components/CrewStatus";
import {
  activities,
  agents,
  dashboardStats,
  demoLeads,
  missionChecklist,
} from "@/lib/data";

const missionFlow = [
  { label: "Jackie", value: "86 heat", detail: "Rank Studio Aurora" },
  { label: "Nora", value: "700-1200 EUR", detail: "Shape proposal range" },
  { label: "Milo", value: "48h", detail: "Protect the follow-up" },
  { label: "Dex", value: "synced", detail: "Log the handoff trace" },
];

const missionCards = [
  {
    label: "Revenue at risk",
    value: "3,400 EUR",
    caption: "Open deal value that needs a next step this week.",
    Icon: AlertTriangle,
    accent: "text-rose-200",
    surface: "border-rose-300/20 bg-rose-300/10",
  },
  {
    label: "Time saved",
    value: "6.5h",
    caption: "Scoring, drafting, and logging handled by the crew.",
    Icon: Clock3,
    accent: "text-lime-200",
    surface: "border-lime-300/20 bg-lime-300/10",
  },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <CrewStatus agents={agents} />

        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-panel overflow-hidden rounded-[1.8rem] p-5 sm:p-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-lime-200">
                  <Sparkles aria-hidden="true" className="h-4 w-4" />
                  Today Mission
                </div>
                <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                  Turn today into booked calls.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                  FlowCrew is watching the money signal, proposal timing, and
                  follow-up windows so the hottest leads do not cool down.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {missionChecklist.map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0 text-lime-200"
                      />
                      <span className="text-sm leading-6 text-slate-300">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/70">
                      Live route
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-white">
                      Lead to booked call
                    </h2>
                  </div>
                  <Target aria-hidden="true" className="h-6 w-6 text-cyan-100" />
                </div>

                <div className="mt-5 space-y-3">
                  {missionFlow.map((item, index) => (
                    <div key={item.label} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white text-sm font-black text-slate-950">
                          {index + 1}
                        </span>
                        {index < missionFlow.length - 1 ? (
                          <span className="mt-2 h-7 w-px bg-cyan-100/25" />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/20 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-white">{item.label}</p>
                          <span className="text-xs font-semibold text-cyan-100">
                            {item.value}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              {missionCards.map((card) => {
                const Icon = card.Icon;

                return (
                  <article
                    key={card.label}
                    className={`rounded-2xl border ${card.surface} p-4`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Icon aria-hidden="true" className={`h-5 w-5 ${card.accent}`} />
                      <TrendingUp aria-hidden="true" className="h-4 w-4 text-white/30" />
                    </div>
                    <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
                      {card.value}
                    </p>
                    <h2 className="mt-1 text-sm font-semibold text-white">
                      {card.label}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {card.caption}
                    </p>
                  </article>
                );
              })}

              <Link
                href="/leads"
                className="group flex min-h-40 flex-col justify-between rounded-2xl border border-white/10 bg-white px-5 py-4 text-slate-950 shadow-2xl shadow-white/10 transition hover:scale-[1.01]"
              >
                <PlayCircle aria-hidden="true" className="h-7 w-7" />
                <span>
                  <span className="block text-lg font-black tracking-tight">
                    Run your first lead
                  </span>
                  <span className="mt-2 flex items-center gap-2 text-sm font-semibold">
                    Open Lead Inbox
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition group-hover:translate-x-1"
                    />
                  </span>
                </span>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {dashboardStats.map((stat) => {
              const Icon = stat.Icon;

              return (
                <article
                  key={stat.label}
                  className="glass-panel rounded-[1.5rem] p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Icon
                      aria-hidden="true"
                      className="h-5 w-5"
                      style={{ color: stat.accent }}
                    />
                    <span className="text-xs text-slate-500">Today</span>
                  </div>
                  <p className="mt-5 text-4xl font-semibold tracking-tight text-white">
                    {stat.value}
                  </p>
                  <h2 className="mt-2 text-sm font-semibold text-white">
                    {stat.label}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">{stat.caption}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-panel rounded-[1.5rem] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Lead heat
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                  Hot leads
                </h2>
              </div>
              <ClipboardList aria-hidden="true" className="h-5 w-5 text-cyan-200" />
            </div>
            <div className="mt-5 space-y-3">
              {demoLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{lead.name}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {lead.projectType}
                      </p>
                    </div>
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm font-semibold text-cyan-100">
                      {lead.status} - {lead.score}/100
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-300"
                      style={{ width: `${lead.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="glass-panel rounded-[1.5rem] p-5">
              <BadgeEuro aria-hidden="true" className="h-6 w-6 text-violet-200" />
              <h2 className="mt-5 text-xl font-semibold text-white">
                Proposals ready
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Nora has three polished ranges waiting for review, including a
                700-1200 EUR scope for Studio Aurora.
              </p>
              <div className="mt-5 rounded-2xl border border-violet-300/20 bg-violet-300/10 p-4 text-sm font-medium text-violet-100">
                Nora is refining the offer language.
              </div>
            </article>

            <article className="glass-panel rounded-[1.5rem] p-5">
              <CalendarClock aria-hidden="true" className="h-6 w-6 text-lime-200" />
              <h2 className="mt-5 text-xl font-semibold text-white">
                Follow-up pending
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Milo is watching five warm leads and has two credible nudges
                queued for the next 48 hours.
              </p>
              <div className="mt-5 rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4 text-sm font-medium text-lime-100">
                Milo is protecting the next step.
              </div>
            </article>

            <div className="md:col-span-2">
              <ActivityLog activities={activities} agents={agents} />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
