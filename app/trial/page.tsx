"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardList,
  FileText,
  LoaderCircle,
  Radar,
  Sparkles,
  Tags,
  Workflow,
} from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import AgentAvatar from "@/components/AgentAvatar";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";
import type { AgentId } from "@/lib/data";
import {
  conversationSourceValues,
  type ConversationAnalysis,
  type ConversationInput,
  type ConversationSource,
} from "@/lib/flowcrew-types";

type ConversationForm = Omit<ConversationInput, "language">;

const initialForm: ConversationForm = {
  clientName: "",
  sourceType: "whatsapp",
  messyMessage:
    "Ciao, scusa ti scrivo qui al volo. Mi servirebbe forse un sito o comunque qualcosa per promuovere un evento che facciamo a fine mese. Non so bene budget, dipende, però vorremmo vendere più biglietti e magari fare anche qualche post. Ah e forse ci serve anche una mail da mandare ai clienti vecchi. Si può fare veloce?",
  businessType: "",
  goal: "",
};

const previewAgentIds: AgentId[] = ["jackie", "dex", "nora", "milo"];
const replyKeys = [
  "professional",
  "friendly",
  "short",
  "firmButPolite",
] as const;

function FieldLabel({ children }: { children: string }) {
  return <span className="text-sm font-black text-slate-200">{children}</span>;
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.22em] text-white/38">
        {title}
      </p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-cyan-100" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TrialPage() {
  const { copy, language } = useLanguage();
  const [form, setForm] = useState<ConversationForm>(initialForm);
  const [result, setResult] = useState<ConversationAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTone, setSelectedTone] = useState(0);
  const [replyDraft, setReplyDraft] = useState("");
  const [isEditingReply, setIsEditingReply] = useState(false);
  const [replyStatus, setReplyStatus] = useState("");

  const selectedReply = result?.milo.replies[replyKeys[selectedTone]] ?? "";

  function updateForm<K extends keyof ConversationForm>(key: K, value: ConversationForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function runCrew() {
    setIsRunning(true);
    setErrorMessage("");
    setReplyStatus("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, language }),
      });
      const data = (await response.json()) as {
        analysis?: ConversationAnalysis;
        error?: string;
      };

      if (!response.ok || !data.analysis) {
        throw new Error(data.error || copy.trial.analysisError);
      }

      setResult(data.analysis);
      setSelectedTone(0);
      setReplyDraft(data.analysis.milo.replies.professional);
      setIsEditingReply(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : copy.trial.analysisError,
      );
    } finally {
      setIsRunning(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runCrew();
  }

  function selectTone(index: number) {
    setSelectedTone(index);
    setReplyDraft(result?.milo.replies[replyKeys[index]] ?? "");
    setReplyStatus("");
    setIsEditingReply(false);
  }

  async function copyReply() {
    try {
      await window.navigator.clipboard.writeText(replyDraft || selectedReply);
      setReplyStatus(copy.trial.replyCopied);
    } catch {
      setReplyStatus(copy.trial.copyError);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#060710] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute right-[-12%] top-[16%] h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/16 blur-[130px]" />
        <div className="absolute bottom-[-18%] left-[35%] h-[30rem] w-[30rem] rounded-full bg-violet-500/12 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060710]/72 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link className="group flex items-center gap-3" href="/">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 shadow-[0_0_34px_rgba(34,211,238,0.16)]">
              <Bot aria-hidden="true" className="h-5 w-5 text-cyan-100" />
            </span>
            <span>
              <span className="block text-lg font-black tracking-tight">FlowCrew</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.26em] text-cyan-100/55">
                AI Client Workspace
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            <Link
              className="hidden rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/15 sm:inline-flex"
              href="/dashboard"
            >
              {copy.nav.dashboard}
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:py-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-100/80">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            {copy.trial.label}
          </div>
          <h1 className="max-w-4xl text-5xl font-black tracking-[-0.07em] text-white sm:text-6xl">
            {copy.trial.heroTitle}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            {copy.trial.heroBody}
          </p>

          <div className="mt-8 rounded-[2rem] border border-cyan-200/15 bg-cyan-200/10 p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100/70">
              {copy.trial.previewLabel}
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">
              {copy.trial.previewTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {copy.trial.previewBody}
            </p>
            <div className="mt-5 space-y-3">
              {copy.trial.previewSteps.map(([agent, detail], index) => (
                <div
                  className="flex items-center gap-4 rounded-3xl border border-white/10 bg-[#0B1020]/72 p-4"
                  key={agent}
                >
                  <AgentAvatar agentId={previewAgentIds[index]} decorative size="sm" />
                  <div>
                    <p className="font-black text-white">{agent}</p>
                    <p className="mt-1 text-sm text-slate-400">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[2.25rem] border border-white/10 bg-white/[0.065] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/65">
                {copy.trial.intakeLabel}
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                {copy.trial.intakeTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {copy.trial.intakeBody}
              </p>
            </div>
            <span className="rounded-full border border-emerald-200/20 bg-emerald-200/10 px-3 py-1 text-xs font-black text-emerald-100">
              {result ? copy.trial.used : copy.trial.ready}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <FieldLabel>{copy.trial.fields.clientName}</FieldLabel>
                <input
                  value={form.clientName}
                  onChange={(event) => updateForm("clientName", event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/55"
                  placeholder={copy.trial.placeholders.clientName}
                />
              </label>
              <label>
                <FieldLabel>{copy.trial.fields.sourceType}</FieldLabel>
                <select
                  value={form.sourceType}
                  onChange={(event) =>
                    updateForm("sourceType", event.target.value as ConversationSource)
                  }
                  className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#111427] px-4 text-sm text-white outline-none transition focus:border-cyan-300/55"
                >
                  {conversationSourceValues.map((source, index) => (
                    <option key={source} value={source}>
                      {copy.trial.sourceOptions[index]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              <FieldLabel>{copy.trial.fields.messyMessage}</FieldLabel>
              <textarea
                required
                rows={8}
                value={form.messyMessage}
                onChange={(event) => updateForm("messyMessage", event.target.value)}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/55"
                placeholder={copy.trial.placeholders.messyMessage}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <FieldLabel>{copy.trial.fields.businessType}</FieldLabel>
                <input
                  value={form.businessType}
                  onChange={(event) => updateForm("businessType", event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/55"
                  placeholder={copy.trial.placeholders.businessType}
                />
              </label>
              <label>
                <FieldLabel>{copy.trial.fields.goal}</FieldLabel>
                <input
                  value={form.goal}
                  onChange={(event) => updateForm("goal", event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/55"
                  placeholder={copy.trial.placeholders.goal}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isRunning}
              className="inline-flex h-13 items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-6 py-4 text-base font-black text-slate-950 shadow-[0_0_44px_rgba(34,211,238,0.22)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-wait disabled:opacity-80"
            >
              {isRunning ? (
                <>
                  <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
                  {copy.trial.running}
                </>
              ) : (
                <>
                  {copy.trial.runButton}
                  <ArrowRight aria-hidden="true" className="h-5 w-5" />
                </>
              )}
            </button>

            <p className="text-xs font-semibold text-slate-500">{copy.trial.localOnly}</p>
            {errorMessage ? (
              <p
                className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm font-semibold text-rose-100"
                role="alert"
              >
                {errorMessage}
              </p>
            ) : null}
          </form>
        </div>
      </section>

      {result ? (
        <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8">
          <div className="mb-8">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-100/62">
              {copy.trial.resultsLabel}
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              {copy.trial.resultsTitle}
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-cyan-200/20 bg-cyan-200/10 p-6 shadow-2xl shadow-cyan-500/10">
              <div className="flex items-center gap-4">
                <AgentAvatar agentId="jackie" label="Jackie" size="md" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100/70">Jackie</p>
                  <h3 className="text-2xl font-black text-white">{copy.trial.jackieTitle}</h3>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-200">{result.jackie.cleanSummary}</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <ListBlock title={copy.trial.keyFacts} items={result.jackie.keyFacts} />
                <ListBlock title={copy.trial.missingInfo} items={result.jackie.missingInfo} />
                <ListBlock title={copy.trial.detectedTopics} items={result.jackie.detectedTopics} />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-white/38">
                    {copy.trial.suggestedAgent}
                  </p>
                  <p className="mt-3 rounded-2xl border border-white/10 bg-[#0B1020]/70 p-4 text-sm leading-6 text-white/80">
                    {result.jackie.suggestedAgent}
                  </p>
                </div>
              </div>
              <p className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-cyan-50">
                {copy.trial.transitionJackieDex}
              </p>
            </article>

            <article className="rounded-[2rem] border border-rose-200/20 bg-rose-200/10 p-6 shadow-2xl shadow-rose-500/10">
              <div className="flex items-center gap-4">
                <AgentAvatar agentId="dex" label="Dex" size="md" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-rose-100/70">Dex</p>
                  <h3 className="text-2xl font-black text-white">{copy.trial.dexTitle}</h3>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {result.dex.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black text-white/80">
                    <Tags aria-hidden="true" className="h-3.5 w-3.5 text-rose-100" />
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoBlock icon={<ClipboardList className="h-4 w-4 text-rose-100" />} label={copy.trial.priority} value={result.dex.priority} />
                <InfoBlock icon={<Workflow className="h-4 w-4 text-rose-100" />} label={copy.trial.category} value={result.dex.category} />
              </div>
              <p className="mt-5 rounded-2xl border border-white/10 bg-[#0B1020]/70 p-4 text-sm leading-6 text-white/80">
                {result.dex.crmNote}
              </p>
              <div className="mt-5">
                <ListBlock title={copy.trial.nextSteps} items={result.dex.nextSteps} />
              </div>
              <p className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-rose-50">
                {copy.trial.transitionDexNora}
              </p>
            </article>

            <article className="rounded-[2rem] border border-fuchsia-200/20 bg-fuchsia-200/10 p-6 shadow-2xl shadow-fuchsia-500/10">
              <div className="flex items-center gap-4">
                <AgentAvatar agentId="nora" label="Nora" size="md" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-fuchsia-100/70">Nora</p>
                  <h3 className="text-2xl font-black text-white">{copy.trial.noraTitle}</h3>
                </div>
              </div>
              <p className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-fuchsia-50">
                {copy.trial.transitionJackieNora}
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <InfoBlock icon={<Radar className="h-4 w-4 text-fuchsia-100" />} label={copy.trial.opportunityStatus} value={result.nora.status} />
                <InfoBlock icon={<Sparkles className="h-4 w-4 text-fuchsia-100" />} label={copy.trial.profitabilitySignal} value={result.nora.profitabilitySignal} />
                <InfoBlock icon={<FileText className="h-4 w-4 text-fuchsia-100" />} label={copy.trial.riskLevel} value={result.nora.riskLevel} />
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-200">{result.nora.why}</p>
              <div className="mt-5">
                <ListBlock title={copy.trial.questions} items={result.nora.questions} />
              </div>
              <p className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-fuchsia-50">
                {copy.trial.transitionNoraMilo}
              </p>
            </article>

            <article className="rounded-[2rem] border border-violet-200/20 bg-violet-200/10 p-6 shadow-2xl shadow-violet-500/10">
              <div className="flex items-center gap-4">
                <AgentAvatar agentId="milo" label="Milo" size="md" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-100/70">Milo</p>
                  <h3 className="text-2xl font-black text-white">{copy.trial.miloTitle}</h3>
                </div>
              </div>
              <div className="mt-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/38">
                  {copy.trial.toneSelector}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {copy.trial.tones.map((toneOption, index) => (
                    <button
                      type="button"
                      key={toneOption}
                      onClick={() => selectTone(index)}
                      className={`rounded-full px-3 py-2 text-xs font-black transition ${
                        selectedTone === index
                          ? "bg-white text-slate-950"
                          : "border border-white/10 bg-white/10 text-white/70 hover:bg-white/15"
                      }`}
                    >
                      {toneOption}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-5 rounded-3xl border border-white/10 bg-[#0B1020]/75 p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/38">
                  {copy.trial.suggestedReply}
                </p>
                {isEditingReply ? (
                  <textarea
                    className="mt-3 min-h-40 w-full resize-y rounded-2xl border border-white/10 bg-black/20 p-3 text-sm leading-7 text-slate-200 outline-none focus:border-violet-200/50"
                    value={replyDraft}
                    onChange={(event) => setReplyDraft(event.target.value)}
                  />
                ) : (
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-200">
                    {replyDraft || selectedReply}
                  </p>
                )}
              </div>
              <p className="mt-5 rounded-2xl border border-violet-200/20 bg-violet-200/10 p-4 text-sm font-black text-violet-50">
                {copy.trial.miloConfirm}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <button
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950"
                  onClick={() => void copyReply()}
                  type="button"
                >
                  {copy.trial.useReply}
                </button>
                <button
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white disabled:cursor-wait disabled:opacity-70"
                  disabled={isRunning}
                  onClick={() => void runCrew()}
                  type="button"
                >
                  {copy.trial.regenerate}
                </button>
                <button
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white"
                  onClick={() => setIsEditingReply((current) => !current)}
                  type="button"
                >
                  {copy.trial.edit}
                </button>
              </div>
              {replyStatus ? (
                <p className="mt-3 text-sm font-semibold text-violet-100" role="status">
                  {replyStatus}
                </p>
              ) : null}
            </article>
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-300/14 via-fuchsia-400/10 to-violet-500/14 p-8 text-center shadow-2xl shadow-black/25">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/70">
              {copy.trial.upgradeLabel}
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-black tracking-[-0.05em] text-white">
              {copy.trial.upgradeTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              {copy.trial.upgradeBody}
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 font-black text-slate-950" href="/#pricing">
                {copy.trial.upgrade}
              </Link>
              <Link className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-6 py-4 font-black text-white" href="/dashboard">
                {copy.trial.dashboard}
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function InfoBlock({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1020]/70 p-4">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/38">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}
