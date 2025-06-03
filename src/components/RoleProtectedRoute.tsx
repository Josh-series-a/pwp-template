
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [],
  redirectTo = '/'
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get user role from metadata (defaulting to 'User' if not set)
  const userRole = user?.user_metadata?.role || 'User';
  
  // Temporary admin access for colinfc@btinternet.com to set up roles
  const isTemporaryAdmin = user?.email === 'colinfc@btinternet.com';
  
  console.log('RoleProtectedRoute - User:', user?.email);
  console.log('RoleProtectedRoute - User metadata:', user?.user_metadata);
  console.log('RoleProtectedRoute - Detected role:', userRole);
  console.log('RoleProtectedRoute - Allowed roles:', allowedRoles);
  console.log('RoleProtectedRoute - Is temporary admin:', isTemporaryAdmin);
  
  // Check if user has required role or is temporary admin
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole) && !isTemporaryAdmin) {
    console.log('RoleProtectedRoute - Access denied, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
