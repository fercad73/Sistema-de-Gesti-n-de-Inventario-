import axiosInstance from './axiosConfig';

export const reportAPI = {
  generateReport: (reportData) => {
    return axiosInstance.post('/reports/generate', reportData, {
      responseType: 'blob'
    });
  },
  
  getDashboardStatistics: () => {
    return axiosInstance.get('/dashboard/statistics');
  },
  
  getRecentActivity: () => {
    return axiosInstance.get('/dashboard/recent-activity');
  },
  
  getAlerts: () => {
    return axiosInstance.get('/dashboard/alerts');
  }
};