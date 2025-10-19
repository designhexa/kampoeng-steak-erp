// Import enums
import { 
  EmploymentStatus,
  CandidateStatus,
  DiscountType,
  AssetStatus,
  TransferStatus,
  PromotionStatus
} from '@/types/common';

export type Database = {
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
          stock: number
          unit: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          stock: number
          unit: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          stock?: number
          unit?: string
          created_at?: string
        }
      }
      sales: {
        Row: {
          id: number
          outlet_id: number
          total: number
          created_at: string
        }
        Insert: {
          id?: number
          outlet_id: number
          total: number
          created_at?: string
        }
        Update: {
          id?: number
          outlet_id?: number
          total?: number
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
          supplier_id: number
          status: 'Pending' | 'Approved' | 'Rejected'
          total: number
          created_at: string
        }
        Insert: {
          id?: number
          supplier_id: number
          status?: 'Pending' | 'Approved' | 'Rejected'
          total: number
          created_at?: string
        }
        Update: {
          id?: number
          supplier_id?: number
          status?: 'Pending' | 'Approved' | 'Rejected'
          total?: number
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
          status: 'Rejected' | 'Applied' | 'Interview' | 'Hired'
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          position: string
          outlet_id: number
          status?: 'Rejected' | 'Applied' | 'Interview' | 'Hired'
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          position?: string
          outlet_id?: number
          status?: 'Rejected' | 'Applied' | 'Interview' | 'Hired'
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
  }
}