"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Crown, Gauge, LoaderCircle } from "lucide-react";

type UsageResponse = {
  plan: "free" | "pro" | "team";
  used: number;
  limit: number;
  remaining: number;
  label: string;
};

function isWorkspacePlan(plan: UsageResponse["plan"]) {
  return plan === "pro" || plan === "team";
}

function getWorkspaceLabel(plan: UsageResponse["plan"]) {
  if (plan === "team") return "Team";
  if (plan === "pro") return "Pro";
  return "Free";
}

function useUsageStatus() {
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadUsage() {
      try {
        const response = await fetch("/api/usage", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          if (isActive) setHasError(true);
          return;
        }

        const payload = (await response.json()) as UsageResponse;

        if (isActive) {
          setUsage(payload);
          setHasError(false);
        }
      } catch {
        if (isActive) setHasError(true);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadUsage();

    return () => {
      isActive = false;
    };
  }, []);

  return { usage, isLoading, hasError };
}

export function DashboardPlanStatusCard() {
  const { usage, isLoading, hasError } = useUsageStatus();
  const isWorkspace = usage ? isWorkspacePlan(usage.plan) : false;
  const workspaceLabel = usage ? getWorkspaceLabel(usage.plan) : "Workspace";
  const progress = useMemo(() => {
    if (!usage) return 0;

    return Math.min((usage.used / Math.max(usage.limit, 1)) * 100, 100);
  }, [usage]);

  return (
    <section className="fc-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="fc-label">Plan status</p>
          <h2 className="mt-1 text-xl font-bold tracking-[-0.035em] text-[var(--fc-text)]">
            {isLoading
              ? "Checking workspace"
              : isWorkspace
                ? `${workspaceLabel} workspace active`
                : "Free trial active"}
          </h2>
        </div>

        <span
          className={`fc-pill ${
            isWorkspace ? "fc-pill-success" : "border-white/[0.08] bg-white/[0.04]"
          }`}
        >
          {isLoading ? (
            <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
          ) : isWorkspace ? (
            <Crown aria-hidden="true" className="h-3.5 w-3.5" />
          ) : (
            <Gauge aria-hidden="true" className="h-3.5 w-3.5" />
          )}
          {usage?.label ?? "Plan"}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">
        {isLoading
          ? "Reading your current lead capacity."
          : hasError || !usage
            ? "Plan status is not available right now."
            : isWorkspace
              ? "Lead capacity unlocked"
              : "Free includes one saved lead."}
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <UsageStat label="Used" value={usage ? String(usage.used) : "-"} />
        <UsageStat label="Limit" value={usage ? String(usage.limit) : "-"} />
        <UsageStat label="Remaining" value={usage ? String(usage.remaining) : "-"} />
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-[var(--fc-accent)] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}

export function LeadsProStatusLine() {
  const { usage, isLoading } = useUsageStatus();

  if (isLoading || !usage || !isWorkspacePlan(usage.plan)) return null;

  const workspaceLabel = getWorkspaceLabel(usage.plan);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="fc-pill fc-pill-success">
        <Crown aria-hidden="true" className="h-3.5 w-3.5" />
        {workspaceLabel} inbox
      </span>
      <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--fc-text-muted)]">
        <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[var(--fc-mint)]" />
        Your leads are being saved to your workspace
      </span>
    </div>
  );
}

function UsageStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.035] px-3 py-2.5">
      <p className="flow-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fc-text-soft)]">
        {label}
      </p>
      <p className="mt-1 text-lg font-extrabold tracking-[-0.035em] text-[var(--fc-text)]">
        {value}
      </p>
    </div>
  );
}
