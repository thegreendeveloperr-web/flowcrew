import AppShell from "@/components/AppShell";

const integrations = [
  {
    name: "Manual input",
    status: "Active",
    description: "Paste a client message manually and FlowCrew turns it into a structured lead.",
    badge: "MI",
    accent: "from-blue-500 to-indigo-500",
  },
  {
    name: "Gmail",
    status: "Next to build",
    description: "Connect Gmail, read new client emails and send them to FlowCrew automatically.",
    badge: "GM",
    accent: "from-sky-500 to-blue-600",
  },
  {
    name: "WhatsApp Business",
    status: "Coming soon",
    description: "Receive WhatsApp Business messages through webhooks and convert them into leads.",
    badge: "WA",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    name: "Instagram DM",
    status: "Coming soon",
    description: "Collect Instagram business messages and organize them inside your lead inbox.",
    badge: "IG",
    accent: "from-pink-500 to-violet-500",
  },
];

const pipeline = [
  "Message arrives from a connected channel",
  "FlowCrew sends it to /api/ingest-message",
  "Gemini analyzes the request, urgency and context",
  "Supabase saves the structured lead",
  "Dashboard, leads and follow-ups update automatically",
];

export default function IntegrationsPage() {
  return (
    <AppShell>
      <main className="min-h-screen bg-[#f6f8fc] px-6 py-8 text-slate-950">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="mb-3 w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              Integrations hub
            </p>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <h1 className="max-w-3xl text-5xl font-black leading-none tracking-[-0.07em] text-slate-950 md:text-6xl">
                  Bring every client message into one AI workspace.
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                  Manual input already works. Gmail is the next real connector. WhatsApp Business and Instagram DM will follow through official APIs and webhooks.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-black text-slate-900">Current live pipeline</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Trial input ? Gemini analysis ? Supabase lead storage ? Leads and dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {integrations.map((integration) => (
              <article
                key={integration.name}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${integration.accent} text-sm font-black text-white shadow-lg`}>
                    {integration.badge}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-600">
                    {integration.status}
                  </span>
                </div>

                <h2 className="text-xl font-black tracking-[-0.04em] text-slate-950">
                  {integration.name}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {integration.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
              <p className="mb-3 w-fit rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                Next connector
              </p>

              <h2 className="text-3xl font-black tracking-[-0.06em] text-slate-950">
                Gmail comes first.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Gmail is the fastest serious integration to build. Once connected, FlowCrew can read relevant emails, analyze them, and save them as structured leads.
              </p>

              <button className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg">
                Connect Gmail soon
              </button>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-3xl font-black tracking-[-0.06em] text-slate-950">
                Automatic message pipeline
              </h2>

              <div className="mt-6 grid gap-3">
                {pipeline.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-black text-blue-700 shadow-sm">
                      {index + 1}
                    </span>
                    <p className="text-sm font-bold text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
