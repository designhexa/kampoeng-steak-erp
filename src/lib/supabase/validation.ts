import type { Database } from './types';

type Tables = Database['public']['Tables'];

export const validateOutlet = (data: Partial<Tables['outlets']['Insert']>): string[] => {
  const errors: string[] = [];
  
  if (!data.name) errors.push('Name is required');
  if (!data.area) errors.push('Area is required');
  if (!data.address) errors.push('Address is required');
  
  return errors;
};

export const validateEmployee = (data: Partial<Tables['employees']['Insert']>): string[] => {
  const errors: string[] = [];
  
  if (!data.name) errors.push('Name is required');
  if (!data.outlet_id) errors.push('Outlet is required');
  if (!data.position) errors.push('Position is required');
  if (typeof data.salary !== 'number') errors.push('Salary is required and must be a number');
  
  return errors;
};

export const validateProduct = (data: Partial<Tables['products']['Insert']>): string[] => {
  const errors: string[] = [];
  
  if (!data.name) errors.push('Name is required');
  if (!data.category) errors.push('Category is required');
  if (typeof data.price !== 'number') errors.push('Price is required and must be a number');
  
  return errors;
};

export const validateIngredient = (data: Partial<Tables['ingredients']['Insert']>): string[] => {
  const errors: string[] = [];
  
  if (!data.name) errors.push('Name is required');
  if (!data.outlet_id) errors.push('Outlet is required');
  if (typeof data.stock !== 'number') errors.push('Stock is required and must be a number');
  if (!data.unit) errors.push('Unit is required');
  if (typeof data.min_stock !== 'number') errors.push('Minimum stock is required and must be a number');
  
  return errors;
};

export const validateSale = (data: Partial<Tables['sales']['Insert']>): string[] => {
  const errors: string[] = [];
  
  if (!data.outlet_id) errors.push('Outlet is required');
  if (!data.cashier_name) errors.push('Cashier name is required');
  if (typeof data.total !== 'number') errors.push('Total is required and must be a number');
  if (!data.payment_method) errors.push('Payment method is required');
  
  return errors;
};

export const validateSupplier = (data: Partial<Tables['suppliers']['Insert']>): string[] => {
  const errors: string[] = [];
  
  if (!data.name) errors.push('Name is required');
  if (!data.contact) errors.push('Contact information is required');
  if (typeof data.rating !== 'number') errors.push('Rating is required and must be a number');
  
  return errors;
};

export const validatePurchaseOrder = (data: Partial<Tables['purchase_orders']['Insert']>): string[] => {
  const errors: string[] = [];
  
  if (!data.outlet_id) errors.push('Outlet is required');
  if (!data.supplier_id) errors.push('Supplier is required');
  if (typeof data.total !== 'number') errors.push('Total is required and must be a number');
  
  return errors;
};

export const validateDistribution = (data: Partial<Tables['distributions']['Insert']>): string[] => {
  const errors: string[] = [];
  
  if (!data.from_outlet_id) errors.push('Source outlet is required');
  if (!data.to_outlet_id) errors.push('Destination outlet is required');
  if (!data.ingredient_name) errors.push('Ingredient name is required');
  if (typeof data.quantity !== 'number') errors.push('Quantity is required and must be a number');
  
  return errors;
};

export const validateDailyChecklist = (data: Partial<Tables['daily_checklists']['Insert']>): string[] => {
  const errors: string[] = [];
  
  if (!data.outlet_id) errors.push('Outlet is required');
  if (!data.task) errors.push('Task description is required');
  
  return errors;
};

export const validateShiftReport = (data: Partial<Tables['shift_reports']['Insert']>): string[] => {
  const errors: string[] = [];
  
  if (!data.outlet_id) errors.push('Outlet is required');
  if (!data.employee_name) errors.push('Employee name is required');
  if (!data.shift_start) errors.push('Shift start time is required');
  if (typeof data.initial_cash !== 'number') errors.push('Initial cash is required and must be a number');
  
  return errors;
};

export const validateCandidate = (data: Partial<Tables['candidates']['Insert']>): string[] => {
  const errors: string[] = [];
  
  if (!data.name) errors.push('Name is required');
  if (!data.position) errors.push('Position is required');
  if (!data.outlet_id) errors.push('Outlet is required');
  
  return errors;
};

export const validatePromotion = (data: Partial<Tables['promotions']['Insert']>): string[] => {
  const errors: string[] = [];
  
  if (!data.name) errors.push('Name is required');
  if (!data.discount_type) errors.push('Discount type is required');
  if (typeof data.discount_value !== 'number') errors.push('Discount value is required and must be a number');
  if (!data.start_date) errors.push('Start date is required');
  if (!data.end_date) errors.push('End date is required');
  
  return errors;
};

export const validateAsset = (data: Partial<Tables['assets']['Insert']>): string[] => {
  const errors: string[] = [];
  
  if (!data.name) errors.push('Name is required');
  if (!data.outlet_id) errors.push('Outlet is required');
  if (!data.last_maintenance) errors.push('Last maintenance date is required');
  
  return errors;
};

export const validateCashFlow = (data: Partial<Tables['cash_flow']['Insert']>): string[] => {
  const errors: string[] = [];
  
  if (!data.outlet_id) errors.push('Outlet is required');
  if (!data.type) errors.push('Type (Inflow/Outflow) is required');
  if (!data.category) errors.push('Category is required');
  if (typeof data.amount !== 'number') errors.push('Amount is required and must be a number');
  if (!data.description) errors.push('Description is required');
  
  return errors;
};

export const validateUser = (data: Partial<Tables['users']['Insert']>): string[] => {
  const errors: string[] = [];
  
  if (!data.name) errors.push('Name is required');
  if (!data.email) errors.push('Email is required');
  if (!data.role) errors.push('Role is required');
  
  return errors;
};