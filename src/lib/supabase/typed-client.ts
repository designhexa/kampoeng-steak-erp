import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import type { Tables } from './db.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export function createTypedClient() {
  return createClient<{ public: Tables }>(supabaseUrl, supabaseKey);
}