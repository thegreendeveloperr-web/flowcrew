"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Database,
  LoaderCircle,
  MessageSquareText,
  Tags,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import type { ConversationAnalysis, ConversationSource } from "@/lib/flowcrew-types";
import type { StoredLead } from "@/lib/leads";
import { trialDraftStorageKey } from "@/lib/trial-draft";

const sample = `ciao, io e mio fratello dobbiamo fare una cosa per il negozio... si voglio dire un sito, ma magari anche la gestione social? non lo so ancora bene. comunque ci serviva entro fine mese tipo. ah, e non abbiamo budget enorme, max 800 euro forse. dimmi tu`;

const loadingSteps = [
  "Jackie organizza il messaggio",
  "Dex classifica tag, source e priorita",
  "Milo estrae task e prossimi passi",
  "Nora prepara una risposta da approvare",
];

type IngestResponse = {
  analysis: ConversationAnalysis;
  lead: StoredLead;
};

const sourceOptions: Array<{ value: ConversationSource; label: string }> = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "gmail", label: "Gmail" },
  { value: "instagram", label: "Instagram" },
  { value: "email", label: "Email" },
  { value: "notes", label: "Note manuali" },
  { value: "other", label: "Altro" },
];

export default function TrialPage() {
  const [clientName, setClientName] = useState("Cliente demo");
  const [sourceType, setSourceType] = useState<ConversationSource>("whatsapp");
  const [businessType, setBusinessType] = useState("Freelance / piccolo team");
  const [goal, setGoal] = useState("Riassunto, priorita, task, tag e risposta pronta.");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<IngestResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedDraft = window.localStorage.getItem(trialDraftStorageKey);

      if (storedDraft) {
        window.setTimeout(() => setMessage(storedDraft), 0);
      }
    } catch {
      // The form remains usable when storage is unavailable.
    }
  }, []);

  const generated = Boolean(result);
  const analysis = result?.analysis;
  const lead = result?.lead;

  const detectedTags = useMemo(() => {
    if (analysis?.dex.tags.length) return analysis.dex.tags;
    return ["lead-caldo", "sito-web", "scadenza-urgente"];
  }, [analysis]);

  async function generateLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ingest-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          sourceType,
          messyMessage: message,
          businessType,
          goal,
          language: "it",
        }),
      });

      const payload = (await response.json()) as IngestResponse | { error?: string };

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Accedi per salvare un lead nel tuo workspace.");
        }
        throw new Error("error" in payload && payload.error ? payload.error : "Analisi non riuscita.");
      }

      setResult(payload as IngestResponse);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Errore sconosciuto.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1380px] space-y-4">
        <section className="fc-toolbar px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="fc-label">Free lead analysis</p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-[-0.055em] text-[var(--fc-text)]">
                Nuovo lead
              </h1>
              <p className="mt-2 text-sm text-[var(--fc-text-muted)]">
                Incolla il caos. Ottieni summary, task, priorita, tag e risposta pronta.
              </p>
            </div>
            <Link href="/leads" className="fc-button">
              View inbox
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(380px,0.7fr)]">
          <form aria-busy={isLoading} className="fc-panel overflow-hidden" onSubmit={generateLead}>
            <div className="border-b border-white/[0.06] px-5 py-4">
              <p className="fc-label">Input</p>
              <h2 className="mt-1 text-xl font-bold tracking-[-0.035em] text-[var(--fc-text)]">
                Messaggio cliente
              </h2>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Nome cliente">
                  <input className="fc-input" name="clientName" type="text" value={clientName} onChange={(event) => setClientName(event.target.value)} />
                </Field>

                <Field label="Sorgente">
                  <select className="fc-select" name="sourceType" value={sourceType} onChange={(event) => setSourceType(event.target.value as ConversationSource)}>
                    {sourceOptions.map((source) => (
                      <option key={source.value} value={source.value}>
                        {source.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Contesto business">
                  <input className="fc-input" name="businessType" type="text" value={businessType} onChange={(event) => setBusinessType(event.target.value)} />
                </Field>

                <Field label="Obiettivo">
                  <input className="fc-input" name="goal" type="text" value={goal} onChange={(event) => setGoal(event.target.value)} />
                </Field>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-bold text-[var(--fc-text)]" htmlFor="client-conversation">
                    Conversazione
                  </label>
                  <button className="text-xs font-bold text-[var(--fc-accent)] transition hover:text-[var(--fc-accent-strong)]" onClick={() => setMessage(sample)} type="button">
                    Usa esempio
                  </button>
                </div>
                <textarea
                  className="fc-textarea mt-2 min-h-[18rem]"
                  id="client-conversation"
                  name="messyMessage"
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={sample}
                  value={message}
                />
              </div>

              <button type="submit" disabled={isLoading || !message.trim()} className="fc-button fc-button-primary w-full">
                {isLoading ? (
                  <>
                    <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                    Analisi in corso...
                  </>
                ) : (
                  <>
                    Analizza e salva lead
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </>
                )}
              </button>

              {isLoading ? (
                <div aria-live="polite" className="rounded-2xl border border-[rgba(200,245,66,0.16)] bg-[rgba(200,245,66,0.06)] p-4" role="status">
                  <div className="flex items-center gap-2 text-sm font-bold text-[var(--fc-accent)]">
                    <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                    La crew sta lavorando
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {loadingSteps.map((step) => (
                      <p className="flex items-center gap-2 text-xs font-medium text-[var(--fc-text-muted)]" key={step}>
                        <span className="fc-status-dot text-[var(--fc-accent)]" />
                        {step}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}

              {error ? (
                <div className="flex gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm font-medium leading-6 text-red-100" role="alert">
                  <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
                  {error}
                </div>
              ) : null}

              {lead ? (
                <div aria-live="polite" className="flex items-center gap-2 rounded-2xl border border-[rgba(139,255,197,0.22)] bg-[rgba(139,255,197,0.08)] p-4 text-sm font-bold text-[var(--fc-mint)]" role="status">
                  <Database aria-hidden="true" className="h-5 w-5" />
                  Salvato in Supabase come lead <span className="flow-mono text-xs">{lead.id.slice(0, 8)}</span>
                </div>
              ) : null}
            </div>
          </form>

          <aside className="fc-panel overflow-hidden xl:sticky xl:top-4 xl:self-start">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <p className="fc-label">Output</p>
              <h2 className="mt-1 text-xl font-bold tracking-[-0.035em] text-[var(--fc-text)]">
                Brief pulito
              </h2>
            </div>

            <div className="space-y-4 p-5">
              <OutputCard icon={<ClipboardList className="h-4 w-4" />} title="Riassunto" active={generated}>
                <p className="text-sm leading-6 text-[var(--fc-text-muted)]">
                  {lead?.summary ?? "Lancia l'analisi per ottenere un riassunto chiaro."}
                </p>
              </OutputCard>

              <div className="grid gap-3 sm:grid-cols-2">
                <OutputCard icon={<CheckCircle2 className="h-4 w-4" />} title="Priorita" active={generated}>
                  <p className="text-sm font-bold text-[var(--fc-text)]">{lead?.urgency ?? "Waiting"}</p>
                </OutputCard>

                <OutputCard icon={<Tags className="h-4 w-4" />} title="Tags" active={generated}>
                  <div className="flex flex-wrap gap-2">
                    {detectedTags.map((tag) => (
                      <span className="fc-pill" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </OutputCard>
              </div>

              <OutputCard icon={<CheckCircle2 className="h-4 w-4" />} title="Task / next action" active={generated}>
                <p className="text-sm leading-6 text-[var(--fc-text-muted)]">
                  {lead?.next_action ?? "Il prossimo passo consigliato comparira qui."}
                </p>
              </OutputCard>

              <OutputCard icon={<MessageSquareText className="h-4 w-4" />} title="Risposta pronta" active={generated}>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--fc-text-muted)]">
                    {lead?.suggested_reply ?? "La risposta pronta da approvare comparira qui dopo l'analisi."}
                  </p>
                </div>
              </OutputCard>
            </div>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-bold text-[var(--fc-text)]">
      {label}
      <div className="mt-2">{children}</div>
    </label>
  );
}

function OutputCard({
  icon,
  title,
  active,
  children,
}: {
  icon: ReactNode;
  title: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--fc-text)]">
          <span className="grid h-8 w-8 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[var(--fc-accent)]">
            {icon}
          </span>
          {title}
        </div>
        <span className={`flow-mono rounded-full px-2 py-0.5 text-xs ${active ? "bg-[rgba(139,255,197,0.08)] text-[var(--fc-mint)]" : "bg-white/[0.04] text-[var(--fc-text-soft)]"}`}>
          {active ? "Ready" : "Idle"}
        </span>
      </div>
      {children}
    </article>
  );
}
