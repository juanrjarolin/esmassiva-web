# Solución de Problemas

## Problemas con Repositorios APT

### Error: "404 Not Found" o "does not have a Release file"

Si ves errores como:
```
Err:4 http://ppa.launchpad.net/certbot/certbot/ubuntu focal Release
  404  Not Found
E: The repository 'http://ppa.launchpad.net/certbot/certbot/ubuntu focal Release' does not have a Release file.
```

**Solución:**

```bash
cd docker
chmod +x fix-repositories.sh
sudo bash fix-repositories.sh
```

O manualmente:

```bash
# Eliminar repositorio obsoleto de certbot
sudo rm -f /etc/apt/sources.list.d/certbot-ubuntu-certbot-*.list
sudo rm -f /etc/apt/sources.list.d/certbot-ubuntu-certbot-*.save

# Limpiar cache
sudo apt-get clean
sudo rm -rf /var/lib/apt/lists/*

# Actualizar
sudo apt-get update
```

### Error: "changed its 'Label' value"

Si ves errores como:
```
E: Repository 'http://ppa.launchpad.net/ondrej/apache2/ubuntu focal InRelease' changed its 'Label' value
```

**Solución:**

```bash
# Aceptar cambios y actualizar
sudo apt-get update -o Acquire::AllowInsecureRepositories=true -o Acquire::AllowDowngradeToInsecureRepositories=true

# Luego actualizar normalmente
sudo apt-get update
```

O usar el script automático:

```bash
cd docker
chmod +x fix-repositories.sh
sudo bash fix-repositories.sh
```

## Problemas con Docker

### Error: "docker compose" no funciona

Si `docker compose` no está disponible, el script de instalación instalará automáticamente `docker-compose` (V1).

Para verificar qué comando usar:

```bash
# Probar V2 primero
docker compose version

# Si falla, probar V1
docker-compose --version
```

### Error: Permisos denegados

Si ves errores como "permission denied" o "Cannot connect to the Docker daemon":

```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Cerrar sesión y volver a iniciar, o ejecutar:
newgrp docker

# Verificar
docker ps
```

### Error: Docker no inicia

```bash
# Verificar estado
sudo systemctl status docker

# Iniciar Docker
sudo systemctl start docker

# Habilitar inicio automático
sudo systemctl enable docker

# Ver logs si hay problemas
sudo journalctl -u docker
```

## Problemas con Docker Compose

### Error: "unknown shorthand flag: 'd' in -d"

Este error indica que `docker compose` no está disponible. Soluciones:

1. **Usar el script que detecta automáticamente:**
   ```bash
   ./scripts/docker-compose up -d
   ```

2. **Instalar Docker Compose manualmente:**
   ```bash
   # V2 (plugin)
   sudo apt-get install docker-compose-plugin

   # O V1 (standalone)
   sudo curl -L "https://github.com/docker/compose/releases/download/v1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

### Error: "compose.yaml not found"

Asegúrate de estar en la carpeta correcta:

```bash
cd docker
docker compose up -d
```

## Problemas con la Aplicación

### La aplicación no inicia

```bash
# Ver logs detallados
docker compose logs app

# Verificar variables de entorno
docker compose exec app env | grep -E "NODE_ENV|DATABASE_URL"

# Reconstruir desde cero
docker compose down -v
docker compose build --no-cache app
docker compose up -d
```

### Error de conexión a la base de datos

```bash
# Verificar que MySQL está corriendo
docker compose ps mysql

# Ver logs de MySQL
docker compose logs mysql

# Verificar conexión
docker compose exec mysql mysql -u root -p -e "SHOW DATABASES;"
```

### Error con MinIO

```bash
# Ver logs
docker compose logs minio

# Verificar que está corriendo
docker compose ps minio

# Acceder a la consola (si LISTEN_IP=0.0.0.0)
# http://localhost:9001
```

## Problemas de Red/Puertos

### Puerto ya en uso

Si un puerto está ocupado:

```bash
# Ver qué proceso usa el puerto
sudo lsof -i :3000
sudo netstat -tulpn | grep :3000

# Detener el proceso o cambiar el puerto en .env
# LISTEN_IP=127.0.0.1:3001:3000
```

### No se puede acceder desde fuera

Verifica que `LISTEN_IP=0.0.0.0` en el archivo `.env`:

```bash
cd docker
grep LISTEN_IP .env
```

Si está en `127.0.0.1`, cámbialo a `0.0.0.0` para acceso externo.

## Problemas de Recursos

### Contenedor se queda sin memoria

```bash
# Ver uso de recursos
docker stats

# Aumentar límites en compose.yaml
# Agregar:
# deploy:
#   resources:
#     limits:
#       memory: 2G
```

### Disco lleno

```bash
# Limpiar imágenes no usadas
docker system prune -a

# Limpiar volúmenes (¡cuidado, borra datos!)
docker volume prune
```

## Comandos Útiles de Diagnóstico

```bash
# Estado de todos los servicios
docker compose ps

# Logs en tiempo real
docker compose logs -f

# Logs de un servicio específico
docker compose logs -f app

# Entrar al contenedor
docker compose exec app bash

# Verificar health checks
docker compose ps | grep healthy

# Reiniciar un servicio
docker compose restart app

# Reconstruir un servicio
docker compose build --no-cache app
docker compose up -d app
```

## Obtener Ayuda

Si los problemas persisten:

1. Revisa los logs: `docker compose logs -f`
2. Verifica la configuración en `.env`
3. Consulta la documentación de Docker Compose
4. Revisa los issues del proyecto

