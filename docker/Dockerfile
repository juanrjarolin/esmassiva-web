FROM debian:12

# Evita zombies y señales mal manejadas
ENTRYPOINT ["/usr/bin/tini", "--"]

WORKDIR /app

# Dependencias del sistema
RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    apt-get install -y curl wget build-essential \
    libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev \
    tini && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# pnpm
RUN npm install -g pnpm
RUN pnpm set store-dir /app/node_modules/.pnpm-store

# Copiamos solo manifests primero (cache eficiente)
COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

# Copiamos el resto del proyecto
COPY . .

# Build (si aplica)
RUN pnpm build || echo "No build step"

# Puerto interno
EXPOSE 3000

# 🔥 ESTO ES LO QUE TE FALTABA
CMD ["pnpm", "start"]
