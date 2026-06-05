"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Copy,
  Crown,
  Database,
  FileText,
  Home,
  LayoutDashboard,
  ListChecks,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import type { ConversationAnalysis, ConversationSource } from "@/lib/flowcrew-types";
import type { StoredLead } from "@/lib/leads";
import { trialDraftStorageKey } from "@/lib/trial-draft";

const manualProHref = "mailto:hello@flowcrew.ai?subject=Richiesta%20accesso%20FlowCrew%20Pro";

const sample = `Ciao, sono Marco di Studio Verde. Vorremmo rifare il sito e forse collegarlo anche a una piccola campagna social, ma non sappiamo ancora bene lo scope. Ci servirebbe qualcosa entro fine mese per presentarlo a un partner. Budget indicativo 800-1.200 euro. Mi dici cosa consigli e quali sono i prossimi passaggi?`;

const loadingSteps = [
  "Jackie sta leggendo il messaggio",
  "Nora sta preparando la proposta",
  "Milo sta valutando il follow-up",
  "Dex sta ordinando i task",
];

type UsageResponse = {
  plan: "free" | "pro" | "team";
  used: number;
  limit: number;
  remaining: number;
  label: string;
};

type IngestResponse = {
  analysis: ConversationAnalysis;
  lead: StoredLead;
  usage?: UsageResponse;
};

type ErrorPayload = {
  error?: string;
  code?: string;
  plan?: UsageResponse["plan"];
  used?: number;
  limit?: number;
  remaining?: number;
  label?: string;
};

type UsageError = {
  code: string;
  message: string;
};

type TrialError = {
  code: string;
  title: string;
  message: string;
  action?: "login" | "retry" | "pro";
};

async function readApiPayload(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();
  const trimmed = text.trim();

  if (!trimmed) {
    return {
      code: "empty_response",
      error: "La risposta del server e vuota.",
    } satisfies ErrorPayload;
  }

  if (contentType.includes("application/json") || trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return JSON.parse(text) as IngestResponse | ErrorPayload;
    } catch {
      return {
        code: "invalid_response",
        error: "La risposta del server non e leggibile.",
      } satisfies ErrorPayload;
    }
  }

  return {
    code: "invalid_response",
    error: "La risposta del server non e leggibile.",
  } satisfies ErrorPayload;
}

const sourceOptions: Array<{ value: ConversationSource; label: string }> = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "gmail", label: "Gmail" },
  { value: "instagram", label: "Instagram" },
  { value: "email", label: "Email" },
  { value: "notes", label: "Note manuali" },
  { value: "other", label: "Altro" },
];

