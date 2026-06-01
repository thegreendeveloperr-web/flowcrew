"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clipboard,
  Crown,
  Mail,
  Send,
  Sparkles,
  Target,
} from "lucide-react";

type TrialForm = {
  businessName: string;
  industry: string;
  websiteOrSocial: string;
  leadName: string;
  leadCompany: string;
  leadContact: string;
  goal: string;
  notes: string;
};

const initialForm: TrialForm = {
  businessName: "",
  industry: "",
  websiteOrSocial: "",
  leadName: "",
  leadCompany: "",
  leadContact: "",
  goal: "Book a call",
  notes: "",
};

const agents = [
  {
    name: "Jackie",
    role: "Lead scanner",
    icon: Target,
  },
  {
    name: "Nora",
    role: "Offer strategist",
    icon: Sparkles,
  },
  {
    name: "Milo",
    role: "Outreach writer",
    icon: Mail,
  },
  {
    name: "Dex",
    role: "CRM operator",
    icon: Bot,
  },
];

function getScore(form: TrialForm) {
  let score = 72;

  if (form.websiteOrSocial.trim()) score += 7;
  if (form.leadContact.includes("@")) score += 5;
  if (form.notes.trim().length > 40) score += 6;
  if (form.leadCompany.trim()) score += 4;

  return Math.min(score, 94);
}

