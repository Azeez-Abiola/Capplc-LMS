import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Only show spinner during the initial auth check (very brief)
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500 mb-4" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verifying session...</p>
      </div>
    );
  }

  // Not logged in — go to login
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If profile loaded AND role doesn't match, redirect to correct dashboard
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    const redirectPath = profile.role === 'super_admin' ? '/super-admin' : 
                         profile.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated — render the page
  // (profile might still be loading in the background, that's OK)
  return <Outlet />;
};

export default ProtectedRoute;
