import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  MessageSquareText,
  Send,
  Sparkles,
} from "lucide-react";
import AgentAvatar from "@/components/AgentAvatar";
import type { AgentId } from "@/lib/data";

const agents: Array<{ id: AgentId; name: string; role: string; state: string }> = [
  { id: "jackie", name: "Jackie", role: "Organizing messages", state: "Live" },
  { id: "milo", name: "Milo", role: "Tagging priority", state: "Ready" },
  { id: "nora", name: "Nora", role: "Drafting replies", state: "Live" },
  { id: "dex", name: "Dex", role: "Finding next steps", state: "Ready" },
];

const recentLeads = [
  ["Marco · Website quote", "Urgent lead from WhatsApp, Gmail and Instagram."],
  ["Studio Luma · Booking page", "Nora drafted a reply. Dex found a date."],
  ["Andrea · Logo refresh", "Milo marked as medium priority."],
  ["Claudia · E-commerce", "Needs follow-up and budget clarification."],
];

function AiMessage({
  agentId,
  name,
  role,
  children,
}: {
  agentId: AgentId;
  name: string;
  role: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[48px_1fr] items-start gap-3 max-sm:grid-cols-1">
      <AgentAvatar agentId={agentId} decorative size="md" className="max-sm:hidden" />
      <div className="max-w-3xl rounded-[1.45rem] border border-slate-200 bg-white/92 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.055)]">
        <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
          {name}
          <span className="font-bold text-slate-400">{role}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_48px] items-start gap-3 max-sm:grid-cols-1">
      <div className="justify-self-end rounded-[1.45rem] bg-slate-950 p-4 text-white shadow-[0_18px_42px_rgba(15,23,42,0.16)]">
        <div className="mb-2 text-sm font-black text-white">You</div>
        <div className="max-w-3xl text-sm leading-6 text-slate-200">{children}</div>
      </div>
      <div className="grid h-12 w-12 place-items-center rounded-[1.1rem] bg-gradient-to-br from-slate-950 to-slate-700 font-black text-white shadow-lg max-sm:hidden">
        M
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12%] top-[-14%] h-[30rem] w-[30rem] rounded-full bg-indigo-400/18 blur-[120px]" />
        <div className="absolute right-[-12%] top-[6%] h-[32rem] w-[32rem] rounded-full bg-cyan-300/16 blur-[130px]" />
        <div className="absolute bottom-[-18%] left-[45%] h-[28rem] w-[28rem] rounded-full bg-violet-400/12 blur-[120px]" />
      </div>

      <div className="relative z-10 grid min-h-screen grid-cols-[286px_minmax(0,1fr)_336px] gap-4 p-4 max-xl:grid-cols-[260px_minmax(0,1fr)] max-md:grid-cols-1 max-md:p-3">
        <aside className="flex min-h-0 flex-col rounded-[2rem] border border-slate-200 bg-white/82 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl max-md:hidden">
          <Link className="mb-5 flex items-center gap-3" href="/">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-500 text-lg font-black text-white shadow-[0_16px_35px_rgba(37,99,235,0.26)]">F</span>
            <span>
              <span className="block text-xl font-black tracking-[-0.055em]">FlowCrew</span>
              <span className="block text-xs font-bold text-slate-500">AI client workspace</span>
            </span>
          </Link>

          <button className="mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 px-4 py-3 text-sm font-black text-white shadow-[0_16px_35px_rgba(37,99,235,0.24)]">
            + New lead chat
          </button>

          <p className="mb-2 mt-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Workspace</p>
          <div className="grid gap-2">
            {[
              ["AI Dialogue", "✦"],
              ["Lead briefs", "#"],
              ["Replies", "↗"],
              ["Follow-ups", "◷"],
            ].map(([label, icon], index) => (
              <div className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-black ${index === 0 ? "border border-slate-200 bg-white text-blue-700 shadow-sm" : "text-slate-500"}`} key={label}>
                <span className="grid h-7 w-7 place-items-center rounded-xl bg-blue-50 text-blue-600">{icon}</span>
                {label}
              </div>
            ))}
          </div>

          <p className="mb-2 mt-6 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Recent leads</p>
          <div className="grid gap-2 overflow-auto pr-1">
            {recentLeads.map(([title, body], index) => (
              <div className={`rounded-2xl p-3 ${index === 0 ? "border border-slate-200 bg-white shadow-sm" : ""}`} key={title}>
                <p className="text-sm font-black tracking-[-0.02em]">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="font-black tracking-[-0.025em]">Premium mode enabled</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Cleaner briefs, stronger replies and deeper lead reasoning from the full crew.</p>
          </div>
        </aside>

        <section className="grid min-h-0 grid-rows-[auto_1fr_auto] overflow-hidden rounded-[2rem] border border-slate-200 bg-white/82 shadow-[0_18px_55px_rgba(15,23,42,0.09)] backdrop-blur-2xl">
          <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/72 px-5 py-4 max-sm:flex-col max-sm:items-start">
            <div className="flex items-center gap-3">
              <Link className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm" href="/">
                <ArrowLeft aria-hidden="true" className="h-5 w-5" />
              </Link>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-slate-950 to-slate-700 font-black text-white shadow-lg">
                M
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-[-0.055em]">Marco Bianchi · New client lead</h1>
                <p className="text-sm font-semibold text-slate-500">AI dialogue with Jackie, Milo, Nora and Dex</p>
              </div>
            </div>
            <div className="flex gap-2 max-sm:w-full">
              <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm max-sm:flex-1">Export brief</button>
              <button className="rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 px-4 py-2 text-sm font-black text-white shadow-[0_14px_30px_rgba(37,99,235,0.24)] max-sm:flex-1">Approve reply</button>
            </div>
          </header>

          <div className="overflow-auto p-5 sm:p-7">
            <div className="mx-auto mb-7 max-w-4xl rounded-[2rem] border border-slate-200 bg-white/88 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.13)]" />
                FlowCrew dialogue mode
              </div>
              <h2 className="text-4xl font-black tracking-[-0.06em] max-sm:text-3xl">Talk to your AI crew like ChatGPT.</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Paste a messy client conversation, ask questions, request a reply or tell the crew what to prioritize. Each agent responds with its own role and responsibility.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {["Summarize this lead and tell me what matters.", "Write a human reply I can send on WhatsApp.", "Find deadlines, urgency and next actions."].map((prompt) => (
                  <button className="rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm font-bold leading-5 text-slate-700 shadow-sm" key={prompt}>{prompt}</button>
                ))}
              </div>
            </div>

            <div className="mx-auto grid max-w-4xl gap-5">
              <UserMessage>
                Ciao, ho ricevuto messaggi da Marco su WhatsApp, Gmail e Instagram. Vuole un sito per il suo studio, forse una pagina prenotazioni, dice che gli serve presto e vorrebbe sentirci domani. Puoi organizzarmi tutto?
              </UserMessage>

              <AiMessage agentId="jackie" name="Jackie" role="The Organizer">
                <p className="text-sm leading-6 text-slate-600">Ho unificato i messaggi in una scheda unica. Il lead è chiaro: Marco vuole un sito professionale per il suo studio e sta valutando anche una pagina prenotazioni collegata al calendario.</p>
                <div className="mt-3 grid gap-2">
                  {[
                    ["Cliente", "Marco Bianchi"],
                    ["Richiesta", "Sito studio + possibile booking page"],
                    ["Contesto", "Ha scritto da più canali e vuole una call domani"],
                  ].map(([label, value]) => (
                    <div className="grid grid-cols-[120px_1fr] rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm max-sm:grid-cols-1" key={label}>
                      <span className="font-black text-slate-400">{label}</span>
                      <b>{value}</b>
                    </div>
                  ))}
                </div>
              </AiMessage>

              <AiMessage agentId="milo" name="Milo" role="The Classifier">
                <p className="text-sm leading-6 text-slate-600">Lo classificherei come lead ad alta intenzione. Non sta chiedendo solo “quanto costa”: ha già menzionato logo, urgenza, call e funzionalità extra.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    ["High intent", "bg-blue-50 text-blue-700 ring-blue-100"],
                    ["Needs quote", "bg-cyan-50 text-cyan-700 ring-cyan-100"],
                    ["Urgent", "bg-rose-50 text-rose-700 ring-rose-100"],
                    ["Call requested", "bg-emerald-50 text-emerald-700 ring-emerald-100"],
                  ].map(([tag, klass]) => (
                    <span className={`rounded-full px-3 py-1.5 text-xs font-black ring-1 ${klass}`} key={tag}>{tag}</span>
                  ))}
                </div>
              </AiMessage>

              <AiMessage agentId="dex" name="Dex" role="The Follow-up Engine">
                <p className="text-sm leading-6 text-slate-600">Prossima azione: fissare una call domani. Prima della call chiederei budget indicativo, deadline reale e due esempi di siti che gli piacciono.</p>
                <div className="mt-3 grid gap-2">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm"><b>Next action:</b> proporre call domani</div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm"><b>Da chiedere:</b> budget, deadline, esempi, booking</div>
                </div>
              </AiMessage>

              <AiMessage agentId="nora" name="Nora" role="The Communicator">
                <p className="text-sm leading-6 text-slate-600">Ho preparato una risposta breve, umana e abbastanza premium. Non sembra automatica e porta Marco verso la call.</p>
                <div className="mt-3 rounded-2xl bg-slate-950 p-4 text-white shadow-[0_16px_36px_rgba(15,23,42,0.16)]">
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.13em] text-blue-200">Premium reply</p>
                  <p className="text-sm leading-6 text-slate-200">Ciao Marco, grazie per il contesto. Volentieri, fissiamo una call domani così analizziamo obiettivi, funzionalità di prenotazione e tempistiche. Prima della call, se puoi, mandami il logo e qualche riferimento visivo: in questo modo posso darti una valutazione più precisa e concreta.</p>
                </div>
              </AiMessage>

              <UserMessage>Rendila un po’ più premium e meno “freelancer disperato”.</UserMessage>

              <AiMessage agentId="nora" name="Nora" role="The Communicator">
                <p className="text-sm leading-6 text-slate-600">Perfetto. Versione più sicura, pulita e professionale:</p>
                <div className="mt-3 rounded-2xl bg-slate-950 p-4 text-white shadow-[0_16px_36px_rgba(15,23,42,0.16)]">
                  <p className="text-sm leading-6 text-slate-200">Ciao Marco, grazie per avermi mandato il contesto. Ti propongo di sentirci domani per definire obiettivi, funzionalità di prenotazione e tempistiche. Se riesci, inviami anche logo e un paio di riferimenti visivi: così arrivo alla call con una valutazione più precisa.</p>
                </div>
              </AiMessage>
            </div>
          </div>

          <footer className="border-t border-slate-200 bg-white/72 p-4">
            <div className="mx-auto grid max-w-4xl grid-cols-[1fr_auto] items-end gap-3 rounded-[1.6rem] border border-slate-200 bg-white p-2 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
              <textarea className="min-h-14 resize-none rounded-[1.3rem] border-0 bg-transparent px-4 py-3 text-sm leading-6 text-slate-700 outline-none" defaultValue="Chiedi agli agenti di migliorare la risposta o creare un brief completo..." />
              <button className="grid h-12 w-12 place-items-center rounded-[1.1rem] bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)]">
                <Send aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </footer>
        </section>

        <aside className="overflow-auto rounded-[2rem] border border-slate-200 bg-white/82 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl max-xl:col-span-2 max-md:col-span-1">
          <h2 className="text-2xl font-black tracking-[-0.055em]">Active AI crew</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">Each agent has a face, role and task in the conversation.</p>

          <div className="mt-5 grid gap-3">
            {agents.map((agent) => (
              <div className="grid grid-cols-[52px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm" key={agent.id}>
                <AgentAvatar agentId={agent.id} decorative size="md" />
                <div>
                  <p className="text-sm font-black tracking-[-0.02em]">{agent.name}</p>
                  <p className="text-xs font-semibold text-slate-500">{agent.role}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-100">{agent.state}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-black tracking-[-0.03em]">Lead intelligence</h3>
            {[
              ["Intent", "High"],
              ["Urgency", "High"],
              ["Reply ready", "96%"],
            ].map(([label, value]) => (
              <div className="flex items-center justify-between border-t border-slate-100 py-3 text-sm first:border-t-0 first:pt-0" key={label}>
                <span className="font-bold text-slate-500">{label}</span>
                <b>{value}</b>
              </div>
            ))}
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-blue-600 to-violet-500" />
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-black tracking-[-0.03em]">Next actions</h3>
            {[
              "Send premium reply to Marco.",
              "Schedule discovery call for tomorrow.",
              "Ask for logo, examples, budget and deadline.",
              "Create quote after call.",
            ].map((task, index) => (
              <div className="mb-2 flex gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm leading-5 text-slate-600" key={task}>
                {index < 2 ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> : <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />}
                <span><b>{index + 1}.</b> {task}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-black tracking-[-0.03em]">Output types</h3>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 rounded-2xl bg-blue-50 p-3 text-sm font-black text-blue-700"><FileText className="h-4 w-4" /> Client brief ready</div>
              <div className="flex items-center gap-2 rounded-2xl bg-violet-50 p-3 text-sm font-black text-violet-700"><MessageSquareText className="h-4 w-4" /> WhatsApp reply ready</div>
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-sm font-black text-emerald-700"><Sparkles className="h-4 w-4" /> Follow-up set</div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
