import { TRPCError } from "@trpc/server";

import { db } from "@acme/db/client";
import { categories } from "@acme/db/schema";
import { createCategorySchema } from "@acme/validators";

import { protectedProcedure } from "../trpc";

export const categoryRoute = {
  all: protectedProcedure.query(async ({ ctx }) => {
    const categories = await db.query.categories.findMany({
      where: (table, { eq }) => eq(table.storeId, ctx.storeId),
    });

    return categories;
  }),

  create: protectedProcedure
    .input(createCategorySchema)
    .mutation(async ({ input, ctx }) => {
      const [category] = await db
        .insert(categories)
        .values({
          name: input.name,
          storeId: ctx.storeId,
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
