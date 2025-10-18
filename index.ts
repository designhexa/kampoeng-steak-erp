// Forward generated spacetime bindings to the `src/spacetime_module_bindings` copy.
// This file is a small shim used during development and type-checking.

export * from './src/spacetime_module_bindings/index';
  createPromotion(name: string, discountType: DiscountType, discountValue: bigint, startDate: __Timestamp, endDate: __Timestamp, status: PromotionStatus) {
    const __args = { name, discountType, discountValue, startDate, endDate, status };
    let __writer = new __BinaryWriter(1024);
    CreatePromotion.serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("create_promotion", __argsBuffer, this.setCallReducerFlags.createPromotionFlags);
  }

  onCreatePromotion(callback: (ctx: ReducerEventContext, name: string, discountType: DiscountType, discountValue: bigint, startDate: __Timestamp, endDate: __Timestamp, status: PromotionStatus) => void) {
    this.connection.onReducer("create_promotion", callback);
  }

  removeOnCreatePromotion(callback: (ctx: ReducerEventContext, name: string, discountType: DiscountType, discountValue: bigint, startDate: __Timestamp, endDate: __Timestamp, status: PromotionStatus) => void) {
    this.connection.offReducer("create_promotion", callback);
  }

  createPurchaseOrder(outletId: bigint, supplierId: bigint, total: bigint, date: __Timestamp, items: PurchaseOrderItemInput[]) {
    const __args = { outletId, supplierId, total, date, items };
    let __writer = new __BinaryWriter(1024);
    CreatePurchaseOrder.serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("create_purchase_order", __argsBuffer, this.setCallReducerFlags.createPurchaseOrderFlags);
  }

  onCreatePurchaseOrder(callback: (ctx: ReducerEventContext, outletId: bigint, supplierId: bigint, total: bigint, date: __Timestamp, items: PurchaseOrderItemInput[]) => void) {
    this.connection.onReducer("create_purchase_order", callback);
  }

  removeOnCreatePurchaseOrder(callback: (ctx: ReducerEventContext, outletId: bigint, supplierId: bigint, total: bigint, date: __Timestamp, items: PurchaseOrderItemInput[]) => void) {
    this.connection.offReducer("create_purchase_order", callback);
  }

  createUser(username: string, role: UserRole, outletId: bigint | undefined) {
    const __args = { username, role, outletId };
    let __writer = new __BinaryWriter(1024);
    CreateUser.serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("create_user", __argsBuffer, this.setCallReducerFlags.createUserFlags);
  }

  onCreateUser(callback: (ctx: ReducerEventContext, username: string, role: UserRole, outletId: bigint | undefined) => void) {
    this.connection.onReducer("create_user", callback);
  }

  removeOnCreateUser(callback: (ctx: ReducerEventContext, username: string, role: UserRole, outletId: bigint | undefined) => void) {
    this.connection.offReducer("create_user", callback);
  }

  deleteOutlet(id: bigint) {
    const __args = { id };
    let __writer = new __BinaryWriter(1024);
    DeleteOutlet.serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("delete_outlet", __argsBuffer, this.setCallReducerFlags.deleteOutletFlags);
  }

  onDeleteOutlet(callback: (ctx: ReducerEventContext, id: bigint) => void) {
    this.connection.onReducer("delete_outlet", callback);
  }

  removeOnDeleteOutlet(callback: (ctx: ReducerEventContext, id: bigint) => void) {
    this.connection.offReducer("delete_outlet", callback);
  }

  markDistributionDelivered(distributionId: bigint) {
    const __args = { distributionId };
    let __writer = new __BinaryWriter(1024);
    MarkDistributionDelivered.serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("mark_distribution_delivered", __argsBuffer, this.setCallReducerFlags.markDistributionDeliveredFlags);
  }

  onMarkDistributionDelivered(callback: (ctx: ReducerEventContext, distributionId: bigint) => void) {
    this.connection.onReducer("mark_distribution_delivered", callback);
  }

  removeOnMarkDistributionDelivered(callback: (ctx: ReducerEventContext, distributionId: bigint) => void) {
    this.connection.offReducer("mark_distribution_delivered", callback);
  }

  openShift(outletId: bigint, employeeId: bigint, shiftStart: __Timestamp, initialCash: bigint) {
    const __args = { outletId, employeeId, shiftStart, initialCash };
    let __writer = new __BinaryWriter(1024);
    OpenShift.serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("open_shift", __argsBuffer, this.setCallReducerFlags.openShiftFlags);
  }

  onOpenShift(callback: (ctx: ReducerEventContext, outletId: bigint, employeeId: bigint, shiftStart: __Timestamp, initialCash: bigint) => void) {
    this.connection.onReducer("open_shift", callback);
  }

  removeOnOpenShift(callback: (ctx: ReducerEventContext, outletId: bigint, employeeId: bigint, shiftStart: __Timestamp, initialCash: bigint) => void) {
    this.connection.offReducer("open_shift", callback);
  }

  recordSale(outletId: bigint, items: SaleItemInput[], paymentMethod: PaymentMethod, date: __Timestamp) {
    const __args = { outletId, items, paymentMethod, date };
    let __writer = new __BinaryWriter(1024);
    RecordSale.serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("record_sale", __argsBuffer, this.setCallReducerFlags.recordSaleFlags);
  }

  onRecordSale(callback: (ctx: ReducerEventContext, outletId: bigint, items: SaleItemInput[], paymentMethod: PaymentMethod, date: __Timestamp) => void) {
    this.connection.onReducer("record_sale", callback);
  }

  removeOnRecordSale(callback: (ctx: ReducerEventContext, outletId: bigint, items: SaleItemInput[], paymentMethod: PaymentMethod, date: __Timestamp) => void) {
    this.connection.offReducer("record_sale", callback);
  }

  rejectPurchaseOrder(poId: bigint) {
    const __args = { poId };
    let __writer = new __BinaryWriter(1024);
    RejectPurchaseOrder.serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("reject_purchase_order", __argsBuffer, this.setCallReducerFlags.rejectPurchaseOrderFlags);
  }

  onRejectPurchaseOrder(callback: (ctx: ReducerEventContext, poId: bigint) => void) {
    this.connection.onReducer("reject_purchase_order", callback);
  }

  removeOnRejectPurchaseOrder(callback: (ctx: ReducerEventContext, poId: bigint) => void) {
    this.connection.offReducer("reject_purchase_order", callback);
  }

  requestDistribution(fromOutletId: bigint, toOutletId: bigint, ingredientId: bigint, quantity: bigint, date: __Timestamp) {
    const __args = { fromOutletId, toOutletId, ingredientId, quantity, date };
    let __writer = new __BinaryWriter(1024);
    RequestDistribution.serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("request_distribution", __argsBuffer, this.setCallReducerFlags.requestDistributionFlags);
  }

  onRequestDistribution(callback: (ctx: ReducerEventContext, fromOutletId: bigint, toOutletId: bigint, ingredientId: bigint, quantity: bigint, date: __Timestamp) => void) {
    this.connection.onReducer("request_distribution", callback);
  }

  removeOnRequestDistribution(callback: (ctx: ReducerEventContext, fromOutletId: bigint, toOutletId: bigint, ingredientId: bigint, quantity: bigint, date: __Timestamp) => void) {
    this.connection.offReducer("request_distribution", callback);
  }

  updateAssetStatus(assetId: bigint, status: AssetStatus, lastMaintenance: __Timestamp) {
    const __args = { assetId, status, lastMaintenance };
    let __writer = new __BinaryWriter(1024);
    UpdateAssetStatus.serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("update_asset_status", __argsBuffer, this.setCallReducerFlags.updateAssetStatusFlags);
  }

  onUpdateAssetStatus(callback: (ctx: ReducerEventContext, assetId: bigint, status: AssetStatus, lastMaintenance: __Timestamp) => void) {
    this.connection.onReducer("update_asset_status", callback);
  }

  removeOnUpdateAssetStatus(callback: (ctx: ReducerEventContext, assetId: bigint, status: AssetStatus, lastMaintenance: __Timestamp) => void) {
    this.connection.offReducer("update_asset_status", callback);
  }

  updateCandidateStatus(candidateId: bigint, status: CandidateStatus) {
    const __args = { candidateId, status };
    let __writer = new __BinaryWriter(1024);
    UpdateCandidateStatus.serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("update_candidate_status", __argsBuffer, this.setCallReducerFlags.updateCandidateStatusFlags);
  }

  onUpdateCandidateStatus(callback: (ctx: ReducerEventContext, candidateId: bigint, status: CandidateStatus) => void) {
    this.connection.onReducer("update_candidate_status", callback);
  }

  removeOnUpdateCandidateStatus(callback: (ctx: ReducerEventContext, candidateId: bigint, status: CandidateStatus) => void) {
    this.connection.offReducer("update_candidate_status", callback);
  }

  updateChecklistStatus(checklistId: bigint, isCompleted: boolean) {
    const __args = { checklistId, isCompleted };
    let __writer = new __BinaryWriter(1024);
    UpdateChecklistStatus.serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("update_checklist_status", __argsBuffer, this.setCallReducerFlags.updateChecklistStatusFlags);
  }

  onUpdateChecklistStatus(callback: (ctx: ReducerEventContext, checklistId: bigint, isCompleted: boolean) => void) {
    this.connection.onReducer("update_checklist_status", callback);
  }

  removeOnUpdateChecklistStatus(callback: (ctx: ReducerEventContext, checklistId: bigint, isCompleted: boolean) => void) {
    this.connection.offReducer("update_checklist_status", callback);
  }

  updateEmployeeStatus(employeeId: bigint, status: EmploymentStatus) {
    const __args = { employeeId, status };
    let __writer = new __BinaryWriter(1024);
    UpdateEmployeeStatus.serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("update_employee_status", __argsBuffer, this.setCallReducerFlags.updateEmployeeStatusFlags);
  }

  onUpdateEmployeeStatus(callback: (ctx: ReducerEventContext, employeeId: bigint, status: EmploymentStatus) => void) {
    this.connection.onReducer("update_employee_status", callback);
  }

  removeOnUpdateEmployeeStatus(callback: (ctx: ReducerEventContext, employeeId: bigint, status: EmploymentStatus) => void) {
    this.connection.offReducer("update_employee_status", callback);
  }

  updateInventory(ingredientId: bigint, newStock: bigint) {
    const __args = { ingredientId, newStock };
    let __writer = new __BinaryWriter(1024);
    UpdateInventory.serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("update_inventory", __argsBuffer, this.setCallReducerFlags.updateInventoryFlags);
  }

  onUpdateInventory(callback: (ctx: ReducerEventContext, ingredientId: bigint, newStock: bigint) => void) {
    this.connection.onReducer("update_inventory", callback);
  }

  removeOnUpdateInventory(callback: (ctx: ReducerEventContext, ingredientId: bigint, newStock: bigint) => void) {
    this.connection.offReducer("update_inventory", callback);
  }

  updateOutlet(id: bigint, name: string, area: string, address: string, status: OutletStatus) {
    const __args = { id, name, area, address, status };
    let __writer = new __BinaryWriter(1024);
    UpdateOutlet.serialize(__writer, __args);
    let __argsBuffer = __writer.getBuffer();
    this.connection.callReducer("update_outlet", __argsBuffer, this.setCallReducerFlags.updateOutletFlags);
  }

  onUpdateOutlet(callback: (ctx: ReducerEventContext, id: bigint, name: string, area: string, address: string, status: OutletStatus) => void) {
    this.connection.onReducer("update_outlet", callback);
  }

  removeOnUpdateOutlet(callback: (ctx: ReducerEventContext, id: bigint, name: string, area: string, address: string, status: OutletStatus) => void) {
    this.connection.offReducer("update_outlet", callback);
  }

}

