import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  BASE_URL: z.string().optional(),
  BASE_URL_OTHER_PORT: z.string().optional(),
  BASE_PATH: z.string().optional(), // Ruta base de la aplicación (ej: /esmassiva-web)
  ADMIN_PASSWORD: z.string(),
});

export const env = envSchema.parse(process.env);
