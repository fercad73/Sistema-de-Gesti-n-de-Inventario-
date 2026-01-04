import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="login-page min-vh-100 d-flex align-items-center bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="text-center mb-5">
              <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <i className="fas fa-boxes text-white fa-2x"></i>
              </div>
              <h1 className="fw-bold mb-2">Sistema de Inventario</h1>
              <p className="text-muted">
                Gestión completa de productos, stock y reportes
              </p>
            </div>
            
            <LoginForm />
            
            <div className="text-center mt-4">
              <p className="text-muted small">
                &copy; {new Date().getFullYear()} Sistema de Inventario. Todos los derechos reservados.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;