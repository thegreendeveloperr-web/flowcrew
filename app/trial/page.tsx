"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  MailCheck,
  Radar,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage, type Language } from "@/components/LanguageProvider";
import AgentAvatar from "@/components/AgentAvatar";
import type { AgentId } from "@/lib/data";

const trialStorageKey = "flowcrew:trial:one-lead:v2";

const projectValues = ["website", "funnel", "automation", "other"] as const;
const budgetValues = ["confirm", "under1k", "1k3k", "3k5k", "over5k"] as const;

type ProjectValue = (typeof projectValues)[number];
type BudgetValue = (typeof budgetValues)[number];

type TrialForm = {
  businessName: string;
  leadMessage: string;
  budget: BudgetValue;
  projectType: ProjectValue;
  goal: string;
};

type TrialResult = {
  jackie: {
    score: number;
    status: string;
    reasons: string[];
  };
  nora: {
    proposalRange: string;
    scope: string;
    rationale: string;
  };
  milo: {
    message: string;
    timing: string;
  };
  dex: {
    summary: string;
    nextSteps: string[];
  };
};

type TrialCopy = ReturnType<typeof useLanguage>["copy"]["trial"];

const initialForm: TrialForm = {
  businessName: "",
  leadMessage: "",
  budget: "confirm",
  projectType: "website",
  goal: "",
};

const resultCards: Array<{
  id: AgentId;
  key: keyof TrialResult;
  agent: string;
  label: string;
  Icon: LucideIcon;
  accent: string;
}> = [
  {
    id: "jackie",
    key: "jackie",
    agent: "Jackie",
    label: "Lead Score",
    Icon: Radar,
    accent: "text-cyan-100",
  },
  {
    id: "nora",
    key: "nora",
    agent: "Nora",
    label: "Proposal Range",
    Icon: FileText,
    accent: "text-fuchsia-100",
  },
  {
    id: "milo",
    key: "milo",
    agent: "Milo",
    label: "Follow-up Message",
    Icon: MailCheck,
    accent: "text-violet-100",
  },
  {
    id: "dex",
    key: "dex",
    agent: "Dex",
    label: "Flow Log",
    Icon: Workflow,
    accent: "text-rose-100",
  },
];

const previewAgentIds: AgentId[] = ["jackie", "nora", "milo", "dex"];

function optionLabel(options: readonly string[], index: number) {
  return options[index] ?? options[0] ?? "";
}

function getProjectLabel(copy: TrialCopy, value: ProjectValue) {
  return optionLabel(copy.projectOptions, projectValues.indexOf(value));
}

function getBudgetLabel(copy: TrialCopy, value: BudgetValue) {
  return optionLabel(copy.budgetOptions, budgetValues.indexOf(value));
}

function isTrialForm(value: unknown): value is TrialForm {
  if (!value || typeof value !== "object") return false;

  const data = value as Partial<TrialForm>;

  return (
    typeof data.businessName === "string" &&
    typeof data.leadMessage === "string" &&
    typeof data.goal === "string" &&
    typeof data.budget === "string" &&
    budgetValues.includes(data.budget as BudgetValue) &&
    typeof data.projectType === "string" &&
    projectValues.includes(data.projectType as ProjectValue)
  );
}

function readStoredForm() {
  const stored = window.localStorage.getItem(trialStorageKey);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as unknown;
    if (isTrialForm(parsed)) return parsed;
  } catch {
    window.localStorage.removeItem(trialStorageKey);
  }

  window.localStorage.removeItem(trialStorageKey);
  return null;
}

