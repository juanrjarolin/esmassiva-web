# Solución: Página en Blanco / Error 404 en main.tsx

## Síntomas

- La aplicación se monta pero muestra todo en blanco
- Error en consola: `Failed to load resource: the server responded with a status of 404 (Not Found) main.tsx:1`
- Los archivos estáticos no se cargan

## Causas Comunes

1. **El build no se completó correctamente**
2. **BASE_URL no está configurado** (puede causar problemas con rutas)
3. **Los archivos estáticos no se generaron en .output/**
4. **El servidor no está sirviendo los archivos correctamente**

## Solución Paso a Paso

### 1. Verificar el Estado Actual

```bash
cd docker

# Ejecutar diagnóstico
chmod +x diagnose-production.sh
./diagnose-production.sh
```

### 2. Verificar Variables de Entorno

Asegúrate de que tu archivo `.env` tenga:

```env
NODE_ENV=production
BASE_URL=http://tu-dominio.com  # O la URL donde está desplegada
```

**Importante:** Si estás accediendo directamente al puerto 3000 o 8000, puedes dejar BASE_URL vacío o usar:
- `BASE_URL=http://localhost:8000` (si accedes vía Nginx)
- `BASE_URL=http://localhost:3000` (si accedes directamente)

### 3. Verificar que el Build se Completó

```bash
# Verificar que existe el directorio .output
docker compose exec app test -d .output && echo "✓ Build OK" || echo "✗ Build failed"

# Ver contenido del build
docker compose exec app ls -la .output/
```

Si el directorio `.output` no existe, el build falló.

### 4. Reconstruir la Aplicación

```bash
# Detener servicios
docker compose down

# Reconstruir sin cache
docker compose build --no-cache app

# Levantar servicios
docker compose up -d

# Ver logs del build
docker compose logs app | grep -i "build\|error"
```

### 5. Verificar Logs Detallados

```bash
# Ver todos los logs
docker compose logs -f app

# Buscar errores específicos
docker compose logs app | grep -i "error\|failed\|404"
```

### 6. Verificar que el Servidor Está Sirviendo Archivos

```bash
# Probar acceso directo al servidor
docker compose exec app curl -I http://localhost:3000/

# Ver qué devuelve
docker compose exec app curl http://localhost:3000/ | head -30
```

### 7. Si el Problema Persiste

#### Opción A: Reconstruir desde Cero

```bash
# Detener y eliminar volúmenes (¡cuidado, esto borra node_modules cache!)
docker compose down -v

# Reconstruir
docker compose build --no-cache app
docker compose up -d

# Esperar a que termine el build (puede tardar varios minutos)
docker compose logs -f app
```

#### Opción B: Verificar Manualmente el Build

```bash
# Entrar al contenedor
docker compose exec app bash

# Dentro del contenedor:
cd /app
pnpm build

# Verificar que se generó .output
ls -la .output/

# Verificar estructura
find .output -type f | head -20

# Salir del contenedor
exit
```

#### Opción C: Verificar Configuración de Vinxi

El problema podría estar en `app.config.ts`. Verifica que la configuración del router "client" (SPA) esté correcta.

## Verificación Final

Después de aplicar la solución:

1. **Verifica que el servidor responde:**
   ```bash
   curl http://localhost:3000/
   ```

2. **Verifica que los archivos estáticos se cargan:**
   - Abre las herramientas de desarrollador del navegador
   - Ve a la pestaña Network
   - Recarga la página
   - Verifica que los archivos JS/CSS se cargan con código 200

3. **Verifica los logs:**
   ```bash
   docker compose logs app | tail -50
   ```

## Comandos Útiles

```bash
# Ver estado
docker compose ps

# Ver logs en tiempo real
docker compose logs -f app

# Reiniciar solo la app
docker compose restart app

# Reconstruir y reiniciar
docker compose build app && docker compose up -d app

# Entrar al contenedor para debugging
docker compose exec app bash
```

## Si Nada Funciona

1. **Verifica la versión de Node:**
   ```bash
   docker compose exec app node --version
   ```
   Debe ser Node 20.x

2. **Verifica que las dependencias se instalaron:**
   ```bash
   docker compose exec app ls -la node_modules/ | head -10
   ```

3. **Revisa los logs completos desde el inicio:**
   ```bash
   docker compose logs app > app-logs.txt
   # Revisa el archivo para encontrar el error exacto
   ```

4. **Intenta ejecutar el build manualmente:**
   ```bash
   docker compose exec app bash
   cd /app
   pnpm install
   pnpm build
   # Revisa los errores que aparezcan
   ```

## Notas Importantes

- El build en producción puede tardar varios minutos
- Asegúrate de tener suficiente espacio en disco
- Los archivos estáticos se generan en `.output/` después de `pnpm build`
- Vinxi sirve automáticamente los archivos desde `.output/` cuando ejecutas `pnpm start`

