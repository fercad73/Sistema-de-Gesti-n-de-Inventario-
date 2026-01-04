-- Datos de prueba para el sistema de inventario

USE inventory_db;

-- Insertar categorías
INSERT INTO categories (name, description, color, icon) VALUES
('Electrónica', 'Dispositivos electrónicos y componentes', '#007bff', 'fa-laptop'),
('Ropa', 'Prendas de vestir para todas las edades', '#dc3545', 'fa-tshirt'),
('Alimentos', 'Productos alimenticios y comestibles', '#28a745', 'fa-utensils'),
('Bebidas', 'Bebidas alcohólicas y no alcohólicas', '#17a2b8', 'fa-wine-bottle'),
('Hogar', 'Artículos para el hogar y decoración', '#ffc107', 'fa-home'),
('Oficina', 'Suministros y equipos de oficina', '#6c757d', 'fa-briefcase'),
('Deportes', 'Equipos y accesorios deportivos', '#fd7e14', 'fa-football-ball'),
('Juguetes', 'Juguetes y juegos para todas las edades', '#e83e8c', 'fa-gamepad'),
('Libros', 'Libros y material de lectura', '#20c997', 'fa-book'),
('Salud', 'Productos de salud y belleza', '#6610f2', 'fa-heartbeat'),
('Automotriz', 'Repuestos y accesorios para vehículos', '#343a40', 'fa-car'),
('Jardinería', 'Herramientas y plantas para jardinería', '#198754', 'fa-seedling');

