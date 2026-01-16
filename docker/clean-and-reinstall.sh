#!/bin/bash

# =============================================================================
# Script para Limpiar Todo y Reinstalar desde Cero
# =============================================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${RED}=============================================="
echo "  ⚠️  LIMPIEZA COMPLETA Y REINSTALACIÓN"
echo -e "==============================================${NC}\n"

echo -e "${YELLOW}Este script va a:${NC}"
echo "  1. Detener y eliminar todos los contenedores"
echo "  2. Eliminar todos los volúmenes (¡se perderán los datos!)"
echo "  3. Eliminar las imágenes de Docker"
echo "  4. Limpiar el sistema Docker"
echo "  5. Reconstruir todo desde cero"
echo ""

read -p "¿Estás seguro de que quieres continuar? (escribe 'SI' para confirmar): " confirm
if [ "$confirm" != "SI" ]; then
    echo -e "${YELLOW}Operación cancelada${NC}"
    exit 0
fi

# Detectar Docker Compose
if docker compose version >/dev/null 2>&1; then
    CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    CMD="docker-compose"
else
    echo -e "${RED}Error: Docker Compose no encontrado${NC}"
    exit 1
fi

# Detectar .env
ENV_ARG=""
ENV_FILE=""
if [ -f ../.env ]; then
    ENV_ARG="--env-file ../.env"
    ENV_FILE="../.env"
    echo -e "${BLUE}✓ Usando .env de la raíz del proyecto${NC}"
elif [ -f .env ]; then
    ENV_ARG="--env-file .env"
    ENV_FILE=".env"
    echo -e "${BLUE}✓ Usando .env de la carpeta docker/${NC}"
else
    echo -e "${YELLOW}⚠ .env no encontrado, se creará uno por defecto${NC}"
fi

echo ""
echo -e "${YELLOW}Paso 1: Deteniendo y eliminando contenedores...${NC}"
$CMD $ENV_ARG down -v 2>/dev/null || true
echo -e "${GREEN}✓ Contenedores eliminados${NC}"

echo ""
echo -e "${YELLOW}Paso 2: Eliminando imágenes...${NC}"
if [ -n "$ENV_ARG" ]; then
    # Intentar eliminar la imagen específica del proyecto
    docker rmi docker-app 2>/dev/null || echo "  Imagen docker-app no encontrada o en uso"
else
    docker images | grep -E "docker-app|esmassiva" | awk '{print $3}' | xargs -r docker rmi 2>/dev/null || true
fi
echo -e "${GREEN}✓ Imágenes eliminadas${NC}"

echo ""
echo -e "${YELLOW}Paso 3: Limpiando sistema Docker...${NC}"
docker system prune -f
echo -e "${GREEN}✓ Sistema limpiado${NC}"

echo ""
echo -e "${YELLOW}Paso 4: Verificando archivo .env...${NC}"
if [ -z "$ENV_FILE" ] || [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}Creando archivo .env desde ejemplo...${NC}"
    if [ -f env.example.txt ]; then
        if [ -f ../.env ]; then
            ENV_FILE="../.env"
        else
            cp env.example.txt ../.env
            ENV_FILE="../.env"
        fi
        ENV_ARG="--env-file $ENV_FILE"
        echo -e "${GREEN}✓ Archivo .env creado${NC}"
    else
        echo -e "${RED}✗ env.example.txt no encontrado${NC}"
        exit 1
    fi
fi

# Verificar y agregar variables necesarias
echo -e "${YELLOW}Verificando variables de entorno...${NC}"
if ! grep -q "^NODE_ENV=" "$ENV_FILE" 2>/dev/null; then
    echo "NODE_ENV=production" >> "$ENV_FILE"
    echo -e "${GREEN}✓ NODE_ENV agregado${NC}"
fi

if ! grep -q "^BASE_PATH=" "$ENV_FILE" 2>/dev/null; then
    echo "BASE_PATH=/esmassiva-web" >> "$ENV_FILE"
    echo -e "${GREEN}✓ BASE_PATH agregado${NC}"
fi

if ! grep -q "^ADMIN_PASSWORD=" "$ENV_FILE" 2>/dev/null; then
    echo "ADMIN_PASSWORD=admin123" >> "$ENV_FILE"
    echo -e "${GREEN}✓ ADMIN_PASSWORD agregado${NC}"
fi

echo ""
echo -e "${YELLOW}Paso 5: Reconstruyendo imágenes...${NC}"
$CMD $ENV_ARG build --no-cache --pull
echo -e "${GREEN}✓ Imágenes reconstruidas${NC}"

echo ""
echo -e "${YELLOW}Paso 6: Levantando servicios...${NC}"
$CMD $ENV_ARG up -d

echo ""
echo -e "${YELLOW}Paso 7: Esperando a que los servicios estén listos...${NC}"
sleep 10

echo ""
echo -e "${YELLOW}Paso 8: Verificando estado...${NC}"
$CMD $ENV_ARG ps

echo ""
echo -e "${GREEN}=============================================="
echo "  Reinstalación Completada"
echo -e "==============================================${NC}\n"

echo -e "${BLUE}Próximos pasos:${NC}"
echo "1. Monitorea los logs: $CMD $ENV_ARG logs -f app"
echo "2. Verifica el estado: $CMD $ENV_ARG ps"
echo "3. Espera a que el build termine (puede tardar varios minutos)"
echo ""

echo -e "${YELLOW}Nota:${NC}"
echo "- El build en producción puede tardar 5-10 minutos"
echo "- Verifica los logs para asegurarte de que todo esté bien"
echo "- Si el contenedor está 'unhealthy', espera unos minutos más"
echo ""

echo -e "${BLUE}Ver logs en tiempo real:${NC}"
echo "  $CMD $ENV_ARG logs -f app"
echo ""

