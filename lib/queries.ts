import { and, desc, eq, like, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { beanBags, changeLogs, grinders, grindSettings } from "@/lib/schema";

export async function getRecentBeans() {
  return db.query.beanBags.findMany({
    orderBy: [desc(beanBags.createdAt)],
    with: {
      grindSettings: {
        orderBy: [desc(grindSettings.createdAt)],
        limit: 1,
      },
    },
  });
}

export async function getBeanBag(id: number) {
  return db.query.beanBags.findFirst({
    where: eq(beanBags.id, id),
    with: {
      grindSettings: {
        orderBy: [desc(grindSettings.createdAt)],
      },
    },
  });
}

export async function searchBeans(params: {
  brand?: string;
  beanName?: string;
  grinderName?: string;
}) {
  const filters = [];

  if (params.brand) {
    filters.push(like(beanBags.brand, `%${params.brand}%`));
  }

  if (params.beanName) {
    filters.push(like(beanBags.beanName, `%${params.beanName}%`));
  }

  if (params.grinderName) {
    filters.push(
      sql`EXISTS (
        SELECT 1
        FROM ${grindSettings}
        WHERE ${grindSettings.beanBagId} = ${beanBags.id}
          AND ${grindSettings.grinderName} LIKE ${`%${params.grinderName}%`}
      )`,
    );
  }

  return db.query.beanBags.findMany({
    where: filters.length ? and(...filters) : undefined,
    orderBy: [desc(beanBags.logDate), desc(beanBags.createdAt)],
    with: {
      grindSettings: {
        orderBy: [desc(grindSettings.createdAt)],
      },
    },
  });
}

export async function getGrinders() {
  return db.query.grinders.findMany({
    orderBy: [grinders.name],
  });
}

export async function getGrinder(id: number) {
  return db.query.grinders.findFirst({
    where: eq(grinders.id, id),
  });
}

export async function getGrindSetting(id: number) {
  return db.query.grindSettings.findFirst({
    where: eq(grindSettings.id, id),
  });
}

export async function getBeanChangeLog(beanBagId: number) {
  return db.query.changeLogs.findMany({
    where: eq(changeLogs.beanBagId, beanBagId),
    orderBy: [desc(changeLogs.changedAt)],
  });
}