export class SetReducerFlags {
  addAssetFlags: __CallReducerFlags = 'FullUpdate';
  addAsset(flags: __CallReducerFlags) {
    this.addAssetFlags = flags;
  }

  addCandidateFlags: __CallReducerFlags = 'FullUpdate';
  addCandidate(flags: __CallReducerFlags) {
    this.addCandidateFlags = flags;
  }

  addIngredientFlags: __CallReducerFlags = 'FullUpdate';
  addIngredient(flags: __CallReducerFlags) {
    this.addIngredientFlags = flags;
  }

  addProductFlags: __CallReducerFlags = 'FullUpdate';
  addProduct(flags: __CallReducerFlags) {
    this.addProductFlags = flags;
  }

  addSupplierFlags: __CallReducerFlags = 'FullUpdate';
  addSupplier(flags: __CallReducerFlags) {
    this.addSupplierFlags = flags;
  }

  approvePurchaseOrderFlags: __CallReducerFlags = 'FullUpdate';
  approvePurchaseOrder(flags: __CallReducerFlags) {
    this.approvePurchaseOrderFlags = flags;
  }

  createDailyChecklistFlags: __CallReducerFlags = 'FullUpdate';
  createDailyChecklist(flags: __CallReducerFlags) {
    this.createDailyChecklistFlags = flags;
  }

