import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Container, Navbar as BootstrapNavbar, Nav, Dropdown, Image, Button } from 'react-bootstrap';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setExpanded(false);
  };

  const toggleNavbar = () => {
    setExpanded(!expanded);
  };

  const closeNavbar = () => {
    setExpanded(false);
  };

  return (
    <BootstrapNavbar bg="white" expand="lg" fixed="top" className="shadow-sm" expanded={expanded}>
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <i className="fas fa-boxes text-primary me-2"></i>
          <span className="fw-bold">Inventario</span>
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={toggleNavbar}
        />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          {isAuthenticated && (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard" onClick={closeNavbar}>
                <i className="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/products" onClick={closeNavbar}>
                <i className="fas fa-box me-1"></i>
                Productos
              </Nav.Link>
              <Nav.Link as={Link} to="/categories" onClick={closeNavbar}>
                <i className="fas fa-tags me-1"></i>
                Categorías
              </Nav.Link>
              <Nav.Link as={Link} to="/stock" onClick={closeNavbar}>
                <i className="fas fa-exchange-alt me-1"></i>
                Movimientos
              </Nav.Link>
              <Nav.Link as={Link} to="/reports" onClick={closeNavbar}>
                <i className="fas fa-chart-bar me-1"></i>
                Reportes
              </Nav.Link>
            </Nav>
          )}
          
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="dropdown-user" className="d-flex align-items-center">
                  {user?.image_url ? (
                    <Image 
                      src={user.image_url} 
                      roundedCircle 
                      width="32" 
                      height="32" 
                      className="me-2"
                    />
                  ) : (
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="d-none d-md-inline">{user?.name}</span>
                </Dropdown.Toggle>
                
                <Dropdown.Menu>
                  <Dropdown.Header>
                    <div className="fw-bold">{user?.name}</div>
                    <small className="text-muted">{user?.email}</small>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/profile" onClick={closeNavbar}>
                    <i className="fas fa-user me-2"></i>
                    Mi Perfil
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/settings" onClick={closeNavbar}>
                    <i className="fas fa-cog me-2"></i>
                    Configuración
                  </Dropdown.Item>
                  {user?.role === 'admin' && (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to="/admin/users" onClick={closeNavbar}>
                        <i className="fas fa-users me-2"></i>
                        Administrar Usuarios
                      </Dropdown.Item>
                    </>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Cerrar Sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={closeNavbar}>
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={Link} to="/register" onClick={closeNavbar}>
                  <i className="fas fa-user-plus me-1"></i>
                  Registrarse
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;