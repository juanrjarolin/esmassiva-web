#!/bin/bash

# =============================================================================
# Script para Corregir Repositorios de APT
# =============================================================================
# Soluciona problemas comunes con repositorios de Ubuntu/Debian

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=============================================="
echo "  Corrección de Repositorios APT"
echo -e "==============================================${NC}\n"

# Verificar si se ejecuta como root
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}Este script requiere privilegios de root${NC}"
    echo "Ejecuta con: sudo bash fix-repositories.sh"
    exit 1
fi

# Detectar distribución
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VER=$VERSION_ID
    CODENAME=$(lsb_release -cs 2>/dev/null || echo "focal")
else
    echo -e "${RED}No se pudo detectar la distribución del sistema${NC}"
    exit 1
fi

echo -e "${BLUE}Distribución: ${OS} ${VER} (${CODENAME})${NC}\n"

# 1. Eliminar repositorio de certbot obsoleto
echo -e "${YELLOW}1. Eliminando repositorio obsoleto de certbot...${NC}"
if [ -f /etc/apt/sources.list.d/certbot-ubuntu-certbot-*.list ] || \
   grep -r "ppa.launchpad.net/certbot/certbot" /etc/apt/sources.list.d/ >/dev/null 2>&1; then
    rm -f /etc/apt/sources.list.d/certbot-ubuntu-certbot-*.list
    rm -f /etc/apt/sources.list.d/certbot-ubuntu-certbot-*.save
    echo -e "${GREEN}✓ Repositorio de certbot eliminado${NC}"
    echo -e "${BLUE}  Nota: Certbot se puede instalar desde el repositorio oficial de Ubuntu${NC}"
else
    echo -e "${GREEN}✓ No se encontró repositorio de certbot${NC}"
fi

# 2. Aceptar cambios en repositorios de ondrej
echo -e "\n${YELLOW}2. Aceptando cambios en repositorios de ondrej...${NC}"

# Aceptar cambios de apache2
if grep -r "ondrej/apache2" /etc/apt/sources.list.d/ >/dev/null 2>&1; then
    echo -e "${BLUE}  Aceptando cambios en PPA de Apache...${NC}"
    apt-get update -o Acquire::AllowInsecureRepositories=true -o Acquire::AllowDowngradeToInsecureRepositories=true 2>&1 | grep -v "WARNING" || true
    echo -e "${GREEN}✓ Cambios aceptados para Apache PPA${NC}"
fi

# Aceptar cambios de php
if grep -r "ondrej/php" /etc/apt/sources.list.d/ >/dev/null 2>&1; then
    echo -e "${BLUE}  Aceptando cambios en PPA de PHP...${NC}"
    apt-get update -o Acquire::AllowInsecureRepositories=true -o Acquire::AllowDowngradeToInsecureRepositories=true 2>&1 | grep -v "WARNING" || true
    echo -e "${GREEN}✓ Cambios aceptados para PHP PPA${NC}"
fi

# 3. Actualizar lista de paquetes
echo -e "\n${YELLOW}3. Actualizando lista de paquetes...${NC}"
if apt-get update; then
    echo -e "${GREEN}✓ Lista de paquetes actualizada correctamente${NC}"
else
    echo -e "${RED}✗ Error al actualizar lista de paquetes${NC}"
    echo -e "${YELLOW}Intentando actualización con opciones de seguridad relajadas...${NC}"
    apt-get update -o Acquire::AllowInsecureRepositories=true -o Acquire::AllowDowngradeToInsecureRepositories=true || {
        echo -e "${RED}Error persistente. Revisa los repositorios manualmente.${NC}"
        exit 1
    }
fi

# 4. Verificar repositorios problemáticos
echo -e "\n${YELLOW}4. Verificando repositorios...${NC}"
PROBLEMS=0

# Verificar certbot
if grep -r "certbot/certbot" /etc/apt/sources.list.d/ >/dev/null 2>&1; then
    echo -e "${RED}✗ Aún existe referencia a certbot/certbot${NC}"
    PROBLEMS=$((PROBLEMS + 1))
else
    echo -e "${GREEN}✓ No hay referencias a certbot/certbot${NC}"
fi

# Verificar que apt-get update funciona sin errores críticos
if apt-get update 2>&1 | grep -q "404\|Release"; then
    echo -e "${YELLOW}⚠  Aún hay algunos problemas con repositorios${NC}"
    echo -e "${BLUE}  Ejecutando limpieza adicional...${NC}"

    # Limpiar cache
    apt-get clean
    rm -rf /var/lib/apt/lists/*
    apt-get update
else
    echo -e "${GREEN}✓ Repositorios funcionando correctamente${NC}"
fi

# Resumen
echo -e "\n${GREEN}=============================================="
echo "  Corrección Completada"
echo -e "==============================================${NC}\n"

echo -e "${BLUE}Próximos pasos:${NC}"
echo "  1. Verifica que apt-get update funciona: sudo apt-get update"
echo "  2. Si necesitas certbot, instálalo desde el repositorio oficial:"
echo "     sudo apt-get install certbot python3-certbot-nginx"
echo "  3. Continúa con la instalación de Docker: sudo bash install-docker.sh"

echo -e "\n${GREEN}¡Listo!${NC}\n"

