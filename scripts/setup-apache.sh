#!/bin/bash

# =============================================================================
# Script de configuración para levantar el proyecto esmassiva en Apache
# Ejecutar con: sudo bash scripts/setup-apache.sh
# =============================================================================

set -e

echo "=============================================="
echo "  Configuración de esmassiva para Apache"
echo "=============================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que se ejecuta como root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Por favor ejecuta este script con sudo${NC}"
    exit 1
fi

# Detectar el usuario que llamó sudo
ACTUAL_USER=${SUDO_USER:-$USER}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "\n${YELLOW}1. Actualizando sistema e instalando dependencias...${NC}"
apt-get update
apt-get install -y curl wget gnupg2 software-properties-common

# =============================================================================
# Instalar Node.js 20
# =============================================================================
echo -e "\n${YELLOW}2. Instalando Node.js 20...${NC}"
if ! command -v node &> /dev/null || [[ $(node -v | cut -d'v' -f2 | cut -d'.' -f1) -lt 20 ]]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    echo -e "${GREEN}Node.js $(node -v) instalado${NC}"
else
    echo -e "${GREEN}Node.js $(node -v) ya está instalado${NC}"
fi

# =============================================================================
# Instalar pnpm
# =============================================================================
echo -e "\n${YELLOW}3. Instalando pnpm...${NC}"
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
    echo -e "${GREEN}pnpm instalado${NC}"
else
    echo -e "${GREEN}pnpm ya está instalado${NC}"
fi

# =============================================================================
# Instalar Apache
# =============================================================================
echo -e "\n${YELLOW}4. Instalando y configurando Apache...${NC}"
apt-get install -y apache2

# Habilitar módulos necesarios
a2enmod proxy
a2enmod proxy_http
a2enmod proxy_wstunnel
a2enmod rewrite
a2enmod headers
a2enmod ssl

echo -e "${GREEN}Módulos de Apache habilitados${NC}"

# =============================================================================
# Instalar PostgreSQL
# =============================================================================
echo -e "\n${YELLOW}5. Instalando PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    apt-get install -y postgresql postgresql-contrib
    systemctl start postgresql
    systemctl enable postgresql
    echo -e "${GREEN}PostgreSQL instalado${NC}"
else
    echo -e "${GREEN}PostgreSQL ya está instalado${NC}"
fi

# Crear base de datos y usuario
echo -e "\n${YELLOW}6. Configurando base de datos PostgreSQL...${NC}"
sudo -u postgres psql -c "CREATE DATABASE esmassiva;" 2>/dev/null || echo "Base de datos 'esmassiva' ya existe"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';" 2>/dev/null || true
echo -e "${GREEN}Base de datos configurada${NC}"

# =============================================================================
# Instalar MinIO (opcional)
# =============================================================================
echo -e "\n${YELLOW}7. ¿Deseas instalar MinIO para almacenamiento de archivos? (s/n)${NC}"
read -r INSTALL_MINIO

if [[ "$INSTALL_MINIO" =~ ^[Ss]$ ]]; then
    echo "Instalando MinIO..."
    if [ ! -f /usr/local/bin/minio ]; then
        wget https://dl.min.io/server/minio/release/linux-amd64/minio -O /usr/local/bin/minio
        chmod +x /usr/local/bin/minio

        # Crear usuario y directorio para MinIO
        useradd -r minio-user 2>/dev/null || true
        mkdir -p /var/minio
        chown minio-user:minio-user /var/minio

        # Crear servicio systemd
        cat > /etc/systemd/system/minio.service << 'EOF'
[Unit]
Description=MinIO
Documentation=https://docs.min.io
Wants=network-online.target
After=network-online.target

[Service]
User=minio-user
Group=minio-user
EnvironmentFile=/etc/default/minio
ExecStart=/usr/local/bin/minio server /var/minio --console-address ":9001"
Restart=always
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

        # Configuración de MinIO
        cat > /etc/default/minio << EOF
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=adminpassword
EOF

        systemctl daemon-reload
        systemctl start minio
        systemctl enable minio
        echo -e "${GREEN}MinIO instalado y ejecutándose${NC}"
    else
        echo -e "${GREEN}MinIO ya está instalado${NC}"
    fi
fi

# =============================================================================
# Configurar Apache Virtual Host
# =============================================================================
echo -e "\n${YELLOW}8. Configurando Virtual Host de Apache...${NC}"

# Copiar configuración de Apache
cp "$PROJECT_DIR/apache/esmassiva.conf" /etc/apache2/sites-available/esmassiva.conf

# Deshabilitar sitio por defecto y habilitar esmassiva
a2dissite 000-default.conf 2>/dev/null || true
a2ensite esmassiva.conf

# Verificar configuración de Apache
apache2ctl configtest
systemctl restart apache2
echo -e "${GREEN}Apache configurado y reiniciado${NC}"

# =============================================================================
# Configurar el proyecto
# =============================================================================
echo -e "\n${YELLOW}9. Configurando el proyecto...${NC}"

cd "$PROJECT_DIR"

# Crear .env si no existe
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}Archivo .env creado. Por favor edita las credenciales.${NC}"
fi

# Instalar dependencias del proyecto
echo "Instalando dependencias de Node.js..."
sudo -u "$ACTUAL_USER" pnpm install

# Actualizar schema de Prisma para usar localhost
echo -e "\n${YELLOW}10. Actualizando configuración de Prisma...${NC}"
# El usuario deberá actualizar prisma/schema.prisma manualmente o usar DATABASE_URL

echo -e "\n${GREEN}=============================================="
echo "  ¡Configuración completada!"
echo "=============================================="
echo -e "${NC}"
echo "Próximos pasos:"
echo ""
echo "1. Edita el archivo .env con tus credenciales:"
echo "   nano .env"
echo ""
echo "2. Actualiza prisma/schema.prisma:"
echo '   Cambia la URL de conexión a:'
echo '   url = env("DATABASE_URL")'
echo ""
echo "3. Ejecuta las migraciones de base de datos:"
echo "   pnpm db:push"
echo ""
echo "4. Inicia la aplicación:"
echo "   pnpm dev      # Para desarrollo"
echo "   pnpm build && pnpm start  # Para producción"
echo ""
echo "5. Accede a la aplicación:"
echo "   http://localhost (a través de Apache)"
echo "   http://localhost:3000 (directamente a Node.js)"
echo ""
if [[ "$INSTALL_MINIO" =~ ^[Ss]$ ]]; then
    echo "6. MinIO está disponible en:"
    echo "   API: http://localhost:9000"
    echo "   Console: http://localhost:9001"
    echo "   Usuario: admin / Contraseña: adminpassword"
    echo ""
fi
echo -e "${YELLOW}NOTA: Recuerda cambiar las contraseñas por defecto en producción.${NC}"

