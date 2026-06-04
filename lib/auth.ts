import { createClient } from "@/lib/supabase/server";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";

export async function getSessionUser() {
  if (!isSupabaseAuthConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("FlowCrew auth getUser failed", { message: error.message });
    return null;
  }

  return user;
}
