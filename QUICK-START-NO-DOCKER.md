# Inicio Rápido Sin Docker

Guía rápida para instalar y ejecutar sin Docker.

## Instalación Rápida

### 1. Instalar Dependencias del Sistema

```bash
# Ejecutar script de instalación
sudo bash scripts/install-without-docker.sh
```

O manualmente:

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# pnpm
sudo npm install -g pnpm

# MySQL
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. Configurar MySQL

```bash
# Configurar MySQL
sudo mysql_secure_installation

# Crear base de datos
sudo mysql -u root -p
```

Dentro de MySQL:

```sql
CREATE DATABASE esmassiva;
CREATE USER 'esmassiva'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON esmassiva.* TO 'esmassiva'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Configurar la Aplicación

```bash
cd /var/www/html/esmassiva-web

# Crear .env
cp docker/env.example.txt .env
nano .env
```

Configuración mínima en `.env`:

```env
NODE_ENV=production
DATABASE_URL=mysql://esmassiva:tu_password@localhost:3306/esmassiva
ADMIN_PASSWORD=tu_password_seguro
BASE_PATH=/esmassiva-web
BASE_URL=http://tu-dominio.com
```

### 4. Instalar y Construir

```bash
# Instalar dependencias
pnpm install

# Configurar base de datos
pnpm db:push
pnpm db:seed

# Construir para producción
pnpm build
```

### 5. Iniciar la Aplicación

#### Opción A: Script de inicio (desarrollo/testing)

```bash
chmod +x scripts/start-without-docker.sh
./scripts/start-without-docker.sh
```

#### Opción B: Servicio systemd (producción)

```bash
# Copiar servicio
sudo cp systemd/esmassiva.service /etc/systemd/system/

# Ajustar ruta si es necesario
sudo nano /etc/systemd/system/esmassiva.service

# Habilitar y iniciar
sudo systemctl daemon-reload
sudo systemctl enable esmassiva
sudo systemctl start esmassiva

# Ver estado
sudo systemctl status esmassiva

# Ver logs
sudo journalctl -u esmassiva -f
```

## Comandos Útiles

```bash
# Iniciar manualmente
cd /var/www/html/esmassiva-web
pnpm start

# Ver logs del servicio
sudo journalctl -u esmassiva -f

# Reiniciar servicio
sudo systemctl restart esmassiva

# Detener servicio
sudo systemctl stop esmassiva

# Ver estado
sudo systemctl status esmassiva
```

## Configurar Nginx (Opcional)

```bash
sudo nano /etc/nginx/sites-available/esmassiva
```

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location /esmassiva-web {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/esmassiva /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Verificación

```bash
# Verificar que el servicio está corriendo
sudo systemctl status esmassiva

# Verificar que responde
curl http://localhost:3000

# Ver logs
sudo journalctl -u esmassiva -n 50
```

## Troubleshooting

### El servicio no inicia

```bash
# Ver logs de error
sudo journalctl -u esmassiva -n 100

# Verificar permisos
sudo chown -R www-data:www-data /var/www/html/esmassiva-web

# Verificar .env
cat /var/www/html/esmassiva-web/.env
```

### Error de base de datos

```bash
# Verificar MySQL
sudo systemctl status mysql

# Probar conexión
mysql -u esmassiva -p esmassiva
```

### Error de permisos

```bash
# Corregir propietario
sudo chown -R www-data:www-data /var/www/html/esmassiva-web
sudo chmod -R 755 /var/www/html/esmassiva-web
```

