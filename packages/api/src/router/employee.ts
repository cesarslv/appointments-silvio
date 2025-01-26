import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { and, eq } from "@acme/db";
import { db } from "@acme/db/client";
import { employees } from "@acme/db/schema";
import { createEmployeeSchema } from "@acme/validators";

import { protectedProcedure } from "../trpc";

export const employeeRoute = {
  all: protectedProcedure.query(async ({ ctx }) => {
    const data = await db.query.employees.findMany({
      where: eq(employees.storeId, ctx.storeId),
    });

    return data;
  }),

  getById: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const employee = await db.query.employees.findFirst({
        where: and(
          eq(employees.id, input.employeeId),
          eq(employees.storeId, ctx.storeId),
        ),
        with: {
          employeeServices: true,
        },
      });

      if (!employee) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get employee",
        });
      }

      return employee;
    }),

  create: protectedProcedure
    .input(createEmployeeSchema)
    .mutation(async ({ input, ctx }) => {
      const [employee] = await db
        .insert(employees)
        .values({ ...input, storeId: ctx.storeId })
        .returning({ id: employees.id });

      if (!employee) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create employee",
        });
      }

      return employee;
    }),
};
