import { ArrowRight, CircleDot } from "lucide-react";
import type { Activity, Agent } from "@/lib/data";

type ActivityLogProps = {
  activities: Activity[];
  agents: Agent[];
  title?: string;
};

export default function ActivityLog({
  activities,
  agents,
  title = "Dex activity log",
}: ActivityLogProps) {
  const agentAccent = new Map(agents.map((agent) => [agent.id, agent.accent]));

  return (
    <section className="glass-panel rounded-[1.5rem] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Automation memory
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
            {title}
          </h2>
        </div>
        <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 sm:block">
          Live
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <CircleDot
                aria-hidden="true"
                className="h-4 w-4"
                style={{ color: agentAccent.get(activity.agent) ?? "#51E5FF" }}
              />
              <div className="mt-2 h-full w-px bg-white/10" />
            </div>
            <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{activity.title}</h3>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {activity.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-200">
        Dex is writing the handoff trace.
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </div>
    </section>
  );
}
