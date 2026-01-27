FROM node:20

WORKDIR /app

# Copiamos todo el proyecto de una vez
COPY . .

# Instalamos pnpm
RUN npm install -g pnpm

# Instalamos dependencias (postinstall generará Prisma Client)
RUN pnpm install --frozen-lockfile

# Compilamos la app Vinxi
RUN pnpm vinxi build

EXPOSE 3000

CMD ["pnpm", "vinxi", "start"]

