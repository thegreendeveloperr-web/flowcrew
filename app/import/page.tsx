"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import AppShell from "@/components/AppShell";
import type { StoredLead } from "@/lib/leads";

const sampleConversation = `[WhatsApp] Marco: Hi, I need a quote for a website for my shop...
[Gmail] marco@email.it: I can also send the logo and some product photos.
[Instagram] @marco_studio: I would need a booking page too.`;

const importModes = [
  { value: "single", label: "Single lead", description: "One client conversation" },
  { value: "mixed", label: "Mixed channels", description: "One client across channels" },
  { value: "multiple", label: "Batch", description: "Several copied messages" },
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
          clientName: "Imported conversation",
          sourceType: "email",
          messyMessage: text,
          businessType: "Freelance / small team",
          goal: `Manual import (${mode}): summarize the request, detect priority, draft a reply, and suggest the next action.`,
          language: "en",
        }),
      });

      const payload = (await response.json().catch(() => null)) as IngestResponse | { error?: string } | null;

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sign in to save this lead in your workspace.");
        }

        throw new Error(payload && "error" in payload && payload.error ? payload.error : "Import failed. Try again.");
      }

      if (!payload || !("lead" in payload)) {
        throw new Error("FlowCrew did not return a saved lead. Try again.");
      }

      setResult(payload);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unknown import error.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[1380px] space-y-4">
        <section className="fc-toolbar p-5">
          <p className="fc-label">Manual import</p>
          <div className="mt-2 grid gap-4 xl:grid-cols-[1fr_360px] xl:items-end">
            <div>
              <h1 className="text-4xl font-extrabold leading-none tracking-[-0.055em] text-[var(--fc-text)] sm:text-5xl">
                Paste scattered conversations.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--fc-text-muted)]">
                WhatsApp, Gmail, Instagram, notes, or transcribed screenshots. FlowCrew starts from real client chaos.
              </p>
            </div>

            <div className="rounded-2xl border border-[rgba(200,245,66,0.16)] bg-[rgba(200,245,66,0.06)] p-4">
              <p className="flow-mono text-xs uppercase tracking-[0.12em] text-[var(--fc-accent)]">
                Current release
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--fc-text-muted)]">
                FlowCrew currently works with manual import. Automatic integrations are planned, but not live yet.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <form onSubmit={importConversation} className="fc-panel p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.06] pb-5">
              <div>
                <p className="fc-label">Paste inbox</p>
                <h2 className="mt-1 text-2xl font-bold tracking-[-0.04em] text-[var(--fc-text)]">
                  Conversation importer
                </h2>
              </div>
              <span className="fc-pill">Raw preserved</span>
            </div>

            <fieldset className="mt-5">
              <legend className="text-sm font-bold text-[var(--fc-text)]">Import mode</legend>
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
                          ? "border-[rgba(200,245,66,0.24)] bg-[rgba(200,245,66,0.08)] text-[var(--fc-accent)]"
                          : "border-white/[0.06] bg-white/[0.025] text-[var(--fc-text-muted)] hover:border-white/[0.12]"
                      }`}
                    >
                      <span className="block text-sm font-bold">{option.label}</span>
                      <span className="mt-1 block text-xs opacity-75">{option.description}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label className="mt-5 block text-sm font-bold text-[var(--fc-text)]">
              Copied messages
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                rows={14}
                className="fc-textarea mt-2 min-h-[22rem]"
                placeholder={sampleConversation}
              />
            </label>

            <p className="mt-3 text-xs font-medium leading-5 text-[var(--fc-text-soft)]">
              FlowCrew keeps the original message and saves one structured lead. Automatic multi-lead splitting can come later.
            </p>

            <button type="submit" disabled={isLoading || !text.trim()} className="fc-button fc-button-primary mt-5 w-full">
              {isLoading ? "Importing..." : "Import and organize"}
            </button>

            {error ? (
              <div role="alert" className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm font-medium leading-6 text-red-100">
                {error}
              </div>
            ) : null}
          </form>

          <aside className="fc-panel p-5 sm:p-6">
            <p className="fc-label">Output</p>
            <h2 className="mt-1 text-2xl font-bold tracking-[-0.04em] text-[var(--fc-text)]">
              {result ? "Saved to workspace" : "Ready for the chaos"}
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
    <article className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="fc-label">Imported conversation</p>
          <h3 className="mt-1 text-xl font-bold tracking-[-0.04em] text-[var(--fc-text)]">
            Structured lead
          </h3>
        </div>
        <span className="fc-pill fc-pill-success">{lead.urgency ?? "New"}</span>
      </div>

      <ResultSection label="Summary">
        <p>{lead.summary ?? lead.raw_message}</p>
      </ResultSection>

      <ResultSection label="Tags">
        {tags.length ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="fc-pill">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p>No tags detected.</p>
        )}
      </ResultSection>

      <ResultSection label="Suggested reply">
        <div className="rounded-2xl border border-white/[0.06] bg-[#080808] p-4 text-[var(--fc-text-muted)]">
          {lead.suggested_reply ?? "No reply available."}
        </div>
      </ResultSection>

      <ResultSection label="Next action">
        <p>{lead.next_action ?? "Review the imported lead."}</p>
      </ResultSection>
    </article>
  );
}

function ResultSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="mt-4 border-t border-white/[0.06] pt-4">
      <p className="fc-label mb-2">{label}</p>
      <div className="text-sm font-medium leading-6 text-[var(--fc-text-muted)]">{children}</div>
    </section>
  );
}

function EmptyResult() {
  return (
    <div className="mt-5 grid gap-3">
      {["Clear summary", "Priority and tags", "Reply draft", "Next action"].map((item, index) => (
        <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
          <span className="flow-mono flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-sm text-[var(--fc-accent)]">
            {index + 1}
          </span>
          <p className="text-sm font-bold text-[var(--fc-text-muted)]">{item}</p>
        </div>
      ))}
    </div>
  );
}
