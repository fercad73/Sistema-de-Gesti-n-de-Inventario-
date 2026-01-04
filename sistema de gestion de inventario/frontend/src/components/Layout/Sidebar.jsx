import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Nav, Button } from 'react-bootstrap';

const Sidebar = () => {
  const { isAuthenticated, isAdmin, isManager } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'fa-tachometer-alt',
      permission: 'view_dashboard',
      roles: ['admin', 'manager', 'user']
    },
    {
      title: 'Productos',
      path: '/products',
      icon: 'fa-box',
      permission: 'view_products',
      roles: ['admin', 'manager', 'user']
    },
    {
      title: 'Categorías',
      path: '/categories',
      icon: 'fa-tags',
      permission: 'manage_categories',
      roles: ['admin', 'manager']
    },
    {
      title: 'Movimientos',
      path: '/stock',
      icon: 'fa-exchange-alt',
      permission: 'manage_stock',
      roles: ['admin', 'manager', 'user']
    },
    {
      title: 'Reportes',
      path: '/reports',
      icon: 'fa-chart-bar',
      permission: 'view_reports',
      roles: ['admin', 'manager']
    },
    {
      title: 'Configuración',
      path: '/settings',
      icon: 'fa-cog',
      permission: 'view_dashboard',
      roles: ['admin', 'manager', 'user']
    }
  ];

  if (!isAuthenticated) return null;

  const filteredMenuItems = menuItems.filter(item => {
    if (item.roles && !item.roles.includes(getUserRole())) return false;
    return true;
  });

  function getUserRole() {
    const { user } = useAuth();
    return user?.role || 'user';
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`} style={{
      width: collapsed ? '60px' : '250px',
      transition: 'width 0.3s ease'
    }}>
      <div className="sidebar-header d-flex align-items-center justify-content-between p-3 border-bottom">
        {!collapsed && (
          <h5 className="mb-0">
            <i className="fas fa-boxes text-primary me-2"></i>
            <span>Menú</span>
          </h5>
        )}
        {collapsed && (
          <h5 className="mb-0 text-center">
            <i className="fas fa-boxes text-primary"></i>
          </h5>
        )}
        <Button 
          variant="link" 
          size="sm" 
          onClick={toggleSidebar}
          className="p-0"
          title={collapsed ? 'Expandir' : 'Colapsar'}
        >
          <i className={`fas fa-chevron-${collapsed ? 'right' : 'left'}`}></i>
        </Button>
      </div>
      
      <Nav className="flex-column p-3">
        {filteredMenuItems.map((item, index) => (
          <Nav.Item key={index} className="mb-1">
            <NavLink
              to={item.path}
              className={({ isActive }) => 
                `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
              }
              style={{
                padding: collapsed ? '0.75rem 0.5rem' : '0.75rem 1rem',
                justifyContent: collapsed ? 'center' : 'flex-start'
              }}
              title={collapsed ? item.title : ''}
            >
              <i className={`fas ${item.icon} ${collapsed ? 'fs-5' : 'me-3'}`}></i>
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          </Nav.Item>
        ))}
        
        {isAdmin && !collapsed && (
          <>
            <hr className="my-2" />
            <div className="text-muted small px-3 mb-2">Administración</div>
            <Nav.Item className="mb-1">
              <NavLink
                to="/admin/users"
                className={({ isActive }) => 
                  `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                }
                style={{
                  padding: '0.75rem 1rem'
                }}
              >
                <i className="fas fa-users me-3"></i>
                <span>Usuarios</span>
              </NavLink>
            </Nav.Item>
            <Nav.Item className="mb-1">
              <NavLink
                to="/admin/audit"
                className={({ isActive }) => 
                  `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                }
                style={{
                  padding: '0.75rem 1rem'
                }}
              >
                <i className="fas fa-history me-3"></i>
                <span>Auditoría</span>
              </NavLink>
            </Nav.Item>
          </>
        )}
      </Nav>
      
      {!collapsed && (
        <div className="sidebar-footer p-3 border-top">
          <div className="d-flex align-items-center">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
              {getUserInitials()}
            </div>
            <div>
              <div className="fw-bold">{getUserName()}</div>
              <small className="text-muted">{getUserRoleText()}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function getUserInitials() {
    const { user } = useAuth();
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  function getUserName() {
    const { user } = useAuth();
    return user?.name || 'Usuario';
  }

  function getUserRoleText() {
    const role = getUserRole();
    const roleTexts = {
      'admin': 'Administrador',
      'manager': 'Gerente',
      'user': 'Usuario'
    };
    return roleTexts[role] || 'Usuario';
  }
};

export default Sidebar;