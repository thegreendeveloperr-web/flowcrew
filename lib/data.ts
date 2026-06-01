import type { LucideIcon } from "lucide-react";
import {
  Bot,
  BrainCircuit,
  FileText,
  MailCheck,
  Radar,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Workflow,
} from "lucide-react";

export type AgentId = "jackie" | "milo" | "nora" | "dex";

export type Agent = {
  id: AgentId;
  name: string;
  title: string;
  status: "online" | "working" | "watching";
  brain: "Core Brain" | "Smart Brain" | "Elite Brain";
  accent: string;
  gradient: string;
  Icon: LucideIcon;
  metric: string;
  metricLabel: string;
  microCopy: string;
  description: string;
};

export type Plan = {
  name: string;
  brain: "Core Brain" | "Smart Brain" | "Elite Brain";
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export type Activity = {
  id: string;
  agent: AgentId;
  title: string;
  message: string;
  time: string;
};

export type DemoLead = {
  id: string;
  name: string;
  projectType: string;
  scope: string;
  score: number;
  status: "Hot" | "Warm" | "Pending";
};

export const agents: Agent[] = [
  {
    id: "jackie",
    name: "Jackie",
    title: "Lead intelligence",
    status: "working",
    brain: "Smart Brain",
    accent: "#51E5FF",
    gradient: "from-cyan-400/24 via-cyan-300/8 to-transparent",
    Icon: Radar,
    metric: "86/100",
    metricLabel: "deal heat",
    microCopy: "Jackie is ranking fit, urgency, and value signal.",
    description:
      "Cuts through vague requests, spots buying intent, and tells you which lead deserves same-day attention.",
  },
  {
    id: "milo",
    name: "Milo",
    title: "Follow-up control",
    status: "watching",
    brain: "Smart Brain",
    accent: "#A8FF78",
    gradient: "from-lime-300/22 via-lime-200/8 to-transparent",
    Icon: MailCheck,
    metric: "48h",
    metricLabel: "next touch",
    microCopy: "Milo is protecting the next step window.",
    description:
      "Keeps every promise on time with calm, credible follow-ups before good leads drift out of reach.",
  },
  {
    id: "nora",
    name: "Nora",
    title: "Proposal studio",
    status: "working",
    brain: "Smart Brain",
    accent: "#9D6CFF",
    gradient: "from-violet-400/24 via-fuchsia-300/8 to-transparent",
    Icon: FileText,
    metric: "3",
    metricLabel: "drafts ready",
    microCopy: "Nora is shaping a clean, client-ready scope.",
    description:
      "Turns messy asks into polished scopes, concrete deliverables, and language clients can trust.",
  },
  {
    id: "dex",
    name: "Dex",
    title: "Flow engineer",
    status: "online",
    brain: "Elite Brain",
    accent: "#FF8A9B",
    gradient: "from-rose-300/20 via-orange-200/8 to-transparent",
    Icon: Workflow,
    metric: "12",
    metricLabel: "flows synced",
    microCopy: "Dex is writing the handoff trace.",
    description:
      "Logs every move, wires the agent handoff layer, and keeps the whole demo feeling like a real operating system.",
  },
];

export const plans: Plan[] = [
  {
    name: "Starter",
    brain: "Core Brain",
    description: "For solo operators testing FlowCrew.",
    features: ["Core Brain", "Manual lead entry", "Simple replies"],
    cta: "Start with one free lead",
  },
  {
    name: "Pro",
    brain: "Smart Brain",
    description: "For freelancers and small teams that want the full Crew.",
    highlighted: true,
    features: [
      "Smart Brain",
      "Nora proposal studio",
      "Dex flow logging",
      "Brand tone",
    ],
    cta: "Unlock Smart Crew",
  },
  {
    name: "Crew+",
    brain: "Elite Brain",
    description:
      "For teams that need memory, automations, and deeper reasoning.",
    features: [
      "Elite Brain",
      "Business memory",
      "Custom automations",
      "Weekly deal report",
    ],
    cta: "Request Crew+",
  },
];

export const activities: Activity[] = [
  {
    id: "act-1",
    agent: "dex",
    title: "Flow saved",
    message: "Lead -> Jackie -> Nora -> Milo -> Dex pipeline is healthy.",
    time: "2 min ago",
  },
  {
    id: "act-2",
    agent: "jackie",
    title: "Hot lead detected",
    message: "Studio Aurora scored 86/100 after urgency and value scan.",
    time: "9 min ago",
  },
  {
    id: "act-3",
    agent: "nora",
    title: "Proposal drafted",
    message: "Website refresh scope prepared with a focused launch plan.",
    time: "18 min ago",
  },
  {
    id: "act-4",
    agent: "milo",
    title: "Follow-up queued",
    message: "Warm reminder scheduled for Friday morning.",
    time: "41 min ago",
  },
];

export const demoLeads: DemoLead[] = [
  {
    id: "lead-1",
    name: "Studio Aurora",
    projectType: "Brand website",
    scope: "Focused project",
    score: 86,
    status: "Hot",
  },
  {
    id: "lead-2",
    name: "Northline Coffee",
    projectType: "Launch funnel",
    scope: "Multi-part project",
    score: 78,
    status: "Warm",
  },
  {
    id: "lead-3",
    name: "Marta UX Lab",
    projectType: "Automation sprint",
    scope: "Lean starter scope",
    score: 71,
    status: "Pending",
  },
];

export const dashboardStats = [
  {
    label: "Hot leads",
    value: "7",
    caption: "Jackie found 3 today",
    Icon: Sparkles,
    accent: "#51E5FF",
  },
  {
    label: "Proposals ready",
    value: "3",
    caption: "Nora has drafts waiting",
    Icon: FileText,
    accent: "#9D6CFF",
  },
  {
    label: "Follow-up pending",
    value: "5",
    caption: "Milo is holding the rhythm",
    Icon: TimerReset,
    accent: "#A8FF78",
  },
];

export const missionChecklist = [
  "Rank Studio Aurora and confirm the buying signal",
  "Shape one Pro-tier scope and deliverables plan before lunch",
  "Send two reliable follow-ups within the next 48 hours",
  "Keep Dex logging every handoff in the flow memory",
];

export const brainTiers = [
  {
    label: "Core Brain",
    description: "Fast answers, base lead scoring, and simple follow-ups.",
    Icon: Bot,
  },
  {
    label: "Smart Brain",
    description: "Sales context, brand tone, complete proposals, and better timing.",
    Icon: BrainCircuit,
  },
  {
    label: "Elite Brain",
    description: "Advanced reasoning, business memory, and custom automation logic.",
    Icon: ShieldCheck,
  },
];
