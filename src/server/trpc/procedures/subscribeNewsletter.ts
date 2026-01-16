import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";

const subscribeNewsletterInput = z.object({
  email: z.string().email("Email inválido"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

export const subscribeNewsletter = baseProcedure
  .input(subscribeNewsletterInput)
  .mutation(async ({ input }) => {
    try {
      // Check if email already exists
      const existingSubscription = await db.newsletterSubscription.findUnique({
        where: {
          email: input.email
        }
      });

      if (existingSubscription) {
        if (existingSubscription.isActive) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Este email ya está suscrito a nuestro newsletter."
          });
        } else {
          // Reactivate subscription
          await db.newsletterSubscription.update({
            where: {
              email: input.email
            },
            data: {
              isActive: true,
              firstName: input.firstName,
              lastName: input.lastName,
              company: input.company,
              interests: input.interests ? JSON.stringify(input.interests) : null
            }
          });

          return {
            success: true,
            message: "Suscripción reactivada correctamente. ¡Gracias por unirte nuevamente!"
          };
        }
      }

      // Create new subscription
      await db.newsletterSubscription.create({
        data: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          company: input.company,
          interests: input.interests ? JSON.stringify(input.interests) : null,
          isActive: true
        }
      });

      // TODO: Send welcome email
      // TODO: Add to email marketing platform

      return {
        success: true,
        message: "¡Suscripción exitosa! Pronto recibirás nuestras últimas noticias y tendencias."
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      console.error("Error subscribing to newsletter:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error al procesar la suscripción. Por favor, inténtalo de nuevo."
      });
    }
  });
