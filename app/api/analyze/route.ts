import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";
import {
  analyzeConversation,
  FlowCrewAIError,
  logAIError,
  parseConversationInput,
} from "@/lib/flowcrew-ai";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";

function jsonError(code: string, error: string, status: number) {
  return NextResponse.json({ error, code }, { status });
}

export async function POST(request: Request) {
  try {
    if (!isSupabaseAuthConfigured()) {
      return jsonError(
        "supabase_unconfigured",
        "Supabase non e configurato: non posso autenticare la richiesta.",
        503,
      );
    }

    const auth = await getAuthContext(request);

    if (!auth) {
      return jsonError(
        "auth_required",
        "Accedi o invia un token Supabase valido per analizzare il messaggio.",
        401,
      );
    }

    const input = parseConversationInput(await request.json());
    const analysis = await analyzeConversation(input);

    return NextResponse.json({ analysis });
  } catch (error) {
    const normalized =
      error instanceof FlowCrewAIError
        ? error
        : new FlowCrewAIError("invalid_request", 400, "Richiesta non valida.");

    if (normalized.status >= 500) logAIError(error);

    return jsonError(normalized.code, normalized.publicMessage, normalized.status);
  }
}
