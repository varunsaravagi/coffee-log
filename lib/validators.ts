import { z } from "zod";

export const beanBagSchema = z.object({
  brand: z.string().trim().min(1, "Brand is required."),
  beanName: z.string().trim().min(1, "Bean name is required."),
  logDate: z.string().trim().min(1, "Log date is required."),
  roastDate: z.string().trim().min(1, "Roast date is required."),
  flavorProfile: z.string().trim().min(1, "Flavor profile is required."),
  bagQuantityGrams: z.coerce
    .number()
    .int("Quantity must be a whole number.")
    .positive("Quantity must be greater than 0."),
  price: z.coerce.number().positive("Price must be greater than 0."),
});

export const grindSettingSchema = z.object({
  beanBagId: z.coerce.number().int().positive(),
  grinderId: z.coerce.number().int().positive(),
  settingValue: z.string().trim().min(1, "Setting is required."),
  notes: z.string().trim().max(500, "Notes are too long.").optional(),
});

export const grinderSchema = z.object({
  name: z.string().trim().min(1, "Grinder name is required."),
});
