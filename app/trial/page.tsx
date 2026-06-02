"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Database,
  LoaderCircle,
  MessageSquareText,
  Sparkles,
  Tags,
  WandSparkles,
} from "lucide-react";
import AgentAvatar from "@/components/AgentAvatar";
import { agentOrder, agentRoles } from "@/lib/agent-roles";
import type { AgentId } from "@/lib/data";
import type { ConversationAnalysis, ConversationSource } from "@/lib/flowcrew-types";
import type { StoredLead } from "@/lib/leads";
import { trialDraftStorageKey } from "@/lib/trial-draft";

const agents: Array<{ id: AgentId; name: string; role: string; detail: string }> = agentOrder.map((id) => ({
  id,
  name: agentRoles[id].name,
  role: agentRoles[id].title,
  detail: agentRoles[id].workflowAction,
}));

const sample = `Ciao, volevo capire quanto costa fare un sito per il mio studio. Ho scritto anche via mail e ti ho mandato il logo. Mi servirebbe abbastanza presto, forse anche una pagina prenotazioni collegata al calendario. Possiamo sentirci domani?`;

const loadingSteps = [
  "Jackie is analyzing the message",
  "Dex is assigning tags, category, priority and status",
  "Nora is evaluating urgency, quality, risk and next actions",
  "Milo is preparing a reply and follow-up",
];

const resultPreview = ["Summary", "Priority", "Tags", "Next action", "Reply draft"];

type IngestResponse = {
  analysis: ConversationAnalysis;
  lead: StoredLead;
};

const sourceOptions: Array<{ value: ConversationSource; label: string }> = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "gmail", label: "Gmail" },
  { value: "instagram", label: "Instagram" },
  { value: "email", label: "Email" },
  { value: "notes", label: "Manual notes" },
  { value: "other", label: "Other" },
];

