import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Inbox,
  MessageSquareText,
  Plus,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import { DashboardPlanStatusCard } from "@/components/UsageWorkspaceStatus";
import { getAuthContext } from "@/lib/auth";
import {
  getLeadDashboardMetrics,
  getLeadDisplayName,
  getStoredLeads,
  scoreLead,
  type StoredLead,
} from "@/lib/leads";

export const dynamic = "force-dynamic";

function formatDate(value?: string) {
  if (!value) return "Nessuna data";

  return new Intl.DateTimeFormat("it-IT", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function DashboardPage() {
  const auth = await getAuthContext();

  if (!auth) {
    redirect("/login?next=/dashboard");
  }

  const [leads, metrics] = await Promise.all([
    getStoredLeads(auth, 12),
    getLeadDashboardMetrics(auth),
  ]);
  const priorityLeads = [...leads].sort((a, b) => scoreLead(b) - scoreLead(a)).slice(0, 5);
  const recentLeads = leads.slice(0, 6);
  const hasLeads = metrics.total > 0;
  const stats = [
    { label: "Lead aperti", value: String(metrics.total), detail: "Conversazioni salvate", Icon: Inbox },
    { label: "Risposte pronte", value: String(metrics.replies), detail: "Da approvare", Icon: MessageSquareText },
    { label: "Follow-up", value: String(metrics.followUps), detail: "Azioni successive", Icon: CalendarClock },
    { label: "Urgenti", value: String(metrics.urgent), detail: "Segnali alti", Icon: Clock3 },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-[1380px] space-y-4">
        <section className="fc-toolbar px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="fc-label">AI command center</p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-[-0.055em] text-[var(--fc-text)] sm:text-5xl">
                Oggi
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--fc-text-muted)]">
                Cosa richiede attenzione: lead caldi, risposte pronte, task e follow-up.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/trial" className="fc-button fc-button-primary">
                <Plus aria-hidden="true" className="h-4 w-4" />
                Nuovo lead
              </Link>
              <Link href="/leads" className="fc-button">
                Apri inbox
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.Icon;

            return (
              <article className="fc-card p-4" key={stat.label}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flow-mono text-xs uppercase tracking-[0.1em] text-[var(--fc-text-soft)]">{stat.label}</p>
                    <p className="mt-3 text-4xl font-extrabold tracking-[-0.055em] text-[var(--fc-text)]">
                      {stat.value}
                    </p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[var(--fc-accent)]">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-3 text-xs font-medium text-[var(--fc-text-muted)]">{stat.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
          <PriorityQueue leads={priorityLeads} totalCount={metrics.total} />
          <div className="space-y-4">
            <DashboardPlanStatusCard />
            <RecentActivity leads={recentLeads.slice(0, 4)} />
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)]">
          <RecentLeads leads={recentLeads} />
          <SystemStatus hasLeads={hasLeads} />
        </section>
      </div>
    </AppShell>
  );
}

