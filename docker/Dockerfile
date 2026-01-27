FROM debian:12

# Configuramos directorio de trabajo
WORKDIR /app

# Instalamos dependencias del sistema
RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install --yes curl wget build-essential \
    libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev vim less iputils-ping sudo \
    libsecret-1-0 rsync man-db netcat-openbsd dnsutils procps lsof tini && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash && \
    DEBIAN_FRONTEND=noninteractive apt-get install --yes nodejs && \
    npm install -g pnpm && \
    pnpm set store-dir /app/node_modules/.pnpm-store && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copiamos solo lo necesario para instalar dependencias y generar Prisma/tsr
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma
COPY src/routes ./src/routes

# Instalamos dependencias (postinstall genera Prisma Client y rutas)
RUN pnpm install --frozen-lockfile

# Copiamos el resto del proyecto
COPY . .

# Exponemos puerto
EXPOSE 3000

# Usamos tini como init
ENTRYPOINT ["/usr/bin/tini", "--"]

# Comando por defecto
CMD ["pnpm", "start"]
