import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validators } from '../../services/utils/validators';
import { Button, Form, Card, Alert, Spinner } from 'react-bootstrap';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const validationRules = {
      email: [
        validators.required,
        validators.email
      ],
      password: [
        validators.required,
        validators.minLength(6)
      ]
    };

    const result = validators.validateForm(formData, validationRules);
    setErrors(result.errors);
    return result.isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    const result = await login(formData.email, formData.password);
    
    setLoading(false);
    
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Body className="p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
            <i className="fas fa-boxes text-white fs-3"></i>
          </div>
          <h3 className="fw-bold">Iniciar Sesión</h3>
          <p className="text-muted">Ingresa tus credenciales para acceder al sistema</p>
        </div>
        
        {authError && (
          <Alert variant="danger" dismissible onClose={() => {}}>
            <i className="fas fa-exclamation-circle me-2"></i>
            {authError}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              placeholder="usuario@ejemplo.com"
              disabled={loading}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
              placeholder="••••••••"
              disabled={loading}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Form.Check
              type="checkbox"
              id="rememberMe"
              label="Recordarme"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
            
            <Link to="/forgot-password" className="text-decoration-none">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          
          <Button
            variant="primary"
            type="submit"
            className="w-100 py-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Iniciando sesión...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt me-2"></i>
                Iniciar Sesión
              </>
            )}
          </Button>
        </Form>
        
        <div className="text-center mt-4">
          <p className="text-muted mb-0">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-decoration-none fw-semibold">
              Regístrate aquí
            </Link>
          </p>
        </div>
        
        <div className="text-center mt-4">
          <small className="text-muted">
            Credenciales de prueba: admin@inventario.com / password
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LoginForm;