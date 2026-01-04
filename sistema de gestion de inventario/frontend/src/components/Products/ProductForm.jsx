import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI } from '../../services/api/productAPI';
import { categoryAPI } from '../../services/api/categoryAPI';
import { validators } from '../../services/utils/validators';
import { formatters } from '../../services/utils/formatters';
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Spinner,
  InputGroup,
  Badge,
  ProgressBar
} from 'react-bootstrap';
import LoadingSpinner from '../Common/LoadingSpinner';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    category_id: '',
    stock_quantity: 0,
    minimum_stock: 5,
    price: 0,
    cost_price: '',
    location: '',
    barcode: '',
    unit: 'unidad',
    weight: '',
    dimensions: '',
    is_active: true
  });
  
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  
  // Cargar datos iniciales
  useEffect(() => {
    const initializeForm = async () => {
      try {
        setLoading(true);
        
        // Cargar categorías
        const categoriesResponse = await categoryAPI.getAll();
        if (categoriesResponse.data.success) {
          setCategories(categoriesResponse.data.data);
        }
        
        // Si es modo edición, cargar el producto
        if (isEditMode) {
          const productResponse = await productAPI.getById(id);
          if (productResponse.data.success) {
            const product = productResponse.data.data;
            
            setFormData({
              sku: product.sku || '',
              name: product.name || '',
              description: product.description || '',
              category_id: product.category_id || '',
              stock_quantity: product.stock_quantity || 0,
              minimum_stock: product.minimum_stock || 5,
              price: product.price || 0,
              cost_price: product.cost_price || '',
              location: product.location || '',
              barcode: product.barcode || '',
              unit: product.unit || 'unidad',
              weight: product.weight || '',
              dimensions: product.dimensions || '',
              is_active: product.is_active !== undefined ? product.is_active : true
            });
            
            if (product.image_url) {
              setImagePreview(product.image_url);
            }
          } else {
            setError('Producto no encontrado');
          }
        }
      } catch (error) {
        console.error('Error initializing form:', error);
        setError('Error al cargar los datos del formulario');
      } finally {
        setLoading(false);
      }
    };
    
    initializeForm();
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Solo se permiten imágenes (JPEG, PNG, GIF, WebP)'
        }));
        return;
      }
      
      // Validar tamaño (2MB máximo)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'La imagen no debe exceder los 2MB'
        }));
        return;
      }
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      
      // Limpiar error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: null
        }));
      }
    }
  };
  
  const validateForm = () => {
    const validationRules = {
      sku: [
        validators.required,
        validators.sku,
        validators.maxLength(100)
      ],
      name: [
        validators.required,
        validators.maxLength(255)
      ],
      category_id: [
        // No requerido pero si se envía debe existir
      ],
      stock_quantity: [
        validators.required,
        validators.numeric,
        validators.minValue(0)
      ],
      minimum_stock: [
        validators.required,
        validators.numeric,
        validators.minValue(0)
      ],
      price: [
        validators.required,
        validators.numeric,
        validators.minValue(0)
      ],
      cost_price: [
        validators.numeric,
        validators.minValue(0)
      ],
      location: [
        validators.maxLength(100)
      ],
      barcode: [
        validators.maxLength(100)
      ],
      unit: [
        validators.maxLength(50)
      ],
      weight: [
        validators.numeric,
        validators.minValue(0)
      ],
      dimensions: [
        validators.maxLength(100)
      ]
    };
    
    const result = validators.validateForm(formData, validationRules);
    setErrors(result.errors);
    return result.isValid;
  };
  
  const calculateProfitMargin = () => {
    const price = parseFloat(formData.price) || 0;
    const cost = parseFloat(formData.cost_price) || 0;
    
    if (cost === 0) return 0;
    
    return ((price - cost) / cost) * 100;
  };
  
  const getStockStatus = () => {
    const stock = parseInt(formData.stock_quantity) || 0;
    const minStock = parseInt(formData.minimum_stock) || 5;
    
    if (stock === 0) return { status: 'out_of_stock', text: 'Agotado', color: 'danger' };
    if (stock <= minStock) return { status: 'low_stock', text: 'Stock Bajo', color: 'warning' };
    return { status: 'in_stock', text: 'Disponible', color: 'success' };
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Preparar datos del formulario
      const submitData = new FormData();
      
      // Agregar campos del formulario
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });
      
      // Agregar imagen si hay una nueva
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      
      let response;
      
      if (isEditMode) {
        response = await productAPI.update(id, submitData);
      } else {
        response = await productAPI.create(submitData);
      }
      
      if (response.data.success) {
        setSuccess(isEditMode ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
        
        // Redirigir después de 1 segundo
        setTimeout(() => {
          navigate('/products');
        }, 1000);
      } else {
        setError(response.data.message || 'Error al guardar el producto');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      
      if (error.response?.data?.errors) {
        // Errores de validación del servidor
        const serverErrors = {};
        Object.keys(error.response.data.errors).forEach(key => {
          serverErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(serverErrors);
      } else {
        setError(error.response?.data?.message || 'Error al guardar el producto. Por favor, intenta de nuevo.');
      }
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  const stockStatus = getStockStatus();
  const profitMargin = calculateProfitMargin();
  
  return (
    <div className="product-form">
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-0">
                {isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
              </h4>
              <p className="text-muted mb-0">
                {isEditMode ? 'Actualiza la información del producto' : 'Completa todos los campos para agregar un nuevo producto'}
              </p>
            </div>
            
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/products')}
              disabled={saving}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Volver
            </Button>
          </div>
          
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              <i className="fas fa-check-circle me-2"></i>
              {success}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                {/* Información básica */}
                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Header className="bg-white border-bottom">
                    <h6 className="mb-0 fw-semibold">
                      <i className="fas fa-info-circle me-2 text-primary"></i>
                      Información Básica
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            SKU <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            isInvalid={!!errors.sku}
                            placeholder="Ej: PROD001"
                            disabled={isEditMode || saving}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.sku}
                          </Form.Control.Feedback>
                          <Form.Text className="text-muted">
                            Código único de identificación del producto
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Nombre <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            isInvalid={!!errors.name}
                            placeholder="Ej: Laptop HP Pavilion"
                            disabled={saving}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        isInvalid={!!errors.description}
                        rows={3}
                        placeholder="Describe el producto..."
                        disabled={saving}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.description}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Categoría</Form.Label>
                          <Form.Select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            isInvalid={!!errors.category_id}
                            disabled={saving}
                          >
                            <option value="">Seleccionar categoría</option>
                            {categories.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.category_id}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Unidad de Medida</Form.Label>
                          <Form.Select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            isInvalid={!!errors.unit}
                            disabled={saving}
                          >
                            <option value="unidad">Unidad</option>
                            <option value="pieza">Pieza</option>
                            <option value="kg">Kilogramo</option>
                            <option value="gramo">Gramo</option>
                            <option value="litro">Litro</option>
                            <option value="ml">Mililitro</option>
                            <option value="metro">Metro</option>
                            <option value="cm">Centímetro</option>
                            <option value="paquete">Paquete</option>
                            <option value="caja">Caja</option>
                            <option value="botella">Botella</option>
                            <option value="lata">Lata</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.unit}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                {/* Información de stock y precios */}
                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Header className="bg-white border-bottom">
                    <h6 className="mb-0 fw-semibold">
                      <i className="fas fa-chart-line me-2 text-primary"></i>
                      Stock y Precios
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Stock Actual <span className="text-danger">*</span>
                          </Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="number"
                              name="stock_quantity"
                              value={formData.stock_quantity}
                              onChange={handleChange}
                              isInvalid={!!errors.stock_quantity}
                              min="0"
                              step="1"
                              disabled={saving}
                            />
                            <InputGroup.Text>{formData.unit}</InputGroup.Text>
                          </InputGroup>
                          <Form.Control.Feedback type="invalid">
                            {errors.stock_quantity}
                          </Form.Control.Feedback>
                          <div className="mt-2">
                            <Badge bg={stockStatus.color} className="me-2">
                              {stockStatus.text}
                            </Badge>
                            <small className="text-muted">
                              Estado actual del stock
                            </small>
                          </div>
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Stock Mínimo <span className="text-danger">*</span>
                          </Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="number"
                              name="minimum_stock"
                              value={formData.minimum_stock}
                              onChange={handleChange}
                              isInvalid={!!errors.minimum_stock}
                              min="0"
                              step="1"
                              disabled={saving}
                            />
                            <InputGroup.Text>{formData.unit}</InputGroup.Text>
                          </InputGroup>
                          <Form.Control.Feedback type="invalid">
                            {errors.minimum_stock}
                          </Form.Control.Feedback>
                          <div className="mt-2">
                            <small className="text-muted">
                              Alerta cuando el stock esté por debajo de este valor
                            </small>
                          </div>
                        </Form.Group>
                      </Col>
                      
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Ubicación</Form.Label>
                          <Form.Control
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            isInvalid={!!errors.location}
                            placeholder="Ej: Estante A-1"
                            disabled={saving}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.location}
                          </Form.Control.Feedback>
                          <small className="text-muted">
                            Ubicación física en el almacén
                          </small>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Precio de Venta <span className="text-danger">*</span>
                          </Form.Label>
                          <InputGroup>
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control
                              type="number"
                              name="price"
                              value={formData.price}
                              onChange={handleChange}
                              isInvalid={!!errors.price}
                              min="0"
                              step="0.01"
                              disabled={saving}
                            />
                          </InputGroup>
                          <Form.Control.Feedback type="invalid">
                            {errors.price}
                          </Form.Control.Feedback>
                          <div className="mt-2">
                            <small className="text-muted">
                              Precio al público
                            </small>
                          </div>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Precio de Costo</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control
                              type="number"
                              name="cost_price"
                              value={formData.cost_price}
                              onChange={handleChange}
                              isInvalid={!!errors.cost_price}
                              min="0"
                              step="0.01"
                              disabled={saving}
                            />
                          </InputGroup>
                          <Form.Control.Feedback type="invalid">
                            {errors.cost_price}
                          </Form.Control.Feedback>
                          <div className="mt-2">
                            {profitMargin !== 0 && (
                              <Badge bg={profitMargin >= 0 ? 'success' : 'danger'} className="me-2">
                                Margen: {profitMargin.toFixed(2)}%
                              </Badge>
                            )}
                            <small className="text-muted">
                              Precio de adquisición
                            </small>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                {/* Información adicional */}
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-bottom">
                    <h6 className="mb-0 fw-semibold">
                      <i className="fas fa-cube me-2 text-primary"></i>
                      Información Adicional
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Código de Barras</Form.Label>
                          <Form.Control
                            type="text"
                            name="barcode"
                            value={formData.barcode}
                            onChange={handleChange}
                            isInvalid={!!errors.barcode}
                            placeholder="Ej: 123456789012"
                            disabled={saving}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.barcode}
                          </Form.Control.Feedback>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label>Peso (kg)</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="number"
                              name="weight"
                              value={formData.weight}
                              onChange={handleChange}
                              isInvalid={!!errors.weight}
                              min="0"
                              step="0.001"
                              disabled={saving}
                            />
                            <InputGroup.Text>kg</InputGroup.Text>
                          </InputGroup>
                          <Form.Control.Feedback type="invalid">
                            {errors.weight}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Dimensiones</Form.Label>
                          <Form.Control
                            type="text"
                            name="dimensions"
                            value={formData.dimensions}
                            onChange={handleChange}
                            isInvalid={!!errors.dimensions}
                            placeholder="Ej: 10x20x30 cm"
                            disabled={saving}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.dimensions}
                          </Form.Control.Feedback>
                          <small className="text-muted">
                            Ancho x Alto x Profundidad
                          </small>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            label="Producto activo"
                            checked={formData.is_active}
                            onChange={handleChange}
                            disabled={saving}
                          />
                          <small className="text-muted">
                            Los productos inactivos no aparecerán en las búsquedas
                          </small>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4}>
                {/* Imagen del producto */}
                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Header className="bg-white border-bottom">
                    <h6 className="mb-0 fw-semibold">
                      <i className="fas fa-image me-2 text-primary"></i>
                      Imagen del Producto
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="text-center mb-3">
                      {imagePreview ? (
                        <div className="position-relative">
                          <img
                            src={imagePreview}
                            alt="Vista previa"
                            className="img-fluid rounded border"
                            style={{ maxHeight: '200px' }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-2"
                            onClick={() => {
                              setImagePreview(null);
                              setImageFile(null);
                            }}
                            disabled={saving}
                          >
                            <i className="fas fa-times"></i>
                          </Button>
                        </div>
                      ) : (
                        <div className="border rounded p-5 text-center bg-light">
                          <i className="fas fa-image fa-3x text-muted mb-3"></i>
                          <p className="text-muted mb-0">Sin imagen</p>
                        </div>
                      )}
                    </div>
                    
                    <Form.Group>
                      <Form.Label>Subir Imagen</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        isInvalid={!!errors.image}
                        disabled={saving}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.image}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Formatos permitidos: JPEG, PNG, GIF, WebP (Máx. 2MB)
                      </Form.Text>
                    </Form.Group>
                  </Card.Body>
                </Card>
                
                {/* Resumen y acciones */}
                <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                  <Card.Header className="bg-white border-bottom">
                    <h6 className="mb-0 fw-semibold">
                      <i className="fas fa-clipboard-check me-2 text-primary"></i>
                      Resumen
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Valor del Stock:</span>
                        <span className="fw-semibold">
                          {formatters.formatCurrency(
                            (parseFloat(formData.stock_quantity) || 0) * 
                            (parseFloat(formData.price) || 0)
                          )}
                        </span>
                      </div>
                      
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Estado:</span>
                        <Badge bg={stockStatus.color}>
                          {stockStatus.text}
                        </Badge>
                      </div>
                      
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Margen:</span>
                        <Badge bg={profitMargin >= 0 ? 'success' : 'danger'}>
                          {profitMargin.toFixed(2)}%
                        </Badge>
                      </div>
                      
                      {formData.category_id && (
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Categoría:</span>
                          <span className="fw-semibold">
                            {categories.find(c => c.id === parseInt(formData.category_id))?.name || 'Sin categoría'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 mb-2"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            {isEditMode ? 'Actualizando...' : 'Creando...'}
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            {isEditMode ? 'Actualizar Producto' : 'Crear Producto'}
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline-secondary"
                        onClick={() => navigate('/products')}
                        className="w-100"
                        disabled={saving}
                      >
                        <i className="fas fa-times me-2"></i>
                        Cancelar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductForm;