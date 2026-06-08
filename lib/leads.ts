import type { PostgrestError } from "@supabase/supabase-js";
import type { AuthContext } from "@/lib/auth";
import type { ConversationAnalysis, ConversationInput } from "@/lib/flowcrew-types";

export type StoredLead = {
  id: string;
  user_id: string;
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
  return values.map((value) => value?.trim()).filter(Boolean).join(" / ");
}

function throwLeadDataError(operation: string, error: PostgrestError): never {
  console.error(`FlowCrew lead ${operation} failed`, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });

  throw new Error(`Could not ${operation} leads in Supabase.`);
}

export function analysisToLeadRow(
  input: ConversationInput,
  analysis: ConversationAnalysis,
  userId: string,
): NewLeadRow {
  const primaryRequest =
    analysis.dex.category ||
    analysis.jackie.detectedTopics.at(0) ||
    analysis.jackie.keyFacts.at(0) ||
    "Client request";

  const nextAction =
    analysis.nora.nextSteps.at(0) ||
    analysis.jackie.missingInfo.at(0) ||
    "Review lead";

  const followUp =
    analysis.milo.followUp || compactText(analysis.nora.nextSteps.slice(1));

  return {
    user_id: userId,
    source: input.sourceType,
    sender_name: input.clientName || "Lead senza nome",
    sender_contact: null,
    raw_message: input.messyMessage,
    summary: analysis.jackie.cleanSummary,
    request: primaryRequest,
    urgency: analysis.nora.urgency || analysis.dex.priority,
    tags: analysis.dex.tags,
    suggested_reply: analysis.milo.replies.professional,
    next_action: nextAction,
    follow_up: followUp || analysis.nora.questions.at(0) || null,
    owner_agent: analysis.jackie.suggestedAgent || "Jackie",
    status: analysis.dex.status || "new",
  };
}

export async function getUserLeadCount({ user, supabase }: AuthContext) {
  const { count, error } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    throwLeadDataError("count", error);
  }

  return count ?? 0;
}

export async function createLeadFromAnalysis(
  input: ConversationInput,
  analysis: ConversationAnalysis,
  auth: AuthContext,
) {
  const row = analysisToLeadRow(input, analysis, auth.user.id);

  const { data, error } = await auth.supabase
    .from("leads")
    .insert(row)
    .select("*")
    .single<StoredLead>();

  if (error) {
    throwLeadDataError("save", error);
  }

  return data;
}

export async function getStoredLeads(
  { user, supabase }: AuthContext,
  limit = 30,
) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<StoredLead[]>();

  if (error) {
    throwLeadDataError("read", error);
  }

  return data ?? [];
}

export async function getStoredLeadById(
  { user, supabase }: AuthContext,
  leadId: string,
) {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user.id)
    .eq("id", leadId)
    .maybeSingle<StoredLead>();

  if (error) {
    throwLeadDataError("read", error);
  }

  return data;
}

export async function getLeadDashboardMetrics({
  user,
  supabase,
}: AuthContext) {
  const baseCount = () =>
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

  const [totalResult, repliesResult, followUpsResult, urgentResult] =
    await Promise.all([
      baseCount(),
      baseCount().not("suggested_reply", "is", null),
      baseCount().or("next_action.not.is.null,follow_up.not.is.null"),
      baseCount().in("urgency", ["high", "alta", "urgent", "urgente"]),
    ]);

  for (const result of [
    totalResult,
    repliesResult,
    followUpsResult,
    urgentResult,
  ]) {
    if (result.error) {
      throwLeadDataError("count", result.error);
    }
  }

  return {
    total: totalResult.count ?? 0,
    replies: repliesResult.count ?? 0,
    followUps: followUpsResult.count ?? 0,
    urgent: urgentResult.count ?? 0,
  };
}

export function scoreLead(
  lead: Pick<StoredLead, "urgency" | "tags" | "summary">,
) {
  const text =
    `${lead.urgency ?? ""} ${(lead.tags ?? []).join(" ")} ${lead.summary ?? ""}`.toLowerCase();
  let score = 62;

  if (
    text.includes("alta") ||
    text.includes("high") ||
    text.includes("urgent")
  ) {
    score += 22;
  }
  if (
    text.includes("budget") ||
    text.includes("preventivo") ||
    text.includes("quote")
  ) {
    score += 8;
  }
  if (
    text.includes("call") ||
    text.includes("domani") ||
    text.includes("tomorrow")
  ) {
    score += 6;
  }

  return Math.min(score, 98);
}

export function getLeadDisplayName(lead: StoredLead) {
  return lead.sender_name || lead.sender_contact || "Lead senza nome";
}
