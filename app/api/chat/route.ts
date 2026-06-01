import { NextResponse } from "next/server";
import {
  chatWithFlowCrew,
  FlowCrewAIError,
  logAIError,
  parseChatRequest,
} from "@/lib/flowcrew-ai";

export async function POST(request: Request) {
  try {
    const { messages, language } = parseChatRequest(await request.json());
    const reply = await chatWithFlowCrew(messages, language);

    return NextResponse.json({ reply });
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
