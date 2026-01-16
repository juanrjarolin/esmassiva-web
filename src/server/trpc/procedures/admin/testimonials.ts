import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

const testimonialInput = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
  company: z.string().min(1),
  content: z.string().min(1),
  image: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const testimonialsRouter = router({
  list: baseProcedure.query(async () => {
    return db.testimonial.findMany({
      orderBy: { order: "asc" },
    });
  }),

  listActive: baseProcedure.query(async () => {
    return db.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  create: baseProcedure
    .input(testimonialInput)
    .mutation(async ({ input }) => {
      return db.testimonial.create({ data: input });
    }),

  update: baseProcedure
    .input(z.object({ id: z.number(), data: testimonialInput.partial() }))
    .mutation(async ({ input }) => {
      return db.testimonial.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.testimonial.delete({
        where: { id: input.id },
      });
    }),
});

