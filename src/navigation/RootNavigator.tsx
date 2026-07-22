import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/useAuthStore';
import { AuthNavigator } from './AuthNavigator';
import { StaffNavigator } from './StaffNavigator';

export const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      {!isAuthenticated ? <AuthNavigator /> : <StaffNavigator />}
    </NavigationContainer>
  );
};
