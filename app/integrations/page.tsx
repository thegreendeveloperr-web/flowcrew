import AppShell from "@/components/AppShell";

const integrations = [
  {
    name: "Manual input",
    status: "Attivo",
    description: "Incolla manualmente un messaggio cliente e FlowCrew lo trasforma in un lead strutturato.",
    badge: "MI",
    color: "var(--fc-accent)",
  },
  {
    name: "Gmail",
    status: "Prossimo",
    description: "Connettore email previsto. Non viene promesso come gia attivo.",
    badge: "GM",
    color: "var(--fc-mint)",
  },
  {
    name: "WhatsApp Business",
    status: "Coming soon",
    description: "Possibile via API ufficiali e webhook, quando il prodotto sara pronto.",
    badge: "WA",
    color: "var(--fc-orange)",
  },
  {
    name: "Instagram DM",
    status: "Coming soon",
    description: "Organizzazione DM business in una inbox clienti piu chiara.",
    badge: "IG",
    color: "var(--fc-purple)",
  },
];

const pipeline = [
  "Messaggio copiato o ricevuto",
  "Analisi AI del contesto",
  "Lead strutturato salvato",
  "Inbox e dashboard aggiornate",
  "Risposta pronta da approvare",
];

export default function IntegrationsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-[1380px] space-y-4">
        <section className="fc-toolbar p-5">
          <p className="fc-label">Integrations hub</p>
          <div className="mt-2 grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-extrabold leading-none tracking-[-0.055em] text-[var(--fc-text)] md:text-6xl">
                Ogni messaggio cliente dentro un command center.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--fc-text-muted)]">
                Oggi funziona l&apos;input manuale. Le integrazioni automatiche arrivano solo quando saranno reali.
              </p>
            </div>

            <div className="rounded-2xl border border-[rgba(200,245,66,0.16)] bg-[rgba(200,245,66,0.06)] p-5">
              <p className="flow-mono text-xs uppercase tracking-[0.12em] text-[var(--fc-accent)]">
                Live pipeline
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">
                Trial input - Gemini analysis - Supabase lead storage - Inbox e dashboard.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {integrations.map((integration) => (
            <article key={integration.name} className="fc-card p-5">
              <div className="mb-5 flex items-start justify-between gap-4">
                <span className="flow-mono flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035] text-sm" style={{ color: integration.color }}>
                  {integration.badge}
                </span>
                <span className="fc-pill">{integration.status}</span>
              </div>

              <h2 className="text-xl font-bold tracking-[-0.04em] text-[var(--fc-text)]">{integration.name}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">{integration.description}</p>
            </article>
          ))}
        </div>

        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="fc-panel p-6">
            <p className="fc-label">Next connector</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.055em] text-[var(--fc-text)]">
              Gmail prima di tutto.
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--fc-text-muted)]">
              E il canale piu serio da collegare per primo: email clienti, richieste, follow-up, preventivi.
            </p>
            <button className="fc-button mt-6">Connect Gmail soon</button>
          </div>

          <div className="fc-panel p-6">
            <h2 className="text-3xl font-extrabold tracking-[-0.055em] text-[var(--fc-text)]">
              Automatic message pipeline
            </h2>
            <div className="mt-6 grid gap-3">
              {pipeline.map((item, index) => (
                <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <span className="flow-mono flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-sm text-[var(--fc-accent)]">
                    {index + 1}
                  </span>
                  <p className="text-sm font-bold text-[var(--fc-text-muted)]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
