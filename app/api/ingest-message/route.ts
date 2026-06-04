import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  analyzeConversation,
  FlowCrewAIError,
  logAIError,
  parseConversationInput,
} from "@/lib/flowcrew-ai";
import { createLeadFromAnalysis, getUserLeadCount } from "@/lib/leads";

const freeTrialLeadLimit = 1;

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

    const existingLeadCount = await getUserLeadCount(user.id);

    if (existingLeadCount >= freeTrialLeadLimit) {
      return NextResponse.json(
        {
          error:
            "Hai già usato il lead gratuito. Sblocca FlowCrew Pro per analizzare altri lead e salvare lo storico clienti.",
          code: "free_trial_used",
        },
        { status: 402 },
      );
    }

    const analysis = await analyzeConversation(input);
    const lead = await createLeadFromAnalysis(input, analysis, user.id);

    return NextResponse.json({ analysis, lead });
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