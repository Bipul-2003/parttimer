import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
  getCurrentUser,
  logoutUser as logoutAPI,
  login as loginAPI,
} from "@/api/auth";
import { signInwithGoogle } from "@/api/oAuthApi";
import { checkUser as checkUserProfile } from "@/api/checkUser";

interface Organization {
  id: number;
  name: string;
}

interface BaseUser {
  user_type: "USER" | "LABOUR";
  name: string;
}

interface RegularUser extends BaseUser {
  user_type: "USER";
  user_role: "USER" | "OWNER" | "CO_OWNER";
  user_id: number;
  organization?: Organization;
  email: string;
  points: number;
  zipcode: string ;
  city: string ;
  "user subscription": boolean;
  "seller subscription": boolean;
}

interface LabourUser extends BaseUser {
  user_type: "LABOUR";
  phone: string;
  average_rating: number;
  id: number;
}

type User = RegularUser | LabourUser;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  checkUser: (email: string) => Promise<{ profileComplete: boolean }>;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  googleSignIn: () => Promise<any>;
  fetchUser: () => Promise<any>;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      setLoading(true);
      await loginAPI(usernameOrEmail, password);
      await fetchUser();
    } catch (error) {
      console.error("Login failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkUser = async (email: string) => {
    try {
      setLoading(true);
      const data = await checkUserProfile(email);
      return data;
    } catch (error) {
      console.error("Check user failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    try {
      setLoading(true);
      const response = await signInwithGoogle();
      await fetchUser();
      return response;
    } catch (error) {
      console.error("Google login failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutAPI();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, login, isAuthenticated, googleSignIn, checkUser, fetchUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

