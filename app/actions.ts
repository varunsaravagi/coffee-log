"use server";

import { and, desc, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { beanBags, changeLogs, grinders, grindSettings } from "@/lib/schema";
import { savePhoto } from "@/lib/uploads";
import { beanBagSchema, grinderSchema, grindSettingSchema } from "@/lib/validators";

export type FormState = {
  error?: string;
};

type ChangeEntry = {
  entityType: "bean" | "grinder" | "grind_setting";
  entityId: number;
  beanBagId?: number | null;
  grinderId?: number | null;
  entityName?: string | null;
  fieldName: string;
  previousValue?: string | null;
  nextValue?: string | null;
  changedAt: Date;
};

function normalizeValue(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value);
}

async function writeChangeLog(entries: ChangeEntry[]) {
  if (!entries.length) {
    return;
  }

  await db.insert(changeLogs).values(entries);
}

function revalidateBeanPaths(beanId: number) {
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/beans/${beanId}`);
  revalidatePath(`/beans/${beanId}/edit`);
}

export async function createBeanBag(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = beanBagSchema.safeParse({
    brand: formData.get("brand"),
    beanName: formData.get("beanName"),
    logDate: formData.get("logDate"),
    roastDate: formData.get("roastDate"),
    flavorProfile: formData.get("flavorProfile"),
    bagQuantityGrams: formData.get("bagQuantityGrams"),
    price: formData.get("price"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid bean bag details." };
  }

  let photoPath: string | null = null;

  try {
    photoPath = await savePhoto(formData.get("photo") as File | null);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to save the uploaded photo.",
    };
  }

  await db.insert(beanBags).values({
    ...parsed.data,
    photoPath,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const createdBean = await db.query.beanBags.findFirst({
    orderBy: [desc(beanBags.id)],
  });

  if (!createdBean) {
    return { error: "Bean bag was created but could not be loaded." };
  }

  revalidatePath("/");
  revalidatePath("/search");
  redirect(`/beans/${createdBean.id}`);
}

export async function addGrindSetting(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = grindSettingSchema.safeParse({
    beanBagId: formData.get("beanBagId"),
    grinderId: formData.get("grinderId"),
    settingValue: formData.get("settingValue"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid grind setting." };
  }

  const bean = await db.query.beanBags.findFirst({
    where: eq(beanBags.id, parsed.data.beanBagId),
  });

  if (!bean) {
    return { error: "The selected bean bag no longer exists." };
  }

  const grinder = await db.query.grinders.findFirst({
    where: eq(grinders.id, parsed.data.grinderId),
  });

  if (!grinder) {
    return { error: "Select a saved grinder before adding a setting." };
  }

  await db.insert(grindSettings).values({
    beanBagId: parsed.data.beanBagId,
    grinderId: grinder.id,
    grinderName: grinder.name,
    settingValue: parsed.data.settingValue,
    notes: parsed.data.notes || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  revalidateBeanPaths(parsed.data.beanBagId);
  redirect(`/beans/${parsed.data.beanBagId}`);
}

export async function createGrinder(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = grinderSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid grinder name." };
  }

  const existing = await db.query.grinders.findFirst({
    where: eq(grinders.name, parsed.data.name),
  });

  if (existing) {
    return { error: "That grinder already exists." };
  }

  await db.insert(grinders).values({
    name: parsed.data.name,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  revalidatePath("/");
  revalidatePath("/beans/new");
  revalidatePath("/beans");
  revalidatePath("/grinders");
  revalidatePath("/search");
  revalidatePath("/grinders/new");
  redirect("/");
}

export async function updateBeanBag(
  beanBagId: number,
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const bean = await db.query.beanBags.findFirst({
    where: eq(beanBags.id, beanBagId),
  });

  if (!bean) {
    return { error: "Bean bag not found." };
  }

  const parsed = beanBagSchema.safeParse({
    brand: formData.get("brand"),
    beanName: formData.get("beanName"),
    logDate: formData.get("logDate"),
    roastDate: formData.get("roastDate"),
    flavorProfile: formData.get("flavorProfile"),
    bagQuantityGrams: formData.get("bagQuantityGrams"),
    price: formData.get("price"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid bean bag details." };
  }

  let photoPath = bean.photoPath;

  try {
    const uploadedPhoto = await savePhoto(formData.get("photo") as File | null);
    if (uploadedPhoto) {
      photoPath = uploadedPhoto;
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to save the uploaded photo.",
    };
  }

  const nextValues = {
    ...parsed.data,
    photoPath,
  };

  const changes: ChangeEntry[] = [];
  const changedAt = new Date();
  const fields: Array<keyof typeof nextValues> = [
    "brand",
    "beanName",
    "logDate",
    "roastDate",
    "flavorProfile",
    "bagQuantityGrams",
    "price",
    "photoPath",
  ];

  for (const field of fields) {
    const previousValue = normalizeValue(bean[field]);
    const nextValue = normalizeValue(nextValues[field]);

    if (previousValue !== nextValue) {
      changes.push({
        entityType: "bean",
        entityId: bean.id,
        beanBagId: bean.id,
        entityName: bean.beanName,
        fieldName: field,
        previousValue,
        nextValue,
        changedAt,
      });
    }
  }

  if (!changes.length) {
    redirect(`/beans/${bean.id}`);
  }

  await db
    .update(beanBags)
    .set({
      ...nextValues,
      updatedAt: changedAt,
    })
    .where(eq(beanBags.id, bean.id));

  await writeChangeLog(changes);

  revalidateBeanPaths(bean.id);
  redirect(`/beans/${bean.id}`);
}

export async function updateGrinder(
  grinderId: number,
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const grinder = await db.query.grinders.findFirst({
    where: eq(grinders.id, grinderId),
  });

  if (!grinder) {
    return { error: "Grinder not found." };
  }

  const parsed = grinderSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid grinder name." };
  }

  const existing = await db.query.grinders.findFirst({
    where: and(eq(grinders.name, parsed.data.name), ne(grinders.id, grinder.id)),
  });

  if (existing) {
    return { error: "That grinder already exists." };
  }

  if (grinder.name === parsed.data.name) {
    redirect("/grinders/new");
  }

  const changedAt = new Date();
  const affectedSettings = await db.query.grindSettings.findMany({
    where: eq(grindSettings.grinderId, grinder.id),
  });

  await db
    .update(grinders)
    .set({
      name: parsed.data.name,
      updatedAt: changedAt,
    })
    .where(eq(grinders.id, grinder.id));

  await db
    .update(grindSettings)
    .set({
      grinderName: parsed.data.name,
      updatedAt: changedAt,
    })
    .where(eq(grindSettings.grinderId, grinder.id));

  await writeChangeLog([
    {
      entityType: "grinder",
      entityId: grinder.id,
      grinderId: grinder.id,
      entityName: grinder.name,
      fieldName: "name",
      previousValue: grinder.name,
      nextValue: parsed.data.name,
      changedAt,
    },
    ...affectedSettings.map((setting) => ({
      entityType: "grind_setting" as const,
      entityId: setting.id,
      beanBagId: setting.beanBagId,
      grinderId: grinder.id,
      entityName: setting.grinderName,
      fieldName: "grinderName",
      previousValue: setting.grinderName,
      nextValue: parsed.data.name,
      changedAt,
    })),
  ]);

  affectedSettings.forEach((setting) => revalidateBeanPaths(setting.beanBagId));
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/grinders");
  revalidatePath("/grinders/new");
  revalidatePath(`/grinders/${grinder.id}/edit`);
  redirect("/grinders/new");
}

export async function updateGrindSetting(
  grindSettingId: number,
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const setting = await db.query.grindSettings.findFirst({
    where: eq(grindSettings.id, grindSettingId),
  });

  if (!setting) {
    return { error: "Grind setting not found." };
  }

  const parsed = grindSettingSchema.safeParse({
    beanBagId: formData.get("beanBagId"),
    grinderId: formData.get("grinderId"),
    settingValue: formData.get("settingValue"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid grind setting." };
  }

  const grinder = await db.query.grinders.findFirst({
    where: eq(grinders.id, parsed.data.grinderId),
  });

  if (!grinder) {
    return { error: "Select a saved grinder before updating the setting." };
  }

  const nextValues = {
    grinderId: grinder.id,
    grinderName: grinder.name,
    settingValue: parsed.data.settingValue,
    notes: parsed.data.notes || null,
  };
  const changedAt = new Date();
  const changes: ChangeEntry[] = [];
  const fields: Array<keyof typeof nextValues> = ["grinderName", "settingValue", "notes"];

  for (const field of fields) {
    const previousValue = normalizeValue(setting[field]);
    const nextValue = normalizeValue(nextValues[field]);

    if (previousValue !== nextValue) {
      changes.push({
        entityType: "grind_setting",
        entityId: setting.id,
        beanBagId: setting.beanBagId,
        grinderId: grinder.id,
        entityName: setting.grinderName,
        fieldName: field,
        previousValue,
        nextValue,
        changedAt,
      });
    }
  }

  if (!changes.length && setting.grinderId === grinder.id) {
    redirect(`/beans/${setting.beanBagId}`);
  }

  await db
    .update(grindSettings)
    .set({
      ...nextValues,
      updatedAt: changedAt,
    })
    .where(eq(grindSettings.id, setting.id));

  await writeChangeLog(changes);

  revalidateBeanPaths(setting.beanBagId);
  redirect(`/beans/${setting.beanBagId}`);
}
