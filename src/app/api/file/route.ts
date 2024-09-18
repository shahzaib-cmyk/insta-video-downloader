import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { apiClient } from "@/lib/api-client";

// Route handler for GET requests to serve images
export async function GET(request: NextRequest) {
  const filename = new URL(request.url).searchParams.get("name");

  console.log({ filename });
  if (filename === undefined || filename === null)
    return NextResponse.json({ error: "Image not found" }, { status: 404 });

  try {
    const imagePath = path.join(process.cwd(), "media", filename);
    const image = await fs.readFile(imagePath);

    // Get the file extension to determine the content type
    const ext = path.extname(filename).toLowerCase();
    let contentType = "image/jpeg"; // default to jpeg

    if (ext === ".png") contentType = "image/png";
    if (ext === ".gif") contentType = "image/gif";
    if (ext === ".webp") contentType = "image/webp";

    return new NextResponse(image, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    // If the image is not found or any error occurs, return a 404
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
