import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase-admin";
import type { ConversationAnalysis, ConversationInput } from "@/lib/flowcrew-types";

export type StoredLead = {
  id: string;
  source: string;
  sender_name: string | null;
  sender_contact: string | null;
  raw_message: string;
  summary: string | null;
  request: string | null;
  urgency: string | null;
  tags: string[] | null;
  suggested_reply: string | null;
  next_action: string | null;
  follow_up: string | null;
  owner_agent: string | null;
  status: string;
  created_at: string;
};

type NewLeadRow = Omit<StoredLead, "id" | "created_at">;

function compactText(values: Array<string | undefined>) {
  return values.map((value) => value?.trim()).filter(Boolean).join(" · ");
}

export function analysisToLeadRow(input: ConversationInput, analysis: ConversationAnalysis): NewLeadRow {
  const primaryRequest =
    analysis.dex.category ||
    analysis.jackie.detectedTopics.at(0) ||
    analysis.jackie.keyFacts.at(0) ||
    "Client request";

  const nextAction = analysis.dex.nextSteps.at(0) || analysis.jackie.missingInfo.at(0) || "Review lead";
  const followUp = compactText(analysis.dex.nextSteps.slice(1));

  return {
    source: input.sourceType,
    sender_name: input.clientName || "Unknown lead",
    sender_contact: null,
    raw_message: input.messyMessage,
    summary: analysis.jackie.cleanSummary,
    request: primaryRequest,
    urgency: analysis.dex.priority,
    tags: analysis.dex.tags,
    suggested_reply: analysis.milo.replies.professional,
    next_action: nextAction,
    follow_up: followUp || analysis.nora.questions.at(0) || null,
    owner_agent: analysis.jackie.suggestedAgent || "Jackie",
    status: analysis.nora.status || "new",
  };
}

export async function createLeadFromAnalysis(input: ConversationInput, analysis: ConversationAnalysis) {
  const row = analysisToLeadRow(input, analysis);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("leads")
    .insert(row)
    .select("*")
    .single<StoredLead>();

  if (error) {
    console.error("FlowCrew lead insert failed", {
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    throw new Error("Could not save lead in Supabase.");
  }

  return data;
}

export async function getStoredLeads(limit = 30) {
  if (!isSupabaseConfigured()) return [] as StoredLead[];

  const { data, error } = await getSupabaseAdmin()
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<StoredLead[]>();

  if (error) {
    console.error("FlowCrew lead read failed", {
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    return [] as StoredLead[];
  }

  return data ?? [];
}

export function scoreLead(lead: Pick<StoredLead, "urgency" | "tags" | "summary">) {
  const text = `${lead.urgency ?? ""} ${(lead.tags ?? []).join(" ")} ${lead.summary ?? ""}`.toLowerCase();
  let score = 62;

  if (text.includes("alta") || text.includes("high") || text.includes("urgent")) score += 22;
  if (text.includes("budget") || text.includes("preventivo") || text.includes("quote")) score += 8;
  if (text.includes("call") || text.includes("domani") || text.includes("tomorrow")) score += 6;

  return Math.min(score, 98);
}

export function getLeadDisplayName(lead: StoredLead) {
  return lead.sender_name || lead.sender_contact || "Unknown lead";
}
