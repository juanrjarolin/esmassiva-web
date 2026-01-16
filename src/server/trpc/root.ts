import {
  createCallerFactory,
  createTRPCRouter,
} from "~/server/trpc/main";

import { createContactRequest } from "~/server/trpc/procedures/createContactRequest";
import { subscribeNewsletter } from "~/server/trpc/procedures/subscribeNewsletter";
import { requestCvUploadUrl } from "~/server/trpc/procedures/requestCvUploadUrl";
import { requestImageUploadUrl } from "~/server/trpc/procedures/requestImageUploadUrl";
import { publicContentRouter } from "~/server/trpc/procedures/getPublicContent";

// Admin routers
import { servicesRouter } from "~/server/trpc/procedures/admin/services";
import { metricsRouter } from "~/server/trpc/procedures/admin/metrics";
import { testimonialsRouter } from "~/server/trpc/procedures/admin/testimonials";
import { clientsRouter } from "~/server/trpc/procedures/admin/clients";
import { certificationsRouter } from "~/server/trpc/procedures/admin/certifications";
import { officesRouter } from "~/server/trpc/procedures/admin/offices";
import { benefitsRouter } from "~/server/trpc/procedures/admin/benefits";
import { heroSectionsRouter } from "~/server/trpc/procedures/admin/heroSections";
import { teamMembersRouter } from "~/server/trpc/procedures/admin/teamMembers";
import { jobPositionsRouter } from "~/server/trpc/procedures/admin/jobPositions";
import { pagesRouter } from "~/server/trpc/procedures/admin/pages";
import { siteSettingsRouter } from "~/server/trpc/procedures/admin/siteSettings";
import { adminUsersRouter } from "~/server/trpc/procedures/admin/adminUsers";
import { blogPostsRouter } from "~/server/trpc/procedures/admin/blogPosts";
import { contactRequestsRouter } from "~/server/trpc/procedures/admin/contactRequests";
import { newsletterSubscriptionsRouter } from "~/server/trpc/procedures/admin/newsletterSubscriptions";
import { careerApplicationsRouter } from "~/server/trpc/procedures/admin/careerApplications";

export const appRouter = createTRPCRouter({
  // Public procedures
  createContactRequest,
  subscribeNewsletter,
  requestCvUploadUrl,
  requestImageUploadUrl,

  // Public content (read-only)
  content: publicContentRouter,

  // Admin routers
  services: servicesRouter,
  metrics: metricsRouter,
  testimonials: testimonialsRouter,
  clients: clientsRouter,
  certifications: certificationsRouter,
  offices: officesRouter,
  benefits: benefitsRouter,
  heroSections: heroSectionsRouter,
  teamMembers: teamMembersRouter,
  jobPositions: jobPositionsRouter,
  pages: pagesRouter,
  siteSettings: siteSettingsRouter,
  adminUsers: adminUsersRouter,
  blogPosts: blogPostsRouter,
  contactRequests: contactRequestsRouter,
  newsletterSubscriptions: newsletterSubscriptionsRouter,
  careerApplications: careerApplicationsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
