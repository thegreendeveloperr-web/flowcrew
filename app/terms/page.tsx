import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] px-5 py-8 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5" href="/">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to FlowCrew
        </Link>

        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700">Early access placeholder</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] text-slate-950 sm:text-5xl">Terms</h1>
          <p className="mt-5 text-base leading-7 text-slate-600">
            FlowCrew is currently an early access product. Complete terms of service will be published before the public release.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-600">
            The free trial is intended to analyze one manually pasted lead so you can review the generated summary, priority, tags, next action, and reply draft.
          </p>
          <a className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5" href="mailto:hello@flowcrew.ai">
            <Mail aria-hidden="true" className="h-4 w-4" />
            hello@flowcrew.ai
          </a>
        </section>
      </div>
    </main>
  );
}
