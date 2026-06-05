import { ApiError, GoogleGenAI, type Content } from "@google/genai";
import {
  conversationSourceValues,
  type ConversationAnalysis,
  type ConversationInput,
  type FlowCrewChatMessage,
  type FlowCrewLanguage,
} from "@/lib/flowcrew-types";
import {
  createRecoveredAgentReview,
  createRecoveredDexReview,
  createUnavailableDexReview,
  isRecord,
  normalizePriority,
  normalizeStatus,
  normalizeTags,
  normalizeTemperature,
  normalizeUrgency,
  parseGeminiJsonObject,
  readOptionalString,
  readOptionalStringArray,
  type AgentReviewResult,
  type DexReviewResult,
} from "./flowcrew-ai-utils";

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

function readString(
  value: unknown,
  field: string,
  options: { max: number; min?: number; required?: boolean },
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

  if (options.min && text.length > 0 && text.length < options.min) {
    throw new FlowCrewAIError(
      "invalid_request",
      400,
      `${field} deve contenere almeno ${options.min} caratteri utili.`,
    );
  }

  return text;
}

function textToFindings(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter(Boolean)
    .filter((line) => line.length > 12)
    .slice(0, 5);

  if (lines.length) return lines;

  const sentences = text
    .split(/[.!?]\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 12)
    .slice(0, 5);

  return sentences.length ? sentences : ["Analisi generata dall'agente."];
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return String(error);
}

function getErrorStatus(error: unknown) {
  if (!isRecord(error)) return null;

  const status = error.status ?? error.statusCode ?? error.code;

  if (typeof status === "number") return status;

  if (typeof status === "string") {
    const parsed = Number(status);
    if (Number.isFinite(parsed)) return parsed;
  }

  return null;
}

function getSafeErrorDetails(error: unknown) {
  if (!isRecord(error)) return undefined;

  return {
    name: typeof error.name === "string" ? error.name : undefined,
    code:
      typeof error.code === "string" || typeof error.code === "number"
        ? error.code
        : undefined,
    status: typeof error.status === "number" ? error.status : undefined,
    statusCode:
      typeof error.statusCode === "number" ? error.statusCode : undefined,
  };
}

function logRawGeminiError(stage: string, error: unknown) {
  console.error("Raw Gemini error before normalization", {
    stage,
    status: getErrorStatus(error),
    name: error instanceof Error ? error.name : typeof error,
    message: getErrorMessage(error),
    cause: error instanceof Error ? error.cause : undefined,
    details: getSafeErrorDetails(error),
  });
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
        min: 20,
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
      min: 20,
      required: true,
    }),
    businessType: readString(value.businessType, "Tipo attivita", { max: 160 }),
    goal: readString(value.goal, "Obiettivo", { max: 300 }),
    language: language as FlowCrewLanguage,
  };
}

type AgentReviewRequest = {
  input: ConversationInput;
  agentName: "Jackie" | "Milo" | "Nora";
  role: string;
  instruction: string;
};

function shouldSurfaceAIError(error: FlowCrewAIError) {
  return error.code === "missing_api_key" || error.code === "invalid_api_key";
}

function compactWarnings(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[]));
}

function readAgentReviewPayload(
  text: string,
  agentName: AgentReviewRequest["agentName"],
  input: ConversationInput,
): AgentReviewResult {
  const parsed = parseGeminiJsonObject(text);
  const warnings: string[] = [];

  if (parsed.repaired) warnings.push("json_repaired");

  if (!parsed.object) {
    return createRecoveredAgentReview(agentName, input, {
      fallbackReason: "recovered_agent_json",
      warnings: compactWarnings(["recovered_agent_json", parsed.error]),
    });
  }

  if (typeof parsed.object.message !== "string") warnings.push("message_fallback");
  if (!Array.isArray(parsed.object.findings)) warnings.push("findings_fallback");

  const message = readOptionalString(
    parsed.object.message,
    `${agentName} ha completato la revisione con dati parziali.`,
  );
  const findings = readOptionalStringArray(
    parsed.object.findings,
    textToFindings(message),
    { maxItems: 5 },
  );

  return {
    message,
    findings,
    degraded: false,
    fallbackReason: warnings.length ? "partial_agent_json" : undefined,
    warnings,
  };
}

