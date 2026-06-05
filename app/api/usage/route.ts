import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getPlanLimits, getUserPlan } from "@/lib/billing";
import { getUserLeadCount } from "@/lib/leads";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";

function jsonError(code: string, error: string, status: number) {
  return NextResponse.json({ error, code }, { status });
}

export async function GET() {
  try {
    if (!isSupabaseAuthConfigured()) {
      return jsonError(
        "supabase_unconfigured",
        "Supabase non e configurato: utilizzo non disponibile.",
        503,
      );
    }

    const user = await getSessionUser();

    if (!user) {
      return jsonError(
        "auth_required",
        "Accedi per vedere il tuo utilizzo.",
        401,
      );
    }

    const plan = getUserPlan(user.id);
    const limits = getPlanLimits(plan);
    const used = await getUserLeadCount(user.id);

    return NextResponse.json({
      plan,
      used,
      limit: limits.maxLeads,
      remaining: Math.max(limits.maxLeads - used, 0),
      label: limits.label,
    });
  } catch (error) {
    console.error("FlowCrew usage lookup failed", {
      message: error instanceof Error ? error.message : String(error),
    });

    return jsonError(
      "usage_unavailable",
      "Non riesco a recuperare l'utilizzo in questo momento.",
      500,
    );
  }
}
