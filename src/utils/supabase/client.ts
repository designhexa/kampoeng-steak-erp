import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

// Supabase configuration - hardcoded credentials
const supabaseUrl = "https://daxvlliztgrjtdlmdppc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRheHZsbGl6dGdyanRkbG1kcHBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NTY5NDQsImV4cCI6MjA3NjEzMjk0NH0.g3TvhVkKHYirW5pQ5EfD74GPq8qCBfu9E_4faeD-qnw";

// Lazy initialization to avoid build-time errors
let supabaseInstance: SupabaseClient<Database> | null = null;

function getSupabaseClient(): SupabaseClient<Database> {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Create the Supabase client
  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });

  return supabaseInstance;
}

// Export a proxy that lazily initializes the client
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(target, prop) {
    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient<Database>];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return true; // Always configured with hardcoded credentials
};
