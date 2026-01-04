import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/Layout/PrivateRoute';
import AdminRoute from '../components/Layout/AdminRoute';

// Páginas de autenticación
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// Páginas principales
import DashboardPage from '../pages/DashboardPage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CategoriesPage from '../pages/CategoriesPage';
import StockHistoryPage from '../pages/StockHistoryPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Redirección raíz */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/products"
        element={
          <PrivateRoute>
            <ProductsPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/products/new"
        element={
          <PrivateRoute requiredPermission="manage_products">
            <ProductDetailPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/products/edit/:id"
        element={
          <PrivateRoute requiredPermission="manage_products">
            <ProductDetailPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/products/:id"
        element={
          <PrivateRoute>
            <ProductDetailPage viewOnly />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/categories"
        element={
          <PrivateRoute requiredPermission="manage_categories">
            <CategoriesPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/stock"
        element={
          <PrivateRoute requiredPermission="manage_stock">
            <StockHistoryPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/reports"
        element={
          <PrivateRoute requiredPermission="view_reports">
            <ReportsPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />
      
      {/* Rutas de administración */}
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <div className="p-4">
              <h4>Administración de Usuarios</h4>
              <p>Funcionalidad en desarrollo...</p>
            </div>
          </AdminRoute>
        }
      />
      
      {/* Ruta 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;