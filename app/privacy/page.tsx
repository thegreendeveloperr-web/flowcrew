"use client";

import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/components/LanguageProvider";

const privacyCopy = {
  it: {
    back: "Torna a FlowCrew",
    label: "Placeholder early access",
    title: "Privacy Policy",
    bodyOne:
      "FlowCrew è ancora in early access. Una privacy policy completa verrà pubblicata prima del rilascio pubblico.",
    bodyTwo:
      "Per il free trial incolli manualmente un messaggio cliente. Non è richiesto accesso diretto a WhatsApp, Gmail o account privati.",
  },
  en: {
    back: "Back to FlowCrew",
    label: "Early access placeholder",
    title: "Privacy Policy",
    bodyOne:
      "FlowCrew is still in early access. A complete privacy policy will be published before the public release.",
    bodyTwo:
      "For the free trial, you manually paste a client message. Direct access to WhatsApp, Gmail, or private accounts is not required.",
  },
} as const;

export default function PrivacyPage() {
  const { language } = useLanguage();
  const copy = privacyCopy[language];

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
