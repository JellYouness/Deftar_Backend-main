// app/api/models/route.js
import db from "../../lib/db.js";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

// ➕ API Ajouter image
export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const title_fr = formData.get("title_fr");
    const description = formData.get("description");
    const file = formData.get("file");

    if (!title || !title_fr || !file) {
      return Response.json(
        { error: "Titres (arabe et français) et fichier requis" },
        { status: 400 }
      );
    }

    // Handle file upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "uploads", "Models");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    const filePath = `/uploads/Models/${filename}`;

    const client = await db.connect();

    const sql =
      "INSERT INTO models_images (title, title_fr, description, file_path) VALUES ($1, $2, $3, $4) RETURNING id";
    const result = await client.query(sql, [
      title,
      title_fr,
      description,
      filePath,
    ]);

    client.release();

    return Response.json({ success: true, id: result.rows[0].id, filePath });
  } catch (err) {
    console.error("❌ Erreur insertion:", err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 📜 API Lister images
export async function GET() {
  try {
    const client = await db.connect();

    const result = await client.query(
      "SELECT id, title, title_fr, description, file_path as filePath, created_at FROM models_images ORDER BY created_at DESC"
    );

    client.release();

    return Response.json(result.rows);
  } catch (err) {
    console.error("❌ Erreur récupération:", err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
