"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Inbox,
  LoaderCircle,
  Mail,
  Sparkles,
} from "lucide-react";
import LeadResult from "@/components/LeadResult";
import { demoLeads } from "@/lib/data";
import type {
  ConversationAnalysis,
  ConversationSource,
  LeadAnalysisResult,
} from "@/lib/flowcrew-types";

export type LeadInput = {
  name: string;
  email: string;
  projectType: string;
  complexity: string;
  message: string;
};

const initialForm: LeadInput = {
  name: "Studio Aurora",
  email: "hello@studioaurora.it",
  projectType: "Confused request",
  complexity: "Needs clarification",
  message:
    "We need a polished website refresh for a launch this month. The current site feels dated and we want a clear conversion path.",
};

const crewPulse = [
  "Jackie is ranking fit and urgency...",
  "Nora is shaping a clean scope...",
  "Milo is setting a reliable follow-up window...",
  "Dex is writing the handoff trace...",
];

export default function LeadInboxDemo() {
  const [form, setForm] = useState<LeadInput>(initialForm);
  const [result, setResult] = useState<LeadAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const pulseTimer = setInterval(() => {
      setPulseIndex((current) => (current + 1) % crewPulse.length);
    }, 320);

    return () => clearInterval(pulseTimer);
  }, [isRunning]);

  function updateForm<K extends keyof LeadInput>(key: K, value: LeadInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsRunning(true);
    setPulseIndex(0);
    setResult(null);
    setErrorMessage("");

    try {
      const sourceType: ConversationSource = form.projectType
        .toLowerCase()
        .includes("gmail")
        ? "gmail"
        : form.projectType.toLowerCase().includes("whatsapp")
          ? "whatsapp"
          : "other";
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: form.name,
          sourceType,
          messyMessage: form.message,
          businessType: form.projectType,
          goal: form.complexity,
          language: "en",
        }),
      });
      const data = (await response.json()) as {
        analysis?: ConversationAnalysis;
        error?: string;
      };

      if (!response.ok || !data.analysis) {
        throw new Error(data.error || "Gemini could not analyze this conversation.");
      }

      setResult({
        leadName: form.name.trim() || "New client",
        generatedAt: "Just now",
        analysis: data.analysis,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gemini could not analyze this conversation.",
      );
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="glass-panel rounded-[1.6rem] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-cyan-200">
              <Inbox aria-hidden="true" className="h-4 w-4" />
              Client Inbox
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
              Drop a messy client message. Watch the crew organize it.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              Paste one client conversation. Gemini powers the Crew analysis while the API key stays safely on the server.
            </p>
          </div>
          <div className="rounded-full border border-violet-300/25 bg-violet-300/10 px-4 py-2 text-sm font-semibold text-violet-100">
            Free Trial - 1 Conversation
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.72fr]">
        <form
          onSubmit={handleSubmit}
          className="glass-panel rounded-[1.6rem] p-5 sm:p-6"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/15 text-cyan-200">
              <Mail aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">New conversation</h2>
              <p className="mt-1 text-sm text-slate-500">
                The prototype analyzes this message with Gemini and does not save it.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-300">
              Name
              <input
                required
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/55 focus:bg-white/[0.07]"
                placeholder="Client or source name"
              />
            </label>
            <label className="text-sm font-medium text-slate-300">
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
                className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/55 focus:bg-white/[0.07]"
                placeholder="hello@client.com"
              />
            </label>
            <label className="text-sm font-medium text-slate-300">
              Conversation type
              <select
                value={form.projectType}
                onChange={(event) => updateForm("projectType", event.target.value)}
                className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#111427] px-4 text-sm text-white outline-none transition focus:border-cyan-300/55"
              >
                <option>WhatsApp request</option>
                <option>Confused request</option>
                <option>Event inquiry</option>
                <option>Gmail request</option>
                <option>Not sure yet</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-300">
              Clarity level
              <select
                value={form.complexity}
                onChange={(event) => updateForm("complexity", event.target.value)}
                className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#111427] px-4 text-sm text-white outline-none transition focus:border-cyan-300/55"
              >
                <option>Info incomplete</option>
                <option>Needs clarification</option>
                <option>Multiple topics</option>
                <option>High urgency</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-300 sm:col-span-2">
              Messy message
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(event) => updateForm("message", event.target.value)}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/55 focus:bg-white/[0.07]"
                placeholder="Paste the messy client message..."
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isRunning}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-cyan-200 px-6 text-sm font-semibold text-slate-950 transition hover:bg-white disabled:cursor-wait disabled:opacity-80 sm:w-auto"
          >
            {isRunning ? (
              <>
                <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                Crew is reading
              </>
            ) : (
              <>
                Run the Crew
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </>
            )}
          </button>
          {errorMessage ? (
            <p
              className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm font-semibold text-rose-100"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}
        </form>

        <aside className="glass-panel rounded-[1.6rem] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-300/15 text-violet-100">
              <Bot aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Crew pulse
              </p>
              <h2 className="mt-1 text-xl font-semibold text-white">
                Crew is sorting the chaos
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {crewPulse.map((pulse, index) => (
              <div
                key={pulse}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-sm transition ${
                  isRunning && pulseIndex === index
                    ? "border-cyan-300/35 bg-cyan-300/10 text-cyan-50"
                    : "border-white/10 bg-white/[0.04] text-slate-400"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isRunning && pulseIndex === index
                      ? "bg-cyan-200 shadow-[0_0_18px_rgba(81,229,255,0.9)]"
                      : "bg-slate-600"
                  }`}
                />
                {pulse}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4">
            <div className="flex gap-3">
              <Sparkles
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-lime-200"
              />
              <p className="text-sm leading-6 text-lime-50">
                Try changing the message. Jackie, Dex, Nora, and Milo now react to a real Gemini analysis.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key={`${result.leadName}-${result.generatedAt}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <LeadResult result={result} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <section className="glass-panel rounded-[1.6rem] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Client inbox
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Conversations already moving
            </h2>
          </div>
          <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
            Demo conversations
          </span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {demoLeads.map((lead) => (
            <article
              key={lead.id}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{lead.name}</p>
                <span className="text-sm font-semibold text-cyan-100">
                  {lead.score}/100
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{lead.projectType}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
                {lead.status} - {lead.scope}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
