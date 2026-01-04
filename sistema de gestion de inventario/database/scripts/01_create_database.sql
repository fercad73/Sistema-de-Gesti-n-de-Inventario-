-- Script para crear la base de datos y usuarios

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS inventory_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE inventory_db;

-- Crear usuario para la aplicación
CREATE USER IF NOT EXISTS 'inventory_user'@'localhost' IDENTIFIED BY 'password_seguro';
GRANT ALL PRIVILEGES ON inventory_db.* TO 'inventory_user'@'localhost';
FLUSH PRIVILEGES;

-- Crear usuario para desarrollo
CREATE USER IF NOT EXISTS 'dev_user'@'localhost' IDENTIFIED BY 'dev_password';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON inventory_db.* TO 'dev_user'@'localhost';
FLUSH PRIVILEGES;

-- Mostrar usuarios creados
SELECT user, host FROM mysql.user WHERE user LIKE '%inventory%' OR user LIKE '%dev%';