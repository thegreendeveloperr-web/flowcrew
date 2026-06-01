"use client";

import { useState } from "react";
import {
  Bot,
  CheckCircle2,
  Copy,
  FileText,
  MailCheck,
  Radar,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import AgentAvatar from "@/components/AgentAvatar";
import type { AgentId } from "@/lib/data";
import type { LeadAnalysisResult } from "@/lib/flowcrew-types";

type LeadResultProps = {
  result: LeadAnalysisResult;
};

export default function LeadResult({ result }: LeadResultProps) {
  const [copyStatus, setCopyStatus] = useState("");
  const { analysis } = result;
  const resultCards = [
    {
      id: "jackie",
      agent: "Jackie",
      title: "Conversation cleaned",
      body: `${analysis.jackie.cleanSummary} Key facts: ${analysis.jackie.keyFacts.join(" - ")}.`,
      Icon: Radar,
      accent: "text-cyan-200",
      border: "border-cyan-300/20",
    },
    {
      id: "nora",
      agent: "Nora",
      title: `${analysis.nora.status} - Risk: ${analysis.nora.riskLevel}`,
      body: analysis.nora.why,
      Icon: FileText,
      accent: "text-violet-200",
      border: "border-violet-300/20",
    },
    {
      id: "milo",
      agent: "Milo",
      title: "Professional reply ready",
      body: analysis.milo.replies.professional,
      Icon: MailCheck,
      accent: "text-lime-200",
      border: "border-lime-300/20",
    },
    {
      id: "dex",
      agent: "Dex",
      title: `${analysis.dex.priority} priority - ${analysis.dex.category}`,
      body: `${analysis.dex.crmNote} Tags: ${analysis.dex.tags.join(", ")}.`,
      Icon: Workflow,
      accent: "text-rose-200",
      border: "border-rose-300/20",
    },
  ] satisfies Array<{
    id: AgentId;
    agent: string;
    title: string;
    body: string;
    Icon: LucideIcon;
    accent: string;
    border: string;
  }>;

  const copyActions = [
    { label: "Copy reply", value: analysis.milo.replies.professional, Icon: Copy },
    { label: "Copy CRM note", value: analysis.dex.crmNote, Icon: FileText },
  ];

  async function copyText(label: string, value: string) {
    try {
      await window.navigator.clipboard.writeText(value);
      setCopyStatus(`${label} copied.`);
    } catch {
      setCopyStatus("Could not copy. Select the text and copy it manually.");
    }
  }

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
              Gemini analysis
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
                <div className="relative">
                  <AgentAvatar agentId={card.id} decorative size="sm" />
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-lg border border-white/15 bg-[#0B1020]/90">
                    <Icon
                      aria-hidden="true"
                      className={`h-3 w-3 ${card.accent}`}
                    />
                  </span>
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
          Review the generated content before sending anything to the client.
        </p>
        <div className="flex flex-wrap gap-2">
          {copyActions.map((action) => {
            const Icon = action.Icon;

            return (
              <button
                key={action.label}
                onClick={() => void copyText(action.label, action.value)}
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
        {copyStatus || "Gemini result ready for the next human step."}
      </div>
    </section>
  );
}
