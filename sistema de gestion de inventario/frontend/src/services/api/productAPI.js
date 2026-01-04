import axiosInstance from './axiosConfig';

export const productAPI = {
  getAll: (params = {}) => {
    return axiosInstance.get('/products', { params });
  },
  
  getById: (id) => {
    return axiosInstance.get(`/products/${id}`);
  },
  
  create: (productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });
    
    return axiosInstance.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  update: (id, productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });
    
    return axiosInstance.post(`/products/${id}?_method=PUT`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  delete: (id) => {
    return axiosInstance.delete(`/products/${id}`);
  },
  
  updateStock: (id, stockData) => {
    return axiosInstance.post(`/products/${id}/stock`, stockData);
  },
  
  getLowStock: (params = {}) => {
    return axiosInstance.get('/products/low-stock', { params });
  },
  
  getStatistics: () => {
    return axiosInstance.get('/products/statistics');
  },
  
  search: (query, params = {}) => {
    return axiosInstance.get('/products', {
      params: { ...params, search: query }
    });
  }
};