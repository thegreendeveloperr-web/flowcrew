import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, Sparkles } from "lucide-react";

const manualProHref =
  "mailto:hello@flowcrew.ai?subject=Richiesta%20accesso%20FlowCrew%20Pro";

const plans = [
  {
    name: "Free trial",
    price: "0",
    period: "one lead",
    description: "For testing FlowCrew with one real client message.",
    features: [
      "1 lead analysis",
      "Jackie, Nora, Milo and Dex",
      "Lead summary, tags and reply",
      "No card required",
    ],
    cta: "Analyze 1 lead free",
    href: "/trial",
  },
  {
    name: "Pro",
    price: "19",
    period: "per month",
    description: "For freelancers who receive client requests every week.",
    features: [
      "More lead analyses",
      "Saved client history",
      "Dashboard and lead records",
      "Better handoff and replies",
      "Priority support in beta",
    ],
    cta: "Upgrade to Pro",
    href: "/api/stripe/checkout",
    featured: true,
  },
  {
    name: "Team",
    price: "Custom",
    period: "beta",
    description: "For small teams that need shared workflows and custom setup.",
    features: [
      "Shared workspace",
      "Guided setup",
      "Workflow feedback loop",
      "Early access to integrations",
      "Custom usage limits",
    ],
    cta: "Request access",
    href: manualProHref,
  },
];

export default function PricingPage() {
  return (
    <main
      className="flow-lime-glow min-h-screen overflow-hidden bg-[var(--fc-bg)] text-[var(--fc-text)]"
      id="main-content"
      tabIndex={-1}
    >
      <div className="pointer-events-none fixed inset-0 flow-grid-dark opacity-60" />

      <header className="relative z-10 border-b border-white/[0.06] bg-[#080808]/78 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--fc-accent)] text-sm font-extrabold text-[#080808]">
              F
            </span>
            <span className="text-lg font-bold tracking-[-0.03em]">FlowCrew</span>
          </Link>

          <Link className="fc-button" href="/">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Home
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[rgba(200,245,66,0.08)] blur-[120px]" />

        <div className="relative max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
            <CreditCard aria-hidden="true" className="h-4 w-4 text-[var(--fc-accent)]" />
            <span className="flow-mono text-xs uppercase tracking-[0.14em] text-[var(--fc-text-soft)]">
              Pricing
            </span>
          </div>

          <h1 className="text-5xl font-extrabold leading-[0.95] tracking-[-0.06em] sm:text-7xl">
            Start free.
            <br />
            Upgrade when FlowCrew fits.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--fc-text-muted)]">
            The homepage stays focused on the product promise. Plan details, trial limits
            and checkout live here.
          </p>
        </div>

        <div className="relative mt-12 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              className={`rounded-[2rem] border bg-[rgba(14,14,14,0.74)] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl ${
                plan.featured
                  ? "border-[rgba(200,245,66,0.32)] shadow-[0_0_80px_rgba(200,245,66,0.08)]"
                  : "border-white/[0.07]"
              }`}
              key={plan.name}
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-extrabold tracking-[-0.045em]">{plan.name}</h2>
                {plan.featured ? (
                  <span className="fc-pill fc-pill-success">
                    <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                    Popular
                  </span>
                ) : null}
              </div>

              <div className="mt-7 flex items-end gap-2">
                <p className="text-5xl font-extrabold tracking-[-0.06em]">
                  {plan.price === "Custom" ? "Custom" : `EUR ${plan.price}`}
                </p>
                <p className="pb-2 text-sm font-medium text-[var(--fc-text-soft)]">
                  {plan.period}
                </p>
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--fc-text-muted)]">
                {plan.description}
              </p>

              <ul className="mt-7 space-y-3">
                {plan.features.map((feature) => (
                  <li className="flex gap-2 text-sm text-[var(--fc-text-muted)]" key={feature}>
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--fc-accent)]"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.href.startsWith("mailto:") ? (
                <a
                  className={`fc-button mt-8 w-full ${plan.featured ? "fc-button-primary" : ""}`}
                  href={plan.href}
                >
                  {plan.cta}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  className={`fc-button mt-8 w-full ${plan.featured ? "fc-button-primary" : ""}`}
                  href={plan.href}
                >
                  {plan.cta}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              )}
            </article>
          ))}
        </div>

        <div className="relative mt-8 rounded-[2rem] border border-white/[0.07] bg-white/[0.025] p-5 text-sm leading-7 text-[var(--fc-text-muted)]">
          <p>
            Checkout is intentionally separate from the landing. Users first understand
            FlowCrew, then test one real lead, then compare plans when they are ready.
          </p>
        </div>
      </section>
    </main>
  );
}