  createEmployeeFlags: __CallReducerFlags = 'FullUpdate';
  createEmployee(flags: __CallReducerFlags) {
    this.createEmployeeFlags = flags;
  }

  createOutletFlags: __CallReducerFlags = 'FullUpdate';
  createOutlet(flags: __CallReducerFlags) {
    this.createOutletFlags = flags;
  }

  createPromotionFlags: __CallReducerFlags = 'FullUpdate';
  createPromotion(flags: __CallReducerFlags) {
    this.createPromotionFlags = flags;
  }

  createPurchaseOrderFlags: __CallReducerFlags = 'FullUpdate';
  createPurchaseOrder(flags: __CallReducerFlags) {
    this.createPurchaseOrderFlags = flags;
  }

  createUserFlags: __CallReducerFlags = 'FullUpdate';
  createUser(flags: __CallReducerFlags) {
    this.createUserFlags = flags;
  }

  deleteOutletFlags: __CallReducerFlags = 'FullUpdate';
  deleteOutlet(flags: __CallReducerFlags) {
    this.deleteOutletFlags = flags;
  }

  markDistributionDeliveredFlags: __CallReducerFlags = 'FullUpdate';
  markDistributionDelivered(flags: __CallReducerFlags) {
    this.markDistributionDeliveredFlags = flags;
  }

