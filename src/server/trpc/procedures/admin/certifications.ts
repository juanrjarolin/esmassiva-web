import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

const certificationInput = z.object({
  name: z.string().min(1),
  icon: z.string().min(1),
  description: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const certificationsRouter = router({
  list: baseProcedure.query(async () => {
    return db.certification.findMany({
      orderBy: { order: "asc" },
    });
  }),

  listActive: baseProcedure.query(async () => {
    return db.certification.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  create: baseProcedure
    .input(certificationInput)
    .mutation(async ({ input }) => {
      return db.certification.create({ data: input });
    }),

  update: baseProcedure
    .input(z.object({ id: z.number(), data: certificationInput.partial() }))
    .mutation(async ({ input }) => {
      return db.certification.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.certification.delete({
        where: { id: input.id },
      });
    }),
});

