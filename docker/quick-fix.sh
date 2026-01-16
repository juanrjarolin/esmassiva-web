#!/bin/bash

# Script rápido para diagnosticar y solucionar el error del contenedor app

# Detectar qué comando de Docker Compose usar
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo "Error: Docker Compose no está instalado"
    exit 1
fi

echo "=== Diagnóstico del Error del Contenedor App ==="
echo ""

# 1. Ver logs completos
echo "1. Logs del contenedor (últimas 50 líneas):"
echo "----------------------------------------"
$DOCKER_COMPOSE_CMD logs --tail=50 app
echo ""

# 2. Verificar variables de entorno
echo "2. Variables de entorno del contenedor:"
echo "----------------------------------------"
$DOCKER_COMPOSE_CMD exec app env 2>/dev/null | grep -E "NODE_ENV|BASE_PATH|BASE_URL|ADMIN_PASSWORD" || echo "No se puede acceder al contenedor (probablemente está detenido)"
echo ""

# 3. Verificar archivo .env
echo "3. Verificando archivo .env:"
echo "----------------------------------------"
if [ -f .env ]; then
    echo "✓ Archivo .env existe"
    echo "Variables relevantes:"
    grep -E "NODE_ENV|BASE_PATH|BASE_URL|ADMIN_PASSWORD" .env || echo "No se encontraron estas variables"
else
    echo "✗ Archivo .env NO existe"
    echo "Crea uno desde env.example.txt"
fi
echo ""

# 4. Intentar reiniciar
echo "4. Intentando reiniciar el contenedor:"
echo "----------------------------------------"
$DOCKER_COMPOSE_CMD restart app
sleep 5

# 5. Verificar estado
echo ""
echo "5. Estado después del reinicio:"
echo "----------------------------------------"
$DOCKER_COMPOSE_CMD ps app

# 6. Ver logs después del reinicio
echo ""
echo "6. Logs después del reinicio (últimas 30 líneas):"
echo "----------------------------------------"
$DOCKER_COMPOSE_CMD logs --tail=30 app

echo ""
echo "=== Fin del diagnóstico ==="
echo ""
echo "Si el problema persiste:"
echo "1. Verifica que todas las variables en .env estén correctas"
echo "2. Reconstruye: $DOCKER_COMPOSE_CMD build --no-cache app"
echo "3. Revisa los logs completos: $DOCKER_COMPOSE_CMD logs app"

