import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type OrgRole = 'ADMIN' | 'OWNER' | 'CO_OWNER';
type UserRole = OrgRole | 'LABOUR';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isLabourUser = 'user_type' in user && user.user_type === 'LABOUR';

  // Handle LABOUR user
  if (isLabourUser) {
    if (requiredRole && requiredRole !== 'LABOUR') {
      return <Navigate to="/worker/dashboard" replace />;
    }
    return <>{children}</>;
  }

  // Handle regular user
  if ('user_role' in user) {
    if (requiredRole && requiredRole !== 'LABOUR') {
      const roleHierarchy: Record<OrgRole, OrgRole[]> = {
        ADMIN: ["ADMIN"],
        OWNER: ["ADMIN", "OWNER"],
        CO_OWNER: ["ADMIN", "OWNER", "CO_OWNER"],
      };

      if (!roleHierarchy[requiredRole as OrgRole].includes(user.user_role as OrgRole)) {
        return <Navigate to="/" replace />;
      }
    }
  } else {
    // This case should not occur, but we'll handle it just in case
    console.error("User object is neither LabourUser nor RegularUser");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

