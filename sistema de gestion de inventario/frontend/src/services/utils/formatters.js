export const formatters = {
  formatCurrency: (value, currency = 'USD', locale = 'es-ES') => {
    if (value === null || value === undefined) return '';
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) return '';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  },
  
  formatNumber: (value, decimals = 2, locale = 'es-ES') => {
    if (value === null || value === undefined) return '';
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) return '';
    
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  },
  
  formatDate: (date, format = 'short', locale = 'es-ES') => {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) return '';
    
    const options = {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      },
      time: {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      },
      datetime: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    };
    
    return dateObj.toLocaleDateString(locale, options[format] || options.short);
  },
  
  formatStockStatus: (status) => {
    const statusMap = {
      'in_stock': { text: 'Disponible', class: 'success', icon: 'fa-check-circle' },
      'low_stock': { text: 'Stock Bajo', class: 'warning', icon: 'fa-exclamation-triangle' },
      'out_of_stock': { text: 'Agotado', class: 'danger', icon: 'fa-times-circle' }
    };
    
    return statusMap[status] || { text: 'Desconocido', class: 'secondary', icon: 'fa-question-circle' };
  },
  
  formatMovementType: (type) => {
    const typeMap = {
      'entrada': { text: 'Entrada', class: 'success', icon: 'fa-arrow-down' },
      'salida': { text: 'Salida', class: 'danger', icon: 'fa-arrow-up' },
      'ajuste': { text: 'Ajuste', class: 'warning', icon: 'fa-exchange-alt' },
      'venta': { text: 'Venta', class: 'info', icon: 'fa-shopping-cart' },
      'compra': { text: 'Compra', class: 'primary', icon: 'fa-truck' }
    };
    
    return typeMap[type] || { text: type, class: 'secondary', icon: 'fa-question-circle' };
  },
  
  truncateText: (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
  },
  
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  formatPercentage: (value, decimals = 2) => {
    if (value === null || value === undefined) return '';
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) return '';
    
    return num.toFixed(decimals) + '%';
  },
  
  capitalize: (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
};