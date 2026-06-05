import { ApiError, GoogleGenAI, type Content } from "@google/genai";
import {
  conversationSourceValues,
  type ConversationAnalysis,
  type ConversationInput,
  type FlowCrewChatMessage,
  type FlowCrewLanguage,
} from "@/lib/flowcrew-types";

const defaultModel = "gemini-2.5-flash";
const requestTimeoutMs = 25_000;
const maxChatMessages = 12;

const demoRequests = [
  {
    customer: "Luca",
    channel: "WhatsApp",
    request: "preventivo sito con prenotazioni",
    priority: "high",
    status: "waiting_reply",
  },
  {
    customer: "Sara",
    channel: "Gmail",
    request: "vuole spostare appuntamento",
    priority: "medium",
    status: "follow_up",
  },
  {
    customer: "Marco",
    channel: "Form sito",
    request: "chiede info prezzi",
    priority: "low",
    status: "new",
  },
] as const;

const agentReviewSchema = {
  type: "object",
  additionalProperties: false,
  required: ["message", "findings"],
  properties: {
    message: { type: "string" },
    findings: {
      type: "array",
      maxItems: 5,
      items: { type: "string" },
    },
  },
} as const;

const dexReviewSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "message",
    "suggestedReply",
    "professional",
    "friendly",
    "short",
    "firmButPolite",
  ],
  properties: {
    message: { type: "string" },
    suggestedReply: { type: "string" },
    professional: { type: "string" },
    friendly: { type: "string" },
    short: { type: "string" },
    firmButPolite: { type: "string" },
  },
} as const;

const finalSummarySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "priority",
    "temperature",
    "nextAction",
    "suggestedReply",
    "risks",
    "missingInfo",
    "explanation",
    "tags",
    "category",
    "status",
    "crmNote",
    "urgency",
    "leadQuality",
    "riskLevel",
    "detectedTopics",
  ],
  properties: {
    priority: { type: "string" },
    temperature: { type: "string" },
    nextAction: { type: "string" },
    suggestedReply: { type: "string" },
    risks: {
      type: "array",
      maxItems: 4,
      items: { type: "string" },
    },
    missingInfo: {
      type: "array",
      maxItems: 5,
      items: { type: "string" },
    },
    explanation: { type: "string" },
    tags: {
      type: "array",
      maxItems: 6,
      items: { type: "string" },
    },
    category: { type: "string" },
    status: { type: "string" },
    crmNote: { type: "string" },
    urgency: { type: "string" },
    leadQuality: { type: "string" },
    riskLevel: { type: "string" },
    detectedTopics: {
      type: "array",
      maxItems: 5,
      items: { type: "string" },
    },
  },
} as const;

let geminiClient: GoogleGenAI | null = null;

export class FlowCrewAIError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    readonly publicMessage: string,
  ) {
    super(publicMessage);
    this.name = "FlowCrewAIError";
  }
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new FlowCrewAIError(
      "missing_api_key",
      500,
      "Il motore AI non e configurato. Aggiungi GEMINI_API_KEY al server.",
    );
  }

  geminiClient ??= new GoogleGenAI({ apiKey });
  return geminiClient;
}

function getModel() {
  return process.env.GEMINI_MODEL?.trim() || defaultModel;
}

function withTimeout() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(
  value: unknown,
  field: string,
  options: { max: number; required?: boolean },
) {
  if (typeof value !== "string") {
    throw new FlowCrewAIError("invalid_request", 400, `${field} non e valido.`);
  }

  const text = value.trim();

  if (options.required && !text) {
    throw new FlowCrewAIError("invalid_request", 400, `${field} e obbligatorio.`);
  }

  if (text.length > options.max) {
    throw new FlowCrewAIError(
      "invalid_request",
      400,
      `${field} supera il limite di ${options.max} caratteri.`,
    );
  }

  return text;
}

function readStringArray(value: unknown, field: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new FlowCrewAIError(
      "invalid_ai_response",
      502,
      `Gemini ha restituito un formato non valido per ${field}.`,
    );
  }

  return value.map((item) => item.trim()).filter(Boolean);
}

function readObject(value: unknown, field: string) {
  if (!isRecord(value)) {
    throw new FlowCrewAIError(
      "invalid_ai_response",
      502,
      `Gemini ha restituito un formato non valido per ${field}.`,
    );
  }

  return value;
}

function readAIString(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new FlowCrewAIError(
      "invalid_ai_response",
      502,
      `Gemini ha restituito un formato non valido per ${field}.`,
    );
  }

  return value.trim();
}

