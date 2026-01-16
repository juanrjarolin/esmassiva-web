#!/bin/bash

# =============================================================================
# Script de Instalación de Docker y Docker Compose
# =============================================================================
# Este script instala Docker y Docker Compose en un servidor Ubuntu/Debian
# Compatible con Docker Compose V1 (docker-compose) y V2 (docker compose)

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=============================================="
echo "  Instalación de Docker y Docker Compose"
echo -e "==============================================${NC}\n"

# Verificar si se ejecuta como root
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}Este script requiere privilegios de root${NC}"
    echo "Ejecuta con: sudo bash install-docker.sh"
    exit 1
fi

# Detectar distribución
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VER=$VERSION_ID
else
    echo -e "${RED}No se pudo detectar la distribución del sistema${NC}"
    exit 1
fi

echo -e "${BLUE}Distribución detectada: ${OS} ${VER}${NC}\n"

# Verificar y corregir repositorios si es necesario
echo -e "${YELLOW}Verificando repositorios de APT...${NC}"
if apt-get update 2>&1 | grep -qE "404|Release.*does not have|changed its.*Label"; then
    echo -e "${YELLOW}Se detectaron problemas con los repositorios${NC}"
    echo -e "${BLUE}Ejecutando corrección automática...${NC}"

    # Eliminar repositorio de certbot obsoleto
    if grep -r "ppa.launchpad.net/certbot/certbot" /etc/apt/sources.list.d/ >/dev/null 2>&1; then
        echo -e "${BLUE}  Eliminando repositorio obsoleto de certbot...${NC}"
        rm -f /etc/apt/sources.list.d/certbot-ubuntu-certbot-*.list
        rm -f /etc/apt/sources.list.d/certbot-ubuntu-certbot-*.save
    fi

    # Aceptar cambios en repositorios de ondrej
    if grep -r "ondrej/apache2\|ondrej/php" /etc/apt/sources.list.d/ >/dev/null 2>&1; then
        echo -e "${BLUE}  Aceptando cambios en repositorios de ondrej...${NC}"
        apt-get update -o Acquire::AllowInsecureRepositories=true -o Acquire::AllowDowngradeToInsecureRepositories=true 2>&1 | grep -v "WARNING" || true
    fi

    # Limpiar cache y actualizar
    apt-get clean
    rm -rf /var/lib/apt/lists/*
fi

# Actualizar sistema
echo -e "${YELLOW}Actualizando lista de paquetes...${NC}"
apt-get update

# Verificar si Docker ya está instalado
if command -v docker >/dev/null 2>&1; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓ Docker ya está instalado: ${DOCKER_VERSION}${NC}"

    # Verificar versión mínima
    DOCKER_VER_NUM=$(docker --version | grep -oE '[0-9]+\.[0-9]+' | head -1)
    echo -e "${BLUE}Versión de Docker: ${DOCKER_VER_NUM}${NC}"
else
    echo -e "${YELLOW}Instalando Docker...${NC}"

    # Actualizar sistema
    apt-get update

    # Instalar dependencias
    apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release

    # Agregar clave GPG oficial de Docker
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/${OS}/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg

    # Configurar repositorio
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/${OS} \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Instalar Docker Engine
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    echo -e "${GREEN}✓ Docker instalado correctamente${NC}"
    DOCKER_VERSION=$(docker --version)
    echo -e "${BLUE}Versión instalada: ${DOCKER_VERSION}${NC}"
fi

# Verificar Docker Compose V2 (plugin)
if docker compose version >/dev/null 2>&1; then
    COMPOSE_VERSION=$(docker compose version)
    echo -e "${GREEN}✓ Docker Compose V2 (plugin) está disponible: ${COMPOSE_VERSION}${NC}"
    COMPOSE_CMD="docker compose"
    COMPOSE_TYPE="V2 (plugin)"
elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_VERSION=$(docker-compose --version)
    echo -e "${GREEN}✓ Docker Compose V1 (standalone) está disponible: ${COMPOSE_VERSION}${NC}"
    COMPOSE_CMD="docker-compose"
    COMPOSE_TYPE="V1 (standalone)"
else
    echo -e "${YELLOW}Docker Compose no está instalado. Instalando...${NC}"

    # Intentar instalar Docker Compose V2 (plugin) primero
    if apt-get install -y docker-compose-plugin 2>/dev/null; then
        echo -e "${GREEN}✓ Docker Compose V2 (plugin) instalado${NC}"
        COMPOSE_CMD="docker compose"
        COMPOSE_TYPE="V2 (plugin)"
    else
        # Fallback a Docker Compose V1 (standalone)
        echo -e "${YELLOW}Instalando Docker Compose V1 (standalone)...${NC}"
        COMPOSE_VERSION="1.29.2"
        curl -L "https://github.com/docker/compose/releases/download/v${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
        echo -e "${GREEN}✓ Docker Compose V1 (standalone) instalado${NC}"
        COMPOSE_CMD="docker-compose"
        COMPOSE_TYPE="V1 (standalone)"
    fi
fi

# Iniciar y habilitar Docker
echo -e "\n${YELLOW}Iniciando servicio Docker...${NC}"
systemctl start docker
systemctl enable docker

# Agregar usuario actual al grupo docker (si no es root)
if [ -n "$SUDO_USER" ]; then
    echo -e "\n${YELLOW}Agregando usuario ${SUDO_USER} al grupo docker...${NC}"
    usermod -aG docker "$SUDO_USER"
    echo -e "${GREEN}✓ Usuario agregado al grupo docker${NC}"
    echo -e "${YELLOW}⚠️  Nota: Necesitarás cerrar sesión y volver a iniciar para que los cambios surtan efecto${NC}"
fi

# Verificar instalación
echo -e "\n${BLUE}=============================================="
echo "  Verificación de Instalación"
echo -e "==============================================${NC}\n"

echo -e "${BLUE}Docker:${NC}"
docker --version
docker info | grep -E "Server Version|Operating System|Kernel Version" | head -3

echo -e "\n${BLUE}Docker Compose:${NC}"
if [ "$COMPOSE_CMD" = "docker compose" ]; then
    docker compose version
else
    docker-compose --version
fi

# Probar Docker
echo -e "\n${YELLOW}Probando Docker con un contenedor de prueba...${NC}"
if docker run --rm hello-world >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Docker funciona correctamente${NC}"
else
    echo -e "${RED}✗ Error al probar Docker${NC}"
    exit 1
fi

# Resumen
echo -e "\n${GREEN}=============================================="
echo "  Instalación Completada"
echo -e "==============================================${NC}\n"

echo -e "${BLUE}Resumen:${NC}"
echo "  - Docker: $(docker --version)"
echo "  - Docker Compose: ${COMPOSE_TYPE}"
echo "  - Comando a usar: ${COMPOSE_CMD}"

echo -e "\n${BLUE}Próximos pasos:${NC}"
echo "  1. Si agregaste un usuario al grupo docker, cierra sesión y vuelve a iniciar"
echo "  2. Verifica la instalación: docker --version"
echo "  3. Verifica Docker Compose: ${COMPOSE_CMD} --version"
echo "  4. Navega a la carpeta docker/ del proyecto"
echo "  5. Configura el archivo .env: cp env.example.txt .env"
echo "  6. Levanta los servicios: ${COMPOSE_CMD} up -d"

echo -e "\n${GREEN}¡Listo!${NC}\n"

