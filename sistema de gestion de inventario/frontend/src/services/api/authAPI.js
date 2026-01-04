import axiosInstance from './axiosConfig';

export const authAPI = {
  login: (email, password) => {
    return axiosInstance.post('/login', { email, password });
  },
  
  register: (userData) => {
    return axiosInstance.post('/register', userData);
  },
  
  logout: () => {
    return axiosInstance.post('/logout');
  },
  
  getUser: () => {
    return axiosInstance.get('/user');
  },
  
  updateProfile: (userData) => {
    return axiosInstance.put('/user/profile', userData);
  },
  
  changePassword: (passwordData) => {
    return axiosInstance.put('/user/password', passwordData);
  }
};