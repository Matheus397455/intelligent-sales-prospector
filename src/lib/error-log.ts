import { supabase } from "@/integrations/supabase/client";

/** Persists a safe, user-scoped error entry. Never pass secrets in context. */
export async function logAppError(source: string, error: unknown, context: Record<string, unknown> = {}) {
  const message = error instanceof Error ? error.message : String(error);
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;
    await supabase.from("app_error_logs").insert({ source, message: message.slice(0, 1000), context: context as never });
  } catch {
    // logging must never throw
  }
}
