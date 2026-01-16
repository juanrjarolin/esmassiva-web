import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

const teamMemberInput = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
  bio: z.string().optional(),
  image: z.string().optional(),
  linkedIn: z.string().optional(),
  email: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const teamMembersRouter = router({
  list: baseProcedure.query(async () => {
    return db.teamMember.findMany({
      orderBy: { order: "asc" },
    });
  }),

  listActive: baseProcedure.query(async () => {
    return db.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  create: baseProcedure
    .input(teamMemberInput)
    .mutation(async ({ input }) => {
      return db.teamMember.create({ data: input });
    }),

  update: baseProcedure
    .input(z.object({ id: z.number(), data: teamMemberInput.partial() }))
    .mutation(async ({ input }) => {
      return db.teamMember.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.teamMember.delete({
        where: { id: input.id },
      });
    }),
});

