import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq } from "@acme/db";
import { db } from "@acme/db/client";
import { stores } from "@acme/db/schema";

import { protectedProcedure } from "../trpc";

export const storeRoute = {
  getById: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ input }) => {
      const org = await db.query.stores.findFirst({
        where: (table, { eq }) => eq(table.id, input.organizationId),
      });

      if (!org) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });
      }

      return org;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [org] = await db
        .insert(stores)
        .values({
          name: input.name,
          userId: ctx.session.session.id,
        })
        .returning({
          id: stores.id,
        });

      if (!org) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create organization",
        });
      }

      return org;
    }),

  update: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        name: z.string().min(1),
        logo: z.string().optional(),
        workingHours: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const [org] = await db
        .update(stores)
        .set({
          name: input.name,
          logo: input.logo,
          workingHours: input.workingHours,
        })
        .where(eq(stores.id, input.organizationId))
        .returning({
          id: stores.id,
        });

      if (!org) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update organization",
        });
      }

      return org;
    }),

  delete: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .mutation(async ({ input }) => {
      const [org] = await db
        .delete(stores)
        .where(eq(stores.id, input.organizationId))
        .returning({ id: stores.id });

      if (!org) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete organization",
        });
      }

      return org;
    }),
};
