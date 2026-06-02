import Link from "next/link";
import { ArrowRight, Database, Inbox, Search, Sparkles } from "lucide-react";
import AgentAvatar from "@/components/AgentAvatar";
import AppShell from "@/components/AppShell";
import type { AgentId } from "@/lib/data";
import { getLeadDisplayName, getStoredLeads, scoreLead, type StoredLead } from "@/lib/leads";

export const dynamic = "force-dynamic";

function ownerToAgent(owner: string | null): AgentId {
  const normalized = owner?.toLowerCase() ?? "";
  if (normalized.includes("milo")) return "milo";
  if (normalized.includes("nora")) return "nora";
  if (normalized.includes("dex")) return "dex";
  return "jackie";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string | string[] }>;
}) {
  const [leads, query] = await Promise.all([getStoredLeads(40), searchParams]);
  const selectedId = typeof query.lead === "string" ? query.lead : undefined;
  const selected = leads.find((lead) => lead.id === selectedId) ?? leads[0];

  return (
    <AppShell>
      <div className="space-y-5">
        <section className="rounded-[2.25rem] border border-slate-200 bg-white/82 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-8">
          <div className="grid gap-7 xl:grid-cols-[0.85fr_1.15fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                <Inbox className="h-4 w-4" />
                Live lead inbox
              </div>
              <h1 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-[-0.075em] text-slate-950 md:text-7xl">
                Every saved message becomes a clean client card.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                This inbox now reads from Supabase. Leads created from the trial appear here with summary, tags, priority, reply and follow-up.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/trial" className="rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 px-5 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(37,99,235,0.25)]">
                  Import a new message
                </Link>
                <Link href="/dashboard" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
                  Open dashboard
                </Link>
              </div>
            </div>

            <SelectedLead lead={selected} />
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
          <aside className="rounded-[2rem] border border-slate-200 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Database</p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-slate-950">Supabase status</h2>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Database className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Search className="h-4 w-4" />
                <span className="text-sm font-bold">Search UI will come after the database layer.</span>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <MiniMetric label="Saved leads" value={String(leads.length)} />
              <MiniMetric label="Latest source" value={selected?.source ?? "None yet"} />
              <MiniMetric label="Top urgency" value={selected?.urgency ?? "Waiting"} />
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-black text-blue-800">Crew rule</p>
              <p className="mt-2 text-sm leading-6 text-blue-900/70">
                FlowCrew can draft and organize, but replies wait for your approval. This keeps the product trustworthy.
              </p>
            </div>
          </aside>

          <div className="rounded-[2rem] border border-slate-200 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Pipeline</p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-slate-950">Client conversations</h2>
              </div>
              <Link href="/trial" className="hidden rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 px-4 py-2 text-sm font-black text-white shadow-[0_14px_34px_rgba(37,99,235,0.20)] sm:block">
                Import message
              </Link>
            </div>

            {leads.length ? (
              <div className="grid gap-3">
                {leads.map((lead) => (
                  <LeadRow isSelected={lead.id === selected?.id} key={lead.id} lead={lead} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function SelectedLead({ lead }: { lead?: StoredLead }) {
  if (!lead) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Selected lead</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.06em]">No leads yet</h2>
            <p className="mt-1 text-sm text-slate-400">Create one from /trial.</p>
          </div>
          <AgentAvatar agentId="jackie" decorative size="lg" />
        </div>
        <p className="mt-5 rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-slate-200">
          Paste a client message in the trial page and FlowCrew will save the structured lead here.
        </p>
      </div>
    );
  }

  const score = scoreLead(lead);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Selected lead</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.06em]">{getLeadDisplayName(lead)}</h2>
          <p className="mt-1 text-sm capitalize text-slate-400">{lead.source} · {formatDate(lead.created_at)}</p>
        </div>
        <AgentAvatar agentId={ownerToAgent(lead.owner_agent)} decorative size="lg" />
      </div>
      <p className="mt-5 rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-slate-200">
        {lead.summary ?? lead.raw_message}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <DarkMetric label="Request" value={lead.request ?? "—"} />
        <DarkMetric label="Priority" value={lead.urgency ?? "—"} />
        <DarkMetric label="Score" value={`${score}%`} />
      </div>
    </div>
  );
}

function LeadRow({ lead, isSelected }: { lead: StoredLead; isSelected: boolean }) {
  const score = scoreLead(lead);
  const tags = lead.tags ?? [];
  const displayName = getLeadDisplayName(lead);
  const selectionLabel = isSelected ? `Selected lead: ${displayName}` : `Select lead: ${displayName}`;

  return (
    <Link
      aria-current={isSelected ? "page" : undefined}
      aria-label={`${selectionLabel}. ${lead.request ?? "Client request"}. Score ${score}%.`}
      className={`block rounded-[1.65rem] border bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)] transition hover:border-blue-200 hover:shadow-[0_16px_40px_rgba(15,23,42,0.09)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${isSelected ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-100"}`}
      href={{ pathname: "/leads", query: { lead: lead.id } }}
    >
      <div className="grid gap-4 md:grid-cols-[56px_1fr_auto] md:items-center">
        <AgentAvatar agentId={ownerToAgent(lead.owner_agent)} decorative size="md" />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-slate-950">{displayName}</h3>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-100">{lead.urgency ?? "New"}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black capitalize text-slate-600">{lead.source}</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-500">{lead.request ?? "Client request"}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{lead.summary ?? lead.raw_message}</p>
          {tags.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.slice(0, 5).map((tag) => (
                <span key={tag} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-100">{tag}</span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-3 md:justify-end">
          <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-500" style={{ width: `${score}%` }} />
          </div>
          <b className="text-sm text-slate-950">{score}</b>
          <ArrowRight aria-hidden="true" className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[1.65rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
        <Sparkles className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-2xl font-black tracking-[-0.05em] text-slate-950">No saved leads yet</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
        Use the trial page to ingest a message. Gemini will analyze it and Supabase will store the generated lead card.
      </p>
      <Link href="/trial" className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">
        Create first lead <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function DarkMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 line-clamp-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}
