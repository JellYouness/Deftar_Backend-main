// app/api/models/[id]/route.js
import db from "../../../lib/db.js";
import { unlink } from "fs/promises";
import path from "path";

// ❌ API Supprimer image
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const client = await db.connect();

    const result = await client.query(
      "SELECT file_path FROM models_images WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      client.release();
      return Response.json({ error: "Image non trouvée" }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), result.rows[0].file_path);
    try {
      await unlink(filePath);
    } catch (fileError) {
      console.warn("File not found for deletion:", filePath);
    }

    await client.query("DELETE FROM models_images WHERE id = $1", [id]);
    client.release();

    return Response.json({ success: true, message: "Image supprimée" });
  } catch (err) {
    console.error("❌ Erreur suppression:", err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
