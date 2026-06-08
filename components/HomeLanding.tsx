"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  GitBranch,
  Inbox,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";

const homepageTranslations = {
  en: {
    nav: {
      ariaLabel: "Main navigation",
      howItWorks: "How it works",
      example: "Example",
      product: "Product",
      pricing: "Pricing",
      analyze: "Analyze one lead free",
    },
    hero: {
      title: "Stop losing clients",
      accent: "in the chaos.",
      body:
        "FlowCrew turns messy WhatsApp, email, and DM conversations into structured leads: summary, priority, reply, and next action.",
      microcopy: "Paste a real request and FlowCrew opens the workspace.",
      primaryCta: "Analyze one lead free",
      secondaryCta: "See pricing",
      proofItems: ["1 lead free", "No card required", "WhatsApp, email or DM"],
      clientMessageLabel: "Client message",
      clientMessage:
        "Hi, I saw your profile and wanted to ask for a quote. I need a simple but professional website with services, an image gallery, and a contact form.",
      outputCards: [
        {
          title: "Lead summary",
          badge: "Jackie",
          body:
            "Website quote request. Needs services page, gallery, and contact form. Content is not ready yet.",
        },
        {
          title: "Priority",
          badge: "Nora",
          body:
            "Medium-high. The deadline and budget are unclear, but scope and assets still need confirmation.",
        },
        {
          title: "Suggested reply",
          badge: "Milo",
          body:
            "Ask for business details, pages, photos, deadline, and budget before pricing.",
        },
        {
          title: "Handoff",
          badge: "Dex",
          body:
            "Qualify scope, collect materials, then prepare a realistic price range and timeline.",
        },
      ],
    },
    workflow: {
      title: "Client chaos becomes a workspace.",
      body: "No fake demo data. One real message becomes a lead you can act on.",
      steps: [
        {
          step: "01",
          title: "Paste the client message",
          body:
            "Drop in the raw WhatsApp, email, or DM. No cleanup, no form filling.",
        },
        {
          step: "02",
          title: "FlowCrew opens the workspace",
          body:
            "Jackie, Nora, Milo, and Dex extract the request, scope, priority, reply, and handoff.",
        },
        {
          step: "03",
          title: "Act on the lead",
          body:
            "You get a compact summary, tags, next action, and a reply draft you can copy or adjust.",
        },
      ],
    },
    example: {
      title: "Before and after, without pretending it is magic.",
      body:
        "FlowCrew keeps the original context visible and turns it into practical output.",
      before: "Before FlowCrew",
      beforeBody:
        "Hi, I need a website for my makeup business, maybe with booking, prices, gallery and Instagram links. Not sure about the budget yet, but I want something clean and professional.",
      after: "After FlowCrew",
      outputCards: [
        {
          agent: "Summary",
          title: "What the client wants",
          body:
            "Website for a makeup business with booking, prices, gallery, and Instagram links.",
          detail: "Missing: budget, deadline, brand assets, booking flow, and number of pages.",
        },
        {
          agent: "Priority",
          title: "How urgent it is",
          body:
            "Warm lead, but not ready for a quote until the missing details are clear.",
          detail: "Recommended action: qualify now, estimate later.",
        },
        {
          agent: "Reply",
          title: "What to send next",
          body:
            "A short discovery reply asking for pages, services, photos, deadline, and budget range.",
          detail: "The reply is prepared, but you decide what to copy, edit, or send.",
        },
        {
          agent: "Next action",
          title: "What happens next",
          body:
            "Collect missing project details, then prepare a realistic proposal range.",
          detail: "No automatic messages are sent by FlowCrew.",
        },
      ],
    },
    product: {
      title: "What you get from one pasted message.",
      body:
        "The homepage sells the promise. The trial page shows the real product flow.",
      items: [
        {
          title: "Lead summary",
          body: "A clear version of the messy client request.",
        },
        {
          title: "Priority and tags",
          body: "Warm, unclear, urgent, limited budget, missing assets, and more.",
        },
        {
          title: "Suggested reply",
          body: "A draft response you can copy, edit, or ignore.",
        },
        {
          title: "Next action",
          body: "What to ask, what to collect, and what to do before quoting.",
        },
        {
          title: "Saved workspace",
          body: "Every analyzed lead can become part of your client inbox.",
        },
        {
          title: "Manual first",
          body: "Today it works by paste/import. Automatic integrations come later.",
        },
      ],
    },
    trust: {
      title: "Approval-first",
      body:
        "FlowCrew prepares summaries, tags, next steps, and replies. You decide what to copy, edit, or send.",
      privacyTitle: "Private by default",
      privacyBody:
        "Your client messages are used only to generate your lead workspace. FlowCrew does not auto-send messages.",
    },
    builtFor: {
      title: "Built for client work that starts in a message.",
      body:
        "For freelancers, small agencies, consultants, and service providers who receive real requests in messy channels.",
      items: [
        {
          title: "Freelancers",
          body: "Turn informal inquiries into a clear brief before you quote.",
        },
        {
          title: "Small agencies",
          body: "Give every incoming request a consistent first review.",
        },
        {
          title: "Consultants",
          body: "Surface objective, urgency, and missing context faster.",
        },
        {
          title: "Web studios",
          body: "Separate project scope from vague website requests.",
        },
        {
          title: "Creative services",
          body: "Organize ideas, deliverables, assets, and follow-up questions.",
        },
        {
          title: "Client businesses",
          body: "Keep sales and support requests from disappearing in chat.",
        },
      ],
    },
    finalCta: {
      title: "Try the product, not another pitch.",
      body:
        "Paste one real client message and see the lead workspace appear.",
      button: "Analyze one lead free",
      pricing: "See pricing",
    },
    footer: {
      pricing: "Pricing",
      contact: "Contact",
    },
  },
  it: {
    nav: {
      ariaLabel: "Navigazione principale",
      howItWorks: "Come funziona",
      example: "Esempio",
      product: "Prodotto",
      pricing: "Prezzi",
      analyze: "Analizza un lead gratis",
    },
    hero: {
      title: "Smetti di perdere clienti",
      accent: "nel caos.",
      body:
        "FlowCrew trasforma conversazioni WhatsApp, email e DM in lead strutturati: riepilogo, priorità, risposta e prossima azione.",
      microcopy: "Incolla una richiesta reale e FlowCrew apre il workspace.",
      primaryCta: "Analizza un lead gratis",
      secondaryCta: "Vedi prezzi",
      proofItems: ["1 lead gratis", "Nessuna carta richiesta", "WhatsApp, email o DM"],
      clientMessageLabel: "Messaggio cliente",
      clientMessage:
        "Ciao, ho visto il tuo profilo e vorrei un preventivo. Mi serve un sito semplice ma professionale con servizi, galleria immagini e modulo contatti.",
      outputCards: [
        {
          title: "Riepilogo lead",
          badge: "Jackie",
          body:
            "Richiesta preventivo sito. Servono pagina servizi, galleria e modulo contatti. I contenuti non sono ancora pronti.",
        },
        {
          title: "Priorità",
          badge: "Nora",
          body:
            "Medio-alta. Deadline e budget non sono chiari, ma scope e materiali vanno confermati.",
        },
        {
          title: "Risposta suggerita",
          badge: "Milo",
          body:
            "Chiedi dettagli attività, pagine, foto, deadline e budget prima del prezzo.",
        },
        {
          title: "Handoff",
          badge: "Dex",
          body:
            "Qualifica lo scope, raccogli materiali, poi prepara range prezzo e tempi realistici.",
        },
      ],
    },
    workflow: {
      title: "Il caos cliente diventa un workspace.",
      body: "Niente dati demo finti. Un messaggio reale diventa un lead su cui agire.",
      steps: [
        {
          step: "01",
          title: "Incolla il messaggio cliente",
          body:
            "Inserisci WhatsApp, email o DM così com'è. Nessuna pulizia, nessun modulo.",
        },
        {
          step: "02",
          title: "FlowCrew apre il workspace",
          body:
            "Jackie, Nora, Milo e Dex estraggono richiesta, scope, priorità, risposta e handoff.",
        },
        {
          step: "03",
          title: "Agisci sul lead",
          body:
            "Ottieni riepilogo, tag, prossima azione e una risposta da copiare o modificare.",
        },
      ],
    },
    example: {
      title: "Prima e dopo, senza fingere magia.",
      body:
        "FlowCrew mantiene il contesto originale e lo trasforma in output pratico.",
      before: "Prima di FlowCrew",
      beforeBody:
        "Ciao, mi serve un sito per la mia attività makeup, magari con prenotazioni, prezzi, galleria e link Instagram. Non so ancora il budget, ma voglio qualcosa di pulito e professionale.",
      after: "Dopo FlowCrew",
      outputCards: [
        {
          agent: "Summary",
          title: "Cosa vuole il cliente",
          body:
            "Sito per attività makeup con prenotazioni, prezzi, galleria e link Instagram.",
          detail: "Mancano budget, deadline, materiali, flusso prenotazioni e numero pagine.",
        },
        {
          agent: "Priority",
          title: "Quanto è urgente",
          body:
            "Lead caldo, ma non pronto per un preventivo finché non sono chiari i dettagli.",
          detail: "Azione consigliata: qualifica ora, stima dopo.",
        },
        {
          agent: "Reply",
          title: "Cosa inviare dopo",
          body:
            "Una risposta breve con domande su pagine, servizi, foto, deadline e budget.",
          detail: "La risposta è pronta, ma decidi tu cosa copiare, modificare o inviare.",
        },
        {
          agent: "Next action",
          title: "Cosa succede dopo",
          body:
            "Raccogli i dettagli mancanti, poi prepara un range di proposta realistico.",
          detail: "FlowCrew non invia messaggi automatici.",
        },
      ],
    },
    product: {
      title: "Cosa ottieni da un messaggio incollato.",
      body:
        "La homepage mostra la promessa. La trial mostra il flusso reale del prodotto.",
      items: [
        {
          title: "Riepilogo lead",
          body: "Una versione chiara della richiesta confusa.",
        },
        {
          title: "Priorità e tag",
          body: "Caldo, poco chiaro, urgente, budget limitato, materiali mancanti e altro.",
        },
        {
          title: "Risposta suggerita",
          body: "Una bozza da copiare, modificare o ignorare.",
        },
        {
          title: "Prossima azione",
          body: "Cosa chiedere, cosa raccogliere e cosa fare prima del preventivo.",
        },
        {
          title: "Workspace salvato",
          body: "Ogni lead analizzato può entrare nella tua inbox clienti.",
        },
        {
          title: "Manuale prima",
          body: "Oggi funziona con paste/import. Le integrazioni automatiche arrivano dopo.",
        },
      ],
    },
    trust: {
      title: "Prima approvi tu",
      body:
        "FlowCrew prepara riepiloghi, tag, prossimi step e risposte. Tu decidi cosa copiare, modificare o inviare.",
      privacyTitle: "Privato di default",
      privacyBody:
        "I messaggi cliente servono solo a generare il workspace del lead. FlowCrew non invia messaggi automatici.",
    },
    builtFor: {
      title: "Pensato per il lavoro cliente che nasce da un messaggio.",
      body:
        "Per freelance, piccole agenzie, consulenti e servizi che ricevono richieste reali in canali disordinati.",
      items: [
        {
          title: "Freelance",
          body: "Trasforma richieste informali in un brief prima del preventivo.",
        },
        {
          title: "Piccole agenzie",
          body: "Dai a ogni richiesta in ingresso una prima analisi coerente.",
        },
        {
          title: "Consulenti",
          body: "Trova più in fretta obiettivo, urgenza e contesto mancante.",
        },
        {
          title: "Web studio",
          body: "Separa lo scope reale dalle richieste sito vaghe.",
        },
        {
          title: "Servizi creativi",
          body: "Organizza idee, deliverable, materiali e domande di follow-up.",
        },
        {
          title: "Attività clienti",
          body: "Evita che vendite e supporto spariscano nelle chat.",
        },
      ],
    },
    finalCta: {
      title: "Prova il prodotto, non un'altra promessa.",
      body:
        "Incolla un messaggio cliente reale e guarda apparire il workspace lead.",
      button: "Analizza un lead gratis",
      pricing: "Vedi prezzi",
    },
    footer: {
      pricing: "Prezzi",
      contact: "Contatto",
    },
  },
} as const;

