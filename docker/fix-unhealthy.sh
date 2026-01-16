#!/bin/bash

# Script para diagnosticar y solucionar el contenedor unhealthy

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Detectar Docker Compose
if docker compose version >/dev/null 2>&1; then
    CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    CMD="docker-compose"
else
    echo -e "${RED}Error: Docker Compose no encontrado${NC}"
    exit 1
fi

# Detectar .env
ENV_ARG=""
if [ -f ../.env ]; then
    ENV_ARG="--env-file ../.env"
    ENV_FILE="../.env"
elif [ -f .env ]; then
    ENV_ARG="--env-file .env"
    ENV_FILE=".env"
fi

echo -e "${BLUE}=============================================="
echo "  Diagnóstico: Contenedor Unhealthy"
echo -e "==============================================${NC}\n"

# 1. Ver logs recientes
echo -e "${YELLOW}1. Logs del contenedor app (últimas 50 líneas):${NC}"
echo -e "${BLUE}----------------------------------------${NC}"
$CMD $ENV_ARG logs --tail=50 app
echo ""

# 2. Verificar si el proceso está corriendo
echo -e "${YELLOW}2. Procesos dentro del contenedor:${NC}"
if $CMD $ENV_ARG exec app ps aux 2>/dev/null | grep -E "node|vinxi|pnpm"; then
    echo -e "${GREEN}✓ Procesos de Node encontrados${NC}"
else
    echo -e "${RED}✗ No se encontraron procesos de Node${NC}"
    echo -e "${YELLOW}El servidor puede no estar corriendo${NC}"
fi
echo ""

# 3. Verificar puerto 3000
echo -e "${YELLOW}3. Verificando puerto 3000:${NC}"
if $CMD $ENV_ARG exec app netstat -tuln 2>/dev/null | grep ":3000" || \
   $CMD $ENV_ARG exec app ss -tuln 2>/dev/null | grep ":3000"; then
    echo -e "${GREEN}✓ Puerto 3000 está en escucha${NC}"
else
    echo -e "${RED}✗ Puerto 3000 NO está en escucha${NC}"
fi
echo ""

# 4. Probar conexión local
echo -e "${YELLOW}4. Probando conexión HTTP:${NC}"
if $CMD $ENV_ARG exec app curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Servidor responde correctamente${NC}"

    # Ver respuesta
    echo -e "${BLUE}Respuesta del servidor:${NC}"
    $CMD $ENV_ARG exec app curl -s http://localhost:3000 | head -20
else
    echo -e "${RED}✗ Servidor NO responde${NC}"
    echo -e "${YELLOW}Esto explica por qué el healthcheck falla${NC}"
fi
echo ""

# 5. Verificar healthcheck manualmente
echo -e "${YELLOW}5. Ejecutando healthcheck manualmente:${NC}"
if $CMD $ENV_ARG exec app curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Healthcheck debería pasar${NC}"
else
    echo -e "${RED}✗ Healthcheck falla${NC}"
fi
echo ""

# 6. Verificar variables de entorno
echo -e "${YELLOW}6. Variables de entorno importantes:${NC}"
$CMD $ENV_ARG exec app env 2>/dev/null | grep -E "NODE_ENV|BASE_PATH|BASE_URL|PORT|DATABASE_URL" | head -10 || echo "No se puede acceder al contenedor"
echo ""

# 7. Verificar si el build se completó (si está en producción)
if [ -n "$ENV_FILE" ] && grep -q "NODE_ENV=production" "$ENV_FILE" 2>/dev/null; then
    echo -e "${YELLOW}7. Verificando build de producción:${NC}"
    if $CMD $ENV_ARG exec app test -d .output 2>/dev/null; then
        echo -e "${GREEN}✓ Directorio .output existe${NC}"
        echo -e "${BLUE}Archivos en .output:${NC}"
        $CMD $ENV_ARG exec app ls -la .output/ 2>/dev/null | head -10
    else
        echo -e "${RED}✗ Directorio .output NO existe${NC}"
        echo -e "${YELLOW}El build puede no haberse completado${NC}"
    fi
    echo ""
fi

# 8. Recomendaciones
echo -e "${GREEN}=============================================="
echo "  Soluciones"
echo -e "==============================================${NC}\n"

echo -e "${BLUE}Si el servidor no responde:${NC}"
echo "1. Ver logs completos: $CMD $ENV_ARG logs -f app"
echo "2. Reiniciar el contenedor: $CMD $ENV_ARG restart app"
echo "3. Si persiste, reconstruir:"
echo "   $CMD $ENV_ARG down"
echo "   $CMD $ENV_ARG build --no-cache app"
echo "   $CMD $ENV_ARG up -d"
echo ""

echo -e "${BLUE}Si el build falló:${NC}"
echo "1. Entrar al contenedor: $CMD $ENV_ARG exec app bash"
echo "2. Ejecutar manualmente:"
echo "   cd /app"
echo "   pnpm build"
echo "   pnpm start"
echo ""

echo -e "${BLUE}Si el healthcheck falla pero el servidor responde:${NC}"
echo "1. Verificar que curl esté instalado en el contenedor"
echo "2. El healthcheck puede necesitar más tiempo (start_period)"
echo ""

