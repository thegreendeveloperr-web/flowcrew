export type AgentId = "jackie" | "dex" | "nora" | "milo";

export const agentOrder: AgentId[] = ["jackie", "dex", "nora", "milo"];

export const agentRoles = {
  jackie: {
    name: "Jackie",
    title: "Conversation organizer",
    description: "Cleans and structures scattered WhatsApp, Gmail, and client messages into a readable brief.",
    workflowAction: "Cleans and structures scattered messages",
  },
  dex: {
    name: "Dex",
    title: "Lead classifier",
    description: "Assigns tags, category, priority, and status so each lead is easy to manage.",
    workflowAction: "Assigns tags, category, priority, and status",
  },
  nora: {
    name: "Nora",
    title: "Lead evaluator",
    description: "Evaluates urgency, lead quality, risk, and the next actions worth taking.",
    workflowAction: "Evaluates urgency, quality, risk, and next actions",
  },
  milo: {
    name: "Milo",
    title: "Reply and follow-up assistant",
    description: "Prepares human replies and follow-ups for your approval before anything is sent.",
    workflowAction: "Prepares replies and follow-ups for approval",
  },
} satisfies Record<
  AgentId,
  {
    name: string;
    title: string;
    description: string;
    workflowAction: string;
  }
>;
