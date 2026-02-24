import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

const jobPositionInput = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  department: z.string().min(1),
  location: z.string().min(1),
  type: z.string().min(1),
  description: z.string().min(1),
  requirements: z.string().min(1),
  benefits: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const jobPositionsRouter = router({
  list: baseProcedure.query(async () => {
    return db.jobPosition.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  listActive: baseProcedure.query(async () => {
    return db.jobPosition.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  getBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return db.jobPosition.findUnique({
        where: { slug: input.slug },
      });
    }),

  create: baseProcedure
    .input(jobPositionInput)
    .mutation(async ({ input }) => {
      return db.jobPosition.create({ data: input });
    }),

  update: baseProcedure
    .input(z.object({ id: z.number(), data: jobPositionInput.partial() }))
    .mutation(async ({ input }) => {
      return db.jobPosition.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.jobPosition.delete({
        where: { id: input.id },
      });
    }),
});

