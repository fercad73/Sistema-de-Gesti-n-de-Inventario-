
# Sistema de Gestión de Inventario

## 📋 Descripción
Sistema web completo para la gestión de inventario con funcionalidades CRUD, autenticación de usuarios, control de stock y reportes.

## 🚀 Características Principales
- ✅ Gestión completa de productos (CRUD)
- ✅ Autenticación con roles (admin/usuario)
- ✅ Control de stock con historial
- ✅ Dashboard con métricas
- ✅ Diseño responsivo (móvil/escritorio)
- ✅ Reportes PDF/Excel
- ✅ API RESTful documentada

## 🛠️ Tecnologías
- **Backend**: Laravel 10 (PHP 8.1+)
- **Frontend**: React 18 + Bootstrap 5
- **Base de datos**: MySQL 8.0
- **Autenticación**: Laravel Sanctum
- **Estilos**: Bootstrap 5 + CSS3

## 📦 Instalación Rápida

### Opción 1: Instalación Tradicional
```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/inventory-management-system.git
cd inventory-management-system

# 2. Configurar backend
cd backend
cp .env.example .env
composer install
php artisan key:generate

# 3. Configurar base de datos (crear BD 'inventory_db')
# Editar .env con tus credenciales MySQL

# 4. Ejecutar migraciones
php artisan migrate --seed

# 5. Configurar frontend
cd ../frontend
cp .env.example .env
npm install

# 6. Iniciar servidores
# Terminal 1: cd backend && php artisan serve --port=8000
# Terminal 2: cd frontend && npm start
