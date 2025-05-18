# Etapa 1: Build del proyecto
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servidor con Nginx
FROM nginx:alpine

# Copia el build generado al directorio que sirve Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 9090

CMD ["nginx", "-g", "daemon off;"]
