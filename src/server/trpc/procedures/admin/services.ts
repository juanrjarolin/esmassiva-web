import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

const serviceInput = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  href: z.string().min(1),
  bgColor: z.string().default("bg-primary-100"),
  iconColor: z.string().default("text-primary-600"),
  benefits: z.array(z.string()),
  fullContent: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const servicesRouter = router({
  list: baseProcedure.query(async () => {
    return db.service.findMany({
      orderBy: { order: "asc" },
    });
  }),

  listActive: baseProcedure.query(async () => {
    return db.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  getBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return db.service.findUnique({
        where: { slug: input.slug },
      });
    }),

  create: baseProcedure
    .input(serviceInput)
    .mutation(async ({ input }) => {
      return db.service.create({
        data: {
          ...input,
          benefits: JSON.stringify(input.benefits),
        },
      });
    }),

  update: baseProcedure
    .input(z.object({ id: z.number(), data: serviceInput.partial() }))
    .mutation(async ({ input }) => {
      const data = input.data.benefits
        ? { ...input.data, benefits: JSON.stringify(input.data.benefits) }
        : input.data;
      return db.service.update({
        where: { id: input.id },
        data,
      });
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.service.delete({
        where: { id: input.id },
      });
    }),

  reorder: baseProcedure
    .input(z.array(z.object({ id: z.number(), order: z.number() })))
    .mutation(async ({ input }) => {
      await Promise.all(
        input.map((item) =>
          db.service.update({
            where: { id: item.id },
            data: { order: item.order },
          })
        )
      );
      return { success: true };
    }),
});

