import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthContext } from "@/lib/auth";
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
      "Invalid JSON request. Check the submitted body.",
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!isSupabaseAuthConfigured()) {
      return jsonError(
        "supabase_unconfigured",
        "Supabase is not configured, so FlowCrew cannot authenticate or save leads.",
        503,
      );
    }

    const auth = await getAuthContext(request);

    if (!auth) {
      return jsonError(
        "auth_required",
        "Sign in or send a valid Supabase token to analyze a lead.",
        401,
      );
    }

    const input = parseConversationInput(await readJsonBody(request));

    const plan = getUserPlan({
      userId: auth.user.id,
      email: auth.user.email ?? null,
    });
    const limits = getPlanLimits(plan);
    const existingLeadCount = await getUserLeadCount(auth);

    if (existingLeadCount >= limits.maxLeads) {
      return jsonError(
        "plan_limit_reached",
        plan === "free"
          ? "Your free lead has already been used. Request Pro access to keep analyzing client messages and saving lead history."
          : "Your workspace has reached this plan's lead limit. Contact FlowCrew to increase the limit.",
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
    const lead = await createLeadFromAnalysis(input, analysis, auth);
    const usedLeadCount = existingLeadCount + 1;
    const leadUrl = `/leads/${lead.id}`;

    revalidatePath("/dashboard");
    revalidatePath("/leads");

    return NextResponse.json(
      {
        analysis,
        lead,
        leadUrl,
        usage: {
          plan,
          used: usedLeadCount,
          limit: limits.maxLeads,
          remaining: Math.max(limits.maxLeads - usedLeadCount, 0),
          label: limits.label,
        },
      },
      {
        status: 201,
        headers: {
          Location: leadUrl,
        },
      },
    );
  } catch (error) {
    const normalized =
      error instanceof FlowCrewAIError
        ? error
        : new FlowCrewAIError(
            "ingest_failed",
            500,
            "FlowCrew cannot analyze and save the lead right now.",
          );

    if (normalized.status >= 500) logAIError(error);

    return jsonError(
      normalized.code,
      normalized.publicMessage,
      normalized.status,
    );
  }
}
