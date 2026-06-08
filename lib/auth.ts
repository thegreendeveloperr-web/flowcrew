import {
  createClient as createSupabaseClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseAuthConfigured,
} from "@/lib/supabase/env";

export type AuthContext = {
  user: User;
  supabase: SupabaseClient;
};

function readBearerToken(request?: Request) {
  const authorization = request?.headers.get("authorization");

  if (!authorization) return undefined;

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function createBearerClient(accessToken: string) {
  return createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

export async function getAuthContext(request?: Request): Promise<AuthContext | null> {
  if (!isSupabaseAuthConfigured()) {
    return null;
  }

  const bearerToken = readBearerToken(request);

  if (bearerToken === null) {
    return null;
  }

  const supabase = bearerToken
    ? createBearerClient(bearerToken)
    : await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(bearerToken);

  if (error) {
    if (!error.message.toLowerCase().includes("session missing")) {
      console.error("FlowCrew auth getUser failed", { message: error.message });
    }

    return null;
  }

  return user ? { user, supabase } : null;
}

export async function getSessionUser() {
  return (await getAuthContext())?.user ?? null;
}
