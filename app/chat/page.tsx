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
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";

const chatCopy = {
  it: {
    agents: [
      ["Jackie", "Organizza il caos", "Riepilogo e richiesta"],
      ["Milo", "Trova priorità e task", "Prossime azioni"],
      ["Nora", "Prepara risposte", "Bozza risposta"],
      ["Dex", "Classifica e collega", "Tag e stato"],
    ],
    transcript: [
      {
        side: "user",
        label: "Messaggio cliente",
        text:
          "ciao, io e mio fratello dobbiamo fare una cosa per il negozio... sì voglio dire un sito, ma magari anche la gestione social? non lo so ancora bene. comunque ci serviva entro fine mese tipo. ah, e non abbiamo budget enorme, max 800€ forse. dimmi tu",
      },
      {
        side: "ai",
        label: "Jackie",
        text:
          "Ho ripulito il messaggio: il cliente vuole un sito per il negozio, forse anche gestione social. Ha una scadenza entro fine mese e un budget massimo indicativo di 800€.",
      },
      {
        side: "ai",
        label: "Milo",
        text:
          "Task: chiarire se il sito è vetrina o e-commerce, capire se i social sono setup o gestione mensile, preparare un preventivo entro 24 ore.",
      },
      {
        side: "ai",
        label: "Nora",
        text:
          "Risposta pronta: Ciao! Certo, possiamo parlarne. Per capire meglio: il sito deve essere solo vetrina o deve anche vendere online? E per i social pensavate a una gestione mensile o solo a un setup iniziale?",
      },
    ],
    previewLabel: "Demo preview",
    title: "Trascrizione AI crew",
    body:
      "Una dimostrazione statica di come il caos cliente diventa brief, task, tag e risposta.",
    headerLabel: "Demo",
    headerTitle: "Vedi FlowCrew in azione",
    trialCta: "Prova un lead",
    footer:
      "Demo statica. Per analizzare un messaggio reale usa il trial gratuito.",
    footerCta: "Prova gratis",
    outputsTitle: "Output generati",
    outputs: [
      [FileText, "Riepilogo", "Richiesta sito + social, budget 800€, scadenza stretta."],
      [Clock3, "Priorità", "Lead caldo da qualificare subito."],
      [MessageSquareText, "Risposta", "Domande chiare per definire scope e preventivo."],
      [Tags, "Tag", "lead-caldo, sito-web, budget-limitato"],
    ],
    approvalTitle: "Approval-first",
    approvalBody:
      "FlowCrew prepara. Sei tu a decidere cosa copiare, modificare o inviare.",
  },
  en: {
    agents: [
      ["Jackie", "Organizes the chaos", "Summary and request"],
      ["Milo", "Finds priorities and tasks", "Next actions"],
      ["Nora", "Prepares replies", "Reply draft"],
      ["Dex", "Classifies and connects", "Tags and status"],
    ],
    transcript: [
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
    ],
    previewLabel: "Demo preview",
    title: "AI crew transcript",
    body:
      "A static demonstration of how client chaos becomes a brief, tasks, tags, and a reply.",
    headerLabel: "Demo",
    headerTitle: "See FlowCrew in action",
    trialCta: "Try one lead",
    footer:
      "Static demo. To analyze a real message, use the free trial.",
    footerCta: "Try free",
    outputsTitle: "Generated outputs",
    outputs: [
      [FileText, "Summary", "Website + social request, 800€ budget, tight deadline."],
      [Clock3, "Priority", "Warm lead to qualify immediately."],
      [MessageSquareText, "Reply", "Clear questions to define scope and quote."],
      [Tags, "Tags", "warm-lead, website, limited-budget"],
    ],
    approvalTitle: "Approval-first",
    approvalBody:
      "FlowCrew prepares. You decide what to copy, edit, or send.",
  },
} as const;

