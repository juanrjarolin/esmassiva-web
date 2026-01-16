import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

const clientInput = z.object({
  name: z.string().min(1),
  logo: z.string().min(1),
  website: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const clientsRouter = router({
  list: baseProcedure.query(async () => {
    return db.client.findMany({
      orderBy: { order: "asc" },
    });
  }),

  listActive: baseProcedure.query(async () => {
    return db.client.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  create: baseProcedure
    .input(clientInput)
    .mutation(async ({ input }) => {
      return db.client.create({ data: input });
    }),

  update: baseProcedure
    .input(z.object({ id: z.number(), data: clientInput.partial() }))
    .mutation(async ({ input }) => {
      return db.client.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.client.delete({
        where: { id: input.id },
      });
    }),
});

