import { Database } from './types';
import { createClient } from '@supabase/supabase-js';

type Tables = Database['public']['Tables'];
type TableName = keyof Tables;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Table clients with strong typing
export const db = {
  // Outlets
  outlets: {
    create: async (data: Tables['outlets']['Insert']) => {
      const { data: result, error } = await supabase
        .from('outlets')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    update: async (id: number, data: Tables['outlets']['Update']) => {
      const { data: result, error } = await supabase
        .from('outlets')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    findMany: async (options?: {
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: 'asc' | 'desc';
    }) => {
      let query = supabase.from('outlets').select('*');

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

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    findUnique: async (id: number) => {
      const { data, error } = await supabase
        .from('outlets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Employees
  employees: {
    create: async (data: Tables['employees']['Insert']) => {
      const { data: result, error } = await supabase
        .from('employees')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    update: async (id: number, data: Tables['employees']['Update']) => {
      const { data: result, error } = await supabase
        .from('employees')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    findMany: async (options?: {
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: 'asc' | 'desc';
    }) => {
      let query = supabase.from('employees').select('*');

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

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    findUnique: async (id: number) => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Products
  products: {
    create: async (data: Tables['products']['Insert']) => {
      const { data: result, error } = await supabase
        .from('products')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    update: async (id: number, data: Tables['products']['Update']) => {
      const { data: result, error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    findMany: async (options?: {
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: 'asc' | 'desc';
    }) => {
      let query = supabase.from('products').select('*');

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

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    findUnique: async (id: number) => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  }

  // Add more table clients as needed...
};