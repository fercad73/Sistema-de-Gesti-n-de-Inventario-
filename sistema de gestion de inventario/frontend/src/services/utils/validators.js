export const validators = {
  required: (value) => {
    if (!value || value.toString().trim() === '') {
      return 'Este campo es requerido';
    }
    return null;
  },
  
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return 'Ingrese un correo electrónico válido';
    }
    return null;
  },
  
  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Mínimo ${min} caracteres`;
    }
    return null;
  },
  
  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Máximo ${max} caracteres`;
    }
    return null;
  },
  
  minValue: (min) => (value) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num < min) {
      return `El valor mínimo es ${min}`;
    }
    return null;
  },
  
  maxValue: (max) => (value) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > max) {
      return `El valor máximo es ${max}`;
    }
    return null;
  },
  
  numeric: (value) => {
    if (value && isNaN(parseFloat(value))) {
      return 'Ingrese un número válido';
    }
    return null;
  },
  
  positive: (value) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num < 0) {
      return 'El valor debe ser positivo';
    }
    return null;
  },
  
  confirmPassword: (passwordField) => (value, formValues) => {
    if (value !== formValues[passwordField]) {
      return 'Las contraseñas no coinciden';
    }
    return null;
  },
  
  sku: (value) => {
    const skuRegex = /^[A-Z0-9-]+$/;
    if (value && !skuRegex.test(value)) {
      return 'SKU solo puede contener letras mayúsculas, números y guiones';
    }
    return null;
  },
  
  phone: (value) => {
    const phoneRegex = /^[0-9+\-\s()]{10,20}$/;
    if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Ingrese un número de teléfono válido';
    }
    return null;
  },
  
  validateForm: (formData, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      const fieldRules = rules[field];
      const value = formData[field];
      
      if (Array.isArray(fieldRules)) {
        for (const rule of fieldRules) {
          const error = rule(value, formData);
          if (error) {
            errors[field] = error;
            break;
          }
        }
      } else if (typeof fieldRules === 'function') {
        const error = fieldRules(value, formData);
        if (error) {
          errors[field] = error;
        }
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};