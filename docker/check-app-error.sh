#!/bin/bash

# Script rápido para ver el error del contenedor app

# Detectar qué comando de Docker Compose usar
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo "Error: Docker Compose no está instalado"
    exit 1
fi

echo "=== Logs del contenedor app (últimas 100 líneas) ==="
echo ""
$DOCKER_COMPOSE_CMD logs --tail=100 app

echo ""
echo "=== Estado del contenedor ==="
$DOCKER_COMPOSE_CMD ps app

echo ""
echo "=== Verificar si el contenedor está corriendo ==="
if $DOCKER_COMPOSE_CMD ps app | grep -q "Up"; then
    echo "✓ Contenedor está corriendo"
else
    echo "✗ Contenedor NO está corriendo"
    echo ""
    echo "=== Intentar iniciar el contenedor ==="
    $DOCKER_COMPOSE_CMD up -d app
    sleep 3
    echo ""
    echo "=== Logs después de reiniciar ==="
    $DOCKER_COMPOSE_CMD logs --tail=50 app
fi