export default function ChatPage() {
  const { language } = useLanguage();
  const copy = chatCopy[language];

  return (
    <main className="flow-lime-glow min-h-screen overflow-hidden bg-[var(--fc-bg)] text-[var(--fc-text)]" id="main-content" tabIndex={-1}>
      <div className="pointer-events-none fixed inset-0 flow-grid-dark opacity-60" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1500px] gap-4 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)_340px]">
        <aside className="fc-panel hidden p-4 lg:block">
          <Link className="mb-6 flex items-center gap-3" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--fc-accent)] text-sm font-extrabold text-[#080808]">F</span>
            <span className="font-bold tracking-[-0.03em]">FlowCrew</span>
          </Link>

          <p className="fc-label">{copy.previewLabel}</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-none tracking-[-0.055em]">
            {copy.title}
          </h1>
          <p className="mt-4 text-sm leading-6 text-[var(--fc-text-muted)]">
            {copy.body}
          </p>

          <div className="mt-6 grid gap-2">
            {copy.agents.map(([name, role, detail]) => (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3" key={name}>
                <p className="font-bold">{name}</p>
                <p className="mt-1 text-xs text-[var(--fc-text-muted)]">{role}</p>
                <p className="flow-mono mt-2 text-[0.65rem] uppercase tracking-[0.1em] text-[var(--fc-text-soft)]">{detail}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="fc-panel grid min-h-0 grid-rows-[auto_1fr_auto] overflow-hidden">
          <header className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4 max-sm:flex-col max-sm:items-start">
            <div className="flex items-center gap-3">
              <Link aria-label="Back to homepage" className="fc-button h-10 w-10 p-0" href="/">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              </Link>
              <div>
                <p className="fc-label">{copy.headerLabel}</p>
                <h2 className="text-2xl font-extrabold tracking-[-0.05em]">{copy.headerTitle}</h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <Link className="fc-button fc-button-primary" href="/trial">{copy.trialCta}</Link>
            </div>
          </header>

          <div className="overflow-auto p-5 sm:p-7">
            <div className="mx-auto grid max-w-4xl gap-5">
              {copy.transcript.map((message) => (
                <div className={message.side === "user" ? "ml-auto max-w-3xl" : "mr-auto max-w-3xl"} key={message.label}>
                  <div className={`rounded-3xl border p-5 ${
                    message.side === "user"
                      ? "border-[rgba(200,245,66,0.22)] bg-[rgba(200,245,66,0.08)]"
                      : "border-white/[0.06] bg-white/[0.035]"
                  }`}>
                    <p className="flow-mono mb-3 text-xs uppercase tracking-[0.12em] text-[var(--fc-text-soft)]">{message.label}</p>
                    <p className="text-sm leading-7 text-[var(--fc-text-muted)]">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <footer className="border-t border-white/[0.06] p-4">
            <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-[var(--fc-text-muted)]">{copy.footer}</p>
              <Link className="fc-button fc-button-primary shrink-0" href="/trial">{copy.footerCta}</Link>
            </div>
          </footer>
        </section>

        <aside className="fc-panel p-4 lg:overflow-auto">
          <h2 className="text-2xl font-extrabold tracking-[-0.05em]">{copy.outputsTitle}</h2>
          <div className="mt-5 grid gap-3">
            {copy.outputs.map(([Icon, title, body]) => {
              const TypedIcon = Icon as typeof FileText;
              return (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4" key={title as string}>
                  <div className="flex items-center gap-2 text-[var(--fc-accent)]">
                    <TypedIcon className="h-4 w-4" />
                    <p className="font-bold text-[var(--fc-text)]">{title as string}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--fc-text-muted)]">{body as string}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-[rgba(139,255,197,0.22)] bg-[rgba(139,255,197,0.08)] p-4">
            <div className="flex items-center gap-2 text-[var(--fc-mint)]">
              <CheckCircle2 className="h-4 w-4" />
              <p className="font-bold">{copy.approvalTitle}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--fc-text-muted)]">
              {copy.approvalBody}
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
