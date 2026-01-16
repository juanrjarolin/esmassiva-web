import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

const pageInput = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const pagesRouter = router({
  list: baseProcedure.query(async () => {
    return db.page.findMany();
  }),

  getBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return db.page.findUnique({
        where: { slug: input.slug },
      });
    }),

  upsert: baseProcedure
    .input(pageInput)
    .mutation(async ({ input }) => {
      return db.page.upsert({
        where: { slug: input.slug },
        update: input,
        create: input,
      });
    }),

  delete: baseProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input }) => {
      return db.page.delete({
        where: { slug: input.slug },
      });
    }),
});

