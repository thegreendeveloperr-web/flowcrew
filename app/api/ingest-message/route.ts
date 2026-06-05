import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getPlanLimits, getUserPlan } from "@/lib/billing";
import {
  analyzeConversation,
  FlowCrewAIError,
  logAIError,
  parseConversationInput,
} from "@/lib/flowcrew-ai";
import { createLeadFromAnalysis, getUserLeadCount } from "@/lib/leads";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";

function jsonError(
  code: string,
  error: string,
  status: number,
  extra: Record<string, unknown> = {},
) {
  return NextResponse.json({ error, code, ...extra }, { status });
}

async function readJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new FlowCrewAIError(
      "invalid_json",
      400,
      "Richiesta JSON non valida. Controlla il body inviato.",
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isSupabaseAuthConfigured()) {
      return jsonError(
        "supabase_unconfigured",
        "Supabase non e configurato: non posso autenticare o salvare lead.",
        503,
      );
    }

    const user = await getSessionUser();

    if (!user) {
      return jsonError(
        "auth_required",
        "Accedi per analizzare il tuo lead gratuito.",
        401,
      );
    }

    const input = parseConversationInput(await readJsonBody(request));

    const plan = getUserPlan(user.id);
    const limits = getPlanLimits(plan);
    const existingLeadCount = await getUserLeadCount(user.id);

    if (existingLeadCount >= limits.maxLeads) {
      return jsonError(
        "plan_limit_reached",
        plan === "free"
          ? "Hai gia usato il lead gratuito. Richiedi accesso Pro per analizzare altri lead e salvare lo storico clienti."
          : "Hai raggiunto il limite del tuo piano. Contattaci per aumentare il limite.",
        403,
        {
          plan,
          limit: limits.maxLeads,
          used: existingLeadCount,
          remaining: 0,
          label: limits.label,
        },
      );
    }

    const analysis = await analyzeConversation(input);
    const lead = await createLeadFromAnalysis(input, analysis, user.id);
    const usedLeadCount = existingLeadCount + 1;

    return NextResponse.json({
      analysis,
      lead,
      usage: {
        plan,
        used: usedLeadCount,
        limit: limits.maxLeads,
        remaining: Math.max(limits.maxLeads - usedLeadCount, 0),
        label: limits.label,
      },
    });
  } catch (error) {
    const normalized =
      error instanceof FlowCrewAIError
        ? error
        : new FlowCrewAIError(
            "ingest_failed",
            500,
            "Non riesco ad analizzare e salvare il lead in questo momento.",
          );

    if (normalized.status >= 500) logAIError(error);

    return jsonError(
      normalized.code,
      normalized.publicMessage,
      normalized.status,
    );
  }
}
