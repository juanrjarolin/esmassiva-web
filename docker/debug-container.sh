#!/bin/bash

# Script completo de diagnóstico para el contenedor que no levanta

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Detectar qué comando de Docker Compose usar
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo -e "${RED}Error: Docker Compose no está instalado${NC}"
    exit 1
fi

# Detectar ubicación del .env
if [ -f ../.env ]; then
    ENV_FILE="../.env"
    ENV_LOCATION="raíz del proyecto"
elif [ -f .env ]; then
    ENV_FILE=".env"
    ENV_LOCATION="carpeta docker"
else
    ENV_FILE=""
    ENV_LOCATION="no encontrado"
fi

echo -e "${BLUE}=============================================="
echo "  Diagnóstico Completo del Contenedor"
echo -e "==============================================${NC}\n"

echo -e "${BLUE}Configuración:${NC}"
echo "  Docker Compose: $DOCKER_COMPOSE_CMD"
echo "  Archivo .env: $ENV_LOCATION ($ENV_FILE)"
echo ""

# 1. Verificar archivo .env
echo -e "${YELLOW}1. Verificando archivo .env...${NC}"
if [ -n "$ENV_FILE" ]; then
    echo -e "${GREEN}✓ .env encontrado en: $ENV_FILE${NC}"
    echo -e "${BLUE}Variables importantes:${NC}"
    grep -E "^NODE_ENV=|^ADMIN_PASSWORD=|^BASE_PATH=|^MYSQL_PASSWORD=" "$ENV_FILE" 2>/dev/null | sed 's/=.*/=***/' || echo "  No se encontraron estas variables"

    # Verificar NODE_ENV específicamente
    if grep -q "^NODE_ENV=" "$ENV_FILE" 2>/dev/null; then
        NODE_ENV_VALUE=$(grep "^NODE_ENV=" "$ENV_FILE" | cut -d'=' -f2 | tr -d ' ')
        echo -e "${BLUE}  NODE_ENV: ${NODE_ENV_VALUE}${NC}"
    else
        echo -e "${RED}  ✗ NODE_ENV NO está configurado${NC}"
    fi
else
    echo -e "${RED}✗ .env no encontrado${NC}"
fi
echo ""

# 2. Ver estado de los contenedores
echo -e "${YELLOW}2. Estado de los contenedores...${NC}"
if [ -n "$ENV_FILE" ]; then
    $DOCKER_COMPOSE_CMD --env-file "$ENV_FILE" ps -a
else
    $DOCKER_COMPOSE_CMD ps -a
fi
echo ""

# 3. Ver logs del contenedor app
echo -e "${YELLOW}3. Logs del contenedor app (últimas 100 líneas)...${NC}"
echo -e "${BLUE}----------------------------------------${NC}"
if [ -n "$ENV_FILE" ]; then
    $DOCKER_COMPOSE_CMD --env-file "$ENV_FILE" logs --tail=100 app 2>&1 || echo "No se pudieron obtener logs"
else
    $DOCKER_COMPOSE_CMD logs --tail=100 app 2>&1 || echo "No se pudieron obtener logs"
fi
echo ""

# 4. Buscar errores específicos en los logs
echo -e "${YELLOW}4. Buscando errores en los logs...${NC}"
if [ -n "$ENV_FILE" ]; then
    LOGS=$($DOCKER_COMPOSE_CMD --env-file "$ENV_FILE" logs app 2>&1)
else
    LOGS=$($DOCKER_COMPOSE_CMD logs app 2>&1)
fi

if echo "$LOGS" | grep -qi "error\|failed\|fatal"; then
    echo -e "${RED}Errores encontrados:${NC}"
    echo "$LOGS" | grep -i "error\|failed\|fatal" | tail -20
else
    echo -e "${GREEN}No se encontraron errores obvios en los logs${NC}"
fi
echo ""

# 5. Verificar si el contenedor está corriendo
echo -e "${YELLOW}5. Verificando proceso del contenedor...${NC}"
if [ -n "$ENV_FILE" ]; then
    if $DOCKER_COMPOSE_CMD --env-file "$ENV_FILE" ps app | grep -q "Up"; then
        echo -e "${GREEN}✓ Contenedor está corriendo${NC}"

        # Verificar que el servidor responda
        echo -e "${BLUE}Probando conexión al servidor...${NC}"
        if $DOCKER_COMPOSE_CMD --env-file "$ENV_FILE" exec -T app curl -f http://localhost:3000 >/dev/null 2>&1; then
            echo -e "${GREEN}✓ Servidor responde en puerto 3000${NC}"
        else
            echo -e "${RED}✗ Servidor NO responde en puerto 3000${NC}"
        fi
    else
        echo -e "${RED}✗ Contenedor NO está corriendo${NC}"

        # Ver último estado
        echo -e "${BLUE}Último estado conocido:${NC}"
        $DOCKER_COMPOSE_CMD --env-file "$ENV_FILE" ps -a app | tail -2
    fi
else
    if $DOCKER_COMPOSE_CMD ps app | grep -q "Up"; then
        echo -e "${GREEN}✓ Contenedor está corriendo${NC}"
    else
        echo -e "${RED}✗ Contenedor NO está corriendo${NC}"
    fi
fi
echo ""

# 6. Verificar espacio en disco
echo -e "${YELLOW}6. Verificando espacio en disco...${NC}"
df -h / | tail -1
echo ""

# 7. Recomendaciones
echo -e "${GREEN}=============================================="
echo "  Recomendaciones"
echo -e "==============================================${NC}\n"

if [ -z "$ENV_FILE" ]; then
    echo -e "${RED}1. CRÍTICO: Crear archivo .env${NC}"
    echo "   cp env.example.txt ../.env"
    echo "   nano ../.env"
    echo ""
fi

if [ -n "$ENV_FILE" ] && ! grep -q "^NODE_ENV=" "$ENV_FILE" 2>/dev/null; then
    echo -e "${RED}2. CRÍTICO: Agregar NODE_ENV al .env${NC}"
    echo "   echo 'NODE_ENV=production' >> $ENV_FILE"
    echo ""
fi

echo -e "${BLUE}3. Intentar reconstruir:${NC}"
if [ -n "$ENV_FILE" ]; then
    echo "   $DOCKER_COMPOSE_CMD --env-file \"$ENV_FILE\" down"
    echo "   $DOCKER_COMPOSE_CMD --env-file \"$ENV_FILE\" build --no-cache app"
    echo "   $DOCKER_COMPOSE_CMD --env-file \"$ENV_FILE\" up -d"
else
    echo "   $DOCKER_COMPOSE_CMD down"
    echo "   $DOCKER_COMPOSE_CMD build --no-cache app"
    echo "   $DOCKER_COMPOSE_CMD up -d"
fi
echo ""

echo -e "${BLUE}4. Ver logs en tiempo real:${NC}"
if [ -n "$ENV_FILE" ]; then
    echo "   $DOCKER_COMPOSE_CMD --env-file \"$ENV_FILE\" logs -f app"
else
    echo "   $DOCKER_COMPOSE_CMD logs -f app"
fi
echo ""

echo -e "${BLUE}5. Si el build falla, entrar al contenedor:${NC}"
if [ -n "$ENV_FILE" ]; then
    echo "   $DOCKER_COMPOSE_CMD --env-file \"$ENV_FILE\" run --rm app bash"
else
    echo "   $DOCKER_COMPOSE_CMD run --rm app bash"
fi
echo "   # Dentro del contenedor:"
echo "   cd /app"
echo "   pnpm install"
echo "   pnpm build"
echo ""

