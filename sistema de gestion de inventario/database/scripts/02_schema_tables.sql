-- Script completo de creación de tablas del sistema de inventario

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'user') DEFAULT 'user',
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    color VARCHAR(7) DEFAULT '#6c757d',
    icon VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    category_id INT UNSIGNED NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    minimum_stock INT NOT NULL DEFAULT 5,
    price DECIMAL(10, 2) NOT NULL,
    cost_price DECIMAL(10, 2) NULL,
    location VARCHAR(100) NULL,
    image_url VARCHAR(500) NULL,
    barcode VARCHAR(100) NULL,
    unit VARCHAR(50) DEFAULT 'unidad',
    weight DECIMAL(10, 3) NULL,
    dimensions VARCHAR(100) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_products_sku (sku),
    INDEX idx_products_name (name),
    INDEX idx_products_category (category_id),
    INDEX idx_products_stock (stock_quantity),
    INDEX idx_products_active (is_active),
    INDEX idx_products_price (price),
    INDEX idx_products_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de movimientos de stock
CREATE TABLE IF NOT EXISTS stock_movements (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    type ENUM('entrada', 'salida', 'ajuste', 'venta', 'compra') NOT NULL,
    quantity_change INT NOT NULL,
    previous_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    reason VARCHAR(255) NULL,
    reference VARCHAR(100) NULL,
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_stock_product (product_id),
    INDEX idx_stock_date (movement_date),
    INDEX idx_stock_type (type),
    INDEX idx_stock_user (user_id),
    INDEX idx_stock_reference (reference)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para auditoría
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    model_type VARCHAR(100) NULL,
    model_id INT UNSIGNED NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    url VARCHAR(500) NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_model (model_type, model_id),
    INDEX idx_audit_created (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vistas útiles

-- Vista para productos con stock bajo
CREATE OR REPLACE VIEW low_stock_products AS
SELECT 
    p.id,
    p.sku,
    p.name,
    p.stock_quantity,
    p.minimum_stock,
    p.price,
    p.location,
    c.name as category_name,
    c.color as category_color,
    CASE 
        WHEN p.stock_quantity = 0 THEN 'Agotado'
        WHEN p.stock_quantity <= p.minimum_stock THEN 'Bajo'
        ELSE 'Normal'
    END as stock_status
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.stock_quantity <= p.minimum_stock 
    AND p.is_active = TRUE
    AND p.deleted_at IS NULL
ORDER BY p.stock_quantity ASC;

-- Vista para valor del inventario por categoría
CREATE OR REPLACE VIEW inventory_value_by_category AS
SELECT 
    c.id as category_id,
    c.name as category_name,
    c.color,
    COUNT(p.id) as product_count,
    SUM(p.stock_quantity) as total_stock,
    SUM(p.stock_quantity * p.price) as total_value,
    AVG(p.price) as avg_price
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
    AND p.is_active = TRUE
    AND p.deleted_at IS NULL
GROUP BY c.id, c.name, c.color
ORDER BY total_value DESC;

-- Vista para estadísticas de movimientos diarios
CREATE OR REPLACE VIEW daily_movement_stats AS
SELECT 
    DATE(movement_date) as date,
    COUNT(*) as total_movements,
    SUM(CASE WHEN type = 'entrada' THEN quantity_change ELSE 0 END) as total_entradas,
    SUM(CASE WHEN type = 'salida' THEN quantity_change ELSE 0 END) as total_salidas,
    COUNT(DISTINCT product_id) as products_affected,
    COUNT(DISTINCT user_id) as users_involved
FROM stock_movements
GROUP BY DATE(movement_date)
ORDER BY date DESC;

-- Triggers

-- Trigger para registrar cambios en productos
DELIMITER //
CREATE TRIGGER after_product_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    -- Registrar cambios significativos
    IF OLD.stock_quantity != NEW.stock_quantity THEN
        INSERT INTO stock_movements (
            product_id,
            user_id,
            type,
            quantity_change,
            previous_quantity,
            new_quantity,
            reason,
            reference
        ) VALUES (
            NEW.id,
            NULL, -- Se puede obtener del contexto si hay usuario autenticado
            'ajuste',
            ABS(NEW.stock_quantity - OLD.stock_quantity),
            OLD.stock_quantity,
            NEW.stock_quantity,
            'Actualización automática de stock',
            'TRIGGER'
        );
    END IF;
END//
DELIMITER ;

-- Trigger para auditoría de productos
DELIMITER //
CREATE TRIGGER audit_product_changes
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        model_type,
        model_id,
        old_values,
        new_values,
        url,
        ip_address,
        user_agent
    ) VALUES (
        NULL, -- Se obtendría del contexto en la aplicación
        'UPDATE',
        'Product',
        NEW.id,
        JSON_OBJECT(
            'sku', OLD.sku,
            'name', OLD.name,
            'stock_quantity', OLD.stock_quantity,
            'price', OLD.price,
            'is_active', OLD.is_active
        ),
        JSON_OBJECT(
            'sku', NEW.sku,
            'name', NEW.name,
            'stock_quantity', NEW.stock_quantity,
            'price', NEW.price,
            'is_active', NEW.is_active
        ),
        NULL,
        NULL,
        NULL
    );
END//
DELIMITER ;

-- Procedimientos almacenados

-- Procedimiento para reabastecer stock bajo
DELIMITER //
CREATE PROCEDURE restock_low_stock_products()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE product_id INT;
    DECLARE product_name VARCHAR(255);
    DECLARE current_stock INT;
    DECLARE minimum_stock INT;
    DECLARE reorder_quantity INT;
    
    DECLARE cur CURSOR FOR 
        SELECT id, name, stock_quantity, minimum_stock 
        FROM products 
        WHERE stock_quantity <= minimum_stock 
            AND is_active = TRUE 
            AND deleted_at IS NULL;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO product_id, product_name, current_stock, minimum_stock;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Calcular cantidad a reordenar (doble del mínimo menos el actual)
        SET reorder_quantity = (minimum_stock * 2) - current_stock;
        
        -- Asegurarse de que sea al menos 1
        IF reorder_quantity < 1 THEN
            SET reorder_quantity = minimum_stock;
        END IF;
        
        -- Actualizar stock
        UPDATE products 
        SET stock_quantity = stock_quantity + reorder_quantity,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = product_id;
        
        -- Registrar movimiento
        INSERT INTO stock_movements (
            product_id,
            user_id,
            type,
            quantity_change,
            previous_quantity,
            new_quantity,
            reason,
            reference
        ) VALUES (
            product_id,
            NULL,
            'entrada',
            reorder_quantity,
            current_stock,
            current_stock + reorder_quantity,
            'Reabastecimiento automático por stock bajo',
            'PROCEDURE'
        );
        
    END LOOP;
    
    CLOSE cur;
END//
DELIMITER ;

-- Procedimiento para generar reporte de inventario
DELIMITER //
CREATE PROCEDURE generate_inventory_report(
    IN start_date DATE,
    IN end_date DATE
)
BEGIN
    SELECT 
        p.sku,
        p.name,
        c.name as category,
        p.stock_quantity,
        p.minimum_stock,
        p.price,
        p.cost_price,
        (p.stock_quantity * p.price) as total_value,
        CASE 
            WHEN p.stock_quantity = 0 THEN 'Agotado'
            WHEN p.stock_quantity <= p.minimum_stock THEN 'Bajo'
            ELSE 'Normal'
        END as stock_status,
        p.location,
        p.updated_at as last_updated
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = TRUE
        AND p.deleted_at IS NULL
        AND (start_date IS NULL OR p.updated_at >= start_date)
        AND (end_date IS NULL OR p.updated_at <= end_date)
    ORDER BY stock_status, p.stock_quantity;
END//
DELIMITER ;

-- Función para calcular el valor total del inventario
DELIMITER //
CREATE FUNCTION calculate_total_inventory_value() 
RETURNS DECIMAL(15,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total DECIMAL(15,2);
    
    SELECT SUM(stock_quantity * price) INTO total
    FROM products
    WHERE is_active = TRUE
        AND deleted_at IS NULL;
    
    RETURN COALESCE(total, 0);
END//
DELIMITER ;

-- Función para obtener estadísticas de movimientos
DELIMITER //
CREATE FUNCTION get_movement_stats(
    p_product_id INT,
    p_start_date DATE,
    p_end_date DATE
) 
RETURNS JSON
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE stats JSON;
    
    SELECT JSON_OBJECT(
        'total_movements', COUNT(*),
        'total_entradas', SUM(CASE WHEN type = 'entrada' THEN quantity_change ELSE 0 END),
        'total_salidas', SUM(CASE WHEN type = 'salida' THEN quantity_change ELSE 0 END),
        'avg_daily_movements', AVG(CASE WHEN type = 'salida' THEN quantity_change ELSE 0 END)
    ) INTO stats
    FROM stock_movements
    WHERE (p_product_id IS NULL OR product_id = p_product_id)
        AND (p_start_date IS NULL OR movement_date >= p_start_date)
        AND (p_end_date IS NULL OR movement_date <= p_end_date);
    
    RETURN COALESCE(stats, JSON_OBJECT());
END//
DELIMITER ;

-- Mostrar información del esquema
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    DATA_LENGTH,
    INDEX_LENGTH,
    CREATE_TIME,
    UPDATE_TIME
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'inventory_db'
ORDER BY TABLE_NAME;