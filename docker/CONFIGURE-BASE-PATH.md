# Configurar Ruta Base de la Aplicación

Si tu aplicación se sirve desde una subcarpeta (ej: `/esmassiva-web/`), necesitas configurar el `BASE_PATH`.

## Configuración

### 1. Editar archivo `.env`

En la carpeta `docker/`, edita el archivo `.env` y agrega:

```env
BASE_PATH=/esmassiva-web
```

**Importante:**
- Debe empezar con `/`
- No debe terminar con `/`
- Ejemplos válidos: `/esmassiva-web`, `/app`, `/mi-app`

### 2. Reconstruir y reiniciar

```bash
cd docker
docker compose down
docker compose build --no-cache app
docker compose up -d
```

### 3. Verificar

La aplicación debería estar accesible en:
- `http://tu-servidor:8000/esmassiva-web/`
- `http://tu-servidor:3000/esmassiva-web/` (directo)

## Qué hace BASE_PATH

1. **Configura Vinxi/Vite** para generar las rutas de assets con el prefijo correcto
2. **Configura las rutas de la API** (tRPC, debug) con el prefijo
3. **Configura Nginx** para servir desde la ruta base

## Sin BASE_PATH (raíz)

Si quieres servir desde la raíz (`/`), simplemente no configures `BASE_PATH` o déjalo vacío:

```env
# BASE_PATH=
```

O elimina la variable del `.env`.

## Troubleshooting

### Los assets no se cargan

1. Verifica que `BASE_PATH` esté configurado correctamente en `.env`
2. Verifica que el contenedor tenga la variable:
   ```bash
   docker compose exec app env | grep BASE_PATH
   ```
3. Reconstruye la aplicación:
   ```bash
   docker compose build --no-cache app
   docker compose up -d
   ```

### Error 404 en las rutas

Asegúrate de que todas las rutas de la aplicación usen rutas relativas o que el router esté configurado correctamente con el base path.

### Nginx no redirige correctamente

Verifica la configuración de Nginx en `docker/nginx/conf.d/default.conf`. La configuración debería manejar automáticamente `/esmassiva-web` si `BASE_PATH` está configurado.

