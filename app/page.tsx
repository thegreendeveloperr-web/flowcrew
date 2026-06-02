import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  ListTodo,
  LockKeyhole,
  MailCheck,
  MessagesSquare,
  Tags,
  UsersRound,
} from "lucide-react";
import AgentAvatar from "@/components/AgentAvatar";
import LanguageSelector from "@/components/LanguageSelector";
import TrialDraftCard from "@/components/TrialDraftCard";
import { agentOrder, agentRoles } from "@/lib/agent-roles";
import type { AgentId } from "@/lib/data";

const crew: Array<{
  id: AgentId;
  name: string;
  role: string;
  badge: string;
  copy: string;
  chips: string[];
}> = agentOrder.map((id) => {
  const presentation = {
    jackie: {
      badge: "Clarity lead",
      chips: ["Precise", "Calm", "Reliable"],
    },
    dex: {
      badge: "Signal analyst",
      chips: ["Sharp", "Analytical", "Focused"],
    },
    nora: {
      badge: "Opportunity analyst",
      chips: ["Careful", "Commercial", "Decisive"],
    },
    milo: {
      badge: "Comms specialist",
      chips: ["Warm", "Human", "Confident"],
    },
  } satisfies Record<AgentId, { badge: string; chips: string[] }>;

  return {
    id,
    name: agentRoles[id].name,
    role: agentRoles[id].title,
    copy: agentRoles[id].description,
    ...presentation[id],
  };
});

const flowSteps = [
  { icon: ClipboardCheck, title: "Jackie analyzes the message", body: "Paste WhatsApp texts, emails or notes. Jackie turns the scattered context into a readable summary." },
  { icon: Tags, title: "Dex classifies the lead", body: "Dex assigns tags, category, priority and status so the lead is easy to manage." },
  { icon: ListTodo, title: "Nora evaluates the opportunity", body: "Nora assesses urgency, lead quality, risk and the next actions worth taking." },
  { icon: MailCheck, title: "Milo drafts the follow-up", body: "Milo prepares a polished reply and follow-up you can review before anything is sent." },
];

const socialProofCards = [
  {
    icon: MessagesSquare,
    title: "Freelancers who receive requests across WhatsApp and email",
    body: "Useful when the project brief arrives in fragments and the next step is easy to miss.",
  },
  {
    icon: UsersRound,
    title: "Small agencies managing scattered client messages",
    body: "A practical way to turn copied conversations into a shared, readable handoff.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Consultants who need fast summaries and replies",
    body: "Designed for the moment when a clear response matters more than another inbox tab.",
  },
];

const earlyAccessPlans = [
  {
    name: "Free Trial",
    status: "Available now",
    description: "Analyze 1 lead for free and see the complete FlowCrew output before deciding what comes next.",
    features: ["1 lead analysis", "Summary and priority", "Tags, next action and reply draft"],
    cta: "Analyze one lead",
    href: "/trial",
    highlighted: true,
  },
  {
    name: "Pro",
    status: "Coming soon",
    description: "For professionals who manage many client conversations and need a dependable daily workflow.",
    features: ["More conversations", "Full Crew workflow", "Built for independent professionals"],
  },
  {
    name: "Team",
    status: "Coming soon",
    description: "For small teams and agencies that need a clearer handoff across client requests.",
    features: ["Shared workflow", "Team-ready organization", "Designed for small agencies"],
  },
];

