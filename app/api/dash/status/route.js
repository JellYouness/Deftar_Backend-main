// app/api/dash/status/route.js
import db from "../../../lib/db.js";

export async function GET() {
  try {
    const client = await db.connect();

    const result = await client.query(
      "SELECT statut_commande AS name, COUNT(*) AS value FROM commandes GROUP BY statut_commande"
    );

    client.release();

    return Response.json({ data: result.rows });
  } catch (err) {
    console.error("Erreur /status:", err);
    return Response.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
