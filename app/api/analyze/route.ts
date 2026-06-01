import { NextResponse } from "next/server";
import {
  analyzeConversation,
  FlowCrewAIError,
  logAIError,
  parseConversationInput,
} from "@/lib/flowcrew-ai";

export async function POST(request: Request) {
  try {
    const input = parseConversationInput(await request.json());
    const analysis = await analyzeConversation(input);

    return NextResponse.json({ analysis });
  } catch (error) {
    const normalized =
      error instanceof FlowCrewAIError
        ? error
        : new FlowCrewAIError("invalid_request", 400, "Richiesta non valida.");

    if (normalized.status >= 500) logAIError(error);

    return NextResponse.json(
      { error: normalized.publicMessage },
      { status: normalized.status },
    );
  }
}
