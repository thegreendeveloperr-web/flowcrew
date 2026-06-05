import type { ConversationInput, FlowCrewLanguage } from "./flowcrew-types";

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

type RecoveryOptions = {
  fallbackReason?: string;
  warnings?: string[];
  degraded?: boolean;
};

const sourceLabels: Record<ConversationInput["sourceType"], string> = {
  import: "import",
  whatsapp: "WhatsApp",
  gmail: "Gmail",
  instagram: "DM",
  email: "email",
  notes: "notes",
  other: "message",
};

function compactSnippet(text: string, max = 190) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trim()}...`;
}

function hasAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function buildDetectedRequest(input: ConversationInput) {
  const text = input.messyMessage.toLowerCase();

  if (hasAny(text, ["sito", "website", "pagina servizi", "galleria", "modulo"])) {
    return input.language === "it"
      ? "un sito semplice e professionale con pagine, contenuti e contatto da definire"
      : "a simple professional website with pages, content, and contact flow to define";
  }

  if (hasAny(text, ["preventivo", "quote", "proposal", "quanto costa", "costo"])) {
    return input.language === "it"
      ? "un preventivo con scope e tempi da chiarire"
      : "a quote with scope and timeline to clarify";
  }

  return input.language === "it"
    ? "una richiesta cliente da qualificare"
    : "a client request to qualify";
}

function buildLeadSignals(input: ConversationInput) {
  const text = input.messyMessage.toLowerCase();
  const request = buildDetectedRequest(input);
  const source = sourceLabels[input.sourceType] ?? input.sourceType;
  const findings: string[] = [];

  if (input.language === "it") {
    findings.push(`Richiesta principale: ${request}.`);

    if (hasAny(text, ["preventivo", "quanto costa", "costo", "prezzo", "budget"])) {
      findings.push("Il cliente chiede costo indicativo o preventivo.");
    }

    if (hasAny(text, ["entro fine mese", "fine mese", "tempo", "tempistiche", "quando", "online entro", "scadenza"])) {
      findings.push("C'e una scadenza o un timing da confermare.");
    }

    if (hasAny(text, ["testi", "foto", "immagini", "galleria", "materiali", "contenuti"])) {
      findings.push("Materiali e contenuti non sono ancora completamente pronti.");
    }

    findings.push(`Canale: ${source}. Estratto: "${compactSnippet(input.messyMessage)}"`);

    return Array.from(new Set(findings)).slice(0, 5);
  }

  findings.push(`Main request: ${request}.`);

  if (hasAny(text, ["quote", "cost", "price", "budget", "proposal"])) {
    findings.push("The client is asking for indicative cost or a quote.");
  }

  if (hasAny(text, ["end of month", "timeline", "timing", "when", "deadline", "online by"])) {
    findings.push("There is a deadline or timing signal to confirm.");
  }

  if (hasAny(text, ["copy", "texts", "photos", "images", "gallery", "assets", "content"])) {
    findings.push("Materials and content are not fully ready yet.");
  }

  findings.push(`Source: ${source}. Excerpt: "${compactSnippet(input.messyMessage)}"`);

  return Array.from(new Set(findings)).slice(0, 5);
}

export function createRecoveredAgentReview(
  agentName: "Jackie" | "Milo" | "Nora",
  input: ConversationInput,
  options: RecoveryOptions = {},
): AgentReviewResult {
  const signals = buildLeadSignals(input);
  const fallbackReason = options.fallbackReason ?? "recovered_agent_json";
  const warnings = options.warnings?.length ? options.warnings : [fallbackReason];

  if (input.language === "it") {
    if (agentName === "Milo") {
      return {
        message:
          "Milo suggerisce una risposta con stima preliminare, domande di qualifica e prossimo step chiaro.",
        findings: [
          "Opportunita concreta: il cliente chiede un preventivo e tempistiche.",
          "Priorita medio-alta se la scadenza entro fine mese e reale.",
          "Rischio: scope, materiali, contenuti e budget non sono ancora definiti.",
          "Mossa successiva: chiedere dettagli essenziali e proporre una breve call o mini-brief.",
          ...signals,
        ].slice(0, 5),
        degraded: options.degraded ?? false,
        fallbackReason,
        warnings,
      };
    }

    if (agentName === "Nora") {
      return {
        message:
          "Nora converte la richiesta in azioni: chiarire scope, materiali, tempi e dati mancanti.",
        findings: [
          "Confermare pagine richieste, obiettivo del sito e priorita.",
          "Chiedere foto, esempi, testi disponibili e tono desiderato.",
          "Verificare la scadenza di fine mese prima di promettere tempi.",
          "Preparare una stima solo dopo i dettagli minimi di scope.",
          ...signals,
        ].slice(0, 5),
        degraded: options.degraded ?? false,
        fallbackReason,
        warnings,
      };
    }

    return {
      message:
        "Jackie ha isolato richiesta, dettagli disponibili e informazioni mancanti dal messaggio.",
      findings: signals,
      degraded: options.degraded ?? false,
      fallbackReason,
      warnings,
    };
  }

  if (agentName === "Milo") {
    return {
      message:
        "Milo recommends replying with an initial estimate path, qualification questions, and a clear next step.",
      findings: [
        "Concrete opportunity: the client is asking for a quote and timeline.",
        "Priority is medium-high if the end-of-month deadline is real.",
        "Risk: scope, materials, content, and budget are not fully defined.",
        "Next move: ask for essential details and suggest a short call or mini brief.",
        ...signals,
      ].slice(0, 5),
      degraded: options.degraded ?? false,
      fallbackReason,
      warnings,
    };
  }

  if (agentName === "Nora") {
    return {
      message:
        "Nora turns the request into actions: clarify scope, materials, timing, and missing details.",
      findings: [
        "Confirm requested pages, website goal, and priority.",
        "Ask for photos, examples, available copy, and preferred tone.",
        "Verify the deadline before promising timing.",
        "Prepare an estimate only after the minimum scope details are clear.",
        ...signals,
      ].slice(0, 5),
      degraded: options.degraded ?? false,
      fallbackReason,
      warnings,
    };
  }

  return {
    message:
      "Jackie isolated the request, available details, and missing information from the message.",
    findings: signals,
    degraded: options.degraded ?? false,
    fallbackReason,
    warnings,
  };
}

export function createRecoveredDexReview(
  input: ConversationInput,
  options: RecoveryOptions = {},
): DexReviewResult {
  const fallbackReason = options.fallbackReason ?? "recovered_dex_json";
  const warnings = options.warnings?.length ? options.warnings : [fallbackReason];
  const suggestedReply =
    input.language === "it"
      ? "Ciao, grazie per avermi scritto. Posso aiutarti volentieri: per darti un preventivo sensato mi servirebbero alcuni dettagli in piu su attivita, pagine da includere, materiali gia disponibili e obiettivo della scadenza. Se vuoi, facciamo un breve mini-brief e poi ti mando un range di costo e tempi realistici."
      : "Hi, thanks for reaching out. I can help with this. To give you a useful quote, I would need a few more details about the business, pages needed, available materials, and the deadline goal. If you want, we can do a short mini brief and I will send a realistic cost and timeline range.";

  return {
    message:
      input.language === "it"
        ? "Dex ha preparato una risposta prudente e pronta da adattare."
        : "Dex prepared a cautious reply ready to adapt.",
    suggestedReply,
    replies: {
      professional: suggestedReply,
      friendly:
        input.language === "it"
          ? "Ciao! Grazie per il messaggio, il progetto sembra chiaro come direzione. Per stimare bene costo e tempi mi servirebbero solo alcuni dettagli: attivita, pagine, materiali disponibili e deadline. Ti va se facciamo un mini-brief veloce e poi ti mando una proposta realistica?"
          : "Hi! Thanks for the message, the direction sounds clear. To estimate cost and timing properly, I just need a few details: business, pages, available materials, and deadline. Want to do a quick mini brief and I will send a realistic proposal?",
      short:
        input.language === "it"
          ? "Ciao, grazie! Posso aiutarti. Mandami qualche dettaglio su attivita, pagine, materiali e deadline: poi ti preparo range di costo e tempi."
          : "Hi, thanks! I can help. Send me a few details on business, pages, materials, and deadline, then I will prepare a cost and timing range.",
      firmButPolite:
        input.language === "it"
          ? "Ciao, grazie per la richiesta. Prima di indicare costo e tempi ho bisogno di confermare scope, materiali disponibili e scadenza. Con questi dettagli posso prepararti una stima seria e realistica."
          : "Hi, thanks for the request. Before giving cost and timing, I need to confirm scope, available materials, and deadline. With those details I can prepare a serious, realistic estimate.",
    },
    degraded: options.degraded ?? false,
    fallbackReason,
    warnings,
  };
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
