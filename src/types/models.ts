import {
  __Timestamp,
  OutletStatus,
  EmploymentStatus,
  CandidateStatus,
  AssetStatus,
  TransferStatus,
  DiscountType,
  UserRole,
  PaymentMethod,
  PromotionStatus
} from './common';

export interface Asset {
  id: bigint;
  name: string;
  type: string;
  status: AssetStatus;
  last_maintenance: __Timestamp;
  outlet_id: bigint;
}

export interface Candidate {
  id: bigint;
  name: string;
  email: string;
  position: string;
  status: CandidateStatus;
  applied_date: __Timestamp;
}

export interface CashFlow {
  id: bigint;
  outlet_id: bigint;
  type: 'Income' | 'Expense';
  amount: bigint;
  category: string;
  description: string;
  date: __Timestamp;
}

export interface DailyChecklist {
  id: bigint;
  outlet_id: bigint;
  date: __Timestamp;
  completed: boolean;
  notes: string;
}

export interface Distribution {
  id: bigint;
  from_outlet_id: bigint;
  to_outlet_id: bigint;
  ingredient_id: bigint;
  quantity: bigint;
  status: TransferStatus;
  date: __Timestamp;
}

export interface Employee {
  id: bigint;
  name: string;
  position: string;
  outlet_id: bigint;
  salary: bigint;
  status: EmploymentStatus;
  join_date: __Timestamp;
}

export interface Ingredient {
  id: bigint;
  name: string;
  unit: string;
  stock: bigint;
  min_stock: bigint;
  outlet_id: bigint;
}

export interface Outlet {
  id: bigint;
  name: string;
  area: string;
  address: string;
  status: OutletStatus;
}

export interface Product {
  id: bigint;
  name: string;
  price: bigint;
  category: string;
  description: string;
}

export interface Promotion {
  id: bigint;
  name: string;
  discount_type: DiscountType;
  discount_value: bigint;
  start_date: __Timestamp;
  end_date: __Timestamp;
  status: string;
}

export interface PurchaseOrderItem {
  id: bigint;
  po_id: bigint;
  ingredient_id: bigint;
  quantity: bigint;
  price: bigint;
}

export interface PurchaseOrder {
  id: bigint;
  outlet_id: bigint;
  supplier_id: bigint;
  total: bigint;
  status: string;
  date: __Timestamp;
}

export interface SaleItem {
  id: bigint;
  sale_id: bigint;
  product_id: bigint;
  quantity: bigint;
  price: bigint;
}

export interface Sale {
  id: bigint;
  outlet_id: bigint;
  total: bigint;
  payment_method: string;
  date: __Timestamp;
}

export interface ShiftReport {
  id: bigint;
  outlet_id: bigint;
  employee_id: bigint;
  shift_start: __Timestamp;
  shift_end: __Timestamp | null;
  initial_cash: bigint;
  final_cash: bigint | null;
  notes: string;
}

export interface Supplier {
  id: bigint;
  name: string;
  contact: string;
  address: string;
  status: string;
}