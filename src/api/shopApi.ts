import { apiClient } from './client';
import { Transaction, StockItem, Shop } from '../types';

export interface DashboardSummary {
  todaySales: number;
  todayExpenses: number;
  todayIncome: number;
  cashBalance: number;
  bankBalance: number;
  lowStockCount: number;
  activeStaffCount: number;
  recentTransactions: Transaction[];
}

export interface LedgerEntry {
  id: string;
  date: string;
  type: string;
  category: string;
  source: string;
  amount: number;
  notes?: string;
}

export const shopApi = {
  // Get active shop settings
  getShopDetails: async (shopId: string): Promise<Shop> => {
    try {
      const response = await apiClient.get(`/shops/${shopId}`);
      return response.data;
    } catch (error) {
      if (__DEV__) {
        return {
          id: shopId,
          organizationId: 'org_dev_1',
          name: 'Main Retail Branch',
          address: 'City Center, Suite 101',
          phone: '+91 9876543210',
          isActive: true,
        };
      }
      throw error;
    }
  },

  // Submit direct transaction (replaces legacy multi-step DSR)
  submitTransaction: async (
    shopId: string,
    transaction: Omit<Transaction, 'id'>
  ): Promise<{ success: boolean; id: string }> => {
    try {
      const response = await apiClient.post(`/shops/${shopId}/transactions`, transaction);
      return response.data;
    } catch (error) {
      if (__DEV__) {
        console.log('[DEV MOCK] Transaction Submitted:', transaction);
        return { success: true, id: 'tx_' + Date.now() };
      }
      throw error;
    }
  },

  // Get transaction history for staff & owner
  getTransactionHistory: async (
    shopId: string,
    limit: number = 20
  ): Promise<Transaction[]> => {
    try {
      const response = await apiClient.get(`/shops/${shopId}/transactions?limit=${limit}`);
      return response.data;
    } catch (error) {
      if (__DEV__) {
        return [
          {
            id: 'tx_101',
            type: 'INCOME',
            amount: 1450,
            date: new Date().toISOString(),
            paymentSourceId: 'ps_cash',
            notes: 'Counter Daily Sales',
          },
          {
            id: 'tx_102',
            type: 'EXPENSE',
            amount: 120,
            date: new Date().toISOString(),
            paymentSourceId: 'ps_cash',
            notes: 'Tea & Snacks',
          },
          {
            id: 'tx_103',
            type: 'PURCHASE',
            amount: 3200,
            date: new Date(Date.now() - 86400000).toISOString(),
            paymentSourceId: 'ps_bank',
            notes: 'Supplier stock replenishment',
          },
        ];
      }
      throw error;
    }
  },

  // Get Owner Dashboard overview
  getOwnerDashboard: async (shopId: string): Promise<DashboardSummary> => {
    try {
      const response = await apiClient.get(`/shops/${shopId}/dashboard`);
      return response.data;
    } catch (error) {
      if (__DEV__) {
        return {
          todaySales: 18450,
          todayExpenses: 1240,
          todayIncome: 18450,
          cashBalance: 42300,
          bankBalance: 128900,
          lowStockCount: 3,
          activeStaffCount: 4,
          recentTransactions: [
            {
              id: 'tx_1',
              type: 'INCOME',
              amount: 5400,
              date: '2026-07-21',
              paymentSourceId: 'Cash',
              notes: 'Retail Counter',
            },
            {
              id: 'tx_2',
              type: 'EXPENSE',
              amount: 350,
              date: '2026-07-21',
              paymentSourceId: 'Cash',
              notes: 'Cleaning Supplies',
            },
          ],
        };
      }
      throw error;
    }
  },

  // Get Ledger Statement
  getLedger: async (shopId: string): Promise<LedgerEntry[]> => {
    try {
      const response = await apiClient.get(`/shops/${shopId}/ledger`);
      return response.data;
    } catch (error) {
      if (__DEV__) {
        return [
          { id: '1', date: '2026-07-21', type: 'Sales', category: 'General', source: 'Drawer Cash', amount: 4500, notes: 'Day Sales' },
          { id: '2', date: '2026-07-21', type: 'Expense', category: 'Food & Tea', source: 'Drawer Cash', amount: 150, notes: 'Tea' },
          { id: '3', date: '2026-07-20', type: 'Transfer', category: 'Cash to Bank', source: 'Drawer Cash', amount: 10000, notes: 'Deposit' },
        ];
      }
      throw error;
    }
  },

  // Get Stock/Inventory
  getStock: async (shopId: string): Promise<StockItem[]> => {
    try {
      const response = await apiClient.get(`/shops/${shopId}/stock`);
      return response.data;
    } catch (error) {
      if (__DEV__) {
        return [
          { categoryId: 'st_1', categoryName: 'Beverages / Milk', quantity: 14, lowStockAt: 20 },
          { categoryId: 'st_2', categoryName: 'Bakery / Bread', quantity: 5, lowStockAt: 10 },
          { categoryId: 'st_3', categoryName: 'Snacks / Chips', quantity: 45, lowStockAt: 15 },
          { categoryId: 'st_4', categoryName: 'Dairy / Butter', quantity: 8, lowStockAt: 10 },
        ];
      }
      throw error;
    }
  },
};
