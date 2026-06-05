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
  Home,
  LayoutDashboard,
  LoaderCircle,
  MessageSquareText,
  Sparkles,
  Tags,
  Zap,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import type { ConversationAnalysis, ConversationSource } from "@/lib/flowcrew-types";
import type { StoredLead } from "@/lib/leads";
import { trialDraftStorageKey } from "@/lib/trial-draft";

const manualProHref = "mailto:hello@flowcrew.ai?subject=Richiesta%20accesso%20FlowCrew%20Pro";

const sample = `ciao, io e mio fratello dobbiamo fare una cosa per il negozio... si voglio dire un sito, ma magari anche la gestione social? non lo so ancora bene. comunque ci serviva entro fine mese tipo. ah, e non abbiamo budget enorme, max 800 euro forse. dimmi tu`;

const loadingSteps = [
  "Jackie sta capendo cosa vuole il cliente",
  "Milo sta cercando task, urgenze e prossimi passi",
  "Nora sta preparando una risposta pronta",
  "Dex sta assegnando tag e contesto",
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
async function readApiPayload(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as IngestResponse | ErrorPayload;
    } catch {
      throw new Error("L'API ha risposto con JSON non valido. Controlla il terminale Next.js.");
    }
  }

  if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
    throw new Error(
      "L'API ha restituito una pagina HTML invece di JSON. Controlla il terminale Next.js: probabilmente /api/ingest-message sta andando in errore.",
    );
  }

  throw new Error(text || "Risposta API non valida.");
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
  const [clientName, setClientName] = useState("Cliente demo");
  const [sourceType, setSourceType] = useState<ConversationSource>("whatsapp");
  const [businessType, setBusinessType] = useState("Freelance / piccolo team");
  const [goal, setGoal] = useState("Riassunto, priorita, task, tag e risposta pronta.");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<IngestResponse | null>(null);
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [isUsageLoading, setIsUsageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedReply, setCopiedReply] = useState(false);
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

  useEffect(() => {
    async function loadUsage() {
      try {
        const response = await fetch("/api/usage", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) return;

        const payload = (await response.json()) as UsageResponse;
        setUsage(payload);
      } catch {
        // Usage info is helpful, but the trial page can still render without it.
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

  const detectedTags = useMemo(() => {
    if (analysis?.dex.tags.length) return analysis.dex.tags;
    return generated ? ["lead-caldo", "sito-web", "scadenza-urgente", "budget-limitato"] : ["lead", "task", "reply"];
  }, [analysis, generated]);

  const detectedBudget = useMemo(() => {
    const text = `${message} ${lead?.summary ?? ""}`;
    const euroMatch = text.match(/(?:€\s?|\bmax\s?)?(\d{2,5})\s?(?:€|euro|eur)?/i);

    if (!generated) return "In attesa";
    if (!euroMatch) return "Non rilevato";

    return `Circa ${euroMatch[1]}€`;
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
        "FlowCrew la dividerà in summary, task, risposta e tag.",
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

    if (!message.trim() || isLoading) {
      setError("Incolla un messaggio cliente prima di avviare l'analisi.");
      return;
    }

    if (hasReachedLimit) {
      setError(getLimitErrorMessage(usage));
      return;
    }

    setIsLoading(true);
    setError(null);
    setCopiedReply(false);

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
            remaining: Math.max(errorPayload.limit - errorPayload.used, 0),
            label: errorPayload.label ?? getPlanLabel(errorPayload.plan),
          });
        }

        if (response.status === 401) {
          throw new Error("Accedi per salvare un lead nel tuo workspace.");
        }

        throw new Error(
          errorPayload.error ??
            "Non siamo riusciti ad analizzare il messaggio. Riprova tra poco.",
        );
      }

      const ingestPayload = payload as IngestResponse;
      setResult(ingestPayload);

      if (ingestPayload.usage) {
        setUsage(ingestPayload.usage);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Errore sconosciuto.");
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
      setError("Non sono riuscito a copiare la risposta. Puoi selezionarla manualmente.");
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
                    {isWorkspacePlan ? `FlowCrew ${workspaceLabel} workspace` : "FlowCrew free trial"}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <h1 className="text-lg font-extrabold tracking-[-0.04em] text-[var(--fc-text)]">
                      {isWorkspacePlan ? "Analizza messaggi cliente" : "Analizza un lead gratis"}
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
                      : "1 lead gratuito"}
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
                      {isWorkspacePlan ? `${workspaceLabel} workspace -> output operativo` : "Messaggio sporco -> output operativo"}
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
                        Trasforma un messaggio
                        <br />
                        in un <span className="flow-serif font-normal italic text-[var(--fc-accent)]">piano d’azione.</span>
                      </>
                    )}
                  </h2>

                  <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--fc-text-muted)] sm:text-lg">
                    {isWorkspacePlan
                      ? "Incolla una richiesta cliente. FlowCrew analizza il messaggio, salva il lead nel workspace e prepara summary, task, priorita, tag e risposta pronta."
                      : "Incolla una richiesta confusa di un cliente. FlowCrew ti restituisce summary, task, priorità, tag e una risposta pronta da copiare."}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {(isWorkspacePlan
                      ? ["Summary", "Task", "Workspace", "Risposta", "Tags"]
                      : ["Summary", "Task", "Priorità", "Risposta", "Tags"]
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
                      Usa esempio
                    </button>
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Nome cliente">
                      <input
                        className="fc-input"
                        name="clientName"
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
                        type="text"
                        value={businessType}
                        onChange={(event) => setBusinessType(event.target.value)}
                      />
                    </Field>

                    <Field label="Obiettivo">
                      <input
                        className="fc-input"
                        name="goal"
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

                    <textarea
                      className="fc-textarea mt-2 min-h-[21rem] text-base leading-7"
                      id="client-conversation"
                      name="messyMessage"
                      onChange={(event) => {
                        setMessage(event.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Incolla qui una chat WhatsApp, una mail o una richiesta confusa..."
                      value={message}
                    />

                    <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">
                      Non devi preparare nulla. Incolla il messaggio così com’è: anche se è scritto male, incompleto o pieno di dettagli sparsi.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || isUsageLoading || !message.trim() || hasReachedLimit}
                    className="fc-button fc-button-primary w-full py-4 text-base"
                  >
                    {isLoading ? (
                      <>
                        <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
                        La crew sta lavorando...
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
                    <div aria-live="polite" className="rounded-3xl border border-[rgba(200,245,66,0.16)] bg-[rgba(200,245,66,0.06)] p-5" role="status">
                      <div className="flex items-center gap-2 text-sm font-bold text-[var(--fc-accent)]">
                        <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                        Analisi in corso
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {loadingSteps.map((step) => (
                          <p className="flex items-center gap-2 text-xs font-medium text-[var(--fc-text-muted)]" key={step}>
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--fc-accent)]" />
                            {step}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {error ? (
                    <div className="flex gap-3 rounded-3xl border border-red-400/20 bg-red-400/10 p-4 text-sm font-medium leading-6 text-red-100" role="alert">
                      <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
                      {error}
                    </div>
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
                          : "Questo è il tipo di output che puoi ottenere per ogni cliente con FlowCrew."}
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
                      {generated ? "Ready" : "Idle"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <AgentOutputCard
                    active={generated}
                    agent="Jackie"
                    color="lime"
                    icon={<ClipboardList className="h-4 w-4" />}
                    label="Summary"
                    title="Cosa vuole il cliente"
                  >
                    <p className="text-sm leading-6 text-[var(--fc-text-muted)]">
                      {lead?.summary ?? "Il riassunto chiaro della richiesta cliente comparirà qui."}
                    </p>
                  </AgentOutputCard>

                  <AgentOutputCard
                    active={generated}
                    agent="Milo"
                    color="mint"
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    label="Tasks"
                    title="Prossime azioni"
                  >
                    <ul className="space-y-2">
                      {taskItems.map((task) => (
                        <li className="flex gap-2 text-sm leading-6 text-[var(--fc-text-muted)]" key={task}>
                          <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[var(--fc-accent)]" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </AgentOutputCard>

                  <AgentOutputCard
                    active={generated}
                    agent="Nora"
                    color="orange"
                    icon={<MessageSquareText className="h-4 w-4" />}
                    label="Reply"
                    title="Risposta pronta"
                  >
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--fc-text-muted)]">
                        {lead?.suggested_reply ?? "La risposta pronta da approvare comparirà qui dopo l'analisi."}
                      </p>
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
                    icon={<Tags className="h-4 w-4" />}
                    label="Tags"
                    title="Classificazione"
                  >
                    <div className="flex flex-wrap gap-2">
                      {detectedTags.map((tag) => (
                        <span className="fc-pill" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </AgentOutputCard>
                </div>
              </section>

              <UsageCard
                hasReachedLimit={hasReachedLimit}
                isUsageLoading={isUsageLoading}
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
                    <p className="fc-label">Priority scan</p>
                    <h3 className="text-lg font-extrabold tracking-[-0.04em] text-[var(--fc-text)]">
                      Segnali rilevati
                    </h3>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <SignalCard label="Urgenza" value={generated ? lead?.urgency ?? "Media" : "In attesa"} />
                  <SignalCard label="Budget" value={detectedBudget} />
                  <SignalCard label="Deadline" value={detectedDeadline} />
                  <SignalCard label="Status" value={generated ? "Da qualificare" : "Idle"} />
                </div>
              </section>

              {generated ? (
                <section className="rounded-[2rem] border border-[rgba(200,245,66,0.16)] bg-[rgba(200,245,66,0.06)] p-5 shadow-2xl shadow-black/20 sm:p-6">
                  <p className="fc-label text-[var(--fc-accent)]">
                    {isWorkspacePlan ? `${workspaceLabel} workflow` : "Next step"}
                  </p>

                  <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.05em] text-[var(--fc-text)]">
                    {isWorkspacePlan
                      ? "Lead salvato. Continua dal workspace."
                      : "Vuoi analizzare altri lead e salvare lo storico?"}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">
                    {isWorkspacePlan
                      ? "Apri la dashboard per vedere priorita e follow-up, oppure entra nell'inbox per lavorare sul dettaglio del lead."
                      : "Con FlowCrew Pro puoi gestire più richieste, mantenere una dashboard clienti, personalizzare il tono delle risposte e usare modelli AI migliori."}
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
                      : ["Riassunto chiaro della richiesta", "Task e prossima azione", "Risposta pronta da copiare", "Tag e priorità del lead"]
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
  const missingInfo = analysis?.jackie.missingInfo.filter(Boolean).slice(0, 2).join(" · ");
  const nextSteps = analysis?.nora.nextSteps.filter(Boolean).slice(0, 2).join(" · ");

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
        ? `${lead?.urgency ?? analysis?.nora.urgency ?? "Media"} · ${analysis?.nora.leadQuality ?? "lead da qualificare"}`
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
        ? `${detectedTags.slice(0, 3).join(", ")} · ${detectedBudget} · ${detectedDeadline}`
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
          <p className="fc-label text-[var(--fc-accent)]">AI reasoning</p>
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
}: {
  usage: UsageResponse | null;
  isUsageLoading: boolean;
  hasReachedLimit: boolean;
}) {
  const progress = usage ? Math.min((usage.used / Math.max(usage.limit, 1)) * 100, 100) : 0;
  const isWorkspace = Boolean(usage && isPaidWorkspacePlan(usage.plan));
  const workspaceLabel = usage ? getWorkspacePlanLabel(usage.plan) : "Pro";

  return (
    <section className="rounded-[2rem] border border-white/[0.06] bg-[rgba(14,14,14,0.76)] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="fc-label">Piano attuale</p>
          <h3 className="mt-1 text-xl font-extrabold tracking-[-0.04em] text-[var(--fc-text)]">
            {isUsageLoading
              ? "Caricamento..."
              : isWorkspace
                ? `${workspaceLabel} plan active`
                : usage?.label ?? "Free"}
          </h3>
        </div>

        <span
          className={`flow-mono rounded-full px-3 py-1 text-xs ${
            hasReachedLimit
              ? "border border-red-400/20 bg-red-400/10 text-red-100"
              : "border border-[rgba(139,255,197,0.18)] bg-[rgba(139,255,197,0.07)] text-[var(--fc-mint)]"
          }`}
        >
          {hasReachedLimit ? (isWorkspace ? "Capacity full" : "Limit reached") : isWorkspace ? `${workspaceLabel} active` : "Active"}
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-[var(--fc-text-muted)]">Lead usati</span>
          <span className="flow-mono font-bold text-[var(--fc-text)]">
            {usage ? `${usage.used} / ${usage.limit} leads used` : "-"}
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-[var(--fc-accent)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-[var(--fc-text-muted)]">
          {usage
            ? isWorkspace
              ? `${usage.remaining} remaining this period.`
              : usage.remaining > 0
                ? `Ti restano ${usage.remaining} analisi nel piano ${usage.label}.`
                : "Hai finito il lead gratuito. Richiedi accesso Pro per analizzare altri lead."
            : "Utilizzo non disponibile."}
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
              {agent} · {label}
            </p>

            <h4 className="mt-1 text-base font-extrabold tracking-[-0.035em] text-[var(--fc-text)]">
              {title}
            </h4>
          </div>
        </div>

        <span className={`flow-mono rounded-full px-2 py-0.5 text-[11px] ${active ? "bg-[rgba(139,255,197,0.08)] text-[var(--fc-mint)]" : "bg-white/[0.04] text-[var(--fc-text-soft)]"}`}>
          {active ? "Ready" : "Idle"}
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

function getLimitErrorMessage(usage: UsageResponse | null) {
  if (usage && isPaidWorkspacePlan(usage.plan)) {
    return "La capacita del periodo e esaurita. Le nuove analisi ripartono quando il piano viene aggiornato.";
  }

  return "Hai finito il lead gratuito. Richiedi accesso Pro per analizzare altri lead.";
}

function getLimitButtonLabel(usage: UsageResponse | null) {
  if (usage && isPaidWorkspacePlan(usage.plan)) return "Capacita del periodo esaurita";

  return "Lead gratuito gia usato";
}
