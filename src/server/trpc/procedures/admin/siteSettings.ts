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
      try {
        // Filtrar entradas vacías o con valores undefined/null
        const validEntries = Object.entries(input).filter(([key, value]) => {
          return key && value !== undefined && value !== null;
        });

        if (validEntries.length === 0) {
          return { success: true, message: "No hay cambios para guardar" };
        }

        await Promise.all(
          validEntries.map(([key, value]) =>
            db.siteSettings.upsert({
              where: { key },
              update: { value: String(value) },
              create: { key, value: String(value) },
            })
          )
        );

        return { success: true, saved: validEntries.length };
      } catch (error) {
        console.error("Error en setMany:", error);
        throw new Error(`Error al guardar configuración: ${error instanceof Error ? error.message : "Error desconocido"}`);
      }
    }),

  delete: baseProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      return db.siteSettings.delete({
        where: { key: input.key },
      });
    }),
});

