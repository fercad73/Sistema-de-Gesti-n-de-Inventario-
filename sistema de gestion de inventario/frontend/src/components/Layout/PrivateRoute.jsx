import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import MainLayout from './MainLayout';

const PrivateRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar rol requerido
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Verificar permiso requerido (implementación básica)
  if (requiredPermission) {
    const hasPermission = checkPermission(user?.role, requiredPermission);
    if (!hasPermission) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <MainLayout>{children}</MainLayout>;
};

// Función auxiliar para verificar permisos
const checkPermission = (userRole, requiredPermission) => {
  const permissions = {
    admin: ['view_dashboard', 'manage_products', 'manage_categories', 'manage_stock', 'view_reports', 'manage_users'],
    manager: ['view_dashboard', 'manage_products', 'manage_categories', 'manage_stock', 'view_reports'],
    user: ['view_dashboard', 'view_products', 'view_stock']
  };

  return permissions[userRole]?.includes(requiredPermission) || false;
};

export default PrivateRoute;