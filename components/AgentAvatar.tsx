import type { AgentId } from "@/lib/data";

type AgentAvatarProps = {
  agentId: AgentId;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  decorative?: boolean;
  className?: string;
};

const agentConfig: Record<
  AgentId,
  {
    name: string;
    bg: string;
    hair: string;
    skin: string;
    accent: string;
    detail: "slash" | "glasses" | "headset" | "beard";
  }
> = {
  jackie: {
    name: "Jackie",
    bg: "from-indigo-100 via-blue-50 to-white",
    hair: "#4f46e5",
    skin: "#f3c6a5",
    accent: "#5b5ff8",
    detail: "slash",
  },
  milo: {
    name: "Milo",
    bg: "from-cyan-100 via-blue-50 to-white",
    hair: "#1e293b",
    skin: "#f0c7a8",
    accent: "#06b6d4",
    detail: "glasses",
  },
  nora: {
    name: "Nora",
    bg: "from-rose-100 via-pink-50 to-white",
    hair: "#db2777",
    skin: "#f2c3a5",
    accent: "#f43f5e",
    detail: "headset",
  },
  dex: {
    name: "Dex",
    bg: "from-emerald-100 via-teal-50 to-white",
    hair: "#3f3028",
    skin: "#d7a77e",
    accent: "#10b981",
    detail: "beard",
  },
};

const sizeClasses = {
  sm: "h-10 w-10 rounded-2xl",
  md: "h-14 w-14 rounded-[1.35rem]",
  lg: "h-20 w-20 rounded-[1.85rem]",
  xl: "h-28 w-28 rounded-[2.25rem]",
};

export default function AgentAvatar({
  agentId,
  size = "md",
  label,
  decorative = false,
  className = "",
}: AgentAvatarProps) {
  const config = agentConfig[agentId];

  return (
    <div
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label ?? `${config.name} AI portrait`}
      className={`relative flex shrink-0 items-center justify-center overflow-hidden border border-white bg-gradient-to-br ${config.bg} shadow-[0_18px_45px_rgba(15,23,42,0.12)] ${sizeClasses[size]} ${className}`}
      role={decorative ? undefined : "img"}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(255,255,255,0.9),transparent_34%),radial-gradient(circle_at_76%_82%,rgba(37,99,235,0.12),transparent_34%)]" />
      <svg
        className="relative h-[78%] w-[78%] overflow-visible"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="60" cy="102" rx="34" ry="10" fill="rgba(15,23,42,0.12)" />
        <rect x="30" y="24" width="60" height="72" rx="29" fill={config.skin} />
        <path
          d="M30 48C31 26 45 15 61 15C77 15 90 26 91 48C79 40 46 39 30 48Z"
          fill={config.hair}
        />
        <path
          d="M35 38C44 24 72 19 88 36C76 32 56 31 35 38Z"
          fill="rgba(255,255,255,0.16)"
        />
        {agentId === "nora" ? (
          <>
            <path d="M31 44C24 55 24 75 31 88V44Z" fill={config.hair} />
            <path d="M89 44C96 55 96 75 89 88V44Z" fill={config.hair} />
          </>
        ) : null}
        <circle cx="47" cy="58" r="4" fill="#0f172a" />
        <circle cx="73" cy="58" r="4" fill="#0f172a" />
        <path d="M58 61C57 67 55 72 60 73" stroke="rgba(124,45,18,0.34)" strokeWidth="3" strokeLinecap="round" />
        <path d="M49 78C56 85 66 85 73 78" stroke="#7c2d12" strokeWidth="4" strokeLinecap="round" />

        {config.detail === "glasses" ? (
          <>
            <circle cx="47" cy="58" r="11" stroke="rgba(15,23,42,0.55)" strokeWidth="3" />
            <circle cx="73" cy="58" r="11" stroke="rgba(15,23,42,0.55)" strokeWidth="3" />
            <path d="M58 58H62" stroke="rgba(15,23,42,0.55)" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : null}

        {config.detail === "headset" ? (
          <>
            <path d="M28 61C28 39 42 25 60 25C78 25 92 39 92 61" stroke={config.accent} strokeWidth="5" strokeLinecap="round" />
            <rect x="22" y="55" width="13" height="24" rx="6" fill={config.accent} />
            <rect x="85" y="55" width="13" height="24" rx="6" fill={config.accent} />
            <path d="M90 78C84 88 75 93 63 93" stroke={config.accent} strokeWidth="4" strokeLinecap="round" />
          </>
        ) : null}

        {config.detail === "beard" ? (
          <path d="M40 72C44 91 76 91 80 72C73 78 47 78 40 72Z" fill={config.hair} opacity="0.92" />
        ) : null}

        {config.detail === "slash" ? (
          <path d="M29 67L91 48" stroke={config.accent} strokeWidth="4" strokeLinecap="round" opacity="0.55" />
        ) : null}
      </svg>
      <span
        className="absolute bottom-2 right-2 h-3 w-3 rounded-full border-2 border-white"
        style={{ backgroundColor: config.accent }}
      />
    </div>
  );
}
