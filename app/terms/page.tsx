"use client";

import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";

const termsCopy = {
  it: {
    back: "Torna a FlowCrew",
    label: "Placeholder early access",
    title: "Termini",
    bodyOne:
      "FlowCrew è attualmente un prodotto in early access. I termini completi verranno pubblicati prima del rilascio pubblico.",
    bodyTwo:
      "Il free trial serve ad analizzare un lead incollato manualmente, così puoi valutare riepilogo, priorità, tag, prossima azione e bozza di risposta.",
  },
  en: {
    back: "Back to FlowCrew",
    label: "Early access placeholder",
    title: "Terms",
    bodyOne:
      "FlowCrew is currently an early access product. The full terms will be published before the public release.",
    bodyTwo:
      "The free trial analyzes one manually pasted lead so you can review the summary, priority, tags, next action, and reply draft.",
  },
} as const;

export default function TermsPage() {
  const { language } = useLanguage();
  const copy = termsCopy[language];

  return (
    <main className="flow-lime-glow min-h-screen bg-[var(--fc-bg)] px-5 py-8 text-[var(--fc-text)] sm:px-8" id="main-content" tabIndex={-1}>
      <div className="pointer-events-none fixed inset-0 flow-grid-dark opacity-50" />
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <Link className="fc-button" href="/">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {copy.back}
          </Link>
          <LanguageSelector />
        </div>

        <section className="fc-panel mt-10 p-7 sm:p-10">
          <p className="fc-label">{copy.label}</p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-[-0.06em] text-[var(--fc-text)]">{copy.title}</h1>
          <p className="mt-5 text-base leading-7 text-[var(--fc-text-muted)]">
            {copy.bodyOne}
          </p>
          <p className="mt-4 text-base leading-7 text-[var(--fc-text-muted)]">
            {copy.bodyTwo}
          </p>
          <a className="fc-button fc-button-primary mt-7" href="mailto:hello@flowcrew.ai">
            <Mail aria-hidden="true" className="h-4 w-4" />
            hello@flowcrew.ai
          </a>
        </section>
      </div>
    </main>
  );
}
