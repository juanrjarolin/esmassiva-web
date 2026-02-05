import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { router } from "~/server/trpc/main";

export const publicContentRouter = router({
  // Get all active services
  getServices: baseProcedure.query(async () => {
    const services = await db.service.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return services.map(s => ({
      ...s,
      benefits: JSON.parse(s.benefits || "[]") as string[],
    }));
  }),

  // Get service by slug
  getServiceBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const service = await db.service.findUnique({
        where: { slug: input.slug, isActive: true },
      });
      if (!service) return null;
      return {
        ...service,
        benefits: JSON.parse(service.benefits || "[]") as string[],
      };
    }),

  // Get all active metrics
  getMetrics: baseProcedure.query(async () => {
    return db.metric.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  // Get all active testimonials
  getTestimonials: baseProcedure.query(async () => {
    return db.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  // Get all active clients
  getClients: baseProcedure.query(async () => {
    return db.client.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  // Get all active certifications
  getCertifications: baseProcedure.query(async () => {
    return db.certification.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  // Get all active offices
  getOffices: baseProcedure.query(async () => {
    return db.office.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  // Get all active benefits
  getBenefits: baseProcedure.query(async () => {
    return db.benefit.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  // Get hero section by page
  getHero: baseProcedure
    .input(z.object({ page: z.string() }))
    .query(async ({ input }) => {
      return db.heroSection.findUnique({
        where: { page: input.page },
      });
    }),

  // Get all active team members
  getTeamMembers: baseProcedure.query(async () => {
    return db.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  // Get all active job positions
  getJobPositions: baseProcedure.query(async () => {
    return db.jobPosition.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Get job position by slug
  getJobBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return db.jobPosition.findUnique({
        where: { slug: input.slug, isActive: true },
      });
    }),

  // Get published blog posts
  getBlogPosts: baseProcedure
    .input(z.object({
      limit: z.number().optional().default(10),
      featured: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
      return db.blogPost.findMany({
        where: {
          isPublished: true,
          ...(input.featured ? { isFeatured: true } : {}),
        },
        orderBy: { publishedAt: "desc" },
        take: input.limit,
      });
    }),

  // Get blog post by slug
  getBlogPostBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return db.blogPost.findUnique({
        where: { slug: input.slug, isPublished: true },
      });
    }),

  // Get site settings
  getSiteSettings: baseProcedure.query(async () => {
    const settings = await db.siteSettings.findMany();
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
  }),

  // Get homepage data (all in one call for better performance)
  getHomepageData: baseProcedure.query(async () => {
    const [services, metrics, testimonials, clients, certifications, offices, benefits, hero, settingsRows, featuredPost] = await Promise.all([
      db.service.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      db.metric.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      db.testimonial.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      db.client.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      db.certification.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      db.office.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      db.benefit.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      db.heroSection.findUnique({ where: { page: "home" } }),
      db.siteSettings.findMany(),
      db.blogPost.findFirst({
        where: { isPublished: true },
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      }),
    ]);

    const settings = settingsRows.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as Record<string, string>);

    return {
      services: services.map(s => ({
        ...s,
        benefits: JSON.parse(s.benefits || "[]") as string[],
      })),
      metrics,
      testimonials,
      clients,
      certifications,
      offices,
      benefits,
      hero,
      settings,
      featuredPost: featuredPost ? {
        title: featuredPost.title,
        slug: featuredPost.slug,
        excerpt: featuredPost.excerpt || featuredPost.content.slice(0, 160) + "...",
        featuredImage: featuredPost.featuredImage,
        isFeatured: featuredPost.isFeatured,
      } : null,
    };
  }),
});

