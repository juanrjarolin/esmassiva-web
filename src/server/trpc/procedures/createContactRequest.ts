import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";

const createContactRequestInput = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Teléfono debe tener al menos 10 dígitos"),
  company: z.string().min(1, "La empresa es requerida"),
  position: z.string().optional(),
  service: z.string().min(1, "Selecciona un servicio"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

export const createContactRequest = baseProcedure
  .input(createContactRequestInput)
  .mutation(async ({ input }) => {
    try {
      const contactRequest = await db.contactRequest.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          company: input.company,
          position: input.position,
          service: input.service,
          message: input.message,
          budget: input.budget,
          timeline: input.timeline,
          status: "pending"
        }
      });

      // TODO: Send notification email to sales team
      // TODO: Send confirmation email to client

      return {
        success: true,
        message: "Solicitud enviada correctamente. Nos pondremos en contacto contigo pronto.",
        contactRequestId: contactRequest.id
      };
    } catch (error) {
      console.error("Error creating contact request:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error al procesar la solicitud. Por favor, inténtalo de nuevo."
      });
    }
  });