  openShiftFlags: __CallReducerFlags = 'FullUpdate';
  openShift(flags: __CallReducerFlags) {
    this.openShiftFlags = flags;
  }

  recordSaleFlags: __CallReducerFlags = 'FullUpdate';
  recordSale(flags: __CallReducerFlags) {
    this.recordSaleFlags = flags;
  }

  rejectPurchaseOrderFlags: __CallReducerFlags = 'FullUpdate';
  rejectPurchaseOrder(flags: __CallReducerFlags) {
    this.rejectPurchaseOrderFlags = flags;
  }

  requestDistributionFlags: __CallReducerFlags = 'FullUpdate';
  requestDistribution(flags: __CallReducerFlags) {
    this.requestDistributionFlags = flags;
  }

  updateAssetStatusFlags: __CallReducerFlags = 'FullUpdate';
  updateAssetStatus(flags: __CallReducerFlags) {
    this.updateAssetStatusFlags = flags;
  }

  updateCandidateStatusFlags: __CallReducerFlags = 'FullUpdate';
  updateCandidateStatus(flags: __CallReducerFlags) {
    this.updateCandidateStatusFlags = flags;
  }

  updateChecklistStatusFlags: __CallReducerFlags = 'FullUpdate';
  updateChecklistStatus(flags: __CallReducerFlags) {
    this.updateChecklistStatusFlags = flags;
  }

  updateEmployeeStatusFlags: __CallReducerFlags = 'FullUpdate';
  updateEmployeeStatus(flags: __CallReducerFlags) {
    this.updateEmployeeStatusFlags = flags;
  }

  updateInventoryFlags: __CallReducerFlags = 'FullUpdate';
  updateInventory(flags: __CallReducerFlags) {
    this.updateInventoryFlags = flags;
  }

  updateOutletFlags: __CallReducerFlags = 'FullUpdate';
  updateOutlet(flags: __CallReducerFlags) {
    this.updateOutletFlags = flags;
  }

}

export class RemoteTables {
  constructor(private connection: __DbConnectionImpl) {}

