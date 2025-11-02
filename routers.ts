import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getVolunteerByUserId,
  createVolunteer,
  getOrganizationByUserId,
  createOrganization,
  getActiveOpportunities,
  getOpportunitiesByOrganization,
  getOpportunityById,
  createOpportunity,
  getApplicationsByVolunteer,
  getApplicationsByOpportunity,
  createApplication,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Volunteer routes
  volunteer: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await getVolunteerByUserId(ctx.user.id);
    }),
    createProfile: protectedProcedure
      .input(
        z.object({
          bio: z.string().optional(),
          skills: z.string().optional(),
          availability: z.string().optional(),
          phone: z.string().optional(),
          location: z.string().optional(),
          profileImage: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createVolunteer({
          userId: ctx.user.id,
          ...input,
        });
      }),
  }),

  // Organization routes
  organization: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await getOrganizationByUserId(ctx.user.id);
    }),
    createProfile: protectedProcedure
      .input(
        z.object({
          organizationName: z.string(),
          description: z.string().optional(),
          website: z.string().optional(),
          phone: z.string().optional(),
          location: z.string().optional(),
          logo: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createOrganization({
          userId: ctx.user.id,
          ...input,
        });
      }),
  }),

  // Opportunity routes
  opportunity: router({
    listActive: publicProcedure.query(async () => {
      return await getActiveOpportunities();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getOpportunityById(input.id);
      }),
    getByOrganization: protectedProcedure.query(async ({ ctx }) => {
      const org = await getOrganizationByUserId(ctx.user.id);
      if (!org) return [];
      return await getOpportunitiesByOrganization(org.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string(),
          category: z.string().optional(),
          location: z.string(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          volunteersNeeded: z.number().optional(),
          skillsRequired: z.string().optional(),
          image: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const org = await getOrganizationByUserId(ctx.user.id);
        if (!org) throw new Error("Organization not found");
        return await createOpportunity({
          organizationId: org.id,
          status: "active",
          ...input,
        });
      }),
  }),

  // Application routes
  application: router({
    getByVolunteer: protectedProcedure.query(async ({ ctx }) => {
      const volunteer = await getVolunteerByUserId(ctx.user.id);
      if (!volunteer) return [];
      return await getApplicationsByVolunteer(volunteer.id);
    }),
    getByOpportunity: protectedProcedure.query(async ({ ctx }) => {
      const org = await getOrganizationByUserId(ctx.user.id);
      if (!org) return [];
      const opportunities = await getOpportunitiesByOrganization(org.id);
      const allApplications = [];
      for (const opp of opportunities) {
        const apps = await getApplicationsByOpportunity(opp.id);
        allApplications.push(...apps);
      }
      return allApplications;
    }),
    create: protectedProcedure
      .input(
        z.object({
          opportunityId: z.number(),
          coverLetter: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const volunteer = await getVolunteerByUserId(ctx.user.id);
        if (!volunteer) throw new Error("Volunteer profile not found");
        return await createApplication({
          volunteerId: volunteer.id,
          opportunityId: input.opportunityId,
          coverLetter: input.coverLetter,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
