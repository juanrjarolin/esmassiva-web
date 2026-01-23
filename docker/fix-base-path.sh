#!/bin/bash

# Script para verificar y corregir la configuración de BASE_PATH

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

cd "$(dirname "$0")" || exit 1

echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     Verificación y Corrección de BASE_PATH               ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Detectar ubicación del .env
ENV_FILE=""
if [ -f ../.env ]; then
    ENV_FILE="../.env"
    echo -e "${GREEN}✓${NC} Archivo .env encontrado en la raíz del proyecto"
elif [ -f .env ]; then
    ENV_FILE=".env"
    echo -e "${GREEN}✓${NC} Archivo .env encontrado en docker/"
else
    echo -e "${YELLOW}⚠${NC} Archivo .env no encontrado"
    echo -e "${BLUE}Creando .env desde env.example.txt...${NC}"
    cp env.example.txt .env
    ENV_FILE=".env"
    echo -e "${GREEN}✓${NC} Archivo .env creado"
fi

echo ""

# Verificar BASE_PATH
echo -e "${YELLOW}Verificando BASE_PATH...${NC}"
BASE_PATH=$(grep "^BASE_PATH=" "$ENV_FILE" 2>/dev/null | cut -d'=' -f2 | tr -d '"' | tr -d "'" || echo "")

if [ -z "$BASE_PATH" ] || [ "$BASE_PATH" = "" ]; then
    echo -e "${YELLOW}⚠${NC} BASE_PATH no está configurado"
    echo -e "${BLUE}Agregando BASE_PATH=/esmassiva-web...${NC}"

    # Asegurar que el archivo termine con nueva línea
    if [ -n "$(tail -c 1 "$ENV_FILE" 2>/dev/null)" ]; then
        echo "" >> "$ENV_FILE"
    fi

    echo "BASE_PATH=/esmassiva-web" >> "$ENV_FILE"
    echo -e "${GREEN}✓${NC} BASE_PATH=/esmassiva-web agregado"
    BASE_PATH="/esmassiva-web"
else
    BASE_PATH=$(echo "$BASE_PATH" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    echo -e "${GREEN}✓${NC} BASE_PATH está configurado: ${CYAN}$BASE_PATH${NC}"

    # Verificar formato
    if [[ ! "$BASE_PATH" =~ ^/ ]]; then
        echo -e "${RED}✗${NC} BASE_PATH debe empezar con /"
        echo -e "${YELLOW}Corrigiendo...${NC}"
        BASE_PATH="/$BASE_PATH"
        sed -i "s|^BASE_PATH=.*|BASE_PATH=$BASE_PATH|" "$ENV_FILE"
        echo -e "${GREEN}✓${NC} Corregido a: ${CYAN}$BASE_PATH${NC}"
    fi

    # Remover trailing slash
    BASE_PATH=$(echo "$BASE_PATH" | sed 's|/$||')
    if grep -q "BASE_PATH=.*/$" "$ENV_FILE"; then
        sed -i "s|^BASE_PATH=.*|BASE_PATH=$BASE_PATH|" "$ENV_FILE"
        echo -e "${GREEN}✓${NC} Trailing slash removido"
    fi
fi

echo ""
echo -e "${YELLOW}Verificando configuración en el contenedor...${NC}"

# Detectar Docker Compose
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}Error: Docker Compose no encontrado${NC}"
    exit 1
fi

# Verificar si el contenedor está corriendo
if $DOCKER_COMPOSE_CMD ps app 2>/dev/null | grep -q "Up"; then
    CONTAINER_BASE_PATH=$($DOCKER_COMPOSE_CMD exec -T app printenv BASE_PATH 2>/dev/null || echo "")

    if [ -z "$CONTAINER_BASE_PATH" ]; then
        echo -e "${YELLOW}⚠${NC} BASE_PATH no está configurado en el contenedor"
        echo -e "${BLUE}Necesitas reconstruir el contenedor para aplicar los cambios${NC}"
    else
        echo -e "${GREEN}✓${NC} BASE_PATH en contenedor: ${CYAN}$CONTAINER_BASE_PATH${NC}"

        if [ "$CONTAINER_BASE_PATH" != "$BASE_PATH" ]; then
            echo -e "${YELLOW}⚠${NC} BASE_PATH en .env ($BASE_PATH) no coincide con el del contenedor ($CONTAINER_BASE_PATH)"
            echo -e "${BLUE}Necesitas reconstruir el contenedor${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠${NC} El contenedor app no está corriendo"
fi

echo ""
echo -e "${CYAN}══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo ""
echo -e "1. ${BLUE}Reconstruir y reiniciar los contenedores:${NC}"
echo -e "   ${CYAN}cd docker${NC}"
echo -e "   ${CYAN}docker compose down${NC}"
echo -e "   ${CYAN}docker compose build --no-cache app${NC}"
echo -e "   ${CYAN}docker compose up -d${NC}"
echo ""
echo -e "2. ${BLUE}Verificar que los assets se carguen correctamente:${NC}"
echo -e "   ${CYAN}Abre: http://tu-servidor:8000$BASE_PATH/${NC}"
echo ""
echo -e "3. ${BLUE}Si los assets aún no se cargan, verifica:${NC}"
echo -e "   ${CYAN}docker compose exec app env | grep BASE_PATH${NC}"
echo -e "   ${CYAN}docker compose logs app | grep -i base${NC}"
echo ""