export function parseConversationInput(value: unknown): ConversationInput {
  if (!isRecord(value)) {
    throw new FlowCrewAIError("invalid_request", 400, "Richiesta non valida.");
  }

  if (value.source === "import") {
    return {
      clientName: readString(value.sender, "Mittente", {
        max: 120,
        required: true,
      }),
      sourceType: "import",
      messyMessage: readString(value.text, "Messaggio", {
        max: 8_000,
        required: true,
      }),
      businessType: "Imported multi-channel client conversation",
      goal: "Organize the copied messages into one structured lead with a summary, urgency, tags, suggested reply and next action.",
      language: "it",
    };
  }

  const sourceType = value.sourceType;
  const language = value.language;

  if (
    typeof sourceType !== "string" ||
    !conversationSourceValues.includes(
      sourceType as (typeof conversationSourceValues)[number],
    )
  ) {
    throw new FlowCrewAIError("invalid_request", 400, "Fonte non valida.");
  }

  if (language !== "en" && language !== "it") {
    throw new FlowCrewAIError("invalid_request", 400, "Lingua non valida.");
  }

  return {
    clientName: readString(value.clientName, "Nome cliente", { max: 120 }),
    sourceType: sourceType as ConversationInput["sourceType"],
    messyMessage: readString(value.messyMessage, "Messaggio", {
      max: 8_000,
      required: true,
    }),
    businessType: readString(value.businessType, "Tipo attivita", { max: 160 }),
    goal: readString(value.goal, "Obiettivo", { max: 300 }),
    language: language as FlowCrewLanguage,
  };
}

async function runAgentReview({
  input,
  agentName,
  role,
  instruction,
}: {
  input: ConversationInput;
  agentName: "Jackie" | "Milo" | "Nora";
  role: string;
  instruction: string;
}) {
  const timeout = withTimeout();
  const languageName = input.language === "it" ? "Italian" : "English";

  try {
    const response = await getGeminiClient().models.generateContent({
      model: getModel(),
      contents: JSON.stringify({
        clientInput: input,
        agent: agentName,
        role,
      }),
      config: {
        abortSignal: timeout.signal,
        systemInstruction: `
You are ${agentName}, one specialist inside FlowCrew.

Role:
${role}

Task:
${instruction}

Rules:
- Analyze the real client message.
- Write in ${languageName}.
- Do not invent facts, prices, deadlines, availability, or promises.
- If something is missing, say it clearly.
- Do not claim that you sent messages, created tasks, updated a CRM, or contacted anyone.
- Return only valid JSON that matches the schema.
`,
        temperature: 0.4,
        maxOutputTokens: 1_200,
        responseMimeType: "application/json",
        responseJsonSchema: agentReviewSchema,
      },
    });

    if (!response.text) {
      throw new FlowCrewAIError(
        "empty_ai_response",
        502,
        `${agentName} non ha restituito una risposta valida. Riprova.`,
      );
    }

    const data = readObject(JSON.parse(response.text), agentName);

    return {
      message: readAIString(data.message, `${agentName}.message`),
      findings: readStringArray(data.findings, `${agentName}.findings`),
    };
  } catch (error) {
    throw normalizeAIError(error);
  } finally {
    timeout.clear();
  }
}

async function runDexReview(input: ConversationInput) {
  const timeout = withTimeout();
  const languageName = input.language === "it" ? "Italian" : "English";

  try {
    const response = await getGeminiClient().models.generateContent({
      model: getModel(),
      contents: JSON.stringify({
        clientInput: input,
        agent: "Dex",
        role: "Reply assistant",
      }),
      config: {
        abortSignal: timeout.signal,
        systemInstruction: `
You are Dex, FlowCrew's reply assistant.

Analyze the real client message and draft replies the user could send.

Rules:
- Write in ${languageName}.
- Keep replies natural, useful, and ready to send.
- Do not invent facts, prices, deadlines, availability, or promises.
- Do not claim that a message was sent.
- Return only valid JSON that matches the schema.
`,
        temperature: 0.45,
        maxOutputTokens: 1_500,
        responseMimeType: "application/json",
        responseJsonSchema: dexReviewSchema,
      },
    });

    if (!response.text) {
      throw new FlowCrewAIError(
        "empty_ai_response",
        502,
        "Dex non ha restituito una risposta valida. Riprova.",
      );
    }

    const data = readObject(JSON.parse(response.text), "dex");

    return {
      message: readAIString(data.message, "dex.message"),
      suggestedReply: readAIString(data.suggestedReply, "dex.suggestedReply"),
      replies: {
        professional: readAIString(data.professional, "dex.professional"),
        friendly: readAIString(data.friendly, "dex.friendly"),
        short: readAIString(data.short, "dex.short"),
        firmButPolite: readAIString(data.firmButPolite, "dex.firmButPolite"),
      },
    };
  } catch (error) {
    throw normalizeAIError(error);
  } finally {
    timeout.clear();
  }
}

