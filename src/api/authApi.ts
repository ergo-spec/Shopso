import { apiClient } from './client';
import { User, Shop } from '../types';

export interface LoginResponse {
  user: User;
  token: string;
  shops: Shop[];
}

export const authApi = {
  // Request OTP for Mobile Login
  sendOtp: async (phone: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiClient.post('/auth/send-otp', { phone });
      return response.data;
    } catch (error: any) {
      // Fallback mock handling for development if endpoint is not live
      if (__DEV__) {
        console.log('[DEV MOCK] Sending OTP to:', phone);
        return { success: true, message: 'OTP sent to mobile number' };
      }
      throw error;
    }
  },

  // Verify OTP
  verifyOtp: async (phone: string, otp: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post('/auth/verify-otp', { phone, otp });
      return response.data;
    } catch (error: any) {
      if (__DEV__) {
        console.log('[DEV MOCK] Verifying OTP:', otp, 'for phone:', phone);
        // Default role based mock
        const isOwnerDemo = phone.endsWith('00');
        return {
          user: {
            id: 'usr_dev_1',
            organizationId: 'org_dev_1',
            name: isOwnerDemo ? 'Shop Owner' : 'Sales Staff',
            email: phone + '@shopso.app',
            role: isOwnerDemo ? 'OWNER' : 'STAFF',
            isActive: true,
          },
          token: 'mock_jwt_token_12345',
          shops: [
            {
              id: 'shop_dev_1',
              organizationId: 'org_dev_1',
              name: 'Main Retail Branch',
              address: 'City Center, Suite 101',
              phone: phone,
              isActive: true,
            },
          ],
        };
      }
      throw error;
    }
  },

  // Credentials Login (Staff)
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      if (__DEV__) {
        console.log('[DEV MOCK] Logging in staff:', email);
        return {
          user: {
            id: 'usr_dev_staff',
            organizationId: 'org_dev_1',
            name: 'Staff Member',
            email: email,
            role: 'STAFF',
            isActive: true,
          },
          token: 'mock_jwt_token_staff_123',
          shops: [
            {
              id: 'shop_dev_1',
              organizationId: 'org_dev_1',
              name: 'Main Retail Branch',
              address: 'City Center, Suite 101',
              phone: '9876543210',
              isActive: true,
            },
          ],
        };
      }
      throw error;
    }
  },
};

