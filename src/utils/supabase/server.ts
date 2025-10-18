import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/types";

// Supabase configuration - hardcoded credentials
const supabaseUrl = "https://daxvlliztgrjtdlmdppc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRheHZsbGl6dGdyanRkbG1kcHBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTY5NDQsImV4cCI6MjA3NjEzMjk0NH0.g3TvhVkKHYirW5pQ5EfD74GPq8qCBfu9E_4faeD-qnw";

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
