"use client";

import { useEffect, useMemo, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Copy,
  Crown,
  Database,
  LayoutDashboard,
  ListChecks,
  MessageSquareText,
  RefreshCw,
  Send,
  Sparkles,
  Tags,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import { useLanguage } from "@/components/LanguageProvider";
import type { ConversationAnalysis, ConversationSource } from "@/lib/flowcrew-types";
import type { StoredLead } from "@/lib/leads";
import { trialDraftStorageKey } from "@/lib/trial-draft";

const manualProHref = "mailto:hello@flowcrew.ai?subject=FlowCrew%20Pro%20access%20request";

const sourceChips: Array<{ value: ConversationSource; label: string }> = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "instagram", label: "DM" },
];

const trialCopy = {
  it: {
    defaultBusinessType: "Freelance / piccolo team",
    defaultGoal: "Richiesta cliente, prioritÃ , proposta, follow-up e task.",
    emptyResponse: "La risposta del server Ã¨ vuota.",
    invalidResponse: "La risposta del server non Ã¨ leggibile.",
    usageUnavailable: "Non riesco a leggere il tuo piano in questo momento.",
    priorityFallback: "Da qualificare",
    urgencyFallback: "Da qualificare",
    qualityFallback: "Da qualificare",
    proposalFallback: "Nora segnalerÃ  qui scope, rischio e dettagli mancanti.",
    followUpFallback: "Milo suggerirÃ  qui il prossimo momento di risposta.",
    handoffFallback: "Dex trasformerÃ  il risultato nel prossimo passo operativo.",
    pending: "In attesa",
    notDetected: "Non rilevato",
    aroundBudget: "Circa",
    deadlineEndMonth: "Entro fine mese",
    deadlineTomorrow: "Domani",
    deadlineThisWeek: "Questa settimana",
    deadlineClarify: "Da chiarire",
    urgentTask: "Rispondi velocemente: la richiesta contiene una scadenza.",
    budgetTask: "Verifica se il budget copre lo scope richiesto.",
    fallbackTask: "Qualifica il contatto e chiedi i dettagli mancanti.",
    checkingPlan: "Controllo piano",
    analyzing: "Analisi in corso",
    analyzeMessage: "Analizza messaggio",
    formTitle: "Incolla un messaggio cliente",
    formBody: "FlowCrew trasforma messaggi cliente confusi in un lead strutturato.",
    clientNameAria: "Nome cliente opzionale",
    clientNamePlaceholder: "Nome cliente (opzionale)",
    composerPlaceholder: "Incolla un WhatsApp, una email o un DM da un cliente...",
    freeIncluded: "1 lead gratis incluso",
    heroTrialLabel: "FlowCrew trial",
    heroTagline: "Analizza una richiesta in pochi secondi.",
    usageChecking: "Controllo piano",
    usageUsed: "usati",
    usageFreeLeft: "gratis rimasti",
    usagePlanUnavailable: "Piano non disponibile",
    usageAccountRequired: "Account richiesto",
    activityLabel: "AttivitÃ  agenti",
    activityTitle: "Costruisco il workspace",
    loadingSteps: [
      "Jackie sta estraendo la richiesta",
      "Nora sta controllando lo scope",
      "Milo sta pianificando il follow-up",
      "Dex sta preparando il passaggio operativo",
    ],
    resultLeadSummary: "Riepilogo lead",
    noSummary: "Nessun riepilogo restituito.",
    tagsPriority: "Tag / prioritÃ ",
    priority: "PrioritÃ ",
    urgency: "Urgenza",
    status: "Stato",
    quality: "QualitÃ ",
    noTags: "Nessun tag",
    suggestedReply: "Risposta suggerita",
    noReply: "Nessuna risposta restituita.",
    copied: "Copiato",
    copy: "Copia",
    handoff: "Passaggio operativo",
    nextAction: "Prossima azione",
    budget: "Budget",
    deadline: "Scadenza",
    owner: "Owner",
    ready: "Pronto",
    nextStep: "Prossimo passo",
    continueWorkspace: "Continua dal tuo workspace.",
    saveMore: "Salva le prossime conversazioni con Pro.",
    savedToPrefix: "Salvato in",
    savedToWorkspace: "Salvato nel workspace",
    open: "Apri",
    openSavedLead: "Apri lead salvato",
    dashboard: "Dashboard",
    proAccess: "Accesso Pro",
    periodDone: "Periodo esaurito",
    freeUsed: "Lead gratuito giÃ  usato",
    periodLimitBody: "Il workspace ha raggiunto il limite del periodo.",
    upgradeBody: "Passa a Pro per continuare ad analizzare conversazioni.",
    requestPro: "Richiedi accesso Pro",
    signIn: "Accedi",
    retry: "Riprova",
    partialTitle: "Analisi parziale",
    partialBody:
      "FlowCrew ha salvato il miglior risultato disponibile, ma una parte dell'analisi Ã¨ stata ricostruita.",
    errors: {
      auth_required: {
        title: "Sign in to analyze the lead",
        message: "FlowCrew needs to connect the result to your workspace before saving it.",
      },
      usage_unavailable: {
        title: "I can't verify the plan",
        message: "Try again shortly: I don't want to consume or save a lead without knowing your limit.",
      },
      quota_exceeded: {
        title: "You used your free lead",
        message: "Upgrade to Pro to keep analyzing client messages and preserve history.",
      },
      supabase_unconfigured: {
        title: "Workspace unavailable",
        message: "In questo ambiente l'area account non Ã¨ pronta. Puoi riprovare quando il workspace Ã¨ configurato.",
      },
      invalid_input_short: {
        title: "Message too short",
        message: "Incolla qualche dettaglio in piÃ¹: richiesta, obiettivo, budget, deadline o contesto cliente.",
      },
      invalid_input: {
        title: "Add a client message",
        message: "Incolla una chat, una mail o un DM reale prima di avviare l'analisi.",
      },
      rate_limited: {
        title: "Analysis temporarily unavailable",
        message: "Il motore AI Ã¨ sotto carico. Aspetta qualche secondo e riprova.",
      },
      ai_unavailable: {
        title: "Non sono riuscito a completare l'analisi",
        message: "Il messaggio non Ã¨ stato salvato come risultato valido. Riprova tra poco.",
      },
      copy_failed: {
        title: "Copy failed",
        message: "You can manually select the reply from Milo\'s card.",
      },
      generic: {
        title: "Something went wrong",
        message: "Try again shortly. If the problem continues, request Pro support.",
      },
    },
  },
  en: {
    defaultBusinessType: "Freelance / small team",
    defaultGoal: "Client request, priority, proposal, follow-up and tasks.",
    emptyResponse: "The server response is empty.",
    invalidResponse: "The server response is not readable.",
    usageUnavailable: "I can't read your plan right now.",
    priorityFallback: "Needs qualification",
    urgencyFallback: "Needs qualification",
    qualityFallback: "Needs qualification",
    proposalFallback: "Nora will flag the scope, risk and missing details here.",
    followUpFallback: "Milo will suggest the next reply moment here.",
    handoffFallback: "Dex will turn the result into the next operational step here.",
    pending: "Pending",
    notDetected: "Not detected",
    aroundBudget: "Around",
    deadlineEndMonth: "By end of month",
    deadlineTomorrow: "Tomorrow",
    deadlineThisWeek: "This week",
    deadlineClarify: "To clarify",
    urgentTask: "Reply quickly: the request includes a deadline.",
    budgetTask: "Check whether the budget covers the requested scope.",
    fallbackTask: "Qualify the contact and ask for the missing details.",
    checkingPlan: "Checking plan",
    analyzing: "Analyzing",
    analyzeMessage: "Analyze message",
    formTitle: "Paste a client message",
    formBody: "FlowCrew turns messy client messages into a structured lead.",
    clientNameAria: "Optional client name",
    clientNamePlaceholder: "Client name (optional)",
    composerPlaceholder: "Paste a WhatsApp, email or DM from a client...",
    freeIncluded: "1 free lead included",
    heroTrialLabel: "FlowCrew trial",
    heroTagline: "Analyze one request in a few seconds.",
    usageChecking: "Checking plan",
    usageUsed: "used",
    usageFreeLeft: "free left",
    usagePlanUnavailable: "Plan unavailable",
    usageAccountRequired: "Account required",
    activityLabel: "Agent activity",
    activityTitle: "Building the workspace",
    loadingSteps: [
      "Jackie is extracting the request",
      "Nora is checking scope",
      "Milo is planning follow-up",
      "Dex is preparing the handoff",
    ],
    resultLeadSummary: "Lead summary",
    noSummary: "No summary returned.",
    tagsPriority: "Tags / priority",
    priority: "Priority",
    urgency: "Urgency",
    status: "Status",
    quality: "Quality",
    noTags: "No tags",
    suggestedReply: "Suggested reply",
    noReply: "No reply returned.",
    copied: "Copied",
    copy: "Copy",
    handoff: "Handoff",
    nextAction: "Next action",
    budget: "Budget",
    deadline: "Deadline",
    owner: "Owner",
    ready: "Ready",
    nextStep: "Next step",
    continueWorkspace: "Continue from your workspace.",
    saveMore: "Save the next conversations with Pro.",
    savedToPrefix: "Saved to",
    savedToWorkspace: "Saved to workspace",
    open: "Open",
    openSavedLead: "Open saved lead",
    dashboard: "Dashboard",
    proAccess: "Pro access",
    periodDone: "Period exhausted",
    freeUsed: "Free lead already used",
    periodLimitBody: "The workspace has reached this period's limit.",
    upgradeBody: "Upgrade to Pro to keep analyzing conversations.",
    requestPro: "Request Pro access",
    signIn: "Sign in",
    retry: "Try again",
    partialTitle: "Partial analysis",
    partialBody:
      "FlowCrew saved the best available result, but part of the analysis was reconstructed.",
    errors: {
      auth_required: {
        title: "Sign in to analyze the lead",
        message: "FlowCrew needs to connect the result to your workspace before saving it.",
      },
      usage_unavailable: {
        title: "I can't verify the plan",
        message: "Try again shortly: I don't want to consume or save a lead without knowing your limit.",
      },
      quota_exceeded: {
        title: "You used your free lead",
        message: "Upgrade to Pro to keep analyzing client messages and preserve history.",
      },
      supabase_unconfigured: {
        title: "Workspace unavailable",
        message: "The account area is not ready in this environment. Try again when the workspace is configured.",
      },
      invalid_input_short: {
        title: "Message too short",
        message: "Paste a little more detail: request, goal, budget, deadline, or client context.",
      },
      invalid_input: {
        title: "Add a client message",
        message: "Paste a real chat, email, or DM before starting the analysis.",
      },
      rate_limited: {
        title: "Analysis temporarily unavailable",
        message: "The AI engine is under load. Wait a few seconds and try again.",
      },
      ai_unavailable: {
        title: "I couldn't complete the analysis",
        message: "The message was not saved as a valid result. Try again shortly.",
      },
      copy_failed: {
        title: "Copy failed",
        message: "You can manually select the reply from Milo's card.",
      },
      generic: {
        title: "Something went wrong",
        message: "Try again shortly. If the problem continues, request Pro support.",
      },
    },
  },
} as const;

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
  leadUrl?: string;
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
      error: "The server response is empty.",
    } satisfies ErrorPayload;
  }

  if (contentType.includes("application/json") || trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return JSON.parse(text) as IngestResponse | ErrorPayload;
    } catch {
      return {
        code: "invalid_response",
        error: "The server response is not readable.",
      } satisfies ErrorPayload;
    }
  }

  return {
    code: "invalid_response",
    error: "The server response is not readable.",
  } satisfies ErrorPayload;
}

