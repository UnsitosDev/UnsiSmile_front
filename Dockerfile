# Etapa 1: Construcción de la aplicación Angular
FROM node:22 as builder

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración y dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar el resto del código fuente
COPY . .

# Compilar la aplicación para producción
RUN npm run build -- --output-path=dist/odonto_front --configuration production

# Etapa 2: Servidor NGINX para servir la aplicación
FROM nginx:stable-alpine

# Copiar la aplicación Angular compilada desde la etapa de construcción
COPY --from=builder /app/dist/odonto_front /usr/share/nginx/html

# Eliminar el archivo de configuración predeterminado de NGINX
RUN rm /etc/nginx/conf.d/default.conf

# Copiar una configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/conf.d

# Exponer el puerto del servidor
EXPOSE 8081

# Comando de inicio de   NGINX
CMD ["nginx", "-g", "daemon off;"]  
