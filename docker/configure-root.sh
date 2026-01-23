#!/bin/bash

# Script para configurar la aplicación para servir desde la raíz

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

cd "$(dirname "$0")" || exit 1

echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     Configurando Aplicación para Servir desde Raíz       ║${NC}"
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
    echo -e "${YELLOW}⚠${NC} Archivo .env no encontrado, creando uno nuevo..."
    cp env.example.txt .env
    ENV_FILE=".env"
    echo -e "${GREEN}✓${NC} Archivo .env creado"
fi

echo ""

# Eliminar o comentar BASE_PATH
echo -e "${YELLOW}Configurando BASE_PATH para raíz...${NC}"

if grep -q "^BASE_PATH=" "$ENV_FILE" 2>/dev/null; then
    # Si existe, comentarlo o eliminarlo
    sed -i 's/^BASE_PATH=.*/# BASE_PATH=  # Servir desde raíz/' "$ENV_FILE"
    echo -e "${GREEN}✓${NC} BASE_PATH comentado/eliminado del .env"
else
    # Si no existe, agregar comentario
    if [ -n "$(tail -c 1 "$ENV_FILE" 2>/dev/null)" ]; then
        echo "" >> "$ENV_FILE"
    fi
    echo "# BASE_PATH=  # Servir desde raíz" >> "$ENV_FILE"
    echo -e "${GREEN}✓${NC} Comentario agregado (BASE_PATH no configurado = raíz)"
fi

echo ""
echo -e "${YELLOW}Verificando configuración...${NC}"

# Verificar que BASE_PATH esté vacío o comentado
BASE_PATH_VALUE=$(grep "^BASE_PATH=" "$ENV_FILE" 2>/dev/null | cut -d'=' -f2 | tr -d '"' | tr -d "'" | sed 's/#.*//' | xargs || echo "")

if [ -z "$BASE_PATH_VALUE" ] || [ "$BASE_PATH_VALUE" = "" ]; then
    echo -e "${GREEN}✓${NC} BASE_PATH está vacío o comentado (servirá desde raíz)"
else
    echo -e "${YELLOW}⚠${NC} BASE_PATH tiene un valor: $BASE_PATH_VALUE"
    echo -e "${BLUE}Eliminando el valor...${NC}"
    sed -i 's/^BASE_PATH=.*/# BASE_PATH=  # Servir desde raíz/' "$ENV_FILE"
    echo -e "${GREEN}✓${NC} Corregido"
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
echo -e "2. ${BLUE}Verificar que Apache esté configurado correctamente:${NC}"
echo -e "   ${CYAN}sudo systemctl status apache2${NC}"
echo -e "   ${CYAN}sudo a2ensite esmassiva${NC}"
echo -e "   ${CYAN}sudo systemctl restart apache2${NC}"
echo ""
echo -e "3. ${BLUE}Verificar que la aplicación responda:${NC}"
echo -e "   ${CYAN}curl http://localhost:3000${NC}"
echo -e "   ${CYAN}curl http://164.90.128.18/${NC}"
echo ""
echo -e "4. ${BLUE}Verificar variables de entorno en el contenedor:${NC}"
echo -e "   ${CYAN}docker compose exec app env | grep BASE_PATH${NC}"
echo -e "   ${CYAN}(Debería estar vacío o no aparecer)${NC}"
echo ""

