import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, logoutUser as logoutAPI, login as loginAPI } from '@/api/auth';

// Define the types for user data and context
interface Organization {
  id: number;
  name: string;
}

interface User {
  user_role: string;
  user_id: number;
  organization: Organization;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
}

// Define the type for the AuthProvider props, including children
interface AuthProviderProps {
  children: ReactNode;
}

// Create Context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to manage user authentication
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user details from the backend
  const fetchUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const response = await loginAPI(usernameOrEmail, password);
      await fetchUser(); // Refetch user after successful login
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutAPI();
      setUser(null); // Clear user data
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Fetch user data on mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, login }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};