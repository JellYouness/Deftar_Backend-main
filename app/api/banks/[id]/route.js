// app/api/banks/[id]/route.js
import db from "../../../lib/db.js";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// === PUT modifier une banque ===
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const formData = await request.formData();
    const nom = formData.get("nom");
    const rib = formData.get("rib");
    const logo = formData.get("logo");

    if (!/^\d{24}$/.test(rib)) {
      return Response.json(
        { message: "Le RIB doit contenir 24 chiffres" },
        { status: 400 }
      );
    }

    let logoFilename = null;
    if (logo) {
      const bytes = await logo.arrayBuffer();
      const buffer = Buffer.from(bytes);
      logoFilename = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(logo.name)}`;
      const uploadDir = path.join(process.cwd(), "uploads", "banks");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, logoFilename), buffer);
    }

    const client = await db.connect();

    let sql = "UPDATE banks SET nom=$1, rib=$2";
    let params = [nom, rib];

    if (logoFilename) {
      sql += ", logo=$3";
      params.push(logoFilename);
    }
    sql += " WHERE id=$" + (params.length + 1);
    params.push(id);

    await client.query(sql, params);
    client.release();

    return Response.json({ id, nom, rib, logo: logoFilename });
  } catch (err) {
    console.error("Erreur PUT /banks:", err);
    return Response.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

// === DELETE supprimer une banque ===
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const client = await db.connect();
    await client.query("DELETE FROM banks WHERE id=$1", [id]);
    client.release();

    return Response.json({ success: true });
  } catch (err) {
    console.error("Erreur DELETE /banks:", err);
    return Response.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
