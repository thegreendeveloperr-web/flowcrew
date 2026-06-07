"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  MessageSquareText,
  Sparkles,
  Zap,
} from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";

const homepageTranslations = {
  it: {
    nav: {
      howItWorks: "Come funziona",
      example: "Esempio",
      product: "Prodotto",
      pricing: "Prezzi",
      analyze: "Analizza gratis",
    },
    hero: {
      title: "Non perdere più clienti",
      accent: "nel caos.",
      body:
        "FlowCrew trasforma WhatsApp, email e DM confusi in lead strutturati: riepilogo, priorità, risposta e prossima azione.",
      note: "Incolli una richiesta reale, FlowCrew apre il workspace.",
      primaryCta: "Analizza 1 lead gratis",
      secondaryCta: "Vedi i prezzi",
      proofItems: [
        "1 lead gratis",
        "Nessuna carta richiesta",
        "WhatsApp, email o DM",
      ],
      clientMessageLabel: "Messaggio cliente",
      clientMessage:
        "Ciao, ho visto il tuo profilo su Instagram e volevo chiederti un preventivo. Mi servirebbe un sito semplice ma professionale, con servizi, galleria immagini e modulo contatti.",
      outputCards: [
        {
          title: "Riepilogo lead",
          badge: "Jackie",
          body:
            "Richiesta di preventivo per un sito. Servono pagina servizi, galleria e modulo contatti. I contenuti non sono ancora pronti.",
        },
        {
          title: "Priorità",
          badge: "Nora",
          body:
            "Medio-alta. La scadenza è a fine mese, ma scope e materiali devono ancora essere confermati.",
        },
        {
          title: "Risposta suggerita",
          badge: "Milo",
          body:
            "Chiedi dettagli sull'attività, pagine, foto e obiettivo della scadenza, poi proponi un mini-brief prima del preventivo.",
        },
        {
          title: "Passaggio operativo",
          badge: "Dex",
          body:
            "Qualifica lo scope, raccogli i materiali, poi invia una stima realistica di costi e tempi.",
        },
      ],
    },
    workflow: [
      {
        step: "01",
        title: "Incolla il messaggio cliente",
        body:
          "Inserisci il vero messaggio WhatsApp, email o DM. Senza ripulirlo, compilare moduli o usare dati finti.",
      },
      {
        step: "02",
        title: "FlowCrew apre il workspace",
        body:
          "Jackie, Nora, Milo e Dex estraggono richiesta, scope, priorità, risposta e passaggio operativo.",
      },
      {
        step: "03",
        title: "Agisci sul lead",
        body:
          "Ottieni un riepilogo compatto, tag, prossima azione e una bozza di risposta da copiare o modificare.",
      },
    ],
    example: {
      titleLineOne: "Il workspace si apre",
      titleLineTwo: "dopo il primo messaggio.",
      body:
        "La landing presenta la promessa. La prova gratuita mostra il prodotto.",
      before: "Prima",
      beforeBody:
        "DM Instagram, testi mancanti, budget vago, scadenza a fine mese e scope poco chiaro, tutto mescolato.",
      productSignals: [
        "Riepilogo",
        "Tag",
        "Priorità",
        "Risposta",
        "Prossima azione",
      ],
    },
    product: {
      titleLineOne: "Landing semplice.",
      titleLineTwo: "Flusso prodotto reale.",
      body:
        "Prezzi, checkout e dettagli dei piani vivono in una pagina dedicata. La homepage resta concentrata sul valore e sull'analisi gratuita.",
      cards: [
        {
          title: "Homepage",
          body:
            "Spiega il problema, mostra il risultato e accompagna le persone alla prova gratuita.",
        },
        {
          title: "Prova gratuita",
          body:
            "Permette di incollare una richiesta reale e vedere FlowCrew costruire il workspace del lead.",
        },
        {
          title: "Prezzi",
          body:
            "Mostra piani, limiti e opzioni di upgrade solo quando l'utente è pronto a confrontarli.",
        },
      ],
    },
    finalCta: {
      titleLineOne: "Prova il prodotto,",
      titleLineTwo: "non un'altra presentazione.",
      body:
        "Incolla un vero messaggio cliente e guarda apparire il workspace del lead.",
      button: "Analizza 1 lead gratis",
    },
    footer: {
      pricing: "Prezzi",
      contact: "Contatti",
    },
  },
  en: {
    nav: {
      howItWorks: "How it works",
      example: "Example",
      product: "Product",
      pricing: "Pricing",
      analyze: "Analyze free",
    },
    hero: {
      title: "Stop losing clients",
      accent: "in the chaos.",
      body:
        "FlowCrew turns messy WhatsApp, email, and DM conversations into structured leads: summary, priority, reply, and next action.",
      note: "Paste a real request and FlowCrew opens the workspace.",
      primaryCta: "Analyze 1 lead free",
      secondaryCta: "See pricing",
      proofItems: [
        "1 lead free",
        "No card required",
        "WhatsApp, email or DM",
      ],
      clientMessageLabel: "Client message",
      clientMessage:
        "Hi, I saw your profile on Instagram and wanted to ask for a quote. I need a simple but professional website with services, an image gallery, and a contact form.",
      outputCards: [
        {
          title: "Lead summary",
          badge: "Jackie",
          body:
            "Website quote request. Needs services page, gallery and contact form. Content is not ready yet.",
        },
        {
          title: "Priority",
          badge: "Nora",
          body:
            "Medium-high. The deadline is end of month, but scope and assets still need confirmation.",
        },
        {
          title: "Suggested reply",
          badge: "Milo",
          body:
            "Ask for business details, pages, photos, and deadline goal, then offer a short mini-brief before pricing.",
        },
        {
          title: "Handoff",
          badge: "Dex",
          body:
            "Qualify scope, collect materials, then send a realistic range for cost and timing.",
        },
      ],
    },
    workflow: [
      {
        step: "01",
        title: "Paste the client message",
        body:
          "Drop in the real WhatsApp, email or DM. No cleanup, no form-filling, no fake demo data.",
      },
      {
        step: "02",
        title: "FlowCrew opens the workspace",
        body:
          "Jackie, Nora, Milo and Dex extract the request, scope, priority, reply and handoff.",
      },
      {
        step: "03",
        title: "Act on the lead",
        body:
          "You get a compact summary, tags, next action and a reply draft you can copy or adjust.",
      },
    ],
    example: {
      titleLineOne: "The workspace opens",
      titleLineTwo: "after the first paste.",
      body: "The landing shows the promise. The trial page shows the product.",
      before: "Before",
      beforeBody:
        "Instagram DM, missing copy, vague budget, end-of-month pressure and unclear scope all mixed together.",
      productSignals: [
        "Summary",
        "Tags",
        "Priority",
        "Reply",
        "Next action",
      ],
    },
    product: {
      titleLineOne: "Simple landing.",
      titleLineTwo: "Real product flow.",
      body:
        "Pricing, checkout and plan details live on their own route. The homepage stays focused on the value and the free analysis.",
      cards: [
        {
          title: "Homepage",
          body:
            "Explain the problem, show the output and send people to the free trial.",
        },
        {
          title: "Trial",
          body:
            "Let the user paste a real request and watch FlowCrew build the lead workspace.",
        },
        {
          title: "Pricing",
          body:
            "Show plans, limits and upgrade paths only when the user is ready to compare.",
        },
      ],
    },
    finalCta: {
      titleLineOne: "Try the product,",
      titleLineTwo: "not another pitch.",
      body: "Paste one real client message and see the lead workspace appear.",
      button: "Analyze 1 lead free",
    },
    footer: {
      pricing: "Pricing",
      contact: "Contact",
    },
  },
} as const;

