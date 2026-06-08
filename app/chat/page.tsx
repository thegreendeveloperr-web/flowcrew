"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  MessageSquareText,
  Tags,
} from "lucide-react";

const agents = [
  ["Jackie", "Organizes the chaos", "Summary and request"],
  ["Milo", "Finds priorities and tasks", "Next actions"],
  ["Nora", "Prepares replies", "Reply draft"],
  ["Dex", "Classifies and connects", "Tags and status"],
];

const transcript = [
  {
    side: "user",
    label: "Client message",
    text:
      "hi, my brother and I need to do something for the shop... yes I mean a website, but maybe social management too? I am not sure yet. anyway we need it by the end of the month. oh, and we do not have a huge budget, maybe max 800€. tell me what you think",
  },
  {
    side: "ai",
    label: "Jackie",
    text:
      "I cleaned up the message: the client wants a website for the shop, possibly social management too. They have an end-of-month deadline and an indicative maximum budget of 800€.",
  },
  {
    side: "ai",
    label: "Milo",
    text:
      "Task: clarify whether the site is brochure or e-commerce, understand whether social means setup or monthly management, prepare a quote within 24 hours.",
  },
  {
    side: "ai",
    label: "Nora",
    text:
      "Ready reply: Hi! Of course, we can talk about it. To understand better: should the website only present the shop or also sell online? And for social, were you thinking about monthly management or just an initial setup?",
  },
];

const outputs = [
  [FileText, "Summary", "Website + social request, 800€ budget, tight deadline."],
  [Clock3, "Priority", "Warm lead to qualify immediately."],
  [MessageSquareText, "Reply", "Clear questions to define scope and quote."],
  [Tags, "Tags", "warm-lead, website, limited-budget"],
] as const;

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[var(--fc-bg)] px-4 py-4 text-[var(--fc-text)] sm:px-6">
      <div className="mx-auto grid max-w-[1560px] gap-4 xl:grid-cols-[320px_minmax(0,1fr)_380px]">
        <aside className="fc-panel p-5">
          <Link href="/" className="mb-8 inline-flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--fc-accent)] text-sm font-black text-black">
              F
            </span>
            <span className="text-lg font-extrabold tracking-[-0.04em]">FlowCrew</span>
          </Link>

          <p className="fc-label">Static demo</p>
          <h1 className="mt-4 text-3xl font-extrabold leading-none tracking-[-0.055em] sm:text-4xl">
            AI crew transcript
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--fc-text-muted)]">
            A static demonstration of how client chaos becomes a brief, tasks, tags, and a reply.
          </p>

          <div className="mt-8 grid gap-3">
            {agents.map(([name, role, tag]) => (
              <article key={name} className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
                <h2 className="text-xl font-extrabold tracking-[-0.04em]">{name}</h2>
                <p className="mt-2 text-sm text-[var(--fc-text-muted)]">{role}</p>
                <p className="fc-label mt-4">{tag}</p>
              </article>
            ))}
          </div>
        </aside>

        <section className="fc-panel overflow-hidden">
          <header className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="grid h-12 w-12 place-items-center rounded-full border border-white/[0.08] bg-white/[0.025]">
                <ArrowLeft aria-hidden="true" className="h-5 w-5" />
              </Link>
              <div>
                <p className="fc-label">Demo · no account required</p>
                <h2 className="text-3xl font-extrabold leading-none tracking-[-0.055em]">
                  See FlowCrew in action
                </h2>
              </div>
            </div>

            <Link href="/trial" className="fc-button fc-button-primary">
              Analyze your own lead
            </Link>
          </header>

          <div className="space-y-6 p-5 sm:p-8">
            {transcript.map((message) => (
              <article
                key={message.label}
                className={`rounded-[1.7rem] border p-5 ${
                  message.side === "user"
                    ? "border-[rgba(200,245,66,0.2)] bg-[rgba(200,245,66,0.08)]"
                    : "border-white/[0.07] bg-white/[0.035]"
                }`}
              >
                <p className="fc-label">{message.label}</p>
                <p className="mt-3 text-base leading-8 text-[var(--fc-text-muted)]">
                  {message.text}
                </p>
              </article>
            ))}
          </div>

          <footer className="flex flex-col gap-3 border-t border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-[var(--fc-text-muted)]">
              Static demo. To analyze a real message, use the free trial.
            </p>
            <Link href="/trial" className="fc-button fc-button-primary">
              Analyze your own lead
            </Link>
          </footer>
        </section>

        <aside className="fc-panel p-5">
          <h2 className="text-3xl font-extrabold tracking-[-0.055em]">Generated outputs</h2>

          <div className="mt-6 grid gap-4">
            {outputs.map(([Icon, title, body]) => (
              <article key={title} className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-5">
                <div className="flex items-center gap-3">
                  <Icon aria-hidden="true" className="h-5 w-5 text-[var(--fc-accent)]" />
                  <h3 className="text-xl font-extrabold tracking-[-0.04em]">{title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">{body}</p>
              </article>
            ))}

            <article className="rounded-2xl border border-[rgba(139,255,197,0.24)] bg-[rgba(139,255,197,0.08)] p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-[var(--fc-mint)]" />
                <h3 className="text-xl font-extrabold tracking-[-0.04em] text-[var(--fc-mint)]">
                  Approval-first
                </h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">
                FlowCrew prepares summaries, tags, next steps and replies. You decide what to copy, edit, or send.
              </p>
            </article>
          </div>
        </aside>
      </div>
    </main>
  );
}