function buildTrialResult(
  input: TrialForm,
  copy: TrialCopy,
  language: Language,
): TrialResult {
  const project = getProjectLabel(copy, input.projectType);
  const budget = getBudgetLabel(copy, input.budget);
  const hasBudget = input.budget !== "confirm";
  const hasDetailedMessage = input.leadMessage.trim().length > 150;
  const score = hasDetailedMessage ? 88 : 84;

  if (language === "it") {
    return {
      jackie: {
        score,
        status: "Hot Lead",
        reasons: [
          `Richiesta collegata a ${project.toLowerCase()} con bisogno operativo chiaro.`,
          input.goal
            ? `Obiettivo dichiarato: ${input.goal}.`
            : "Obiettivo da chiarire, ma il contesto è sufficiente per una prima qualifica.",
          hasBudget
            ? `Budget indicato (${budget}) utile per calibrare scope e priorità.`
            : "Budget da confermare: serve una domanda rapida prima della proposta finale.",
        ],
      },
      nora: {
        proposalRange: hasBudget ? budget : "Da confermare dopo discovery call",
        scope: `${project}: deliverable prioritari, una roadmap sintetica e criteri di successo misurabili.`,
        rationale:
          "La proposta dovrebbe puntare su impatto, chiarezza dei prossimi passi e riduzione dell'attrito decisionale.",
      },
      milo: {
        message: `Ciao, grazie per aver condiviso il contesto su ${project.toLowerCase()}.\n\nHo già una direzione chiara: prima allineiamo obiettivo, vincoli e priorità, poi ti propongo uno scope snello con deliverable e prossimi passi.\n\nTi va bene fissare una call breve per confermare i dettagli?`,
        timing: "Invia entro 2 ore, poi fai un follow-up leggero dopo 24 ore.",
      },
      dex: {
        summary: `${input.businessName} entra nel flusso trial con focus su ${project.toLowerCase()} e obiettivo "${input.goal || "da definire"}".`,
        nextSteps: [
          "Confermare budget e priorità decisionali.",
          "Preparare proposta con scope essenziale e deliverable chiari.",
          "Registrare risposta del lead e aggiornare il prossimo follow-up.",
        ],
      },
    };
  }

  return {
    jackie: {
      score,
      status: "Hot Lead",
      reasons: [
        `Request is tied to ${project.toLowerCase()} with a clear operational need.`,
        input.goal
          ? `Goal is already framed: ${input.goal}.`
          : "Goal still needs sharpening, but the context is strong enough for first qualification.",
        hasBudget
          ? `Budget signal (${budget}) gives Nora a practical scope boundary.`
          : "Budget is not confirmed yet, so the next reply should ask one clean qualifying question.",
      ],
    },
    nora: {
      proposalRange: hasBudget ? budget : "Confirm after discovery call",
      scope: `${project}: priority deliverables, a short roadmap, and measurable success criteria.`,
      rationale:
        "The offer should focus on business impact, a clear decision path, and low-friction next steps.",
    },
    milo: {
      message: `Hi, thanks for sharing the context around ${project.toLowerCase()}.\n\nI already see a clear direction: first we align on the goal, constraints, and priorities, then I can shape a lean scope with deliverables and next steps.\n\nWould a short call work to confirm the details?`,
      timing: "Send within 2 hours, then follow up lightly after 24 hours.",
    },
    dex: {
      summary: `${input.businessName} entered the trial workflow with focus on ${project.toLowerCase()} and goal "${input.goal || "to be confirmed"}".`,
      nextSteps: [
        "Confirm budget and decision priorities.",
        "Prepare a proposal with essential scope and clear deliverables.",
        "Log the lead reply and schedule the next follow-up.",
      ],
    },
  };
}

