import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

const heroSectionInput = z.object({
  page: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  ctaSecondaryText: z.string().optional(),
  ctaSecondaryLink: z.string().optional(),
});

export const heroSectionsRouter = router({
  list: baseProcedure.query(async () => {
    return db.heroSection.findMany();
  }),

  getByPage: baseProcedure
    .input(z.object({ page: z.string() }))
    .query(async ({ input }) => {
      return db.heroSection.findUnique({
        where: { page: input.page },
      });
    }),

  upsert: baseProcedure
    .input(heroSectionInput)
    .mutation(async ({ input }) => {
      return db.heroSection.upsert({
        where: { page: input.page },
        update: input,
        create: input,
      });
    }),

  delete: baseProcedure
    .input(z.object({ page: z.string() }))
    .mutation(async ({ input }) => {
      return db.heroSection.delete({
        where: { page: input.page },
      });
    }),
});

