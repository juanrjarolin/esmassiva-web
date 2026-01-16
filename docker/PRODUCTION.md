# Guía de Despliegue en Producción

Esta guía te ayudará a desplegar Esmassiva en producción usando Docker Compose.

## 📋 Requisitos Previos

- Servidor con Docker y Docker Compose instalados
- Dominio configurado (opcional pero recomendado)
- Certificado SSL (recomendado usar Let's Encrypt)
- Al menos 2GB de RAM disponible
- 10GB de espacio en disco

## 🚀 Pasos de Despliegue

### 1. Preparar el Servidor

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker (si no está instalado)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo apt install docker-compose-plugin -y

# Agregar usuario al grupo docker (opcional)
sudo usermod -aG docker $USER
```

### 2. Clonar/Subir el Proyecto

```bash
# Si usas Git
git clone <tu-repositorio> esmassiva
cd esmassiva

# O sube los archivos vía SFTP/SCP
```

### 3. Configurar Variables de Entorno

Crea el archivo `docker/.env` con configuración de producción:

```bash
cd docker
cp env.example.txt .env
nano .env
```

**Configuración mínima para producción:**

```env
# =============================================================================
# CONFIGURACIÓN DE PRODUCCIÓN
# =============================================================================

# Entorno
NODE_ENV=production

# MySQL - ¡CAMBIA ESTAS CONTRASEÑAS!
MYSQL_ROOT_PASSWORD=TU_PASSWORD_ROOT_SEGURO_AQUI
MYSQL_PASSWORD=TU_PASSWORD_BD_SEGURO_AQUI

# Contraseña de administrador - ¡CAMBIA ESTA!
ADMIN_PASSWORD=TU_PASSWORD_ADMIN_MUY_SEGURO_AQUI

# IP de escucha (0.0.0.0 para acceso externo)
LISTEN_IP=0.0.0.0

# URL base de la aplicación (cambiar por tu dominio)
BASE_URL=https://tudominio.com

# Opcional: Configuración adicional
# MINIO_PUBLIC_URL=https://tudominio.com/minio
```

**⚠️ IMPORTANTE:**
- Cambia TODAS las contraseñas por valores seguros
- Usa contraseñas de al menos 16 caracteres
- Guarda estas contraseñas en un gestor de contraseñas seguro

### 4. Configurar Nginx para Producción

Si quieres usar Nginx como proxy inverso (recomendado), edita `docker/nginx/conf.d/default.conf`:

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tudominio.com www.tudominio.com;

    # Certificados SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;

    # Configuración SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy a la aplicación
    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Adminer solo en localhost (opcional)
    location /adminer {
        allow 127.0.0.1;
        deny all;
        proxy_pass http://adminer:8080;
    }
}
```

### 5. Obtener Certificado SSL (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado (ajusta el dominio)
sudo certbot --nginx -d tudominio.com -d www.tudominio.com

# Renovación automática (ya viene configurado)
sudo certbot renew --dry-run
```

### 6. Levantar los Servicios

```bash
cd docker

# Construir y levantar en producción
docker compose up -d --build

# Ver logs
docker compose logs -f app
```

### 7. Verificar el Despliegue

```bash
# Verificar que todos los servicios estén corriendo
docker compose ps

# Verificar logs
docker compose logs app
docker compose logs mysql
docker compose logs minio
```

## 🔒 Seguridad en Producción

### 1. Firewall

```bash
# Configurar UFW (Uncomplicated Firewall)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. Restringir Acceso a Adminer

Edita `docker/compose.yaml` para que Adminer solo sea accesible localmente:

```yaml
adminer:
  ports:
    - "127.0.0.1:8080:8080"  # Solo localhost
```

### 3. Restringir Acceso a MinIO Console

```yaml
minio:
  ports:
    - "127.0.0.1:9000:9000"  # Solo localhost
    - "127.0.0.1:9001:9001"  # Solo localhost
```

### 4. Cambiar Credenciales por Defecto

- ✅ Cambiar `ADMIN_PASSWORD` en `.env`
- ✅ Cambiar `MYSQL_ROOT_PASSWORD` en `.env`
- ✅ Cambiar `MYSQL_PASSWORD` en `.env`
- ✅ Cambiar contraseña del usuario admin en la aplicación

## 📦 Backups

### Script de Backup Automático

Crea `docker/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups/esmassiva"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup de MySQL
docker compose exec -T mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD esmassiva > $BACKUP_DIR/db_$DATE.sql

# Backup de MinIO (si es necesario)
# docker compose exec -T minio mc mirror /data $BACKUP_DIR/minio_$DATE

# Comprimir
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/db_$DATE.sql

# Eliminar backups antiguos (mantener últimos 30 días)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +30 -delete

echo "Backup completado: backup_$DATE.tar.gz"
```

Hacer ejecutable y programar con cron:

```bash
chmod +x docker/backup.sh

# Agregar a crontab (backup diario a las 2 AM)
crontab -e
# Agregar: 0 2 * * * /ruta/completa/docker/backup.sh
```

## 🔄 Actualizaciones

### Actualizar la Aplicación

```bash
cd /ruta/del/proyecto

# Si usas Git
git pull origin main

# Reconstruir y reiniciar
cd docker
docker compose down
docker compose build --no-cache app
docker compose up -d

# Verificar
docker compose logs -f app
```

## 📊 Monitoreo

### Ver Estado de los Servicios

```bash
# Estado general
docker compose ps

# Uso de recursos
docker stats

# Logs en tiempo real
docker compose logs -f
```

### Health Checks

Los servicios tienen health checks configurados. Puedes verificar:

```bash
# Verificar salud de la app
curl http://localhost:3000

# Verificar MySQL
docker compose exec mysql mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD
```

## 🐛 Troubleshooting

### La aplicación no inicia

```bash
# Ver logs detallados
docker compose logs app

# Verificar variables de entorno
docker compose exec app env | grep -E "NODE_ENV|DATABASE_URL"

# Reconstruir desde cero
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

### Problemas de base de datos

```bash
# Acceder a MySQL
docker compose exec mysql mysql -u root -p

# Verificar conexión
docker compose exec app pnpm db:push
```

### Problemas de MinIO

```bash
# Ver logs de MinIO
docker compose logs minio

# Acceder a la consola
# http://localhost:9001 (solo si LISTEN_IP=0.0.0.0)
```

## 📝 Checklist de Producción

- [ ] Variables de entorno configuradas con contraseñas seguras
- [ ] Certificado SSL instalado y configurado
- [ ] Firewall configurado (solo puertos necesarios)
- [ ] Adminer restringido a localhost
- [ ] MinIO Console restringida a localhost
- [ ] Backups automáticos configurados
- [ ] Dominio apuntando al servidor
- [ ] NODE_ENV=production configurado
- [ ] BASE_URL configurado con el dominio real
- [ ] Contraseña de admin cambiada en la aplicación
- [ ] Monitoreo básico configurado

## 🌐 URLs de Producción

| Servicio | URL | Acceso |
|----------|-----|--------|
| **Aplicación** | https://tudominio.com | Público |
| **Admin Panel** | https://tudominio.com/admin | Autenticado |
| **Adminer** | http://localhost:8080 | Solo localhost |
| **MinIO Console** | http://localhost:9001 | Solo localhost |

## 💡 Optimizaciones Adicionales

### 1. Usar un Proxy Reverso Externo (Nginx/Apache)

En lugar de usar el Nginx de Docker, puedes usar Nginx instalado en el host:

```nginx
# /etc/nginx/sites-available/esmassiva
upstream esmassiva {
    server 127.0.0.1:3000;
}

server {
    listen 443 ssl http2;
    server_name tudominio.com;

    location / {
        proxy_pass http://esmassiva;
        # ... resto de configuración
    }
}
```

### 2. Configurar Logs Rotativos

```yaml
# En docker/compose.yaml, agregar logging:
app:
  logging:
    driver: "json-file"
    options:
      max-size: "10m"
      max-file: "3"
```

### 3. Límites de Recursos

```yaml
# En docker/compose.yaml
app:
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 2G
      reservations:
        cpus: '1'
        memory: 1G
```

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs: `docker compose logs -f`
2. Verifica las variables de entorno
3. Consulta la documentación de Docker Compose
4. Revisa los issues del proyecto

