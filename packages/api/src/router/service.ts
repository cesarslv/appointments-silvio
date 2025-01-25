import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { db } from "@acme/db/client";
import { services } from "@acme/db/schema";
import { createStoreSchema } from "@acme/validators";

import { protectedProcedure } from "../trpc";

export const serviceRoute = {
  all: protectedProcedure.query(async ({ ctx }) => {
    const org = await db.query.stores.findFirst({
      where: (table, { eq }) => eq(table.userId, ctx.session.user.id),
    });

    if (!org) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Store not found",
      });
    }

    const services = await db.query.services.findMany({
      where: (table, { eq }) => eq(table.storeId, org.id),
    });

    return services;
  }),

  create: protectedProcedure
    .input(createStoreSchema)
    .mutation(async ({ input, ctx }) => {
      const store = await db.query.stores.findFirst({
        where: (table, { eq }) => eq(table.userId, ctx.session.user.id),
      });

      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Store not found",
        });
      }

      const [service] = await db
        .insert(services)
        .values({
          name: input.name,
          price: input.price,
          description: input.description,
          estimatedTime: Number(input.estimatedTime),
          categoryId: input.categoryId,
          storeId: store.id,
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