export default function TrialPage() {
  const { language } = useLanguage();
  const copy = trialCopy[language];
  const [sourceType, setSourceType] = useState<ConversationSource>("whatsapp");
  const [clientName, setClientName] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<IngestResponse | null>(null);
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [usageError, setUsageError] = useState<UsageError | null>(null);
  const [isUsageLoading, setIsUsageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedReply, setCopiedReply] = useState(false);
  const [error, setError] = useState<TrialError | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    try {
      const storedDraft = window.localStorage.getItem(trialDraftStorageKey);

      if (storedDraft) {
        window.setTimeout(() => setMessage(storedDraft), 0);
      }
    } catch {
      // The composer remains usable when storage is unavailable.
    }
  }, [copy.usageUnavailable]);

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
            message: payload?.error ?? copy.usageUnavailable,
          });
          return;
        }

        if (!payload || typeof payload.remaining !== "number") {
          setUsageError({
            code: "usage_unavailable",
            message: copy.usageUnavailable,
          });
          return;
        }

        setUsage(payload);
        setUsageError(null);
      } catch {
        setUsageError({
          code: "usage_unavailable",
          message: copy.usageUnavailable,
        });
      } finally {
        setIsUsageLoading(false);
      }
    }

    void loadUsage();
  }, [copy.usageUnavailable]);

  const generated = Boolean(result);
  const workspaceOpen = hasSubmitted || isLoading || generated;
  const isWorkspacePlan = Boolean(usage && isPaidWorkspacePlan(usage.plan));
  const hasReachedLimit = Boolean(usage && usage.remaining <= 0 && !isWorkspacePlan);
  const workspaceLabel = usage ? getWorkspacePlanLabel(usage.plan) : "Pro";
  const analysis = result?.analysis;
  const lead = result?.lead;
  const isPartialAnalysis = Boolean(analysis?.analysisMeta?.degraded || analysis?.analysisMeta?.status === "partial");
  const friendlyPriority = formatSignal(analysis?.dex.priority ?? lead?.urgency, copy.priorityFallback);
  const friendlyUrgency = formatSignal(analysis?.nora.urgency ?? lead?.urgency, copy.urgencyFallback);
  const friendlyStatus = formatStatus(analysis?.dex.status ?? lead?.status, language);
  const leadQuality = formatSignal(analysis?.nora.leadQuality, copy.qualityFallback);
  const requestSummary = lead?.summary ?? analysis?.jackie.cleanSummary;
  const proposalText =
    analysis?.crewReview?.nora.message ??
    analysis?.nora.why ??
    copy.proposalFallback;
  const followUpText =
    analysis?.milo.followUp ??
    lead?.follow_up ??
    analysis?.crewReview?.milo.nextCommercialMove ??
    copy.followUpFallback;
  const handoffText =
    lead?.next_action ??
    analysis?.crewReview?.summary.nextAction ??
    copy.handoffFallback;

  const detectedTags = useMemo(() => {
    if (analysis?.dex.tags.length) return analysis.dex.tags;
    if (lead?.tags?.length) return lead.tags;
    return generated ? ["lead", "needs-qualification"] : [];
  }, [analysis, generated, lead?.tags]);

  const detectedBudget = useMemo(() => {
    const text = `${message} ${lead?.summary ?? ""}`;
    const euroMatch = text.match(/(?:\u20ac\s?|\bmax\s?)?(\d{2,5})\s?(?:\u20ac|euro|eur)?/i);

    if (!generated) return copy.pending;
    if (!euroMatch) return copy.notDetected;

    return `${copy.aroundBudget} ${euroMatch[1]} euro`;
  }, [copy.aroundBudget, copy.notDetected, copy.pending, generated, lead?.summary, message]);

  const detectedDeadline = useMemo(() => {
    const text = `${message} ${lead?.summary ?? ""}`.toLowerCase();

    if (!generated) return copy.pending;
    if (text.includes("fine mese") || text.includes("end of month") || text.includes("end-of-month")) return copy.deadlineEndMonth;
    if (text.includes("domani") || text.includes("tomorrow")) return copy.deadlineTomorrow;
    if (text.includes("settimana") || text.includes("this week") || text.includes("weekly")) return copy.deadlineThisWeek;

    return copy.deadlineClarify;
  }, [copy.deadlineClarify, copy.deadlineEndMonth, copy.deadlineThisWeek, copy.deadlineTomorrow, copy.pending, generated, lead?.summary, message]);

  const taskItems = useMemo(() => {
    if (!generated) return [];

    const tasks = [lead?.next_action].filter(Boolean) as string[];

    if (detectedDeadline !== copy.deadlineClarify && detectedDeadline !== copy.pending) {
      tasks.push(copy.urgentTask);
    }

    if (detectedBudget !== copy.notDetected && detectedBudget !== copy.pending) {
      tasks.push(copy.budgetTask);
    }

    if (tasks.length === 0) {
      return [copy.fallbackTask];
    }

    return tasks;
  }, [copy.budgetTask, copy.deadlineClarify, copy.fallbackTask, copy.notDetected, copy.pending, copy.urgentTask, detectedBudget, detectedDeadline, generated, lead?.next_action]);

  const sendLabel = isUsageLoading
    ? copy.checkingPlan
    : hasReachedLimit
      ? usage && isPaidWorkspacePlan(usage.plan)
        ? copy.periodDone
        : copy.freeUsed
      : isLoading
        ? copy.analyzing
        : copy.analyzeMessage;

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

    setHasSubmitted(true);
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCopiedReply(false);

    try {
      const response = await fetch("/api/ingest-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          sourceType,
          messyMessage: cleanMessage,
          businessType: copy.defaultBusinessType,
          goal: copy.defaultGoal,
          language,
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

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
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
      <div className="relative mx-auto min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden px-0 py-3 sm:py-5">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[rgba(200,245,66,0.08)] blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50 [mask-image:radial-gradient(ellipse_70%_48%_at_50%_4%,black,transparent)]" />

        <div
          className={`relative mx-auto flex min-h-[calc(100vh-5.5rem)] w-full max-w-5xl flex-col transition-all duration-300 ${
            workspaceOpen ? "justify-start gap-5" : "justify-center gap-5"
          }`}
        >
          <MiniHero
            isUsageLoading={isUsageLoading}
            isWorkspacePlan={isWorkspacePlan}
            usage={usage}
            usageError={usageError}
            workspaceLabel={workspaceLabel}
            workspaceOpen={workspaceOpen}
          />

          <form
            aria-busy={isLoading}
            className={`mx-auto w-full max-w-[22rem] rounded-[2rem] border border-white/[0.08] bg-[rgba(14,14,14,0.82)] shadow-2xl shadow-black/25 backdrop-blur-xl transition-all duration-300 sm:max-w-4xl ${
              workspaceOpen ? "p-4 sm:p-5" : "p-5 sm:p-7"
            }`}
            onSubmit={generateLead}
          >
            <div className={`mb-5 ${workspaceOpen ? "text-left" : "text-center"}`}>
              <h1
                className={`text-balance font-extrabold leading-[0.96] tracking-[-0.055em] text-[var(--fc-text)] ${
                  workspaceOpen ? "text-2xl sm:text-3xl" : "text-2xl sm:text-5xl"
                }`}
              >
                {copy.formTitle}
              </h1>
              <p
                className={`mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--fc-text-muted)] sm:text-base ${
                  workspaceOpen ? "sm:mx-0" : ""
                }`}
              >
                {copy.formBody}
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition focus-within:border-[rgba(200,245,66,0.42)] focus-within:shadow-[0_0_0_3px_rgba(200,245,66,0.08),inset_0_1px_0_rgba(255,255,255,0.05)]">
              <textarea
                className={`fc-chat-composer-textarea w-full resize-none border-0 bg-transparent px-4 py-4 text-sm leading-6 text-[var(--fc-text)] outline-none placeholder:text-[var(--fc-text-soft)] sm:px-5 sm:text-base sm:leading-7 ${
                  workspaceOpen ? "max-h-[9.5rem] min-h-[7.5rem]" : "min-h-[13.5rem] sm:min-h-[15rem]"
                }`}
                id="client-conversation"
                name="messyMessage"
                onChange={(event) => {
                  setMessage(event.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={handleComposerKeyDown}
                placeholder={copy.composerPlaceholder}
                value={message}
              />

              <div className="flex flex-col gap-3 border-t border-white/[0.06] px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    aria-label={copy.clientNameAria}
                    className="h-8 w-44 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-[var(--fc-text)] outline-none transition placeholder:text-[var(--fc-text-soft)] focus:border-[rgba(200,245,66,0.4)]"
                    maxLength={120}
                    onChange={(event) => setClientName(event.target.value)}
                    placeholder={copy.clientNamePlaceholder}
                    value={clientName}
                  />

                  {sourceChips.map((source) => {
                    const selected = sourceType === source.value;

                    return (
                      <button
                        aria-pressed={selected}
                        className={`flow-mono rounded-full border px-3 py-1.5 text-[11px] transition ${
                          selected
                            ? "border-[rgba(200,245,66,0.34)] bg-[rgba(200,245,66,0.1)] text-[var(--fc-accent)]"
                            : "border-white/[0.07] bg-white/[0.025] text-[var(--fc-text-soft)] hover:border-white/[0.14] hover:text-[var(--fc-text-muted)]"
                        }`}
                        key={source.value}
                        onClick={() => {
                          setSourceType(source.value);
                          if (error) setError(null);
                        }}
                        type="button"
                      >
                        {source.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <p className="flow-mono text-[11px] text-[var(--fc-text-soft)]">
                    {isWorkspacePlan ? `${workspaceLabel} workspace` : copy.freeIncluded}
                  </p>

                  <button
                    aria-label={sendLabel}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[rgba(200,245,66,0.26)] bg-[var(--fc-accent)] text-black shadow-[0_0_28px_rgba(200,245,66,0.16)] transition hover:bg-[var(--fc-accent-strong)] disabled:cursor-not-allowed disabled:border-white/[0.08] disabled:bg-white/[0.08] disabled:text-[var(--fc-text-soft)] disabled:shadow-none"
                    disabled={isLoading || isUsageLoading || !message.trim() || hasReachedLimit}
                    title={sendLabel}
                    type="submit"
                  >
                    {isLoading ? (
                      <RefreshCw aria-hidden="true" className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send aria-hidden="true" className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {error ? (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  initial={{ opacity: 0, y: 8 }}
                  key={error.code}
                  transition={{ duration: 0.18 }}
                >
                  <ErrorCallout error={error} />
                </motion.div>
              ) : null}
            </AnimatePresence>

            {hasReachedLimit && !error ? <LimitNotice usage={usage} /> : null}
          </form>

          <AnimatePresence mode="popLayout">
            {isLoading ? <AgentActivity key="activity" /> : null}

            {generated && analysis && lead ? (
              <WorkspaceResults
                analysis={analysis}
                copiedReply={copiedReply}
                copyReply={copyReply}
                detectedBudget={detectedBudget}
                detectedDeadline={detectedDeadline}
                detectedTags={detectedTags}
                followUpText={followUpText}
                friendlyPriority={friendlyPriority}
                friendlyStatus={friendlyStatus}
                friendlyUrgency={friendlyUrgency}
                handoffText={handoffText}
                isPartialAnalysis={isPartialAnalysis}
                isWorkspacePlan={isWorkspacePlan}
                lead={lead}
                leadQuality={leadQuality}
                proposalText={proposalText}
                requestSummary={requestSummary}
                taskItems={taskItems}
                workspaceLabel={workspaceLabel}
                key="results"
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}

function useTrialCopy() {
  const { language } = useLanguage();
  return trialCopy[language];
}

function getTrialErrorText(error: TrialError, copy: (typeof trialCopy)[keyof typeof trialCopy]) {
  const key = error.code in copy.errors ? error.code as keyof typeof copy.errors : "generic";
  return copy.errors[key] ?? { title: error.title, message: error.message };
}

function MiniHero({
  usage,
  usageError,
  isUsageLoading,
  isWorkspacePlan,
  workspaceLabel,
  workspaceOpen,
}: {
  usage: UsageResponse | null;
  usageError: UsageError | null;
  isUsageLoading: boolean;
  isWorkspacePlan: boolean;
  workspaceLabel: string;
  workspaceOpen: boolean;
}) {
  const copy = useTrialCopy();

  return (
    <div
      className={`mx-auto flex w-full max-w-4xl flex-col items-center gap-3 text-center transition-all duration-300 ${
        workspaceOpen ? "sm:flex-row sm:justify-between sm:text-left" : ""
      }`}
    >
      <div className={`flex items-center gap-3 ${workspaceOpen ? "" : "flex-col"}`}>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--fc-accent)] text-black shadow-[0_0_34px_rgba(200,245,66,0.22)]">
          <Sparkles aria-hidden="true" className="h-5 w-5" />
        </span>

        <div>
          <p className="fc-label text-[var(--fc-accent)]">
            {isWorkspacePlan ? `FlowCrew ${workspaceLabel}` : copy.heroTrialLabel}
          </p>
          <p className="mt-1 text-sm font-bold text-[var(--fc-text)]">
            {copy.heroTagline}
          </p>
        </div>
      </div>

      <UsageBadge
        isUsageLoading={isUsageLoading}
        isWorkspacePlan={isWorkspacePlan}
        usage={usage}
        usageError={usageError}
        workspaceLabel={workspaceLabel}
      />
    </div>
  );
}

function UsageBadge({
  usage,
  usageError,
  isUsageLoading,
  isWorkspacePlan,
  workspaceLabel,
}: {
  usage: UsageResponse | null;
  usageError: UsageError | null;
  isUsageLoading: boolean;
  isWorkspacePlan: boolean;
  workspaceLabel: string;
}) {
  const copy = useTrialCopy();
  const text = isUsageLoading
    ? copy.usageChecking
    : usage
      ? isWorkspacePlan
        ? `${usage.used}/${usage.limit} ${copy.usageUsed}`
        : `${usage.remaining} ${copy.usageFreeLeft}`
      : usageError
        ? copy.usagePlanUnavailable
        : copy.usageAccountRequired;

  return (
    <div className="flow-mono inline-flex items-center gap-2 rounded-full border border-[rgba(139,255,197,0.18)] bg-[rgba(139,255,197,0.07)] px-3.5 py-2 text-[11px] text-[var(--fc-mint)]">
      {isWorkspacePlan ? (
        <Crown aria-hidden="true" className="h-3.5 w-3.5" />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--fc-mint)]" />
      )}
      <span>{isWorkspacePlan ? `${workspaceLabel} - ${text}` : text}</span>
    </div>
  );
}

function AgentActivity() {
  const copy = useTrialCopy();

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      aria-live="polite"
      className="mx-auto w-full max-w-4xl rounded-[2rem] border border-[rgba(200,245,66,0.14)] bg-[rgba(14,14,14,0.78)] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6"
      exit={{ opacity: 0, y: -10 }}
      initial={{ opacity: 0, y: 14 }}
      role="status"
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center gap-3">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[rgba(200,245,66,0.2)] bg-[rgba(200,245,66,0.08)]">
          <span className="absolute h-3 w-3 animate-ping rounded-full bg-[rgba(200,245,66,0.35)]" />
          <span className="h-2 w-2 rounded-full bg-[var(--fc-accent)]" />
        </span>

        <div>
          <p className="fc-label text-[var(--fc-accent)]">{copy.activityLabel}</p>
          <h2 className="text-xl font-extrabold tracking-[-0.04em] text-[var(--fc-text)]">
            {copy.activityTitle}
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {copy.loadingSteps.map((step, index) => (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 rounded-3xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm text-[var(--fc-text-muted)]"
            initial={{ opacity: 0, x: -8 }}
            key={step}
            transition={{ delay: index * 0.18, duration: 0.22 }}
          >
            <span className="flow-mono grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/[0.08] bg-black/30 text-[11px] text-[var(--fc-accent)]">
              {index + 1}
            </span>
            <span className="font-medium">{step}</span>
            <span
              aria-hidden="true"
              className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--fc-accent)]"
              style={{ animationDelay: `${index * 160}ms` }}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function WorkspaceResults({
  analysis,
  lead,
  requestSummary,
  friendlyPriority,
  friendlyUrgency,
  friendlyStatus,
  leadQuality,
  detectedTags,
  detectedBudget,
  detectedDeadline,
  proposalText,
  followUpText,
  handoffText,
  taskItems,
  copiedReply,
  copyReply,
  isPartialAnalysis,
  isWorkspacePlan,
  workspaceLabel,
}: {
  analysis: ConversationAnalysis;
  lead: StoredLead;
  requestSummary: string | null | undefined;
  friendlyPriority: string;
  friendlyUrgency: string;
  friendlyStatus: string;
  leadQuality: string;
  detectedTags: string[];
  detectedBudget: string;
  detectedDeadline: string;
  proposalText: string;
  followUpText: string;
  handoffText: string;
  taskItems: string[];
  copiedReply: boolean;
  copyReply: () => void;
  isPartialAnalysis: boolean;
  isWorkspacePlan: boolean;
  workspaceLabel: string;
}) {
  const copy = useTrialCopy();

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-5xl space-y-4"
      exit={{ opacity: 0, y: 10 }}
      initial={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.26 }}
    >
      {isPartialAnalysis ? <PartialAnalysisNotice /> : null}

      <SavedLeadNotice isWorkspacePlan={isWorkspacePlan} lead={lead} workspaceLabel={workspaceLabel} />

      <div className="grid gap-4 lg:grid-cols-2">
        <ResultCard
          agent="Jackie"
          delay={0}
          icon={<ClipboardList aria-hidden="true" className="h-4 w-4" />}
          tone="lime"
          title={copy.resultLeadSummary}
        >
          <p className="text-sm leading-6 text-[var(--fc-text-muted)]">
            {requestSummary ?? copy.noSummary}
          </p>

          {analysis.jackie.keyFacts.length ? (
            <ul className="mt-4 space-y-2">
              {analysis.jackie.keyFacts.slice(0, 3).map((fact) => (
                <li className="flex gap-2 text-sm leading-6 text-[var(--fc-text-muted)]" key={fact}>
                  <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[var(--fc-accent)]" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </ResultCard>

        <ResultCard
          agent="Nora + Dex"
          delay={0.08}
          icon={<Tags aria-hidden="true" className="h-4 w-4" />}
          tone="mint"
          title={copy.tagsPriority}
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <MiniMetric label={copy.priority} value={friendlyPriority} />
            <MiniMetric label={copy.urgency} value={friendlyUrgency} />
            <MiniMetric label={copy.status} value={friendlyStatus} />
            <MiniMetric label={copy.quality} value={leadQuality} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {detectedTags.length ? (
              detectedTags.map((tag) => (
                <span className="fc-pill" key={tag}>
                  {formatTag(tag)}
                </span>
              ))
            ) : (
              <span className="fc-pill">{copy.noTags}</span>
            )}
          </div>
        </ResultCard>

        <ResultCard
          agent="Milo"
          className="lg:col-span-2"
          delay={0.16}
          icon={<MessageSquareText aria-hidden="true" className="h-4 w-4" />}
          tone="orange"
          title={copy.suggestedReply}
        >
          <p className="text-sm leading-6 text-[var(--fc-text-muted)]">
            {followUpText}
          </p>

          <div className="mt-4 rounded-3xl border border-white/[0.06] bg-white/[0.035] p-4">
            <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--fc-text)]">
              {lead.suggested_reply ?? copy.noReply}
            </p>
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[var(--fc-text-soft)]">
              {proposalText}
            </p>

            <button
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-[var(--fc-text)] transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!lead.suggested_reply}
              onClick={copyReply}
              type="button"
            >
              {copiedReply ? (
                <>
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[var(--fc-mint)]" />
                  {copy.copied}
                </>
              ) : (
                <>
                  <Copy aria-hidden="true" className="h-4 w-4" />
                  {copy.copy}
                </>
              )}
            </button>
          </div>
        </ResultCard>

        <ResultCard
          agent="Dex"
          className="lg:col-span-2"
          delay={0.24}
          icon={<ListChecks aria-hidden="true" className="h-4 w-4" />}
          tone="purple"
          title={copy.handoff}
        >
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
            <div className="rounded-3xl border border-white/[0.06] bg-white/[0.025] p-4">
              <p className="text-sm font-extrabold text-[var(--fc-text)]">{copy.nextAction}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--fc-text-muted)]">
                {handoffText}
              </p>

              <ul className="mt-4 space-y-2">
                {taskItems.map((task) => (
                  <li className="flex gap-2 text-sm leading-6 text-[var(--fc-text-muted)]" key={task}>
                    <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[var(--fc-accent)]" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-2">
              <MiniMetric label={copy.budget} value={detectedBudget} />
              <MiniMetric label={copy.deadline} value={detectedDeadline} />
              <MiniMetric label={copy.owner} value={analysis.jackie.suggestedAgent || "Jackie"} />
            </div>
          </div>
        </ResultCard>
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 rounded-[2rem] border border-[rgba(200,245,66,0.14)] bg-[rgba(200,245,66,0.055)] p-4 shadow-2xl shadow-black/20 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.34, duration: 0.24 }}
      >
        <div>
          <p className="fc-label text-[var(--fc-accent)]">
            {isWorkspacePlan ? `${workspaceLabel} workspace` : copy.nextStep}
          </p>
          <p className="mt-1 text-sm font-bold text-[var(--fc-text)]">
            {isWorkspacePlan ? copy.continueWorkspace : copy.saveMore}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/leads/${lead.id}`} className="fc-button fc-button-primary">
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
            {copy.openSavedLead}
          </Link>

          <Link href="/dashboard" className="fc-button">
            <LayoutDashboard aria-hidden="true" className="h-4 w-4" />
            {copy.dashboard}
          </Link>

          {!isWorkspacePlan ? (
            <a href={manualProHref} className="fc-button">
              {copy.proAccess}
            </a>
          ) : null}
        </div>
      </motion.div>
    </motion.section>
  );
}

function ResultCard({
  agent,
  title,
  tone,
  icon,
  delay,
  className = "",
  children,
}: {
  agent: string;
  title: string;
  tone: "lime" | "mint" | "orange" | "purple";
  icon: ReactNode;
  delay: number;
  className?: string;
  children: ReactNode;
}) {
  const copy = useTrialCopy();
  const toneClasses = {
    lime: "border-[rgba(200,245,66,0.14)] bg-[rgba(200,245,66,0.045)] text-[var(--fc-accent)]",
    mint: "border-[rgba(139,255,197,0.14)] bg-[rgba(139,255,197,0.045)] text-[var(--fc-mint)]",
    orange: "border-[rgba(255,154,92,0.14)] bg-[rgba(255,154,92,0.045)] text-[#ff9a5c]",
    purple: "border-[rgba(192,132,252,0.14)] bg-[rgba(192,132,252,0.045)] text-[#c084fc]",
  };

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[2rem] border border-white/[0.07] bg-[rgba(14,14,14,0.78)] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5 ${className}`}
      initial={{ opacity: 0, y: 16 }}
      transition={{ delay, duration: 0.24 }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl border ${toneClasses[tone]}`}>
            {icon}
          </span>

          <div>
            <p className="flow-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fc-text-soft)]">
              {agent}
            </p>
            <h3 className="mt-1 text-lg font-extrabold tracking-[-0.04em] text-[var(--fc-text)]">
              {title}
            </h3>
          </div>
        </div>

        <span className="flow-mono rounded-full bg-[rgba(139,255,197,0.08)] px-2 py-0.5 text-[11px] text-[var(--fc-mint)]">
          {copy.ready}
        </span>
      </div>

      {children}
    </motion.article>
  );
}

function SavedLeadNotice({
  lead,
  isWorkspacePlan,
  workspaceLabel,
}: {
  lead: StoredLead;
  isWorkspacePlan: boolean;
  workspaceLabel: string;
}) {
  const copy = useTrialCopy();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-[rgba(139,255,197,0.2)] bg-[rgba(139,255,197,0.075)] p-4 text-sm font-bold text-[var(--fc-mint)]"
      initial={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.02, duration: 0.22 }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Database aria-hidden="true" className="h-5 w-5" />
        <span>
          {isWorkspacePlan ? `${copy.savedToPrefix} ${workspaceLabel}` : copy.savedToWorkspace}
        </span>
        <span className="flow-mono text-xs">{lead.id.slice(0, 8)}</span>
        <Link
          className="ml-auto text-xs font-extrabold text-[var(--fc-text)] underline decoration-white/25 underline-offset-4"
          href={`/leads/${lead.id}`}
        >
          {copy.open}
        </Link>
      </div>
    </motion.div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-3 py-2">
      <p className="flow-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fc-text-soft)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-extrabold text-[var(--fc-text)]">
        {value}
      </p>
    </div>
  );
}

function LimitNotice({ usage }: { usage: UsageResponse | null }) {
  const copy = useTrialCopy();
  const isWorkspace = Boolean(usage && isPaidWorkspacePlan(usage.plan));

  return (
    <div className="mt-4 rounded-3xl border border-red-400/20 bg-red-400/10 p-4 text-sm leading-6 text-red-100">
      <p className="font-extrabold text-white">
        {isWorkspace ? copy.periodDone : copy.freeUsed}
      </p>
      <p className="mt-1">
        {isWorkspace
          ? copy.periodLimitBody
          : copy.upgradeBody}
      </p>
      {!isWorkspace ? (
        <a href={manualProHref} className="fc-button fc-button-primary mt-4">
          {copy.requestPro}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      ) : null}
    </div>
  );
}

function ErrorCallout({ error }: { error: TrialError }) {
  const copy = useTrialCopy();
  const localizedError = getTrialErrorText(error, copy);

  return (
    <div className="mt-4 rounded-3xl border border-red-400/20 bg-red-400/10 p-4 text-sm leading-6 text-red-100" role="alert">
      <div className="flex gap-3">
        <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-extrabold text-white">{localizedError.title}</p>
          <p className="mt-1 font-medium">{localizedError.message}</p>
        </div>
      </div>

      {error.action ? (
        <div className="mt-4 flex flex-wrap gap-2 pl-8">
          {error.action === "login" ? (
            <Link href="/login" className="fc-button fc-button-primary">
              {copy.signIn}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          ) : null}

          {error.action === "pro" ? (
            <a href={manualProHref} className="fc-button fc-button-primary">
              {copy.requestPro}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          ) : null}

          {error.action === "retry" ? (
            <button type="submit" className="fc-button">
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              {copy.retry}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function PartialAnalysisNotice() {
  const copy = useTrialCopy();

  return (
    <div className="rounded-3xl border border-[rgba(255,196,87,0.22)] bg-[rgba(255,196,87,0.08)] p-4 text-sm leading-6 text-[#ffd79a]">
      <div className="flex gap-3">
        <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-extrabold text-white">{copy.partialTitle}</p>
          <p className="mt-1 text-[var(--fc-text-muted)]">
            {copy.partialBody}
          </p>
        </div>
      </div>
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
        title: "Sign in to analyze the lead",
        message: "FlowCrew needs to connect the result to your workspace before saving it.",
        action: "login",
      };
    case "usage_unavailable":
      return {
        code,
        title: "I can't verify the plan",
        message: "Try again shortly: I don't want to consume or save a lead without knowing your limit.",
        action: "retry",
      };
    case "quota_exceeded":
      return {
        code,
        title: "You used your free lead",
        message: "Upgrade to Pro to keep analyzing client messages and preserve history.",
        action: "pro",
      };
    case "supabase_unconfigured":
      return {
        code,
        title: "Workspace unavailable",
        message: "The account area is not ready in this environment. Try again when the workspace is configured.",
      };
    case "invalid_input_short":
      return {
        code,
        title: "Message too short",
        message: "Paste a little more detail: request, goal, budget, deadline, or client context.",
      };
    case "invalid_input":
      return {
        code,
        title: "Add a client message",
        message: "Incolla una chat, una mail o un DM reale prima di avviare l'analisi.",
      };
    case "rate_limited":
      return {
        code,
        title: "Analysis temporarily unavailable",
        message: "The AI engine is under load. Wait a few seconds and try again.",
        action: "retry",
      };
    case "ai_unavailable":
    case "invalid_response":
    case "empty_response":
      return {
        code,
        title: "Non sono riuscito a completare l'analisi",
        message: "The message was not saved as a valid result. Try again shortly.",
        action: "retry",
      };
    case "copy_failed":
      return {
        code,
        title: "Copy failed",
        message: "You can manually select the reply from Milo\'s card.",
      };
    default:
      return {
        code: "generic",
        title: "Something went wrong",
        message: "Try again shortly. If the problem continues, request Pro support.",
        action: "retry",
      };
  }
}

function formatSignal(value: string | null | undefined, fallback: string) {
  const normalized = value?.trim();
  if (!normalized) return fallback;

  const lower = normalized.toLowerCase();
  const labels: Record<string, string> = {
    high: "High",
    medium: "Medium",
    low: "Low",
    hot: "Hot",
    warm: "Warm",
    cold: "Cold",
    urgent: "Urgent",
    unclear: "Needs clarification",
    clear: "Clear",
    qualified: "Qualified",
    "needs-qualification": "Needs qualification",
    needs_qualification: "Needs qualification",
  };

  return labels[lower] ?? toDisplayLabel(normalized);
}

function formatStatus(value: string | null | undefined, language: "en" | "it" = "it") {
  const normalized = value?.trim();
  if (!normalized) return language === "it" ? "Da qualificare" : "Needs qualification";

  const labels: Record<"en" | "it", Record<string, string>> = {
    it: {
      new: "Nuovo",
      needs_qualification: "Da qualificare",
      waiting_reply: "In attesa risposta",
      follow_up: "Follow-up",
      qualified: "Qualificato",
      closed: "Chiuso",
    },
    en: {
      new: "New",
      needs_qualification: "Needs qualification",
      waiting_reply: "Waiting reply",
      follow_up: "Follow-up",
      qualified: "Qualified",
      closed: "Closed",
    },
  };

  return labels[language][normalized.toLowerCase()] ?? toDisplayLabel(normalized);
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