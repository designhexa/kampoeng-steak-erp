// Database types for TypeScript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      outlets: {
        Row: {
          id: number
          name: string
          area: string
          address: string
          status: 'Open' | 'Closed' | 'Renovation'
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          area: string
          address: string
          status?: 'Open' | 'Closed' | 'Renovation'
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          area?: string
          address?: string
          status?: 'Open' | 'Closed' | 'Renovation'
          created_at?: string
        }
      }
      employees: {
        Row: {
          id: number
          name: string
          outlet_id: number
          position: string
          salary: number
          status: 'Active' | 'Inactive'
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          outlet_id: number
          position: string
          salary: number
          status?: 'Active' | 'Inactive'
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          outlet_id?: number
          position?: string
          salary?: number
          status?: 'Active' | 'Inactive'
          created_at?: string
        }
      }
      products: {
        Row: {
          id: number
          name: string
          category: string
          price: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          category: string
          price: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          category?: string
          price?: number
          created_at?: string
        }
      }
      ingredients: {
        Row: {
          id: number
          name: string
          outlet_id: number
          stock: number
          unit: string
          min_stock: number
          status: 'Critical' | 'Low' | 'Normal'
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          outlet_id: number
          stock: number
          unit: string
          min_stock: number
          status?: 'Critical' | 'Low' | 'Normal'
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          outlet_id?: number
          stock?: number
          unit?: string
          min_stock?: number
          status?: 'Critical' | 'Low' | 'Normal'
          created_at?: string
        }
      }
      sales: {
        Row: {
          id: number
          outlet_id: number
          total: number
          payment_method: 'Cash' | 'Debit' | 'Credit' | 'QRIS' | 'Ewallet'
          created_at: string
        }
        Insert: {
          id?: number
          outlet_id: number
          total: number
          payment_method: 'Cash' | 'Debit' | 'Credit' | 'QRIS' | 'Ewallet'
          created_at?: string
        }
        Update: {
          id?: number
          outlet_id?: number
          total?: number
          payment_method?: 'Cash' | 'Debit' | 'Credit' | 'QRIS' | 'Ewallet'
          created_at?: string
        }
      }
      suppliers: {
        Row: {
          id: number
          name: string
          contact: string
          rating: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          contact: string
          rating: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          contact?: string
          rating?: number
          created_at?: string
        }
      }
      purchase_orders: {
        Row: {
          id: number
          outlet_id: number
          supplier_id: number
          total: number
          status: 'Pending' | 'Approved' | 'Rejected'
          created_at: string
        }
        Insert: {
          id?: number
          outlet_id: number
          supplier_id: number
          total: number
          status?: 'Pending' | 'Approved' | 'Rejected'
          created_at?: string
        }
        Update: {
          id?: number
          outlet_id?: number
          supplier_id?: number
          total?: number
          status?: 'Pending' | 'Approved' | 'Rejected'
          created_at?: string
        }
      }
      distributions: {
        Row: {
          id: number
          from_outlet_id: number
          to_outlet_id: number
          ingredient_name: string
          quantity: number
          status: 'Pending' | 'InTransit' | 'Delivered'
          created_at: string
        }
        Insert: {
          id?: number
          from_outlet_id: number
          to_outlet_id: number
          ingredient_name: string
          quantity: number
          status?: 'Pending' | 'InTransit' | 'Delivered'
          created_at?: string
        }
        Update: {
          id?: number
          from_outlet_id?: number
          to_outlet_id?: number
          ingredient_name?: string
          quantity?: number
          status?: 'Pending' | 'InTransit' | 'Delivered'
          created_at?: string
        }
      }
      daily_checklists: {
        Row: {
          id: number
          outlet_id: number
          task: string
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: number
          outlet_id: number
          task: string
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          outlet_id?: number
          task?: string
          completed?: boolean
          created_at?: string
        }
      }
      shift_reports: {
        Row: {
          id: number
          outlet_id: number
          employee_name: string
          shift_start: string
          initial_cash: number
          status: 'Open' | 'Closed'
          created_at: string
        }
        Insert: {
          id?: number
          outlet_id: number
          employee_name: string
          shift_start: string
          initial_cash: number
          status?: 'Open' | 'Closed'
          created_at?: string
        }
        Update: {
          id?: number
          outlet_id?: number
          employee_name?: string
          shift_start?: string
          initial_cash?: number
          status?: 'Open' | 'Closed'
          created_at?: string
        }
      }
      candidates: {
        Row: {
          id: number
          name: string
          position: string
          outlet_id: number
          status: 'Applied' | 'Interview' | 'Hired' | 'Rejected'
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          position: string
          outlet_id: number
          status?: 'Applied' | 'Interview' | 'Hired' | 'Rejected'
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          position?: string
          outlet_id?: number
          status?: 'Applied' | 'Interview' | 'Hired' | 'Rejected'
          created_at?: string
        }
      }
      promotions: {
        Row: {
          id: number
          name: string
          discount_type: 'Percentage' | 'Fixed'
          discount_value: number
          start_date: string
          end_date: string
          status: 'Active' | 'Upcoming' | 'Expired'
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          discount_type: 'Percentage' | 'Fixed'
          discount_value: number
          start_date: string
          end_date: string
          status?: 'Active' | 'Upcoming' | 'Expired'
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          discount_type?: 'Percentage' | 'Fixed'
          discount_value?: number
          start_date?: string
          end_date?: string
          status?: 'Active' | 'Upcoming' | 'Expired'
          created_at?: string
        }
      }
      assets: {
        Row: {
          id: number
          name: string
          outlet_id: number
          status: 'InUse' | 'Maintenance' | 'Broken'
          last_maintenance: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          outlet_id: number
          status?: 'InUse' | 'Maintenance' | 'Broken'
          last_maintenance: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          outlet_id?: number
          status?: 'InUse' | 'Maintenance' | 'Broken'
          last_maintenance?: string
          created_at?: string
        }
      }
      cash_flow: {
        Row: {
          id: number
          outlet_id: number
          type: 'Inflow' | 'Outflow'
          category: string
          amount: number
          description: string
          created_at: string
        }
        Insert: {
          id?: number
          outlet_id: number
          type: 'Inflow' | 'Outflow'
          category: string
          amount: number
          description: string
          created_at?: string
        }
        Update: {
          id?: number
          outlet_id?: number
          type?: 'Inflow' | 'Outflow'
          category?: string
          amount?: number
          description?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: number
          name: string
          email: string
          role: 'AdminPusat' | 'AreaManager' | 'OutletManager' | 'Kasir' | 'HR' | 'Gudang' | 'Finance'
          outlet_id: number | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          role: 'AdminPusat' | 'AreaManager' | 'OutletManager' | 'Kasir' | 'HR' | 'Gudang' | 'Finance'
          outlet_id?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          role?: 'AdminPusat' | 'AreaManager' | 'OutletManager' | 'Kasir' | 'HR' | 'Gudang' | 'Finance'
          outlet_id?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
