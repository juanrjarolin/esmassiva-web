#!/bin/bash

# =============================================================================
# Script de Despliegue en Producción
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=============================================="
echo "  Despliegue de Esmassiva en Producción"
echo -e "==============================================${NC}\n"

# Verificar que existe .env
if [ ! -f .env ]; then
    echo -e "${RED}Error: No se encontró el archivo .env${NC}"
    echo "Crea el archivo .env basándote en env.example.txt"
    echo "  cp env.example.txt .env"
    echo "  nano .env  # Edita con tus valores de producción"
    exit 1
fi

# Verificar que NODE_ENV esté en production
if ! grep -q "NODE_ENV=production" .env; then
    echo -e "${YELLOW}Advertencia: NODE_ENV no está configurado como 'production'${NC}"
    read -p "¿Continuar de todos modos? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Verificar contraseñas por defecto
if grep -q "ADMIN_PASSWORD=admin123" .env || grep -q "MYSQL_PASSWORD=esmassiva" .env; then
    echo -e "${RED}⚠️  ADVERTENCIA DE SEGURIDAD ⚠️${NC}"
    echo "Has dejado contraseñas por defecto. Esto es INSEGURO en producción."
    read -p "¿Continuar de todos modos? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Por favor, edita .env y cambia las contraseñas:"
        echo "  nano .env"
        exit 1
    fi
fi

# Cargar variables de entorno
source .env

echo -e "${GREEN}✓ Archivo .env encontrado${NC}"

# Detectar qué comando de Docker Compose usar
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}Error: Docker Compose no está instalado${NC}"
    echo "Ejecuta: sudo bash install-docker.sh"
    exit 1
fi

echo -e "${BLUE}Usando: ${DOCKER_COMPOSE_CMD}${NC}\n"

# Detener servicios existentes
echo -e "\n${YELLOW}Deteniendo servicios existentes...${NC}"
$DOCKER_COMPOSE_CMD down

# Construir imágenes
echo -e "\n${YELLOW}Construyendo imágenes...${NC}"
$DOCKER_COMPOSE_CMD build --no-cache app

# Levantar servicios
echo -e "\n${YELLOW}Levantando servicios...${NC}"
$DOCKER_COMPOSE_CMD up -d

# Esperar a que los servicios estén listos
echo -e "\n${YELLOW}Esperando a que los servicios estén listos...${NC}"
sleep 10

# Verificar estado
echo -e "\n${YELLOW}Verificando estado de los servicios...${NC}"
$DOCKER_COMPOSE_CMD ps

# Verificar health checks
echo -e "\n${YELLOW}Verificando health checks...${NC}"
for i in {1..30}; do
    if $DOCKER_COMPOSE_CMD exec -T app curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Aplicación está respondiendo${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗ La aplicación no está respondiendo después de 30 intentos${NC}"
        echo "Revisa los logs: $DOCKER_COMPOSE_CMD logs app"
        exit 1
    fi
    sleep 2
done

# Mostrar información
echo -e "\n${GREEN}=============================================="
echo "  Despliegue Completado"
echo -e "==============================================${NC}\n"

echo -e "${BLUE}Servicios:${NC}"
echo "  - Aplicación: http://localhost:3000"
if [ "${LISTEN_IP:-127.0.0.1}" = "0.0.0.0" ]; then
    echo "  - Nginx: http://localhost:8000"
    echo "  - Adminer: http://localhost:8080"
    echo "  - MinIO Console: http://localhost:9001"
fi

echo -e "\n${BLUE}Comandos útiles:${NC}"
echo "  Ver logs: $DOCKER_COMPOSE_CMD logs -f app"
echo "  Estado: $DOCKER_COMPOSE_CMD ps"
echo "  Reiniciar: $DOCKER_COMPOSE_CMD restart app"
echo "  Detener: $DOCKER_COMPOSE_CMD down"

echo -e "\n${YELLOW}⚠️  Recordatorios de Seguridad:${NC}"
echo "  - Cambia todas las contraseñas por defecto"
echo "  - Configura firewall (solo puertos 80, 443, 22)"
echo "  - Restringe acceso a Adminer y MinIO Console"
echo "  - Configura certificado SSL"
echo "  - Configura backups automáticos"

echo -e "\n${GREEN}¡Listo!${NC}\n"