export default function TrialPage() {
  const [form, setForm] = useState<TrialForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const leadScore = useMemo(() => getScore(form), [form]);

  const leadTemperature =
    leadScore >= 86 ? "Hot lead" : leadScore >= 78 ? "Warm lead" : "New opportunity";

  const businessName = form.businessName || "your business";
  const industry = form.industry || "your market";
  const leadName = form.leadName || "there";
  const leadCompany = form.leadCompany || "their company";
  const goal = form.goal || "start a conversation";

  const outreachMessage = `Hi ${leadName},

I came across ${leadCompany} and thought there could be a good opportunity to help with ${goal.toLowerCase()}.

At ${businessName}, we work with businesses in ${industry} to create clearer workflows, faster follow-ups, and better client conversations.

Would it make sense to have a quick chat this week?

Best,
${businessName}`;

  function updateField(field: keyof TrialForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function copyMessage() {
    await navigator.clipboard.writeText(outreachMessage);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#07070a] text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-8 md:px-10 md:py-12">
        <a
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to FlowCrew
        </a>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 md:p-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              Free trial: 1 lead included
            </div>

            <h1 className="max-w-xl text-4xl font-semibold tracking-tight md:text-5xl">
              Run your first lead with the FlowCrew agents.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-white/60">
              Insert one lead and see how Jackie, Nora, Milo and Dex would score it,
              package the offer, write the message and prepare the next CRM step.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {agents.map((agent) => {
                const Icon = agent.icon;

                return (
                  <div
                    key={agent.name}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <Icon className="mb-3 h-5 w-5 text-violet-300" />
                    <h3 className="font-medium">{agent.name}</h3>
                    <p className="text-sm text-white/50">{agent.role}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/40 backdrop-blur md:p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Lead details</h2>
              <p className="mt-2 text-sm text-white/50">
                This demo uses local logic only. No external AI API yet.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Business name</span>
                  <input
                    value={form.businessName}
                    onChange={(event) => updateField("businessName", event.target.value)}
                    placeholder="FlowCrew"
                    className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/70"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Industry</span>
                  <input
                    value={form.industry}
                    onChange={(event) => updateField("industry", event.target.value)}
                    placeholder="AI automation, agencies, local business..."
                    className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/70"
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm text-white/70">Website or social</span>
                <input
                  value={form.websiteOrSocial}
                  onChange={(event) => updateField("websiteOrSocial", event.target.value)}
                  placeholder="https://your-site.com or Instagram profile"
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/70"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Lead name</span>
                  <input
                    value={form.leadName}
                    onChange={(event) => updateField("leadName", event.target.value)}
                    placeholder="Mario"
                    className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/70"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Lead company</span>
                  <input
                    value={form.leadCompany}
                    onChange={(event) => updateField("leadCompany", event.target.value)}
                    placeholder="Mario Studio"
                    className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/70"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Lead contact</span>
                  <input
                    value={form.leadContact}
                    onChange={(event) => updateField("leadContact", event.target.value)}
                    placeholder="email, phone, LinkedIn..."
                    className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/70"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Goal</span>
                  <select
                    value={form.goal}
                    onChange={(event) => updateField("goal", event.target.value)}
                    className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-violet-400/70"
                  >
                    <option>Book a call</option>
                    <option>Sell a service</option>
                    <option>Send a follow-up</option>
                    <option>Recover a cold lead</option>
                    <option>Offer an automation</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm text-white/70">Extra notes</span>
                <textarea
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="What do you know about this lead? Pain points, context, previous messages..."
                  rows={4}
                  className="resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-violet-400/70"
                />
              </label>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:bg-violet-100"
              >
                <Send className="h-4 w-4" />
                Run free lead
              </button>
            </div>
          </form>
        </div>

        {submitted && (
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 md:p-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
                  Free trial result
                </p>
                <h2 className="mt-2 text-3xl font-semibold">Your lead has been processed.</h2>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4">
                <p className="text-sm text-emerald-100/70">Free trial usage</p>
                <p className="text-xl font-semibold text-emerald-100">1/1 lead used</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-3xl border border-white/10 bg-black/25 p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">Jackie — Lead score</h3>
                    <p className="text-sm text-white/50">Lead scanner</p>
                  </div>
                  <div className="rounded-2xl bg-violet-400/10 px-4 py-2 text-right">
                    <p className="text-2xl font-semibold text-violet-200">{leadScore}/100</p>
                    <p className="text-xs text-violet-100/60">{leadTemperature}</p>
                  </div>
                </div>

                <p className="leading-7 text-white/65">
                  {leadCompany} looks like a good match for {businessName}. The lead has
                  enough context to start a personalized conversation, especially around{" "}
                  <span className="text-white">{goal.toLowerCase()}</span>.
                </p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-black/25 p-5">
                <h3 className="text-xl font-semibold">Nora — Mini proposal</h3>
                <p className="mt-1 text-sm text-white/50">Offer strategist</p>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="font-medium">Recommended angle</p>
                  <p className="mt-2 leading-7 text-white/65">
                    Position the offer as a quick operational upgrade: faster replies,
                    cleaner lead tracking, and a simple workflow that helps {leadCompany} move
                    from interest to action.
                  </p>
                </div>
              </article>

              <article className="rounded-3xl border border-white/10 bg-black/25 p-5 lg:col-span-2">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Milo — Outreach message</h3>
                    <p className="mt-1 text-sm text-white/50">Ready to copy</p>
                  </div>

                  <button
                    type="button"
                    onClick={copyMessage}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm transition hover:bg-white/15"
                  >
                    <Clipboard className="h-4 w-4" />
                    {copied ? "Copied" : "Copy message"}
                  </button>
                </div>

                <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/35 p-5 text-sm leading-7 text-white/70">
                  {outreachMessage}
                </pre>
              </article>

              <article className="rounded-3xl border border-white/10 bg-black/25 p-5 lg:col-span-2">
                <h3 className="text-xl font-semibold">Dex — CRM log</h3>
                <p className="mt-1 text-sm text-white/50">Next step prepared</p>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm text-white/45">Status</p>
                    <p className="mt-1 font-medium">New opportunity</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm text-white/45">Priority</p>
                    <p className="mt-1 font-medium">{leadTemperature}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm text-white/45">Next step</p>
                    <p className="mt-1 font-medium">Follow up within 24 hours</p>
                  </div>
                </div>
              </article>
            </div>

            <div className="mt-8 rounded-3xl border border-violet-300/20 bg-violet-400/10 p-6 md:flex md:items-center md:justify-between md:gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-violet-100">
                  <Crown className="h-4 w-4" />
                  Trial completed
                </div>

                <h3 className="mt-4 text-2xl font-semibold">Unlock more leads with FlowCrew Pro.</h3>
                <p className="mt-2 max-w-2xl text-white/60">
                  The next version can save leads, generate real AI outputs and limit every
                  account to one free lead before upgrading.
                </p>
              </div>

              <a
                href="/#pricing"
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:bg-violet-100 md:mt-0"
              >
                View pricing
              </a>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}