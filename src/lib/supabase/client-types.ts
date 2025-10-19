import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import type { Database } from './types';

declare module '@supabase/supabase-js' {
  interface GenericSchema {
    Tables: Database['public']['Tables'];
  }
}

export type GenericTable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T];

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;