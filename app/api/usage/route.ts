import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import { getPlanLimits, getUserPlan } from "@/lib/billing";
import { getUserLeadCount } from "@/lib/leads";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";

function jsonError(code: string, error: string, status: number) {
  return NextResponse.json({ error, code }, { status });
}

export async function GET(request: Request) {
  try {
    if (!isSupabaseAuthConfigured()) {
      return jsonError(
        "supabase_unconfigured",
        "Supabase is not configured: usage is unavailable.",
        503,
      );
    }

    const auth = await getAuthContext(request);

    if (!auth) {
      return jsonError(
        "auth_required",
        "Sign in to view your usage.",
        401,
      );
    }

    const plan = getUserPlan({
      userId: auth.user.id,
      email: auth.user.email ?? null,
    });
    const limits = getPlanLimits(plan);
    const used = await getUserLeadCount(auth);

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
      "Usage cannot be retrieved right now.",
      500,
    );
  }
}
