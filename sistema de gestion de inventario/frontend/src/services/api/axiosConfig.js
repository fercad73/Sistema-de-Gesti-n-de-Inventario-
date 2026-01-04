import axios from 'axios';
import { tokenService } from '../auth/tokenService';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para agregar token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expirado o inválido
          tokenService.removeToken();
          window.location.href = '/login';
          break;
        case 403:
          // Acceso denegado
          console.error('Acceso denegado:', error.response.data.message);
          break;
        case 404:
          // Recurso no encontrado
          console.error('Recurso no encontrado');
          break;
        case 422:
          // Error de validación
          console.error('Error de validación:', error.response.data.errors);
          break;
        case 500:
          // Error del servidor
          console.error('Error del servidor:', error.response.data.message);
          break;
        default:
          console.error('Error desconocido:', error.response);
      }
    } else if (error.request) {
      // Error de red
      console.error('Error de red:', error.request);
    } else {
      // Error en la configuración
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;