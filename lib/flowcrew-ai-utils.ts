import type { FlowCrewLanguage } from "./flowcrew-types";

export type AgentReviewResult = {
  message: string;
  findings: string[];
  degraded?: boolean;
  fallbackReason?: string;
  warnings?: string[];
};

export type DexReviewResult = {
  message: string;
  suggestedReply: string;
  replies: {
    professional: string;
    friendly: string;
    short: string;
    firmButPolite: string;
  };
  degraded?: boolean;
  fallbackReason?: string;
  warnings?: string[];
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function readOptionalString(value: unknown, fallback: string) {
  if (typeof value === "string" && value.trim()) return value.trim();
  return fallback;
}

export function readOptionalStringArray(
  value: unknown,
  fallback: string[],
  options: { maxItems?: number } = {},
) {
  if (!Array.isArray(value)) return fallback;

  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!items.length) return fallback;

  return typeof options.maxItems === "number"
    ? items.slice(0, options.maxItems)
    : items;
}

export type GeminiJsonParseResult = {
  value: unknown | null;
  repaired: boolean;
  source: "direct" | "extracted" | "repaired" | "none";
  error?: string;
};

function stripMarkdownFence(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

function extractBalancedJson(text: string) {
  const start = text.search(/[\[{]/);

  if (start < 0) return null;

  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{" || char === "[") {
      stack.push(char === "{" ? "}" : "]");
      continue;
    }

    if (char === "}" || char === "]") {
      const expected = stack.pop();

      if (expected !== char) return null;
      if (!stack.length) return text.slice(start, index + 1);
    }
  }

  return null;
}

function repairCommonJsonIssues(text: string) {
  return text.replace(/,\s*([}\]])/g, "$1");
}

function parseJsonCandidate(candidate: string, source: GeminiJsonParseResult["source"]) {
  try {
    return {
      value: JSON.parse(candidate) as unknown,
      repaired: false,
      source,
    } satisfies GeminiJsonParseResult;
  } catch (error) {
    const repaired = repairCommonJsonIssues(candidate);

    if (repaired !== candidate) {
      try {
        return {
          value: JSON.parse(repaired) as unknown,
          repaired: true,
          source: "repaired",
        } satisfies GeminiJsonParseResult;
      } catch {
        // Fall through to the original parse error below.
      }
    }

    return {
      value: null,
      repaired: false,
      source: "none",
      error: error instanceof Error ? error.message : "JSON parse failed",
    } satisfies GeminiJsonParseResult;
  }
}

export function parseGeminiJson(text: string): GeminiJsonParseResult {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const direct = parseJsonCandidate(cleaned, "direct");
  if (direct.value !== null) return direct;

  const stripped = stripMarkdownFence(text);
  if (stripped !== cleaned) {
    const fenced = parseJsonCandidate(stripped, "direct");
    if (fenced.value !== null) return fenced;
  }

  const extracted = extractBalancedJson(cleaned);
  if (extracted) {
    const parsed = parseJsonCandidate(extracted, "extracted");
    if (parsed.value !== null) return parsed;
    return parsed;
  }

  return direct;
}

export function tryParseGeminiJson(text: string) {
  return parseGeminiJson(text).value;
}

export function parseGeminiJsonObject(text: string) {
  const parsed = parseGeminiJson(text);

  return {
    ...parsed,
    object: isRecord(parsed.value) ? parsed.value : null,
  };
}

export function textToFindings(text: string) {
  const hasListShape = /\r?\n|^\s*(?:[-*]|\u2022|\d+[.)])\s+/.test(text);
  const lines = text
    .split(/\r?\n/)
    .map((line) =>
      line.replace(/^\s*(?:[-*]|\u2022|\d+[.)])\s+/, "").trim(),
    )
    .filter(Boolean)
    .filter((line) => line.length > 12)
    .slice(0, 5);

  if (hasListShape && lines.length) return lines;

  const sentences = text
    .split(/[.!?]\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 12)
    .slice(0, 5);

  if (sentences.length) return sentences;
  return lines.length ? lines : ["Analisi generata dall'agente."];
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return String(error);
}

export function getErrorStatus(error: unknown) {
  if (!isRecord(error)) return null;

  const status = error.status ?? error.statusCode ?? error.code;

  if (typeof status === "number") return status;

  if (typeof status === "string") {
    const parsed = Number(status);
    if (Number.isFinite(parsed)) return parsed;
  }

  return null;
}