function readDexReviewPayload(text: string, input: ConversationInput): DexReviewResult {
  const parsed = parseGeminiJsonObject(text);
  const warnings: string[] = [];
  const safeFallbackReply = createUnavailableDexReview(input.language).suggestedReply;

  if (parsed.repaired) warnings.push("json_repaired");

  if (!parsed.object) {
    return createRecoveredDexReview(input, {
      fallbackReason: "recovered_dex_json",
      warnings: compactWarnings(["recovered_dex_json", parsed.error]),
    });
  }

  if (typeof parsed.object.suggestedReply !== "string") warnings.push("suggested_reply_fallback");
  if (typeof parsed.object.professional !== "string") warnings.push("professional_reply_fallback");
  if (typeof parsed.object.friendly !== "string") warnings.push("friendly_reply_fallback");
  if (typeof parsed.object.short !== "string") warnings.push("short_reply_fallback");
  if (typeof parsed.object.firmButPolite !== "string") warnings.push("firm_reply_fallback");

  const suggestedReply = readOptionalString(
    parsed.object.suggestedReply,
    readOptionalString(parsed.object.professional, safeFallbackReply),
  );

  return {
    message: readOptionalString(
      parsed.object.message,
      "Dex ha preparato una risposta pronta da inviare.",
    ),
    suggestedReply,
    replies: {
      professional: readOptionalString(parsed.object.professional, suggestedReply),
      friendly: readOptionalString(parsed.object.friendly, suggestedReply),
      short: readOptionalString(parsed.object.short, suggestedReply),
      firmButPolite: readOptionalString(
        parsed.object.firmButPolite,
        suggestedReply,
      ),
    },
    degraded: false,
    fallbackReason: warnings.length ? "partial_dex_json" : undefined,
    warnings,
  };
}

async function runAgentReview({
  input,
  agentName,
  role,
  instruction,
}: AgentReviewRequest): Promise<AgentReviewResult> {
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

Return a useful analysis of the real client message.

Output contract:
Return only one valid JSON object, with no Markdown fences and no text before or after it:
{
  "message": "your short analysis",
  "findings": ["fact 1", "fact 2"]
}

Rules:
- Write in ${languageName}.
- Always return valid JSON matching the contract above.
- Do not invent facts, prices, deadlines, availability, or promises.
- If something is missing, say it clearly.
- Do not claim that you sent messages, created tasks, updated a CRM, or contacted anyone.
`,
        temperature: 0.35,
        maxOutputTokens: 900,
        responseMimeType: "application/json",
      },
    });

    if (!response.text?.trim()) {
      throw new FlowCrewAIError(
        "empty_ai_response",
        502,
        `${agentName} non ha restituito una risposta valida. Riprova.`,
      );
    }

    return readAgentReviewPayload(response.text, agentName, input);
  } catch (error) {
    logRawGeminiError(agentName, error);
    throw normalizeAIError(error);
  } finally {
    timeout.clear();
  }
}

async function runAgentReviewSafely(request: AgentReviewRequest) {
  try {
    return await runAgentReview(request);
  } catch (error) {
    const normalized = normalizeAIError(error);

    if (shouldSurfaceAIError(normalized)) {
      throw normalized;
    }

    console.warn("FlowCrew agent fallback used", {
      agent: request.agentName,
      code: normalized.code,
      status: normalized.status,
    });

    return createRecoveredAgentReview(request.agentName, request.input, {
      fallbackReason: normalized.code,
      warnings: [normalized.publicMessage],
    });
  }
}

async function runDexReview(input: ConversationInput): Promise<DexReviewResult> {
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

Output contract:
Return only one valid JSON object, with no Markdown fences and no text before or after it:
{
  "message": "short explanation",
  "suggestedReply": "best reply",
  "professional": "professional reply",
  "friendly": "friendly reply",
  "short": "short reply",
  "firmButPolite": "firm but polite reply"
}

Rules:
- Write in ${languageName}.
- Always return valid JSON matching the contract above.
- Keep replies natural, useful, and ready to send.
- Do not invent facts, prices, deadlines, availability, or promises.
- Do not claim that a message was sent.
`,
        temperature: 0.4,
        maxOutputTokens: 1_100,
        responseMimeType: "application/json",
      },
    });

    if (!response.text?.trim()) {
      throw new FlowCrewAIError(
        "empty_ai_response",
        502,
        "Dex non ha restituito una risposta valida. Riprova.",
      );
    }

    return readDexReviewPayload(response.text, input);
  } catch (error) {
    logRawGeminiError("Dex", error);
    throw normalizeAIError(error);
  } finally {
    timeout.clear();
  }
}

