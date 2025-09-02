// app/api/uploads/[...path]/route.js
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request, { params }) {
  try {
    const filePath = path.join(process.cwd(), "uploads", ...params.path);

    const fileBuffer = await readFile(filePath);

    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    let contentType = "application/octet-stream";

    if (ext === ".pdf") {
      contentType = "application/pdf";
    } else if ([".jpg", ".jpeg"].includes(ext)) {
      contentType = "image/jpeg";
    } else if (ext === ".png") {
      contentType = "image/png";
    } else if (ext === ".webp") {
      contentType = "image/webp";
    }

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    return Response.json({ error: "File not found" }, { status: 404 });
  }
}
