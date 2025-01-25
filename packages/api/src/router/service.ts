import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq } from "@acme/db";
import { db } from "@acme/db/client";
import { services } from "@acme/db/schema";
import { createStoreSchema } from "@acme/validators";

import { protectedProcedure } from "../trpc";

export const serviceRoute = {
  all: protectedProcedure.query(async ({ ctx }) => {
    const services = await db.query.services.findMany({
      where: (table, { eq }) => eq(table.storeId, ctx.storeId),
    });

    return services;
  }),

  create: protectedProcedure
    .input(createStoreSchema)
    .mutation(async ({ input, ctx }) => {
      const [service] = await db
        .insert(services)
        .values({
          name: input.name,
          price: input.price,
          description: input.description,
          estimatedTime: Number(input.estimatedTime),
          categoryId: input.categoryId,
          storeId: ctx.storeId,
        })
        .returning({
          id: services.id,
        });

      if (!service) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create store",
        });
      }

      return service;
    }),
  delete: protectedProcedure
    .input(z.object({ serviceId: z.string() }))
    .mutation(async ({ input }) => {
      const [service] = await db
        .delete(services)
        .where(eq(services.id, input.serviceId))
        .returning({ id: services.id });

      return service;
    }),
};
