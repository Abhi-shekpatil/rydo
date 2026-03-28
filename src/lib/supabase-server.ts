import { createClient } from "@supabase/supabase-js";

// Service role key bypasses RLS — never expose to the browser.
// Used only in API routes and server components.
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
