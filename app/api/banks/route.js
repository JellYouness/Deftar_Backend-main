// app/api/banks/route.js
import db from "../../lib/db.js";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// === GET toutes les banques ===
export async function GET() {
  try {
    const client = await db.connect();
    const result = await client.query("SELECT * FROM banks");
    client.release();

    return Response.json(result.rows);
  } catch (err) {
    console.error("Erreur GET /banks:", err);
    return Response.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

// === POST ajouter une banque ===
export async function POST(request) {
  try {
    const formData = await request.formData();
    const nom = formData.get("nom");
    const rib = formData.get("rib");
    const logo = formData.get("logo");

    // Vérif RIB 24 chiffres
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
    const result = await client.query(
      "INSERT INTO banks (nom, rib, logo) VALUES ($1, $2, $3) RETURNING id",
      [nom, rib, logoFilename]
    );
    client.release();

    return Response.json({
      id: result.rows[0].id,
      nom,
      rib,
      logo: logoFilename,
    });
  } catch (err) {
    console.error("Erreur POST /banks:", err);
    return Response.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
