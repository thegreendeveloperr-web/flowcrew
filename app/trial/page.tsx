"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  MessageSquareText,
  Sparkles,
  Tags,
  WandSparkles,
} from "lucide-react";
import AgentAvatar from "@/components/AgentAvatar";
import type { AgentId } from "@/lib/data";

const agents: Array<{ id: AgentId; name: string; role: string; detail: string }> = [
  { id: "jackie", name: "Jackie", role: "Organizer", detail: "Creates the clean brief" },
  { id: "milo", name: "Milo", role: "Classifier", detail: "Tags intent and urgency" },
  { id: "nora", name: "Nora", role: "Communicator", detail: "Writes the reply" },
  { id: "dex", name: "Dex", role: "Follow-up", detail: "Finds next actions" },
];

const sample = `Ciao, volevo capire quanto costa fare un sito per il mio studio. Ho scritto anche via mail e ti ho mandato il logo. Mi servirebbe abbastanza presto, forse anche una pagina prenotazioni collegata al calendario. Possiamo sentirci domani?`;

export default function TrialPage() {
  const [message, setMessage] = useState(sample);
  const [generated, setGenerated] = useState(false);

  const output = useMemo(() => {
    const hasBooking = message.toLowerCase().includes("prenot");
    const hasTomorrow = message.toLowerCase().includes("domani");

    return {
      client: "Marco Bianchi",
      request: hasBooking ? "Sito professionale + pagina prenotazioni" : "Sito professionale",
      priority: hasTomorrow ? "Alta · vuole una call domani" : "Media · serve chiarire tempi",
      tags: ["Quote request", "High intent", hasBooking ? "Booking page" : "Website", hasTomorrow ? "Urgent" : "Needs clarity"],
      next: hasTomorrow ? "Proporre call domani e chiedere budget, deadline ed esempi" : "Chiedere budget, deadline ed esempi visivi",
    };
  }, [message]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f8fc] text-slate-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-14%] top-[-18%] h-[34rem] w-[34rem] rounded-full bg-indigo-300/24 blur-[130px]" />
        <div className="absolute right-[-14%] top-[3%] h-[34rem] w-[34rem] rounded-full bg-cyan-200/26 blur-[130px]" />
        <div className="absolute bottom-[-20%] left-[38%] h-[30rem] w-[30rem] rounded-full bg-violet-300/18 blur-[130px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/82 px-4 py-2 text-sm font-black text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <Link href="/chat" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)]">
            Open dialogue <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <section className="grid gap-7 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div className="self-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/82 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700 shadow-[0_10px_25px_rgba(37,99,235,0.07)] backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" />
              Free trial · one lead
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.075em] text-slate-950 md:text-7xl">
              Paste a messy lead. Watch FlowCrew organize it.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              This is the product moment: a client message goes in, Jackie, Milo, Nora and Dex turn it into a brief, tags, next action and a ready-to-send reply.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {agents.map((agent) => (
                <div key={agent.id} className="rounded-[1.65rem] border border-slate-200 bg-white/82 p-4 text-center shadow-[0_16px_40px_rgba(15,23,42,0.07)] backdrop-blur-xl">
                  <AgentAvatar agentId={agent.id} decorative size="md" className="mx-auto" />
                  <p className="mt-3 text-sm font-black text-slate-950">{agent.name}</p>
                  <p className="text-xs font-bold text-slate-500">{agent.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.35rem] border border-slate-200 bg-white/86 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Lead input</p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.05em]">Conversation analyzer</h2>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                <WandSparkles className="h-5 w-5" />
              </div>
            </div>

            <label className="block text-sm font-black text-slate-700">
              Client conversation
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={8}
                className="mt-2 w-full resize-none rounded-[1.35rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <button
              type="button"
              onClick={() => setGenerated(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 px-5 py-4 text-sm font-black text-white shadow-[0_18px_40px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5"
            >
              Generate client brief <Sparkles className="h-4 w-4" />
            </button>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <ResultCard icon={<ClipboardList className="h-5 w-5" />} title="Clean brief" active={generated}>
                <OutputLine label="Client" value={generated ? output.client : "Waiting for input"} />
                <OutputLine label="Request" value={generated ? output.request : "—"} />
                <OutputLine label="Priority" value={generated ? output.priority : "—"} />
              </ResultCard>

              <ResultCard icon={<Tags className="h-5 w-5" />} title="Smart tags" active={generated}>
                <div className="flex flex-wrap gap-2">
                  {(generated ? output.tags : ["Quote", "Urgency", "Next step"]).map((tag) => (
                    <span key={tag} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700 ring-1 ring-blue-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </ResultCard>

              <ResultCard icon={<CheckCircle2 className="h-5 w-5" />} title="Next action" active={generated} className="md:col-span-2">
                <p className="text-sm leading-6 text-slate-600">{generated ? output.next : "Generate the brief to see the recommended next step."}</p>
              </ResultCard>

              <ResultCard icon={<MessageSquareText className="h-5 w-5" />} title="Premium reply" active={generated} className="md:col-span-2">
                <div className="rounded-2xl bg-slate-950 p-4 text-white">
                  <p className="text-sm leading-6 text-slate-200">
                    {generated
                      ? "Ciao Marco, grazie per il contesto. Volentieri, fissiamo una call domani così analizziamo obiettivi, funzionalità di prenotazione e tempistiche. Prima della call, se puoi, mandami logo e qualche riferimento visivo: così posso darti una valutazione più precisa."
                      : "La risposta comparirà qui dopo l’analisi del lead."}
                  </p>
                </div>
              </ResultCard>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ResultCard({
  icon,
  title,
  active,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={`rounded-[1.45rem] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-black text-slate-950">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-blue-50 text-blue-600">{icon}</span>
          {title}
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-black ${active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          {active ? "Ready" : "Idle"}
        </span>
      </div>
      {children}
    </article>
  );
}

function OutputLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-3 border-t border-slate-100 py-2 first:border-t-0">
      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">{label}</span>
      <b className="text-sm text-slate-800">{value}</b>
    </div>
  );
}
