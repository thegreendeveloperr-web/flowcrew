export const conversationSourceValues = [
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
    crmNote: string;
    nextSteps: string[];
  };
  nora: {
    status: string;
    profitabilitySignal: string;
    riskLevel: string;
    why: string;
    questions: string[];
  };
  milo: {
    replies: {
      professional: string;
      friendly: string;
      short: string;
      firmButPolite: string;
    };
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
