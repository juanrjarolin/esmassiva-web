import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  BASE_URL: z.string().optional(),
  BASE_URL_OTHER_PORT: z.string().optional(),
  BASE_PATH: z.string().optional(), // Ruta base de la aplicación (ej: /esmassiva-web)
  ADMIN_PASSWORD: z.string().default("admin123"),
});

// Parsear con valores por defecto para evitar errores
export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV || "development",
  BASE_URL: process.env.BASE_URL,
  BASE_URL_OTHER_PORT: process.env.BASE_URL_OTHER_PORT,
  BASE_PATH: process.env.BASE_PATH,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin123",
});