export default function TrialPage() {
  const [clientName, setClientName] = useState("");
  const [sourceType, setSourceType] = useState<ConversationSource>("whatsapp");
  const [businessType, setBusinessType] = useState("Freelance / piccolo team");
  const [goal, setGoal] = useState("Richiesta cliente, priorita, proposta, follow-up e task.");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<IngestResponse | null>(null);
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [usageError, setUsageError] = useState<UsageError | null>(null);
  const [isUsageLoading, setIsUsageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedReply, setCopiedReply] = useState(false);
  const [error, setError] = useState<TrialError | null>(null);

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

  useEffect(() => {
    async function loadUsage() {
      try {
        const response = await fetch("/api/usage", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const payload = (await response.json().catch(() => null)) as (UsageResponse & ErrorPayload) | null;

        if (!response.ok) {
          setUsageError({
            code: payload?.code ?? "usage_unavailable",
            message: payload?.error ?? "Non riesco a leggere il tuo piano in questo momento.",
          });
          return;
        }

        if (!payload || typeof payload.remaining !== "number") {
          setUsageError({
            code: "usage_unavailable",
            message: "Non riesco a leggere il tuo piano in questo momento.",
          });
          return;
        }

        setUsage(payload);
        setUsageError(null);
      } catch {
        setUsageError({
          code: "usage_unavailable",
          message: "Non riesco a leggere il tuo piano in questo momento.",
        });
      } finally {
        setIsUsageLoading(false);
      }
    }

    void loadUsage();
  }, []);

  const generated = Boolean(result);
  const hasReachedLimit = Boolean(usage && usage.remaining <= 0);
  const isWorkspacePlan = Boolean(usage && isPaidWorkspacePlan(usage.plan));
  const workspaceLabel = usage ? getWorkspacePlanLabel(usage.plan) : "Pro";
  const analysis = result?.analysis;
  const lead = result?.lead;
  const isPartialAnalysis = Boolean(analysis?.analysisMeta?.degraded || analysis?.analysisMeta?.status === "partial");
  const friendlyPriority = formatSignal(analysis?.dex.priority ?? lead?.urgency, "Da qualificare");
  const friendlyUrgency = formatSignal(analysis?.nora.urgency ?? lead?.urgency, "Da qualificare");
  const friendlyStatus = formatStatus(analysis?.dex.status ?? lead?.status);
  const leadQuality = formatSignal(analysis?.nora.leadQuality, "Da qualificare");
  const requestSummary = lead?.summary ?? analysis?.jackie.cleanSummary;
  const proposalText =
    analysis?.crewReview?.nora.message ??
    analysis?.nora.why ??
    "La proposta, il rischio e lo scope consigliato compariranno qui dopo l'analisi.";
  const followUpText =
    analysis?.milo.followUp ??
    lead?.follow_up ??
    analysis?.crewReview?.milo.nextCommercialMove ??
    "Il follow-up consigliato comparira qui dopo l'analisi.";
  const handoffText =
    lead?.next_action ??
    analysis?.crewReview?.summary.nextAction ??
    "La prossima azione operativa comparira qui dopo l'analisi.";

  const detectedTags = useMemo(() => {
    if (analysis?.dex.tags.length) return analysis.dex.tags;
    if (lead?.tags?.length) return lead.tags;
    return generated ? ["lead", "da-qualificare"] : [];
  }, [analysis, generated, lead?.tags]);

  const detectedBudget = useMemo(() => {
    const text = `${message} ${lead?.summary ?? ""}`;
    const normalizedEuroMatch = text.match(/(?:€\s?|\bmax\s?)?(\d{2,5})\s?(?:€|euro|eur)?/i);
    const euroMatch = text.match(/(?:€\s?|\bmax\s?)?(\d{2,5})\s?(?:€|euro|eur)?/i);

    if (!generated) return "In attesa";
    if (normalizedEuroMatch) return `Circa ${normalizedEuroMatch[1]} euro`;
    if (!euroMatch) return "Non rilevato";

    return `Circa ${euroMatch[1]} euro`;
  }, [generated, lead?.summary, message]);

  const detectedDeadline = useMemo(() => {
    const text = `${message} ${lead?.summary ?? ""}`.toLowerCase();

    if (!generated) return "In attesa";
    if (text.includes("fine mese")) return "Entro fine mese";
    if (text.includes("domani")) return "Domani";
    if (text.includes("settimana")) return "Questa settimana";

    return "Da chiarire";
  }, [generated, lead?.summary, message]);

  const taskItems = useMemo(() => {
    if (!generated) {
      return [
        "Incolla una richiesta cliente e avvia l'analisi.",
        "FlowCrew la dividera in richiesta, proposta, follow-up e task.",
      ];
    }

    const tasks = [lead?.next_action].filter(Boolean) as string[];

    if (detectedDeadline !== "Da chiarire" && detectedDeadline !== "In attesa") {
      tasks.push("Rispondi velocemente: la richiesta contiene una scadenza.");
    }

    if (detectedBudget !== "Non rilevato" && detectedBudget !== "In attesa") {
      tasks.push("Verifica se il budget copre lo scope richiesto.");
    }

    if (tasks.length === 0) {
      return ["Qualifica il lead e chiedi i dettagli mancanti."];
    }

    return tasks;
  }, [detectedBudget, detectedDeadline, generated, lead?.next_action]);

  async function generateLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage || isLoading) {
      setError(createTrialError("invalid_input"));
      return;
    }

    if (cleanMessage.length < 20) {
      setError(createTrialError("invalid_input_short"));
      return;
    }

    if (hasReachedLimit) {
      setError(createTrialError("quota_exceeded"));
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setCopiedReply(false);

    try {
      const response = await fetch("/api/ingest-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          sourceType,
          messyMessage: cleanMessage,
          businessType,
          goal,
          language: "it",
        }),
      });

      const payload = await readApiPayload(response);

      if (!response.ok) {
        const errorPayload = payload as ErrorPayload;

        if (
          typeof errorPayload.used === "number" &&
          typeof errorPayload.limit === "number" &&
          errorPayload.plan
        ) {
          setUsage({
            plan: errorPayload.plan,
            used: errorPayload.used,
            limit: errorPayload.limit,
            remaining:
              typeof errorPayload.remaining === "number"
                ? errorPayload.remaining
                : Math.max(errorPayload.limit - errorPayload.used, 0),
            label: errorPayload.label ?? getPlanLabel(errorPayload.plan),
          });
        }

        throw createTrialException(getTrialErrorFromPayload(errorPayload, response.status));
      }

      const ingestPayload = payload as IngestResponse;
      if (!isIngestPayload(ingestPayload)) {
        throw createTrialException(createTrialError("invalid_response"));
      }

      setResult(ingestPayload);

      if (ingestPayload.usage) {
        setUsage(ingestPayload.usage);
        setUsageError(null);
      }
    } catch (requestError) {
      setError(getTrialErrorFromException(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  async function copyReply() {
    if (!lead?.suggested_reply) return;

    try {
      await navigator.clipboard.writeText(lead.suggested_reply);
      setCopiedReply(true);
      window.setTimeout(() => setCopiedReply(false), 1800);
    } catch {
      setError(createTrialError("copy_failed"));
    }
  }

  return (
    <AppShell>
      <div className="relative mx-auto max-w-[1440px] overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-[rgba(200,245,66,0.08)] blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] opacity-60 [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,black,transparent)]" />

        <div className="relative space-y-4">
          <header className="rounded-[2rem] border border-white/[0.06] bg-black/30 px-5 py-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--fc-accent)] text-black shadow-[0_0_34px_rgba(200,245,66,0.22)]">
                  <Sparkles aria-hidden="true" className="h-5 w-5" />
                </div>

                <div>
                  <p className="fc-label text-[var(--fc-accent)]">
                    {isWorkspacePlan ? `FlowCrew ${workspaceLabel} workspace` : "FlowCrew trial"}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <h1 className="text-lg font-extrabold tracking-[-0.04em] text-[var(--fc-text)]">
                      {isWorkspacePlan ? "Analizza messaggi cliente" : "Analizza 1 lead gratis"}
                    </h1>

                    {isWorkspacePlan ? (
                      <span className="flow-mono inline-flex items-center gap-1.5 rounded-full border border-[rgba(139,255,197,0.24)] bg-[rgba(139,255,197,0.08)] px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-[var(--fc-mint)]">
                        <Crown aria-hidden="true" className="h-3 w-3" />
                        {workspaceLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flow-mono inline-flex items-center gap-2 rounded-full border border-[rgba(139,255,197,0.18)] bg-[rgba(139,255,197,0.07)] px-4 py-2 text-xs text-[var(--fc-mint)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--fc-mint)]" />
                  {isUsageLoading
                    ? "Controllo piano"
                    : usage
                      ? isWorkspacePlan
                        ? `${workspaceLabel} attivo - ${usage.used}/${usage.limit} lead`
                        : `${usage.label} - ${usage.remaining} rimasti`
                      : usageError
                        ? "Utilizzo non disponibile"
                        : "Account richiesto"}
                </div>

                <Link href="/" className="fc-button">
                  <Home aria-hidden="true" className="h-4 w-4" />
                  Home
                </Link>

                <Link href="/dashboard" className="fc-button">
                  <LayoutDashboard aria-hidden="true" className="h-4 w-4" />
                  Dashboard
                </Link>

                <Link href="/leads" className="fc-button">
                  Leads
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </header>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.72fr)]">
            <div className="space-y-4">
              <section className="rounded-[2rem] border border-white/[0.06] bg-[rgba(14,14,14,0.72)] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8 lg:p-10">
                <div className="max-w-3xl">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--fc-accent)] shadow-[0_0_18px_rgba(200,245,66,0.8)]" />
                    <span className="flow-mono text-xs uppercase tracking-[0.16em] text-[var(--fc-accent)]">
                      {isWorkspacePlan ? `${workspaceLabel} workspace -> output operativo` : "1 lead gratuito -> output operativo"}
                    </span>
                  </div>

                  <h2 className="text-5xl font-extrabold leading-[0.95] tracking-[-0.065em] text-[var(--fc-text)] sm:text-6xl lg:text-7xl">
                    {isWorkspacePlan ? (
                      <>
                        Analizza messaggi cliente
                        <br />
                        nel tuo <span className="flow-serif font-normal italic text-[var(--fc-accent)]">workspace {workspaceLabel}.</span>
                      </>
                    ) : (
                      <>
                        Da messaggio confuso
                        <br />
                        a <span className="flow-serif font-normal italic text-[var(--fc-accent)]">lead strutturato.</span>
                      </>
                    )}
                  </h2>

                  <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--fc-text-muted)] sm:text-lg">
                    {isWorkspacePlan
                      ? "Incolla una richiesta cliente. FlowCrew analizza il messaggio, salva il lead nel workspace e prepara richiesta, proposta, follow-up, task e tag."
                      : "Analizza 1 lead gratis: serve un account per salvare il risultato nel workspace. Incolla un messaggio WhatsApp, Gmail o DM e FlowCrew lo trasforma in richiesta, proposta, follow-up e task."}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {(isWorkspacePlan
                      ? ["Richiesta", "Proposta", "Follow-up", "Task", "Tags"]
                      : ["1 lead gratis", "Account richiesto", "Risposta pronta", "Task", "Tags"]
                    ).map((item) => (
                      <span className="fc-pill fc-pill-success" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              <form
                aria-busy={isLoading}
                className="rounded-[2rem] border border-white/[0.06] bg-[rgba(14,14,14,0.82)] shadow-2xl shadow-black/20 backdrop-blur-xl"
                onSubmit={generateLead}
              >
                <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="fc-label">Input</p>
                      <h3 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[var(--fc-text)]">
                        Messaggio cliente
                      </h3>
                    </div>

                    <button
                      className="inline-flex items-center justify-center rounded-full border border-[rgba(200,245,66,0.2)] bg-[rgba(200,245,66,0.08)] px-4 py-2 text-sm font-bold text-[var(--fc-accent)] transition hover:bg-[rgba(200,245,66,0.14)]"
                      onClick={() => {
                        setMessage(sample);
                        setError(null);
                      }}
                      type="button"
                    >
                      Carica esempio realistico
                    </button>
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Nome cliente">
                      <input
                        className="fc-input"
                        name="clientName"
                        placeholder="Es. Marco Rossi"
                        type="text"
                        value={clientName}
                        onChange={(event) => setClientName(event.target.value)}
                      />
                    </Field>

                    <Field label="Sorgente">
                      <select
                        className="fc-select"
                        name="sourceType"
                        value={sourceType}
                        onChange={(event) => setSourceType(event.target.value as ConversationSource)}
                      >
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
                      <input
                        className="fc-input"
                        name="businessType"
                        placeholder="Es. studio creativo, consulente, agenzia"
                        type="text"
                        value={businessType}
                        onChange={(event) => setBusinessType(event.target.value)}
                      />
                    </Field>

                    <Field label="Obiettivo">
                      <input
                        className="fc-input"
                        name="goal"
                        placeholder="Cosa vuoi ottenere dall'analisi"
                        type="text"
                        value={goal}
                        onChange={(event) => setGoal(event.target.value)}
                      />
                    </Field>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[var(--fc-text)]" htmlFor="client-conversation">
                      Conversazione
                    </label>

                    <div className="mt-2 overflow-hidden rounded-3xl border border-white/[0.08] bg-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus-within:border-[rgba(200,245,66,0.36)]">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--fc-text-soft)]">
                          Incolla qui un messaggio WhatsApp, Gmail o DM di un cliente
                        </p>
                        <span className="flow-mono text-[11px] text-[var(--fc-text-soft)]">
                          {message.trim().length} caratteri
                        </span>
                      </div>

                      <textarea
                        className="min-h-[21rem] w-full resize-y border-0 bg-transparent px-4 py-4 text-base leading-7 text-[var(--fc-text)] outline-none placeholder:text-[var(--fc-text-soft)]"
                        id="client-conversation"
                        name="messyMessage"
                        onChange={(event) => {
                          setMessage(event.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="Esempio: Ciao, avremmo bisogno di capire se puoi aiutarci con un sito e magari anche una campagna..."
                        value={message}
                      />
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">
                      Dopo il click FlowCrew legge la richiesta, stima priorita e chiarezza, prepara una proposta, suggerisce il follow-up e ordina i task operativi.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || isUsageLoading || !message.trim() || hasReachedLimit}
                    className="fc-button fc-button-primary w-full py-4 text-base"
                  >
                    {isLoading ? (
                      <>
                        <span aria-hidden="true" className="relative flex h-5 w-5 items-center justify-center">
                          <span className="absolute h-5 w-5 animate-ping rounded-full bg-black/25" />
                          <span className="h-2.5 w-2.5 rounded-full bg-black" />
                        </span>
                        Analisi in corso
                      </>
                    ) : (
                      <>
                        {isUsageLoading
                          ? "Controllo piano..."
                          : hasReachedLimit
                            ? getLimitButtonLabel(usage)
                            : isWorkspacePlan
                              ? "Analizza e salva nel workspace"
                              : "Analizza questo lead"}
                        <ArrowRight aria-hidden="true" className="h-5 w-5" />
                      </>
                    )}
                  </button>

                  {isLoading ? (
                    <LoadingProgress />
                  ) : null}

                  {error ? (
                    <ErrorCallout error={error} />
                  ) : null}

                  {lead ? (
                    <div aria-live="polite" className="rounded-3xl border border-[rgba(139,255,197,0.22)] bg-[rgba(139,255,197,0.08)] p-4 text-sm font-bold text-[var(--fc-mint)]" role="status">
                      <div className="flex items-center gap-2">
                        <Database aria-hidden="true" className="h-5 w-5" />
                        Lead salvato nel workspace <span className="flow-mono text-xs">{lead.id.slice(0, 8)}</span>
                      </div>

                      <p className="mt-2 text-xs font-medium leading-5 text-[var(--fc-text-muted)]">
                        {isWorkspacePlan
                          ? `Lead aggiunto allo storico ${workspaceLabel}. Puoi ritrovarlo in dashboard e inbox.`
                          : "Risultato salvato: puoi copiarlo ora o passare a Pro per continuare con altri lead."}
                      </p>
                    </div>
                  ) : null}
                </div>
              </form>
            </div>

            <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
              <section className="rounded-[2rem] border border-white/[0.06] bg-[rgba(14,14,14,0.86)] shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="fc-label">Output</p>
                      <h3 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[var(--fc-text)]">
                        Brief operativo
                      </h3>
                    </div>

                    <span className={`flow-mono rounded-full px-3 py-1 text-xs ${generated ? "bg-[rgba(139,255,197,0.08)] text-[var(--fc-mint)]" : "bg-white/[0.04] text-[var(--fc-text-soft)]"}`}>
                      {generated ? "Completato" : "In attesa"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  {isPartialAnalysis ? <PartialAnalysisNotice /> : null}

                  <AgentOutputCard
                    active={generated}
                    agent="Jackie"
                    color="lime"
                    icon={<ClipboardList className="h-4 w-4" />}
                    label="Richiesta"
                    title="Richiesta cliente"
                  >
                    <p className="text-sm leading-6 text-[var(--fc-text-muted)]">
                      {requestSummary ?? "Il riassunto chiaro della richiesta cliente comparira qui."}
                    </p>

                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      <CompactSignal label="Priorita" value={generated ? friendlyPriority : "In attesa"} />
                      <CompactSignal label="Urgenza" value={generated ? friendlyUrgency : "In attesa"} />
                      <CompactSignal label="Chiarezza" value={generated ? leadQuality : "In attesa"} />
                    </div>
                  </AgentOutputCard>

                  <AgentOutputCard
                    active={generated}
                    agent="Nora"
                    color="orange"
                    icon={<FileText className="h-4 w-4" />}
                    label="Proposta"
                    title="Proposta, range e scope"
                  >
                    <p className="text-sm leading-6 text-[var(--fc-text-muted)]">
                      {generated ? proposalText : "Nora mostrera proposta consigliata, range economico rilevato e punti da chiarire prima di vendere."}
                    </p>

                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      <CompactSignal label="Range" value={detectedBudget} />
                      <CompactSignal label="Deadline" value={detectedDeadline} />
                      <CompactSignal label="Scope" value={generated ? formatSignal(analysis?.nora.riskLevel, "Da chiarire") : "In attesa"} />
                    </div>
                  </AgentOutputCard>

                  <AgentOutputCard
                    active={generated}
                    agent="Milo"
                    color="mint"
                    icon={<MessageSquareText className="h-4 w-4" />}
                    label="Follow-up"
                    title="Risposta e quando rispondere"
                  >
                    <p className="mb-3 text-sm leading-6 text-[var(--fc-text-muted)]">
                      {generated ? followUpText : "Milo suggerira tono, follow-up e momento di risposta."}
                    </p>

                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--fc-text-muted)]">
                        {lead?.suggested_reply ?? "La risposta pronta da approvare comparira qui dopo l'analisi."}
                      </p>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <CompactSignal label="Tono" value={generated ? formatSignal(analysis?.crewReview?.summary.temperature, "Professionale") : "In attesa"} />
                      <CompactSignal label="Quando" value={generated ? (friendlyUrgency === "Alta" ? "Oggi" : "Prossimo slot utile") : "In attesa"} />
                    </div>

                    <button
                      type="button"
                      disabled={!lead?.suggested_reply}
                      onClick={copyReply}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm font-bold text-[var(--fc-text)] transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      {copiedReply ? (
                        <>
                          <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[var(--fc-mint)]" />
                          Copiata
                        </>
                      ) : (
                        <>
                          <Copy aria-hidden="true" className="h-4 w-4" />
                          Copia risposta
                        </>
                      )}
                    </button>
                  </AgentOutputCard>

                  <AgentOutputCard
                    active={generated}
                    agent="Dex"
                    color="purple"
                    icon={<ListChecks className="h-4 w-4" />}
                    label="Handoff"
                    title="Task, tag e handoff operativo"
                  >
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                      <p className="text-sm font-bold text-[var(--fc-text)]">Prossima azione</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--fc-text-muted)]">
                        {generated ? handoffText : "Dex trasformera l'analisi in task, tag e handoff operativo."}
                      </p>
                    </div>

                    <ul className="mt-4 space-y-2">
                      {taskItems.map((task) => (
                        <li className="flex gap-2 text-sm leading-6 text-[var(--fc-text-muted)]" key={task}>
                          <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[var(--fc-accent)]" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {detectedTags.length ? (
                        detectedTags.map((tag) => (
                          <span className="fc-pill" key={tag}>
                            {formatTag(tag)}
                          </span>
                        ))
                      ) : (
                        <span className="fc-pill">Tag in attesa</span>
                      )}
                    </div>
                  </AgentOutputCard>
                </div>
              </section>

              <UsageCard
                hasReachedLimit={hasReachedLimit}
                isUsageLoading={isUsageLoading}
                usageError={usageError}
                usage={usage}
              />

              <AIDiagnosticCard
                analysis={analysis}
                detectedBudget={detectedBudget}
                detectedDeadline={detectedDeadline}
                detectedTags={detectedTags}
                generated={generated}
                lead={lead}
              />

              <section className="rounded-[2rem] border border-white/[0.06] bg-[rgba(14,14,14,0.76)] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl border border-[rgba(200,245,66,0.18)] bg-[rgba(200,245,66,0.07)] text-[var(--fc-accent)]">
                    <Zap aria-hidden="true" className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="fc-label">Segnali lead</p>
                    <h3 className="text-lg font-extrabold tracking-[-0.04em] text-[var(--fc-text)]">
                      Segnali rilevati
                    </h3>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <SignalCard label="Urgenza" value={generated ? friendlyUrgency : "In attesa"} />
                  <SignalCard label="Budget" value={detectedBudget} />
                  <SignalCard label="Deadline" value={detectedDeadline} />
                  <SignalCard label="Status" value={generated ? friendlyStatus : "In attesa"} />
                </div>
              </section>

              {generated ? (
                <section className="rounded-[2rem] border border-[rgba(200,245,66,0.16)] bg-[rgba(200,245,66,0.06)] p-5 shadow-2xl shadow-black/20 sm:p-6">
                  <p className="fc-label text-[var(--fc-accent)]">
                    {isWorkspacePlan ? `${workspaceLabel} workflow` : "Prossimo passo"}
                  </p>

                  <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.05em] text-[var(--fc-text)]">
                    {isWorkspacePlan
                      ? "Lead salvato. Continua dal workspace."
                      : "Vuoi analizzare altri lead e salvare lo storico?"}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">
                    {isWorkspacePlan
                      ? "Apri la dashboard per vedere priorita e follow-up, oppure entra nell'inbox per lavorare sul dettaglio del lead."
                      : "Con FlowCrew Pro puoi gestire piu richieste, mantenere una dashboard clienti, personalizzare il tono delle risposte e usare modelli AI migliori."}
                  </p>

                  <div className="mt-5 grid gap-2">
                    {isWorkspacePlan ? (
                      <>
                        <Link href="/dashboard" className="fc-button fc-button-primary">
                          Apri dashboard
                          <ArrowRight aria-hidden="true" className="h-4 w-4" />
                        </Link>

                        <Link href="/leads" className="fc-button">
                          Vai ai lead
                        </Link>
                      </>
                    ) : (
                      <>
                        <a href={manualProHref} className="fc-button fc-button-primary">
                          Richiedi accesso Pro
                          <ArrowRight aria-hidden="true" className="h-4 w-4" />
                        </a>

                        <Link href="/dashboard" className="fc-button">
                          Vai alla dashboard
                        </Link>
                      </>
                    )}
                  </div>
                </section>
              ) : (
                <section className="rounded-[2rem] border border-white/[0.06] bg-white/[0.025] p-5 shadow-2xl shadow-black/20 sm:p-6">
                  <p className="fc-label">{isWorkspacePlan ? "Nel workspace" : "Cosa ottieni"}</p>

                  <div className="mt-4 space-y-3">
                    {(isWorkspacePlan
                      ? ["Lead salvati nello storico", "Dashboard con priorita e follow-up", "Risposta pronta da copiare", "Tag e prossima azione"]
                      : ["Riassunto chiaro della richiesta", "Task e prossima azione", "Risposta pronta da copiare", "Tag e priorita del lead"]
                    ).map((item) => (
                      <div className="flex gap-2 text-sm text-[var(--fc-text-muted)]" key={item}>
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--fc-accent)]" />
                        {item}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </aside>
          </section>
        </div>
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

function LoadingProgress() {
  return (
    <div aria-live="polite" className="rounded-3xl border border-[rgba(200,245,66,0.16)] bg-[rgba(200,245,66,0.06)] p-5" role="status">
      <div className="flex items-center gap-2 text-sm font-bold text-[var(--fc-accent)]">
        <ShieldCheck aria-hidden="true" className="h-4 w-4" />
        Analisi in corso
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {loadingSteps.map((step, index) => (
          <p className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-black/20 px-3 py-2 text-xs font-medium text-[var(--fc-text-muted)]" key={step}>
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--fc-accent)]"
              style={{ animationDelay: `${index * 160}ms` }}
            />
            {step}
          </p>
        ))}
      </div>
    </div>
  );
}

function ErrorCallout({ error }: { error: TrialError }) {
  return (
    <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-4 text-sm leading-6 text-red-100" role="alert">
      <div className="flex gap-3">
        <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-extrabold text-white">{error.title}</p>
          <p className="mt-1 font-medium">{error.message}</p>
        </div>
      </div>

      {error.action ? (
        <div className="mt-4 flex flex-wrap gap-2 pl-8">
          {error.action === "login" ? (
            <Link href="/login" className="fc-button fc-button-primary">
              Accedi
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          ) : null}

          {error.action === "pro" ? (
            <a href={manualProHref} className="fc-button fc-button-primary">
              Richiedi accesso Pro
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          ) : null}

          {error.action === "retry" ? (
            <button type="submit" className="fc-button">
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              Riprova
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function PartialAnalysisNotice() {
  return (
    <div className="rounded-3xl border border-[rgba(255,196,87,0.22)] bg-[rgba(255,196,87,0.08)] p-4 text-sm leading-6 text-[#ffd79a]">
      <div className="flex gap-3">
        <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-extrabold text-white">Analisi parziale</p>
          <p className="mt-1 text-[var(--fc-text-muted)]">
            FlowCrew ha salvato il miglior risultato disponibile, ma una parte dell'analisi e stata ricostruita. Controlla i dettagli prima di inviare la risposta.
          </p>
        </div>
      </div>
    </div>
  );
}

function CompactSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-3 py-2">
      <p className="flow-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fc-text-soft)]">
        {label}
      </p>
      <p className="mt-1 text-xs font-extrabold text-[var(--fc-text)]">
        {value}
      </p>
    </div>
  );
}

function AIDiagnosticCard({
  analysis,
  lead,
  generated,
  detectedBudget,
  detectedDeadline,
  detectedTags,
}: {
  analysis: ConversationAnalysis | undefined;
  lead: StoredLead | undefined;
  generated: boolean;
  detectedBudget: string;
  detectedDeadline: string;
  detectedTags: string[];
}) {
  const missingInfo = analysis?.jackie.missingInfo.filter(Boolean).slice(0, 2).join(" - ");
  const nextSteps = analysis?.nora.nextSteps.filter(Boolean).slice(0, 2).join(" - ");

  const diagnosticRows = [
    {
      label: "Contesto",
      title: "Cosa sta chiedendo il cliente",
      value: generated
        ? lead?.summary ?? analysis?.jackie.cleanSummary ?? "Richiesta sintetizzata"
        : "L'AI separa rumore, richiesta, vincoli e dettagli utili.",
    },
    {
      label: "Decisione",
      title: "Quanto va seguito subito",
      value: generated
        ? `${lead?.urgency ?? analysis?.nora.urgency ?? "Media"} - ${analysis?.nora.leadQuality ?? "lead da qualificare"}`
        : "Urgenza, qualita lead e rischio vengono stimati prima della risposta.",
    },
    {
      label: "Mancanti",
      title: "Cosa chiedere prima di vendere",
      value: generated
        ? missingInfo || "Nessun dato critico mancante rilevato."
        : "Scope, budget, deadline e decision maker diventano domande chiare.",
    },
    {
      label: "Output",
      title: "Cosa finisce nel workspace",
      value: generated
        ? `${detectedTags.slice(0, 3).join(", ")} - ${detectedBudget} - ${detectedDeadline}`
        : "Tag, status, prossima azione e risposta pronta sono salvati sul lead.",
    },
  ];

  return (
    <section className="rounded-[2rem] border border-[rgba(200,245,66,0.14)] bg-[rgba(200,245,66,0.045)] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[rgba(200,245,66,0.2)] bg-[rgba(200,245,66,0.08)] text-[var(--fc-accent)]">
          <Sparkles aria-hidden="true" className="h-4 w-4" />
        </span>

        <div>
          <p className="fc-label text-[var(--fc-accent)]">Lettura AI</p>
          <h3 className="mt-1 text-xl font-extrabold tracking-[-0.04em] text-[var(--fc-text)]">
            Come FlowCrew legge il lead
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--fc-text-muted)]">
            Il valore non e solo la risposta pronta: e la diagnosi che trasforma una chat in lavoro gestibile.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {diagnosticRows.map((row) => (
          <article className="rounded-2xl border border-white/[0.06] bg-[#0e0e0e]/70 p-4" key={row.label}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flow-mono text-xs uppercase tracking-[0.12em] text-[var(--fc-accent)]">
                {row.label}
              </p>
              <span className={`flow-mono rounded-full px-2 py-0.5 text-[11px] ${generated ? "bg-[rgba(139,255,197,0.08)] text-[var(--fc-mint)]" : "bg-white/[0.04] text-[var(--fc-text-soft)]"}`}>
                {generated ? "calcolato" : "in attesa"}
              </span>
            </div>

            <h4 className="mt-2 text-sm font-extrabold tracking-[-0.025em] text-[var(--fc-text)]">
              {row.title}
            </h4>
            <p className="mt-2 line-clamp-3 text-xs leading-5 text-[var(--fc-text-muted)]">
              {row.value}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
        <p className="flow-mono text-xs uppercase tracking-[0.12em] text-[var(--fc-text-soft)]">
          Guardrail prodotto
        </p>
        <div className="mt-3 grid gap-2 text-xs leading-5 text-[var(--fc-text-muted)]">
          {[
            "Nessun invio automatico al cliente.",
            "Il messaggio originale resta salvato sul lead.",
            nextSteps ? `Prossime azioni: ${nextSteps}` : "Task e follow-up restano approvabili da te.",
          ].map((item) => (
            <p className="flex gap-2" key={item}>
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--fc-accent)]" />
              <span>{item}</span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function UsageCard({
  usage,
  isUsageLoading,
  hasReachedLimit,
  usageError,
}: {
  usage: UsageResponse | null;
  isUsageLoading: boolean;
  hasReachedLimit: boolean;
  usageError: UsageError | null;
}) {
  const progress = usage ? Math.min((usage.used / Math.max(usage.limit, 1)) * 100, 100) : 0;
  const isWorkspace = Boolean(usage && isPaidWorkspacePlan(usage.plan));
  const workspaceLabel = usage ? getWorkspacePlanLabel(usage.plan) : "Pro";
  const title = isUsageLoading
    ? "Controllo piano..."
    : usageError
      ? "Piano non disponibile"
      : isWorkspace
        ? `${workspaceLabel} attivo`
        : usage?.remaining === 0
          ? "Lead gratuito usato"
          : "Lead gratuito disponibile";
  const status = isUsageLoading
    ? "Verifica"
    : usageError
      ? "Da verificare"
      : hasReachedLimit
        ? "Terminato"
        : isWorkspace
          ? `${workspaceLabel} attivo`
          : "Disponibile";

  return (
    <section className="rounded-[2rem] border border-white/[0.06] bg-[rgba(14,14,14,0.76)] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="fc-label">Piano attuale</p>
          <h3 className="mt-1 text-xl font-extrabold tracking-[-0.04em] text-[var(--fc-text)]">
            {title}
          </h3>
        </div>

        <span
          className={`flow-mono rounded-full px-3 py-1 text-xs ${
            hasReachedLimit || usageError
              ? "border border-red-400/20 bg-red-400/10 text-red-100"
              : "border border-[rgba(139,255,197,0.18)] bg-[rgba(139,255,197,0.07)] text-[var(--fc-mint)]"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-[var(--fc-text-muted)]">Lead usati</span>
          <span className="flow-mono font-bold text-[var(--fc-text)]">
            {usage ? `${usage.used} / ${usage.limit}` : "-"}
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-[var(--fc-accent)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-[var(--fc-text-muted)]">
          {usageError
            ? getUsageErrorMessage(usageError)
            : usage
              ? isWorkspace
                ? `${usage.remaining} analisi disponibili in questo periodo.`
                : usage.remaining > 0
                  ? "Puoi analizzare 1 lead gratis. Per continuare dopo il primo risultato serve accesso Pro."
                  : "Hai usato il tuo lead gratuito. Passa a Pro per continuare."
              : "Accedi per verificare il tuo lead gratuito e salvare il risultato nel workspace."}
        </p>
      </div>

      {hasReachedLimit && !isWorkspace ? (
        <a href={manualProHref} className="fc-button fc-button-primary mt-4 w-full">
          Richiedi accesso Pro
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      ) : null}
    </section>
  );
}

function AgentOutputCard({
  icon,
  agent,
  label,
  title,
  color,
  active,
  children,
}: {
  icon: ReactNode;
  agent: string;
  label: string;
  title: string;
  color: "lime" | "mint" | "orange" | "purple";
  active: boolean;
  children: ReactNode;
}) {
  const colorClasses = {
    lime: "border-[rgba(200,245,66,0.14)] bg-[rgba(200,245,66,0.045)] text-[var(--fc-accent)]",
    mint: "border-[rgba(139,255,197,0.14)] bg-[rgba(139,255,197,0.045)] text-[var(--fc-mint)]",
    orange: "border-[rgba(255,154,92,0.14)] bg-[rgba(255,154,92,0.045)] text-[#ff9a5c]",
    purple: "border-[rgba(192,132,252,0.14)] bg-[rgba(192,132,252,0.045)] text-[#c084fc]",
  };

  return (
    <article className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:bg-white/[0.035]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl border ${colorClasses[color]}`}>
            {icon}
          </span>

          <div>
            <p className="flow-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fc-text-soft)]">
              {agent} - {label}
            </p>

            <h4 className="mt-1 text-base font-extrabold tracking-[-0.035em] text-[var(--fc-text)]">
              {title}
            </h4>
          </div>
        </div>

        <span className={`flow-mono rounded-full px-2 py-0.5 text-[11px] ${active ? "bg-[rgba(139,255,197,0.08)] text-[var(--fc-mint)]" : "bg-white/[0.04] text-[var(--fc-text-soft)]"}`}>
          {active ? "Pronto" : "In attesa"}
        </span>
      </div>

      {children}
    </article>
  );
}

function SignalCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
      <p className="flow-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fc-text-soft)]">
        {label}
      </p>

      <p className="mt-2 text-sm font-extrabold text-[var(--fc-text)]">
        {value}
      </p>
    </div>
  );
}

function isIngestPayload(payload: IngestResponse | ErrorPayload): payload is IngestResponse {
  return Boolean(
    payload &&
      typeof payload === "object" &&
      "analysis" in payload &&
      "lead" in payload &&
      payload.analysis &&
      payload.lead,
  );
}

function createTrialException(error: TrialError) {
  const exception = new Error(error.message) as Error & { trialError?: TrialError };
  exception.trialError = error;
  return exception;
}

function getTrialErrorFromException(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "trialError" in error &&
    (error as { trialError?: TrialError }).trialError
  ) {
    return (error as { trialError: TrialError }).trialError;
  }

  return createTrialError("generic");
}

function getTrialErrorFromPayload(payload: ErrorPayload, status: number) {
  const code = payload.code ?? "";

  if (status === 401 || code === "auth_required") return createTrialError("auth_required");

  if (status === 403 || code === "quota_exceeded" || code === "plan_limit_reached") {
    return createTrialError("quota_exceeded");
  }

  if (code === "supabase_unconfigured") return createTrialError("supabase_unconfigured");
  if (code === "usage_unavailable") return createTrialError("usage_unavailable");
  if (code === "invalid_input" || code === "invalid_request" || code === "invalid_json") {
    return createTrialError("invalid_input");
  }

  if (status === 429 || code === "rate_limited" || code === "gemini_rate_limited") {
    return createTrialError("rate_limited");
  }

  if (code.includes("ai") || code.includes("gemini") || code === "invalid_response") {
    return createTrialError("ai_unavailable");
  }

  return createTrialError("generic");
}

function createTrialError(code: string): TrialError {
  switch (code) {
    case "auth_required":
      return {
        code,
        title: "Accedi per analizzare il lead",
        message: "FlowCrew deve collegare il risultato al tuo workspace prima di salvarlo.",
        action: "login",
      };
    case "usage_unavailable":
      return {
        code,
        title: "Non riesco a verificare il piano",
        message: "Riprova tra poco: non voglio consumare o salvare un lead senza conoscere il tuo limite.",
        action: "retry",
      };
    case "quota_exceeded":
      return {
        code,
        title: "Hai usato il tuo lead gratuito",
        message: "Passa a Pro per continuare ad analizzare messaggi cliente e mantenere lo storico.",
        action: "pro",
      };
    case "supabase_unconfigured":
      return {
        code,
        title: "Workspace non disponibile",
        message: "In questo ambiente l'area account non e pronta. Puoi riprovare quando il workspace e configurato.",
      };
    case "invalid_input_short":
      return {
        code,
        title: "Messaggio troppo breve",
        message: "Incolla qualche dettaglio in piu: richiesta, obiettivo, budget, deadline o contesto cliente.",
      };
    case "invalid_input":
      return {
        code,
        title: "Aggiungi un messaggio cliente",
        message: "Incolla una chat, una mail o un DM reale prima di avviare l'analisi.",
      };
    case "rate_limited":
      return {
        code,
        title: "Analisi temporaneamente non disponibile",
        message: "Il motore AI e sotto carico. Aspetta qualche secondo e riprova.",
        action: "retry",
      };
    case "ai_unavailable":
    case "invalid_response":
    case "empty_response":
      return {
        code,
        title: "Non sono riuscito a completare l'analisi",
        message: "Il messaggio non e stato salvato come risultato valido. Riprova tra poco.",
        action: "retry",
      };
    case "copy_failed":
      return {
        code,
        title: "Copia non riuscita",
        message: "Puoi selezionare manualmente la risposta dalla card Milo.",
      };
    default:
      return {
        code: "generic",
        title: "Qualcosa non ha funzionato",
        message: "Riprova tra poco. Se il problema continua, richiedi supporto Pro.",
        action: "retry",
      };
  }
}

function getUsageErrorMessage(error: UsageError) {
  if (error.code === "auth_required") {
    return "Accedi per verificare il lead gratuito e salvare il risultato nel workspace.";
  }

  if (error.code === "supabase_unconfigured") {
    return "Il workspace non e disponibile in questo ambiente.";
  }

  return error.message || "Utilizzo non disponibile in questo momento.";
}

function formatSignal(value: string | null | undefined, fallback: string) {
  const normalized = value?.trim();
  if (!normalized) return fallback;

  const lower = normalized.toLowerCase();
  const labels: Record<string, string> = {
    high: "Alta",
    medium: "Media",
    low: "Bassa",
    hot: "Caldo",
    warm: "Tiepido",
    cold: "Freddo",
    urgent: "Urgente",
    unclear: "Da chiarire",
    clear: "Chiaro",
    qualified: "Qualificato",
    "needs-qualification": "Da qualificare",
    needs_qualification: "Da qualificare",
  };

  return labels[lower] ?? toDisplayLabel(normalized);
}

function formatStatus(value: string | null | undefined) {
  const normalized = value?.trim();
  if (!normalized) return "Da qualificare";

  const labels: Record<string, string> = {
    new: "Nuovo",
    needs_qualification: "Da qualificare",
    waiting_reply: "In attesa risposta",
    follow_up: "Follow-up",
    qualified: "Qualificato",
    closed: "Chiuso",
  };

  return labels[normalized.toLowerCase()] ?? toDisplayLabel(normalized);
}

function formatTag(tag: string) {
  return toDisplayLabel(tag).toLowerCase();
}

function toDisplayLabel(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getPlanLabel(plan: UsageResponse["plan"]) {
  if (plan === "pro") return "Pro";
  if (plan === "team") return "Team";
  return "Free";
}

function isPaidWorkspacePlan(plan: UsageResponse["plan"]) {
  return plan === "pro" || plan === "team";
}

function getWorkspacePlanLabel(plan: UsageResponse["plan"]) {
  if (plan === "team") return "Team";
  if (plan === "pro") return "Pro";
  return "Free";
}

function getLimitButtonLabel(usage: UsageResponse | null) {
  if (usage && isPaidWorkspacePlan(usage.plan)) return "Capacita del periodo esaurita";

  return "Lead gratuito gia usato";
}
