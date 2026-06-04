import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Flame,
  Inbox,
  MessageSquareText,
  Plus,
  Search,
  Sparkles,
  Tags,
  Timer,
  Zap,
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

function normalizeText(value: string | null | undefined) {
  return value?.toLowerCase().trim() ?? "";
}

function isUrgentLead(lead: StoredLead) {
  const text = `${lead.urgency ?? ""} ${lead.status ?? ""} ${(lead.tags ?? []).join(" ")} ${lead.summary ?? ""}`.toLowerCase();

  return (
    text.includes("alta") ||
    text.includes("urgent") ||
    text.includes("high") ||
    text.includes("caldo") ||
    text.includes("scadenza")
  );
}

function matchesQuery(lead: StoredLead, query: string) {
  const search = query.toLowerCase().trim();

  if (!search) return true;

  const haystack = [
    getLeadDisplayName(lead),
    lead.source,
    lead.summary,
    lead.request,
    lead.urgency,
    lead.status,
    lead.next_action,
    lead.follow_up,
    ...(lead.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(search);
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string | string[]; q?: string | string[]; filter?: string | string[] }>;
}) {
  const [allLeads, query] = await Promise.all([getStoredLeads(40), searchParams]);

  const selectedId = typeof query.lead === "string" ? query.lead : undefined;
  const searchQuery = typeof query.q === "string" ? query.q : "";
  const activeFilter = typeof query.filter === "string" ? query.filter : "all";

  const filteredLeads = allLeads.filter((lead) => {
    if (!matchesQuery(lead, searchQuery)) return false;

    if (activeFilter === "urgent") return isUrgentLead(lead);
    if (activeFilter === "new") return normalizeText(lead.status).includes("new");
    if (activeFilter === "follow-up") return Boolean(lead.follow_up || lead.next_action);

    return true;
  });

  const selected =
    filteredLeads.find((lead) => lead.id === selectedId) ??
    allLeads.find((lead) => lead.id === selectedId) ??
    filteredLeads[0] ??
    allLeads[0];

  const urgentCount = allLeads.filter(isUrgentLead).length;
  const followUpCount = allLeads.filter((lead) => lead.follow_up || lead.next_action).length;
  const averageScore = allLeads.length
    ? Math.round(allLeads.reduce((total, lead) => total + scoreLead(lead), 0) / allLeads.length)
    : 0;

  return (
    <AppShell>
      <div className="relative mx-auto max-w-[1500px] overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[rgba(200,245,66,0.07)] blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:64px_64px] opacity-60 [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,black,transparent)]" />

        <div className="relative space-y-4">
          <section className="rounded-[2rem] border border-white/[0.06] bg-black/30 px-5 py-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--fc-accent)] shadow-[0_0_18px_rgba(200,245,66,0.8)]" />
                  <span className="flow-mono text-xs uppercase tracking-[0.16em] text-[var(--fc-accent)]">
                    Client command center
                  </span>
                </div>

                <h1 className="text-5xl font-extrabold leading-[0.95] tracking-[-0.06em] text-[var(--fc-text)] sm:text-6xl">
                  Lead inbox
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--fc-text-muted)]">
                  Tutte le richieste cliente analizzate da FlowCrew: priorità, prossimo passo, risposta pronta e tag operativi.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <form action="/leads" className="relative block sm:w-80">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fc-text-soft)]"
                  />

                  <input
                    className="fc-input pl-9"
                    defaultValue={searchQuery}
                    name="q"
                    placeholder="Cerca cliente, tag, richiesta..."
                    type="search"
                  />
                </form>

                <Link href="/trial" className="fc-button fc-button-primary">
                  <Plus aria-hidden="true" className="h-4 w-4" />
                  Nuovo lead
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-4">
            <MetricCard icon={<Inbox className="h-4 w-4" />} label="Lead salvati" value={String(allLeads.length)} />
            <MetricCard icon={<Flame className="h-4 w-4" />} label="Urgenti" value={String(urgentCount)} />
            <MetricCard icon={<Timer className="h-4 w-4" />} label="Follow-up" value={String(followUpCount)} />
            <MetricCard icon={<Zap className="h-4 w-4" />} label="Score medio" value={allLeads.length ? `${averageScore}%` : "—"} />
          </section>

          <section className="grid min-h-[calc(100vh-12rem)] gap-4 xl:grid-cols-[340px_minmax(0,1fr)_380px]">
            <LeadList
              activeFilter={activeFilter}
              leads={filteredLeads}
              q={searchQuery}
              selectedId={selected?.id}
              totalCount={allLeads.length}
            />

            <LeadDetail lead={selected} />

            <AIPanel lead={selected} />
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <article className="rounded-[1.5rem] border border-white/[0.06] bg-[rgba(14,14,14,0.72)] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <p className="flow-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fc-text-soft)]">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-2xl border border-[rgba(200,245,66,0.16)] bg-[rgba(200,245,66,0.06)] text-[var(--fc-accent)]">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-4xl font-extrabold tracking-[-0.06em] text-[var(--fc-text)]">{value}</p>
    </article>
  );
}

