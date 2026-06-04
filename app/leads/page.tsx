import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Inbox,
  MessageSquareText,
  Plus,
  Search,
  SlidersHorizontal,
  Tags,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import { agentRoles } from "@/lib/agent-roles";
import { getLeadDisplayName, getStoredLeads, scoreLead, type StoredLead } from "@/lib/leads";

export const dynamic = "force-dynamic";

function ownerToLabel(owner: string | null) {
  const normalized = owner?.toLowerCase() ?? "";
  if (normalized.includes("milo")) return agentRoles.milo;
  if (normalized.includes("nora")) return agentRoles.nora;
  if (normalized.includes("dex")) return agentRoles.dex;
  return agentRoles.jackie;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
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
      <div className="mx-auto max-w-[1500px] space-y-4">
        <section className="fc-toolbar px-4 py-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-4xl font-extrabold tracking-[-0.055em] text-[var(--fc-text)]">
                Lead inbox
              </h1>
              <span className="fc-pill">{leads.length} salvati</span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="relative block sm:w-72">
                <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fc-text-soft)]" />
                <input className="fc-input pl-9" placeholder="Cerca lead" type="search" />
              </label>
              <button type="button" className="fc-button">
                <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
                Filtri
              </button>
              <Link href="/trial" className="fc-button fc-button-primary">
                <Plus aria-hidden="true" className="h-4 w-4" />
                Nuovo lead
              </Link>
            </div>
          </div>
        </section>

        <section className="grid min-h-[calc(100vh-8rem)] gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
          <LeadList leads={leads} selectedId={selected?.id} />
          <LeadDetail lead={selected} />
          <AIPanel lead={selected} />
        </section>
      </div>
    </AppShell>
  );
}

