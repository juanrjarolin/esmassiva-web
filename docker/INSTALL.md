# Instalación de Docker en Producción

## Instalación Rápida

Para instalar Docker y Docker Compose en tu servidor de producción:

```bash
cd docker
chmod +x install-docker.sh
sudo bash install-docker.sh
```

## ¿Qué hace el script?

1. **Detecta la distribución** del sistema (Ubuntu/Debian)
2. **Verifica si Docker está instalado** y su versión
3. **Instala Docker** si no está presente (usando el repositorio oficial)
4. **Detecta e instala Docker Compose** (V2 plugin o V1 standalone)
5. **Inicia y habilita** el servicio Docker
6. **Agrega tu usuario** al grupo docker
7. **Verifica** que todo funcione correctamente

## Compatibilidad

El script es compatible con:
- ✅ Docker Compose V2 (plugin) - `docker compose`
- ✅ Docker Compose V1 (standalone) - `docker-compose`
- ✅ Ubuntu 18.04+
- ✅ Debian 10+

## Verificación Manual

Después de la instalación, verifica:

```bash
# Verificar Docker
docker --version

# Verificar Docker Compose (intenta V2 primero)
docker compose version || docker-compose --version

# Probar Docker
docker run --rm hello-world
```

## Solución de Problemas

### Error: "docker compose" no funciona

Si `docker compose` no funciona, el script instalará automáticamente `docker-compose` (V1). También puedes usar el script `scripts/docker-compose` que detecta automáticamente qué comando usar.

### Error: Permisos denegados

Si obtienes errores de permisos:

```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Cerrar sesión y volver a iniciar
# O ejecutar:
newgrp docker
```

### Error: Docker no inicia

```bash
# Verificar estado del servicio
sudo systemctl status docker

# Iniciar Docker
sudo systemctl start docker

# Habilitar inicio automático
sudo systemctl enable docker
```

## Próximos Pasos

Después de instalar Docker:

1. **Configurar variables de entorno:**
   ```bash
   cd docker
   cp env.example.txt .env
   nano .env  # Edita con tus valores de producción
   ```

2. **Levantar la aplicación:**
   ```bash
   # Usar el script de despliegue
   sudo bash deploy-production.sh

   # O manualmente
   docker compose up -d --build
   ```

3. **Verificar que todo funcione:**
   ```bash
   docker compose ps
   docker compose logs -f app
   ```

## Versiones Instaladas

El script instala:
- **Docker Engine**: Última versión estable del repositorio oficial
- **Docker Compose V2**: Plugin (preferido) o V1 standalone (fallback)

Para verificar las versiones exactas instaladas:
```bash
docker --version
docker compose version  # o docker-compose --version
```

