import type { AgentId } from "@/lib/data";

type AgentAvatarProps = {
  agentId: AgentId;
  size?: "sm" | "md" | "lg";
  label?: string;
  decorative?: boolean;
  className?: string;
};

const agentNames: Record<AgentId, string> = {
  jackie: "Jackie",
  nora: "Nora",
  milo: "Milo",
  dex: "Dex",
};

const avatarStyles: Record<
  AgentId,
  {
    shell: string;
    glow: string;
    face: string;
    hair: string;
    eyes: string;
    mouth: string;
  }
> = {
  jackie: {
    shell: "from-cyan-300/35 via-sky-400/18 to-slate-950",
    glow: "shadow-cyan-500/25",
    face: "from-slate-900 via-cyan-950 to-slate-950",
    hair: "bg-cyan-200/35",
    eyes: "bg-cyan-100 shadow-[0_0_12px_rgba(165,243,252,0.85)]",
    mouth: "bg-cyan-100/70",
  },
  nora: {
    shell: "from-fuchsia-300/35 via-violet-500/18 to-slate-950",
    glow: "shadow-fuchsia-500/25",
    face: "from-slate-900 via-fuchsia-950 to-slate-950",
    hair: "bg-fuchsia-200/35",
    eyes: "bg-fuchsia-100 shadow-[0_0_12px_rgba(245,208,254,0.85)]",
    mouth: "bg-fuchsia-100/70",
  },
  milo: {
    shell: "from-violet-300/35 via-indigo-500/18 to-slate-950",
    glow: "shadow-violet-500/25",
    face: "from-slate-900 via-violet-950 to-slate-950",
    hair: "bg-violet-200/35",
    eyes: "bg-violet-100 shadow-[0_0_12px_rgba(221,214,254,0.85)]",
    mouth: "bg-violet-100/70",
  },
  dex: {
    shell: "from-rose-300/35 via-orange-500/18 to-slate-950",
    glow: "shadow-rose-500/25",
    face: "from-slate-900 via-rose-950 to-slate-950",
    hair: "bg-rose-200/35",
    eyes: "bg-rose-100 shadow-[0_0_12px_rgba(255,228,230,0.85)]",
    mouth: "bg-rose-100/70",
  },
};

const sizeStyles = {
  sm: {
    outer: "h-10 w-10 rounded-2xl",
    face: "h-7 w-7 rounded-[1rem]",
    eye: "h-1.5 w-1.5",
    mouth: "h-0.5 w-3",
  },
  md: {
    outer: "h-14 w-14 rounded-[1.35rem]",
    face: "h-10 w-10 rounded-[1.25rem]",
    eye: "h-2 w-2",
    mouth: "h-1 w-4",
  },
  lg: {
    outer: "h-20 w-20 rounded-[1.85rem]",
    face: "h-14 w-14 rounded-[1.65rem]",
    eye: "h-2.5 w-2.5",
    mouth: "h-1 w-5",
  },
};

export default function AgentAvatar({
  agentId,
  size = "md",
  label,
  decorative = false,
  className = "",
}: AgentAvatarProps) {
  const style = avatarStyles[agentId];
  const sizes = sizeStyles[size];

  return (
    <div
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label ?? `${agentNames[agentId]} AI portrait`}
      className={`relative isolate flex shrink-0 items-center justify-center overflow-hidden border border-white/15 bg-gradient-to-br ${style.shell} ${sizes.outer} ${style.glow} shadow-2xl ${className}`}
      role={decorative ? undefined : "img"}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.26),transparent_28%),radial-gradient(circle_at_74%_82%,rgba(255,255,255,0.1),transparent_32%)]" />
      <span className="absolute inset-x-2 bottom-1 h-1/2 rounded-full bg-black/25 blur-md" />

      <span
        className={`relative flex items-center justify-center overflow-hidden border border-white/12 bg-gradient-to-b ${style.face} ${sizes.face}`}
      >
        <span
          className={`absolute -top-2 left-1/2 h-5 w-10 -translate-x-1/2 rounded-full blur-[0.5px] ${style.hair}`}
        />
        <span className="absolute left-1/2 top-[42%] flex -translate-x-1/2 gap-2">
          <span className={`rounded-full ${sizes.eye} ${style.eyes}`} />
          <span className={`rounded-full ${sizes.eye} ${style.eyes}`} />
        </span>
        <span
          className={`absolute left-1/2 top-[63%] -translate-x-1/2 rounded-full ${sizes.mouth} ${style.mouth}`}
        />
      </span>

      <AgentAvatarAccessory agentId={agentId} />
    </div>
  );
}

function AgentAvatarAccessory({ agentId }: { agentId: AgentId }) {
  if (agentId === "jackie") {
    return (
      <span className="absolute inset-x-2 top-1/2 h-px -rotate-12 bg-cyan-100/70 shadow-[0_0_14px_rgba(165,243,252,0.85)]" />
    );
  }

  if (agentId === "nora") {
    return (
      <span className="absolute bottom-2 right-2 h-4 w-3 rounded-[0.35rem] border border-fuchsia-100/60 bg-fuchsia-100/15">
        <span className="absolute left-1 top-1 h-px w-1.5 bg-fuchsia-100/75" />
        <span className="absolute left-1 top-2 h-px w-1.5 bg-fuchsia-100/45" />
      </span>
    );
  }

  if (agentId === "milo") {
    return (
      <>
        <span className="absolute left-2 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-violet-100/55" />
        <span className="absolute right-2 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-violet-100/55" />
        <span className="absolute bottom-2 right-3 h-px w-4 rotate-12 bg-violet-100/65" />
      </>
    );
  }

  return (
    <>
      <span className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-rose-100/85 shadow-[0_0_10px_rgba(255,228,230,0.9)]" />
      <span className="absolute bottom-4 left-5 h-1.5 w-1.5 rounded-full bg-rose-100/65" />
      <span className="absolute bottom-[0.95rem] left-[0.85rem] h-px w-4 rotate-[-28deg] bg-rose-100/40" />
    </>
  );
}
