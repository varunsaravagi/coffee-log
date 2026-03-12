import path from "node:path";
import { readFile } from "node:fs/promises";

import { NextResponse } from "next/server";

import { uploadsDir } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileName: string }> },
) {
  const { fileName } = await params;
  const filePath = path.join(uploadsDir, fileName);

  try {
    const file = await readFile(filePath);
    const extension = path.extname(fileName).toLowerCase();
    const contentType =
      extension === ".png"
        ? "image/png"
        : extension === ".webp"
          ? "image/webp"
          : extension === ".heic"
            ? "image/heic"
            : extension === ".heif"
              ? "image/heif"
              : "image/jpeg";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

