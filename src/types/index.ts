export type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'ACCOUNTANT' | 'STAFF' | 'SUPER_ADMIN';

export interface User {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface Organization {
  id: string;
  name: string;
  currency: string;
  dateFormat: string;
}

export interface Shop {
  id: string;
  organizationId: string;
  name: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  dsrConfig?: string;
}

export interface Staff {
  id: string;
  shopId: string;
  name: string;
  contact?: string;
  salary: number;
  salaryType: 'MONTHLY' | 'WEEKLY' | 'DAILY';
  isActive: boolean;
}

export interface PaymentSource {
  id: string;
  shopId: string;
  name: string;
  category: string; // e.g. CURRENT_ASSET, CURRENT_LIABILITY
  isDefault: boolean;
  showInDsr: boolean;
  isActive: boolean;
}

export interface ExpenseCategory {
  id: string;
  shopId: string;
  name: string;
  isActive: boolean;
}

export interface PurchaseCategory {
  id: string;
  shopId: string;
  name: string;
  isStockTracked: boolean;
  unitOfMeasure?: string;
  profitMarginPct: number;
  isActive: boolean;
}

export interface IncomeType {
  id: string;
  shopId: string;
  name: string;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'PURCHASE' | 'VENDOR_PAYMENT' | 'TRANSFER';
  amount: number;
  date: string;
  paymentSourceId: string;
  notes?: string;
  // Specific fields
  categoryId?: string; // expense/purchase category
  staffId?: string; // staff expense association
  vendorId?: string; // purchase/vendor payment association
  toSourceId?: string; // transfer target
}

export interface DailyEntry {
  id: string;
  shopId: string;
  salesmanId: string;
  date: string;
  isClosed: boolean;
  isSubmitted: boolean;
  submittedAt?: string;
  createdAt: string;
}

export interface StockItem {
  categoryId: string;
  categoryName: string;
  quantity: number;
  lowStockAt: number;
}
