#!/bin/bash

# =============================================================================
# Script de Despliegue Rápido en Producción
# Ejecuta este script directamente en tu servidor de producción
# =============================================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=============================================="
echo "  🚀 Despliegue Rápido de Esmassiva"
echo -e "==============================================${NC}\n"

# Verificar que estamos en la carpeta correcta
if [ ! -f "compose.yaml" ] || [ ! -f ".env" ]; then
    echo -e "${RED}Error: Ejecuta este script desde la carpeta docker/${NC}"
    echo "Ejemplo: cd esmassiva/docker && bash deploy-prod.sh"
    exit 1
fi

# Verificar NODE_ENV
if ! grep -q "NODE_ENV=production" .env; then
    echo -e "${YELLOW}Advertencia: NODE_ENV no está en production${NC}"
    echo "Configurando automáticamente..."
    sed -i 's/NODE_ENV=.*/NODE_ENV=production/' .env
fi

# Verificar contraseñas
if grep -q "TU_PASSWORD_ROOT_SEGURO_AQUI" .env || grep -q "TU_PASSWORD_BD_SEGURO_AQUI" .env || grep -q "TU_PASSWORD_ADMIN_MUY_SEGURO_AQUI" .env; then
    echo -e "${RED}⚠️  ERROR: Contraseñas no configuradas ⚠️${NC}"
    echo "Edita el archivo .env y cambia las contraseñas antes de continuar:"
    echo "  nano .env"
    echo ""
    echo "Busca estas líneas y cámbialas:"
    echo "  MYSQL_ROOT_PASSWORD=TU_PASSWORD_ROOT_SEGURO_AQUI"
    echo "  MYSQL_PASSWORD=TU_PASSWORD_BD_SEGURO_AQUI"
    echo "  ADMIN_PASSWORD=TU_PASSWORD_ADMIN_MUY_SEGURO_AQUI"
    exit 1
fi

# Verificar BASE_URL
if grep -q "BASE_URL=https://tudominio.com" .env; then
    echo -e "${YELLOW}Advertencia: BASE_URL no está configurado${NC}"
    echo "Edita .env y cambia BASE_URL por tu dominio real"
    echo "Ejemplo: BASE_URL=https://miempresa.com"
    read -p "¿Continuar de todos modos? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✓ Configuración validada${NC}"

# Detectar Docker Compose
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}Error: Docker Compose no encontrado${NC}"
    echo "Instala Docker primero:"
    echo "  curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
    exit 1
fi

echo -e "${BLUE}Usando: ${DOCKER_COMPOSE_CMD}${NC}\n"

# Detener servicios existentes
echo -e "${YELLOW}Deteniendo servicios existentes...${NC}"
$DOCKER_COMPOSE_CMD --env-file .env down || true

# Limpiar imágenes no utilizadas (opcional)
echo -e "${YELLOW}Limpiando imágenes no utilizadas...${NC}"
docker image prune -f || true

# Construir imágenes
echo -e "${YELLOW}Construyendo imágenes...${NC}"
$DOCKER_COMPOSE_CMD --env-file .env build --no-cache

# Levantar servicios
echo -e "${YELLOW}Levantando servicios en producción...${NC}"
$DOCKER_COMPOSE_CMD --env-file .env up -d

# Esperar a que los servicios estén listos
echo -e "${YELLOW}Esperando a que los servicios estén listos...${NC}"
sleep 10

# Verificar estado
echo -e "\n${BLUE}Verificando estado de servicios:${NC}"
$DOCKER_COMPOSE_CMD --env-file .env ps

# Verificar healthcheck de la app
echo -e "\n${YELLOW}Verificando aplicación...${NC}"
if $DOCKER_COMPOSE_CMD --env-file .env exec -T app curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Aplicación funcionando correctamente${NC}"
else
    echo -e "${RED}✗ Error: La aplicación no responde${NC}"
    echo "Verifica los logs:"
    echo "  $DOCKER_COMPOSE_CMD --env-file .env logs app"
fi

# Mostrar URLs de acceso
echo -e "\n${GREEN}=============================================="
echo "  🎉 ¡Despliegue completado!"
echo -e "==============================================${NC}"

echo -e "${BLUE}URLs de acceso:${NC}"
echo "  🌐 Aplicación: http://tu-servidor:8000"
echo "  🔧 Adminer: http://tu-servidor:8081"
echo "  📦 MinIO Console: http://tu-servidor:9001"

echo -e "\n${YELLOW}Comandos útiles:${NC}"
echo "  Ver logs: $DOCKER_COMPOSE_CMD --env-file .env logs -f"
echo "  Reiniciar: $DOCKER_COMPOSE_CMD --env-file .env restart"
echo "  Detener: $DOCKER_COMPOSE_CMD --env-file .env down"

echo -e "\n${BLUE}Recuerda:${NC}"
echo "  - Configurar SSL con Let's Encrypt"
echo "  - Configurar firewall (ufw allow 80,443)"
echo "  - Configurar backups automáticos"

echo -e "\n${GREEN}¡Listo para producción! 🚀${NC}"