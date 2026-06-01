import {
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  FileText,
  MailCheck,
  Radar,
  Workflow,
} from "lucide-react";
import type { CrewResult } from "@/lib/mockAgents";

type LeadResultProps = {
  result: CrewResult;
};

export default function LeadResult({ result }: LeadResultProps) {
  const resultCards = [
    {
      agent: "Jackie",
      title: `${result.jackie.label} - ${result.jackie.score}/100`,
      body: result.jackie.analysis,
      Icon: Radar,
      accent: "text-cyan-200",
      border: "border-cyan-300/20",
    },
    {
      agent: "Nora",
      title: `Proposal range: ${result.nora.proposalRange}`,
      body: result.nora.proposal,
      Icon: FileText,
      accent: "text-violet-200",
      border: "border-violet-300/20",
    },
    {
      agent: "Milo",
      title: result.milo.followUp,
      body: result.milo.message,
      Icon: MailCheck,
      accent: "text-lime-200",
      border: "border-lime-300/20",
    },
    {
      agent: "Dex",
      title: result.dex.log,
      body: result.dex.automation.join(" - "),
      Icon: Workflow,
      accent: "text-rose-200",
      border: "border-rose-300/20",
    },
  ];

  const mockActions = [
    { label: "Copy reply", Icon: Copy },
    { label: "Copy proposal", Icon: FileText },
    { label: "Mark as followed-up", Icon: ClipboardCheck },
  ];

  return (
    <section className="glass-panel rounded-[1.6rem] p-5">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-cyan-200">
            <span className="inline-flex items-center gap-2">
              <Bot aria-hidden="true" className="h-4 w-4" />
              Crew result generated
            </span>
            <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-100">
              This is a demo run
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {result.leadName} is in the pipeline
          </h2>
        </div>
        <span className="w-fit rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-slate-400">
          {result.generatedAt}
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {resultCards.map((card) => {
          const Icon = card.Icon;

          return (
            <article
              key={card.agent}
              className={`rounded-2xl border ${card.border} bg-white/[0.04] p-4`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
                  <Icon aria-hidden="true" className={`h-5 w-5 ${card.accent}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {card.agent}
                  </p>
                  <h3 className="text-base font-semibold text-white">{card.title}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{card.body}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm leading-6 text-slate-400">
          Mock actions only. Nothing is sent, charged, saved, or connected to a
          backend.
        </p>
        <div className="flex flex-wrap gap-2">
          {mockActions.map((action) => {
            const Icon = action.Icon;

            return (
              <button
                key={action.label}
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300/35 hover:bg-cyan-300/10"
              >
                <Icon aria-hidden="true" className="h-4 w-4 text-cyan-100" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-lime-100/80">
        <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
        Demo result ready to copy into the next human step.
      </div>
    </section>
  );
}
