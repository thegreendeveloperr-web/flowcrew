import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Inbox,
  MessageSquareText,
  Plus,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import AgentAvatar from "@/components/AgentAvatar";
import AppShell from "@/components/AppShell";
import { agentOrder, agentRoles } from "@/lib/agent-roles";
import { getLeadDisplayName, getStoredLeads, scoreLead, type StoredLead } from "@/lib/leads";

export const dynamic = "force-dynamic";

const statTone = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
};

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

function formatDate(value?: string) {
  if (!value) return "No date";

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function DashboardPage() {
  const leads = await getStoredLeads(12);
  const topLeads = leads.slice(0, 4);
  const hasLeads = leads.length > 0;
  const stats = [
    {
      label: "Saved leads",
      value: String(leads.length),
      detail: "Synced from Supabase",
      Icon: Sparkles,
      tone: "blue" as const,
    },
    {
      label: "Replies ready",
      value: String(replyCount(leads)),
      detail: "Awaiting approval",
      Icon: MessageSquareText,
      tone: "emerald" as const,
    },
    {
      label: "Follow-ups",
      value: String(followUpCount(leads)),
      detail: "Next actions found",
      Icon: CalendarClock,
      tone: "amber" as const,
    },
    {
      label: "Urgent leads",
      value: String(urgentCount(leads)),
      detail: "High priority signals",
      Icon: Clock3,
      tone: "rose" as const,
    },
  ];

  return (
    <AppShell>
      <div className="space-y-5">
        <section className="fc-panel p-5 sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="fc-label">Dashboard</p>
              <h1 className="mt-2 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Client work, prioritized for today.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                A clean operating view for saved messages, reply drafts and follow-up signals. Data stays connected to the same Supabase lead records.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/trial" className="fc-button fc-button-primary">
                <Plus aria-hidden="true" className="h-4 w-4" />
                Capture lead
              </Link>
              <Link href="/leads" className="fc-button">
                Open inbox
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.Icon;

              return (
                <article className="fc-card p-4" key={stat.label}>
                  <div className="flex items-start justify-between gap-4">
                    <div className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${statTone[stat.tone]}`}>
                      <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={2.1} />
                    </div>
                    <TrendingUp aria-hidden="true" className="h-4 w-4 text-slate-300" />
                  </div>
                  <p className="mt-5 text-3xl font-bold tracking-[-0.045em] text-slate-950">
                    {stat.value}
                  </p>
                  <h2 className="mt-1 text-sm font-semibold text-slate-800">{stat.label}</h2>
                  <p className="mt-1 text-sm text-slate-500">{stat.detail}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <LeadQueue leads={topLeads} totalCount={leads.length} />
          <WorkflowPanel hasLeads={hasLeads} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)]">
          <CrewPanel />
          <ActivityPanel hasLeads={hasLeads} />
        </section>
      </div>
    </AppShell>
  );
}

function LeadQueue({ leads, totalCount }: { leads: StoredLead[]; totalCount: number }) {
  return (
    <section className="fc-panel p-5 sm:p-6">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="fc-label">Lead queue</p>
          <h2 className="mt-1 text-xl font-bold tracking-[-0.03em] text-slate-950">
            Ready to move
          </h2>
        </div>
        <Link href="/leads" className="fc-button self-start sm:self-auto">
          {totalCount} total
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      {leads.length ? (
        <div className="mt-4 divide-y divide-slate-100">
          {leads.map((lead) => (
            <LeadQueueRow key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-white text-blue-600 ring-1 ring-slate-200">
            <Inbox aria-hidden="true" className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-xl font-bold tracking-[-0.03em] text-slate-950">
            No saved leads yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            Create a lead from the trial page and the saved brief will appear here.
          </p>
          <Link href="/trial" className="fc-button fc-button-primary mt-5">
            Capture first lead
          </Link>
        </div>
      )}
    </section>
  );
}

function LeadQueueRow({ lead }: { lead: StoredLead }) {
  const score = scoreLead(lead);
  const displayName = getLeadDisplayName(lead);
  const urgency = lead.urgency ?? lead.status ?? "New";

  return (
    <article className="grid gap-4 py-4 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,1fr)_150px] lg:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-slate-950">{displayName}</h3>
          <span className="fc-pill fc-pill-plain capitalize">{urgency}</span>
          <span className="text-xs font-medium capitalize text-slate-400">{lead.source}</span>
          <span className="text-xs text-slate-400">{formatDate(lead.created_at)}</span>
        </div>
        <p className="mt-1 text-sm font-medium text-slate-700">
          {lead.request ?? "Client request"}
        </p>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
          {lead.summary ?? lead.raw_message}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {lead.suggested_reply ? <span className="fc-pill">Reply ready</span> : null}
          {lead.next_action || lead.follow_up ? <span className="fc-pill">Follow-up</span> : null}
          {(lead.tags ?? []).slice(0, 3).map((tag) => (
            <span key={tag} className="fc-pill">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Score</span>
          <span className="text-slate-950">{score}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${score}%` }} />
        </div>
      </div>
    </article>
  );
}

function WorkflowPanel({ hasLeads }: { hasLeads: boolean }) {
  return (
    <section className="fc-panel p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="fc-label">Workflow</p>
          <h2 className="mt-1 text-xl font-bold tracking-[-0.03em] text-slate-950">
            Processing model
          </h2>
        </div>
        <span className="fc-pill fc-pill-success">
          <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
          {hasLeads ? "Active" : "Ready"}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {agentOrder.map((id, index) => (
          <div key={id} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-950 text-xs font-bold text-white">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950">{agentRoles[id].name}</p>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {agentRoles[id].workflowAction}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CrewPanel() {
  return (
    <section className="fc-panel p-5 sm:p-6">
      <div className="border-b border-slate-200 pb-4">
        <p className="fc-label">Crew roles</p>
        <h2 className="mt-1 text-xl font-bold tracking-[-0.03em] text-slate-950">
          Handoff responsibilities
        </h2>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {agentOrder.map((id) => (
          <article key={id} className="fc-muted-card p-4">
            <AgentAvatar agentId={id} decorative size="md" />
            <p className="mt-3 text-sm font-semibold text-slate-950">{agentRoles[id].name}</p>
            <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
              {agentRoles[id].title}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ActivityPanel({ hasLeads }: { hasLeads: boolean }) {
  return (
    <section className="fc-panel p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
          <Zap aria-hidden="true" className="h-4 w-4" />
        </div>
        <div>
          <p className="fc-label">Activity</p>
          <h2 className="mt-1 text-xl font-bold tracking-[-0.03em] text-slate-950">
            Recent signal
          </h2>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">
          {hasLeads ? "Saved lead cards are live." : "No saved lead activity yet."}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Detailed activity will appear once event tracking is connected. For now, this workspace only shows data FlowCrew can verify from Supabase.
        </p>
      </div>
    </section>
  );
}