function LeadList({
  leads,
  selectedId,
  q,
  activeFilter,
  totalCount,
}: {
  leads: StoredLead[];
  selectedId?: string;
  q: string;
  activeFilter: string;
  totalCount: number;
}) {
  return (
    <aside className="rounded-[2rem] border border-white/[0.06] bg-[rgba(14,14,14,0.82)] shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="border-b border-white/[0.06] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="fc-label">Inbox</p>
            <h2 className="mt-1 text-lg font-extrabold tracking-[-0.03em] text-[var(--fc-text)]">Client chaos</h2>
          </div>

          <span className="flow-mono text-xs text-[var(--fc-text-soft)]">
            {leads.length}/{totalCount}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            ["all", "Tutti"],
            ["urgent", "Urgenti"],
            ["follow-up", "Follow-up"],
            ["new", "Nuovi"],
          ].map(([value, label]) => (
            <Link
              className={`fc-pill ${activeFilter === value ? "fc-pill-success" : ""}`}
              href={{ pathname: "/leads", query: { ...(q ? { q } : {}), filter: value } }}
              key={value}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {leads.length ? (
        <div className="max-h-[calc(100vh-18rem)] overflow-y-auto">
          {leads.map((lead) => (
            <LeadListItem isSelected={lead.id === selectedId} key={lead.id} lead={lead} q={q} activeFilter={activeFilter} />
          ))}
        </div>
      ) : (
        <EmptyInbox hasSearch={Boolean(q)} />
      )}
    </aside>
  );
}

function LeadListItem({
  lead,
  isSelected,
  q,
  activeFilter,
}: {
  lead: StoredLead;
  isSelected: boolean;
  q: string;
  activeFilter: string;
}) {
  const score = scoreLead(lead);
  const displayName = getLeadDisplayName(lead);
  const tags = lead.tags ?? [];

  return (
    <Link
      aria-current={isSelected ? "page" : undefined}
      href={{ pathname: "/leads", query: { lead: lead.id, ...(q ? { q } : {}), ...(activeFilter !== "all" ? { filter: activeFilter } : {}) } }}
      className={`block border-b border-white/[0.05] px-4 py-4 transition hover:bg-white/[0.035] ${
        isSelected ? "bg-[rgba(200,245,66,0.07)]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-[var(--fc-text)]">{displayName}</p>
          <p className="flow-mono mt-1 truncate text-[11px] capitalize text-[var(--fc-text-soft)]">
            {lead.source} · {formatDate(lead.created_at)}
          </p>
        </div>

        <span
          className={`flow-mono rounded-xl border px-2 py-1 text-xs ${
            score >= 82
              ? "border-[rgba(200,245,66,0.18)] bg-[rgba(200,245,66,0.08)] text-[var(--fc-accent)]"
              : "border-white/[0.08] bg-white/[0.04] text-[var(--fc-text-soft)]"
          }`}
        >
          {score}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-5 text-[var(--fc-text-muted)]">
        {lead.summary ?? lead.raw_message}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className={`fc-pill ${isUrgentLead(lead) ? "fc-pill-success" : ""}`}>
          {lead.urgency ?? lead.status ?? "Nuovo"}
        </span>

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
      <section className="rounded-[2rem] border border-white/[0.06] bg-[rgba(14,14,14,0.82)] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-[var(--fc-accent)]">
          <Inbox aria-hidden="true" className="h-5 w-5" />
        </div>

        <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-[var(--fc-text)]">Nessun lead selezionato</h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--fc-text-muted)]">
          Analizza un messaggio cliente e apparirà qui come scheda operativa.
        </p>

        <Link href="/trial" className="fc-button fc-button-primary mt-5">
          Nuovo lead
        </Link>
      </section>
    );
  }

  const score = scoreLead(lead);
  const owner = ownerToLabel(lead.owner_agent);

  return (
    <main className="rounded-[2rem] border border-white/[0.06] bg-[rgba(14,14,14,0.82)] shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="border-b border-white/[0.06] px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="fc-label">Selected lead</p>

            <h2 className="mt-1 truncate text-4xl font-extrabold tracking-[-0.055em] text-[var(--fc-text)]">
              {getLeadDisplayName(lead)}
            </h2>

            <p className="flow-mono mt-2 text-xs capitalize text-[var(--fc-text-soft)]">
              {lead.source} · {formatDate(lead.created_at)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="fc-pill fc-pill-success">
              <span className="fc-status-dot text-[var(--fc-accent)]" />
              Score {score}%
            </span>

            <span className="fc-pill">{owner.name} intelligence</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <section className="rounded-3xl border border-white/[0.06] bg-white/[0.035] p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--fc-text)]">
            <ClipboardList aria-hidden="true" className="h-4 w-4 text-[var(--fc-accent)]" />
            Messaggio originale
          </div>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--fc-text-muted)]">{lead.raw_message}</p>
        </section>

        <div className="grid gap-3 lg:grid-cols-2">
          <InfoBlock title="Riassunto" value={lead.summary ?? "Nessun riassunto salvato."} />
          <InfoBlock title="Richiesta" value={lead.request ?? "Richiesta cliente"} />
          <InfoBlock title="Priorità" value={lead.urgency ?? lead.status ?? "Nuovo"} />
          <InfoBlock title="Score" value={`${score}%`} meter={score} />
        </div>

        <section className="rounded-3xl border border-[rgba(200,245,66,0.14)] bg-[rgba(200,245,66,0.045)] p-5">
          <p className="flow-mono text-xs uppercase tracking-[0.14em] text-[var(--fc-accent)]">Next action</p>

          <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.05em] text-[var(--fc-text)]">
            {lead.next_action ?? "Rivedi il lead e decidi la prossima azione."}
          </h3>

          {lead.follow_up ? (
            <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">{lead.follow_up}</p>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function AIPanel({ lead }: { lead?: StoredLead }) {
  const tags = lead?.tags ?? [];
  const owner = ownerToLabel(lead?.owner_agent ?? null);

  return (
    <aside className="rounded-[2rem] border border-white/[0.06] bg-[rgba(14,14,14,0.82)] shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="border-b border-white/[0.06] px-4 py-4">
        <p className="fc-label">AI panel</p>
        <h2 className="mt-1 text-lg font-extrabold tracking-[-0.03em] text-[var(--fc-text)]">Handling consigliato</h2>
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

        <section className="rounded-3xl border border-white/[0.06] bg-white/[0.035] p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--fc-text)]">
            <MessageSquareText aria-hidden="true" className="h-4 w-4 text-[var(--fc-accent)]" />
            Risposta pronta
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--fc-text-muted)]">
            {lead?.suggested_reply ?? "Seleziona o genera un lead per vedere la bozza."}
          </p>
        </section>

        <section className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--fc-text)]">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[var(--fc-mint)]" />
            Azioni
          </div>

          <div className="mt-3 grid gap-2">
            <ActionRow label="Owner" value={`${owner.name} · ${owner.title}`} />
            <ActionRow label="Status" value={lead?.status ?? "Waiting"} />
            <ActionRow label="Follow-up" value={lead?.follow_up ?? "Non programmato"} />
          </div>

          <div className="mt-4 grid gap-2">
            <Link href="/trial" className="fc-button fc-button-primary w-full">
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

function EmptyInbox({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="p-6 text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[var(--fc-accent)]">
        <Inbox aria-hidden="true" className="h-4 w-4" />
      </div>

      <h3 className="mt-3 text-base font-bold text-[var(--fc-text)]">
        {hasSearch ? "Nessun risultato" : "Nessun lead"}
      </h3>

      <p className="mt-1 text-sm leading-6 text-[var(--fc-text-muted)]">
        {hasSearch
          ? "Prova a cambiare ricerca o filtro."
          : "I nuovi lead analizzati appariranno qui."}
      </p>

      <Link href="/trial" className="fc-button fc-button-primary mt-4">
        Nuovo lead
      </Link>
    </div>
  );
}