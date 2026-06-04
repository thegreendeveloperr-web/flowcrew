import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getPlanLimits, getUserPlan } from "@/lib/billing";
import { getUserLeadCount } from "@/lib/leads";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Accedi per vedere il tuo utilizzo." },
        { status: 401 },
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
  } catch {
    return NextResponse.json(
      { error: "Non riesco a recuperare l'utilizzo in questo momento." },
      { status: 500 },
    );
  }
}