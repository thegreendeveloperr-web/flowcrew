import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  MessageSquareText,
  Sparkles,
  Zap,
} from "lucide-react";

const proofItems = [
  "1 lead free",
  "No card required",
  "WhatsApp, email or DM",
];

const workflow = [
  {
    step: "01",
    title: "Paste the client message",
    body: "Drop in the real WhatsApp, email or DM. No cleanup, no form-filling, no fake demo data.",
  },
  {
    step: "02",
    title: "FlowCrew opens the workspace",
    body: "Jackie, Nora, Milo and Dex extract the request, scope, priority, reply and handoff.",
  },
  {
    step: "03",
    title: "Act on the lead",
    body: "You get a compact summary, tags, next action and a reply draft you can copy or adjust.",
  },
];

const outputCards = [
  {
    title: "Lead summary",
    badge: "Jackie",
    icon: <Sparkles aria-hidden="true" className="h-4 w-4" />,
    body: "Website quote request. Needs services page, gallery and contact form. Content is not ready yet.",
  },
  {
    title: "Priority",
    badge: "Nora",
    icon: <Zap aria-hidden="true" className="h-4 w-4" />,
    body: "Medium-high. The deadline is end of month, but scope and assets still need confirmation.",
  },
  {
    title: "Suggested reply",
    badge: "Milo",
    icon: <MessageSquareText aria-hidden="true" className="h-4 w-4" />,
    body: "Ask for business details, pages, photos, deadline goal and offer a short mini-brief before pricing.",
  },
  {
    title: "Handoff",
    badge: "Dex",
    icon: <ClipboardList aria-hidden="true" className="h-4 w-4" />,
    body: "Qualify scope, collect materials, then send a realistic range for cost and timing.",
  },
];

const productSignals = [
  "Summary",
  "Tags",
  "Priority",
  "Reply",
  "Next action",
];

