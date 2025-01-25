import { TRPCError } from "@trpc/server";

import { db } from "@acme/db/client";
import { categories } from "@acme/db/schema";
import { createCategorySchema } from "@acme/validators";

import { protectedProcedure } from "../trpc";

export const categoryRoute = {
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

    const categories = await db.query.categories.findMany({
      where: (table, { eq }) => eq(table.storeId, org.id),
    });

    return categories;
  }),

  create: protectedProcedure
    .input(createCategorySchema)
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

      const [category] = await db
        .insert(categories)
        .values({
          name: input.name,
          storeId: store.id,
        })
        .returning({
          id: categories.id,
        });

      if (!category) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create category",
        });
      }

      return category;
    }),
};
