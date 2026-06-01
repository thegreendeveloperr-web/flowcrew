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
    title: "Conversation cleaner",
    status: "working",
    brain: "Smart Brain",
    accent: "#51E5FF",
    gradient: "from-cyan-400/24 via-cyan-300/8 to-transparent",
    Icon: Radar,
    metric: "4 topics",
    metricLabel: "detected",
    microCopy: "Jackie is turning scattered messages into a clean client brief.",
    description:
      "Reads messy WhatsApp, Gmail, and chat fragments, then extracts facts, missing info, detected topics, and the next agent to consult.",
  },
  {
    id: "milo",
    name: "Milo",
    title: "Reply assistant",
    status: "watching",
    brain: "Smart Brain",
    accent: "#A8FF78",
    gradient: "from-lime-300/22 via-lime-200/8 to-transparent",
    Icon: MailCheck,
    metric: "4 tones",
    metricLabel: "ready",
    microCopy: "Milo is drafting replies, but waits for your confirmation.",
    description:
      "Prepares professional, friendly, short, or firm replies and asks the user before anything is treated as ready to send.",
  },
  {
    id: "nora",
    name: "Nora",
    title: "Opportunity evaluator",
    status: "working",
    brain: "Smart Brain",
    accent: "#9D6CFF",
    gradient: "from-violet-400/24 via-fuchsia-300/8 to-transparent",
    Icon: FileText,
    metric: "Needs clarity",
    metricLabel: "signal",
    microCopy: "Nora is checking if this request is profitable, unclear, or risky.",
    description:
      "Evaluates events, requests, and commercial opportunities to decide if they are profitable, unclear, unrealistic, or impossible with current info.",
  },
  {
    id: "dex",
    name: "Dex",
    title: "Tagging and workflow log",
    status: "online",
    brain: "Elite Brain",
    accent: "#FF8A9B",
    gradient: "from-rose-300/20 via-orange-200/8 to-transparent",
    Icon: Workflow,
    metric: "8 tags",
    metricLabel: "applied",
    microCopy: "Dex is tagging, prioritizing, and writing the CRM-style handoff.",
    description:
      "Adds tags, categories, priority, CRM notes, and next steps so every conversation becomes an organized workflow.",
  },
];

export const plans: Plan[] = [
  {
    name: "Starter",
    brain: "Core Brain",
    description: "For solo operators who want to organize conversations manually.",
    features: ["1 free conversation", "Jackie cleanup", "Basic tags", "Manual replies"],
    cta: "Try one conversation",
  },
  {
    name: "Pro",
    brain: "Smart Brain",
    description: "For freelancers and small teams receiving many client requests.",
    highlighted: true,
    features: [
      "More conversations",
      "Full Crew workflow",
      "Smart tags",
      "Reply drafts",
      "Opportunity evaluation",
    ],
    cta: "Unlock the Crew",
  },
  {
    name: "Crew+",
    brain: "Elite Brain",
    description: "For teams that need memory, automations, and custom workflow logic.",
    features: ["Memory", "Automations", "Custom workflow", "Priority rules", "Weekly report"],
    cta: "Request Crew+",
  },
];

export const activities: Activity[] = [
  {
    id: "act-1",
    agent: "jackie",
    title: "Conversation cleaned",
    message: "WhatsApp request split into facts, missing info, and detected topics.",
    time: "2 min ago",
  },
  {
    id: "act-2",
    agent: "dex",
    title: "Tags applied",
    message: "Added Event, Urgent, Da chiarire, and Follow-up tags.",
    time: "9 min ago",
  },
  {
    id: "act-3",
    agent: "nora",
    title: "Opportunity checked",
    message: "Event inquiry marked as needs clarification before accepting.",
    time: "18 min ago",
  },
  {
    id: "act-4",
    agent: "milo",
    title: "Reply drafted",
    message: "Professional clarification message prepared and waiting for approval.",
    time: "41 min ago",
  },
];

export const demoLeads: DemoLead[] = [
  {
    id: "conv-1",
    name: "WhatsApp - Marco evento",
    projectType: "Event inquiry",
    scope: "Needs clarification",
    score: 74,
    status: "Warm",
  },
  {
    id: "conv-2",
    name: "Gmail - Studio Aurora",
    projectType: "Quote request",
    scope: "High value",
    score: 86,
    status: "Hot",
  },
  {
    id: "conv-3",
    name: "Instagram - local shop",
    projectType: "Confused request",
    scope: "Info incomplete",
    score: 61,
    status: "Pending",
  },
];

export const dashboardStats = [
  {
    label: "Conversations cleaned",
    value: "12",
    caption: "Jackie organized 4 today",
    Icon: Sparkles,
    accent: "#51E5FF",
  },
  {
    label: "Replies waiting",
    value: "5",
    caption: "Milo needs approval",
    Icon: FileText,
    accent: "#9D6CFF",
  },
  {
    label: "Follow-ups pending",
    value: "7",
    caption: "Dex tagged the next actions",
    Icon: TimerReset,
    accent: "#A8FF78",
  },
];

export const missionChecklist = [
  "Clean the latest WhatsApp event request with Jackie",
  "Ask Dex to tag incomplete conversations and priority level",
  "Let Nora evaluate unclear opportunities before accepting them",
  "Approve or edit Milo replies before sending anything to the client",
];

export const brainTiers = [
  {
    label: "Core Brain",
    description: "Fast cleanup, basic tags, and simple reply drafts.",
    Icon: Bot,
  },
  {
    label: "Smart Brain",
    description: "Better context, opportunity evaluation, tone control, and handoffs.",
    Icon: BrainCircuit,
  },
  {
    label: "Elite Brain",
    description: "Advanced reasoning, workflow memory, and custom automation logic.",
    Icon: ShieldCheck,
  },
];
