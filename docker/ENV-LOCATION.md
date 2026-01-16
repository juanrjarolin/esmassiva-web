# Ubicación del Archivo .env

El archivo `.env` puede estar en dos ubicaciones:

1. **Raíz del proyecto** (recomendado): `/var/www/html/esmassiva-web/.env`
2. **Carpeta docker**: `/var/www/html/esmassiva-web/docker/.env`

## Configuración Automática

Los scripts detectan automáticamente dónde está el `.env`:
- `scripts/docker-compose` - Busca primero en la raíz, luego en docker/
- `docker/deploy-production.sh` - Busca primero en la raíz, luego en docker/

## Uso Manual con Docker Compose

Si el `.env` está en la raíz del proyecto:

```bash
cd docker
docker compose --env-file ../.env up -d
```

Si el `.env` está en la carpeta docker:

```bash
cd docker
docker compose up -d
```

## Verificar Ubicación del .env

```bash
# Desde la raíz del proyecto
if [ -f .env ]; then
    echo "✓ .env encontrado en la raíz"
elif [ -f docker/.env ]; then
    echo "✓ .env encontrado en docker/"
else
    echo "✗ .env no encontrado"
fi
```

## Crear .env desde el Ejemplo

```bash
# Si quieres crearlo en la raíz
cp docker/env.example.txt .env

# Si quieres crearlo en docker/
cd docker
cp env.example.txt .env
```

## Variables Mínimas Requeridas

Asegúrate de que el `.env` tenga al menos:

```env
NODE_ENV=production
ADMIN_PASSWORD=tu_password_seguro
BASE_PATH=/esmassiva-web
MYSQL_PASSWORD=esmassiva
MYSQL_ROOT_PASSWORD=root
```