async function runDexReviewSafely(input: ConversationInput) {
  try {
    return await runDexReview(input);
  } catch (error) {
    const normalized = normalizeAIError(error);

    if (shouldSurfaceAIError(normalized)) {
      throw normalized;
    }

    console.warn("FlowCrew Dex fallback used", {
      code: normalized.code,
      status: normalized.status,
    });

    return createRecoveredDexReview(input, {
      fallbackReason: normalized.code,
      warnings: [normalized.publicMessage],
    });
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
  jackie: AgentReviewResult;
  milo: AgentReviewResult;
  nora: AgentReviewResult;
  dex: DexReviewResult;
}) {
  const timeout = withTimeout();
  const languageName = input.language === "it" ? "Italian" : "English";

  const fallback = {
    priority: "medium",
    temperature: "warm",
    nextAction:
      nora.findings[0] ||
      milo.findings[0] ||
      "Rispondi al cliente e chiedi i dettagli mancanti.",
    suggestedReply: dex.suggestedReply,
    risks: milo.findings.slice(0, 3),
    missingInfo: jackie.findings.slice(0, 3),
    explanation: "FlowCrew ha combinato i segnali degli agenti in un piano operativo.",
    tags: ["lead", "follow-up", "client-request"],
    category: "Richiesta cliente",
    status: "needs_qualification",
    crmNote: jackie.message,
    urgency: "medium",
    leadQuality: "needs_qualification",
    riskLevel: "medium",
    detectedTopics: jackie.findings.slice(0, 5),
    degraded: false,
    fallbackReason: undefined as string | undefined,
    warnings: [] as string[],
  };

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

Output contract:
Return only one valid JSON object, with no Markdown fences and no text before or after it:
{
  "priority": "low | medium | high",
  "temperature": "cold | warm | hot",
  "nextAction": "next action",
  "suggestedReply": "reply",
  "risks": ["risk"],
  "missingInfo": ["missing info"],
  "explanation": "short explanation",
  "tags": ["tag"],
  "category": "category",
  "status": "new | needs_qualification | waiting_reply | follow_up | qualified | closed",
  "crmNote": "crm note",
  "urgency": "low | medium | high",
  "leadQuality": "lead quality",
  "riskLevel": "low | medium | high",
  "detectedTopics": ["topic"]
}

Rules:
- Write in ${languageName}.
- Always return valid JSON matching the contract above.
- Be practical and concise.
- Do not invent facts, prices, deadlines, availability, or promises.
- Do not claim that actions were executed.
`,
        temperature: 0.3,
        maxOutputTokens: 1_200,
        responseMimeType: "application/json",
      },
    });

    if (!response.text?.trim()) {
      return {
        ...fallback,
        degraded: false,
        fallbackReason: "recovered_summary_empty",
        warnings: ["recovered_summary_empty"],
      };
    }

    const parsed = parseGeminiJsonObject(response.text);

    if (!parsed.object) {
      return {
        ...fallback,
        degraded: false,
        fallbackReason: "recovered_summary_json",
        warnings: compactWarnings(["recovered_summary_json", parsed.error]),
      };
    }

    const warnings = compactWarnings([
      parsed.repaired ? "json_repaired" : undefined,
      typeof parsed.object.priority !== "string" ? "priority_fallback" : undefined,
      typeof parsed.object.temperature !== "string" ? "temperature_fallback" : undefined,
      typeof parsed.object.nextAction !== "string" ? "next_action_fallback" : undefined,
      typeof parsed.object.suggestedReply !== "string" ? "suggested_reply_fallback" : undefined,
      Array.isArray(parsed.object.risks) ? undefined : "risks_fallback",
      Array.isArray(parsed.object.missingInfo) ? undefined : "missing_info_fallback",
      typeof parsed.object.status !== "string" ? "status_fallback" : undefined,
      Array.isArray(parsed.object.tags) ? undefined : "tags_fallback",
    ]);

    return {
      priority: normalizePriority(parsed.object.priority, fallback.priority),
      temperature: normalizeTemperature(parsed.object.temperature, fallback.temperature),
      nextAction: readOptionalString(parsed.object.nextAction, fallback.nextAction),
      suggestedReply: readOptionalString(
        parsed.object.suggestedReply,
        fallback.suggestedReply,
      ),
      risks: readOptionalStringArray(parsed.object.risks, fallback.risks, {
        maxItems: 3,
      }),
      missingInfo: readOptionalStringArray(
        parsed.object.missingInfo,
        fallback.missingInfo,
        { maxItems: 4 },
      ),
      explanation: readOptionalString(parsed.object.explanation, fallback.explanation),
      tags: normalizeTags(parsed.object.tags, fallback.tags),
      category: readOptionalString(parsed.object.category, fallback.category),
      status: normalizeStatus(parsed.object.status, fallback.status),
      crmNote: readOptionalString(parsed.object.crmNote, fallback.crmNote),
      urgency: normalizeUrgency(parsed.object.urgency, fallback.urgency),
      leadQuality: readOptionalString(parsed.object.leadQuality, fallback.leadQuality),
      riskLevel: normalizePriority(parsed.object.riskLevel, fallback.riskLevel),
      detectedTopics: readOptionalStringArray(
        parsed.object.detectedTopics,
        fallback.detectedTopics,
        { maxItems: 5 },
      ),
      degraded: false,
      fallbackReason: warnings.length ? "partial_summary_json" : undefined,
      warnings,
    };
  } catch (error) {
    logRawGeminiError("FlowCrew Summary", error);
    const normalized = normalizeAIError(error);

    if (shouldSurfaceAIError(normalized)) {
      throw normalized;
    }

    return {
      ...fallback,
      degraded: false,
      fallbackReason: normalized.code,
      warnings: [normalized.publicMessage],
    };
  } finally {
    timeout.clear();
  }
}

export async function analyzeConversation(input: ConversationInput) {
  const [jackie, milo, nora, dex] = await Promise.all([
    runAgentReviewSafely({
      input,
      agentName: "Jackie",
      role: "Lead extraction specialist",
      instruction: `
Extract the client's real request, service needed, urgency, budget hints, deadline, missing information, and lead quality.
Explain what the message really means in a clean way.
`,
    }),
    runAgentReviewSafely({
      input,
      agentName: "Milo",
      role: "Commercial strategist",
      instruction: `
Evaluate the commercial opportunity, conversion potential, priority, risks, and the best next commercial move.
Think like someone trying to turn this lead into a real client without sounding pushy.
`,
    }),
    runAgentReviewSafely({
      input,
      agentName: "Nora",
      role: "Task and follow-up manager",
      instruction: `
Extract practical tasks, follow-up actions, deadlines, calendar signals, clarification questions, and what the user should do next.
`,
    }),
    runDexReviewSafely(input),
  ]);

  const summary = await runFinalSummary({
    input,
    jackie,
    milo,
    nora,
    dex,
  });
  const agentHealth = [
    { name: "Jackie", review: jackie },
    { name: "Milo", review: milo },
    { name: "Nora", review: nora },
    { name: "Dex", review: dex },
    { name: "FlowCrew Summary", review: summary },
  ];
  const degradedAgents = agentHealth
    .filter(({ review }) => Boolean(review.degraded))
    .map(({ name }) => name);
  const warnings = agentHealth.flatMap(({ name, review }) =>
    (review.warnings ?? []).map((warning) => `${name}: ${warning}`),
  );

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
    analysisMeta: {
      status: degradedAgents.length ? "partial" : "complete",
      degraded: degradedAgents.length > 0,
      degradedAgents,
      warnings,
      model: getModel(),
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
    logRawGeminiError("FlowCrew Chat", error);
    throw normalizeAIError(error);
  } finally {
    timeout.clear();
  }
}

export function normalizeAIError(error: unknown) {
  if (error instanceof FlowCrewAIError) return error;

  const status = getErrorStatus(error);
  const message = getErrorMessage(error).toLowerCase();

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
        "Gemini e momentaneamente occupato o hai raggiunto il limite quota. Riprova tra poco.",
      );
    }

    if (error.status === 401 || error.status === 403) {
      return new FlowCrewAIError(
        "invalid_api_key",
        500,
        "Il motore AI non e configurato correttamente.",
      );
    }

    if (error.status === 400) {
      return new FlowCrewAIError(
        "bad_ai_request",
        502,
        "La richiesta inviata a Gemini non e valida. Controlla il terminale per il dettaglio tecnico.",
      );
    }
  }

  if (status === 429 || message.includes("quota") || message.includes("rate limit")) {
    return new FlowCrewAIError(
      "rate_limited",
      503,
      "Gemini e momentaneamente occupato o hai raggiunto il limite quota. Riprova tra poco.",
    );
  }

  if (
    status === 401 ||
    status === 403 ||
    message.includes("api key") ||
    message.includes("permission")
  ) {
    return new FlowCrewAIError(
      "invalid_api_key",
      500,
      "Il motore AI non e configurato correttamente.",
    );
  }

  if (status === 400 || message.includes("bad request")) {
    return new FlowCrewAIError(
      "bad_ai_request",
      502,
      "La richiesta inviata a Gemini non e valida. Controlla il terminale per il dettaglio tecnico.",
    );
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
    publicMessage: normalized.publicMessage,
    rawName: error instanceof Error ? error.name : typeof error,
    rawMessage: getErrorMessage(error),
    rawStatus: getErrorStatus(error),
    rawCause: error instanceof Error ? error.cause : undefined,
    rawDetails: getSafeErrorDetails(error),
  });
}
