import { Activity, RadioTower } from "lucide-react";
import AgentAvatar from "@/components/AgentAvatar";
import type { Agent } from "@/lib/data";

type CrewStatusProps = {
  agents: Agent[];
  planLabel?: string;
};

export default function CrewStatus({
  agents,
  planLabel = "Free Trial - 1 Lead",
}: CrewStatusProps) {
  return (
    <section className="glass-panel rounded-[1.5rem] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-cyan-200">
            <RadioTower aria-hidden="true" className="h-4 w-4" />
            Live crew signal
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Your Crew is online
          </h2>
        </div>
        <div className="rounded-full border border-violet-300/25 bg-violet-300/10 px-4 py-2 text-sm font-semibold text-violet-100 shadow-[0_0_30px_rgba(157,108,255,0.18)]">
          {planLabel}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AgentAvatar agentId={agent.id} decorative size="sm" />
                <span className="text-sm font-semibold text-white">{agent.name}</span>
              </div>
              <Activity aria-hidden="true" className="h-4 w-4 text-slate-500" />
            </div>
            <p className="mt-2 text-xs text-slate-400">{agent.microCopy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
