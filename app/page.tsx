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
  Zap,
} from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import PricingCard from "@/components/PricingCard";
import { useLanguage } from "@/components/LanguageProvider";
import AgentAvatar from "@/components/AgentAvatar";
import { agents, plans, type AgentId, type Plan } from "@/lib/data";

const agentStyles: Record<
  AgentId,
  {
    Icon: typeof Radar;
    accent: string;
    glow: string;
  }
> = {
  jackie: {
    Icon: Radar,
    accent: "text-cyan-100",
    glow: "shadow-cyan-500/15",
  },
  nora: {
    Icon: FileText,
    accent: "text-fuchsia-100",
    glow: "shadow-fuchsia-500/15",
  },
  milo: {
    Icon: MailCheck,
    accent: "text-violet-100",
    glow: "shadow-violet-500/15",
  },
  dex: {
    Icon: Workflow,
    accent: "text-rose-100",
    glow: "shadow-rose-500/15",
  },
};

const flowVisuals = [
  { Icon: ClipboardCheck, color: "text-emerald-200" },
  { Icon: Radar, color: "text-cyan-200" },
  { Icon: FileText, color: "text-fuchsia-200" },
  { Icon: MailCheck, color: "text-violet-200" },
  { Icon: Workflow, color: "text-rose-200" },
];

const flowAgentIds: Array<AgentId | null> = [
  null,
  "jackie",
  "nora",
  "milo",
  "dex",
];

const orchestratedAgents: AgentId[] = ["jackie", "nora", "milo", "dex"];

const howIcons = [ClipboardCheck, Zap, CheckCircle2];

type LandingCopy = ReturnType<typeof useLanguage>["copy"]["landing"];

function localizePlans(copy: ReturnType<typeof useLanguage>["copy"]): Plan[] {
  return plans.map((plan, index) => {
    const localizedPlan =
      copy.landing.pricingPlans[index] ?? copy.landing.pricingPlans[0];

    return {
      ...plan,
      description: localizedPlan.description,
      features: [...localizedPlan.features],
      cta: localizedPlan.cta,
    };
  });
}

