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

const conversationAnalysisSchema = {
  type: "object",
  additionalProperties: false,
  required: ["jackie", "dex", "nora", "milo"],
  properties: {
    jackie: {
      type: "object",
      additionalProperties: false,
      required: [
        "cleanSummary",
        "keyFacts",
        "missingInfo",
        "detectedTopics",
        "suggestedAgent",
      ],
      properties: {
        cleanSummary: { type: "string" },
        keyFacts: { type: "array", maxItems: 5, items: { type: "string" } },
        missingInfo: { type: "array", maxItems: 5, items: { type: "string" } },
        detectedTopics: { type: "array", maxItems: 5, items: { type: "string" } },
        suggestedAgent: { type: "string" },
      },
    },
    dex: {
      type: "object",
      additionalProperties: false,
      required: ["tags", "priority", "category", "crmNote", "nextSteps"],
      properties: {
        tags: { type: "array", maxItems: 6, items: { type: "string" } },
        priority: { type: "string" },
        category: { type: "string" },
        crmNote: { type: "string" },
        nextSteps: { type: "array", maxItems: 4, items: { type: "string" } },
      },
    },
    nora: {
      type: "object",
      additionalProperties: false,
      required: [
        "status",
        "profitabilitySignal",
        "riskLevel",
        "why",
        "questions",
      ],
      properties: {
        status: { type: "string" },
        profitabilitySignal: { type: "string" },
        riskLevel: { type: "string" },
        why: { type: "string" },
        questions: { type: "array", maxItems: 4, items: { type: "string" } },
      },
    },
    milo: {
      type: "object",
      additionalProperties: false,
      required: ["replies"],
      properties: {
        replies: {
          type: "object",
          additionalProperties: false,
          required: ["professional", "friendly", "short", "firmButPolite"],
          properties: {
            professional: { type: "string" },
            friendly: { type: "string" },
            short: { type: "string" },
            firmButPolite: { type: "string" },
          },
        },
      },
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

function parseConversationAnalysis(value: unknown): ConversationAnalysis {
  const analysis = readObject(value, "analysis");
  const jackie = readObject(analysis.jackie, "jackie");
  const dex = readObject(analysis.dex, "dex");
  const nora = readObject(analysis.nora, "nora");
  const milo = readObject(analysis.milo, "milo");
  const replies = readObject(milo.replies, "milo.replies");

  return {
    jackie: {
      cleanSummary: readAIString(jackie.cleanSummary, "jackie.cleanSummary"),
      keyFacts: readStringArray(jackie.keyFacts, "jackie.keyFacts"),
      missingInfo: readStringArray(jackie.missingInfo, "jackie.missingInfo"),
      detectedTopics: readStringArray(
        jackie.detectedTopics,
        "jackie.detectedTopics",
      ),
      suggestedAgent: readAIString(jackie.suggestedAgent, "jackie.suggestedAgent"),
    },
    dex: {
      tags: readStringArray(dex.tags, "dex.tags"),
      priority: readAIString(dex.priority, "dex.priority"),
      category: readAIString(dex.category, "dex.category"),
      crmNote: readAIString(dex.crmNote, "dex.crmNote"),
      nextSteps: readStringArray(dex.nextSteps, "dex.nextSteps"),
    },
    nora: {
      status: readAIString(nora.status, "nora.status"),
      profitabilitySignal: readAIString(
        nora.profitabilitySignal,
        "nora.profitabilitySignal",
      ),
      riskLevel: readAIString(nora.riskLevel, "nora.riskLevel"),
      why: readAIString(nora.why, "nora.why"),
      questions: readStringArray(nora.questions, "nora.questions"),
    },
    milo: {
      replies: {
        professional: readAIString(replies.professional, "milo.replies.professional"),
        friendly: readAIString(replies.friendly, "milo.replies.friendly"),
        short: readAIString(replies.short, "milo.replies.short"),
        firmButPolite: readAIString(
          replies.firmButPolite,
          "milo.replies.firmButPolite",
        ),
      },
    },
  };
}

export async function analyzeConversation(input: ConversationInput) {
  const timeout = withTimeout();

  try {
    const response = await getGeminiClient().models.generateContent({
      model: getModel(),
      contents: JSON.stringify(input),
      config: {
        abortSignal: timeout.signal,
        systemInstruction: `
You are the FlowCrew orchestrator. Analyze one raw client conversation through four specialist agents.

Rules:
- Return only the JSON object required by the schema.
- Write every user-facing field in ${input.language === "it" ? "Italian" : "English"}.
- Do not invent facts. When information is missing, say so clearly.
- Jackie cleans and structures the conversation.
- Dex adds tags, priority, category, CRM-style notes, and practical next steps.
- Nora evaluates opportunity, profitability signal, risk, and clarification questions.
- Milo drafts four replies: professional, friendly, short, and firm but polite.
- Never claim that a message was sent, a task was created, or a CRM was updated.
- Keep each list focused and concise. Return no more items than the schema allows.
`,
        temperature: 0.35,
        maxOutputTokens: 3_000,
        responseMimeType: "application/json",
        responseJsonSchema: conversationAnalysisSchema,
      },
    });

    if (!response.text) {
      throw new FlowCrewAIError(
        "empty_ai_response",
        502,
        "Gemini non ha restituito un'analisi valida. Riprova.",
      );
    }

    return parseConversationAnalysis(JSON.parse(response.text) as unknown);
  } catch (error) {
    throw normalizeAIError(error);
  } finally {
    timeout.clear();
  }
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
