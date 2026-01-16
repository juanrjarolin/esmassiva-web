import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { minioClient } from "~/server/minio";
import { baseProcedure } from "~/server/trpc/main";

const requestCvUploadUrlInput = z.object({
  fileName: z.string().min(1, "Nombre de archivo requerido"),
  fileType: z.string().min(1, "Tipo de archivo requerido"),
  fileSize: z.number().max(10 * 1024 * 1024, "El archivo no puede ser mayor a 10MB"), // 10MB limit
});

export const requestCvUploadUrl = baseProcedure
  .input(requestCvUploadUrlInput)
  .mutation(async ({ input }) => {
    try {
      // Validate file type (only allow PDF and common document formats)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(input.fileType)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tipo de archivo no permitido. Solo se aceptan PDF, DOC y DOCX."
        });
      }

      // Generate unique file name to avoid conflicts
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = input.fileName.split('.').pop();
      const objectName = `cvs/${timestamp}-${randomString}.${fileExtension}`;

      // Generate presigned URL (expires in 1 hour)
      const presignedUrl = await minioClient.presignedPutObject(
        'career-applications',
        objectName,
        60 * 60 // 1 hour expiry
      );

      return {
        success: true,
        uploadUrl: presignedUrl,
        objectName: objectName,
        expiresIn: 3600 // 1 hour in seconds
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      console.error("Error generating CV upload URL:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error al generar URL de subida. Por favor, inténtalo de nuevo."
      });
    }
  });
