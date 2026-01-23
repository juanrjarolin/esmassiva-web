# Instalación Sin Docker

Guía para instalar y ejecutar Esmassiva directamente en el servidor sin usar Docker.

## 📋 Requisitos Previos

- Ubuntu 20.04+ o Debian 10+
- Acceso root o sudo
- Al menos 2GB de RAM
- 10GB de espacio en disco

## 🚀 Instalación Paso a Paso

### 1. Actualizar el Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalar Node.js 20.x

```bash
# Instalar Node.js desde NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version  # Debe ser v20.x
npm --version
```

### 3. Instalar pnpm

```bash
npm install -g pnpm
pnpm --version
```

### 4. Instalar MySQL 8

```bash
# Instalar MySQL
sudo apt install -y mysql-server

# Iniciar y habilitar MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Configurar MySQL (ejecutar y seguir las instrucciones)
sudo mysql_secure_installation
```

### 5. Crear Base de Datos

```bash
# Entrar a MySQL
sudo mysql -u root -p

# Dentro de MySQL, ejecutar:
CREATE DATABASE esmassiva;
CREATE USER 'esmassiva'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON esmassiva.* TO 'esmassiva'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 6. Instalar MinIO (Opcional - para almacenamiento de archivos)

```bash
# Descargar MinIO
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
sudo mv minio /usr/local/bin/

# Crear directorio para datos
sudo mkdir -p /var/minio/data
sudo chown $USER:$USER /var/minio/data

# Crear servicio systemd para MinIO
sudo nano /etc/systemd/system/minio.service
```

Contenido del archivo `/etc/systemd/system/minio.service`:

```ini
[Unit]
Description=MinIO Object Storage
After=network.target

[Service]
Type=simple
User=www-data
ExecStart=/usr/local/bin/minio server /var/minio/data --console-address ":9001"
Restart=always
Environment="MINIO_ROOT_USER=admin"
Environment="MINIO_ROOT_PASSWORD=tu_password_seguro"

[Install]
WantedBy=multi-user.target
```

```bash
# Iniciar MinIO
sudo systemctl daemon-reload
sudo systemctl enable minio
sudo systemctl start minio
```

### 7. Instalar Nginx (Opcional - como proxy reverso)

```bash
sudo apt install -y nginx

# Configurar Nginx
sudo nano /etc/nginx/sites-available/esmassiva
```

Contenido del archivo de configuración:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    client_max_body_size 1G;

    location /esmassiva-web {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/esmassiva /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Configurar la Aplicación

```bash
# Navegar al directorio del proyecto
cd /var/www/html/esmassiva-web

# Crear archivo .env
cp docker/env.example.txt .env
nano .env
```

Configuración mínima del `.env`:

```env
# Entorno
NODE_ENV=production

# Base de datos (ajusta según tu configuración)
DATABASE_URL=mysql://esmassiva:tu_password@localhost:3306/esmassiva

# Admin
ADMIN_PASSWORD=tu_password_seguro

# Ruta base
BASE_PATH=/esmassiva-web

# MinIO (si lo instalaste)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=tu_password_seguro

# URL base
BASE_URL=http://tu-dominio.com
```

### 9. Instalar Dependencias

```bash
cd /var/www/html/esmassiva-web

# Instalar dependencias
pnpm install

# Generar Prisma client
pnpm db:push
```

### 10. Construir la Aplicación

```bash
# Build para producción
pnpm build

# Verificar que se generó .output
ls -la .output/
```

### 11. Crear Servicio systemd

```bash
sudo nano /etc/systemd/system/esmassiva.service
```

Contenido del archivo:

```ini
[Unit]
Description=Esmassiva Web Application
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/html/esmassiva-web
Environment="NODE_ENV=production"
Environment="PORT=3000"
EnvironmentFile=/var/www/html/esmassiva-web/.env
ExecStart=/usr/bin/pnpm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Habilitar y iniciar servicio
sudo systemctl daemon-reload
sudo systemctl enable esmassiva
sudo systemctl start esmassiva

# Ver estado
sudo systemctl status esmassiva

# Ver logs
sudo journalctl -u esmassiva -f
```

## 🔧 Comandos Útiles

### Gestión del Servicio

```bash
# Iniciar
sudo systemctl start esmassiva

# Detener
sudo systemctl stop esmassiva

# Reiniciar
sudo systemctl restart esmassiva

# Ver estado
sudo systemctl status esmassiva

# Ver logs
sudo journalctl -u esmassiva -f
```

### Actualizar la Aplicación

```bash
cd /var/www/html/esmassiva-web

# Si usas Git
git pull

# Reinstalar dependencias (si hay cambios)
pnpm install

# Reconstruir
pnpm build

# Reiniciar servicio
sudo systemctl restart esmassiva
```

### Ver Logs

```bash
# Logs del servicio
sudo journalctl -u esmassiva -n 100

# Logs en tiempo real
sudo journalctl -u esmassiva -f

# Logs de la aplicación (si hay archivos de log)
tail -f /var/log/esmassiva.log
```

## 🔒 Seguridad

### Firewall

```bash
# Permitir solo puertos necesarios
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Permisos

```bash
# Asegurar permisos correctos
sudo chown -R www-data:www-data /var/www/html/esmassiva-web
sudo chmod -R 755 /var/www/html/esmassiva-web
```

## 📊 Monitoreo

### Verificar que Todo Funciona

```bash
# Verificar que el servicio está corriendo
sudo systemctl status esmassiva

# Verificar que responde
curl http://localhost:3000

# Verificar procesos
ps aux | grep node

# Verificar puertos
netstat -tuln | grep 3000
```

## 🐛 Troubleshooting

### El servicio no inicia

```bash
# Ver logs de error
sudo journalctl -u esmassiva -n 50

# Verificar permisos
ls -la /var/www/html/esmassiva-web

# Verificar que .env existe
cat /var/www/html/esmassiva-web/.env
```

### Error de base de datos

```bash
# Verificar que MySQL está corriendo
sudo systemctl status mysql

# Probar conexión
mysql -u esmassiva -p esmassiva

# Verificar variables de entorno
grep DATABASE_URL /var/www/html/esmassiva-web/.env
```

### Error de permisos

```bash
# Corregir propietario
sudo chown -R www-data:www-data /var/www/html/esmassiva-web

# Corregir permisos
sudo chmod -R 755 /var/www/html/esmassiva-web
```

## 📝 Notas

- La aplicación correrá en el puerto 3000 por defecto
- Usa Nginx como proxy reverso para servir en el puerto 80/443
- Asegúrate de tener suficiente memoria (Node.js puede usar bastante RAM)
- Considera usar PM2 en lugar de systemd si necesitas más control

## 🔄 Migración desde Docker

Si ya tienes datos en Docker y quieres migrarlos:

```bash
# 1. Exportar base de datos desde Docker
docker compose exec mysql mysqldump -u root -p esmassiva > backup.sql

# 2. Importar a MySQL local
mysql -u esmassiva -p esmassiva < backup.sql

# 3. Copiar archivos de MinIO (si es necesario)
# Los archivos estarán en los volúmenes de Docker
```

