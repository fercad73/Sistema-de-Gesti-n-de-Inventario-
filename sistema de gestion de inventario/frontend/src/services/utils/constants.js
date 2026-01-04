export const constants = {
  APP_NAME: process.env.REACT_APP_NAME || 'Sistema de Inventario',
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  
  ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    USER: 'user'
  },
  
  STOCK_STATUS: {
    IN_STOCK: 'in_stock',
    LOW_STOCK: 'low_stock',
    OUT_OF_STOCK: 'out_of_stock'
  },
  
  MOVEMENT_TYPES: {
    ENTRADA: 'entrada',
    SALIDA: 'salida',
    AJUSTE: 'ajuste',
    VENTA: 'venta',
    COMPRA: 'compra'
  },
  
  PERMISSIONS: {
    VIEW_DASHBOARD: 'view_dashboard',
    MANAGE_PRODUCTS: 'manage_products',
    MANAGE_CATEGORIES: 'manage_categories',
    MANAGE_STOCK: 'manage_stock',
    VIEW_REPORTS: 'view_reports',
    MANAGE_USERS: 'manage_users'
  },
  
  DEFAULT_PAGINATION: {
    PAGE: 1,
    PER_PAGE: 15,
    SORT_FIELD: 'created_at',
    SORT_DIRECTION: 'desc'
  },
  
  DATE_FORMATS: {
    SHORT: 'DD/MM/YYYY',
    LONG: 'DD/MM/YYYY HH:mm',
    API: 'YYYY-MM-DD'
  },
  
  STOCK_ALERT_THRESHOLD: 10, // Porcentaje para alertas de stock bajo
  
  UNITS: [
    'unidad',
    'pieza',
    'kg',
    'gramo',
    'litro',
    'ml',
    'metro',
    'cm',
    'paquete',
    'caja',
    'botella',
    'lata'
  ],
  
  CATEGORY_COLORS: [
    '#007bff', // Azul
    '#dc3545', // Rojo
    '#28a745', // Verde
    '#ffc107', // Amarillo
    '#17a2b8', // Cian
    '#6c757d', // Gris
    '#fd7e14', // Naranja
    '#e83e8c', // Rosa
    '#20c997', // Verde agua
    '#6610f2'  // Púrpura
  ],
  
  CATEGORY_ICONS: [
    'fa-box',
    'fa-tag',
    'fa-cube',
    'fa-cubes',
    'fa-shopping-cart',
    'fa-store',
    'fa-warehouse',
    'fa-pallet',
    'fa-boxes',
    'fa-archive'
  ]
};