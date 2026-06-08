"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, Sparkles } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";

const manualProHref =
  "mailto:hello@flowcrew.ai?subject=FlowCrew%20Team%20access";

const pricingCopy = {
  it: {
    home: "Home",
    label: "Prezzi",
    titleLineOne: "Inizia con un lead reale.",
    titleLineTwo: "Fai upgrade quando il workflow ti serve.",
    body:
      "Prova come FlowCrew organizza una vera richiesta cliente, poi scegli il piano adatto al volume e al modo in cui lavora il tuo team.",
    popular: "Consigliato",
    customPrice: "Su misura",
    checkoutNote:
      "FlowCrew è un MVP iniziale per freelance e piccoli team. La prova gratuita include una vera analisi lead e non richiede carta.",
    plans: [
      {
        name: "Prova gratuita",
        price: "0",
        period: "un lead",
        description: "Per capire il workflow prima di fare upgrade.",
        features: [
          "Prova FlowCrew con 1 vero messaggio cliente",
          "Guarda come la Crew AI struttura il lead",
          "Capisci il workflow prima di fare upgrade",
        ],
        cta: "Analizza 1 lead gratis",
        href: "/trial",
      },
      {
        name: "Pro",
        price: "19",
        period: "al mese",
        description: "Per organizzare richieste clienti in modo continuativo.",
        features: [
          "Organizza richieste clienti continuative",
          "Salva più lead",
          "Ottieni supporto più chiaro per follow-up e proposte",
          "Continua a usare la Crew AI oltre il lead gratuito",
        ],
        cta: "Passa a Pro",
        href: "/api/stripe/checkout",
        featured: true,
      },
      {
        name: "Team",
        price: "Custom",
        period: "beta",
        description: "Per team che condividono intake e passaggi cliente.",
        features: [
          "Gestisci un intake cliente condiviso",
          "Crea passaggi chiari tra più persone",
          "Tieni ordinate le richieste cliente in tutto il team",
        ],
        cta: "Richiedi accesso",
        href: manualProHref,
      },
    ],
  },
  en: {
    home: "Home",
    label: "Pricing",
    titleLineOne: "Start with one real lead.",
    titleLineTwo: "Upgrade when the workflow earns its place.",
    body:
      "See how FlowCrew organizes a real client request, then choose the plan that fits your volume and the way your team works.",
    popular: "Popular",
    customPrice: "Custom",
    checkoutNote:
      "FlowCrew is an early MVP for freelancers and small teams. The free trial includes one real lead analysis and requires no card.",
    plans: [
      {
        name: "Free trial",
        price: "0",
        period: "one lead",
        description: "Understand the workflow before upgrading.",
        features: [
          "Test FlowCrew with 1 real client message",
          "See how the AI crew structures the lead",
          "Understand the workflow before upgrading",
        ],
        cta: "Analyze 1 lead free",
        href: "/trial",
      },
      {
        name: "Pro",
        price: "19",
        period: "per month",
        description: "For organizing ongoing client requests.",
        features: [
          "Organize ongoing client requests",
          "Save more leads",
          "Get clearer follow-up and proposal support",
          "Keep using the AI crew beyond the free lead",
        ],
        cta: "Upgrade to Pro",
        href: "/api/stripe/checkout",
        featured: true,
      },
      {
        name: "Team",
        price: "Custom",
        period: "beta",
        description: "For teams sharing client intake and handoffs.",
        features: [
          "Manage shared client intake",
          "Create clean handoffs between multiple people",
          "Keep client requests organized across the team",
        ],
        cta: "Request access",
        href: manualProHref,
      },
    ],
  },
} as const;

export default function PricingPage() {
  const { language } = useLanguage();
  const copy = pricingCopy[language];

  return (
    <main
      className="flow-lime-glow min-h-screen overflow-hidden bg-[var(--fc-bg)] text-[var(--fc-text)]"
      id="main-content"
      tabIndex={-1}
    >
      <div className="pointer-events-none fixed inset-0 flow-grid-dark opacity-60" />

      <header className="relative z-10 border-b border-white/[0.06] bg-[#080808]/78 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--fc-accent)] text-sm font-extrabold text-[#080808]">
              F
            </span>
            <span className="text-lg font-bold tracking-[-0.03em]">FlowCrew</span>
          </Link>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Link className="fc-button" href="/">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              {copy.home}
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[rgba(200,245,66,0.08)] blur-[120px]" />

        <div className="relative max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
            <CreditCard aria-hidden="true" className="h-4 w-4 text-[var(--fc-accent)]" />
            <span className="flow-mono text-xs uppercase tracking-[0.14em] text-[var(--fc-text-soft)]">
              {copy.label}
            </span>
          </div>

          <h1 className="text-5xl font-extrabold leading-[0.95] tracking-[-0.06em] sm:text-7xl">
            {copy.titleLineOne}
            <br />
            {copy.titleLineTwo}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--fc-text-muted)]">
            {copy.body}
          </p>
        </div>

        <div className="relative mt-12 grid gap-4 lg:grid-cols-3">
          {copy.plans.map((plan) => {
            const isFeatured = "featured" in plan && plan.featured;

            return (
            <article
              className={`rounded-[2rem] border bg-[rgba(14,14,14,0.74)] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl ${
                isFeatured
                  ? "border-[rgba(200,245,66,0.32)] shadow-[0_0_80px_rgba(200,245,66,0.08)]"
                  : "border-white/[0.07]"
              }`}
              key={plan.name}
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-extrabold tracking-[-0.045em]">{plan.name}</h2>
                {isFeatured ? (
                  <span className="fc-pill fc-pill-success">
                    <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                    {copy.popular}
                  </span>
                ) : null}
              </div>

              <div className="mt-7 flex items-end gap-2">
                <p className="text-5xl font-extrabold tracking-[-0.06em]">
                  {plan.price === "Custom" ? copy.customPrice : `EUR ${plan.price}`}
                </p>
                <p className="pb-2 text-sm font-medium text-[var(--fc-text-soft)]">
                  {plan.period}
                </p>
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--fc-text-muted)]">
                {plan.description}
              </p>

              <ul className="mt-7 space-y-3">
                {plan.features.map((feature) => (
                  <li className="flex gap-2 text-sm text-[var(--fc-text-muted)]" key={feature}>
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--fc-accent)]"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.href.startsWith("mailto:") ? (
                <a
                  className={`fc-button mt-8 w-full ${isFeatured ? "fc-button-primary" : ""}`}
                  href={plan.href}
                >
                  {plan.cta}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  className={`fc-button mt-8 w-full ${isFeatured ? "fc-button-primary" : ""}`}
                  href={plan.href}
                >
                  {plan.cta}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              )}
            </article>
            );
          })}
        </div>

        <div className="relative mt-8 rounded-[2rem] border border-white/[0.07] bg-white/[0.025] p-5 text-sm leading-7 text-[var(--fc-text-muted)]">
          <p>{copy.checkoutNote}</p>
        </div>
      </section>
    </main>
  );
}
