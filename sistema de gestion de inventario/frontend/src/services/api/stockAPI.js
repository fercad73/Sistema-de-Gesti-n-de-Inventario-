import axiosInstance from './axiosConfig';

export const stockAPI = {
  getAllMovements: (params = {}) => {
    return axiosInstance.get('/stock-movements', { params });
  },
  
  getMovementById: (id) => {
    return axiosInstance.get(`/stock-movements/${id}`);
  },
  
  getStatistics: (params = {}) => {
    return axiosInstance.get('/stock-movements/statistics', { params });
  },
  
  getRecentMovements: () => {
    return axiosInstance.get('/stock-movements/recent');
  }
};