// app/api/dash/matiere/route.js
import db from "../../../lib/db.js";

export async function GET() {
  try {
    const client = await db.connect();

    const result = await client.query(
      "SELECT matiere AS name, COUNT(*) AS value FROM commandes GROUP BY matiere"
    );

    client.release();

    return Response.json({ data: result.rows });
  } catch (err) {
    console.error("Erreur /matiere:", err);
    return Response.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
