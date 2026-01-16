import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

export const newsletterSubscriptionsRouter = router({
  list: baseProcedure.query(async () => {
    const subscriptions = await db.newsletterSubscription.findMany({
      orderBy: { createdAt: "desc" },
    });
    return subscriptions.map(sub => ({
      ...sub,
      interests: sub.interests ? JSON.parse(sub.interests) : [],
    }));
  }),

  listActive: baseProcedure.query(async () => {
    const subscriptions = await db.newsletterSubscription.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return subscriptions.map(sub => ({
      ...sub,
      interests: sub.interests ? JSON.parse(sub.interests) : [],
    }));
  }),

  getById: baseProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const subscription = await db.newsletterSubscription.findUnique({
        where: { id: input.id },
      });
      if (!subscription) return null;
      return {
        ...subscription,
        interests: subscription.interests ? JSON.parse(subscription.interests) : [],
      };
    }),

  update: baseProcedure
    .input(z.object({
      id: z.number(),
      data: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        company: z.string().optional(),
        isActive: z.boolean().optional(),
        interests: z.array(z.string()).optional(),
      }).partial(),
    }))
    .mutation(async ({ input }) => {
      const data: any = { ...input.data };
      if (input.data?.interests) {
        data.interests = JSON.stringify(input.data.interests);
      }
      return db.newsletterSubscription.update({
        where: { id: input.id },
        data,
      });
    }),

  toggleActive: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const subscription = await db.newsletterSubscription.findUnique({
        where: { id: input.id },
      });
      if (!subscription) throw new Error("Subscription not found");

      return db.newsletterSubscription.update({
        where: { id: input.id },
        data: { isActive: !subscription.isActive },
      });
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.newsletterSubscription.delete({
        where: { id: input.id },
      });
    }),

  getStats: baseProcedure.query(async () => {
    const [total, active, inactive] = await Promise.all([
      db.newsletterSubscription.count(),
      db.newsletterSubscription.count({ where: { isActive: true } }),
      db.newsletterSubscription.count({ where: { isActive: false } }),
    ]);

    return { total, active, inactive };
  }),
});
