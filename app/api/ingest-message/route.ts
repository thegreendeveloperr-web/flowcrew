import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  analyzeConversation,
  FlowCrewAIError,
  logAIError,
  parseConversationInput,
} from "@/lib/flowcrew-ai";
import { createLeadFromAnalysis } from "@/lib/leads";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Accedi per salvare un lead nel tuo workspace." },
        { status: 401 },
      );
    }

    const input = parseConversationInput(await request.json());
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
