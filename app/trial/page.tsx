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
import type { ConversationAnalysis, ConversationSource } from "@/lib/flowcrew-types";
import type { StoredLead } from "@/lib/leads";
import { trialDraftStorageKey } from "@/lib/trial-draft";

const manualProHref = "mailto:hello@flowcrew.ai?subject=Richiesta%20accesso%20FlowCrew%20Pro";
const defaultClientName = "";
const defaultBusinessType = "Freelance / piccolo team";
const defaultGoal = "Richiesta cliente, priorita, proposta, follow-up e task.";

const loadingSteps = [
  "Jackie is extracting the request",
  "Nora is checking scope",
  "Milo is planning follow-up",
  "Dex is preparing the handoff",
];

const sourceChips: Array<{ value: ConversationSource; label: string }> = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "instagram", label: "DM" },
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

export default function TrialPage() {
  const [sourceType, setSourceType] = useState<ConversationSource>("whatsapp");
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
  const workspaceOpen = hasSubmitted || isLoading || generated;
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
    "Nora will flag the scope, risk and missing details here.";
  const followUpText =
    analysis?.milo.followUp ??
    lead?.follow_up ??
    analysis?.crewReview?.milo.nextCommercialMove ??
    "Milo will suggest the next reply moment here.";
  const handoffText =
    lead?.next_action ??
    analysis?.crewReview?.summary.nextAction ??
    "Dex will turn the result into the next operational step here.";

  const detectedTags = useMemo(() => {
    if (analysis?.dex.tags.length) return analysis.dex.tags;
    if (lead?.tags?.length) return lead.tags;
    return generated ? ["lead", "da-qualificare"] : [];
  }, [analysis, generated, lead?.tags]);

  const detectedBudget = useMemo(() => {
    const text = `${message} ${lead?.summary ?? ""}`;
    const euroMatch = text.match(/(?:\u20ac\s?|\bmax\s?)?(\d{2,5})\s?(?:\u20ac|euro|eur)?/i);

    if (!generated) return "In attesa";
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
    if (!generated) return [];

    const tasks = [lead?.next_action].filter(Boolean) as string[];

    if (detectedDeadline !== "Da chiarire" && detectedDeadline !== "In attesa") {
      tasks.push("Rispondi velocemente: la richiesta contiene una scadenza.");
    }

    if (detectedBudget !== "Non rilevato" && detectedBudget !== "In attesa") {
      tasks.push("Verifica se il budget copre lo scope richiesto.");
    }

    if (tasks.length === 0) {
      return ["Qualifica il contatto e chiedi i dettagli mancanti."];
    }

    return tasks;
  }, [detectedBudget, detectedDeadline, generated, lead?.next_action]);

  const sendLabel = isUsageLoading
    ? "Checking plan"
    : hasReachedLimit
      ? getLimitButtonLabel(usage)
      : isLoading
        ? "Analyzing"
        : "Analyze message";

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
          clientName: defaultClientName,
          sourceType,
          messyMessage: cleanMessage,
          businessType: defaultBusinessType,
          goal: defaultGoal,
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
                Paste a client message
              </h1>
              <p
                className={`mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--fc-text-muted)] sm:text-base ${
                  workspaceOpen ? "sm:mx-0" : ""
                }`}
              >
                FlowCrew turns messy client messages into a structured lead.
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
                placeholder="Paste a WhatsApp, email or DM from a client..."
                value={message}
              />

              <div className="flex flex-col gap-3 border-t border-white/[0.06] px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <div className="flex flex-wrap items-center gap-2">
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
                    {isWorkspacePlan ? `${workspaceLabel} workspace` : "1 free lead included"}
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
            {isWorkspacePlan ? `FlowCrew ${workspaceLabel}` : "FlowCrew trial"}
          </p>
          <p className="mt-1 text-sm font-bold text-[var(--fc-text)]">
            Analyze one request in a few seconds.
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
  const text = isUsageLoading
    ? "Checking plan"
    : usage
      ? isWorkspacePlan
        ? `${usage.used}/${usage.limit} used`
        : `${usage.remaining} free left`
      : usageError
        ? "Plan unavailable"
        : "Account required";

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
          <p className="fc-label text-[var(--fc-accent)]">Agent activity</p>
          <h2 className="text-xl font-extrabold tracking-[-0.04em] text-[var(--fc-text)]">
            Building the workspace
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {loadingSteps.map((step, index) => (
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
          title="Lead summary"
        >
          <p className="text-sm leading-6 text-[var(--fc-text-muted)]">
            {requestSummary ?? "No summary returned."}
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
          title="Tags / priority"
        >
          <div className="grid gap-2 sm:grid-cols-2">
            <MiniMetric label="Priority" value={friendlyPriority} />
            <MiniMetric label="Urgency" value={friendlyUrgency} />
            <MiniMetric label="Status" value={friendlyStatus} />
            <MiniMetric label="Quality" value={leadQuality} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {detectedTags.length ? (
              detectedTags.map((tag) => (
                <span className="fc-pill" key={tag}>
                  {formatTag(tag)}
                </span>
              ))
            ) : (
              <span className="fc-pill">No tags</span>
            )}
          </div>
        </ResultCard>

        <ResultCard
          agent="Milo"
          className="lg:col-span-2"
          delay={0.16}
          icon={<MessageSquareText aria-hidden="true" className="h-4 w-4" />}
          tone="orange"
          title="Suggested reply"
        >
          <p className="text-sm leading-6 text-[var(--fc-text-muted)]">
            {followUpText}
          </p>

          <div className="mt-4 rounded-3xl border border-white/[0.06] bg-white/[0.035] p-4">
            <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--fc-text)]">
              {lead.suggested_reply ?? "No reply returned."}
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
                  Copied
                </>
              ) : (
                <>
                  <Copy aria-hidden="true" className="h-4 w-4" />
                  Copy
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
          title="Handoff"
        >
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
            <div className="rounded-3xl border border-white/[0.06] bg-white/[0.025] p-4">
              <p className="text-sm font-extrabold text-[var(--fc-text)]">Next action</p>
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
              <MiniMetric label="Budget" value={detectedBudget} />
              <MiniMetric label="Deadline" value={detectedDeadline} />
              <MiniMetric label="Owner" value={analysis.jackie.suggestedAgent || "Jackie"} />
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
            {isWorkspacePlan ? `${workspaceLabel} workspace` : "Next step"}
          </p>
          <p className="mt-1 text-sm font-bold text-[var(--fc-text)]">
            {isWorkspacePlan ? "Continue from your workspace." : "Save the next conversations with Pro."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard" className="fc-button fc-button-primary">
            <LayoutDashboard aria-hidden="true" className="h-4 w-4" />
            Dashboard
          </Link>

          {isWorkspacePlan ? (
            <Link href="/leads" className="fc-button">
              Leads
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          ) : (
            <a href={manualProHref} className="fc-button">
              Pro access
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          )}
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
          Ready
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
          {isWorkspacePlan ? `Saved to ${workspaceLabel}` : "Saved to workspace"}
        </span>
        <span className="flow-mono text-xs">{lead.id.slice(0, 8)}</span>
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
  const isWorkspace = Boolean(usage && isPaidWorkspacePlan(usage.plan));

  return (
    <div className="mt-4 rounded-3xl border border-red-400/20 bg-red-400/10 p-4 text-sm leading-6 text-red-100">
      <p className="font-extrabold text-white">
        {isWorkspace ? "Periodo esaurito" : "Lead gratuito gia usato"}
      </p>
      <p className="mt-1">
        {isWorkspace
          ? "Il workspace ha raggiunto il limite del periodo."
          : "Passa a Pro per continuare ad analizzare conversazioni."}
      </p>
      {!isWorkspace ? (
        <a href={manualProHref} className="fc-button fc-button-primary mt-4">
          Richiedi accesso Pro
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      ) : null}
    </div>
  );
}

function ErrorCallout({ error }: { error: TrialError }) {
  return (
    <div className="mt-4 rounded-3xl border border-red-400/20 bg-red-400/10 p-4 text-sm leading-6 text-red-100" role="alert">
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
            FlowCrew ha salvato il miglior risultato disponibile, ma una parte della analisi e stata ricostruita.
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
        message: "In questo ambiente l area account non e pronta. Puoi riprovare quando il workspace e configurato.",
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
