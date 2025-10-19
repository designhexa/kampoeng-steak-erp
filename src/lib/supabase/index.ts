import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Type helpers
type Tables = Database['public']['Tables']
type TableName = keyof Tables
type Row<T extends TableName> = Tables[T]['Row']
type Insert<T extends TableName> = Tables[T]['Insert']
type Update<T extends TableName> = Tables[T]['Update']

// Create Supabase client
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Database helper class with proper type safety
class DatabaseClient {
  constructor(private client = supabase) {}

  // Insert new record
  async create<T extends TableName>(table: T, data: Insert<T>): Promise<Row<T>> {
    const { data: result, error } = await this.client
      .from(table)
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return result as Row<T>
  }

  // Update existing record
  async update<T extends TableName>(
    table: T,
    id: number,
    data: Update<T>
  ): Promise<Row<T>> {
    const { data: result, error } = await this.client
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return result as Row<T>
  }

  // Delete record
  async delete<T extends TableName>(table: T, id: number): Promise<void> {
    const { error } = await this.client.from(table).delete().eq('id', id)
    if (error) throw error
  }

  // Find single record
  async findUnique<T extends TableName>(
    table: T,
    id: number
  ): Promise<Row<T> | null> {
    const { data, error } = await this.client
      .from(table)
      .select()
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data as Row<T>
  }

  // Find multiple records
  async findMany<T extends TableName>(
    table: T,
    options?: {
      filter?: Partial<Row<T>>
      orderBy?: keyof Row<T>
      orderDirection?: 'asc' | 'desc'
      limit?: number
    }
  ): Promise<Row<T>[]> {
    let query = this.client.from(table).select()

    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy as string, {
        ascending: options?.orderDirection === 'asc'
      })
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) throw error
    return data as Row<T>[]
  }

  // Advanced query using raw client
  get raw() {
    return this.client
  }
}

// Export singleton instance
export const db = new DatabaseClient()