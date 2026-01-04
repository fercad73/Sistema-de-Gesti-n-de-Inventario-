import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validators } from '../../services/utils/validators';
import { Button, Form, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

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
      name: [
        validators.required,
        validators.minLength(2),
        validators.maxLength(100)
      ],
      email: [
        validators.required,
        validators.email
      ],
      password: [
        validators.required,
        validators.minLength(6)
      ],
      password_confirmation: [
        validators.required,
        validators.confirmPassword('password')
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
    setSuccess(false);
    
    const result = await register(formData);
    
    setLoading(false);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Body className="p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
            <i className="fas fa-user-plus text-white fs-3"></i>
          </div>
          <h3 className="fw-bold">Crear Cuenta</h3>
          <p className="text-muted">Regístrate para comenzar a usar el sistema</p>
        </div>
        
        {authError && (
          <Alert variant="danger" dismissible onClose={() => {}}>
            <i className="fas fa-exclamation-circle me-2"></i>
            {authError}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success">
            <i className="fas fa-check-circle me-2"></i>
            ¡Registro exitoso! Redirigiendo al dashboard...
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre Completo</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  placeholder="Juan Pérez"
                  disabled={loading || success}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              placeholder="usuario@ejemplo.com"
              disabled={loading || success}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  placeholder="••••••••"
                  disabled={loading || success}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Mínimo 6 caracteres
                </Form.Text>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  isInvalid={!!errors.password_confirmation}
                  placeholder="••••••••"
                  disabled={loading || success}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password_confirmation}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-4">
            <Form.Label>Tipo de Usuario</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading || success}
            >
              <option value="user">Usuario Normal</option>
              <option value="manager">Gerente</option>
              <option value="admin">Administrador</option>
            </Form.Select>
            <Form.Text className="text-muted">
              Solo los administradores pueden crear cuentas de administrador
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              id="terms"
              label={
                <>
                  Acepto los{' '}
                  <Link to="/terms" className="text-decoration-none">
                    términos y condiciones
                  </Link>
                </>
              }
              required
              disabled={loading || success}
            />
          </Form.Group>
          
          <Button
            variant="primary"
            type="submit"
            className="w-100 py-3"
            disabled={loading || success}
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
                Creando cuenta...
              </>
            ) : success ? (
              <>
                <i className="fas fa-check me-2"></i>
                ¡Cuenta creada!
              </>
            ) : (
              <>
                <i className="fas fa-user-plus me-2"></i>
                Crear Cuenta
              </>
            )}
          </Button>
        </Form>
        
        <div className="text-center mt-4">
          <p className="text-muted mb-0">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-decoration-none fw-semibold">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RegisterForm;