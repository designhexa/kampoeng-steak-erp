export type SupabasePurchaseOrderStatus = 'Pending' | 'Approved' | 'Rejected';
export type SupabaseDistributionStatus = 'Pending' | 'InTransit' | 'Delivered';
export type SupabaseInventoryStatus = 'Critical' | 'Low' | 'Normal';
export type SupabasePaymentMethod = 'Cash' | 'Debit' | 'Credit' | 'QRIS' | 'Ewallet';

export interface SupabaseSale {
  id: number;
  outlet_id: number;
  cashier_name: string;
  total: number;
  payment_method: SupabasePaymentMethod;
  created_at: string;
}

export interface SupabasePurchaseOrder {
  id: number;
  outlet_id: number;
  supplier_id: number;
  total: number;
  status: SupabasePurchaseOrderStatus;
  created_at: string;
}

export interface SupabaseDistribution {
  id: number;
  from_outlet_id: number;
  to_outlet_id: number;
  ingredient_name: string;
  quantity: number;
  status: SupabaseDistributionStatus;
  created_at: string;
}

export interface SupabaseIngredient {
  id: number;
  outlet_id: number;
  name: string;
  stock: number;
  unit: string;
  min_stock: number;
  status: SupabaseInventoryStatus;
  created_at: string;
}

export interface SupabaseOutlet {
  id: number;
  name: string;
  address: string;
  created_at: string;
}

export interface SupabaseSupplier {
  id: number;
  name: string;
  contact: string;
  created_at: string;
}

export interface Tables {
  sales: {
    Row: SupabaseSale;
    Insert: Omit<SupabaseSale, 'id' | 'created_at'>;
    Update: Partial<Omit<SupabaseSale, 'id' | 'created_at'>>;
  };
  purchase_orders: {
    Row: SupabasePurchaseOrder;
    Insert: Omit<SupabasePurchaseOrder, 'id' | 'created_at'>;
    Update: Partial<Omit<SupabasePurchaseOrder, 'id' | 'created_at'>>;
  };
  distributions: {
    Row: SupabaseDistribution;
    Insert: Omit<SupabaseDistribution, 'id' | 'created_at'>;
    Update: Partial<Omit<SupabaseDistribution, 'id' | 'created_at'>>;
  };
  ingredients: {
    Row: SupabaseIngredient;
    Insert: Omit<SupabaseIngredient, 'id' | 'created_at'>;
    Update: Partial<Omit<SupabaseIngredient, 'id' | 'created_at'>>;
  };
  outlets: {
    Row: SupabaseOutlet;
    Insert: Omit<SupabaseOutlet, 'id' | 'created_at'>;
    Update: Partial<Omit<SupabaseOutlet, 'id' | 'created_at'>>;
  };
  suppliers: {
    Row: SupabaseSupplier;
    Insert: Omit<SupabaseSupplier, 'id' | 'created_at'>;
    Update: Partial<Omit<SupabaseSupplier, 'id' | 'created_at'>>;
  };
}

export interface Database {
  public: {
    Tables: Tables;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}