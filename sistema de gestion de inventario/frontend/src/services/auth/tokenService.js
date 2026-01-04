export const tokenService = {
  getToken: () => {
    return localStorage.getItem('auth_token');
  },
  
  setToken: (token) => {
    localStorage.setItem('auth_token', token);
  },
  
  removeToken: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
  
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  clear: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
};