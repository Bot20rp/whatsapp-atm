import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authApi } from '../../../features/auth/api/auth.api';

export const ProtectedRoute: React.FC = () => {
  const isAuth = authApi.isAuthenticated();

  // Si no hay token de autenticación, redirige al login
  if (!isAuth) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