export default function TrialPage() {
  const { copy, language } = useLanguage();
  const [form, setForm] = useState<TrialForm>(initialForm);
  const [submittedForm, setSubmittedForm] = useState<TrialForm | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const storedForm = readStoredForm();
    if (storedForm) {
      window.setTimeout(() => setSubmittedForm(storedForm), 0);
    }
  }, []);

  const result = useMemo(
    () =>
      submittedForm ? buildTrialResult(submittedForm, copy.trial, language) : null,
    [copy.trial, language, submittedForm],
  );

  function updateForm<K extends keyof TrialForm>(key: K, value: TrialForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittedForm) return;

    const cleanForm: TrialForm = {
      businessName: form.businessName.trim(),
      leadMessage: form.leadMessage.trim(),
      budget: form.budget,
      projectType: form.projectType,
      goal: form.goal.trim(),
    };

    setIsRunning(true);

    window.setTimeout(() => {
      window.localStorage.setItem(trialStorageKey, JSON.stringify(cleanForm));
      setSubmittedForm(cleanForm);
      setIsRunning(false);
    }, 650);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#060710] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12%] top-[-10%] h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute right-[-10%] top-[20%] h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/16 blur-[130px]" />
        <div className="absolute bottom-[-18%] left-[32%] h-[32rem] w-[32rem] rounded-full bg-violet-500/12 blur-[120px]" />
      </div>

      <header className="relative z-20 border-b border-white/10 bg-[#060710]/74 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 shadow-[0_0_34px_rgba(34,211,238,0.16)]">
              <Bot aria-hidden="true" className="h-5 w-5 text-cyan-100" />
            </span>
            <span>
              <span className="block text-lg font-black tracking-tight">
                FlowCrew
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.26em] text-cyan-100/55">
                {copy.trial.label}
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            <Link
              className="hidden rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/15 sm:inline-flex"
              href="/"
            >
              Home
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 lg:pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-100">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            {copy.trial.label}
          </div>
          <h1 className="mt-6 text-5xl font-black tracking-[-0.07em] text-white sm:text-6xl">
            {copy.trial.heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            {copy.trial.heroBody}
          </p>
        </div>

        {result && submittedForm ? (
          <TrialResults
            copy={copy.trial}
            input={submittedForm}
            result={result}
          />
        ) : (
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
            <TrialLeadForm
              copy={copy.trial}
              form={form}
              isRunning={isRunning}
              onSubmit={handleSubmit}
              updateForm={updateForm}
            />
            <TrialPreview copy={copy.trial} />
          </div>
        )}
      </section>
    </main>
  );
}

