import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { Navigate } from 'react-router-dom';

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

  const isLabourRole = user.user_role === 'LABOUR';

  // Handle LABOUR role
  if (isLabourRole) {
    if (requiredRole && requiredRole !== 'LABOUR') {
      return <Navigate to="/worker/dashboard" replace />;
    }
    return <>{children}</>;
  }

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

  return <>{children}</>;
};

export default ProtectedRoute;