async function runFinalSummary({
  input,
  jackie,
  milo,
  nora,
  dex,
}: {
  input: ConversationInput;
  jackie: Awaited<ReturnType<typeof runAgentReview>>;
  milo: Awaited<ReturnType<typeof runAgentReview>>;
  nora: Awaited<ReturnType<typeof runAgentReview>>;
  dex: Awaited<ReturnType<typeof runDexReview>>;
}) {
  const timeout = withTimeout();
  const languageName = input.language === "it" ? "Italian" : "English";

  try {
    const response = await getGeminiClient().models.generateContent({
      model: getModel(),
      contents: JSON.stringify({
        clientInput: input,
        agentReviews: {
          jackie,
          milo,
          nora,
          dex,
        },
      }),
      config: {
        abortSignal: timeout.signal,
        systemInstruction: `
You are FlowCrew Summary, the final coordinator.

You receive real analysis from Jackie, Milo, Nora, and Dex.
Create one final operational summary for the user.

Rules:
- Write in ${languageName}.
- Be practical and concise.
- Do not invent facts, prices, deadlines, availability, or promises.
- Do not claim that actions were executed.
- Return only valid JSON that matches the schema.

Priority should usually be one of:
low, medium, high

Temperature should usually be one of:
cold, warm, hot
`,
        temperature: 0.35,
        maxOutputTokens: 1_200,
        responseMimeType: "application/json",
        responseJsonSchema: finalSummarySchema,
      },
    });

    if (!response.text) {
      throw new FlowCrewAIError(
        "empty_ai_response",
        502,
        "FlowCrew Summary non ha restituito una risposta valida. Riprova.",
      );
    }

    const data = readObject(JSON.parse(response.text), "summary");

    return {
      priority: readAIString(data.priority, "summary.priority"),
      temperature: readAIString(data.temperature, "summary.temperature"),
      nextAction: readAIString(data.nextAction, "summary.nextAction"),
      suggestedReply: readAIString(data.suggestedReply, "summary.suggestedReply"),
      risks: readStringArray(data.risks, "summary.risks"),
      missingInfo: readStringArray(data.missingInfo, "summary.missingInfo"),
      explanation: readAIString(data.explanation, "summary.explanation"),
      tags: readStringArray(data.tags, "summary.tags"),
      category: readAIString(data.category, "summary.category"),
      status: readAIString(data.status, "summary.status"),
      crmNote: readAIString(data.crmNote, "summary.crmNote"),
      urgency: readAIString(data.urgency, "summary.urgency"),
      leadQuality: readAIString(data.leadQuality, "summary.leadQuality"),
      riskLevel: readAIString(data.riskLevel, "summary.riskLevel"),
      detectedTopics: readStringArray(
        data.detectedTopics,
        "summary.detectedTopics",
      ),
    };
  } catch (error) {
    throw normalizeAIError(error);
  } finally {
    timeout.clear();
  }
}

export async function analyzeConversation(input: ConversationInput) {
  const [jackie, milo, nora, dex] = await Promise.all([
    runAgentReview({
      input,
      agentName: "Jackie",
      role: "Lead extraction specialist",
      instruction: `
Extract the client's real request, service needed, urgency, budget hints, deadline, missing information, and lead quality.
Explain what the message really means in a clean way.
`,
    }),
    runAgentReview({
      input,
      agentName: "Milo",
      role: "Commercial strategist",
      instruction: `
Evaluate the commercial opportunity, conversion potential, priority, risks, and the best next commercial move.
Think like someone trying to turn this lead into a real client without sounding pushy.
`,
    }),
    runAgentReview({
      input,
      agentName: "Nora",
      role: "Task and follow-up manager",
      instruction: `
Extract practical tasks, follow-up actions, deadlines, calendar signals, clarification questions, and what the user should do next.
`,
    }),
    runDexReview(input),
  ]);

  const summary = await runFinalSummary({
    input,
    jackie,
    milo,
    nora,
    dex,
  });

  return {
    jackie: {
      cleanSummary: jackie.message,
      keyFacts: jackie.findings,
      missingInfo: summary.missingInfo,
      detectedTopics: summary.detectedTopics,
      suggestedAgent: "FlowCrew Summary",
    },
    dex: {
      tags: summary.tags,
      priority: summary.priority,
      category: summary.category,
      status: summary.status,
      crmNote: summary.crmNote,
    },
    nora: {
      urgency: summary.urgency,
      leadQuality: summary.leadQuality,
      riskLevel: summary.riskLevel,
      why: nora.message,
      questions: summary.missingInfo,
      nextSteps: [summary.nextAction, ...nora.findings].slice(0, 4),
    },
    milo: {
      followUp: milo.message,
      replies: dex.replies,
    },
    crewReview: {
      jackie: {
        name: "Jackie",
        role: "Lead extraction",
        message: jackie.message,
        findings: jackie.findings,
      },
      milo: {
        name: "Milo",
        role: "Commercial strategy",
        message: milo.message,
        findings: milo.findings,
        nextCommercialMove: summary.nextAction,
        risk: summary.risks[0] || summary.riskLevel,
      },
      nora: {
        name: "Nora",
        role: "Task manager",
        message: nora.message,
        tasks: [summary.nextAction, ...nora.findings].slice(0, 4),
        questions: summary.missingInfo,
      },
      dex: {
        name: "Dex",
        role: "Reply assistant",
        message: dex.message,
        suggestedReply: dex.suggestedReply,
      },
      summary: {
        priority: summary.priority,
        temperature: summary.temperature,
        nextAction: summary.nextAction,
        suggestedReply: summary.suggestedReply,
        risks: summary.risks,
        missingInfo: summary.missingInfo,
        explanation: summary.explanation,
      },
    },
  } satisfies ConversationAnalysis;
}

