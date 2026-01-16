import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

// Simple hash function (in production, use bcrypt)
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

export const adminUsersRouter = router({
  login: baseProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input }) => {
      const user = await db.adminUser.findUnique({
        where: { email: input.email },
      });

      if (!user || !user.isActive) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Credenciales inválidas",
        });
      }

      const hashedPassword = simpleHash(input.password);
      if (user.password !== hashedPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Credenciales inválidas",
        });
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    }),

  create: baseProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const existing = await db.adminUser.findUnique({
        where: { email: input.email },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "El email ya está registrado",
        });
      }

      return db.adminUser.create({
        data: {
          email: input.email,
          password: simpleHash(input.password),
          name: input.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
    }),

  list: baseProcedure.query(async () => {
    return db.adminUser.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
      },
    });
  }),

  updatePassword: baseProcedure
    .input(z.object({
      id: z.number(),
      password: z.string().min(6),
    }))
    .mutation(async ({ input }) => {
      return db.adminUser.update({
        where: { id: input.id },
        data: { password: simpleHash(input.password) },
        select: { id: true, email: true, name: true },
      });
    }),

  toggleActive: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const user = await db.adminUser.findUnique({
        where: { id: input.id },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return db.adminUser.update({
        where: { id: input.id },
        data: { isActive: !user.isActive },
      });
    }),
});

