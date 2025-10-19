import { 
  Asset, 
  Candidate,
  CashFlow,
  DailyChecklist,
  Distribution,
  Employee,
  Ingredient,
  Outlet,
  Product,
  Promotion,
  PurchaseOrder,
  PurchaseOrderItem,
  Sale,
  SaleItem,
  ShiftReport,
  Supplier
} from './models';
import { User } from './auth';

export class AssetsTableHandle {
  constructor(private table: Asset[]) {}
}

export class CandidatesTableHandle {
  constructor(private table: Candidate[]) {}
}

export class CashFlowTableHandle {
  constructor(private table: CashFlow[]) {}
}

export class DailyChecklistsTableHandle {
  constructor(private table: DailyChecklist[]) {}
}

export class DistributionsTableHandle {
  constructor(private table: Distribution[]) {}
}

export class EmployeesTableHandle {
  constructor(private table: Employee[]) {}
}

export class IngredientsTableHandle {
  constructor(private table: Ingredient[]) {}
}

export class OutletsTableHandle {
  constructor(private table: Outlet[]) {}
}

export class ProductsTableHandle {
  constructor(private table: Product[]) {}
}

export class PromotionsTableHandle {
  constructor(private table: Promotion[]) {}
}

export class PurchaseOrderItemsTableHandle {
  constructor(private table: PurchaseOrderItem[]) {}
}

export class PurchaseOrdersTableHandle {
  constructor(private table: PurchaseOrder[]) {}
}

export class SaleItemsTableHandle {
  constructor(private table: SaleItem[]) {}
}

export class SalesTableHandle {
  constructor(private table: Sale[]) {}
}

export class ShiftReportsTableHandle {
  constructor(private table: ShiftReport[]) {}
}

export class SuppliersTableHandle {
  constructor(private table: Supplier[]) {}
}

export class UsersTableHandle {
  constructor(private table: User[]) {}
}