export default function TrialPage() {
  const [clientName, setClientName] = useState("Marco Bianchi");
  const [sourceType, setSourceType] = useState<ConversationSource>("whatsapp");
  const [businessType, setBusinessType] = useState("Web agency / local service business");
  const [goal, setGoal] = useState("Create a clean lead brief, priority, next action and premium reply.");
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
      // The trial remains usable when storage is unavailable.
    }
  }, []);

  const generated = Boolean(result);
  const analysis = result?.analysis;
  const lead = result?.lead;

  const detectedTags = useMemo(() => {
    if (analysis?.dex.tags.length) return analysis.dex.tags;
    return ["Quote", "Urgency", "Next step"];
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
    <main className="relative min-h-screen overflow-hidden bg-[#f6f8fc] text-slate-950" id="main-content" tabIndex={-1}>
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-14%] top-[-18%] h-[34rem] w-[34rem] rounded-full bg-indigo-300/24 blur-[130px]" />
        <div className="absolute right-[-14%] top-[3%] h-[34rem] w-[34rem] rounded-full bg-cyan-200/26 blur-[130px]" />
        <div className="absolute bottom-[-20%] left-[38%] h-[30rem] w-[30rem] rounded-full bg-violet-300/18 blur-[130px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/82 px-4 py-2 text-sm font-black text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <Link href="/leads" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)]">
            View saved leads <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <section className="grid gap-7 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div className="self-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/82 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700 shadow-[0_10px_25px_rgba(37,99,235,0.07)] backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" />
              Real AI + Supabase lead save
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.075em] text-slate-950 md:text-7xl">
              Paste a messy lead. FlowCrew saves the clean brief.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              This page now uses Gemini on the server and writes the generated lead card to your Supabase <b>leads</b> table.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {agents.map((agent) => (
                <div key={agent.id} className="rounded-[1.65rem] border border-slate-200 bg-white/82 p-4 text-center shadow-[0_16px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl">
                  <AgentAvatar agentId={agent.id} decorative size="md" className="mx-auto" />
                  <p className="mt-3 text-sm font-black text-slate-950">{agent.name}</p>
                  <p className="text-xs font-bold text-slate-500">{agent.role}</p>
                </div>
              ))}
            </div>
          </div>

          <form
            aria-busy={isLoading}
            className="rounded-[2.35rem] border border-slate-200 bg-white/86 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-6"
            onSubmit={generateLead}
          >
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Live ingest</p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.05em]">Conversation analyzer</h2>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                <WandSparkles className="h-5 w-5" />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="block text-sm font-black text-slate-700">
                Client name
                <input
                  autoComplete="name"
                  name="clientName"
                  type="text"
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="block text-sm font-black text-slate-700">
                Source
                <select
                  autoComplete="off"
                  name="sourceType"
                  value={sourceType}
                  onChange={(event) => setSourceType(event.target.value as ConversationSource)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  {sourceOptions.map((source) => (
                    <option key={source.value} value={source.value}>{source.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="block text-sm font-black text-slate-700">
                Business context
                <input
                  autoComplete="organization"
                  name="businessType"
                  type="text"
                  value={businessType}
                  onChange={(event) => setBusinessType(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="block text-sm font-black text-slate-700">
                Goal
                <input
                  autoComplete="off"
                  name="goal"
                  type="text"
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>
            </div>

            <div className="mt-4 rounded-[1.35rem] border border-blue-100 bg-blue-50/65 p-4">
              <p className="text-sm font-bold leading-6 text-blue-950" id="client-conversation-help">
                Paste a messy client message. FlowCrew will return a summary, urgency level, tags, next action, and a reply draft.
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {resultPreview.map((item) => (
                  <li className="rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-100" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <label className="block text-sm font-black text-slate-700" htmlFor="client-conversation">
                Client conversation
              </label>
              <button className="text-xs font-black text-blue-700 transition hover:text-blue-950" onClick={() => setMessage(sample)} type="button">
                Use example
              </button>
            </div>
            <textarea
              aria-describedby="client-conversation-help"
              id="client-conversation"
              name="messyMessage"
              autoComplete="off"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={sample}
              rows={8}
              className="mt-2 w-full resize-none rounded-[1.35rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 px-5 py-4 text-sm font-black text-white shadow-[0_18px_40px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <>
                  <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Building your client brief...
                </>
              ) : (
                <>
                  Generate and save lead
                  <Sparkles aria-hidden="true" className="h-4 w-4" />
                </>
              )}
            </button>

            {isLoading ? (
              <div aria-live="polite" className="mt-4 rounded-[1.35rem] border border-blue-100 bg-blue-50/75 p-4" role="status">
                <div className="flex items-center gap-2 text-sm font-black text-blue-900">
                  <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Your Crew is working through the conversation
                </div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {loadingSteps.map((step) => (
                    <li className="flex items-center gap-2 text-xs font-bold text-blue-800/80" key={step}>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {error ? (
              <div className="mt-4 flex gap-3 rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold leading-6 text-rose-800" role="alert">
                <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
                {error}
              </div>
            ) : null}

            {lead ? (
              <div aria-live="polite" className="mt-4 flex items-center gap-2 rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-black text-emerald-800" role="status">
                <Database aria-hidden="true" className="h-5 w-5" />
                Saved in Supabase as lead <span className="font-mono text-xs">{lead.id.slice(0, 8)}</span>
              </div>
            ) : null}

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <ResultCard icon={<ClipboardList className="h-5 w-5" />} title="Clean brief" active={generated}>
                <OutputLine label="Client" value={lead?.sender_name ?? "Waiting for input"} />
                <OutputLine label="Request" value={lead?.request ?? "—"} />
                <OutputLine label="Priority" value={lead?.urgency ?? "—"} />
              </ResultCard>

              <ResultCard icon={<Tags className="h-5 w-5" />} title="Smart tags" active={generated}>
                <div className="flex flex-wrap gap-2">
                  {detectedTags.map((tag) => (
                    <span key={tag} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700 ring-1 ring-blue-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </ResultCard>

              <ResultCard icon={<CheckCircle2 className="h-5 w-5" />} title="Next action" active={generated} className="md:col-span-2">
                <p className="text-sm leading-6 text-slate-600">{lead?.next_action ?? "Generate the brief to see the recommended next step."}</p>
              </ResultCard>

              <ResultCard icon={<MessageSquareText className="h-5 w-5" />} title="Premium reply" active={generated} className="md:col-span-2">
                <div className="rounded-2xl bg-slate-950 p-4 text-white">
                  <p className="text-sm leading-6 text-slate-200">
                    {lead?.suggested_reply ?? "La risposta comparirà qui dopo l’analisi del lead."}
                  </p>
                </div>
              </ResultCard>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function ResultCard({
  icon,
  title,
  active,
  children,
  className = "",
}: {
  icon: ReactNode;
  title: string;
  active: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`rounded-[1.45rem] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-black text-slate-950">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-blue-50 text-blue-600">{icon}</span>
          {title}
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-black ${active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          {active ? "Ready" : "Idle"}
        </span>
      </div>
      {children}
    </article>
  );
}

function OutputLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-3 border-t border-slate-100 py-2 first:border-t-0">
      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">{label}</span>
      <b className="text-sm text-slate-800">{value}</b>
    </div>
  );
}
