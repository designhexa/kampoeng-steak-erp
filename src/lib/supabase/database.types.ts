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
          description: string
          price: number
          category: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          price: number
          category: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          price?: number
          category?: string
          image_url?: string | null
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