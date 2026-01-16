#!/bin/bash

# Script para verificar/corregir .env y diagnosticar el error del contenedor app

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Detectar qué comando de Docker Compose usar
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}Error: Docker Compose no está instalado${NC}"
    exit 1
fi

echo -e "${BLUE}=============================================="
echo "  Diagnóstico y Corrección de .env"
echo -e "==============================================${NC}\n"

# Detectar ubicación del .env (raíz del proyecto o docker/)
if [ -f ../.env ]; then
    ENV_FILE="../.env"
    echo -e "${BLUE}Usando .env de la raíz del proyecto${NC}"
elif [ -f .env ]; then
    ENV_FILE=".env"
    echo -e "${BLUE}Usando .env de la carpeta docker/${NC}"
else
    echo -e "${YELLOW}⚠ Archivo .env no existe. Creando desde env.example.txt...${NC}"
    if [ -f env.example.txt ]; then
        ENV_FILE="../.env"
        cp env.example.txt "$ENV_FILE"
        echo -e "${GREEN}✓ Archivo .env creado en la raíz del proyecto${NC}"
    else
        echo -e "${RED}✗ env.example.txt no existe${NC}"
        exit 1
    fi
fi

# 2. Verificar NODE_ENV
echo -e "\n${YELLOW}Verificando variables de entorno...${NC}"
if ! grep -q "^NODE_ENV=" "$ENV_FILE" 2>/dev/null; then
    echo -e "${YELLOW}⚠ NODE_ENV no está configurado. Agregando...${NC}"
    if ! grep -q "^NODE_ENV" "$ENV_FILE"; then
        echo "" >> "$ENV_FILE"
        echo "# Entorno (development o production)" >> "$ENV_FILE"
        echo "NODE_ENV=production" >> "$ENV_FILE"
        echo -e "${GREEN}✓ NODE_ENV=production agregado${NC}"
    fi
else
    NODE_ENV_VALUE=$(grep "^NODE_ENV=" "$ENV_FILE" | cut -d'=' -f2)
    echo -e "${BLUE}NODE_ENV está configurado como: ${NODE_ENV_VALUE}${NC}"
fi

# 3. Verificar ADMIN_PASSWORD
if ! grep -q "^ADMIN_PASSWORD=" "$ENV_FILE" 2>/dev/null; then
    echo -e "${YELLOW}⚠ ADMIN_PASSWORD no está configurado. Agregando valor por defecto...${NC}"
    echo "" >> "$ENV_FILE"
    echo "# Contraseña de administrador" >> "$ENV_FILE"
    echo "ADMIN_PASSWORD=admin123" >> "$ENV_FILE"
    echo -e "${GREEN}✓ ADMIN_PASSWORD agregado${NC}"
fi

# 4. Verificar BASE_PATH
if ! grep -q "^BASE_PATH=" "$ENV_FILE" 2>/dev/null; then
    echo -e "${YELLOW}⚠ BASE_PATH no está configurado. Agregando /esmassiva-web...${NC}"
    echo "" >> "$ENV_FILE"
    echo "# Ruta base de la aplicación" >> "$ENV_FILE"
    echo "BASE_PATH=/esmassiva-web" >> "$ENV_FILE"
    echo -e "${GREEN}✓ BASE_PATH=/esmassiva-web agregado${NC}"
fi

# 5. Mostrar resumen
echo -e "\n${BLUE}Variables configuradas en $ENV_FILE:${NC}"
grep -E "^NODE_ENV=|^ADMIN_PASSWORD=|^BASE_PATH=|^MYSQL_PASSWORD=" "$ENV_FILE" | sed 's/=.*/=***/' || echo "No se encontraron variables relevantes"

# 6. Ver logs del contenedor app si existe
echo -e "\n${YELLOW}Verificando estado del contenedor app...${NC}"
if $DOCKER_COMPOSE_CMD ps app 2>/dev/null | grep -q "app"; then
    echo -e "${BLUE}Estado actual:${NC}"
    $DOCKER_COMPOSE_CMD ps app

    echo -e "\n${BLUE}Últimas 50 líneas de logs:${NC}"
    $DOCKER_COMPOSE_CMD logs --tail=50 app
else
    echo -e "${YELLOW}El contenedor app no está corriendo${NC}"
fi

# 7. Recomendaciones
echo -e "\n${GREEN}=============================================="
echo "  Próximos Pasos"
echo -e "==============================================${NC}\n"

echo -e "${BLUE}1. Revisa el archivo .env y ajusta los valores si es necesario:${NC}"
echo "   nano .env"

echo -e "\n${BLUE}2. Si el contenedor está fallando, reconstruye:${NC}"
echo "   $DOCKER_COMPOSE_CMD --env-file \"$ENV_FILE\" down"
echo "   $DOCKER_COMPOSE_CMD --env-file \"$ENV_FILE\" build --no-cache app"
echo "   $DOCKER_COMPOSE_CMD --env-file \"$ENV_FILE\" up -d"

echo -e "\n${BLUE}3. Monitorea los logs:${NC}"
echo "   $DOCKER_COMPOSE_CMD --env-file \"$ENV_FILE\" logs -f app"

echo -e "\n${BLUE}4. Verifica el estado:${NC}"
echo "   $DOCKER_COMPOSE_CMD --env-file \"$ENV_FILE\" ps"

echo ""

