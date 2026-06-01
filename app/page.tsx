"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Brain,
  CalendarCheck2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Flame,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import PricingCard from "@/components/PricingCard";
import { agents, plans } from "@/lib/data";

const marketingAgents = agents.map((agent) => {
  const marketing = {
    jackie: {
      role: "Lead Intelligence",
      tagline: "Cuts through vague requests and flags the deal worth chasing.",
      status: "3 hot leads ranked",
      mood: "Sharp",
      cardBackground:
        "linear-gradient(135deg, rgba(217, 70, 239, 0.24), rgba(244, 63, 94, 0.1) 52%, rgba(255, 255, 255, 0.035))",
      accent: "rgba(217, 70, 239, 0.42)",
    },
    milo: {
      role: "Follow-up Control",
      tagline: "Keeps every promise on time without sounding robotic.",
      status: "2 follow-ups protected",
      mood: "Reliable",
      cardBackground:
        "linear-gradient(135deg, rgba(14, 165, 233, 0.24), rgba(34, 211, 238, 0.1) 52%, rgba(255, 255, 255, 0.035))",
      accent: "rgba(34, 211, 238, 0.42)",
    },
    nora: {
      role: "Proposal Studio",
      tagline: "Turns messy asks into polished, client-ready scope.",
      status: "1 proposal refined",
      mood: "Elegant",
      cardBackground:
        "linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(99, 102, 241, 0.1) 52%, rgba(255, 255, 255, 0.035))",
      accent: "rgba(139, 92, 246, 0.45)",
    },
    dex: {
      role: "Flow Engineer",
      tagline: "Wires the handoff layer so every move is logged.",
      status: "4 flows synced",
      mood: "Technical",
      cardBackground:
        "linear-gradient(135deg, rgba(16, 185, 129, 0.24), rgba(132, 204, 22, 0.1) 52%, rgba(255, 255, 255, 0.035))",
      accent: "rgba(16, 185, 129, 0.42)",
    },
  }[agent.id];

  return { ...agent, ...marketing };
});

const liveActivity = [
  "Jackie scored Studio Aurora as HOT - 86/100",
  "Nora shaped a 700-1200 EUR proposal",
  "Milo scheduled a soft follow-up in 48h",
  "Dex logged Lead -> Jackie -> Nora -> Milo",
];

const howItWorks = [
  {
    step: "1",
    title: "Drop a lead",
    description: "Paste the inquiry, budget, project type, and raw client context.",
    Icon: ClipboardCheck,
    accent: "text-cyan-200",
    glow: "linear-gradient(180deg, rgba(103, 232, 249, 0.2), transparent)",
  },
  {
    step: "2",
    title: "Jackie scores it",
    description: "Sharp lead intelligence ranks urgency, fit, and deal heat.",
    Icon: Radar,
    accent: "text-fuchsia-200",
    glow: "linear-gradient(180deg, rgba(240, 171, 252, 0.2), transparent)",
  },
  {
    step: "3",
    title: "Nora drafts the proposal",
    description: "Elegant scope, premium range, and client-ready next steps.",
    Icon: FileText,
    accent: "text-violet-200",
    glow: "linear-gradient(180deg, rgba(196, 181, 253, 0.2), transparent)",
  },
  {
    step: "4",
    title: "Milo schedules follow-up",
    description: "Reliable timing keeps the opportunity warm without pressure.",
    Icon: CalendarCheck2,
    accent: "text-lime-200",
    glow: "linear-gradient(180deg, rgba(190, 242, 100, 0.18), transparent)",
  },
  {
    step: "5",
    title: "Dex logs the flow",
    description: "Technical handoff memory turns the run into a repeatable system.",
    Icon: Workflow,
    accent: "text-rose-200",
    glow: "linear-gradient(180deg, rgba(253, 164, 175, 0.18), transparent)",
  },
];

