import { tokenService } from './tokenService';
import { authAPI } from '../api/authAPI';

export const authService = {
  isAuthenticated: () => {
    return !!tokenService.getToken();
  },
  
  getCurrentUser: () => {
    return tokenService.getUser();
  },
  
  hasRole: (role) => {
    const user = tokenService.getUser();
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  },
  
  hasPermission: (permission) => {
    const user = tokenService.getUser();
    if (!user) return false;
    
    // Lógica de permisos basada en rol
    const permissions = {
      admin: ['view_dashboard', 'manage_products', 'manage_categories', 'manage_stock', 'view_reports', 'manage_users'],
      manager: ['view_dashboard', 'manage_products', 'manage_categories', 'manage_stock', 'view_reports'],
      user: ['view_dashboard', 'view_products', 'view_stock']
    };
    
    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes(permission);
  }
};