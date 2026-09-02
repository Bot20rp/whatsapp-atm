import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authApi } from '../../../features/auth/api/auth.api';

export const GuestRoute: React.FC = () => {
  const isAuth = authApi.isAuthenticated();

  // Si ya está autenticado, redirige al dashboard
  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;

