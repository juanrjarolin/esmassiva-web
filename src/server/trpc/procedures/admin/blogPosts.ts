import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

const blogPostInput = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  featuredImage: z.string().optional(),
  publishedAt: z.date().optional(),
});

export const blogPostsRouter = router({
  list: baseProcedure.query(async () => {
    const posts = await db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return posts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
    }));
  }),

  listPublished: baseProcedure.query(async () => {
    const posts = await db.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
    return posts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
    }));
  }),

  getById: baseProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await db.blogPost.findUnique({
        where: { id: input.id },
      });
      if (!post) return null;
      return {
        ...post,
        tags: post.tags ? JSON.parse(post.tags) : [],
      };
    }),

  getBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await db.blogPost.findUnique({
        where: { slug: input.slug },
      });
      if (!post) return null;
      return {
        ...post,
        tags: post.tags ? JSON.parse(post.tags) : [],
      };
    }),

  create: baseProcedure
    .input(blogPostInput)
    .mutation(async ({ input }) => {
      return db.blogPost.create({
        data: {
          ...input,
          tags: input.tags ? JSON.stringify(input.tags) : null,
          publishedAt: input.isPublished && !input.publishedAt ? new Date() : input.publishedAt,
        },
      });
    }),

  update: baseProcedure
    .input(z.object({ id: z.number(), data: blogPostInput.partial() }))
    .mutation(async ({ input }) => {
      const data: any = { ...input.data };
      if (input.data?.tags) {
        data.tags = JSON.stringify(input.data.tags);
      }
      if (input.data?.isPublished && !input.data?.publishedAt) {
        const existing = await db.blogPost.findUnique({ where: { id: input.id } });
        if (existing && !existing.publishedAt) {
          data.publishedAt = new Date();
        }
      }
      return db.blogPost.update({
        where: { id: input.id },
        data,
      });
    }),

  delete: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.blogPost.delete({
        where: { id: input.id },
      });
    }),

  togglePublished: baseProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const post = await db.blogPost.findUnique({ where: { id: input.id } });
      if (!post) throw new Error("Post not found");

      return db.blogPost.update({
        where: { id: input.id },
        data: {
          isPublished: !post.isPublished,
          publishedAt: !post.isPublished && !post.publishedAt ? new Date() : post.publishedAt,
        },
      });
    }),
});
