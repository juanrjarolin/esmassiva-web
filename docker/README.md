# Docker Setup para Esmassiva

## Inicio Rápido

### En Desarrollo Local

```bash
# 1. Crear archivo .env en la carpeta docker/
cd docker
cp env.example.txt .env  # o crea el archivo manualmente

# 2. Levantar todo
docker compose up -d
# O usar el script: ../scripts/docker-compose up -d

# 3. Ver los logs
docker compose logs -f app
```

### En Producción

```bash
# 1. Instalar Docker y Docker Compose
cd docker
chmod +x install-docker.sh
sudo bash install-docker.sh

# 2. Configurar variables de entorno
cp env.example.txt .env
nano .env  # Edita con valores de producción

# 3. Desplegar
sudo bash deploy-production.sh
```

Ver [INSTALL.md](INSTALL.md) para más detalles sobre la instalación de Docker.

## Variables de Entorno

Crea un archivo `.env` en la carpeta `docker/` con:

```env
# Entorno
NODE_ENV=development

# MySQL
MYSQL_ROOT_PASSWORD=root
MYSQL_PASSWORD=esmassiva

# Admin
ADMIN_PASSWORD=admin123

# Opcional: IP de escucha (por defecto 127.0.0.1)
# LISTEN_IP=0.0.0.0
```

## URLs

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Aplicación** | http://localhost:8000 | Sitio web (via Nginx) |
| **Admin Panel** | http://localhost:8000/admin | Panel de administración |
| **Adminer** | http://localhost:8080 | Gestión de base de datos |
| **MinIO Console** | http://localhost:9001 | Gestión de archivos |

## Credenciales por Defecto

### Panel de Administración
- **Email:** admin@esmassiva.com
- **Password:** admin123

### Adminer (Base de datos)
- **Server:** mysql
- **Username:** esmassiva
- **Password:** esmassiva (o lo que pongas en MYSQL_PASSWORD)
- **Database:** esmassiva

### MinIO
- **Username:** admin
- **Password:** admin123 (o lo que pongas en ADMIN_PASSWORD)

## Comandos Útiles

```bash
# Levantar servicios
docker compose up -d

# Ver logs de la aplicación
docker compose logs -f app

# Reiniciar solo la app
docker compose restart app

# Detener todo
docker compose down

# Detener y borrar volúmenes (¡borra la BD!)
docker compose down -v

# Reconstruir la imagen
docker compose build --no-cache app

# Ejecutar comandos en el contenedor de la app
docker compose exec app pnpm db:studio
```

## Estructura

```
docker/
├── compose.yaml      # Configuración de Docker Compose
├── Dockerfile        # Imagen de la aplicación
├── .env              # Variables de entorno (crear)
└── nginx/
    └── conf.d/
        └── default.conf  # Configuración de Nginx
```

## Servicios

1. **mysql** - Base de datos MySQL 8
2. **minio** - Almacenamiento de archivos (S3 compatible)
3. **nginx** - Proxy inverso
4. **adminer** - UI para gestionar la BD
5. **app** - La aplicación Node.js

## Scripts Disponibles

- **`install-docker.sh`** - Instala Docker y Docker Compose en producción
- **`fix-repositories.sh`** - Corrige problemas con repositorios APT
- **`deploy-production.sh`** - Script automatizado para desplegar en producción

Ver [INSTALL.md](INSTALL.md) para instrucciones de instalación y [TROUBLESHOOTING.md](TROUBLESHOOTING.md) para solución de problemas.

## Notas

- La primera vez que levantes, tomará unos minutos mientras instala dependencias y ejecuta el seed.
- Los datos persisten en volúmenes de Docker.
- En desarrollo, los cambios en el código se reflejan automáticamente (hot reload).

