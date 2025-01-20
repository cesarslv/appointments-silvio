import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import { stores } from ".";

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

export const addressesRelations = relations(addresses, ({ one }) => ({
  store: one(stores, {
    fields: [addresses.storeId],
    references: [stores.id],
  }),
}));

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
