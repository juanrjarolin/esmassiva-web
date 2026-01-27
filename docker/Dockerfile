FROM debian:12

ENTRYPOINT ["/usr/bin/tini", "--"]
WORKDIR /app

RUN apt-get update && apt-get install -y curl wget build-essential \
    libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev tini \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm
RUN pnpm set store-dir /app/node_modules/.pnpm-store

# Copiamos package.json y lockfile
COPY package.json pnpm-lock.yaml* ./

# Copiamos Prisma schema para que postinstall funcione
COPY prisma ./prisma

# Instalamos dependencias (postinstall genera Prisma client)
RUN pnpm install --frozen-lockfile

# Copiamos el resto del proyecto
COPY . .

# Build (si aplica)
RUN pnpm build || echo "No build step"

EXPOSE 3000
CMD ["pnpm", "start"]
