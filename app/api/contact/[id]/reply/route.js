// app/api/contact/[id]/reply/route.js
import db from "../../../../lib/db.js";

// API REPLY TO CONTACT
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { admin_id } = await request.json();

    // Validation de l'ID
    if (!id || isNaN(id)) {
      return Response.json(
        {
          error: "ID de message invalide",
        },
        { status: 400 }
      );
    }

    // Validation de l'admin_id
    if (!admin_id) {
      return Response.json(
        {
          error: "ID administrateur requis",
        },
        { status: 400 }
      );
    }

    const client = await db.connect();

    const sql =
      "UPDATE contact SET status = 'answered', reply_date = NOW(), admin_id = $1 WHERE id = $2";

    const result = await client.query(sql, [admin_id, id]);
    client.release();

    if (result.rowCount === 0) {
      return Response.json(
        {
          error: "Message non trouvé",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Message marqué comme répondu",
      affectedRows: result.rowCount,
    });
  } catch (err) {
    console.error("Erreur mise à jour contact:", err);
    return Response.json(
      {
        error: "Erreur mise à jour du message",
      },
      { status: 500 }
    );
  }
}
