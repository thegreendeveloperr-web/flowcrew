import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="flow-lime-glow min-h-screen bg-[var(--fc-bg)] px-5 py-8 text-[var(--fc-text)] sm:px-8" id="main-content" tabIndex={-1}>
      <div className="pointer-events-none fixed inset-0 flow-grid-dark opacity-50" />
      <div className="relative z-10 mx-auto max-w-3xl">
        <Link className="fc-button" href="/">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to FlowCrew
        </Link>

        <section className="fc-panel mt-10 p-7 sm:p-10">
          <p className="fc-label">Early access placeholder</p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-[-0.06em] text-[var(--fc-text)]">Termini</h1>
          <p className="mt-5 text-base leading-7 text-[var(--fc-text-muted)]">
            FlowCrew è attualmente un prodotto in early access. I termini completi verranno pubblicati prima del rilascio pubblico.
          </p>
          <p className="mt-4 text-base leading-7 text-[var(--fc-text-muted)]">
            Il free trial serve ad analizzare un lead incollato manualmente, così puoi valutare summary, priorità, tag, next action e reply draft.
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
