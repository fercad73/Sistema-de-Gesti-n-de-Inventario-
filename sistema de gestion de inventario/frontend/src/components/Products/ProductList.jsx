import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI } from '../../services/api/productAPI';
import { categoryAPI } from '../../services/api/categoryAPI';
import { formatters } from '../../services/utils/formatters';
import { validators } from '../../services/utils/validators';
import {
  Table,
  Button,
  Card,
  Row,
  Col,
  Form,
  InputGroup,
  Badge,
  Dropdown,
  Pagination,
  Alert,
  Spinner,
  Modal
} from 'react-bootstrap';
import ProductFilter from './ProductFilter';
import ProductActions from './ProductActions';
import ConfirmDialog from '../Common/ConfirmDialog';
import LoadingSpinner from '../Common/LoadingSpinner';
import EmptyState from '../Common/EmptyState';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estado para filtros y paginación
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    stock_status: '',
    min_price: '',
    max_price: '',
    sort_field: 'created_at',
    sort_direction: 'desc'
  });
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  });
  
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const { isAdmin, isManager } = useAuth();
  const navigate = useNavigate();
  
  // Cargar productos y categorías
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters, pagination.current_page]);
  
  const fetchProducts = async () => {
    try {
      setFilterLoading(true);
      setError(null);
      
      const params = {
        ...filters,
        page: pagination.current_page,
        per_page: pagination.per_page
      };
      
      const response = await productAPI.getAll(params);
      
      if (response.data.success) {
        setProducts(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('Error al cargar los productos');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error al cargar los productos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };
  
  const handleSearch = (searchTerm) => {
    handleFilterChange({ search: searchTerm });
  };
  
  const handleSort = (field) => {
    const direction = filters.sort_field === field && filters.sort_direction === 'asc' ? 'desc' : 'asc';
    handleFilterChange({ sort_field: field, sort_direction: direction });
  };
  
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };
  
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    try {
      const response = await productAPI.delete(productToDelete.id);
      
      if (response.data.success) {
        setSuccess(`Producto "${productToDelete.name}" eliminado exitosamente`);
        fetchProducts(); // Recargar la lista
      } else {
        setError('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Error al eliminar el producto. Por favor, intenta de nuevo.');
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
    }
  };
  
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    
    try {
      // Aquí implementarías la eliminación masiva
      // Por ahora, eliminamos uno por uno
      for (const productId of selectedProducts) {
        await productAPI.delete(productId);
      }
      
      setSuccess(`${selectedProducts.length} productos eliminados exitosamente`);
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error('Error in bulk delete:', error);
      setError('Error al eliminar los productos seleccionados');
    }
  };
  
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };
  
  const getSortIcon = (field) => {
    if (filters.sort_field !== field) return 'fa-sort';
    return filters.sort_direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  };
  
  const getStockBadge = (product) => {
    const status = formatters.formatStockStatus(product.stock_status);
    return (
      <Badge bg={status.class} className="badge-stock">
        <i className={`fas ${status.icon} me-1`}></i>
        {status.text}
      </Badge>
    );
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="product-list">
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-0">Gestión de Productos</h4>
              <p className="text-muted mb-0">
                Total: {pagination.total} productos
                {filters.search && ` • Buscando: "${filters.search}"`}
              </p>
            </div>
            
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                onClick={fetchProducts}
                disabled={filterLoading}
              >
                <i className={`fas fa-sync ${filterLoading ? 'fa-spin' : ''} me-2`}></i>
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
          
          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
              <i className="fas fa-check-circle me-2"></i>
              {success}
            </Alert>
          )}
          
          {/* Filtros */}
          <ProductFilter
            filters={filters}
            categories={categories}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            loading={filterLoading}
          />
          
          {/* Acciones masivas */}
          {selectedProducts.length > 0 && (
            <Card className="mb-3 border-warning">
              <Card.Body className="py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <i className="fas fa-check-circle text-warning me-2"></i>
                    <span className="fw-semibold">{selectedProducts.length} productos seleccionados</span>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => setSelectedProducts([])}
                    >
                      <i className="fas fa-times me-2"></i>
                      Deseleccionar
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={handleBulkDelete}
                    >
                      <i className="fas fa-trash me-2"></i>
                      Eliminar Seleccionados
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
          
          {/* Tabla de productos */}
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>
                    <Form.Check
                      type="checkbox"
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onChange={handleSelectAll}
                      disabled={products.length === 0}
                    />
                  </th>
                  <th>
                    <Button
                      variant="link"
                      className="p-0 text-decoration-none text-dark fw-semibold"
                      onClick={() => handleSort('sku')}
                    >
                      SKU
                      <i className={`fas ${getSortIcon('sku')} ms-2`}></i>
                    </Button>
                  </th>
                  <th>
                    <Button
                      variant="link"
                      className="p-0 text-decoration-none text-dark fw-semibold"
                      onClick={() => handleSort('name')}
                    >
                      Nombre
                      <i className={`fas ${getSortIcon('name')} ms-2`}></i>
                    </Button>
                  </th>
                  <th>Categoría</th>
                  <th>
                    <Button
                      variant="link"
                      className="p-0 text-decoration-none text-dark fw-semibold"
                      onClick={() => handleSort('stock_quantity')}
                    >
                      Stock
                      <i className={`fas ${getSortIcon('stock_quantity')} ms-2`}></i>
                    </Button>
                  </th>
                  <th>
                    <Button
                      variant="link"
                      className="p-0 text-decoration-none text-dark fw-semibold"
                      onClick={() => handleSort('price')}
                    >
                      Precio
                      <i className={`fas ${getSortIcon('price')} ms-2`}></i>
                    </Button>
                  </th>
                  <th>Ubicación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <EmptyState
                        icon="fa-box-open"
                        title="No hay productos"
                        description={filters.search ? 'No se encontraron productos con los filtros aplicados' : 'No hay productos registrados en el sistema'}
                      />
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id} className={selectedProducts.includes(product.id) ? 'table-warning' : ''}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                        />
                      </td>
                      <td>
                        <div className="fw-semibold">{product.sku}</div>
                        {product.barcode && (
                          <small className="text-muted">Código: {product.barcode}</small>
                        )}
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="rounded me-3"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="bg-light rounded d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                              <i className="fas fa-box text-muted"></i>
                            </div>
                          )}
                          <div>
                            <div className="fw-semibold">{product.name}</div>
                            {product.description && (
                              <small className="text-muted text-ellipsis" style={{ maxWidth: '200px' }}>
                                {formatters.truncateText(product.description, 50)}
                              </small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        {product.category ? (
                          <Badge
                            style={{
                              backgroundColor: product.category.color || '#6c757d',
                              color: 'white'
                            }}
                          >
                            <i className={`fas ${product.category.icon || 'fa-tag'} me-1`}></i>
                            {product.category.name}
                          </Badge>
                        ) : (
                          <span className="text-muted">Sin categoría</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-semibold">{product.stock_quantity} {product.unit}</span>
                          {getStockBadge(product)}
                        </div>
                        <div className="progress mt-1" style={{ height: '4px' }}>
                          <div
                            className={`progress-bar ${
                              product.stock_status === 'out_of_stock' ? 'bg-danger' :
                              product.stock_status === 'low_stock' ? 'bg-warning' :
                              'bg-success'
                            }`}
                            style={{
                              width: `${Math.min((product.stock_quantity / (product.minimum_stock * 2)) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                        <small className="text-muted">Mínimo: {product.minimum_stock}</small>
                      </td>
                      <td>
                        <div className="fw-semibold">{formatters.formatCurrency(product.price)}</div>
                        {product.cost_price && (
                          <small className="text-muted">
                            Costo: {formatters.formatCurrency(product.cost_price)}
                          </small>
                        )}
                      </td>
                      <td>
                        {product.location ? (
                          <div>
                            <i className="fas fa-map-marker-alt text-muted me-1"></i>
                            {product.location}
                          </div>
                        ) : (
                          <span className="text-muted">Sin ubicación</span>
                        )}
                      </td>
                      <td>
                        <ProductActions
                          product={product}
                          onEdit={() => navigate(`/products/edit/${product.id}`)}
                          onDelete={() => handleDeleteClick(product)}
                          onView={() => navigate(`/products/${product.id}`)}
                          canEdit={isAdmin || isManager}
                          canDelete={isAdmin}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
          
          {/* Paginación */}
          {pagination.last_page > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                Mostrando {((pagination.current_page - 1) * pagination.per_page) + 1} -{' '}
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} de{' '}
                {pagination.total} productos
              </div>
              
              <Pagination className="mb-0">
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.current_page === 1}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                />
                
                {[...Array(pagination.last_page).keys()].map(page => {
                  const pageNum = page + 1;
                  // Mostrar solo algunas páginas alrededor de la actual
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.last_page ||
                    (pageNum >= pagination.current_page - 2 && pageNum <= pagination.current_page + 2)
                  ) {
                    return (
                      <Pagination.Item
                        key={pageNum}
                        active={pageNum === pagination.current_page}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Pagination.Item>
                    );
                  } else if (
                    pageNum === pagination.current_page - 3 ||
                    pageNum === pagination.current_page + 3
                  ) {
                    return <Pagination.Ellipsis key={pageNum} />;
                  }
                  return null;
                })}
                
                <Pagination.Next
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                />
                <Pagination.Last
                  onClick={() => handlePageChange(pagination.last_page)}
                  disabled={pagination.current_page === pagination.last_page}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Modal de confirmación de eliminación */}
      <ConfirmDialog
        show={showDeleteModal}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar el producto "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
        }}
      />
    </div>
  );
};

export default ProductList;