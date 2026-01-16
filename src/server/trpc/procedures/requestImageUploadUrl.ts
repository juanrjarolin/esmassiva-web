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
      const bucketExists = await minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await minioClient.makeBucket(bucketName);
      }

      // Generate presigned URL (expires in 1 hour)
      const presignedUrl = await minioClient.presignedPutObject(
        bucketName,
        objectName,
        60 * 60 // 1 hour expiry
      );

      // Generate public URL for the uploaded image
      // Use presigned GET URL that doesn't expire (or expires in a very long time)
      // In production, you might want to set up a proxy endpoint or use a CDN
      const publicUrl = await minioClient.presignedGetObject(
        bucketName,
        objectName,
        60 * 60 * 24 * 365 // 1 year expiry for public images
      );

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
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error al generar URL de subida. Por favor, inténtalo de nuevo."
      });
    }
  });