const brainShowcase = [
  {
    label: "Core Brain",
    plan: "Starter",
    Icon: Bot,
    headline: "Answers the request.",
    response:
      "Flags the lead as warm, suggests a simple reply, and gives a basic 700-1200 EUR range.",
    bullets: ["Base scoring", "Simple reply", "Manual next step"],
    border: "border-white/10",
  },
  {
    label: "Smart Brain",
    plan: "Pro",
    Icon: Brain,
    headline: "Finds the deal angle.",
    response:
      "Spots the launch urgency, scores Studio Aurora as hot, drafts a structured proposal, and queues a 48h follow-up.",
    bullets: ["Deal heat", "Proposal logic", "Follow-up timing"],
    border: "border-fuchsia-300/30",
    featured: true,
  },
  {
    label: "Elite Brain",
    plan: "Crew+",
    Icon: ShieldCheck,
    headline: "Builds the operating loop.",
    response:
      "Adds premium positioning, identifies revenue risk, remembers business context, and asks Dex to log a reusable flow.",
    bullets: ["Business memory", "Risk analysis", "Custom flow trace"],
    border: "border-cyan-300/25",
  },
];

export default function Home() {
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
            <span className="block text-xs text-white/45">
              AI agents for daily ops
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-white/55 md:flex">
          <a href="#how" className="transition hover:text-white">
            How it works
          </a>
          <a href="#brains" className="transition hover:text-white">
            Brains
          </a>
          <a href="#agents" className="transition hover:text-white">
            Agents
          </a>
          <a href="#pricing" className="transition hover:text-white">
            Pricing
          </a>
          <Link href="/dashboard" className="transition hover:text-white">
            Dashboard
          </Link>
        </nav>
      <Link
  href="/trial"
  className="rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 sm:px-5"
>
  Try free lead
</Link>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-5.5rem)] max-w-[1280px] items-center gap-10 px-5 pb-20 pt-8 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/25 bg-fuchsia-300/10 px-4 py-2 text-sm font-semibold text-fuchsia-50 shadow-2xl shadow-fuchsia-500/10">
            <Flame aria-hidden="true" className="h-4 w-4" />
            Stop building workflows. Start hiring agents.
          </div>
          <h1 className="premium-display max-w-[720px] text-white">
            Turn every inbound lead into a clean sales motion.
          </h1>
          <p className="mt-6 max-w-[640px] text-lg font-medium leading-8 text-white/72">
            Jackie qualifies the lead, Nora shapes the proposal, Milo protects
            the follow-up, and Dex logs the flow. You keep the client momentum.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
           <Link
  href="/trial"
  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-white/10 transition hover:scale-[1.02]"
>
  Try 1 lead for free
  <ArrowRight
    aria-hidden="true"
    className="h-4 w-4 transition group-hover:translate-x-1"
  />
</Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-6 py-4 text-sm font-black text-white backdrop-blur transition hover:bg-white/15"
            >
              Open dashboard
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/50">
            {["Lead Inbox AI", "Smart Proposals", "Premium Brain Levels"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 px-3 py-1"
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </motion.div>

        <motion.div
          id="demo"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="premium-demo-panel rounded-[2rem] p-4"
        >
          <div className="rounded-[1.5rem] border border-white/10 bg-[#0b0b18]/92 p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-white/45">Crew Status</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
                  Your Crew is online
                </h2>
              </div>
              <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-200">
                LIVE
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {marketingAgents.map((agent) => {
                const Icon = agent.Icon;

                return (
                  <div
                    key={agent.id}
                    className="premium-agent-tile rounded-3xl border border-white/10 p-4"
                    style={{ background: agent.cardBackground }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/12"
                          style={{ boxShadow: `0 0 34px ${agent.accent}` }}
                        >
                          <Icon aria-hidden="true" className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-black text-white">{agent.name}</p>
                          <p className="text-xs text-white/50">{agent.role}</p>
                        </div>
                      </div>
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
                    </div>
                    <p className="mt-4 text-sm text-white/65">{agent.status}</p>
                    <p className="mt-1 text-xs text-white/35">
                      Mode: {agent.mood}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-black/30 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white/70">
                <Zap aria-hidden="true" className="h-4 w-4 text-fuchsia-200" />
                Live activity
              </div>
              <div className="space-y-2 font-mono text-xs text-white/55">
                {liveActivity.map((item, index) => (
                  <div key={item} className="flex gap-2">
                    <span className="text-fuchsia-200">0{index + 1}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="how" className="relative z-10 mx-auto max-w-[1280px] px-5 py-24 sm:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">
              How it works
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">
              One lead goes in. A full sales motion comes out.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/55">
            The demo stays local, but the product story feels like a premium AI
            crew you can understand in ten seconds.
          </p>
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {howItWorks.map((step) => {
            const Icon = step.Icon;

            return (
              <motion.article
                key={step.title}
                whileHover={{ y: -6 }}
                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur"
              >
                <div className="absolute inset-x-0 top-0 h-24" style={{ background: step.glow }} />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-black text-white/35">
                      STEP {step.step}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07]">
                      <Icon aria-hidden="true" className={`h-5 w-5 ${step.accent}`} />
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-black tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">
                    {step.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="brains" className="relative z-10 mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
        <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-6 backdrop-blur md:p-12">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/70">
                <Brain aria-hidden="true" className="h-4 w-4 text-cyan-200" />
                Same lead, smarter brain
              </div>
              <h2 className="text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">
                The same request gets sharper at every tier.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/60">
                FlowCrew is easier to sell when buyers can feel the difference:
                Core answers, Smart reasons, Elite builds the operating loop.
              </p>

              <div className="mt-8 rounded-[1.8rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-100/70">
                  Same client request
                </p>
                <p className="mt-4 text-xl font-black text-white">
                  Studio Aurora needs a polished website refresh before launch.
                </p>
                <div className="mt-5 grid gap-2 text-sm text-white/60 sm:grid-cols-3">
                  <span className="rounded-2xl bg-black/20 px-3 py-2">
                    Budget: 500-1000 EUR
                  </span>
                  <span className="rounded-2xl bg-black/20 px-3 py-2">
                    Timeline: this month
                  </span>
                  <span className="rounded-2xl bg-black/20 px-3 py-2">
                    Goal: conversion path
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {brainShowcase.map((tier) => {
                const Icon = tier.Icon;

                return (
                  <article
                    key={tier.label}
                    className={`rounded-[1.8rem] border ${tier.border} ${
                      tier.featured
                        ? "bg-fuchsia-300/10 shadow-2xl shadow-fuchsia-500/10"
                        : "bg-black/20"
                    } p-5`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07]">
                          <Icon aria-hidden="true" className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/35">
                            {tier.plan}
                          </p>
                          <h3 className="text-2xl font-black text-white">
                            {tier.label}
                          </h3>
                        </div>
                      </div>
                      {tier.featured ? (
                        <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-slate-950">
                          SELLER FAVORITE
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-5 text-lg font-bold text-white">
                      {tier.headline}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/58">
                      {tier.response}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tier.bullets.map((bullet) => (
                        <span
                          key={bullet}
                          className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/60"
                        >
                          {bullet}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="agents" className="relative z-10 mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-fuchsia-200">
            Meet the Crew
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">
            Four agents. One clean revenue workflow.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {marketingAgents.map((agent) => {
            const Icon = agent.Icon;

            return (
              <motion.article
                key={agent.id}
                whileHover={{ y: -6 }}
                className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition"
              >
                <div
                  className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-white/10"
                  style={{ background: agent.cardBackground }}
                >
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black text-white">{agent.name}</h3>
                <p className="mt-1 text-sm font-semibold text-fuchsia-100/80">
                  {agent.role}
                </p>
                <p className="mt-4 text-sm leading-6 text-white/55">
                  {agent.tagline}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="pricing" className="relative z-10 mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">
            Pricing
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">
            Upgrade your Crew brain.
          </h2>
          <p className="mt-4 text-white/55">
            Start lightweight. Upgrade when you want deeper reasoning and cleaner
            automation.
          </p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-5 py-24 text-center sm:px-8">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.06] p-7 backdrop-blur md:p-16">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-300/10 text-fuchsia-100">
            <Sparkles aria-hidden="true" className="h-5 w-5" />
          </div>
          <h2 className="mt-6 text-4xl font-black tracking-[-0.05em] text-white md:text-6xl">
            Your Crew is ready.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/60">
            Drop one lead and watch FlowCrew turn it into scoring, proposal,
            follow-up, and flow memory.
          </p>
         <Link
  href="/trial"
  className="group mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 font-black text-slate-950 shadow-2xl shadow-white/10 transition hover:scale-[1.02]"
>
  Try 1 lead for free
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 mx-auto flex max-w-[1280px] flex-col gap-3 border-t border-white/10 px-5 py-6 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>FlowCrew - AI agents for daily ops</span>
        <span className="flex items-center gap-2">
          <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-emerald-200" />
          v0 demo, local-first
        </span>
      </footer>
    </main>
  );
}
