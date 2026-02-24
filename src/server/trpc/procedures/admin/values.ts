import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

const valueInput = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const valuesRouter = router({
  list: baseProcedure.query(async () => {
    return db.value.findMany({
      orderBy: { order: "asc" },
    });
  }),

  listActive: baseProcedure.query(async () => {
    return db.value.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  create: baseProcedure
    .input(valueInput)
    .mutation(async ({ input }) => {
      return db.value.create({ data: input });
    }),

  update: baseProcedure
    .input(z.object({ id: z.number(), data: valueInput.partial() }))
    .mutation(async ({ input }) => {
      return db.value.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.value.delete({
        where: { id: input.id },
      });
    }),
});
