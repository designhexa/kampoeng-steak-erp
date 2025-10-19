export type SupabasePurchaseOrderStatus = 'Pending' | 'Approved' | 'Rejected';
export type SupabaseDistributionStatus = 'Pending' | 'InTransit' | 'Delivered';
export type SupabaseInventoryStatus = 'Critical' | 'Low' | 'Normal';

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

export type Tables = {
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
};