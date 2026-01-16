import { Client } from "minio";
import { env } from "./env";

// Inside Docker, use the service name. Outside Docker, use localhost
const minioEndpoint = process.env.MINIO_ENDPOINT || (process.env.NODE_ENV === "development" ? "minio" : "localhost");
const minioPort = parseInt(process.env.MINIO_PORT || "9000", 10);

export const minioClient = new Client({
  endPoint: minioEndpoint,
  port: minioPort,
  useSSL: false,
  accessKey: "admin",
  secretKey: env.ADMIN_PASSWORD,
});
