import type { Database } from '../lib/supabase/types'

// Common types for all tables
export interface BaseRow {
  id: number
  created_at: string
  updated_at: string
}

// Tables types
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
export enum OutletStatus {
  Open = 'Open',
  Closed = 'Closed',
  Maintenance = 'Maintenance'
}

export enum EmploymentStatus {
  Active = 'Active', 
  Inactive = 'Inactive',
  Leave = 'Leave'
}

export enum CandidateStatus {
  Applied = 'Applied',
  Reviewing = 'Reviewing',
  Interviewed = 'Interviewed',
  Accepted = 'Accepted',
  Rejected = 'Rejected'
}

export enum AssetStatus {
  Active = 'Active',
  InMaintenance = 'InMaintenance',
  Retired = 'Retired'
}

export enum TransferStatus {
  Pending = 'Pending',
  InTransit = 'InTransit',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export enum DiscountType {
  Percentage = 'Percentage',
  FixedAmount = 'FixedAmount'
}

export enum PaymentMethod {
  Cash = 'Cash',
  Card = 'Card',
  QRIS = 'QRIS'
}

export enum PromotionStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Expired = 'Expired'
}

export enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager',
  Staff = 'Staff'
}

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