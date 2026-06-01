"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CalendarCheck2,
  CheckCircle2,
  FileText,
  Lock,
  Radar,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";

type TrialForm = {
  leadName: string;
  businessType: string;
  project: string;
  budget: string;
  timeline: string;
  notes: string;
};

type TrialResult = {
  id: string;
  createdAt: string;
  input: TrialForm;
  jackie: {
    score: number;
    heat: string;
    reason: string;
  };
  nora: {
    range: string;
    scope: string[];
  };
  milo: {
    timing: string;
    message: string;
  };
  dex: {
    handoffLog: string[];
  };
};

const trialStorageKey = "flowcrew:trial:one-lead:v1";

const initialForm: TrialForm = {
  leadName: "Studio Aurora",
  businessType: "Creative studio",
  project: "Website refresh before launch",
  budget: "700-1200 EUR",
  timeline: "This month",
  notes:
    "They need a premium dark landing, clearer offer, stronger CTA, and a clean follow-up path before launch.",
};

const fieldClass =
  "mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-white/25 focus:border-fuchsia-200/50 focus:bg-white/[0.06]";

function clampScore(score: number) {
  return Math.min(96, Math.max(62, score));
}

function buildTrialResult(input: TrialForm): TrialResult {
  const signal = Object.values(input).join(" ").toLowerCase();
  const hasUrgency = /(launch|urgent|soon|week|month|deadline|asap)/i.test(signal);
  const hasBudget = /\d|eur|€|budget|range/i.test(signal);
  const hasConversionGoal = /(cta|lead|sales|conversion|booking|client|revenue)/i.test(signal);
  const hasWebsiteScope = /(site|website|landing|webflow|page|funnel)/i.test(signal);

  const score = clampScore(
    72 + (hasUrgency ? 8 : 0) + (hasBudget ? 6 : 0) + (hasConversionGoal ? 6 : 0) + (hasWebsiteScope ? 5 : 0),
  );

  const heat = score >= 88 ? "HOT" : score >= 76 ? "WARM" : "NURTURE";
  const budget = input.budget.trim() || "700-1200 EUR";
  const timeline = input.timeline.trim() || "48 hours";
  const leadName = input.leadName.trim() || "New inbound lead";
  const project = input.project.trim() || "Client project";

  return {
    id: `trial-${Date.now()}`,
    createdAt: new Date().toISOString(),
    input: { ...input, leadName, project, budget, timeline },
    jackie: {
      score,
      heat,
      reason: `${leadName} has clear intent, visible scope, and enough timing/budget signal to deserve a fast sales motion.`,
    },
    nora: {
      range: budget,
      scope: [
        `Position the offer around: ${project}.`,
        "Define one polished deliverable, one optional upsell, and one clear approval step.",
        "Keep the first proposal premium but lightweight: audit, build, revision, handoff.",
      ],
    },
    milo: {
      timing: hasUrgency ? "Follow up in 24 hours" : "Follow up in 48 hours",
      message: `Send a calm check-in after ${timeline}: confirm the priority, restate the value, and ask for the next decision.`,
    },
    dex: {
      handoffLog: [
        "Lead captured from Free Trial - 1 Lead.",
        `Jackie scored ${leadName} at ${score}/100 and marked it ${heat}.`,
        `Nora prepared proposal range ${budget} with a compact scope.`,
        "Milo queued the follow-up timing and reply angle.",
        "Dex logged Lead -> Jackie -> Nora -> Milo as the reusable handoff path.",
      ],
    },
  };
}

function readStoredTrial(): TrialResult | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(trialStorageKey);
    return stored ? (JSON.parse(stored) as TrialResult) : null;
  } catch {
    window.localStorage.removeItem(trialStorageKey);
    return null;
  }
}

function UpgradePanel() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[2.2rem] border border-fuchsia-300/25 bg-gradient-to-br from-fuchsia-300/15 via-white/[0.07] to-cyan-300/10 p-6 shadow-2xl shadow-fuchsia-500/10 backdrop-blur md:p-8"
    >
      <div className="absolute right-[-5rem] top-[-5rem] h-48 w-48 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="absolute bottom-[-5rem] left-[-5rem] h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-fuchsia-100">
            <Lock aria-hidden="true" className="h-4 w-4" />
            Trial complete
          </div>
          <h2 className="text-3xl font-black tracking-[-0.04em] text-white md:text-5xl">
            Your free lead is complete. Upgrade to keep your Crew running.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/60">
            Pro unlocks repeated lead runs, stronger reasoning, dashboard momentum,
            and a full operating loop for Jackie, Nora, Milo, and Dex.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            href="/#pricing"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-white/10 transition hover:scale-[1.02]"
          >
            Upgrade to Pro
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-sm font-black text-white backdrop-blur transition hover:bg-white/15"
          >
            View dashboard
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

