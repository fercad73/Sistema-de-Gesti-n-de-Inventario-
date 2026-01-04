FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Stage 2 - Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar el build de React
COPY --from=builder /app/build /usr/share/nginx/html

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 3000

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]