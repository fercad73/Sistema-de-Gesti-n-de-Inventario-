import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api/authAPI';
import { tokenService } from '../services/auth/tokenService';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = tokenService.getToken();
      if (token) {
        const response = await authAPI.getUser();
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          tokenService.removeToken();
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      tokenService.removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login(email, password);
      
      if (response.data.success) {
        const { user, token } = response.data;
        tokenService.setToken(token);
        setUser(user);
        return { success: true, user };
      } else {
        throw new Error(response.data.message || 'Error en el login');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error en el servidor');
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        const { user, token } = response.data;
        tokenService.setToken(token);
        setUser(user);
        return { success: true, user };
      } else {
        throw new Error(response.data.message || 'Error en el registro');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error en el servidor');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenService.removeToken();
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager' || user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};