import { relations } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const beanBags = sqliteTable("bean_bags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  brand: text("brand").notNull(),
  beanName: text("bean_name").notNull(),
  logDate: text("log_date").notNull(),
  roastDate: text("roast_date").notNull(),
  flavorProfile: text("flavor_profile").notNull(),
  bagQuantityGrams: integer("bag_quantity_grams").notNull(),
  price: real("price").notNull(),
  photoPath: text("photo_path"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const grinders = sqliteTable("grinders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const grindSettings = sqliteTable("grind_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  beanBagId: integer("bean_bag_id")
    .notNull()
    .references(() => beanBags.id, { onDelete: "cascade" }),
  grinderId: integer("grinder_id").references(() => grinders.id, { onDelete: "set null" }),
  grinderName: text("grinder_name").notNull(),
  settingValue: text("setting_value").notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const changeLogs = sqliteTable("change_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  beanBagId: integer("bean_bag_id").references(() => beanBags.id, { onDelete: "cascade" }),
  grinderId: integer("grinder_id").references(() => grinders.id, { onDelete: "set null" }),
  entityName: text("entity_name"),
  fieldName: text("field_name").notNull(),
  previousValue: text("previous_value"),
  nextValue: text("next_value"),
  changedAt: integer("changed_at", { mode: "timestamp_ms" }).notNull(),
});

export const beanBagsRelations = relations(beanBags, ({ many }) => ({
  grindSettings: many(grindSettings),
  changeLogs: many(changeLogs),
}));

export const grindersRelations = relations(grinders, ({ many }) => ({
  grindSettings: many(grindSettings),
  changeLogs: many(changeLogs),
}));

export const grindSettingsRelations = relations(grindSettings, ({ one }) => ({
  beanBag: one(beanBags, {
    fields: [grindSettings.beanBagId],
    references: [beanBags.id],
  }),
  grinder: one(grinders, {
    fields: [grindSettings.grinderId],
    references: [grinders.id],
  }),
}));

export const changeLogsRelations = relations(changeLogs, ({ one }) => ({
  beanBag: one(beanBags, {
    fields: [changeLogs.beanBagId],
    references: [beanBags.id],
  }),
  grinder: one(grinders, {
    fields: [changeLogs.grinderId],
    references: [grinders.id],
  }),
}));

export type BeanBag = typeof beanBags.$inferSelect;
export type Grinder = typeof grinders.$inferSelect;
export type GrindSetting = typeof grindSettings.$inferSelect;
export type ChangeLog = typeof changeLogs.$inferSelect;
