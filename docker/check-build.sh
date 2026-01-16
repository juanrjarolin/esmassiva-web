#!/bin/bash

# Script rápido para verificar el estado del build en producción

# Detectar qué comando de Docker Compose usar
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo "Error: Docker Compose no está instalado"
    exit 1
fi

echo "=== Verificando Build en Producción ==="
echo ""

# 1. Verificar que el contenedor está corriendo
if ! $DOCKER_COMPOSE_CMD ps app | grep -q "Up"; then
    echo "❌ El contenedor de la app no está corriendo"
    echo "Ejecuta: $DOCKER_COMPOSE_CMD up -d"
    exit 1
fi

echo "✓ Contenedor está corriendo"
echo ""

# 2. Verificar NODE_ENV
NODE_ENV=$($DOCKER_COMPOSE_CMD exec -T app printenv NODE_ENV)
echo "NODE_ENV: ${NODE_ENV:-no configurado}"
echo ""

# 3. Verificar si existe .output
if $DOCKER_COMPOSE_CMD exec -T app test -d .output 2>/dev/null; then
    echo "✓ Directorio .output existe"

    # Ver estructura
    echo ""
    echo "Estructura de .output:"
    $DOCKER_COMPOSE_CMD exec -T app find .output -type f -name "*.html" -o -name "*.js" -o -name "*.css" | head -20

    # Verificar index.html procesado
    if $DOCKER_COMPOSE_CMD exec -T app test -f .output/public/index.html 2>/dev/null; then
        echo ""
        echo "✓ index.html encontrado en .output/public/"
        echo ""
        echo "Contenido del index.html (primeras 30 líneas):"
        $DOCKER_COMPOSE_CMD exec -T app head -30 .output/public/index.html
    else
        echo ""
        echo "⚠ index.html no encontrado en .output/public/"
        echo "Buscando en otras ubicaciones:"
        $DOCKER_COMPOSE_CMD exec -T app find .output -name "index.html" 2>/dev/null || echo "No encontrado"
    fi
else
    echo "❌ Directorio .output NO existe"
    echo "El build no se completó correctamente"
    echo ""
    echo "Logs recientes:"
    $DOCKER_COMPOSE_CMD logs --tail=30 app | grep -i "build\|error\|failed" || $DOCKER_COMPOSE_CMD logs --tail=30 app
    exit 1
fi

echo ""
echo "=== Verificando respuesta del servidor ==="
echo ""

# 4. Verificar qué HTML está sirviendo
HTML_RESPONSE=$($DOCKER_COMPOSE_CMD exec -T app curl -s http://localhost:3000/ 2>/dev/null | head -20)
echo "HTML servido por el servidor (primeras 20 líneas):"
echo "$HTML_RESPONSE"

echo ""
echo "=== Verificando rutas de archivos estáticos ==="
echo ""

# 5. Buscar referencias a /src/main.tsx en el HTML servido
if echo "$HTML_RESPONSE" | grep -q "/src/main.tsx"; then
    echo "❌ PROBLEMA ENCONTRADO: El HTML todavía referencia /src/main.tsx"
    echo "Esto significa que el servidor está sirviendo el index.html sin procesar"
    echo ""
    echo "Posibles causas:"
    echo "1. El build no se completó correctamente"
    echo "2. El servidor no está sirviendo desde .output/"
    echo "3. Hay un problema con la configuración de Vinxi"
    echo ""
    echo "Solución:"
    echo "1. Verifica los logs: $DOCKER_COMPOSE_CMD logs app"
    echo "2. Reconstruye: $DOCKER_COMPOSE_CMD build --no-cache app && $DOCKER_COMPOSE_CMD up -d"
    echo "3. Verifica que NODE_ENV=production en .env"
else
    echo "✓ El HTML no referencia /src/main.tsx (debería estar procesado)"
fi

echo ""
echo "=== Fin de verificación ==="