function TrialLeadForm({
  copy,
  form,
  isRunning,
  onSubmit,
  updateForm,
}: {
  copy: TrialCopy;
  form: TrialForm;
  isRunning: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  updateForm: <K extends keyof TrialForm>(key: K, value: TrialForm[K]) => void;
}) {
  return (
    <form
      className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-7"
      onSubmit={onSubmit}
    >
      <div className="mb-7 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/65">
            {copy.intakeLabel}
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
            {copy.intakeTitle}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            {copy.intakeBody}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/15 bg-emerald-200/10 px-3 py-1.5 text-xs font-black text-emerald-100">
          <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
          {copy.ready}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 sm:col-span-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
            {copy.fields.businessName}
          </span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-[#0B1020]/82 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-white/25 focus:border-cyan-200/45"
            onChange={(event) =>
              updateForm("businessName", event.target.value)
            }
            placeholder={copy.placeholders.businessName}
            required
            value={form.businessName}
          />
        </label>

        <label className="space-y-2 sm:col-span-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
            {copy.fields.leadMessage}
          </span>
          <textarea
            className="min-h-36 w-full resize-none rounded-2xl border border-white/10 bg-[#0B1020]/82 px-4 py-3 text-sm font-semibold leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-cyan-200/45"
            onChange={(event) =>
              updateForm("leadMessage", event.target.value)
            }
            placeholder={copy.placeholders.leadMessage}
            required
            value={form.leadMessage}
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
            {copy.fields.budget}
          </span>
          <select
            className="w-full rounded-2xl border border-white/10 bg-[#0B1020]/82 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-200/45"
            onChange={(event) =>
              updateForm("budget", event.target.value as BudgetValue)
            }
            value={form.budget}
          >
            {budgetValues.map((value, index) => (
              <option className="bg-[#0B1020]" key={value} value={value}>
                {optionLabel(copy.budgetOptions, index)}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
            {copy.fields.projectType}
          </span>
          <select
            className="w-full rounded-2xl border border-white/10 bg-[#0B1020]/82 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-200/45"
            onChange={(event) =>
              updateForm("projectType", event.target.value as ProjectValue)
            }
            value={form.projectType}
          >
            {projectValues.map((value, index) => (
              <option className="bg-[#0B1020]" key={value} value={value}>
                {optionLabel(copy.projectOptions, index)}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 sm:col-span-2">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
            {copy.fields.goal}
          </span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-[#0B1020]/82 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-white/25 focus:border-cyan-200/45"
            onChange={(event) => updateForm("goal", event.target.value)}
            placeholder={copy.placeholders.goal}
            required
            value={form.goal}
          />
        </label>
      </div>

      <button
        className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-6 py-4 text-base font-black text-slate-950 shadow-[0_0_44px_rgba(34,211,238,0.28)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-wait disabled:opacity-70"
        disabled={isRunning}
        type="submit"
      >
        {isRunning ? copy.running : copy.runButton}
        <ArrowRight aria-hidden="true" className="h-5 w-5" />
      </button>
    </form>
  );
}

function TrialPreview({ copy }: { copy: TrialCopy }) {
  return (
    <aside className="rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-7">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-fuchsia-100/65">
        {copy.previewLabel}
      </p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
        {copy.previewTitle}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        {copy.previewBody}
      </p>

      <div className="mt-6 rounded-3xl border border-cyan-200/15 bg-cyan-200/10 p-4">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100/65">
          {copy.orchestrationLabel}
        </p>
        <h3 className="mt-2 text-xl font-black text-white">
          {copy.orchestrationTitle}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {copy.orchestrationBody}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {copy.orchestrationPoints.map((point) => (
            <span
              className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-black text-white/70"
              key={point}
            >
              {point}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-7 space-y-3">
        {copy.previewSteps.map(([agent, task], index) => {
          const agentId = previewAgentIds[index] ?? "jackie";

          return (
            <div
              className="flex items-start gap-4 rounded-3xl border border-white/10 bg-[#0B1020]/74 p-4"
              key={agent}
            >
              <AgentAvatar agentId={agentId} decorative size="sm" />
              <div>
                <p className="font-black text-white">{agent}</p>
                <p className="mt-1 text-sm leading-5 text-slate-300">
                  {task}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-7 rounded-3xl border border-cyan-200/15 bg-cyan-200/10 p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-100/70">
          {copy.localOnly}
        </p>
      </div>
    </aside>
  );
}

function TrialResults({
  copy,
  input,
  result,
}: {
  copy: TrialCopy;
  input: TrialForm;
  result: TrialResult;
}) {
  return (
    <div className="mt-12">
      <div className="mb-6 flex flex-col justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/65">
            {copy.resultsLabel}
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
            {copy.resultsTitle}
          </h2>
        </div>
        <div className="rounded-full border border-emerald-200/15 bg-emerald-200/10 px-4 py-2 text-sm font-black text-emerald-100">
          {copy.used}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-cyan-200/15 bg-cyan-200/10 p-6 shadow-2xl shadow-black/20 backdrop-blur lg:col-span-2">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/65">
            {copy.resultSystemLabel}
          </p>
          <h3 className="mt-2 text-2xl font-black text-white">
            {copy.resultSystemTitle}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {copy.resultSystemBody}
          </p>
        </div>
        <JackieCard copy={copy} result={result.jackie} />
        <NoraCard copy={copy} result={result.nora} />
        <MiloCard copy={copy} result={result.milo} />
        <DexCard copy={copy} result={result.dex} />
      </div>

      <UpgradePanel copy={copy} input={input} />
    </div>
  );
}

function CardFrame({
  children,
  card,
}: {
  children: ReactNode;
  card: (typeof resultCards)[number];
}) {
  const Icon = card.Icon;

  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-white/38">
            {card.agent}
          </p>
          <h3 className="mt-2 text-2xl font-black text-white">
            {card.agent} — {card.label}
          </h3>
        </div>
        <div className="relative">
          <AgentAvatar
            agentId={card.id}
            label={`${card.agent} AI portrait`}
            size="md"
          />
          <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-xl border border-white/15 bg-[#0B1020]/90 backdrop-blur">
            <Icon aria-hidden="true" className={`h-4 w-4 ${card.accent}`} />
          </span>
        </div>
      </div>
      {children}
    </article>
  );
}

function JackieCard({
  copy,
  result,
}: {
  copy: TrialCopy;
  result: TrialResult["jackie"];
}) {
  return (
    <CardFrame card={resultCards[0]}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl border border-cyan-200/15 bg-cyan-200/10 p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-100/65">
            {copy.score}
          </p>
          <p className="mt-2 text-4xl font-black text-white">
            {result.score}/100
          </p>
        </div>
        <div className="rounded-3xl border border-emerald-200/15 bg-emerald-200/10 p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100/65">
            {copy.status}
          </p>
          <p className="mt-2 text-2xl font-black text-white">
            {result.status}
          </p>
        </div>
      </div>
      <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-white/38">
        {copy.reasons}
      </p>
      <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
        {result.reasons.map((reason) => (
          <li className="flex gap-3" key={reason}>
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-cyan-100"
            />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </CardFrame>
  );
}

function NoraCard({
  copy,
  result,
}: {
  copy: TrialCopy;
  result: TrialResult["nora"];
}) {
  return (
    <CardFrame card={resultCards[1]}>
      <div className="rounded-3xl border border-fuchsia-200/15 bg-fuchsia-200/10 p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-100/65">
          {copy.proposalRange}
        </p>
        <p className="mt-2 text-2xl font-black text-white">
          {result.proposalRange}
        </p>
      </div>
      <div className="mt-4 rounded-3xl border border-white/10 bg-[#0B1020]/74 p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/38">
          {copy.scope}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-200">{result.scope}</p>
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-white/38">
        {copy.rationale}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        {result.rationale}
      </p>
    </CardFrame>
  );
}

function MiloCard({
  copy,
  result,
}: {
  copy: TrialCopy;
  result: TrialResult["milo"];
}) {
  return (
    <CardFrame card={resultCards[2]}>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/38">
        {copy.message}
      </p>
      <div className="mt-3 rounded-3xl border border-violet-200/15 bg-violet-200/10 p-4">
        <p className="whitespace-pre-line text-sm leading-6 text-slate-100">
          {result.message}
        </p>
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-white/38">
        {copy.timing}
      </p>
      <p className="mt-2 text-sm font-semibold text-violet-100">
        {result.timing}
      </p>
    </CardFrame>
  );
}

function DexCard({
  copy,
  result,
}: {
  copy: TrialCopy;
  result: TrialResult["dex"];
}) {
  return (
    <CardFrame card={resultCards[3]}>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/38">
        {copy.summary}
      </p>
      <div className="mt-3 rounded-3xl border border-rose-200/15 bg-rose-200/10 p-4">
        <p className="text-sm leading-6 text-slate-100">{result.summary}</p>
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-white/38">
        {copy.nextSteps}
      </p>
      <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
        {result.nextSteps.map((step) => (
          <li className="flex gap-3" key={step}>
            <ClipboardCheck
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-rose-100"
            />
            <span>{step}</span>
          </li>
        ))}
      </ul>
    </CardFrame>
  );
}

function UpgradePanel({
  copy,
  input,
}: {
  copy: TrialCopy;
  input: TrialForm;
}) {
  return (
    <section className="mt-8 overflow-hidden rounded-[2.5rem] border border-cyan-200/20 bg-gradient-to-br from-cyan-300/16 via-fuchsia-400/10 to-violet-500/14 p-7 shadow-2xl shadow-black/25 backdrop-blur sm:p-9">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/70">
            {copy.upgradeLabel}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
            {copy.upgradeTitle}
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            {copy.upgradeBody}
          </p>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-white/35">
            {input.businessName}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-100"
            href="/#pricing"
          >
            {copy.upgrade}
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] px-6 py-4 font-black text-white transition hover:bg-white/15"
            href="/dashboard"
          >
            {copy.dashboard}
          </Link>
        </div>
      </div>
    </section>
  );
}
