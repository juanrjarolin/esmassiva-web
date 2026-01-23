#!/bin/bash

# Script de instalación sin Docker

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=============================================="
echo "  Instalación Sin Docker"
echo -e "==============================================${NC}\n"

# Verificar si se ejecuta como root
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}Este script requiere privilegios de root${NC}"
    echo "Ejecuta con: sudo bash install-without-docker.sh"
    exit 1
fi

# 1. Actualizar sistema
echo -e "${YELLOW}1. Actualizando sistema...${NC}"
apt update && apt upgrade -y
echo -e "${GREEN}✓ Sistema actualizado${NC}\n"

# 2. Instalar Node.js
echo -e "${YELLOW}2. Instalando Node.js...${NC}"
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js ya está instalado: $NODE_VERSION${NC}"
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    echo -e "${GREEN}✓ Node.js instalado${NC}"
fi
echo ""

# 3. Instalar pnpm
echo -e "${YELLOW}3. Instalando pnpm...${NC}"
if command -v pnpm >/dev/null 2>&1; then
    echo -e "${GREEN}✓ pnpm ya está instalado${NC}"
else
    npm install -g pnpm
    echo -e "${GREEN}✓ pnpm instalado${NC}"
fi
echo ""

# 4. Instalar MySQL
echo -e "${YELLOW}4. Instalando MySQL...${NC}"
if systemctl is-active --quiet mysql; then
    echo -e "${GREEN}✓ MySQL ya está instalado y corriendo${NC}"
else
    apt install -y mysql-server
    systemctl start mysql
    systemctl enable mysql
    echo -e "${GREEN}✓ MySQL instalado${NC}"
    echo -e "${YELLOW}⚠ Ejecuta 'sudo mysql_secure_installation' para configurar MySQL${NC}"
fi
echo ""

# 5. Instalar Nginx
echo -e "${YELLOW}5. Instalando Nginx...${NC}"
if command -v nginx >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Nginx ya está instalado${NC}"
else
    apt install -y nginx
    systemctl start nginx
    systemctl enable nginx
    echo -e "${GREEN}✓ Nginx instalado${NC}"
fi
echo ""

# 6. Resumen
echo -e "${GREEN}=============================================="
echo "  Instalación de Dependencias Completada"
echo -e "==============================================${NC}\n"

echo -e "${BLUE}Próximos pasos manuales:${NC}"
echo "1. Configurar MySQL:"
echo "   sudo mysql_secure_installation"
echo "   sudo mysql -u root -p"
echo "   CREATE DATABASE esmassiva;"
echo "   CREATE USER 'esmassiva'@'localhost' IDENTIFIED BY 'password';"
echo "   GRANT ALL PRIVILEGES ON esmassiva.* TO 'esmassiva'@'localhost';"
echo ""
echo "2. Configurar .env:"
echo "   cd /var/www/html/esmassiva-web"
echo "   cp docker/env.example.txt .env"
echo "   nano .env"
echo ""
echo "3. Instalar dependencias:"
echo "   pnpm install"
echo ""
echo "4. Configurar base de datos:"
echo "   pnpm db:push"
echo ""
echo "5. Construir aplicación:"
echo "   pnpm build"
echo ""
echo "6. Crear servicio systemd (ver INSTALL-WITHOUT-DOCKER.md)"
echo ""