export default function Home() {
  const { copy } = useLanguage();
  const localizedPlans = localizePlans(copy);

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
              <span className="block text-lg font-black tracking-tight">
                FlowCrew
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.26em] text-cyan-100/55">
                AI Automation Hub
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-bold text-white/62 md:flex">
            <a className="transition hover:text-white" href="#how-it-works">
              {copy.nav.how}
            </a>
            <a className="transition hover:text-white" href="#agents">
              {copy.nav.agents}
            </a>
            <a className="transition hover:text-white" href="#pricing">
              {copy.nav.pricing}
            </a>
            <Link className="transition hover:text-white" href="/dashboard">
              {copy.nav.dashboard}
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            <Link
              className="hidden rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/15 sm:inline-flex"
              href="/trial"
            >
              {copy.nav.trial}
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pb-28 lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-100/80">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            {copy.landing.eyebrow}
          </div>

          <h1 className="max-w-4xl text-5xl font-black tracking-[-0.07em] text-white sm:text-6xl lg:text-7xl">
            {copy.landing.headline}
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            {copy.landing.subheadline}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-6 py-4 text-base font-black text-slate-950 shadow-[0_0_44px_rgba(34,211,238,0.28)] transition hover:-translate-y-0.5 hover:bg-white"
              href="/trial"
            >
              {copy.landing.primaryCta}
              <ArrowRight
                aria-hidden="true"
                className="h-5 w-5 transition group-hover:translate-x-1"
              />
            </Link>
            <a
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-6 py-4 text-base font-black text-white transition hover:bg-white/10"
              href="#how-it-works"
            >
              {copy.landing.secondaryCta}
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2.8rem] bg-gradient-to-br from-cyan-300/14 via-fuchsia-400/10 to-violet-500/12 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.065] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/65">
                  {copy.landing.flowLabel}
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                  {copy.landing.flowTitle}
                </h2>
              </div>
              <div className="rounded-full border border-emerald-200/20 bg-emerald-200/10 px-3 py-1 text-xs font-black text-emerald-100">
                Live
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {copy.landing.flowSteps.map((step, index) => {
                const visual = flowVisuals[index] ?? flowVisuals[0];
                const Icon = visual.Icon;
                const flowAgentId = flowAgentIds[index];

                return (
                  <div className="relative" key={step}>
                    <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-[#0B1020]/72 p-4 transition hover:border-cyan-200/25 hover:bg-[#11172A]/78">
                      {flowAgentId ? (
                        <AgentAvatar agentId={flowAgentId} decorative size="sm" />
                      ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                          <Icon
                            aria-hidden="true"
                            className={`h-5 w-5 ${visual.color}`}
                          />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/38">
                          Step {index + 1}
                        </p>
                        <p className="mt-1 text-base font-black text-white">
                          {step}
                        </p>
                      </div>
                    </div>
                    {index < copy.landing.flowSteps.length - 1 ? (
                      <div className="ml-10 h-4 w-px bg-gradient-to-b from-cyan-200/40 to-transparent" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <CrewOrchestrationSection copy={copy.landing} />

      <section
        className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8"
        id="how-it-works"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-100/62">
            {copy.landing.howEyebrow}
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            {copy.landing.howTitle}
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            {copy.landing.howBody}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {copy.landing.howSteps.map((step, index) => {
            const Icon = howIcons[index] ?? howIcons[0];

            return (
              <article
                className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-xl shadow-black/10 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-200/25"
                key={step.title}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-200/10">
                  <Icon aria-hidden="true" className="h-5 w-5 text-cyan-100" />
                </div>
                <h3 className="text-xl font-black text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {step.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8"
        id="agents"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-fuchsia-100/62">
              {copy.landing.agentsEyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              {copy.landing.agentsTitle}
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              {copy.landing.agentsBody}
            </p>
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-3 font-black text-white transition hover:bg-white/10"
            href="/trial"
          >
            {copy.landing.primaryCta}
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {agents.map((agent) => {
            const style = agentStyles[agent.id];
            const AgentIcon = style.Icon;
            const agentCopy = copy.landing.agentCards[agent.id];

            return (
              <article
                className={`group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl ${style.glow} backdrop-blur transition hover:-translate-y-1 hover:border-white/20`}
                key={agent.id}
              >
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div className="relative">
                    <AgentAvatar
                      agentId={agent.id}
                      label={`${agent.name} AI portrait`}
                      size="lg"
                    />
                    <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-[#0B1020]/90 backdrop-blur">
                      <AgentIcon
                        aria-hidden="true"
                        className={`h-4 w-4 ${style.accent}`}
                      />
                    </span>
                  </div>
                  <span className="rounded-full border border-emerald-200/15 bg-emerald-200/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100/80">
                    {agent.status}
                  </span>
                </div>
                <p className="text-2xl font-black text-white">{agent.name}</p>
                <p className={`mt-2 text-sm font-black ${style.accent}`}>
                  {agentCopy.role}
                </p>
                <p className="mt-5 min-h-20 text-sm leading-6 text-slate-300">
                  {agentCopy.tagline}
                </p>
                <div className="mt-6 rounded-2xl border border-white/10 bg-[#0B1020]/72 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white/35">
                    Output
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white/75">
                    {agent.microCopy}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section
        className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8"
        id="pricing"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-100/62">
            {copy.landing.pricingEyebrow}
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            {copy.landing.pricingTitle}
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            {copy.landing.pricingBody}
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {localizedPlans.map((plan) => (
            <PricingCard
              bestValueLabel={copy.landing.bestValue}
              depthLabel={copy.landing.pricingDepth}
              key={plan.name}
              plan={plan}
            />
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-cyan-300/14 via-fuchsia-400/10 to-violet-500/14 p-8 text-center shadow-2xl shadow-black/25 backdrop-blur sm:p-12">
          <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            {copy.landing.finalTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {copy.landing.finalBody}
          </p>
          <Link
            className="mt-8 inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-100"
            href="/trial"
          >
            {copy.landing.primaryCta}
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-8 text-center text-sm text-white/45 sm:px-8">
        {copy.landing.footer}
      </footer>
    </main>
  );
}

function CrewOrchestrationSection({ copy }: { copy: LandingCopy }) {
  return (
    <section
      className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8"
      id="orchestration"
    >
      <div className="grid gap-8 rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-100/62">
            {copy.orchestrationEyebrow}
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            {copy.orchestrationTitle}
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            {copy.orchestrationBody}
          </p>

          <div className="mt-7 grid gap-3">
            {copy.orchestrationItems.map((item) => (
              <div
                className="rounded-3xl border border-white/10 bg-[#0B1020]/70 p-4"
                key={item.title}
              >
                <div className="flex gap-3">
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-cyan-100"
                  />
                  <div>
                    <p className="font-black text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-cyan-200/15 bg-[#090D1A]/86 p-5 sm:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_72%_72%,rgba(217,70,239,0.14),transparent_38%)]" />

          <div className="relative">
            <div className="mx-auto max-w-sm rounded-[2rem] border border-white/12 bg-white/[0.07] p-5 text-center shadow-2xl shadow-cyan-500/10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10">
                <Workflow aria-hidden="true" className="h-6 w-6 text-cyan-100" />
              </div>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.24em] text-cyan-100/65">
                {copy.orchestrationCenterLabel}
              </p>
              <h3 className="mt-2 text-2xl font-black text-white">
                {copy.orchestrationCenterTitle}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {copy.orchestrationCenterBody}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {orchestratedAgents.map((agentId, index) => {
                const agentCopy = copy.agentCards[agentId];
                const name = agentId[0].toUpperCase() + agentId.slice(1);

                return (
                  <div
                    className="flex items-center gap-3 rounded-3xl border border-white/10 bg-[#0B1020]/76 p-3"
                    key={agentId}
                  >
                    <AgentAvatar agentId={agentId} decorative size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-white/38">
                        {copy.orchestrationPassLabel} {index + 1}
                      </p>
                      <p className="font-black text-white">{name}</p>
                      <p className="truncate text-xs font-semibold text-slate-400">
                        {agentCopy.role}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 rounded-3xl border border-emerald-200/15 bg-emerald-200/10 px-4 py-3 text-sm font-black text-emerald-100">
              {copy.orchestrationOutcome.map((item, index) => (
                <span className="inline-flex items-center gap-2" key={item}>
                  <span>{item}</span>
                  {index < copy.orchestrationOutcome.length - 1 ? (
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  ) : null}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
