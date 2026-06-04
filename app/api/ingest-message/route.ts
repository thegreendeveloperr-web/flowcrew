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

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Accedi per analizzare il tuo lead gratuito." },
        { status: 401 },
      );
    }

    const input = parseConversationInput(await request.json());

    const plan = getUserPlan(user.id);
    const limits = getPlanLimits(plan);
    const existingLeadCount = await getUserLeadCount(user.id);

    if (existingLeadCount >= limits.maxLeads) {
      return NextResponse.json(
        {
          error:
            plan === "free"
              ? "Hai già usato il lead gratuito. Sblocca FlowCrew Pro per analizzare altri lead e salvare lo storico clienti."
              : "Hai raggiunto il limite del tuo piano. Contattaci per aumentare il limite.",
          code: "plan_limit_reached",
          plan,
          limit: limits.maxLeads,
          used: existingLeadCount,
        },
        { status: 402 },
      );
    }

    const analysis = await analyzeConversation(input);
    const lead = await createLeadFromAnalysis(input, analysis, user.id);

    return NextResponse.json({
      analysis,
      lead,
      usage: {
        plan,
        used: existingLeadCount + 1,
        limit: limits.maxLeads,
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

    return NextResponse.json(
      { error: normalized.publicMessage },
      { status: normalized.status },
    );
  }
}