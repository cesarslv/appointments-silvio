import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import { appointments, employeeServices, stores } from ".";

export const employees = pgTable("employees", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  photo: text("photo"),
  workingDays: text("working_days"),

  storeId: text("store_id")
    .notNull()
    .references(() => stores.id),
});

export const employeesRelations = relations(employees, ({ one, many }) => ({
  store: one(stores, {
    fields: [employees.storeId],
    references: [stores.id],
  }),
  appointments: many(appointments, { relationName: "employeeAppointments" }),
  employeeServices: many(employeeServices),
}));

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