export function parseChatRequest(value: unknown) {
  if (!isRecord(value) || !Array.isArray(value.messages)) {
    throw new FlowCrewAIError("invalid_request", 400, "Messaggi non validi.");
  }

  const language = value.language;

  if (language !== "en" && language !== "it") {
    throw new FlowCrewAIError("invalid_request", 400, "Lingua non valida.");
  }

  const messages = value.messages.slice(-maxChatMessages).map((item, index) => {
    if (!isRecord(item) || (item.role !== "user" && item.role !== "assistant")) {
      throw new FlowCrewAIError(
        "invalid_request",
        400,
        `Messaggio ${index + 1} non valido.`,
      );
    }

    return {
      role: item.role,
      content: readString(item.content, `Messaggio ${index + 1}`, {
        max: 2_000,
        required: true,
      }),
    } satisfies FlowCrewChatMessage;
  });

  if (!messages.length || messages.at(-1)?.role !== "user") {
    throw new FlowCrewAIError(
      "invalid_request",
      400,
      "Invia almeno un messaggio utente.",
    );
  }

  return { messages, language: language as FlowCrewLanguage };
}

export async function chatWithFlowCrew(
  messages: FlowCrewChatMessage[],
  language: FlowCrewLanguage,
) {
  const timeout = withTimeout();
  const contents: Content[] = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

  try {
    const response = await getGeminiClient().models.generateContent({
      model: getModel(),
      contents,
      config: {
        abortSignal: timeout.signal,
        systemInstruction: `
You are FlowCrew Bot, the assistant for a demo client-message workspace.
Answer in ${language === "it" ? "Italian" : "English"}.

You can summarize requests, identify urgency, suggest replies, tags, tasks, and follow-ups.
Never claim that you sent a message, created a task, changed data, or contacted a client.
This is a read-only demo: do not offer to execute actions. Only offer drafts and suggestions.
Use plain text, not Markdown.
Use only the demo inbox data below when the user asks about current clients:
${JSON.stringify(demoRequests, null, 2)}
`,
        temperature: 0.45,
        maxOutputTokens: 900,
      },
    });

    if (!response.text) {
      throw new FlowCrewAIError(
        "empty_ai_response",
        502,
        "Gemini non ha restituito una risposta valida. Riprova.",
      );
    }

    return response.text.trim();
  } catch (error) {
    throw normalizeAIError(error);
  } finally {
    timeout.clear();
  }
}

export function normalizeAIError(error: unknown) {
  if (error instanceof FlowCrewAIError) return error;

  if (error instanceof SyntaxError) {
    return new FlowCrewAIError(
      "invalid_ai_response",
      502,
      "Gemini ha restituito una risposta non valida. Riprova.",
    );
  }

  if (error instanceof ApiError) {
    if (error.status === 429) {
      return new FlowCrewAIError(
        "rate_limited",
        503,
        "Gemini e momentaneamente occupato. Riprova tra poco.",
      );
    }

    if (error.status === 401 || error.status === 403) {
      return new FlowCrewAIError(
        "invalid_api_key",
        500,
        "Il motore AI non e configurato correttamente.",
      );
    }
  }

  if (error instanceof Error && error.name === "AbortError") {
    return new FlowCrewAIError(
      "timeout",
      504,
      "Gemini sta impiegando troppo tempo. Riprova.",
    );
  }

  return new FlowCrewAIError(
    "ai_request_failed",
    502,
    "Non riesco a contattare Gemini in questo momento. Riprova.",
  );
}

export function logAIError(error: unknown) {
  const normalized = normalizeAIError(error);
  console.error("FlowCrew AI request failed", {
    code: normalized.code,
    status: normalized.status,
  });
}