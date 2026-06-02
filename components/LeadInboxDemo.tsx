"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Filter, Inbox, Search } from "lucide-react";
import AgentAvatar from "@/components/AgentAvatar";
import { demoLeads, type AgentId } from "@/lib/data";

const leadMessages = [
  {
    name: "Marco Bianchi",
    source: "WhatsApp + Gmail",
    message: "Vorrei un sito per il mio studio, forse con pagina prenotazioni. Possiamo sentirci domani?",
    priority: "High",
    intent: "Website quote",
    score: 92,
    owner: "jackie" as AgentId,
  },
  {
    name: "Studio Luma",
    source: "Instagram DM",
    message: "Ci serve una landing per un evento, però non sappiamo ancora bene budget e tempi.",
    priority: "Medium",
    intent: "Event landing",
    score: 76,
    owner: "milo" as AgentId,
  },
  {
    name: "Claudia Store",
    source: "Gmail",
    message: "Vorrei capire se potete migliorare il negozio online e aumentare le richieste da clienti locali.",
    priority: "Warm",
    intent: "E-commerce refresh",
    score: 81,
    owner: "nora" as AgentId,
  },
  {
    name: "Andrea Rossi",
    source: "Notes",
    message: "Ha chiesto un logo refresh, ma mancano esempi, budget e deadline precisa.",
    priority: "Needs clarity",
    intent: "Branding",
    score: 61,
    owner: "dex" as AgentId,
  },
];

const statuses = ["All", "High", "Medium", "Warm", "Needs clarity"];

export default function LeadInboxDemo() {
  const [active, setActive] = useState(statuses[0]);
  const [selected, setSelected] = useState(leadMessages[0]);

  const filtered = useMemo(() => {
    if (active === "All") return leadMessages;
    return leadMessages.filter((lead) => lead.priority === active);
  }, [active]);

  return (
    <div className="space-y-5">
      <section className="rounded-[2.25rem] border border-slate-200 bg-white/82 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-8">
        <div className="grid gap-7 xl:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
              <Inbox className="h-4 w-4" />
              Lead inbox
            </div>
            <h1 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-[-0.075em] text-slate-950 md:text-7xl">
              Every messy lead becomes a clean card.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              This page is the operational inbox: conversations from WhatsApp, Gmail and DMs become sortable client cards with priority, intent and next action.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Selected lead</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.06em]">{selected.name}</h2>
                <p className="mt-1 text-sm text-slate-400">{selected.source}</p>
              </div>
              <AgentAvatar agentId={selected.owner} decorative size="lg" />
            </div>
            <p className="mt-5 rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-slate-200">
              {selected.message}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <MiniMetric label="Intent" value={selected.intent} />
              <MiniMetric label="Priority" value={selected.priority} />
              <MiniMetric label="Score" value={`${selected.score}%`} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
        <aside className="rounded-[2rem] border border-slate-200 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Controls</p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-slate-950">Filter leads</h2>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600">
              <Filter className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-slate-400">
              <Search className="h-4 w-4" />
              <span className="text-sm font-bold">Search clients, sources, tags...</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                type="button"
                key={status}
                onClick={() => setActive(status)}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  active === status ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-black text-blue-800">Crew rule</p>
            <p className="mt-2 text-sm leading-6 text-blue-900/70">
              FlowCrew can draft and organize, but replies wait for your approval. This keeps the product trustworthy.
            </p>
          </div>
        </aside>

        <div className="rounded-[2rem] border border-slate-200 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Pipeline</p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-slate-950">Client conversations</h2>
            </div>
            <button className="hidden rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 px-4 py-2 text-sm font-black text-white shadow-[0_14px_34px_rgba(37,99,235,0.20)] sm:block">
              Import message
            </button>
          </div>

          <div className="grid gap-3">
            {filtered.map((lead) => (
              <button
                type="button"
                key={lead.name}
                onClick={() => setSelected(lead)}
                className={`text-left transition hover:-translate-y-0.5 ${selected.name === lead.name ? "scale-[1.01]" : ""}`}
              >
                <article className={`rounded-[1.65rem] border p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)] ${
                  selected.name === lead.name ? "border-blue-200 bg-blue-50/80" : "border-slate-100 bg-white"
                }`}>
                  <div className="grid gap-4 md:grid-cols-[56px_1fr_auto] md:items-center">
                    <AgentAvatar agentId={lead.owner} decorative size="md" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-slate-950">{lead.name}</h3>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-100">{lead.priority}</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-slate-500">{lead.source} · {lead.intent}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{lead.message}</p>
                    </div>
                    <div className="flex items-center gap-3 md:justify-end">
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-500" style={{ width: `${lead.score}%` }} />
                      </div>
                      <b className="text-sm text-slate-950">{lead.score}</b>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </article>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {demoLeads.map((lead) => (
          <article key={lead.id} className="rounded-[2rem] border border-slate-200 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">{lead.status}</span>
            </div>
            <h3 className="text-xl font-black tracking-[-0.04em] text-slate-950">{lead.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{lead.projectType} · {lead.scope}</p>
            <div className="mt-4 flex items-center gap-2 text-sm font-black text-blue-700">
              Open brief <ArrowRight className="h-4 w-4" />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}
