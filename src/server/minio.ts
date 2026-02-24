import { Client } from "minio";
import { env } from "./env";

// Inside Docker, use the service name. Outside Docker, use localhost
// Check if we're running in Docker by checking if we can resolve the service name
// Default to "minio" (Docker service name) if MINIO_ENDPOINT is not set
const minioEndpoint = process.env.MINIO_ENDPOINT || "minio";
const minioPort = parseInt(process.env.MINIO_PORT || "9000", 10);
const minioAccessKey = process.env.MINIO_ROOT_USER || "admin";
const minioSecretKey = process.env.MINIO_ROOT_PASSWORD || env.ADMIN_PASSWORD;

// Log MinIO configuration (without exposing the secret key)
console.log("MinIO Configuration:", {
  endpoint: minioEndpoint,
  port: minioPort,
  accessKey: minioAccessKey,
  secretKey: minioSecretKey ? "***" : "NOT SET",
  nodeEnv: process.env.NODE_ENV
});

export const minioClient = new Client({
  endPoint: minioEndpoint,
  port: minioPort,
  useSSL: false,
  accessKey: minioAccessKey,
  secretKey: minioSecretKey,
});
