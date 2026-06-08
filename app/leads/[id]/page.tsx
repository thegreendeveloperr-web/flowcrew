import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  MessageSquareText,
  Sparkles,
  Tags,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import CopyReplyButton from "@/components/CopyReplyButton";
import { getAuthContext } from "@/lib/auth";
import { agentRoles } from "@/lib/agent-roles";
import {
  getLeadDisplayName,
  getStoredLeadById,
  scoreLead,
} from "@/lib/leads";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatStatus(value: string) {
  const labels: Record<string, string> = {
    closed: "Chiuso",
    follow_up: "Follow-up",
    needs_qualification: "Da qualificare",
    new: "Nuovo",
    qualified: "Qualificato",
    waiting_reply: "In attesa di risposta",
  };

  return labels[value] ?? value.replaceAll("_", " ");
}

function ownerLabel(value: string | null) {
  const normalized = value?.toLowerCase() ?? "";

  if (normalized.includes("milo")) return agentRoles.milo.name;
  if (normalized.includes("nora")) return agentRoles.nora.name;
  if (normalized.includes("dex")) return agentRoles.dex.name;
  if (normalized.includes("flowcrew")) return "FlowCrew";

  return agentRoles.jackie.name;
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const auth = await getAuthContext();

  if (!auth) {
    redirect(`/login?next=${encodeURIComponent(`/leads/${id}`)}`);
  }

  const lead = await getStoredLeadById(auth, id);

  if (!lead) {
    notFound();
  }

  const score = scoreLead(lead);
  const tags = lead.tags ?? [];

  return (
    <AppShell>
      <div className="mx-auto max-w-[1240px] space-y-4">
        <section className="fc-toolbar p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link className="fc-button mb-5 w-fit" href="/leads">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Tutti i lead
              </Link>

              <p className="fc-label">Lead detail</p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-[-0.055em] text-[var(--fc-text)] sm:text-5xl">
                {getLeadDisplayName(lead)}
              </h1>
              <p className="flow-mono mt-3 text-xs capitalize text-[var(--fc-text-soft)]">
                {lead.source} / {formatDate(lead.created_at)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="fc-pill fc-pill-success">
                <span className="fc-status-dot text-[var(--fc-accent)]" />
                Score {score}%
              </span>
              <span className="fc-pill">{formatStatus(lead.status)}</span>
              <span className="fc-pill">Owner {ownerLabel(lead.owner_agent)}</span>
            </div>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <main className="space-y-4">
            <section className="fc-panel p-5 sm:p-6">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--fc-text)]">
                <Sparkles aria-hidden="true" className="h-4 w-4 text-[var(--fc-accent)]" />
                Analisi FlowCrew
              </div>

              <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-[var(--fc-text)]">
                {lead.summary ?? "Riassunto non disponibile"}
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <DetailCard label="Richiesta" value={lead.request ?? "Da qualificare"} />
                <DetailCard label="Priorita" value={lead.urgency ?? "Da qualificare"} />
              </div>
            </section>

            <section className="fc-panel p-5 sm:p-6">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--fc-text)]">
                <ClipboardList aria-hidden="true" className="h-4 w-4 text-[var(--fc-accent)]" />
                Messaggio originale
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--fc-text-muted)]">
                {lead.raw_message}
              </p>
            </section>

            <section className="rounded-[1.5rem] border border-[rgba(200,245,66,0.16)] bg-[rgba(200,245,66,0.055)] p-5 sm:p-6">
              <p className="fc-label text-[var(--fc-accent)]">Next action</p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] text-[var(--fc-text)]">
                {lead.next_action ?? "Rivedi il lead e definisci il prossimo passo."}
              </h2>
              {lead.follow_up ? (
                <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">
                  {lead.follow_up}
                </p>
              ) : null}
            </section>
          </main>

          <aside className="space-y-4">
            <section className="fc-panel p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--fc-text)]">
                <MessageSquareText aria-hidden="true" className="h-4 w-4 text-[var(--fc-accent)]" />
                Risposta pronta
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--fc-text-muted)]">
                {lead.suggested_reply ?? "Nessuna risposta salvata."}
              </p>
              {lead.suggested_reply ? (
                <div className="mt-5">
                  <CopyReplyButton text={lead.suggested_reply} />
                </div>
              ) : null}
            </section>

            <section className="fc-panel p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--fc-text)]">
                <Tags aria-hidden="true" className="h-4 w-4 text-[var(--fc-accent)]" />
                Tag e stato
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.length ? (
                  tags.map((tag) => (
                    <span className="fc-pill" key={tag}>
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[var(--fc-text-muted)]">
                    Nessun tag salvato.
                  </span>
                )}
              </div>

              <div className="mt-5 grid gap-2">
                <MetaRow label="Stato" value={formatStatus(lead.status)} />
                <MetaRow label="Owner" value={ownerLabel(lead.owner_agent)} />
                <MetaRow label="Score" value={`${score}%`} />
              </div>
            </section>

            <section className="fc-panel p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--fc-text)]">
                <CalendarClock aria-hidden="true" className="h-4 w-4 text-[var(--fc-accent)]" />
                Workspace
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">
                Questo lead e salvato nel workspace privato del tuo account.
              </p>
              <div className="mt-4 grid gap-2">
                <Link className="fc-button fc-button-primary w-full" href="/trial">
                  Nuovo lead
                </Link>
                <Link className="fc-button w-full" href="/dashboard">
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                  Torna alla dashboard
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
      <p className="fc-label">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-[var(--fc-text)]">
        {value}
      </p>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
      <span className="flow-mono text-xs text-[var(--fc-text-soft)]">{label}</span>
      <span className="text-right text-sm font-bold capitalize text-[var(--fc-text)]">
        {value}
      </span>
    </div>
  );
}
