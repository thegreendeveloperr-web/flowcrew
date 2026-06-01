import Link from "next/link";
import { Brain, Check, Crown } from "lucide-react";
import type { Plan } from "@/lib/data";

type PricingCardProps = {
  plan: Plan;
};

export default function PricingCard({ plan }: PricingCardProps) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-[2rem] border p-6 backdrop-blur ${
        plan.highlighted
          ? "border-fuchsia-300/30 bg-fuchsia-300/10 shadow-2xl shadow-fuchsia-500/10"
          : "border-white/10 bg-white/[0.05]"
      }`}
    >
      {plan.highlighted ? (
        <div className="absolute right-5 top-5 rounded-full bg-white px-3 py-1 text-xs font-black text-[#070711]">
          BEST VALUE
        </div>
      ) : null}
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
        {plan.name === "Crew+" ? (
          <Crown aria-hidden="true" className="h-5 w-5 text-amber-200" />
        ) : (
          <Brain aria-hidden="true" className="h-5 w-5 text-fuchsia-100" />
        )}
      </div>
      <div>
        <h3 className="text-2xl font-black tracking-tight text-white">
          {plan.name}
        </h3>
        <p className="mt-1 text-sm font-bold text-fuchsia-100/80">
          {plan.brain}
        </p>
      </div>
      <div className="mt-5 flex items-end gap-1">
        <span className="text-5xl font-black tracking-[-0.06em] text-white">
          {plan.price}
        </span>
        <span className="pb-2 text-sm text-white/45">/mo</span>
      </div>
      <p className="mt-4 min-h-12 text-sm leading-6 text-white/55">
        {plan.description}
      </p>
      <ul className="mt-6 space-y-3 text-sm text-white/70">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <Check
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/leads"
        className={`mt-8 inline-flex items-center justify-center rounded-2xl px-5 py-4 font-black transition ${
          plan.highlighted
            ? "bg-white text-slate-950 hover:scale-[1.02]"
            : "border border-white/10 bg-white/10 text-white hover:bg-white/15"
        }`}
      >
        {plan.cta}
      </Link>
    </article>
  );
}
