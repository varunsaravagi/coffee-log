"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { beanBags, grinders, grindSettings } from "@/lib/schema";
import { savePhoto } from "@/lib/uploads";
import { beanBagSchema, grinderSchema, grindSettingSchema } from "@/lib/validators";

export type FormState = {
  error?: string;
};

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
  });

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/beans/${parsed.data.beanBagId}`);
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
  });

  revalidatePath("/");
  revalidatePath("/beans/new");
  revalidatePath("/beans");
  revalidatePath("/search");
  revalidatePath("/grinders/new");
  redirect("/");
}
