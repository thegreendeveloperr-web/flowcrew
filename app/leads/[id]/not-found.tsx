import Link from "next/link";
import AppShell from "@/components/AppShell";

export default function LeadNotFound() {
  return (
    <AppShell>
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
        <section className="fc-panel w-full p-8 text-center">
          <p className="fc-label">Lead non disponibile</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[var(--fc-text)]">
            Questo lead non esiste nel tuo workspace.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">
            Potrebbe essere stato eliminato oppure appartenere a un altro account.
          </p>
          <Link className="fc-button fc-button-primary mt-6" href="/leads">
            Torna ai lead
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
