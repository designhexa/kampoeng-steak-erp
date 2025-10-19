// Base types
export type __Timestamp = Date | string;
export type CallReducerFlags = 'FullUpdate' | 'NoUpdate';
export interface BinaryWriter {
  write(data: Uint8Array): void;
  flush(): void;
}

export type { 
  DbConnection,
  DbConnectionImpl,
  DbConnectionBuilder,
  ClientCache,
  SubscriptionBuilder,
  SubscriptionBuilderImpl
} from './spacetime';

// Enums
export enum OutletStatus {
  Open = 'Open',
  Closed = 'Closed',
  Renovation = 'Renovation',
  UnderMaintenance = 'Under Maintenance'
}

export enum EmploymentStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Terminated = 'Terminated',
  OnLeave = 'On Leave'
}

export enum CandidateStatus {
  Applied = 'Applied',
  Interview = 'Interview',
  Hired = 'Hired',
  Rejected = 'Rejected'
}

export enum AssetStatus {
  InUse = 'InUse',
  Maintenance = 'Maintenance',
  Broken = 'Broken'
}

export enum TransferStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum DiscountType {
  Percentage = 'Percentage',
  Amount = 'Amount'
}

export enum UserRole {
  AdminPusat = 'AdminPusat',
  AreaManager = 'AreaManager',
  OutletManager = 'OutletManager',
  Kasir = 'Kasir',
  Staff = 'Staff'
}

export enum PaymentMethod {
  Cash = 'Cash',
  Card = 'Card',
  Transfer = 'Transfer'
}

export enum PromotionStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Expired = 'Expired'
}

// Context types
export interface EventContext {
  timestamp: __Timestamp;
  userId?: string;
}

export interface ReducerEventContext extends EventContext {
  reducerName: string;
}