#!/bin/bash

# =============================================================================
# Script para iniciar la aplicación localmente (sin Docker)
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=============================================="
echo "  Iniciando esmassiva"
echo -e "==============================================${NC}"

# Verificar que existe .env
if [ ! -f .env ]; then
    echo -e "${RED}Error: No se encontró el archivo .env${NC}"
    echo "Copia apache/env.example.txt a .env y configúralo:"
    echo "  cp apache/env.example.txt .env"
    exit 1
fi

# Verificar PostgreSQL
echo -e "\n${YELLOW}Verificando PostgreSQL...${NC}"
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo -e "${RED}PostgreSQL no está corriendo. Iniciándolo...${NC}"
    sudo systemctl start postgresql
fi
echo -e "${GREEN}PostgreSQL está listo${NC}"

# Verificar MinIO (opcional)
if systemctl is-active --quiet minio 2>/dev/null; then
    echo -e "${GREEN}MinIO está corriendo${NC}"
else
    echo -e "${YELLOW}MinIO no está corriendo (opcional para desarrollo)${NC}"
fi

# Verificar dependencias
if [ ! -d "node_modules" ]; then
    echo -e "\n${YELLOW}Instalando dependencias...${NC}"
    pnpm install
fi

# Sincronizar base de datos
echo -e "\n${YELLOW}Sincronizando base de datos...${NC}"
pnpm db:push

# Iniciar aplicación
echo -e "\n${GREEN}Iniciando aplicación en modo ${NODE_ENV:-development}...${NC}"
echo -e "Accede en: ${GREEN}http://localhost:3000${NC}"
echo -e "O a través de Apache: ${GREEN}http://localhost${NC}"
echo ""

if [ "${1:-}" = "prod" ] || [ "$NODE_ENV" = "production" ]; then
    echo "Construyendo para producción..."
    pnpm build
    PORT=3000 pnpm start
else
    PORT=3000 pnpm dev
fi

