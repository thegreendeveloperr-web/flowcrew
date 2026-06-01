import type { CSSProperties } from "react";
import type { Agent } from "@/lib/data";

type AgentCardProps = {
  agent: Agent;
  compact?: boolean;
};

const statusLabel = {
  online: "Online",
  working: "Working",
  watching: "Watching",
};

export default function AgentCard({ agent, compact = false }: AgentCardProps) {
  const Icon = agent.Icon;

  return (
    <article
      className={`glass-panel group relative overflow-hidden rounded-[1.5rem] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/25 ${
        compact ? "min-h-[220px]" : "min-h-[260px]"
      }`}
      style={{ "--agent-accent": agent.accent } as CSSProperties}
    >
      <div
        className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${agent.gradient} opacity-80 transition group-hover:opacity-100`}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-white shadow-[0_0_34px_rgba(81,229,255,0.14)]"
            style={{ color: agent.accent }}
          >
            <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2.1} />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-white">
              {agent.name}
            </h3>
            <p className="text-sm text-slate-400">{agent.title}</p>
          </div>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-slate-200">
          {statusLabel[agent.status]}
        </span>
      </div>

      <div className="relative mt-6">
        <div className="flex items-end gap-2">
          <span className="text-3xl font-semibold tracking-tight text-white">
            {agent.metric}
          </span>
          <span className="pb-1 text-xs uppercase tracking-[0.24em] text-slate-500">
            {agent.metricLabel}
          </span>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300">{agent.description}</p>
        <div className="mt-5 flex items-center gap-2 text-sm font-medium">
          <span
            className="h-2.5 w-2.5 rounded-full shadow-[0_0_18px_var(--agent-accent)]"
            style={{ backgroundColor: agent.accent }}
          />
          <span className="text-slate-200">{agent.microCopy}</span>
        </div>
      </div>
    </article>
  );
}