function LeadList({ leads, selectedId }: { leads: StoredLead[]; selectedId?: string }) {
  return (
    <aside className="fc-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div>
          <p className="fc-label">Inbox</p>
          <h2 className="mt-1 text-lg font-bold tracking-[-0.03em] text-[var(--fc-text)]">Client chaos</h2>
        </div>
        <span className="flow-mono text-xs text-[var(--fc-text-soft)]">Newest first</span>
      </div>

      {leads.length ? (
        <div className="max-h-[calc(100vh-13rem)] overflow-y-auto">
          {leads.map((lead) => (
            <LeadListItem isSelected={lead.id === selectedId} key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <EmptyInbox />
      )}
    </aside>
  );
}

function LeadListItem({ lead, isSelected }: { lead: StoredLead; isSelected: boolean }) {
  const score = scoreLead(lead);
  const displayName = getLeadDisplayName(lead);
  const tags = lead.tags ?? [];

  return (
    <Link
      aria-current={isSelected ? "page" : undefined}
      href={{ pathname: "/leads", query: { lead: lead.id } }}
      className={`block border-b border-white/[0.05] px-4 py-3 transition hover:bg-white/[0.035] ${
        isSelected ? "bg-[rgba(200,245,66,0.07)]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[var(--fc-text)]">{displayName}</p>
          <p className="flow-mono mt-1 truncate text-xs capitalize text-[var(--fc-text-soft)]">
            {lead.source} - {formatDate(lead.created_at)}
          </p>
        </div>
        <span className="flow-mono rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-1 text-xs text-[var(--fc-accent)]">
          {score}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-5 text-[var(--fc-text-muted)]">
        {lead.summary ?? lead.raw_message}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="fc-pill capitalize">{lead.urgency ?? lead.status ?? "Nuovo"}</span>
        {tags.slice(0, 2).map((tag) => (
          <span className="fc-pill fc-pill-plain" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

function LeadDetail({ lead }: { lead?: StoredLead }) {
  if (!lead) {
    return (
      <section className="fc-panel grid place-items-center p-6 text-center">
        <div>
          <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[var(--fc-accent)]">
            <Inbox aria-hidden="true" className="h-4 w-4" />
          </div>
          <h2 className="mt-3 text-lg font-bold text-[var(--fc-text)]">Nessun lead selezionato</h2>
          <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--fc-text-muted)]">
            Analizza un messaggio cliente e apparira qui.
          </p>
          <Link href="/trial" className="fc-button fc-button-primary mt-4">
            Nuovo lead
          </Link>
        </div>
      </section>
    );
  }

  const score = scoreLead(lead);
  const owner = ownerToLabel(lead.owner_agent);

  return (
    <main className="fc-panel overflow-hidden">
      <div className="border-b border-white/[0.06] px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="fc-label">Selected lead</p>
            <h2 className="mt-1 truncate text-3xl font-extrabold tracking-[-0.05em] text-[var(--fc-text)]">
              {getLeadDisplayName(lead)}
            </h2>
            <p className="flow-mono mt-1 text-xs capitalize text-[var(--fc-text-soft)]">
              {lead.source} - {formatDate(lead.created_at)}
            </p>
          </div>
          <span className="fc-pill">
            <span className="fc-status-dot text-[var(--fc-accent)]" />
            {owner.name} intelligence
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--fc-text)]">
            <ClipboardList aria-hidden="true" className="h-4 w-4 text-[var(--fc-accent)]" />
            Messaggio originale
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--fc-text-muted)]">
            {lead.raw_message}
          </p>
        </section>

        <div className="grid gap-3 lg:grid-cols-2">
          <InfoBlock title="Riassunto" value={lead.summary ?? "Nessun riassunto salvato."} />
          <InfoBlock title="Richiesta" value={lead.request ?? "Richiesta cliente"} />
          <InfoBlock title="Priorita" value={lead.urgency ?? lead.status ?? "Nuovo"} />
          <InfoBlock title="Score" value={`${score}%`} meter={score} />
        </div>

        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-sm font-bold text-[var(--fc-text)]">Prossimo passo</p>
          <p className="mt-2 text-sm leading-6 text-[var(--fc-text-muted)]">
            {lead.next_action ?? lead.follow_up ?? "Rivedi il lead e decidi la prossima azione."}
          </p>
        </section>
      </div>
    </main>
  );
}

function AIPanel({ lead }: { lead?: StoredLead }) {
  const tags = lead?.tags ?? [];
  const owner = ownerToLabel(lead?.owner_agent ?? null);

  return (
    <aside className="fc-panel overflow-hidden">
      <div className="border-b border-white/[0.06] px-4 py-3">
        <p className="fc-label">AI panel</p>
        <h2 className="mt-1 text-lg font-bold tracking-[-0.03em] text-[var(--fc-text)]">Handling consigliato</h2>
      </div>

      <div className="space-y-4 p-4">
        <section>
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--fc-text)]">
            <Tags aria-hidden="true" className="h-4 w-4 text-[var(--fc-accent)]" />
            Tag automatici
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.length ? (
              tags.map((tag) => (
                <span className="fc-pill" key={tag}>
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-sm text-[var(--fc-text-muted)]">Nessun tag.</span>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--fc-text)]">
            <MessageSquareText aria-hidden="true" className="h-4 w-4 text-[var(--fc-accent)]" />
            Risposta pronta
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--fc-text-muted)]">
            {lead?.suggested_reply ?? "Seleziona o genera un lead per vedere la bozza."}
          </p>
        </section>

        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--fc-text)]">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[var(--fc-mint)]" />
            Azioni
          </div>
          <div className="mt-3 grid gap-2">
            <ActionRow label="Owner" value={`${owner.name} - ${owner.title}`} />
            <ActionRow label="Status" value={lead?.status ?? "Waiting"} />
            <ActionRow label="Follow-up" value={lead?.follow_up ?? "Non programmato"} />
          </div>
          <div className="mt-4 grid gap-2">
            <Link href="/trial" className="fc-button w-full">
              Crea un altro lead
            </Link>
            <Link href="/dashboard" className="fc-button w-full">
              Torna a Oggi
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </aside>
  );
}

function InfoBlock({ title, value, meter }: { title: string; value: string; meter?: number }) {
  return (
    <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="flow-mono text-xs uppercase tracking-[0.12em] text-[var(--fc-text-soft)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--fc-text-muted)]">{value}</p>
      {typeof meter === "number" ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
          <div className="h-full rounded-full bg-[var(--fc-accent)]" style={{ width: `${meter}%` }} />
        </div>
      ) : null}
    </section>
  );
}

function ActionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.035] px-3 py-2">
      <span className="flow-mono text-xs text-[var(--fc-text-soft)]">{label}</span>
      <span className="text-right text-xs font-bold text-[var(--fc-text)]">{value}</span>
    </div>
  );
}

function EmptyInbox() {
  return (
    <div className="p-6 text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[var(--fc-accent)]">
        <Inbox aria-hidden="true" className="h-4 w-4" />
      </div>
      <h3 className="mt-3 text-base font-bold text-[var(--fc-text)]">Nessun lead</h3>
      <p className="mt-1 text-sm leading-6 text-[var(--fc-text-muted)]">I nuovi lead analizzati appariranno qui.</p>
      <Link href="/trial" className="fc-button fc-button-primary mt-4">
        Nuovo lead
      </Link>
    </div>
  );
}
