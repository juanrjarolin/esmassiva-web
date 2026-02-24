import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { minioClient } from "~/server/minio";
import { baseProcedure } from "~/server/trpc/main";

const requestImageUploadUrlInput = z.object({
  fileName: z.string().min(1, "Nombre de archivo requerido"),
  fileType: z.string().min(1, "Tipo de archivo requerido"),
  fileSize: z.number().max(5 * 1024 * 1024, "El archivo no puede ser mayor a 5MB"), // 5MB limit
  folder: z.string().optional().default("images"), // Folder within bucket
});

export const requestImageUploadUrl = baseProcedure
  .input(requestImageUploadUrlInput)
  .mutation(async ({ input }) => {
    try {
      console.log("Requesting image upload URL for:", {
        fileName: input.fileName,
        fileType: input.fileType,
        fileSize: input.fileSize,
        folder: input.folder
      });

      // Validate file type (only allow images)
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml'
      ];

      if (!allowedTypes.includes(input.fileType)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tipo de archivo no permitido. Solo se aceptan imágenes (JPG, PNG, GIF, WEBP, SVG)."
        });
      }

      // Generate unique file name to avoid conflicts
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = input.fileName.split('.').pop()?.toLowerCase() || 'jpg';
      const objectName = `${input.folder}/${timestamp}-${randomString}.${fileExtension}`;

      // Ensure bucket exists
      const bucketName = 'company-assets';
      let bucketExists = false;
      try {
        bucketExists = await minioClient.bucketExists(bucketName);
      } catch (bucketCheckError) {
        console.error("Error checking bucket existence:", bucketCheckError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `No se puede conectar con MinIO. Verifica que el servicio esté corriendo. Error: ${bucketCheckError instanceof Error ? bucketCheckError.message : "Desconocido"}`
        });
      }

      if (!bucketExists) {
        try {
          await minioClient.makeBucket(bucketName);
          // Set bucket policy to allow public read access
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
        } catch (makeBucketError) {
          console.error("Error creating bucket:", makeBucketError);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al crear el bucket en MinIO. Error: ${makeBucketError instanceof Error ? makeBucketError.message : "Desconocido"}`
          });
        }
      }

      // Generate presigned URL (expires in 1 hour)
      let presignedUrl: string;
      try {
        presignedUrl = await minioClient.presignedPutObject(
          bucketName,
          objectName,
          60 * 60 // 1 hour expiry
        );
      } catch (presignedPutError) {
        console.error("Error generating presigned PUT URL:", presignedPutError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error al generar URL de subida. ${presignedPutError instanceof Error ? presignedPutError.message : "Error desconocido"}`
        });
      }

      // Generate public URL for the uploaded image
      // Use presigned GET URL that doesn't expire (or expires in a very long time)
      // In production, you might want to set up a proxy endpoint or use a CDN
      let publicUrl: string;
      try {
        publicUrl = await minioClient.presignedGetObject(
          bucketName,
          objectName,
          60 * 60 * 24 * 365 // 1 year expiry for public images
        );
      } catch (presignedGetError) {
        console.error("Error generating presigned GET URL:", presignedGetError);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error al generar URL pública. ${presignedGetError instanceof Error ? presignedGetError.message : "Error desconocido"}`
        });
      }

      return {
        success: true,
        uploadUrl: presignedUrl,
        objectName: objectName,
        publicUrl: publicUrl,
        expiresIn: 3600 // 1 hour in seconds
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      console.error("Error generating image upload URL:", error);

      // Provide more specific error messages
      let errorMessage = "Error al generar URL de subida. Por favor, inténtalo de nuevo.";
      if (error instanceof Error) {
        if (error.message.includes("ECONNREFUSED") || error.message.includes("connect")) {
          errorMessage = "No se puede conectar con MinIO. Verifica que el servicio esté corriendo.";
        } else if (error.message.includes("Access Denied") || error.message.includes("Forbidden")) {
          errorMessage = "Error de autenticación con MinIO. Verifica las credenciales.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: errorMessage
      });
    }
  });

