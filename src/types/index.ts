import type { Database } from '@/lib/supabase/types';

// Common types for all tables
export interface BaseRow {
  id: number
  created_at: string
  updated_at: string
}

// Tables types from Database
export type Tables = Database['public']['Tables']
export type OutletRow = Tables['outlets']['Row']
export type EmployeeRow = Tables['employees']['Row'] 
export type ProductRow = Tables['products']['Row']
export type IngredientRow = Tables['ingredients']['Row']
export type SaleRow = Tables['sales']['Row']
export type SupplierRow = Tables['suppliers']['Row']
export type PurchaseOrderRow = Tables['purchase_orders']['Row']
export type DistributionRow = Tables['distributions']['Row']
export type DailyChecklistRow = Tables['daily_checklists']['Row']
export type ShiftReportRow = Tables['shift_reports']['Row']
export type CandidateRow = Tables['candidates']['Row']
export type PromotionRow = Tables['promotions']['Row']
export type AssetRow = Tables['assets']['Row']
export type CashFlowRow = Tables['cash_flow']['Row']
export type UserRow = Tables['users']['Row']

// Enums
export type Role = 'AdminPusat' | 'AreaManager' | 'OutletManager' | 'Kasir' | 'HR' | 'Gudang' | 'Finance';
export type OutletStatus = 'Open' | 'Closed' | 'Renovation';
export type EmploymentStatus = 'Active' | 'Inactive';
export type IngredientStatus = 'Critical' | 'Low' | 'Normal';
export type PaymentMethod = 'Cash' | 'Debit' | 'Credit' | 'QRIS' | 'Ewallet';
export type PurchaseOrderStatus = 'Pending' | 'Approved' | 'Rejected';
export type DistributionStatus = 'Pending' | 'InTransit' | 'Delivered';
export type ShiftStatus = 'Open' | 'Closed';
export type CandidateStatus = 'Applied' | 'Interview' | 'Hired' | 'Rejected';
export type PromotionStatus = 'Active' | 'Upcoming' | 'Expired';
export type AssetStatus = 'InUse' | 'Maintenance' | 'Broken';
export type CashFlowType = 'Inflow' | 'Outflow';
export type DiscountType = 'Percentage' | 'Fixed';

// Input types
export interface PurchaseOrderItemInput {
  ingredientId: number
  quantity: number
  price: number
}

export interface SaleItemInput {
  productId: number
  quantity: number
  price: number
  notes?: string
}