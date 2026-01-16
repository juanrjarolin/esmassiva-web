import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

export const careerApplicationsRouter = router({
  list: baseProcedure.query(async () => {
    return db.careerApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: baseProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.careerApplication.findUnique({
        where: { id: input.id },
      });
    }),

  updateStatus: baseProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "reviewing", "interview", "hired", "rejected"]),
    }))
    .mutation(async ({ input }) => {
      return db.careerApplication.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.careerApplication.delete({
        where: { id: input.id },
      });
    }),

  getStats: baseProcedure.query(async () => {
    const [total, pending, reviewing, interview, hired, rejected] = await Promise.all([
      db.careerApplication.count(),
      db.careerApplication.count({ where: { status: "pending" } }),
      db.careerApplication.count({ where: { status: "reviewing" } }),
      db.careerApplication.count({ where: { status: "interview" } }),
      db.careerApplication.count({ where: { status: "hired" } }),
      db.careerApplication.count({ where: { status: "rejected" } }),
    ]);

    return { total, pending, reviewing, interview, hired, rejected };
  }),
});
