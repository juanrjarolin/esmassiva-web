#!/bin/bash

# Script para ver el estado del proyecto Docker

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Detectar qué comando de Docker Compose usar
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}Error: Docker Compose no está instalado${NC}"
    exit 1
fi

cd "$(dirname "$0")" || exit 1

# Detectar ubicación del .env
ENV_ARG=""
if [ -f ../.env ]; then
    ENV_ARG="--env-file ../.env"
    ENV_FILE="../.env"
elif [ -f .env ]; then
    ENV_ARG="--env-file .env"
    ENV_FILE=".env"
fi

echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║         Estado del Proyecto Docker                      ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Estado de los contenedores
echo -e "${YELLOW}📦 Estado de los Contenedores:${NC}"
echo "─────────────────────────────────────────────────────────"
$DOCKER_COMPOSE_CMD $ENV_ARG ps
echo ""

# 2. Resumen rápido
echo -e "${YELLOW}📊 Resumen:${NC}"
echo "─────────────────────────────────────────────────────────"

# Contar contenedores por estado
TOTAL=$($DOCKER_COMPOSE_CMD $ENV_ARG ps -q 2>/dev/null | wc -l)
RUNNING=$($DOCKER_COMPOSE_CMD $ENV_ARG ps -q --filter "status=running" 2>/dev/null | wc -l)
EXITED=$($DOCKER_COMPOSE_CMD $ENV_ARG ps -q --filter "status=exited" 2>/dev/null | wc -l)
RESTARTING=$($DOCKER_COMPOSE_CMD $ENV_ARG ps -q --filter "status=restarting" 2>/dev/null | wc -l)

echo -e "Total de contenedores: ${CYAN}$TOTAL${NC}"
echo -e "  ${GREEN}✓ Corriendo:${NC} $RUNNING"
if [ "$EXITED" -gt 0 ]; then
    echo -e "  ${RED}✗ Detenidos:${NC} $EXITED"
fi
if [ "$RESTARTING" -gt 0 ]; then
    echo -e "  ${YELLOW}⚠ Reiniciando:${NC} $RESTARTING"
fi
echo ""

# 3. Verificar servicios específicos
echo -e "${YELLOW}🔍 Estado de Servicios Específicos:${NC}"
echo "─────────────────────────────────────────────────────────"

check_service() {
    local service=$1
    local name=$2
    if $DOCKER_COMPOSE_CMD $ENV_ARG ps $service 2>/dev/null | grep -q "Up"; then
        local health=$($DOCKER_COMPOSE_CMD $ENV_ARG ps $service 2>/dev/null | grep "$service" | grep -o "healthy\|unhealthy" || echo "")
        if [ -n "$health" ]; then
            if [ "$health" = "healthy" ]; then
                echo -e "  ${GREEN}✓${NC} $name: ${GREEN}Corriendo (healthy)${NC}"
            else
                echo -e "  ${YELLOW}⚠${NC} $name: ${YELLOW}Corriendo (unhealthy)${NC}"
            fi
        else
            echo -e "  ${GREEN}✓${NC} $name: ${GREEN}Corriendo${NC}"
        fi
    else
        echo -e "  ${RED}✗${NC} $name: ${RED}Detenido${NC}"
    fi
}

check_service "mysql" "MySQL"
check_service "minio" "MinIO"
check_service "app" "Aplicación"
check_service "nginx" "Nginx"
check_service "adminer" "Adminer"
echo ""

# 4. Puertos y URLs
echo -e "${YELLOW}🌐 Puertos y URLs:${NC}"
echo "─────────────────────────────────────────────────────────"

# Leer LISTEN_IP del .env o usar default
if [ -n "$ENV_FILE" ]; then
    LISTEN_IP=$(grep "^LISTEN_IP=" "$ENV_FILE" 2>/dev/null | cut -d'=' -f2 | tr -d '"' || echo "127.0.0.1")
else
    LISTEN_IP="127.0.0.1"
fi

if [ -z "$LISTEN_IP" ] || [ "$LISTEN_IP" = "" ]; then
    LISTEN_IP="127.0.0.1"
fi

echo -e "  ${CYAN}Aplicación:${NC}    http://${LISTEN_IP}:3000"
echo -e "  ${CYAN}Nginx:${NC}         http://${LISTEN_IP}:8000"
echo -e "  ${CYAN}Adminer:${NC}       http://${LISTEN_IP}:8080"
echo -e "  ${CYAN}MySQL:${NC}         ${LISTEN_IP}:3309"
echo -e "  ${CYAN}MinIO Console:${NC} http://${LISTEN_IP}:9001"
echo -e "  ${CYAN}MinIO API:${NC}     http://${LISTEN_IP}:9000"
echo ""

# 5. Verificar si la app responde
if $DOCKER_COMPOSE_CMD $ENV_ARG ps app 2>/dev/null | grep -q "Up"; then
    echo -e "${YELLOW}🔗 Verificando respuesta de la aplicación...${NC}"
    if $DOCKER_COMPOSE_CMD $ENV_ARG exec -T app curl -f -s http://localhost:3000 >/dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} La aplicación responde correctamente"
    else
        echo -e "  ${YELLOW}⚠${NC} La aplicación no responde (puede estar iniciando)"
    fi
    echo ""
fi

# 6. Logs recientes si hay problemas
if [ "$EXITED" -gt 0 ] || [ "$RESTARTING" -gt 0 ]; then
    echo -e "${YELLOW}📋 Logs Recientes (últimas 20 líneas):${NC}"
    echo "─────────────────────────────────────────────────────────"
    $DOCKER_COMPOSE_CMD $ENV_ARG logs --tail=20 2>/dev/null | tail -20
    echo ""
fi

# 7. Comandos útiles
echo -e "${YELLOW}💡 Comandos Útiles:${NC}"
echo "─────────────────────────────────────────────────────────"
echo -e "  Ver logs en tiempo real:     ${CYAN}$DOCKER_COMPOSE_CMD $ENV_ARG logs -f${NC}"
echo -e "  Ver logs de un servicio:     ${CYAN}$DOCKER_COMPOSE_CMD $ENV_ARG logs -f [servicio]${NC}"
echo -e "  Reiniciar un servicio:      ${CYAN}$DOCKER_COMPOSE_CMD $ENV_ARG restart [servicio]${NC}"
echo -e "  Iniciar todos los servicios: ${CYAN}$DOCKER_COMPOSE_CMD $ENV_ARG up -d${NC}"
echo -e "  Detener todos los servicios: ${CYAN}$DOCKER_COMPOSE_CMD $ENV_ARG down${NC}"
echo -e "  Ver este estado:            ${CYAN}./status.sh${NC}"
echo ""

echo -e "${CYAN}══════════════════════════════════════════════════════════${NC}"

