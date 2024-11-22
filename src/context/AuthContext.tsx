import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  getCurrentUser,
  logoutUser as logoutAPI,
  login as loginAPI,
} from "@/api/auth";

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
  const [loading, setLoading] = useState<boolean>(false);

  console.log(user);

  // Fetch user details from the backend
  const fetchUser = async () => {
    try {
      const response = await getCurrentUser();
      console.log("current user: " + response);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      console.log(usernameOrEmail, password);
      setLoading(true);
      const token = await loginAPI(usernameOrEmail, password);
      console.log("current token: " + token);
      await fetchUser(); // Only fetch user after successful login
    } catch (error) {
      console.error("Login failed:", error);
      setUser(null);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutAPI();
      setUser(null); // Clear user data
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
