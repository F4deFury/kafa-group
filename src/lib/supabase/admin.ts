import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only admin client using the Supabase service role key.
 * NEVER import this into a Client Component or expose SUPABASE_SERVICE_ROLE_KEY
 * with the NEXT_PUBLIC_ prefix. This must only be used inside Server Actions
 * or Route Handlers that have already verified the caller is an admin.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it as a server-only environment variable in Vercel (Settings → Environment Variables) — get the value from Supabase Dashboard → Project Settings → API → service_role key."
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
