import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

const benefitInput = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const benefitsRouter = router({
  list: baseProcedure.query(async () => {
    return db.benefit.findMany({
      orderBy: { order: "asc" },
    });
  }),

  listActive: baseProcedure.query(async () => {
    return db.benefit.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  create: baseProcedure
    .input(benefitInput)
    .mutation(async ({ input }) => {
      return db.benefit.create({ data: input });
    }),

  update: baseProcedure
    .input(z.object({ id: z.number(), data: benefitInput.partial() }))
    .mutation(async ({ input }) => {
      return db.benefit.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.benefit.delete({
        where: { id: input.id },
      });
    }),
});

