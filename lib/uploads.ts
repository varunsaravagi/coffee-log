import path from "node:path";
import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";

import { uploadsDir } from "@/lib/db";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

export async function savePhoto(file: File | null) {
  if (!file || file.size === 0) {
    return null;
  }

  if (!allowedTypes.has(file.type)) {
    throw new Error("Upload a JPEG, PNG, WebP, or HEIC image.");
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image must be 8MB or smaller.");
  }

  const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const fileName = `${randomUUID()}.${extension}`;
  const filePath = path.join(uploadsDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}

