import { Database } from './types';
import { supabase } from './typed-client';
import { PostgrestError } from '@supabase/supabase-js';

type Tables = Database['public']['Tables'];

export async function insertData<T extends keyof Tables>(
  table: T,
  data: Tables[T]['Insert']
): Promise<{
  data: Tables[T]['Row'] | null;
  error: PostgrestError | null;
}> {
  return await supabase
    .from(table)
    .insert([data])
    .select()
    .single();
}

export async function updateData<T extends keyof Tables>(
  table: T,
  data: Tables[T]['Update'],
  id: number
): Promise<{
  data: Tables[T]['Row'] | null;
  error: PostgrestError | null;
}> {
  return await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single();
}

export async function fetchData<T extends keyof Tables>(
  table: T,
  options?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }
): Promise<{
  data: Tables[T]['Row'][] | null;
  error: PostgrestError | null;
}> {
  let query = supabase
    .from(table)
    .select();

  if (options?.orderBy) {
    query = query.order(options.orderBy, {
      ascending: options.orderDirection === 'asc'
    });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 10) - 1
    );
  }

  return await query;