function PriorityQueue({ leads, totalCount }: { leads: StoredLead[]; totalCount: number }) {
  return (
    <section className="fc-panel overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
        <div>
          <p className="fc-label">Priority queue</p>
          <h2 className="mt-1 text-xl font-bold tracking-[-0.035em] text-[var(--fc-text)]">
            Lead da gestire prima
          </h2>
        </div>
        <Link href="/leads" className="fc-button">
          {totalCount} totali
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      {leads.length ? (
        <div className="divide-y divide-white/[0.05]">
          {leads.map((lead) => (
            <PriorityRow key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <EmptyQueue />
      )}
    </section>
  );
}

function PriorityRow({ lead }: { lead: StoredLead }) {
  const score = scoreLead(lead);
  const displayName = getLeadDisplayName(lead);
  const urgency = lead.urgency ?? lead.status ?? "Nuovo";

  return (
    <Link
      href={`/leads/${lead.id}`}
      className="grid gap-3 px-4 py-3 transition hover:bg-white/[0.035] lg:grid-cols-[minmax(0,1fr)_100px_126px] lg:items-center"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-bold text-[var(--fc-text)]">{displayName}</h3>
          <span className="fc-pill capitalize">{urgency}</span>
          <span className="flow-mono text-xs capitalize text-[var(--fc-text-soft)]">{lead.source}</span>
        </div>
        <p className="mt-1 truncate text-sm text-[var(--fc-text-muted)]">
          {lead.request ?? lead.summary ?? "Richiesta cliente"}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-[var(--fc-text-muted)]">
          <span className="flow-mono">Score</span>
          <span className="flow-mono text-[var(--fc-text)]">{score}</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
          <div className="h-full rounded-full bg-[var(--fc-accent)]" style={{ width: `${score}%` }} />
        </div>
      </div>

      <p className="flow-mono text-xs text-[var(--fc-text-soft)] lg:text-right">{formatDate(lead.created_at)}</p>
    </Link>
  );
}

function RecentLeads({ leads }: { leads: StoredLead[] }) {
  return (
    <section className="fc-panel overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
        <div>
          <p className="fc-label">Recent leads</p>
          <h2 className="mt-1 text-xl font-bold tracking-[-0.035em] text-[var(--fc-text)]">
            Conversazioni salvate
          </h2>
        </div>
        <Link href="/trial" className="fc-button">
          Nuovo lead
        </Link>
      </div>

      {leads.length ? (
        <div className="divide-y divide-white/[0.05]">
          {leads.map((lead) => (
            <Link
              key={lead.id}
              href={`/leads/${lead.id}`}
              className="grid gap-2 px-4 py-3 transition hover:bg-white/[0.035] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[var(--fc-text)]">
                  {getLeadDisplayName(lead)}
                </p>
                <p className="mt-1 line-clamp-1 text-sm text-[var(--fc-text-muted)]">
                  {lead.summary ?? lead.raw_message}
                </p>
              </div>
              <span className="flow-mono text-xs text-[var(--fc-text-soft)]">{formatDate(lead.created_at)}</span>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyQueue />
      )}
    </section>
  );
}

function RecentActivity({ leads }: { leads: StoredLead[] }) {
  return (
    <section className="fc-panel overflow-hidden">
      <div className="border-b border-white/[0.06] px-4 py-3">
        <p className="fc-label">Recent activity</p>
        <h2 className="mt-1 text-xl font-bold tracking-[-0.035em] text-[var(--fc-text)]">
          Analisi salvate
        </h2>
      </div>
      {leads.length ? (
        <div className="divide-y divide-white/[0.05]">
          {leads.map((lead) => (
            <Link
              className="grid grid-cols-[82px_minmax(0,1fr)] gap-3 px-4 py-3 transition hover:bg-white/[0.035]"
              href={`/leads/${lead.id}`}
              key={lead.id}
            >
              <span className="flow-mono text-xs text-[var(--fc-text-soft)]">
                {formatDate(lead.created_at)}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-bold text-[var(--fc-text)]">
                    {getLeadDisplayName(lead)}
                  </p>
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.035] px-2 py-0.5 text-xs capitalize text-[var(--fc-text-muted)]">
                    {lead.source}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-[var(--fc-text-muted)]">
                  {lead.summary ?? "Lead analizzato e salvato nel workspace."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyQueue />
      )}
    </section>
  );
}

function SystemStatus({ hasLeads }: { hasLeads: boolean }) {
  return (
    <section className="fc-panel p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="fc-label">Workspace status</p>
          <h2 className="mt-1 text-xl font-bold tracking-[-0.035em] text-[var(--fc-text)]">
            Modello operativo
          </h2>
        </div>
        <span className="fc-pill fc-pill-success">
          <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
          {hasLeads ? "Active" : "Ready"}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {[
          ["Storage", "Supabase leads"],
          ["Reply mode", "Approvi tu"],
          ["Automation", "Nessun invio automatico"],
        ].map(([label, value]) => (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.035] px-3 py-2.5" key={label}>
            <span className="flow-mono text-xs text-[var(--fc-text-soft)]">{label}</span>
            <span className="text-right text-sm font-bold text-[var(--fc-text)]">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyQueue() {
  return (
    <div className="p-6 text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[var(--fc-accent)]">
        <Inbox aria-hidden="true" className="h-4 w-4" />
      </div>
      <h3 className="mt-3 text-base font-bold text-[var(--fc-text)]">Nessun lead salvato</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[var(--fc-text-muted)]">
        Crea un lead e apparira nel command center.
      </p>
      <Link href="/trial" className="fc-button fc-button-primary mt-4">
        Analizza il primo lead
      </Link>
    </div>
  );
}
