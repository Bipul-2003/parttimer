import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'OWNER' | 'CO_OWNER';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, loading } = useAuth();
  const { orgId } = useParams<{ orgId: string }>();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (orgId && user.organization?.id !== parseInt(orgId, 10)) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole) {
    const roleHierarchy = {
      ADMIN: ["ADMIN"],
      OWNER: ["ADMIN", "OWNER"],
      CO_OWNER: ["ADMIN", "OWNER", "CO_OWNER"],
    };

    if (!roleHierarchy[requiredRole].includes(user.user_role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};


export default ProtectedRoute;