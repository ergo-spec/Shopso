import { create } from 'zustand';
import { User, UserRole, Shop } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  activeShop: Shop | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  
  // Actions
  setAuth: (user: User, token: string, shop?: Shop) => void;
  setActiveShop: (shop: Shop) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  activeShop: null,
  isAuthenticated: false,
  role: null,

  setAuth: (user, token, shop) =>
    set({
      user,
      token,
      isAuthenticated: true,
      role: user.role,
      activeShop: shop || null,
    }),

  setActiveShop: (shop) => set({ activeShop: shop }),

  logout: () =>
    set({
      user: null,
      token: null,
      activeShop: null,
      isAuthenticated: false,
      role: null,
    }),
}));
