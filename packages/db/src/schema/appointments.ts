import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { clients, employees, services, stores } from ".";

export const appointments = pgTable("appointments", {
  id: text("id").primaryKey(),
  date: timestamp("date").notNull(),
  status: text("status").notNull(),
  checkIn: boolean("check_in").notNull(),

  storeId: text("store_id")
    .notNull()
    .references(() => stores.id),
  serviceId: text("service_id")
    .notNull()
    .references(() => services.id),
  employeeId: text("employee_id")
    .notNull()
    .references(() => employees.id),
  clientId: text("client_id")
    .notNull()
    .references(() => clients.id),
});

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  store: one(stores, {
    fields: [appointments.storeId],
    references: [stores.id],
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
  employee: one(employees, {
    fields: [appointments.employeeId],
    references: [employees.id],
  }),
  client: one(clients, {
    fields: [appointments.clientId],
    references: [clients.id],
  }),
}));

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
