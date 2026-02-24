import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

const featureItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

const processItemSchema = z.object({
  step: z.string(),
  title: z.string(),
  description: z.string(),
});

// Helper para normalizar campos opcionales: null -> undefined
const optionalString = () => z.string().nullable().optional().transform(val => val === null || val === "" ? undefined : val);
const optionalStringArray = () => z.array(z.string()).nullable().optional().transform(val => val === null ? undefined : val);

const serviceInput = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  href: z.string().min(1),
  bgColor: z.string().default("bg-primary-100"),
  iconColor: z.string().default("text-primary-600"),
  benefits: z.array(z.string()),
  fullContent: optionalString(),
  // Hero Section
  heroTitle: optionalString(),
  heroSubtitle: optionalString(),
  heroDescription: optionalString(),
  heroImage: optionalString(),
  heroCtaText: optionalString(),
  heroCtaLink: optionalString(),
  heroCtaSecondaryText: optionalString(),
  heroCtaSecondaryLink: optionalString(),
  // Features Section
  featuresTitle: optionalString(),
  featuresSubtitle: optionalString(),
  features: z.array(featureItemSchema).nullable().optional().transform(val => val === null ? undefined : val),
  // Services/Channels Section
  servicesTitle: optionalString(),
  servicesSubtitle: optionalString(),
  services: z.array(featureItemSchema).nullable().optional().transform(val => val === null ? undefined : val),
  // Benefits Section
  benefitsTitle: optionalString(),
  benefitsSubtitle: optionalString(),
  benefitsImage: optionalString(),
  // Process Section
  processTitle: optionalString(),
  processSubtitle: optionalString(),
  process: z.array(processItemSchema).nullable().optional().transform(val => val === null ? undefined : val),
  // CTA Section
  ctaTitle: optionalString(),
  ctaDescription: optionalString(),
  ctaButtonText: optionalString(),
  ctaButtonLink: optionalString(),
  ctaSecondaryButtonText: optionalString(),
  ctaSecondaryButtonLink: optionalString(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const servicesRouter = router({
  list: baseProcedure.query(async () => {
    return db.service.findMany({
      orderBy: { order: "asc" },
    });
  }),

  listActive: baseProcedure.query(async () => {
    return db.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  getBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return db.service.findUnique({
        where: { slug: input.slug },
      });
    }),

  create: baseProcedure
    .input(serviceInput)
    .mutation(async ({ input }) => {
      const { benefits, features, services, process, ...rest } = input;
      return db.service.create({
        data: {
          ...rest,
          benefits: JSON.stringify(benefits || []),
          features: features ? JSON.stringify(features) : null,
          services: services ? JSON.stringify(services) : null,
          process: process ? JSON.stringify(process) : null,
        },
      });
    }),

  update: baseProcedure
    .input(z.object({ id: z.number(), data: serviceInput.partial() }))
    .mutation(async ({ input }) => {
      const { benefits, features, services, process, ...rest } = input.data;
      const data: any = { ...rest };

      if (benefits !== undefined) {
        data.benefits = JSON.stringify(benefits);
      }
      if (features !== undefined) {
        data.features = features ? JSON.stringify(features) : null;
      }
      if (services !== undefined) {
        data.services = services ? JSON.stringify(services) : null;
      }
      if (process !== undefined) {
        data.process = process ? JSON.stringify(process) : null;
      }

      return db.service.update({
        where: { id: input.id },
        data,
      });
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.service.delete({
        where: { id: input.id },
      });
    }),

  reorder: baseProcedure
    .input(z.array(z.object({ id: z.number(), order: z.number() })))
    .mutation(async ({ input }) => {
      await Promise.all(
        input.map((item) =>
          db.service.update({
            where: { id: item.id },
            data: { order: item.order },
          })
        )
      );
      return { success: true };
    }),
});

