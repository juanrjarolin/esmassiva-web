import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

const officeInput = z.object({
  city: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().optional(),
  hours: z.string().optional(),
  mapUrl: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const officesRouter = router({
  list: baseProcedure.query(async () => {
    return db.office.findMany({
      orderBy: { order: "asc" },
    });
  }),

  listActive: baseProcedure.query(async () => {
    return db.office.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  create: baseProcedure
    .input(officeInput)
    .mutation(async ({ input }) => {
      return db.office.create({ data: input });
    }),

  update: baseProcedure
    .input(z.object({ id: z.number(), data: officeInput.partial() }))
    .mutation(async ({ input }) => {
      return db.office.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.office.delete({
        where: { id: input.id },
      });
    }),
});