  get assets(): AssetsTableHandle {
    // clientCache is a private property
    return new AssetsTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<Asset>(REMOTE_MODULE.tables.assets));
  }

  get candidates(): CandidatesTableHandle {
    // clientCache is a private property
    return new CandidatesTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<Candidate>(REMOTE_MODULE.tables.candidates));
  }

  get cashFlow(): CashFlowTableHandle {
    // clientCache is a private property
    return new CashFlowTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<CashFlow>(REMOTE_MODULE.tables.cash_flow));
  }

  get dailyChecklists(): DailyChecklistsTableHandle {
    // clientCache is a private property
    return new DailyChecklistsTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<DailyChecklist>(REMOTE_MODULE.tables.daily_checklists));
  }

  get distributions(): DistributionsTableHandle {
    // clientCache is a private property
    return new DistributionsTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<Distribution>(REMOTE_MODULE.tables.distributions));
  }

  get employees(): EmployeesTableHandle {
    // clientCache is a private property
    return new EmployeesTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<Employee>(REMOTE_MODULE.tables.employees));
  }

  get ingredients(): IngredientsTableHandle {
    // clientCache is a private property
    return new IngredientsTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<Ingredient>(REMOTE_MODULE.tables.ingredients));
  }

  get outlets(): OutletsTableHandle {
    // clientCache is a private property
    return new OutletsTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<Outlet>(REMOTE_MODULE.tables.outlets));
  }

  get products(): ProductsTableHandle {
    // clientCache is a private property
    return new ProductsTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<Product>(REMOTE_MODULE.tables.products));
  }

  get promotions(): PromotionsTableHandle {
    // clientCache is a private property
    return new PromotionsTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<Promotion>(REMOTE_MODULE.tables.promotions));
  }

  get purchaseOrderItems(): PurchaseOrderItemsTableHandle {
    // clientCache is a private property
    return new PurchaseOrderItemsTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<PurchaseOrderItem>(REMOTE_MODULE.tables.purchase_order_items));
  }

  get purchaseOrders(): PurchaseOrdersTableHandle {
    // clientCache is a private property
    return new PurchaseOrdersTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<PurchaseOrder>(REMOTE_MODULE.tables.purchase_orders));
  }

  get saleItems(): SaleItemsTableHandle {
    // clientCache is a private property
    return new SaleItemsTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<SaleItem>(REMOTE_MODULE.tables.sale_items));
  }

  get sales(): SalesTableHandle {
    // clientCache is a private property
    return new SalesTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<Sale>(REMOTE_MODULE.tables.sales));
  }

  get shiftReports(): ShiftReportsTableHandle {
    // clientCache is a private property
    return new ShiftReportsTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<ShiftReport>(REMOTE_MODULE.tables.shift_reports));
  }

  get suppliers(): SuppliersTableHandle {
    // clientCache is a private property
    return new SuppliersTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<Supplier>(REMOTE_MODULE.tables.suppliers));
  }

  get users(): UsersTableHandle {
    // clientCache is a private property
    return new UsersTableHandle((this.connection as unknown as { clientCache: __ClientCache }).clientCache.getOrCreateTable<User>(REMOTE_MODULE.tables.users));
  }
}

export class SubscriptionBuilder extends __SubscriptionBuilderImpl<RemoteTables, RemoteReducers, SetReducerFlags> { }

export class DbConnection extends __DbConnectionImpl<RemoteTables, RemoteReducers, SetReducerFlags> {
  static builder = (): __DbConnectionBuilder<DbConnection, ErrorContext, SubscriptionEventContext> => {
    return new __DbConnectionBuilder<DbConnection, ErrorContext, SubscriptionEventContext>(REMOTE_MODULE, (imp: __DbConnectionImpl) => imp as DbConnection);
  }
  subscriptionBuilder = (): SubscriptionBuilder => {
    return new SubscriptionBuilder(this);
  }
}

export type EventContext = __EventContextInterface<RemoteTables, RemoteReducers, SetReducerFlags, Reducer>;
export type ReducerEventContext = __ReducerEventContextInterface<RemoteTables, RemoteReducers, SetReducerFlags, Reducer>;
export type SubscriptionEventContext = __SubscriptionEventContextInterface<RemoteTables, RemoteReducers, SetReducerFlags>;
export type ErrorContext = __ErrorContextInterface<RemoteTables, RemoteReducers, SetReducerFlags>;
