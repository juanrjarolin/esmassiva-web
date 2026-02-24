import { defineEventHandler, toWebRequest } from "@tanstack/react-start/server";
import { minioClient } from "~/server/minio";

export default defineEventHandler(async (event) => {
  const request = toWebRequest(event);
  if (!request) {
    return new Response("No request", { status: 400 });
  }

  try {
    // Extract bucket and object path from URL
    // URL format: /api/images/company-assets/logos/image.png
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/").filter(Boolean);

    // Remove "api" and "images" from path
    if (pathParts[0] === "api" && pathParts[1] === "images") {
      pathParts.shift(); // Remove "api"
      pathParts.shift(); // Remove "images"
    }

    if (pathParts.length < 2) {
      return new Response("Invalid path. Expected: /api/images/bucket-name/path/to/image", {
        status: 400,
      });
    }

    const bucketName = pathParts[0];
    const objectName = pathParts.slice(1).join("/");

    // Get object stat first to determine content type and size
    const stat = await minioClient.statObject(bucketName, objectName);
    const contentType = stat.metaData?.["content-type"] ||
                       stat.metaData?.["Content-Type"] ||
                       getContentTypeFromExtension(objectName) ||
                       "application/octet-stream";

    // Get object from MinIO (returns Node.js stream)
    const objectStream = await minioClient.getObject(bucketName, objectName);

    // Convert Node.js stream to buffer
    const chunks: Buffer[] = [];

    return new Promise<Response>((resolve, reject) => {
      objectStream.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      objectStream.on("end", () => {
        const buffer = Buffer.concat(chunks);
        resolve(new Response(buffer, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Content-Length": buffer.length.toString(),
            "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
            "Access-Control-Allow-Origin": "*", // Allow CORS
          },
        }));
      });

      objectStream.on("error", (error: Error) => {
        console.error("Stream error:", error);
        reject(error);
      });
    });
  } catch (error) {
    console.error("Error serving image:", error);

    if (error instanceof Error) {
      if (error.message.includes("does not exist") || error.message.includes("NoSuchKey")) {
        return new Response("Image not found", { status: 404 });
      }
    }

    return new Response("Error serving image", { status: 500 });
  }
});

// Helper function to determine content type from file extension
function getContentTypeFromExtension(filename: string): string | null {
  const ext = filename.split(".").pop()?.toLowerCase();
  const contentTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    ico: "image/x-icon",
  };
  return contentTypes[ext || ""] || null;
}
