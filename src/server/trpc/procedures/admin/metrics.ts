import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

const metricInput = z.object({
  number: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().min(1),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const metricsRouter = router({
  list: baseProcedure.query(async () => {
    return db.metric.findMany({
      orderBy: { order: "asc" },
    });
  }),

  listActive: baseProcedure.query(async () => {
    return db.metric.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  create: baseProcedure
    .input(metricInput)
    .mutation(async ({ input }) => {
      return db.metric.create({ data: input });
    }),

  update: baseProcedure
    .input(z.object({ id: z.number(), data: metricInput.partial() }))
    .mutation(async ({ input }) => {
      return db.metric.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.metric.delete({
        where: { id: input.id },
      });
    }),
});

