import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

export const contactRequestsRouter = router({
  list: baseProcedure.query(async () => {
    return db.contactRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: baseProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.contactRequest.findUnique({
        where: { id: input.id },
      });
    }),

  updateStatus: baseProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "contacted", "qualified", "closed"])
    }))
    .mutation(async ({ input }) => {
      return db.contactRequest.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.contactRequest.delete({
        where: { id: input.id },
      });
    }),

  getStats: baseProcedure.query(async () => {
    const [total, pending, contacted, qualified, closed] = await Promise.all([
      db.contactRequest.count(),
      db.contactRequest.count({ where: { status: "pending" } }),
      db.contactRequest.count({ where: { status: "contacted" } }),
      db.contactRequest.count({ where: { status: "qualified" } }),
      db.contactRequest.count({ where: { status: "closed" } }),
    ]);

    return { total, pending, contacted, qualified, closed };
  }),
});
