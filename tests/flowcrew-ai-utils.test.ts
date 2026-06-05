import assert from "node:assert/strict";
import test from "node:test";

import {
  createRecoveredAgentReview,
  createRecoveredDexReview,
  createUnavailableAgentReview,
  createUnavailableDexReview,
  getErrorStatus,
  normalizePriority,
  normalizeStatus,
  normalizeTags,
  parseGeminiJsonObject,
  readOptionalStringArray,
  textToFindings,
  tryParseGeminiJson,
} from "../lib/flowcrew-ai-utils";
import type { ConversationInput } from "../lib/flowcrew-types";

const websiteQuoteInput = {
  clientName: "",
  sourceType: "whatsapp",
  messyMessage:
    "Ciao, ho visto il tuo profilo su Instagram e volevo chiederti un preventivo. Mi servirebbe un sito semplice ma professionale con pagina servizi, galleria immagini e modulo per essere contattata. Non ho ancora testi pronti, posso mandarti foto. Vorrei capire costo e tempi per averlo online entro fine mese.",
  businessType: "Freelance / piccolo team",
  goal: "Richiesta cliente, priorita, proposta, follow-up e task.",
  language: "it",
} satisfies ConversationInput;

test("tryParseGeminiJson parses fenced JSON", () => {
  assert.deepEqual(tryParseGeminiJson('```json\n{"message":"ok"}\n```'), {
    message: "ok",
  });
});

test("tryParseGeminiJson extracts JSON from surrounding text", () => {
  assert.deepEqual(tryParseGeminiJson('Sure:\n{"findings":["one"]}\nDone.'), {
    findings: ["one"],
  });
});

test("parseGeminiJsonObject repairs common trailing commas", () => {
  const parsed = parseGeminiJsonObject('{"message":"ok","findings":["one",],}');

  assert.equal(parsed.repaired, true);
  assert.deepEqual(parsed.object, {
    message: "ok",
    findings: ["one"],
  });
});

test("tryParseGeminiJson returns null for invalid content", () => {
  assert.equal(tryParseGeminiJson("not json"), null);
});

test("textToFindings turns bullet text into capped findings", () => {
  assert.deepEqual(
    textToFindings(
      "- Client needs a booking site\n* Budget is not confirmed\n1. Deadline is next month\n2. This extra finding should still fit\n3. Another useful finding\n4. This one is capped out",
    ),
    [
      "Client needs a booking site",
      "Budget is not confirmed",
      "Deadline is next month",
      "This extra finding should still fit",
      "Another useful finding",
    ],
  );
});

test("textToFindings splits plain paragraphs into sentences", () => {
  assert.deepEqual(
    textToFindings(
      "The client needs a quote today. Budget is missing. Timeline is flexible.",
    ),
    [
      "The client needs a quote today",
      "Budget is missing",
      "Timeline is flexible.",
    ],
  );
});

test("readOptionalStringArray ignores invalid values and applies maxItems", () => {
  assert.deepEqual(
    readOptionalStringArray(["  one  ", "", 2, "two", "three"], ["fallback"], {
      maxItems: 2,
    }),
    ["one", "two"],
  );
});

test("readOptionalStringArray returns fallback when no strings are usable", () => {
  assert.deepEqual(readOptionalStringArray([null, 2], ["fallback"]), [
    "fallback",
  ]);
});

test("getErrorStatus reads numeric and string status-like fields", () => {
  assert.equal(getErrorStatus({ status: 429 }), 429);
  assert.equal(getErrorStatus({ code: "503" }), 503);
  assert.equal(getErrorStatus({ code: "quota" }), null);
});

test("normalizers keep AI status and tags predictable", () => {
  assert.equal(normalizePriority("Urgente"), "high");
  assert.equal(normalizeStatus("Da qualificare"), "needs_qualification");
  assert.deepEqual(normalizeTags(["Lead Caldo", " sito_web ", "Lead Caldo"]), [
    "lead-caldo",
    "sito-web",
  ]);
  assert.deepEqual(normalizeTags("Preventivo, Urgente"), [
    "preventivo",
    "urgente",
  ]);
});

test("agent fallback keeps a useful review shape", () => {
  const review = createUnavailableAgentReview("Nora", "it", "timeout");

  assert.equal(review.message.includes("Nora"), true);
  assert.equal(review.findings.length, 3);
  assert.equal(review.findings[0], "Motivo: timeout");
});

test("recovered agent review avoids technical JSON copy", () => {
  const review = createRecoveredAgentReview("Milo", websiteQuoteInput, {
    warnings: ["recovered_agent_json", "Unexpected token"],
  });

  assert.equal(review.degraded, false);
  assert.equal(review.message.includes("JSON"), false);
  assert.equal(review.findings.some((finding) => finding.includes("preventivo")), true);
  assert.deepEqual(review.warnings, ["recovered_agent_json", "Unexpected token"]);
});

test("recovered Dex review creates ready-to-send replies", () => {
  const review = createRecoveredDexReview(websiteQuoteInput, {
    warnings: ["recovered_dex_json"],
  });

  assert.equal(review.degraded, false);
  assert.equal(review.message.includes("JSON"), false);
  assert.equal(review.suggestedReply.includes("preventivo"), true);
  assert.equal(review.replies.short.length > 30, true);
});

test("Dex fallback fills every reply variant", () => {
  const review = createUnavailableDexReview("en", "rate limited");

  assert.equal(review.suggestedReply.length > 20, true);
  assert.equal(review.replies.professional, review.suggestedReply);
  assert.equal(review.replies.firmButPolite, review.suggestedReply);
});
