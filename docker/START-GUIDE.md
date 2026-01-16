# Guía Rápida: Solucionar Error del Contenedor App

## Error Común

```
WARN[0000] The "NODE_ENV" variable is not set. Defaulting to a blank string.
✘ Container docker-app-1                 Error
dependency failed to start: container docker-app-1 is unhealthy
```

## Solución Rápida

### Paso 1: Verificar/Crear archivo .env

```bash
cd docker

# Si no existe .env, crearlo desde el ejemplo
if [ ! -f .env ]; then
    cp env.example.txt .env
fi

# Verificar que NODE_ENV esté configurado
if ! grep -q "^NODE_ENV=" .env; then
    echo "" >> .env
    echo "NODE_ENV=production" >> .env
fi
```

O usar el script automático:

```bash
chmod +x fix-env-and-start.sh
./fix-env-and-start.sh
```

### Paso 2: Ver los Logs del Error

```bash
docker compose logs app
```

Esto mostrará el error específico. Los errores comunes son:

1. **Build falló** - Error durante `pnpm build`
2. **Servidor no inicia** - Error al ejecutar `pnpm start`
3. **Healthcheck falla** - El servidor no responde en el puerto 3000

### Paso 3: Reconstruir el Contenedor

```bash
# Detener todo
docker compose down

# Reconstruir sin cache
docker compose build --no-cache app

# Levantar de nuevo
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f app
```

### Paso 4: Verificar el Archivo .env

Asegúrate de que el archivo `.env` tenga al menos:

```env
NODE_ENV=production
ADMIN_PASSWORD=tu_password_seguro
BASE_PATH=/esmassiva-web
MYSQL_PASSWORD=esmassiva
MYSQL_ROOT_PASSWORD=root
```

## Errores Específicos y Soluciones

### Error: "Build output directory not found"

El build falló. Solución:

```bash
# Ver logs del build
docker compose logs app | grep -i "build\|error"

# Entrar al contenedor y construir manualmente
docker compose exec app bash
cd /app
pnpm install
pnpm build
# Revisar errores
exit

# Reconstruir
docker compose build --no-cache app
docker compose up -d
```

### Error: Healthcheck failed

El servidor no está respondiendo. Solución:

```bash
# Verificar que el servidor esté corriendo
docker compose exec app ps aux | grep node

# Verificar que el puerto esté en escucha
docker compose exec app netstat -tuln | grep 3000

# Probar manualmente
docker compose exec app curl http://localhost:3000

# Si falla, ver logs
docker compose logs app
```

### Error: "Cannot find module" o errores de dependencias

```bash
# Reinstalar dependencias
docker compose exec app bash
cd /app
rm -rf node_modules
pnpm install
exit

# O reconstruir desde cero
docker compose down -v
docker compose build --no-cache app
docker compose up -d
```

## Verificación Final

Después de aplicar la solución:

```bash
# Ver estado de todos los contenedores
docker compose ps

# Verificar que app está healthy
docker compose ps app

# Ver logs
docker compose logs -f app

# Probar acceso
curl http://localhost:3000
```

## Si Nada Funciona

1. **Ver logs completos:**
   ```bash
   docker compose logs app > app-error.log
   # Revisar el archivo para encontrar el error exacto
   ```

2. **Reconstruir desde cero:**
   ```bash
   docker compose down -v
   docker compose build --no-cache app
   docker compose up -d
   ```

3. **Verificar espacio en disco:**
   ```bash
   df -h
   docker system df
   ```

4. **Limpiar y reconstruir:**
   ```bash
   docker compose down -v
   docker system prune -a
   docker compose build --no-cache app
   docker compose up -d
   ```

