#!/bin/bash

# Script para diagnosticar y solucionar problemas con el contenedor MySQL

# Detectar qué comando de Docker Compose usar
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo "Error: Docker Compose no está instalado"
    exit 1
fi

cd "$(dirname "$0")" || exit 1

echo "=== Diagnóstico del Contenedor MySQL ==="
echo ""

# 1. Ver logs de MySQL
echo "1. Logs del contenedor MySQL (últimas 50 líneas):"
echo "----------------------------------------"
$DOCKER_COMPOSE_CMD logs --tail=50 mysql 2>/dev/null || echo "No se pueden obtener logs (el contenedor puede no existir)"
echo ""

# 2. Verificar estado del contenedor
echo "2. Estado del contenedor MySQL:"
echo "----------------------------------------"
$DOCKER_COMPOSE_CMD ps mysql
echo ""

# 3. Verificar variables de entorno
echo "3. Verificando variables de entorno:"
echo "----------------------------------------"
if [ -f .env ]; then
    echo "✓ Archivo .env encontrado en docker/"
    grep -E "MYSQL_ROOT_PASSWORD|MYSQL_PASSWORD" .env || echo "Variables MySQL no encontradas en .env"
elif [ -f ../.env ]; then
    echo "✓ Archivo .env encontrado en la raíz del proyecto"
    grep -E "MYSQL_ROOT_PASSWORD|MYSQL_PASSWORD" ../.env || echo "Variables MySQL no encontradas en .env"
else
    echo "✗ Archivo .env NO encontrado"
    echo "Creando .env desde env.example.txt..."
    cp env.example.txt .env
    echo "✓ Archivo .env creado. Revisa y ajusta las variables según sea necesario."
fi
echo ""

# 4. Verificar volumen
echo "4. Verificando volumen de MySQL:"
echo "----------------------------------------"
docker volume inspect esmassiva_mysql-data 2>/dev/null && echo "✓ Volumen existe" || echo "✗ Volumen no existe (se creará al iniciar)"
echo ""

# 5. Opciones de solución
echo "=== Opciones de Solución ==="
echo ""
echo "El contenedor MySQL puede fallar por varias razones:"
echo "1. Volumen corrupto o con permisos incorrectos"
echo "2. Variables de entorno incorrectas"
echo "3. Puerto ya en uso"
echo "4. Problemas de inicialización"
echo ""

read -p "¿Deseas intentar solucionar automáticamente? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo "Aplicando soluciones..."
    echo ""

    # Detener contenedores
    echo "1. Deteniendo contenedores..."
    $DOCKER_COMPOSE_CMD stop mysql 2>/dev/null
    $DOCKER_COMPOSE_CMD stop app 2>/dev/null

    # Preguntar si resetear el volumen
    echo ""
    read -p "¿Deseas RESETEAR el volumen de MySQL? (esto borrará todos los datos) (s/n): " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Ss]$ ]]; then
        echo "2. Eliminando volumen de MySQL..."
        $DOCKER_COMPOSE_CMD down -v mysql 2>/dev/null
        docker volume rm esmassiva_mysql-data 2>/dev/null
        echo "✓ Volumen eliminado"
    else
        echo "2. Manteniendo volumen existente"
    fi

    # Reiniciar MySQL
    echo ""
    echo "3. Iniciando MySQL..."
    $DOCKER_COMPOSE_CMD up -d mysql

    # Esperar un poco
    echo ""
    echo "4. Esperando a que MySQL se inicialice (30 segundos)..."
    sleep 30

    # Verificar estado
    echo ""
    echo "5. Verificando estado:"
    $DOCKER_COMPOSE_CMD ps mysql

    # Ver logs recientes
    echo ""
    echo "6. Logs recientes de MySQL:"
    echo "----------------------------------------"
    $DOCKER_COMPOSE_CMD logs --tail=30 mysql

    echo ""
    echo "=== Diagnóstico completado ==="
    echo ""

    # Verificar si está funcionando
    if $DOCKER_COMPOSE_CMD ps mysql | grep -q "Up"; then
        echo "✓ MySQL parece estar funcionando correctamente"
        echo ""
        echo "Si el problema persiste, revisa los logs con:"
        echo "  $DOCKER_COMPOSE_CMD logs -f mysql"
    else
        echo "✗ MySQL aún tiene problemas"
        echo ""
        echo "Prueba las siguientes soluciones manuales:"
        echo "1. Verifica que el puerto 3309 no esté en uso:"
        echo "   netstat -tulpn | grep 3309"
        echo ""
        echo "2. Verifica los permisos del volumen:"
        echo "   docker volume inspect esmassiva_mysql-data"
        echo ""
        echo "3. Revisa los logs completos:"
        echo "   $DOCKER_COMPOSE_CMD logs mysql"
        echo ""
        echo "4. Si todo lo demás falla, resetea completamente:"
        echo "   $DOCKER_COMPOSE_CMD down -v"
        echo "   docker volume prune -f"
        echo "   $DOCKER_COMPOSE_CMD up -d mysql"
    fi
else
    echo ""
    echo "Soluciones manuales:"
    echo ""
    echo "1. Ver logs detallados:"
    echo "   $DOCKER_COMPOSE_CMD logs -f mysql"
    echo ""
    echo "2. Reiniciar MySQL:"
    echo "   $DOCKER_COMPOSE_CMD restart mysql"
    echo ""
    echo "3. Resetear volumen (BORRA DATOS):"
    echo "   $DOCKER_COMPOSE_CMD down -v mysql"
    echo "   docker volume rm esmassiva_mysql-data"
    echo "   $DOCKER_COMPOSE_CMD up -d mysql"
    echo ""
    echo "4. Verificar puerto:"
    echo "   netstat -tulpn | grep 3309"
    echo ""
    echo "5. Verificar variables de entorno:"
    echo "   cat .env | grep MYSQL"
fi

echo ""