function AgentOutput({ result }: { result: TrialResult }) {
  const cards = [
    {
      name: "Jackie lead score",
      Icon: Radar,
      accent: "text-fuchsia-100",
      body: `${result.jackie.score}/100 - ${result.jackie.heat}`,
      detail: result.jackie.reason,
    },
    {
      name: "Nora proposal range and scope",
      Icon: FileText,
      accent: "text-violet-100",
      body: result.nora.range,
      detail: result.nora.scope.join(" "),
    },
    {
      name: "Milo follow-up timing",
      Icon: CalendarCheck2,
      accent: "text-cyan-100",
      body: result.milo.timing,
      detail: result.milo.message,
    },
    {
      name: "Dex handoff log",
      Icon: Workflow,
      accent: "text-emerald-100",
      body: "Flow logged",
      detail: result.dex.handoffLog.join(" "),
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="space-y-5"
    >
      <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-200">
              Full agent output
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white md:text-5xl">
              {result.input.leadName} is ready for a sales motion.
            </h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-black text-emerald-100">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            1/1 lead used
          </span>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.Icon;

            return (
              <article
                key={card.name}
                className="rounded-[1.8rem] border border-white/10 bg-black/25 p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08]">
                    <Icon aria-hidden="true" className={`h-5 w-5 ${card.accent}`} />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-white/35">
                      {card.name}
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-white">{card.body}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/58">{card.detail}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-5 rounded-[1.8rem] border border-white/10 bg-black/30 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white/75">
            <Zap aria-hidden="true" className="h-4 w-4 text-fuchsia-200" />
            Dex handoff trace
          </div>
          <div className="space-y-2 font-mono text-xs text-white/55">
            {result.dex.handoffLog.map((item, index) => (
              <div key={item} className="flex gap-2">
                <span className="text-fuchsia-200">0{index + 1}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <UpgradePanel />
    </motion.section>
  );
}

export default function TrialPage() {
  const [form, setForm] = useState<TrialForm>(initialForm);
  const [result, setResult] = useState<TrialResult | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedTrial = readStoredTrial();

    window.setTimeout(() => {
      setResult(storedTrial);
      setIsHydrated(true);
    }, 0);
  }, []);

  const isComplete = Boolean(result);

  const formFields = useMemo(
    () => [
      { key: "leadName", label: "Lead name", placeholder: "Studio Aurora" },
      { key: "businessType", label: "Business type", placeholder: "Creative studio" },
      { key: "project", label: "Project request", placeholder: "Website refresh before launch" },
      { key: "budget", label: "Budget / range", placeholder: "700-1200 EUR" },
      { key: "timeline", label: "Timeline", placeholder: "This month" },
    ] as const,
    [],
  );

  function updateField(key: keyof TrialForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readStoredTrial()) {
      setResult(readStoredTrial());
      return;
    }

    const nextResult = buildTrialResult(form);
    window.localStorage.setItem(trialStorageKey, JSON.stringify(nextResult));
    setResult(nextResult);
  }

  return (
    <main className="flow-bg relative min-h-screen overflow-hidden">
      <div className="flow-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-fuchsia-600/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10rem] right-[-6rem] h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[-8rem] top-1/3 h-[26rem] w-[26rem] rounded-full bg-violet-600/10 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-[1280px] items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="FlowCrew">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-fuchsia-100 shadow-2xl shadow-fuchsia-500/20 backdrop-blur">
            <Bot aria-hidden="true" className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight text-white">
              FlowCrew
            </span>
            <span className="block text-xs text-white/45">Free Trial - 1 Lead</span>
          </span>
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 sm:px-5"
        >
          View dashboard
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid max-w-[1280px] gap-8 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:sticky lg:top-8"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/25 bg-fuchsia-300/10 px-4 py-2 text-sm font-semibold text-fuchsia-50 shadow-2xl shadow-fuchsia-500/10">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Free Trial - 1 Lead
          </div>
          <h1 className="premium-display max-w-[720px] text-white">
            Run one real lead through your AI Crew.
          </h1>
          <p className="mt-6 max-w-[620px] text-lg font-medium leading-8 text-white/70">
            Submit one lead locally. Jackie scores it, Nora shapes the proposal,
            Milo protects the follow-up, and Dex logs the handoff. No Stripe, no
            auth, no backend yet.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["Jackie score", "Nora scope", "Milo timing", "Dex log"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-bold text-white/70 backdrop-blur"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-6">
          {!isHydrated ? (
            <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.06] p-8 text-white/55 backdrop-blur">
              Loading trial...
            </div>
          ) : isComplete && result ? (
            <AgentOutput result={result} />
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              onSubmit={handleSubmit}
              className="rounded-[2.2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-fuchsia-500/5 backdrop-blur md:p-8"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-200">
                    Trial lead input
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
                    Your first run is free.
                  </h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/50">
                  0/1 used
                </span>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {formFields.map((field) => (
                  <label key={field.key} className="text-sm font-bold text-white/72">
                    {field.label}
                    <input
                      className={fieldClass}
                      value={form[field.key]}
                      placeholder={field.placeholder}
                      onChange={(event) => updateField(field.key, event.target.value)}
                    />
                  </label>
                ))}
              </div>

              <label className="mt-4 block text-sm font-bold text-white/72">
                Raw client context
                <textarea
                  className={`${fieldClass} min-h-32 resize-none leading-7`}
                  value={form.notes}
                  placeholder="Paste the client message, constraints, tone, and goal."
                  onChange={(event) => updateField("notes", event.target.value)}
                />
              </label>

              <button
                type="submit"
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-white/10 transition hover:scale-[1.01]"
              >
                Run free lead
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition group-hover:translate-x-1"
                />
              </button>
            </motion.form>
          )}

          {!isComplete ? (
            <div className="rounded-[1.8rem] border border-white/10 bg-black/25 p-5 text-sm leading-7 text-white/50 backdrop-blur">
              This trial uses localStorage to allow exactly one lead run on this
              browser. Clearing site data resets the local demo, but the product
              story remains upgrade-first.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