export default function Home() {
  return (
    <main
      className="flow-lime-glow min-h-screen overflow-hidden bg-[var(--fc-bg)] text-[var(--fc-text)]"
      id="main-content"
      tabIndex={-1}
    >
      <div className="pointer-events-none fixed inset-0 flow-grid-dark opacity-60" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#080808]/78 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--fc-accent)] text-sm font-extrabold text-[#080808]">
              F
            </span>
            <span className="text-lg font-bold tracking-[-0.03em]">FlowCrew</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {[
              ["How it works", "#how-it-works"],
              ["Example", "#example"],
              ["Product", "#product"],
            ].map(([label, href]) => (
              <a
                className="text-sm font-medium text-[var(--fc-text-muted)] transition hover:text-[var(--fc-text)]"
                href={href}
                key={label}
              >
                {label}
              </a>
            ))}
            <Link
              className="text-sm font-medium text-[var(--fc-text-muted)] transition hover:text-[var(--fc-text)]"
              href="/pricing"
            >
              Pricing
            </Link>
          </div>

          <Link className="fc-button fc-button-primary max-sm:!hidden" href="/trial">
            Analyze free
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 pb-16 pt-28 text-center sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-[14%] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-[rgba(200,245,66,0.09)] blur-[125px]" />
        <div className="pointer-events-none absolute left-1/2 top-[38%] h-[22rem] w-[68rem] -translate-x-1/2 rounded-full bg-[rgba(139,255,197,0.045)] blur-[110px]" />

        <div className="relative z-10 flex max-w-5xl flex-col items-center">
          <h1 className="max-w-[23rem] text-[clamp(3rem,13vw,4.8rem)] font-extrabold leading-[0.92] tracking-[-0.06em] sm:max-w-5xl sm:text-[clamp(4.3rem,8.4vw,8rem)]">
            Non perdere piu clienti
            <br />
            <em className="flow-serif font-normal text-[var(--fc-accent)]">
              nel caos.
            </em>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--fc-text-muted)]">
            FlowCrew trasforma WhatsApp, email e DM confusi in lead strutturati:
            summary, priorita, risposta e prossima azione.
          </p>

          <p className="flow-mono mt-4 max-w-2xl text-xs uppercase tracking-[0.14em] text-[var(--fc-text-soft)]">
            Incolli una richiesta reale, FlowCrew apre il workspace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="fc-button fc-button-primary px-6 py-4 text-base" href="/trial">
              Analyze 1 lead free
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Link>

            <Link className="fc-button px-6 py-4 text-base" href="/pricing">
              See pricing
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {proofItems.map((item) => (
              <span className="fc-pill" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-10 w-full max-w-5xl rounded-[2rem] border border-white/[0.07] bg-[rgba(14,14,14,0.72)] p-4 text-left shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_1.7fr] lg:items-stretch">
            <div className="rounded-[1.65rem] border border-white/[0.07] bg-black/35 p-4">
              <p className="flow-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fc-text-soft)]">
                Client message
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--fc-text-muted)]">
                Ciao, ho visto il tuo profilo su Instagram e volevo chiederti un
                preventivo. Mi servirebbe un sito semplice ma professionale, con
                servizi, galleria immagini e modulo contatti.
              </p>
            </div>

            <div className="hidden items-center justify-center text-[var(--fc-accent)] lg:flex">
              <ArrowRight aria-hidden="true" className="h-6 w-6" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {outputCards.map((card) => (
                <article
                  className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-4"
                  key={card.title}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="fc-pill fc-pill-success">{card.badge}</span>
                    <span className="text-[var(--fc-accent)]">{card.icon}</span>
                  </div>
                  <h2 className="mt-4 text-lg font-extrabold tracking-[-0.04em]">
                    {card.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--fc-text-muted)]">
                    {card.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] px-4 py-5 sm:px-6 lg:px-8"
        id="how-it-works"
      >
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
          {workflow.map((item) => (
            <article className="p-2" key={item.step}>
              <p className="flow-mono text-xs uppercase tracking-[0.14em] text-[var(--fc-accent)]">
                {item.step}
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.05em]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--fc-text-muted)]">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <Section
        id="example"
        title={
          <>
            The workspace opens
            <br />
            after the first paste.
          </>
        }
        body="The landing shows the promise. The trial page shows the product."
      >
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="fc-panel p-5 sm:p-6">
            <p className="fc-label">Before</p>
            <div className="mt-5 rounded-3xl border border-white/[0.06] bg-[#0e0e0e] p-5 text-sm leading-7 text-[var(--fc-text-muted)]">
              Instagram DM, missing copy, vague budget, end-of-month pressure and
              unclear scope all mixed together.
            </div>
          </div>

          <div className="grid gap-3">
            {productSignals.map((signal) => (
              <div
                className="flex items-center justify-between gap-4 rounded-3xl border border-white/[0.06] bg-white/[0.025] p-4"
                key={signal}
              >
                <span className="font-extrabold tracking-[-0.035em]">{signal}</span>
                <CheckCircle2
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-[var(--fc-accent)]"
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="product"
        title={
          <>
            Simple landing.
            <br />
            Real product flow.
          </>
        }
        body="Pricing, checkout and plan details live on their own route. The homepage stays focused on the value and the free analysis."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <FocusCard title="Homepage" body="Explain the problem, show the output and send people to the free trial." />
          <FocusCard title="Trial" body="Let the user paste a real request and watch FlowCrew build the lead workspace." />
          <FocusCard title="Pricing" body="Show plans, limits and upgrade paths only when the user is ready to compare." />
        </div>
      </Section>

      <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-[rgba(200,245,66,0.22)] bg-[rgba(200,245,66,0.06)] p-8 text-center shadow-[0_0_90px_rgba(200,245,66,0.08)] sm:p-12">
          <h2 className="text-5xl font-extrabold leading-[0.98] tracking-[-0.06em] sm:text-7xl">
            Try the product,
            <br />
            not another pitch.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--fc-text-muted)]">
            Paste one real client message and see the lead workspace appear.
          </p>

          <Link className="fc-button fc-button-primary mt-8 px-7 py-4 text-base" href="/trial">
            Analyze 1 lead free
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Section({
  id,
  title,
  body,
  children,
}: {
  id?: string;
  title: ReactNode;
  body: string;
  children: ReactNode;
}) {
  return (
    <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8" id={id}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-5xl font-extrabold leading-[0.98] tracking-[-0.06em] sm:text-6xl">
            {title}
          </h2>
          <p className="mt-5 text-base leading-7 text-[var(--fc-text-muted)]">
            {body}
          </p>
        </div>

        {children}
      </div>
    </section>
  );
}

function FocusCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="fc-card p-6">
      <h3 className="text-2xl font-extrabold tracking-[-0.045em]">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-[var(--fc-text-muted)]">{body}</p>
    </article>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <Link className="flex items-center gap-3" href="/">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--fc-accent)] text-xs font-extrabold text-[#080808]">
            F
          </span>
          <span className="font-bold">FlowCrew</span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[var(--fc-text-muted)]">
          <Link className="transition hover:text-[var(--fc-text)]" href="/privacy">
            Privacy
          </Link>
          <Link className="transition hover:text-[var(--fc-text)]" href="/terms">
            Terms
          </Link>
          <Link className="transition hover:text-[var(--fc-text)]" href="/pricing">
            Pricing
          </Link>
          <a className="transition hover:text-[var(--fc-text)]" href="mailto:hello@flowcrew.ai">
            Contact
          </a>
          <span>2026 FlowCrew</span>
        </div>
      </div>
    </footer>
  );
}
