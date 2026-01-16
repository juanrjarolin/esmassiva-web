#!/bin/bash

# =============================================================================
# Script de Diagnóstico para Problemas en Producción
# =============================================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=============================================="
echo "  Diagnóstico de Producción"
echo -e "==============================================${NC}\n"

# Detectar qué comando de Docker Compose usar
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}Error: Docker Compose no está instalado${NC}"
    exit 1
fi

echo -e "${BLUE}Usando: ${DOCKER_COMPOSE_CMD}${NC}\n"

# 1. Verificar estado de los servicios
echo -e "${YELLOW}1. Estado de los servicios:${NC}"
$DOCKER_COMPOSE_CMD ps

# 2. Verificar logs recientes de la app
echo -e "\n${YELLOW}2. Últimas 50 líneas de logs de la app:${NC}"
$DOCKER_COMPOSE_CMD logs --tail=50 app

# 3. Verificar si el build se completó
echo -e "\n${YELLOW}3. Verificando directorio de build:${NC}"
if $DOCKER_COMPOSE_CMD exec -T app test -d .output 2>/dev/null; then
    echo -e "${GREEN}✓ Directorio .output existe${NC}"
    echo -e "${BLUE}Contenido de .output:${NC}"
    $DOCKER_COMPOSE_CMD exec -T app ls -la .output/ | head -20
else
    echo -e "${RED}✗ Directorio .output NO existe${NC}"
    echo -e "${YELLOW}El build puede no haberse completado correctamente${NC}"
fi

# 4. Verificar variables de entorno
echo -e "\n${YELLOW}4. Variables de entorno importantes:${NC}"
$DOCKER_COMPOSE_CMD exec -T app env | grep -E "NODE_ENV|BASE_URL|PORT|DATABASE_URL" || echo "No se encontraron variables relevantes"

# 5. Verificar que el servidor responde
echo -e "\n${YELLOW}5. Verificando respuesta del servidor:${NC}"
if $DOCKER_COMPOSE_CMD exec -T app curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Servidor responde en http://localhost:3000${NC}"

    # Obtener headers
    echo -e "${BLUE}Headers de respuesta:${NC}"
    $DOCKER_COMPOSE_CMD exec -T app curl -I http://localhost:3000 2>/dev/null | head -15
else
    echo -e "${RED}✗ Servidor NO responde en http://localhost:3000${NC}"
fi

# 6. Verificar archivos estáticos
echo -e "\n${YELLOW}6. Verificando archivos estáticos:${NC}"
echo -e "${BLUE}Intentando acceder a / (raíz):${NC}"
$DOCKER_COMPOSE_CMD exec -T app curl -s http://localhost:3000/ | head -20

# 7. Verificar proceso de Node
echo -e "\n${YELLOW}7. Procesos de Node en ejecución:${NC}"
$DOCKER_COMPOSE_CMD exec -T app ps aux | grep -E "node|vinxi" | grep -v grep || echo "No se encontraron procesos de Node"

# 8. Verificar puertos
echo -e "\n${YELLOW}8. Puertos en escucha:${NC}"
$DOCKER_COMPOSE_CMD exec -T app netstat -tuln | grep -E ":3000|LISTEN" || $DOCKER_COMPOSE_CMD exec -T app ss -tuln | grep -E ":3000|LISTEN" || echo "No se pudo verificar puertos"

# 9. Verificar espacio en disco
echo -e "\n${YELLOW}9. Espacio en disco:${NC}"
$DOCKER_COMPOSE_CMD exec -T app df -h /app

# 10. Resumen y recomendaciones
echo -e "\n${GREEN}=============================================="
echo "  Resumen"
echo -e "==============================================${NC}\n"

echo -e "${BLUE}Comandos útiles para más información:${NC}"
echo "  Ver todos los logs: $DOCKER_COMPOSE_CMD logs -f app"
echo "  Entrar al contenedor: $DOCKER_COMPOSE_CMD exec app bash"
echo "  Reiniciar la app: $DOCKER_COMPOSE_CMD restart app"
echo "  Reconstruir: $DOCKER_COMPOSE_CMD build --no-cache app && $DOCKER_COMPOSE_CMD up -d app"

echo -e "\n${YELLOW}Si los archivos estáticos no se cargan:${NC}"
echo "  1. Verifica que NODE_ENV=production en .env"
echo "  2. Verifica que BASE_URL esté configurado correctamente"
echo "  3. Revisa los logs para errores de build"
echo "  4. Intenta reconstruir: $DOCKER_COMPOSE_CMD build --no-cache app"

echo -e "\n"

