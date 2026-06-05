export const conversationSourceValues = [
  "import",
  "whatsapp",
  "gmail",
  "instagram",
  "email",
  "notes",
  "other",
] as const;

export type ConversationSource = (typeof conversationSourceValues)[number];
export type FlowCrewLanguage = "en" | "it";

export type ConversationInput = {
  clientName: string;
  sourceType: ConversationSource;
  messyMessage: string;
  businessType: string;
  goal: string;
  language: FlowCrewLanguage;
};

export type CrewReview = {
  jackie: {
    name: "Jackie";
    role: string;
    message: string;
    findings: string[];
  };
  milo: {
    name: "Milo";
    role: string;
    message: string;
    findings: string[];
    nextCommercialMove: string;
    risk: string;
  };
  nora: {
    name: "Nora";
    role: string;
    message: string;
    tasks: string[];
    questions: string[];
  };
  dex: {
    name: "Dex";
    role: string;
    message: string;
    suggestedReply: string;
  };
  summary: {
    priority: string;
    temperature: string;
    nextAction: string;
    suggestedReply: string;
    risks: string[];
    missingInfo: string[];
    explanation: string;
  };
};

export type ConversationAnalysis = {
  jackie: {
    cleanSummary: string;
    keyFacts: string[];
    missingInfo: string[];
    detectedTopics: string[];
    suggestedAgent: string;
  };
  dex: {
    tags: string[];
    priority: string;
    category: string;
    status: string;
    crmNote: string;
  };
  nora: {
    urgency: string;
    leadQuality: string;
    riskLevel: string;
    why: string;
    questions: string[];
    nextSteps: string[];
  };
  milo: {
    followUp: string;
    replies: {
      professional: string;
      friendly: string;
      short: string;
      firmButPolite: string;
    };
  };
  crewReview?: CrewReview;
  analysisMeta?: {
    status: "complete" | "partial";
    degraded: boolean;
    degradedAgents: string[];
    warnings: string[];
    model: string;
  };
};

export type FlowCrewChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type LeadAnalysisResult = {
  leadName: string;
  generatedAt: string;
  analysis: ConversationAnalysis;
};
