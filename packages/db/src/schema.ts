import {
  boolean,
  date,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./auth-schema";

export * from "./auth-schema";

export const stores = pgTable("stores", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo"),
  workingHours: text("working_hours"),

  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

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

export const services = pgTable("services", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: decimal("price").notNull(),
  description: text("description"),
  estimatedTime: integer("estimated_time").notNull(),
  image: text("image"),

  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
});

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

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

export const clients = pgTable("clients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  birthDate: date("birth_date").notNull(),
  cpf: text("cpf"),
  email: text("email"),
  address: text("address"),

  storeId: text("store_id")
    .notNull()
    .references(() => stores.id),
});

export const addresses = pgTable("addresses", {
  id: text("id").primaryKey(),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),

  storeId: text("store_id")
    .notNull()
    .references(() => stores.id),
});

export const employeeServices = pgTable("employee_services", {
  id: text("id").primaryKey(),
  commission: decimal("commission").notNull(),

  employeeId: text("employee_id")
    .notNull()
    .references(() => employees.id),
  serviceId: text("service_id")
    .notNull()
    .references(() => services.id),
});