const outputIcons = [
  <Sparkles aria-hidden="true" className="h-4 w-4" key="summary" />,
  <Zap aria-hidden="true" className="h-4 w-4" key="priority" />,
  <MessageSquareText aria-hidden="true" className="h-4 w-4" key="reply" />,
  <ClipboardList aria-hidden="true" className="h-4 w-4" key="handoff" />,
];

export default function Home() {
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
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--fc-accent)] text-sm font-extrabold text-[#080808]">
              F
            </span>
            <span className="text-lg font-bold tracking-[-0.03em]">FlowCrew</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
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
          <h1 className="max-w-[23rem] text-[clamp(3rem,13vw,4.8rem)] font-extrabold leading-[0.92] tracking-[-0.06em] sm:max-w-5xl sm:text-[clamp(4.3rem,8.4vw,8rem)]">
            {copy.hero.title}
            <br />
            <em className="flow-serif font-normal text-[var(--fc-accent)]">
              {copy.hero.accent}
            </em>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--fc-text-muted)]">
            {copy.hero.body}
          </p>

          <p className="flow-mono mt-4 max-w-2xl text-xs uppercase tracking-[0.14em] text-[var(--fc-text-soft)]">
            {copy.hero.note}
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
            {copy.hero.proofItems.map((item) => (
              <span className="fc-pill" key={item}>
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
              {copy.hero.outputCards.map((card, index) => (
                <article
                  className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-4"
                  key={card.title}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="fc-pill fc-pill-success">{card.badge}</span>
                    <span className="text-[var(--fc-accent)]">
                      {outputIcons[index]}
                    </span>
                  </div>
                  <h2 className="mt-4 text-lg font-extrabold tracking-[-0.04em]">
                    {card.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--fc-text-muted)]">
                    {card.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] px-4 py-5 sm:px-6 lg:px-8"
        id="how-it-works"
      >
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
          {copy.workflow.map((item) => (
            <article className="p-2" key={item.step}>
              <p className="flow-mono text-xs uppercase tracking-[0.14em] text-[var(--fc-accent)]">
                {item.step}
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.05em]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--fc-text-muted)]">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <Section
        id="example"
        title={
          <>
            {copy.example.titleLineOne}
            <br />
            {copy.example.titleLineTwo}
          </>
        }
        body={copy.example.body}
      >
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="fc-panel p-5 sm:p-6">
            <p className="fc-label">{copy.example.before}</p>
            <div className="mt-5 rounded-3xl border border-white/[0.06] bg-[#0e0e0e] p-5 text-sm leading-7 text-[var(--fc-text-muted)]">
              {copy.example.beforeBody}
            </div>
          </div>

          <div className="grid gap-3">
            {copy.example.productSignals.map((signal) => (
              <div
                className="flex items-center justify-between gap-4 rounded-3xl border border-white/[0.06] bg-white/[0.025] p-4"
                key={signal}
              >
                <span className="font-extrabold tracking-[-0.035em]">{signal}</span>
                <CheckCircle2
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-[var(--fc-accent)]"
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="product"
        title={
          <>
            {copy.product.titleLineOne}
            <br />
            {copy.product.titleLineTwo}
          </>
        }
        body={copy.product.body}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {copy.product.cards.map((card) => (
            <FocusCard title={card.title} body={card.body} key={card.title} />
          ))}
        </div>
      </Section>

      <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-[rgba(200,245,66,0.22)] bg-[rgba(200,245,66,0.06)] p-8 text-center shadow-[0_0_90px_rgba(200,245,66,0.08)] sm:p-12">
          <h2 className="text-5xl font-extrabold leading-[0.98] tracking-[-0.06em] sm:text-7xl">
            {copy.finalCta.titleLineOne}
            <br />
            {copy.finalCta.titleLineTwo}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--fc-text-muted)]">
            {copy.finalCta.body}
          </p>

          <Link className="fc-button fc-button-primary mt-8 px-7 py-4 text-base" href="/trial">
            {copy.finalCta.button}
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer
        contactLabel={copy.footer.contact}
        pricingLabel={copy.footer.pricing}
      />
    </main>
  );
}

function Section({
  id,
  title,
  body,
  children,
}: {
  id?: string;
  title: ReactNode;
  body: string;
  children: ReactNode;
}) {
  return (
    <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8" id={id}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-5xl font-extrabold leading-[0.98] tracking-[-0.06em] sm:text-6xl">
            {title}
          </h2>
          <p className="mt-5 text-base leading-7 text-[var(--fc-text-muted)]">
            {body}
          </p>
        </div>

        {children}
      </div>
    </section>
  );
}

function FocusCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="fc-card p-6">
      <h3 className="text-2xl font-extrabold tracking-[-0.045em]">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-[var(--fc-text-muted)]">{body}</p>
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
