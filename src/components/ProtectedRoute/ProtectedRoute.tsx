import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type OrgRole = 'USER' | 'OWNER' | 'CO_OWNER';
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

  if (user.user_type === 'LABOUR') {
    if (requiredRole && requiredRole !== 'LABOUR') {
      return <Navigate to="/worker/dashboard" replace />;
    }
    return <>{children}</>;
  }

  if (user.user_type === 'USER') {
    if (requiredRole && requiredRole !== 'LABOUR') {
      const roleHierarchy: Record<OrgRole, OrgRole[]> = {
        USER: ["USER"],
        OWNER: ["USER", "OWNER"],
        CO_OWNER: ["USER", "OWNER", "CO_OWNER"],
      };

      if (!roleHierarchy[requiredRole as OrgRole].includes(user.user_role)) {
        return <Navigate to="/" replace />;
      }
    }
  } else {
    // This case should not occur, but we'll handle it just in case
    console.error("User object is neither LABOUR nor USER");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

