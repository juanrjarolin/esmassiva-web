FROM node:20

WORKDIR /app

# Copiamos solo package.json y lock para instalar dependencias
COPY package.json pnpm-lock.yaml* ./

# Instalamos pnpm
RUN npm install -g pnpm

# Instalamos dependencias
RUN pnpm install --frozen-lockfile

# Copiamos todo el proyecto
COPY . .

# Generamos Prisma Client (si usas Prisma)
RUN pnpm prisma generate || true

# Compilamos la app Vinxi
RUN pnpm vinxi build

# Exponemos el puerto de la app
EXPOSE 3000

# Arrancamos la app
CMD ["pnpm", "vinxi", "start"]

