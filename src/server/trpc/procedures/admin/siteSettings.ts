import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

export const siteSettingsRouter = router({
  list: baseProcedure.query(async () => {
    const settings = await db.siteSettings.findMany();
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
  }),

  get: baseProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const setting = await db.siteSettings.findUnique({
        where: { key: input.key },
      });
      return setting?.value ?? null;
    }),

  set: baseProcedure
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input }) => {
      return db.siteSettings.upsert({
        where: { key: input.key },
        update: { value: input.value },
        create: { key: input.key, value: input.value },
      });
    }),

  setMany: baseProcedure
    .input(z.record(z.string(), z.string()))
    .mutation(async ({ input }) => {
      await Promise.all(
        Object.entries(input).map(([key, value]) =>
          db.siteSettings.upsert({
            where: { key },
            update: { value },
            create: { key, value },
          })
        )
      );
      return { success: true };
    }),

  delete: baseProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      return db.siteSettings.delete({
        where: { key: input.key },
      });
    }),
});

