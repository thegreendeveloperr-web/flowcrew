"use client";

import { useState, type FormEvent } from "react";
import AppShell from "@/components/AppShell";
import type { StoredLead } from "@/lib/leads";

const sampleConversation = `[WhatsApp] Marco: Ciao, vorrei un preventivo per un sito...
[Gmail] marco@email.it: Ti mando anche il logo...
[Instagram] @marco_studio: Mi servirebbe una pagina prenotazioni.`;

const importModes = [
  {
    value: "single",
    label: "Single lead",
    description: "One client conversation",
  },
  {
    value: "mixed",
    label: "Mixed channels",
    description: "One client across channels",
  },
  {
    value: "multiple",
    label: "Multiple leads",
    description: "Batch pasted messages",
  },
] as const;

type ImportMode = (typeof importModes)[number]["value"];

type IngestResponse = {
  lead: StoredLead;
};

export default function ImportPage() {
  const [text, setText] = useState(sampleConversation);
  const [mode, setMode] = useState<ImportMode>("mixed");
  const [result, setResult] = useState<IngestResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function importConversation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/ingest-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "import",
          sender: "Imported conversation",
          text,
        }),
      });

      const payload = (await response.json()) as IngestResponse | { error?: string };

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Accedi per salvare un lead nel tuo workspace.");
        }
        throw new Error(
          "error" in payload && payload.error
            ? payload.error
            : "Import non riuscito. Riprova.",
        );
      }

      setResult(payload as IngestResponse);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Errore sconosciuto durante l'import.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <section className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white/82 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-8">
          <div className="grid gap-7 xl:grid-cols-[1.12fr_0.88fr] xl:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" />
                Manual multi-channel import
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.075em] text-slate-950 md:text-7xl">
                Import messy conversations
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Paste WhatsApp, Gmail, Instagram or mixed client messages and let FlowCrew organize them.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Simple by design
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                FlowCrew reads the full pasted conversation as one lead, keeps the original message, and saves the organized result to Supabase.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
          <form
            onSubmit={importConversation}
            className="rounded-[2rem] border border-slate-200 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6"
          >
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Paste inbox
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-slate-950">
                  Conversation importer
                </h2>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-500">
                Raw message preserved
              </span>
            </div>

            <fieldset className="mt-5">
              <legend className="text-sm font-black text-slate-700">Import mode</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {importModes.map((option) => {
                  const isActive = mode === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMode(option.value)}
                      aria-pressed={isActive}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        isActive
                          ? "border-blue-200 bg-blue-50 text-blue-800 shadow-[0_10px_28px_rgba(37,99,235,0.10)]"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-100 hover:bg-slate-50"
                      }`}
                    >
                      <span className="block text-sm font-black">{option.label}</span>
                      <span className="mt-1 block text-xs font-semibold opacity-70">
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label className="mt-5 block text-sm font-black text-slate-700">
              Copied client messages
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                rows={14}
                className="mt-2 w-full resize-y rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                placeholder={sampleConversation}
              />
            </label>

            <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
              Current release: every mode is organized as one structured multi-channel lead. Automatic multi-lead splitting can be added later.
            </p>

            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="mt-5 flex w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 px-5 py-4 text-sm font-black text-white shadow-[0_18px_40px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isLoading ? "Importing and organizing..." : "Import and organize"}
            </button>

            {error ? (
              <div
                role="alert"
                className="mt-4 rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold leading-6 text-rose-800"
              >
                {error}
              </div>
            ) : null}
          </form>

          <aside className="rounded-[2rem] border border-slate-200 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Organized lead
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-slate-950">
              {result ? "Saved to Supabase" : "Ready for your conversation"}
            </h2>

            {result ? <SavedLeadCard lead={result.lead} /> : <EmptyResult />}
          </aside>
        </section>
      </div>
    </AppShell>
  );
}

function SavedLeadCard({ lead }: { lead: StoredLead }) {
  const tags = lead.tags ?? [];

  return (
    <article className="mt-5 rounded-[1.65rem] border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
            Imported conversation
          </p>
          <h3 className="mt-1 text-xl font-black tracking-[-0.04em] text-slate-950">
            Structured lead saved
          </h3>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
          {lead.urgency ?? "New"}
        </span>
      </div>

      <ResultSection label="Summary">
        <p>{lead.summary ?? lead.raw_message}</p>
      </ResultSection>

      <ResultSection label="Tags">
        {tags.length ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-100"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p>No tags detected.</p>
        )}
      </ResultSection>

      <ResultSection label="Suggested reply">
        <div className="rounded-2xl bg-slate-950 p-4 text-slate-100">
          {lead.suggested_reply ?? "No suggested reply available."}
        </div>
      </ResultSection>

      <ResultSection label="Next action">
        <p>{lead.next_action ?? "Review the imported lead."}</p>
      </ResultSection>
    </article>
  );
}

function ResultSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-4 border-t border-slate-200 pt-4">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <div className="text-sm font-semibold leading-6 text-slate-700">{children}</div>
    </section>
  );
}

function EmptyResult() {
  return (
    <div className="mt-5 grid gap-3">
      {[
        "Clean summary across copied channels",
        "Urgency and focused lead tags",
        "Suggested reply ready for approval",
        "One practical next action",
      ].map((item, index) => (
        <div
          key={item}
          className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-xs font-black text-blue-700 shadow-sm">
            {index + 1}
          </span>
          <p className="text-sm font-bold text-slate-600">{item}</p>
        </div>
      ))}
    </div>
  );
}