-- Insertar usuarios
INSERT INTO users (name, email, password, role) VALUES
('Administrador Principal', 'admin@inventario.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Gerente de Ventas', 'gerente@inventario.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager'),
('Usuario Normal', 'usuario@inventario.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Ana Martínez', 'ana.martinez@inventario.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager'),
('Carlos Rodríguez', 'carlos.rodriguez@inventario.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Insertar productos de electrónica
INSERT INTO products (sku, name, description, category_id, stock_quantity, minimum_stock, price, cost_price, location, unit, barcode, weight, dimensions) VALUES
('ELECT-001', 'Laptop HP Pavilion', 'Laptop HP Pavilion 15-dw1000la, Intel Core i5, 8GB RAM, 512GB SSD, 15.6" FHD', 1, 15, 5, 799.99, 650.00, 'Estante A-1', 'unidad', '194252708316', 2.1, '36.0x24.5x2.3 cm'),
('ELECT-002', 'Smartphone Samsung Galaxy S21', 'Smartphone Samsung Galaxy S21 5G, 128GB, 8GB RAM, Pantalla 6.2"', 1, 25, 10, 699.99, 550.00, 'Estante A-2', 'unidad', '8806090746315', 0.171, '15.1x7.2x0.8 cm'),
('ELECT-003', 'Tablet Apple iPad Air', 'Tablet Apple iPad Air 4ta Gen, 64GB, Wi-Fi, Pantalla 10.9"', 1, 8, 3, 599.99, 480.00, 'Estante A-3', 'unidad', '194252027508', 0.458, '24.8x17.8x0.6 cm'),
('ELECT-004', 'Auriculares Sony WH-1000XM4', 'Auriculares inalámbricos Sony WH-1000XM4 con cancelación de ruido', 1, 30, 15, 349.99, 280.00, 'Estante A-4', 'unidad', '027242871590', 0.254, '18.5x16.7x7.2 cm'),
('ELECT-005', 'Smartwatch Apple Watch Series 7', 'Smartwatch Apple Watch Series 7 GPS, 41mm, Caja de aluminio', 1, 12, 5, 399.99, 320.00, 'Estante A-5', 'unidad', '190199271970', 0.032, '4.1x3.4x1.1 cm');

-- Insertar productos de ropa
INSERT INTO products (sku, name, description, category_id, stock_quantity, minimum_stock, price, cost_price, location, unit, barcode) VALUES
('ROPA-001', 'Camisa de Algodón Hombre', 'Camisa de algodón 100% para hombre, talla M, color azul', 2, 50, 20, 29.99, 15.00, 'Estante B-1', 'pieza', '7501035911302'),
('ROPA-002', 'Jeans Skinny Mujer', 'Jeans skinny para mujer, talla 28, color azul oscuro', 2, 35, 15, 49.99, 25.00, 'Estante B-2', 'pieza', '7501035911319'),
('ROPA-003', 'Chaqueta de Cuero', 'Chaqueta de cuero genuino para hombre, talla L, color negro', 2, 10, 5, 199.99, 120.00, 'Estante B-3', 'pieza', '7501035911326'),
('ROPA-004', 'Vestido de Noche', 'Vestido elegante para ocasiones especiales, talla S, color rojo', 2, 18, 8, 89.99, 45.00, 'Estante B-4', 'pieza', '7501035911333'),
('ROPA-005', 'Zapatos Deportivos Nike', 'Zapatos deportivos Nike Air Max, talla 42, color blanco/negro', 2, 22, 10, 129.99, 75.00, 'Estante B-5', 'par', '8806090746322');

-- Insertar productos de alimentos
INSERT INTO products (sku, name, description, category_id, stock_quantity, minimum_stock, price, cost_price, location, unit, barcode, weight) VALUES
('ALIM-001', 'Arroz Integral', 'Arroz integral orgánico, paquete de 1kg', 3, 100, 30, 4.99, 2.50, 'Estante C-1', 'kg', '7501006553017', 1.0),
('ALIM-002', 'Aceite de Oliva', 'Aceite de oliva extra virgen, botella de 1 litro', 3, 75, 25, 12.99, 7.00, 'Estante C-2', 'litro', '8410066840107', 1.0),
('ALIM-003', 'Café Molido', 'Café 100% arábiga, molido, paquete de 500g', 3, 60, 20, 8.99, 4.50, 'Estante C-3', 'gramo', '7702010420265', 0.5),
('ALIM-004', 'Pasta Spaghetti', 'Pasta spaghetti de trigo duro, paquete de 500g', 3, 120, 40, 2.99, 1.20, 'Estante C-4', 'gramo', '8076809515258', 0.5),
('ALIM-005', 'Atún en Lata', 'Atún en agua, lata de 170g', 3, 200, 50, 3.49, 1.80, 'Estante C-5', 'lata', '7501006553024', 0.17);

-- Insertar productos de bebidas
INSERT INTO products (sku, name, description, category_id, stock_quantity, minimum_stock, price, cost_price, location, unit, barcode, weight) VALUES
('BEB-001', 'Agua Mineral', 'Agua mineral natural, botella de 600ml', 4, 200, 50, 1.50, 0.60, 'Estante D-1', 'botella', '7501055300018', 0.6),
('BEB-002', 'Refresco de Cola', 'Refresco de cola, lata de 355ml', 4, 300, 100, 2.00, 0.80, 'Estante D-2', 'lata', '049000028904', 0.355),
('BEB-003', 'Jugo de Naranja', 'Jugo de naranja 100% natural, tetrapack de 1 litro', 4, 80, 30, 3.99, 1.80, 'Estante D-3', 'litro', '7501055300025', 1.0),
('BEB-004', 'Cerveza Artesanal', 'Cerveza artesanal IPA, botella de 330ml', 4, 150, 50, 4.50, 2.00, 'Estante D-4', 'botella', '7804620090011', 0.33),
('BEB-005', 'Vino Tinto', 'Vino tinto reserva, botella de 750ml', 4, 40, 15, 15.99, 8.00, 'Estante D-5', 'botella', '8410591001013', 0.75);

-- Insertar productos de hogar
INSERT INTO products (sku, name, description, category_id, stock_quantity, minimum_stock, price, cost_price, location, unit, barcode) VALUES
('HOG-001', 'Juego de Sábanas', 'Juego de sábanas de algodón egipcio, tamaño queen', 5, 25, 10, 49.99, 25.00, 'Estante E-1', 'juego', '7501055300032'),
('HOG-002', 'Toallas de Baño', 'Toallas de baño 100% algodón, tamaño grande', 5, 40, 15, 19.99, 9.00, 'Estante E-2', 'pieza', '7501055300049'),
('HOG-003', 'Set de Utensilios de Cocina', 'Set de 10 utensilios de cocina de acero inoxidable', 5, 15, 5, 39.99, 20.00, 'Estante E-3', 'set', '7501055300056'),
('HOG-004', 'Lámpara de Mesa LED', 'Lámpara de mesa LED ajustable con sensor táctil', 5, 18, 8, 34.99, 18.00, 'Estante E-4', 'unidad', '7501055300063'),
('HOG-005', 'Alfombra de Sala', 'Alfombra para sala, tamaño 2x3 metros, color gris', 5, 8, 3, 89.99, 45.00, 'Estante E-5', 'pieza', '7501055300070');

-- Insertar productos con stock bajo y agotados para pruebas
INSERT INTO products (sku, name, description, category_id, stock_quantity, minimum_stock, price, cost_price, location, unit, is_active) VALUES
('LOW-001', 'Producto con Stock Bajo 1', 'Producto de prueba con stock bajo', 1, 3, 10, 99.99, 50.00, 'Estante F-1', 'unidad', true),
('LOW-002', 'Producto con Stock Bajo 2', 'Producto de prueba con stock bajo', 2, 2, 15, 49.99, 25.00, 'Estante F-2', 'pieza', true),
('OUT-001', 'Producto Agotado 1', 'Producto de prueba agotado', 3, 0, 5, 9.99, 5.00, 'Estante F-3', 'unidad', true),
('OUT-002', 'Producto Agotado 2', 'Producto de prueba agotado', 4, 0, 10, 14.99, 8.00, 'Estante F-4', 'unidad', true),
('INACT-001', 'Producto Inactivo', 'Producto de prueba inactivo', 5, 10, 5, 29.99, 15.00, 'Estante F-5', 'unidad', false);

-- Insertar movimientos de stock de ejemplo
INSERT INTO stock_movements (product_id, user_id, type, quantity_change, previous_quantity, new_quantity, reason, reference, movement_date) VALUES
(1, 1, 'entrada', 20, 0, 20, 'Compra inicial', 'OC-001', DATE_SUB(NOW(), INTERVAL 30 DAY)),
(1, 2, 'salida', 5, 20, 15, 'Venta a cliente', 'FAC-1001', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(2, 1, 'entrada', 30, 0, 30, 'Compra inicial', 'OC-002', DATE_SUB(NOW(), INTERVAL 25 DAY)),
(2, 3, 'salida', 5, 30, 25, 'Venta a cliente', 'FAC-1002', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(3, 1, 'entrada', 10, 0, 10, 'Compra inicial', 'OC-003', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(3, 2, 'salida', 2, 10, 8, 'Venta a cliente', 'FAC-1003', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(4, 1, 'entrada', 40, 0, 40, 'Compra inicial', 'OC-004', DATE_SUB(NOW(), INTERVAL 18 DAY)),
(4, 3, 'salida', 10, 40, 30, 'Venta a cliente', 'FAC-1004', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, 1, 'entrada', 15, 0, 15, 'Compra inicial', 'OC-005', DATE_SUB(NOW(), INTERVAL 12 DAY)),
(5, 2, 'salida', 3, 15, 12, 'Venta a cliente', 'FAC-1005', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Insertar más movimientos para estadísticas
INSERT INTO stock_movements (product_id, user_id, type, quantity_change, previous_quantity, new_quantity, reason, reference, movement_date)
SELECT 
    FLOOR(RAND() * 15) + 1 as product_id,
    FLOOR(RAND() * 3) + 1 as user_id,
    CASE WHEN RAND() > 0.5 THEN 'entrada' ELSE 'salida' END as type,
    FLOOR(RAND() * 20) + 1 as quantity_change,
    0 as previous_quantity,
    FLOOR(RAND() * 20) + 1 as new_quantity,
    CONCAT('Movimiento automático ', @i) as reason,
    CONCAT('AUTO-', LPAD(@i, 4, '0')) as reference,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 60) DAY)
FROM (SELECT @i := 0) init, 
     (SELECT @i := @i + 1 as i FROM information_schema.columns LIMIT 50) numbers;

-- Mostrar resumen de datos insertados
SELECT 
    'Categorías' as tipo,
    COUNT(*) as cantidad
FROM categories
UNION ALL
SELECT 
    'Usuarios',
    COUNT(*)
FROM users
UNION ALL
SELECT 
    'Productos',
    COUNT(*)
FROM products
UNION ALL
SELECT 
    'Movimientos de Stock',
    COUNT(*)
FROM stock_movements;

-- Mostrar productos con stock bajo
SELECT 
    p.sku,
    p.name,
    c.name as categoria,
    p.stock_quantity,
    p.minimum_stock,
    p.price,
    CASE 
        WHEN p.stock_quantity = 0 THEN 'AGOTADO'
        WHEN p.stock_quantity <= p.minimum_stock THEN 'BAJO'
        ELSE 'NORMAL'
    END as estado
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.stock_quantity <= p.minimum_stock
    AND p.is_active = TRUE
ORDER BY p.stock_quantity;

-- Mostrar valor total del inventario
SELECT 
    FORMAT(SUM(stock_quantity * price), 2) as valor_total,
    COUNT(*) as total_productos,
    FORMAT(AVG(price), 2) as precio_promedio
FROM products
WHERE is_active = TRUE;