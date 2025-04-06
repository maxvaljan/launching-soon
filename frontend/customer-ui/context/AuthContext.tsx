import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as apiLogin, logout as apiLogout } from '@/services/api'; // Assuming logout API call exists

interface AuthContextType {
  authToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  login: (token: string, refreshToken: string, userId: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading initially

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const storedUserId = await SecureStore.getItemAsync('userId');
      if (token && storedUserId) {
        setAuthToken(token);
        setUserId(storedUserId);
      } else {
        setAuthToken(null);
        setUserId(null);
      }
    } catch (e) {
      console.error("Failed to load auth token", e);
      setAuthToken(null);
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (token: string, refreshToken: string, uid: string) => {
    setIsLoading(true);
    try {
      await SecureStore.setItemAsync('authToken', token);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      await SecureStore.setItemAsync('userId', uid);
      setAuthToken(token);
      setUserId(uid);
    } catch (e) {
      console.error("Failed to save auth token", e);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Optional: Call API logout endpoint if needed
      // await apiLogout();
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('userId');
      setAuthToken(null);
      setUserId(null);
    } catch (e) {
      console.error("Failed to logout", e);
      // Handle error appropriately, maybe force clear state anyway
      setAuthToken(null);
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    authToken,
    isAuthenticated: !!authToken,
    isLoading,
    userId,
    login,
    logout,
    checkAuthStatus, // Expose check function if needed elsewhere
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 