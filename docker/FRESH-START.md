# Inicio Limpio - Reinstalación Completa

Si tienes problemas persistentes, puedes hacer una limpieza completa y reinstalar desde cero.

## ⚠️ Advertencia

Esto eliminará:
- Todos los contenedores
- Todos los volúmenes (¡se perderán los datos de la base de datos!)
- Las imágenes de Docker
- Los datos de MinIO

## Opción 1: Script Automático (Recomendado)

```bash
cd /var/www/html/esmassiva-web/docker
chmod +x clean-and-reinstall.sh
./clean-and-reinstall.sh
```

El script te pedirá confirmación antes de proceder.

## Opción 2: Manual Paso a Paso

### 1. Detener y eliminar todo

```bash
cd /var/www/html/esmassiva-web/docker

# Detectar .env
if [ -f ../.env ]; then
    ENV_ARG="--env-file ../.env"
else
    ENV_ARG="--env-file .env"
fi

# Detener y eliminar contenedores y volúmenes
docker compose $ENV_ARG down -v

# Eliminar imágenes
docker rmi docker-app 2>/dev/null || true

# Limpiar sistema
docker system prune -f
```

### 2. Verificar/Crear .env

```bash
# Desde la raíz del proyecto
cd /var/www/html/esmassiva-web

# Si no existe, crearlo
if [ ! -f .env ]; then
    cp docker/env.example.txt .env
fi

# Agregar variables necesarias
if ! grep -q "^NODE_ENV=" .env; then
    echo "" >> .env
    echo "NODE_ENV=production" >> .env
fi

if ! grep -q "^BASE_PATH=" .env; then
    echo "BASE_PATH=/esmassiva-web" >> .env
fi

if ! grep -q "^ADMIN_PASSWORD=" .env; then
    echo "ADMIN_PASSWORD=admin123" >> .env
fi
```

### 3. Reconstruir y levantar

```bash
cd /var/www/html/esmassiva-web/docker

# Reconstruir sin cache
docker compose --env-file ../.env build --no-cache

# Levantar servicios
docker compose --env-file ../.env up -d

# Ver logs
docker compose --env-file ../.env logs -f app
```

## Opción 3: Solo Limpiar Contenedores (Sin perder datos)

Si solo quieres reiniciar sin perder datos:

```bash
cd /var/www/html/esmassiva-web/docker

# Detener contenedores (sin eliminar volúmenes)
docker compose --env-file ../.env down

# Reconstruir solo la app
docker compose --env-file ../.env build --no-cache app

# Levantar de nuevo
docker compose --env-file ../.env up -d
```

## Verificación Después de la Reinstalación

```bash
# 1. Ver estado
docker compose --env-file ../.env ps

# 2. Ver logs
docker compose --env-file ../.env logs -f app

# 3. Verificar que el build se completó (producción)
docker compose --env-file ../.env exec app test -d .output && echo "OK" || echo "Build failed"

# 4. Verificar que el servidor responde
docker compose --env-file ../.env exec app curl http://localhost:3000
```

## Tiempos Esperados

- **Build de producción**: 5-10 minutos
- **Instalación de dependencias**: 2-5 minutos
- **Inicio del servidor**: 30-60 segundos

## Si Algo Sale Mal

1. **Ver logs completos:**
   ```bash
   docker compose --env-file ../.env logs app > error.log
   # Revisar el archivo error.log
   ```

2. **Entrar al contenedor para debugging:**
   ```bash
   docker compose --env-file ../.env exec app bash
   ```

3. **Verificar espacio en disco:**
   ```bash
   df -h
   docker system df
   ```

## Backup Antes de Limpiar

Si quieres hacer backup antes de limpiar:

```bash
# Backup de la base de datos
docker compose --env-file ../.env exec mysql mysqldump -u root -p esmassiva > backup.sql

# Backup de MinIO (si es necesario)
# docker compose --env-file ../.env exec minio mc mirror /data /backup
```

