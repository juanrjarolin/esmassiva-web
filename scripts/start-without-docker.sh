#!/bin/bash

# Script para iniciar la aplicación sin Docker

set -e

cd "$(dirname "$0")/.."

# Verificar que .env existe
if [ ! -f .env ]; then
    echo "Error: Archivo .env no encontrado"
    echo "Crea el archivo .env desde docker/env.example.txt"
    exit 1
fi

# Cargar variables de entorno
export $(grep -v '^#' .env | xargs)

# Verificar que NODE_ENV esté configurado
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV=production
fi

# Verificar que las dependencias estén instaladas
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias..."
    pnpm install
fi

# Verificar que Prisma esté generado
if [ ! -d "src/generated/prisma" ]; then
    echo "Generando Prisma client..."
    pnpm db:push || true
fi

# Si está en producción, verificar build
if [ "$NODE_ENV" = "production" ]; then
    if [ ! -d ".output" ]; then
        echo "Construyendo aplicación..."
        pnpm build
    fi
    echo "Iniciando en modo producción..."
    PORT=${PORT:-3000} pnpm start
else
    echo "Iniciando en modo desarrollo..."
    PORT=${PORT:-3000} pnpm dev
fi

