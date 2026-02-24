import { defineEventHandler, toWebRequest } from "@tanstack/react-start/server";
import { minioClient } from "~/server/minio";

export default defineEventHandler(async (event) => {
  const request = toWebRequest(event);
  if (!request) {
    return new Response("No request", { status: 400 });
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Get form data from request
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const objectName = formData.get("objectName") as string;
    const bucketName = formData.get("bucketName") as string || "company-assets";

    if (!file || !objectName) {
      return new Response("Missing file or objectName", { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml"
    ];

    if (!allowedTypes.includes(file.type)) {
      return new Response("Invalid file type", { status: 400 });
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return new Response("File too large (max 5MB)", { status: 400 });
    }

    // Ensure bucket exists
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName);
      // Set bucket policy to allow public read access
      try {
        await minioClient.setBucketPolicy(
          bucketName,
          JSON.stringify({
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: { AWS: ["*"] },
                Action: ["s3:GetObject"],
                Resource: [`arn:aws:s3:::${bucketName}/*`],
              },
            ],
          })
        );
      } catch (policyError) {
        console.warn("Could not set bucket policy:", policyError);
        // Continue even if policy setting fails
      }
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to MinIO
    await minioClient.putObject(
      bucketName,
      objectName,
      buffer,
      buffer.length,
      {
        "Content-Type": file.type,
      }
    );

    // Return success with public URL
    const baseUrl = request.headers.get("origin") || new URL(request.url).origin;
    const basePath = process.env.BASE_PATH?.trim() || "";
    const apiBase = basePath ? `${basePath}/api/images` : "/api/images";
    const publicUrl = `${baseUrl}${apiBase}/${bucketName}/${objectName}`;

    return new Response(
      JSON.stringify({
        success: true,
        publicUrl: publicUrl,
        objectName: objectName,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});