const heroOutputIcons = [Sparkles, Search, Clock3, GitBranch] as const;

const productIcons = [FileText, Zap, MessageSquareText, CheckCircle2, Inbox, GitBranch] as const;

const builtForIcons = [
  BriefcaseBusiness,
  Users,
  MessageSquareText,
  FileText,
  Sparkles,
  Inbox,
] as const;

export default function HomeLanding() {
  const { language } = useLanguage();
  const copy = homepageTranslations[language];

  return (
    <main
      className="flow-lime-glow min-h-screen overflow-hidden bg-[var(--fc-bg)] text-[var(--fc-text)]"
      id="main-content"
      tabIndex={-1}
    >
      <div className="pointer-events-none fixed inset-0 flow-grid-dark opacity-60" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#080808]/78 backdrop-blur-xl">
        <nav
          aria-label={copy.nav.ariaLabel}
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
        >
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--fc-accent)] text-sm font-extrabold text-[#080808]">
              F
            </span>
            <span className="text-lg font-bold tracking-[-0.03em]">FlowCrew</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {[
              [copy.nav.howItWorks, "#how-it-works"],
              [copy.nav.example, "#example"],
              [copy.nav.product, "#product"],
            ].map(([label, href]) => (
              <a
                className="text-sm font-medium text-[var(--fc-text-muted)] transition hover:text-[var(--fc-text)]"
                href={href}
                key={label}
              >
                {label}
              </a>
            ))}
            <Link
              className="text-sm font-medium text-[var(--fc-text-muted)] transition hover:text-[var(--fc-text)]"
              href="/pricing"
            >
              {copy.nav.pricing}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Link className="fc-button fc-button-primary max-sm:!hidden" href="/trial">
              {copy.nav.analyze}
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 pb-16 pt-28 text-center sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-[14%] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-[rgba(200,245,66,0.09)] blur-[125px]" />
        <div className="pointer-events-none absolute left-1/2 top-[38%] h-[22rem] w-[68rem] -translate-x-1/2 rounded-full bg-[rgba(139,255,197,0.045)] blur-[110px]" />

        <div className="relative z-10 flex max-w-5xl flex-col items-center">
          <h1 className="max-w-[24rem] text-[clamp(3.1rem,12vw,4.8rem)] font-extrabold leading-[0.92] tracking-[-0.06em] sm:max-w-6xl sm:text-[clamp(4.2rem,7.8vw,7.6rem)]">
            {copy.hero.title}
            <br />
            <em className="flow-serif font-normal text-[var(--fc-accent)]">
              {copy.hero.accent}
            </em>
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--fc-text-muted)]">
            {copy.hero.body}
          </p>

          <p className="flow-mono mt-4 max-w-2xl text-xs uppercase tracking-[0.16em] text-[var(--fc-text-soft)]">
            {copy.hero.microcopy}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="fc-button fc-button-primary px-6 py-4 text-base" href="/trial">
              {copy.hero.primaryCta}
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>

            <Link className="fc-button px-6 py-4 text-base" href="/pricing">
              {copy.hero.secondaryCta}
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {copy.hero.proofItems.map((item, index) => (
              <span
                className={index === 0 ? "fc-pill fc-pill-success" : "fc-pill"}
                key={item}
              >
                {index === 0 ? <Zap aria-hidden="true" className="h-3.5 w-3.5" /> : null}
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-10 w-full max-w-5xl rounded-[2rem] border border-white/[0.07] bg-[rgba(14,14,14,0.72)] p-4 text-left shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1.7fr] lg:items-stretch">
            <div className="rounded-[1.65rem] border border-white/[0.07] bg-black/35 p-4">
              <p className="flow-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fc-text-soft)]">
                {copy.hero.clientMessageLabel}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">
                {copy.hero.clientMessage}
              </p>
            </div>

            <div className="hidden items-center justify-center text-[var(--fc-accent)] lg:flex">
              <ArrowRight aria-hidden="true" className="h-6 w-6" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {copy.hero.outputCards.map((card, index) => {
                const Icon = heroOutputIcons[index];

                return (
                  <article
                    className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-4"
                    key={card.title}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="fc-pill fc-pill-success">{card.badge}</span>
                      <Icon aria-hidden="true" className="h-4 w-4 text-[var(--fc-accent)]" />
                    </div>
                    <h3 className="mt-4 text-lg font-extrabold tracking-[-0.04em]">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--fc-text-muted)]">
                      {card.body}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] px-4 py-16 sm:px-6 lg:px-8"
        id="how-it-works"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading body={copy.workflow.body} title={copy.workflow.title} />
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {copy.workflow.steps.map((item) => (
              <article className="border-l border-white/[0.08] pl-5" key={item.step}>
                <p className="flow-mono text-xs uppercase tracking-[0.14em] text-[var(--fc-accent)]">
                  {item.step}
                </p>
                <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.05em]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--fc-text-muted)]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <MarketingSection body={copy.example.body} id="example" title={copy.example.title}>
        <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <article className="fc-panel h-fit p-5 sm:p-6">
            <p className="fc-label">{copy.example.before}</p>
            <blockquote className="mt-5 rounded-3xl border border-white/[0.06] bg-[#0e0e0e] p-5 text-sm leading-7 text-[var(--fc-text-muted)]">
              “{copy.example.beforeBody}”
            </blockquote>
          </article>

          <div>
            <p className="fc-label mb-4">{copy.example.after}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {copy.example.outputCards.map((card) => (
                <article
                  className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5"
                  key={card.agent}
                >
                  <span className="fc-pill fc-pill-success">{card.agent}</span>
                  <h3 className="mt-4 text-xl font-extrabold tracking-[-0.04em]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">
                    {card.body}
                  </p>
                  <p className="mt-3 border-t border-white/[0.06] pt-3 text-xs leading-5 text-[var(--fc-text-soft)]">
                    {card.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </MarketingSection>

      <MarketingSection body={copy.product.body} id="product" title={copy.product.title}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {copy.product.items.map((item, index) => {
            const Icon = productIcons[index];

            return (
              <article className="fc-card p-6" key={item.title}>
                <Icon aria-hidden="true" className="h-5 w-5 text-[var(--fc-accent)]" />
                <h3 className="mt-5 text-xl font-extrabold tracking-[-0.04em]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">
                  {item.body}
                </p>
              </article>
            );
          })}
        </div>
      </MarketingSection>

      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-2">
          <TrustCard icon={<CheckCircle2 className="h-5 w-5" />} title={copy.trust.title}>
            {copy.trust.body}
          </TrustCard>
          <TrustCard icon={<ShieldCheck className="h-5 w-5" />} title={copy.trust.privacyTitle}>
            {copy.trust.privacyBody}
          </TrustCard>
        </div>
      </section>

      <MarketingSection body={copy.builtFor.body} id="built-for" title={copy.builtFor.title}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {copy.builtFor.items.map((item, index) => {
            const Icon = builtForIcons[index];

            return (
              <article className="fc-card p-6" key={item.title}>
                <Icon aria-hidden="true" className="h-5 w-5 text-[var(--fc-accent)]" />
                <h3 className="mt-5 text-xl font-extrabold tracking-[-0.04em]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">
                  {item.body}
                </p>
              </article>
            );
          })}
        </div>
      </MarketingSection>

      <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-[rgba(200,245,66,0.22)] bg-[rgba(200,245,66,0.06)] p-8 text-center shadow-[0_0_90px_rgba(200,245,66,0.08)] sm:p-12">
          <h2 className="text-5xl font-extrabold leading-[0.98] tracking-[-0.06em] sm:text-7xl">
            {copy.finalCta.title}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--fc-text-muted)]">
            {copy.finalCta.body}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="fc-button fc-button-primary px-7 py-4 text-base" href="/trial">
              {copy.finalCta.button}
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>
            <Link className="fc-button px-7 py-4 text-base" href="/pricing">
              {copy.finalCta.pricing}
            </Link>
          </div>
        </div>
      </section>

      <Footer contactLabel={copy.footer.contact} pricingLabel={copy.footer.pricing} />
    </main>
  );
}

function SectionHeading({ title, body }: { title: string; body: string }) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-5xl font-extrabold leading-[0.98] tracking-[-0.06em] sm:text-6xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-7 text-[var(--fc-text-muted)]">{body}</p>
    </div>
  );
}

function MarketingSection({
  id,
  title,
  body,
  children,
}: {
  id: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8" id={id}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading body={body} title={title} />
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function TrustCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-[2rem] border border-[rgba(139,255,197,0.16)] bg-[rgba(139,255,197,0.06)] p-6">
      <div className="flex items-center gap-3 text-[var(--fc-mint)]">
        {icon}
        <h3 className="text-xl font-extrabold tracking-[-0.04em] text-[var(--fc-text)]">
          {title}
        </h3>
      </div>
      <p className="mt-3 text-sm leading-7 text-[var(--fc-text-muted)]">{children}</p>
    </article>
  );
}

function Footer({
  contactLabel,
  pricingLabel,
}: {
  contactLabel: string;
  pricingLabel: string;
}) {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <Link className="flex items-center gap-3" href="/">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--fc-accent)] text-xs font-extrabold text-[#080808]">
            F
          </span>
          <span className="font-bold">FlowCrew</span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[var(--fc-text-muted)]">
          <Link className="transition hover:text-[var(--fc-text)]" href="/privacy">
            Privacy
          </Link>
          <Link className="transition hover:text-[var(--fc-text)]" href="/terms">
            Terms
          </Link>
          <Link className="transition hover:text-[var(--fc-text)]" href="/pricing">
            {pricingLabel}
          </Link>
          <a className="transition hover:text-[var(--fc-text)]" href="mailto:hello@flowcrew.ai">
            {contactLabel}
          </a>
          <span>2026 FlowCrew</span>
        </div>
      </div>
    </footer>
  );
}
