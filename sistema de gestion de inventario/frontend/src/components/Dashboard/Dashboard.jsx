import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { reportAPI } from '../../services/api/reportAPI';
import { productAPI } from '../../services/api/productAPI';
import { formatters } from '../../services/utils/formatters';
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Badge,
  Alert,
  ProgressBar,
  Spinner
} from 'react-bootstrap';
import StatsCard from './StatsCard';
import InventoryChart from './InventoryChart';
import LoadingSpinner from '../Common/LoadingSpinner';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState({ low_stock_alerts: [], out_of_stock_alerts: [] });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener estadísticas
      const statsResponse = await reportAPI.getDashboardStatistics();
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }
      
      // Obtener actividad reciente
      const activityResponse = await reportAPI.getRecentActivity();
      if (activityResponse.data.success) {
        setRecentActivity(activityResponse.data.data);
      }
      
      // Obtener alertas
      const alertsResponse = await reportAPI.getAlerts();
      if (alertsResponse.data.success) {
        setAlerts(alertsResponse.data.data);
      }
      
      // Obtener productos con stock bajo
      const lowStockResponse = await productAPI.getLowStock({ per_page: 5 });
      if (lowStockResponse.data.success) {
        setLowStockProducts(lowStockResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };
  
  const refreshData = () => {
    fetchDashboardData();
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };
  
  return (
    <div className="dashboard">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Usuario'}
          </h4>
          <p className="text-muted mb-0">
            Bienvenido al sistema de gestión de inventario
          </p>
        </div>
        
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            onClick={refreshData}
            disabled={loading}
          >
            <i className={`fas fa-sync ${loading ? 'fa-spin' : ''} me-2`}></i>
            Actualizar
          </Button>
          
          <Button
            variant="primary"
            as={Link}
            to="/products/new"
          >
            <i className="fas fa-plus me-2"></i>
            Nuevo Producto
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}
      
      {/* Alertas importantes */}
      {(alerts.low_stock_alerts?.length > 0 || alerts.out_of_stock_alerts?.length > 0) && (
        <Row className="mb-4">
          <Col md={12}>
            <Card className="border-warning shadow-sm">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center">
                  <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                    <i className="fas fa-exclamation-triangle text-white"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1">Alertas de Stock</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {alerts.out_of_stock_alerts?.length > 0 && (
                        <Badge bg="danger">
                          <i className="fas fa-times-circle me-1"></i>
                          {alerts.out_of_stock_alerts.length} productos agotados
                        </Badge>
                      )}
                      {alerts.low_stock_alerts?.length > 0 && (
                        <Badge bg="warning" text="dark">
                          <i className="fas fa-exclamation-triangle me-1"></i>
                          {alerts.low_stock_alerts.length} productos con stock bajo
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    as={Link}
                    to="/products"
                  >
                    Ver Detalles
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      {/* Estadísticas principales */}
      <Row className="mb-4">
        <Col md={3} sm={6}>
          <StatsCard
            title="Total Productos"
            value={stats?.total_products || 0}
            icon="fa-boxes"
            color="primary"
            trend={stats?.total_products > 0 ? 'up' : 'neutral'}
            description="Productos en inventario"
          />
        </Col>
        
        <Col md={3} sm={6}>
          <StatsCard
            title="Valor Total"
            value={formatters.formatCurrency(stats?.total_value || 0)}
            icon="fa-dollar-sign"
            color="success"
            trend="up"
            description="Valor del inventario"
          />
        </Col>
        
        <Col md={3} sm={6}>
          <StatsCard
            title="Stock Bajo"
            value={stats?.low_stock_count || 0}
            icon="fa-exclamation-triangle"
            color="warning"
            trend={stats?.low_stock_count > 0 ? 'up' : 'down'}
            description="Necesitan reabastecimiento"
          />
        </Col>
        
        <Col md={3} sm={6}>
          <StatsCard
            title="Agotados"
            value={stats?.out_of_stock_count || 0}
            icon="fa-times-circle"
            color="danger"
            trend={stats?.out_of_stock_count > 0 ? 'up' : 'down'}
            description="Sin stock disponible"
          />
        </Col>
      </Row>
      
      {/* Gráfico y actividad reciente */}
      <Row className="mb-4">
        <Col md={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 fw-semibold">
                <i className="fas fa-chart-line me-2 text-primary"></i>
                Valor del Inventario (Últimos 7 días)
              </h6>
            </Card.Header>
            <Card.Body>
              <InventoryChart data={stats?.inventory_value_trend || []} />
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 fw-semibold">
                <i className="fas fa-history me-2 text-primary"></i>
                Actividad Reciente
              </h6>
            </Card.Header>
            <Card.Body className="p-0">
              {recentActivity.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-history fa-2x text-muted mb-3"></i>
                  <p className="text-muted mb-0">No hay actividad reciente</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="list-group-item border-0">
                      <div className="d-flex align-items-center">
                        <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                          activity.type === 'entrada' ? 'bg-success' :
                          activity.type === 'salida' ? 'bg-danger' :
                          'bg-warning'
                        }`} style={{ width: '32px', height: '32px' }}>
                          <i className={`fas ${
                            activity.type === 'entrada' ? 'fa-arrow-down' :
                            activity.type === 'salida' ? 'fa-arrow-up' :
                            'fa-exchange-alt'
                          } text-white`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{activity.product?.name || 'Producto'}</div>
                          <small className="text-muted">
                            {formatters.formatDate(activity.movement_date, 'time')} • {activity.type}
                          </small>
                        </div>
                        <Badge bg={
                          activity.type === 'entrada' ? 'success' :
                          activity.type === 'salida' ? 'danger' :
                          'warning'
                        }>
                          {activity.quantity_change}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
            <Card.Footer className="bg-white border-top text-center">
              <Button
                variant="link"
                size="sm"
                as={Link}
                to="/stock"
                className="text-decoration-none"
              >
                Ver todo el historial
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      
      {/* Productos con stock bajo y movimientos por tipo */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 fw-semibold">
                <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
                Productos con Stock Bajo
              </h6>
            </Card.Header>
            <Card.Body className="p-0">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-check-circle fa-2x text-success mb-3"></i>
                  <p className="text-muted mb-0">¡Excelente! Todo el stock está en niveles óptimos</p>
                </div>
              ) : (
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Stock</th>
                      <th>Mínimo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className="fw-semibold">{product.name}</div>
                          <small className="text-muted">{product.sku}</small>
                        </td>
                        <td>
                          <Badge bg="warning" text="dark">
                            {product.stock_quantity}
                          </Badge>
                        </td>
                        <td>{product.minimum_stock}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            as={Link}
                            to={`/products/edit/${product.id}`}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
            <Card.Footer className="bg-white border-top">
              <Button
                variant="warning"
                size="sm"
                as={Link}
                to="/products?stock_status=low"
                className="w-100"
              >
                <i className="fas fa-list me-2"></i>
                Ver todos los productos con stock bajo
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 fw-semibold">
                <i className="fas fa-chart-pie me-2 text-primary"></i>
                Movimientos por Tipo (Últimos 30 días)
              </h6>
            </Card.Header>
            <Card.Body>
              {stats?.movements_by_type?.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-chart-bar fa-2x text-muted mb-3"></i>
                  <p className="text-muted mb-0">No hay movimientos en el período</p>
                </div>
              ) : (
                <div>
                  {stats?.movements_by_type?.map((item, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="fw-semibold">
                          <i className={`fas ${
                            item.type === 'entrada' ? 'fa-arrow-down text-success' :
                            item.type === 'salida' ? 'fa-arrow-up text-danger' :
                            'fa-exchange-alt text-warning'
                          } me-2`}></i>
                          {item.type === 'entrada' ? 'Entradas' :
                           item.type === 'salida' ? 'Salidas' :
                           item.type === 'ajuste' ? 'Ajustes' : item.type}
                        </span>
                        <span className="fw-semibold">{item.count}</span>
                      </div>
                      <ProgressBar
                        now={(item.count / Math.max(...stats.movements_by_type.map(m => m.count))) * 100}
                        variant={
                          item.type === 'entrada' ? 'success' :
                          item.type === 'salida' ? 'danger' :
                          'warning'
                        }
                        style={{ height: '8px' }}
                      />
                    </div>
                  ))}
                  
                  <div className="mt-4">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Total movimientos:</span>
                      <span className="fw-semibold">
                        {stats?.movements_by_type?.reduce((sum, item) => sum + item.count, 0) || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Acciones rápidas */}
      <Row>
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 fw-semibold">
                <i className="fas fa-bolt me-2 text-primary"></i>
                Acciones Rápidas
              </h6>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={3} sm={6}>
                  <Button
                    variant="outline-primary"
                    className="w-100 h-100 py-3 d-flex flex-column align-items-center justify-content-center"
                    as={Link}
                    to="/products/new"
                  >
                    <i className="fas fa-plus fa-2x mb-2"></i>
                    <span>Nuevo Producto</span>
                  </Button>
                </Col>
                
                <Col md={3} sm={6}>
                  <Button
                    variant="outline-success"
                    className="w-100 h-100 py-3 d-flex flex-column align-items-center justify-content-center"
                    as={Link}
                    to="/products?stock_status=low"
                  >
                    <i className="fas fa-exclamation-triangle fa-2x mb-2"></i>
                    <span>Ver Stock Bajo</span>
                  </Button>
                </Col>
                
                <Col md={3} sm={6}>
                  <Button
                    variant="outline-info"
                    className="w-100 h-100 py-3 d-flex flex-column align-items-center justify-content-center"
                    as={Link}
                    to="/stock"
                  >
                    <i className="fas fa-exchange-alt fa-2x mb-2"></i>
                    <span>Movimientos</span>
                  </Button>
                </Col>
                
                <Col md={3} sm={6}>
                  <Button
                    variant="outline-warning"
                    className="w-100 h-100 py-3 d-flex flex-column align-items-center justify-content-center"
                    as={Link}
                    to="/reports"
                  >
                    <i className="fas fa-chart-bar fa-2x mb-2"></i>
                    <span>Reportes</span>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;