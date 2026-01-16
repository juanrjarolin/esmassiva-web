#!/bin/bash

# Diagnóstico rápido del problema

# Detectar Docker Compose
if docker compose version >/dev/null 2>&1; then
    CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    CMD="docker-compose"
else
    echo "Error: Docker Compose no encontrado"
    exit 1
fi

# Detectar .env
ENV_ARG=""
if [ -f ../.env ]; then
    ENV_ARG="--env-file ../.env"
    echo "✓ Usando .env de la raíz"
elif [ -f .env ]; then
    ENV_ARG="--env-file .env"
    echo "✓ Usando .env de docker/"
else
    echo "⚠ .env no encontrado"
fi

echo ""
echo "=== Estado de contenedores ==="
$CMD $ENV_ARG ps -a

echo ""
echo "=== Logs del contenedor app (últimas 50 líneas) ==="
$CMD $ENV_ARG logs --tail=50 app 2>&1

echo ""
echo "=== Intentando levantar ==="
$CMD $ENV_ARG up -d 2>&1 | tail -20

echo ""
echo "=== Estado después del intento ==="
$CMD $ENV_ARG ps app

