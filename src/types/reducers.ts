import type {
  __Timestamp,
  ReducerEventContext,
  DiscountType,
  PromotionStatus,
  AssetStatus,
  CandidateStatus,
  EmploymentStatus,
  OutletStatus,
  PaymentMethod,
  UserRole
} from './common';

import type { PurchaseOrderItemInput, SaleItemInput } from './inputs';

export interface RemoteReducers {
  createPromotion(
    name: string,
    discountType: DiscountType,
    discountValue: bigint,
    startDate: __Timestamp,
    endDate: __Timestamp,
    status: PromotionStatus
  ): void;

  onCreatePromotion(
    callback: (
      ctx: ReducerEventContext,
      name: string,
      discountType: DiscountType,
      discountValue: bigint,
      startDate: __Timestamp,
      endDate: __Timestamp,
      status: PromotionStatus
    ) => void
  ): void;

  createPurchaseOrder(
    outletId: bigint,
    supplierId: bigint,
    total: bigint,
    date: __Timestamp,
    items: PurchaseOrderItemInput[]
  ): void;

  updateAssetStatus(
    assetId: bigint,
    status: AssetStatus,
    lastMaintenance: __Timestamp
  ): void;

  updateCandidateStatus(
    candidateId: bigint,
    status: CandidateStatus
  ): void;

  updateEmployeeStatus(
    employeeId: bigint,
    status: EmploymentStatus
  ): void;

  updateOutlet(
    id: bigint,
    name: string,
    area: string,
    address: string,
    status: OutletStatus
  ): void;

  recordSale(
    outletId: bigint,
    items: SaleItemInput[],
    paymentMethod: PaymentMethod,
    date: __Timestamp
  ): void;

  createUser(
    username: string,
    role: UserRole,
    outletId?: bigint
  ): void;
}