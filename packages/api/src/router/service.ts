import { TRPCError } from "@trpc/server";

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
};
