import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "@/lib/schema";

const dataDir = path.join(process.cwd(), "data");
const uploadsDir = path.join(dataDir, "uploads");
const dbFile = path.join(dataDir, "coffee-log.sqlite");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const sqlite = new Database(dbFile);
sqlite.pragma("journal_mode = WAL");
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS bean_bags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    bean_name TEXT NOT NULL,
    log_date TEXT NOT NULL DEFAULT '',
    roast_date TEXT NOT NULL,
    flavor_profile TEXT NOT NULL,
    bag_quantity_grams INTEGER NOT NULL,
    price REAL NOT NULL,
    photo_path TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS grinders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS grind_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bean_bag_id INTEGER NOT NULL,
    grinder_id INTEGER,
    grinder_name TEXT NOT NULL,
    setting_value TEXT NOT NULL,
    notes TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY(bean_bag_id) REFERENCES bean_bags(id) ON DELETE CASCADE,
    FOREIGN KEY(grinder_id) REFERENCES grinders(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS change_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL,
    entity_id INTEGER NOT NULL,
    bean_bag_id INTEGER,
    grinder_id INTEGER,
    entity_name TEXT,
    field_name TEXT NOT NULL,
    previous_value TEXT,
    next_value TEXT,
    changed_at INTEGER NOT NULL,
    FOREIGN KEY(bean_bag_id) REFERENCES bean_bags(id) ON DELETE CASCADE,
    FOREIGN KEY(grinder_id) REFERENCES grinders(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS bean_bags_lookup_idx
    ON bean_bags (brand, bean_name, roast_date);

  CREATE INDEX IF NOT EXISTS grinders_name_idx
    ON grinders (name);

  CREATE INDEX IF NOT EXISTS grind_settings_lookup_idx
    ON grind_settings (bean_bag_id, grinder_name, created_at);

  CREATE INDEX IF NOT EXISTS change_logs_bean_idx
    ON change_logs (bean_bag_id, changed_at);

  CREATE INDEX IF NOT EXISTS change_logs_entity_idx
    ON change_logs (entity_type, entity_id, changed_at);
`);

const beanBagInfo = sqlite.prepare("PRAGMA table_info(bean_bags)").all() as Array<{ name: string }>;
const hasLogDate = beanBagInfo.some((column) => column.name === "log_date");
const hasBeanUpdatedAt = beanBagInfo.some((column) => column.name === "updated_at");

if (!hasLogDate) {
  sqlite.exec("ALTER TABLE bean_bags ADD COLUMN log_date TEXT NOT NULL DEFAULT '';");
  sqlite.exec("UPDATE bean_bags SET log_date = date(created_at / 1000, 'unixepoch') WHERE log_date = '';");
}

if (!hasBeanUpdatedAt) {
  sqlite.exec("ALTER TABLE bean_bags ADD COLUMN updated_at INTEGER NOT NULL DEFAULT 0;");
  sqlite.exec("UPDATE bean_bags SET updated_at = created_at WHERE updated_at = 0;");
}

const tableInfo = sqlite.prepare("PRAGMA table_info(grind_settings)").all() as Array<{ name: string }>;
const hasGrinderId = tableInfo.some((column) => column.name === "grinder_id");
const hasGrindSettingUpdatedAt = tableInfo.some((column) => column.name === "updated_at");

if (!hasGrinderId) {
  sqlite.exec(
    "ALTER TABLE grind_settings ADD COLUMN grinder_id INTEGER REFERENCES grinders(id) ON DELETE SET NULL;",
  );
}

if (!hasGrindSettingUpdatedAt) {
  sqlite.exec("ALTER TABLE grind_settings ADD COLUMN updated_at INTEGER NOT NULL DEFAULT 0;");
  sqlite.exec("UPDATE grind_settings SET updated_at = created_at WHERE updated_at = 0;");
}

const grinderInfo = sqlite.prepare("PRAGMA table_info(grinders)").all() as Array<{ name: string }>;
const hasGrinderUpdatedAt = grinderInfo.some((column) => column.name === "updated_at");

if (!hasGrinderUpdatedAt) {
  sqlite.exec("ALTER TABLE grinders ADD COLUMN updated_at INTEGER NOT NULL DEFAULT 0;");
  sqlite.exec("UPDATE grinders SET updated_at = created_at WHERE updated_at = 0;");
}

export const db = drizzle(sqlite, { schema });
export { uploadsDir };