export function getSafeErrorDetails(error: unknown) {
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

function normalizeLooseToken(value: unknown) {
  return typeof value === "string"
    ? value.trim().toLowerCase().replace(/[\s_]+/g, "-")
    : "";
}

export function normalizePriority(value: unknown, fallback = "medium") {
  const normalized = normalizeLooseToken(value);

  if (["high", "alta", "alto", "urgent", "urgente", "hot", "caldo"].includes(normalized)) {
    return "high";
  }

  if (["low", "bassa", "basso", "cold", "freddo"].includes(normalized)) {
    return "low";
  }

  if (["medium", "media", "medio", "warm", "tiepido"].includes(normalized)) {
    return "medium";
  }

  return fallback;
}

export function normalizeTemperature(value: unknown, fallback = "warm") {
  const normalized = normalizeLooseToken(value);

  if (["hot", "caldo", "alta", "high"].includes(normalized)) return "hot";
  if (["cold", "freddo", "bassa", "low"].includes(normalized)) return "cold";
  if (["warm", "tiepido", "medium", "media"].includes(normalized)) return "warm";

  return fallback;
}

export function normalizeUrgency(value: unknown, fallback = "medium") {
  return normalizePriority(value, fallback);
}

export function normalizeStatus(value: unknown, fallback = "needs_qualification") {
  const normalized = normalizeLooseToken(value);

  if (["new", "nuovo", "nuova"].includes(normalized)) return "new";
  if (["follow-up", "followup", "follow_up", "ricontatto"].includes(normalized)) return "follow_up";
  if (["waiting-reply", "waiting_reply", "da-rispondere", "reply-needed"].includes(normalized)) return "waiting_reply";
  if (["qualified", "qualificato", "qualificata"].includes(normalized)) return "qualified";
  if (["closed", "chiuso", "chiusa"].includes(normalized)) return "closed";
  if (["needs-qualification", "da-qualificare", "qualifica"].includes(normalized)) {
    return "needs_qualification";
  }

  return fallback;
}

export function normalizeTags(value: unknown, fallback: string[] = ["lead"]) {
  const raw =
    typeof value === "string"
      ? value.split(",")
      : Array.isArray(value)
        ? value
        : fallback;
  const tags = raw
    .filter((item): item is string => typeof item === "string")
    .map((item) =>
      item
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, "-")
        .replace(/[^\p{L}\p{N}-]+/gu, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, ""),
    )
    .filter(Boolean);

  return Array.from(new Set(tags)).slice(0, 6);
}

export function createUnavailableAgentReview(
  agentName: "Jackie" | "Milo" | "Nora",
  language: FlowCrewLanguage,
  reason?: string,
): AgentReviewResult {
  if (language === "it") {
    return {
      message: `${agentName} non e riuscito a completare la revisione AI. Uso un fallback prudente.`,
      findings: [
        reason ? `Motivo: ${reason}` : "Revisione AI non disponibile.",
        "Verifica manualmente richiesta, urgenza e informazioni mancanti.",
        "Rispondi al cliente senza promettere dettagli non confermati.",
      ],
      degraded: true,
      fallbackReason: reason ?? "agent_unavailable",
      warnings: [reason ?? "agent_unavailable"],
    };
  }

  return {
    message: `${agentName} could not complete the AI review. Using a cautious fallback.`,
    findings: [
      reason ? `Reason: ${reason}` : "AI review unavailable.",
      "Manually verify the request, urgency, and missing information.",
      "Reply without promising details that are not confirmed.",
    ],
    degraded: true,
    fallbackReason: reason ?? "agent_unavailable",
    warnings: [reason ?? "agent_unavailable"],
  };
}

export function createUnavailableDexReview(
  language: FlowCrewLanguage,
  reason?: string,
): DexReviewResult {
  const suggestedReply =
    language === "it"
      ? "Grazie per il messaggio. Per aiutarti meglio, puoi confermarmi i dettagli principali e l'urgenza? Ti rispondo con una proposta chiara appena ho queste informazioni."
      : "Thanks for the message. To help you properly, could you confirm the key details and urgency? I will reply with a clear proposal as soon as I have that information.";

  return {
    message:
      language === "it"
        ? `Dex non e riuscito a generare le varianti AI. ${reason ?? "Uso una risposta prudente."}`
        : `Dex could not generate AI reply variants. ${reason ?? "Using a cautious reply."}`,
    suggestedReply,
    replies: {
      professional: suggestedReply,
      friendly: suggestedReply,
      short: suggestedReply,
      firmButPolite: suggestedReply,
    },
    degraded: true,
    fallbackReason: reason ?? "dex_unavailable",
    warnings: [reason ?? "dex_unavailable"],
  };
}
