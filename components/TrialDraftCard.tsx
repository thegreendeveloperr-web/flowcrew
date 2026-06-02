"use client";

import { useRef } from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";
import { trialDraftStorageKey } from "@/lib/trial-draft";

const placeholder =
  "Ciao, volevo un preventivo per un sito per il mio studio. Ti ho mandato il logo via mail, mi servirebbe abbastanza presto e forse anche una pagina prenotazioni. Possiamo sentirci domani?";

export default function TrialDraftCard({ outputs }: { outputs: string[] }) {
  const messageRef = useRef<HTMLTextAreaElement>(null);

  function persistDraft() {
    try {
      const message = messageRef.current?.value.trim() ?? "";

      if (message) {
        window.localStorage.setItem(trialDraftStorageKey, message);
      } else {
        window.localStorage.removeItem(trialDraftStorageKey);
      }
    } catch {
      // The trial still works when storage is unavailable.
    }
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-4 text-sm leading-6 text-slate-600">
        Paste a messy client message. FlowCrew will return a summary, urgency level, tags, next action, and a reply draft.
      </p>
      <label className="mb-3 block text-sm font-black text-slate-700" htmlFor="lead">
        Client conversation
      </label>
      <textarea
        className="h-40 w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
        id="lead"
        onChange={persistDraft}
        placeholder={placeholder}
        ref={messageRef}
      />
      <ul className="mt-4 flex flex-wrap gap-2">
        {outputs.map((output) => (
          <li className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700 ring-1 ring-blue-100" key={output}>
            <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
            {output}
          </li>
        ))}
      </ul>
      <Link
        className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 px-5 py-4 font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.24)]"
        href="/trial"
        onClick={persistDraft}
      >
        Generate client brief
        <Sparkles aria-hidden="true" className="h-5 w-5" />
      </Link>
    </div>
  );
}