const trialOutputs = ["Summary", "Priority", "Tags", "Next action", "Reply draft"];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f9fc] text-slate-950" id="main-content" tabIndex={-1}>
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12%] top-[-14%] h-[32rem] w-[32rem] rounded-full bg-indigo-400/20 blur-[130px]" />
        <div className="absolute right-[-14%] top-[5%] h-[34rem] w-[34rem] rounded-full bg-cyan-300/18 blur-[130px]" />
        <div className="absolute bottom-[-20%] left-[42%] h-[30rem] w-[30rem] rounded-full bg-violet-400/12 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/72 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link className="flex min-w-0 items-center gap-3" href="/">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-500 text-lg font-black text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)]">
              F
            </span>
            <span>
              <span className="block text-lg font-black tracking-[-0.04em]">FlowCrew</span>
              <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">AI Client Workspace</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 p-1.5 text-sm font-bold text-slate-500 shadow-sm md:flex">
            <a className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-950" href="#workflow">Workflow</a>
            <a className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-950" href="#agents">Agents</a>
            <a className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-950" href="#pricing">Pricing</a>
            <Link className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-950" href="/chat">
              Demo Preview
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            <Link className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:inline-flex" href="/chat">
              View walkthrough
            </Link>
            <Link className="hidden rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 px-5 py-2.5 text-sm font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 sm:inline-flex" href="/trial">
              Try free
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pb-24 lg:pt-24">
        <div className="min-w-0">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.13)]" />
            AI client operations, redesigned
          </div>

          <h1 className="max-w-4xl text-5xl font-black tracking-[-0.075em] text-slate-950 sm:text-6xl lg:text-7xl xl:text-8xl">
            Turn messy client messages into <span className="bg-gradient-to-br from-slate-950 via-blue-600 to-violet-500 bg-clip-text text-transparent">clear work.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            FlowCrew organizes WhatsApp, Gmail and scattered client conversations into clean summaries, smart priorities, tags and ready-to-send replies.
          </p>

          <div className="mt-6 flex max-w-2xl gap-3 rounded-2xl border border-blue-100 bg-white/72 p-4 text-sm leading-6 text-slate-600 shadow-sm backdrop-blur">
            <LockKeyhole aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <p>
              FlowCrew works by pasting messy client messages into the demo. No direct access to your WhatsApp, Gmail, or private accounts is required for the free trial.
            </p>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 px-6 py-4 text-base font-black text-white shadow-[0_18px_44px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5" href="/trial">
              Try one lead free
              <ArrowRight aria-hidden="true" className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>
            <Link className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-base font-black text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" href="/chat">
              View product walkthrough
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 flex min-w-0 items-center gap-4 text-sm font-semibold text-slate-500">
            <div className="flex -space-x-2">
              {crew.map((agent) => (
                <AgentAvatar agentId={agent.id} decorative key={agent.id} size="sm" className="ring-4 ring-white" />
              ))}
            </div>
            <span className="min-w-0">Jackie, Milo, Nora and Dex work like a real AI crew.</span>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-cyan-400/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2.4rem] border border-slate-200 bg-white/88 shadow-[0_28px_90px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white/70 px-5 py-4">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <p className="text-sm font-black text-slate-500">FlowCrew Workspace</p>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">Live</span>
            </div>

            <div className="grid min-h-[560px] grid-cols-[170px_1fr]">
              <aside className="border-r border-slate-200 bg-slate-50/70 p-4 max-sm:hidden">
                {["Inbox", "Tags", "Replies", "Follow-up", "Settings"].map((item, index) => (
                  <div className={`mb-2 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-black ${index === 0 ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`} key={item}>
                    <span className="grid h-7 w-7 place-items-center rounded-xl bg-blue-50 text-blue-600">{index === 0 ? "✦" : "•"}</span>
                    {item}
                  </div>
                ))}
              </aside>

              <section className="p-5">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black tracking-[-0.04em]">Lead intelligence</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Jackie organized 14 new messages.</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700 ring-1 ring-blue-100">92% ready</span>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1fr_0.92fr]">
                  <div className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400">Scattered messages</p>
                    {[
                      ["WhatsApp · Marco", "Ciao, volevo sapere quanto viene un sito per il mio studio. Mi serve abbastanza presto..."],
                      ["Gmail · Marco B.", "Ti mando anche il logo. Possiamo sentirci domani? Ho un budget ma vorrei capire prima."],
                      ["Instagram DM", "Ah, dimenticavo: mi serve anche la pagina prenotazioni collegata al calendario."],
                    ].map(([title, body]) => (
                      <div className="mb-2 rounded-2xl border border-slate-100 bg-slate-50 p-3" key={title}>
                        <p className="text-sm font-black text-slate-900">{title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">{body}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <AgentAvatar agentId="jackie" decorative size="md" />
                      <div>
                        <p className="font-black text-slate-950">Jackie</p>
                        <p className="text-sm font-semibold text-slate-500">Summary agent</p>
                      </div>
                    </div>
                    {[
                      ["Client", "Marco Bianchi"],
                      ["Need", "Website + booking page"],
                      ["Priority", "High · wants call tomorrow"],
                      ["Next step", "Ask budget, deadline, examples"],
                    ].map(([label, value]) => (
                      <div className="grid grid-cols-[92px_1fr] gap-3 border-t border-slate-100 py-3 text-sm" key={label}>
                        <span className="font-black text-slate-400">{label}</span>
                        <b className="text-slate-900">{value}</b>
                      </div>
                    ))}
                    <div className="mt-3 rounded-2xl bg-slate-950 p-4 text-white shadow-[0_20px_45px_rgba(15,23,42,0.18)]">
                      <p className="mb-2 text-xs font-black uppercase tracking-[0.13em] text-blue-200">Ready-to-send reply</p>
                      <p className="text-sm leading-6 text-slate-200">Ciao Marco, grazie per tutti i dettagli. Ti propongo una call domani così capiamo budget, tempistiche e struttura della pagina prenotazioni.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="rounded-[2.35rem] border border-slate-200 bg-white/76 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">Who it is for</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.055em] text-slate-950 sm:text-4xl">Built for client-message chaos that already exists.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">FlowCrew is in early access. These are the everyday workflows the demo is designed to help with, without pretending there are customer stories or statistics we cannot verify yet.</p>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {socialProofCards.map((card) => {
              const Icon = card.icon;
              return (
                <article className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm" key={card.title}>
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-black tracking-[-0.025em] text-slate-950">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="workflow" className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">How it works</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl">From chaos to a client-ready action plan.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">The product should show this instantly: one messy lead goes in, a clean business output comes out.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {flowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <article className="rounded-[2rem] border border-slate-200 bg-white/84 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]" key={step.title}>
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black tracking-[-0.035em]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="agents" className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-700">The Crew</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl">Every agent has a face, a vibe and a job.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">FlowCrew should feel like a memorable AI team, not generic automation blocks.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {crew.map((agent) => (
            <article className="group overflow-hidden rounded-[2.1rem] border border-slate-200 bg-white/84 p-6 text-center shadow-[0_16px_45px_rgba(15,23,42,0.07)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.13)]" key={agent.id}>
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">{agent.badge}</span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" />
              </div>
              <div className="flex justify-center">
                <AgentAvatar agentId={agent.id} decorative size="xl" />
              </div>
              <h3 className="mt-5 text-2xl font-black tracking-[-0.045em]">{agent.name}</h3>
              <p className="mt-1 text-sm font-black text-slate-500">{agent.role}</p>
              <p className="mt-4 min-h-20 text-sm leading-6 text-slate-600">{agent.copy}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {agent.chips.map((chip) => (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-500" key={chip}>{chip}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[2.3rem] border border-slate-200 bg-white/84 p-7 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
            <h3 className="text-2xl font-black tracking-[-0.04em]">Before FlowCrew</h3>
            <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50 p-5 text-slate-600">“Ciao, quanto costa? Mi serve presto. Ti mando logo via mail. Forse anche booking. Possiamo sentirci domani?”</div>
            <div className="mt-3 rounded-3xl border border-slate-100 bg-slate-50 p-5 text-slate-600">Email, WhatsApp and DMs are disconnected. You lose context, urgency and next steps.</div>
          </div>

          <div className="rounded-[2.3rem] bg-slate-950 p-7 text-white shadow-[0_28px_80px_rgba(15,23,42,0.20)]">
            <h3 className="text-2xl font-black tracking-[-0.04em]">After FlowCrew</h3>
            <div className="mt-5 grid gap-3">
              {[
                ["Client", "Marco Bianchi"],
                ["Intent", "Website estimate"],
                ["Urgency", "High"],
                ["Next step", "Schedule discovery call"],
                ["Reply", "Ready to send"],
              ].map(([label, value]) => (
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm" key={label}>
                  <span className="font-black text-blue-200">{label}</span>
                  <b>{value}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">Pricing and early access</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-6xl">Start free. Decide later.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">The trial is available now. Paid plans are still being shaped, so there are no invented prices or surprise billing steps.</p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {earlyAccessPlans.map((plan) => (
            <article className={`flex h-full flex-col rounded-[2rem] border p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)] ${plan.highlighted ? "border-blue-200 bg-blue-50/75" : "border-slate-200 bg-white/84"}`} key={plan.name}>
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-black tracking-[-0.04em] text-slate-950">{plan.name}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${plan.highlighted ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>{plan.status}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li className="flex gap-3 text-sm font-bold text-slate-700" key={feature}>
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.href ? (
                <Link className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 px-5 py-4 font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5" href={plan.href}>
                  {plan.cta}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              ) : (
                <p className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-black text-slate-500">Early access details coming soon</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="trial" className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8">
        <div className="grid gap-8 rounded-[2.5rem] border border-slate-200 bg-white/88 p-7 shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl lg:grid-cols-[0.9fr_1.1fr] lg:items-center sm:p-10">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-700">Free trial</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-6xl">Paste one lead. See the magic.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">No complex setup. Paste a messy client conversation and FlowCrew turns it into a clear summary, tags, urgency and a suggested reply.</p>
          </div>
          <TrialDraftCard outputs={trialOutputs} />
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-200 px-5 py-8 text-sm font-semibold text-slate-500 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p>FlowCrew © 2026 · Premium AI workspace for client conversations</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link className="transition hover:text-slate-950" href="/privacy">Privacy Policy</Link>
            <Link className="transition hover:text-slate-950" href="/terms">Terms</Link>
            <a className="transition hover:text-slate-950" href="mailto:hello@flowcrew.ai">hello@flowcrew.ai</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
