export interface PurchaseOrderItemInput {
  ingredientId: bigint;
  quantity: bigint;
  price: bigint;
}

export interface SaleItemInput {
  productId: bigint;
  quantity: bigint;
  price: bigint;
}