// app/api/contact/route.js
import db from "../../lib/db.js";

// API CREATE CONTACT
export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Validation des champs requis
    if (!name || !email || !message) {
      return Response.json(
        {
          error: "Champs requis manquants: name, email, message",
        },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        {
          error: "Format d'email invalide",
        },
        { status: 400 }
      );
    }

    const client = await db.connect();

    const sql =
      "INSERT INTO contact (name, email, message, status, created_at) VALUES ($1, $2, $3, 'pas encore', NOW()) RETURNING id";

    const result = await client.query(sql, [name, email, message]);
    client.release();

    return Response.json({
      success: true,
      id: result.rows[0].id,
      message: "Message envoyé avec succès",
    });
  } catch (err) {
    console.error("Erreur insertion contact:", err);
    return Response.json(
      {
        error: "Erreur lors de l'enregistrement du message",
        details: err.message,
        code: err.code
      },
      { status: 500 }
    );
  }
}

// API GET CONTACTS
export async function GET() {
  try {
    const client = await db.connect();

    const sql = `
      SELECT 
        id,
        name,
        email,
        message,
        status,
        created_at,
        reply_date,
        admin_id
      FROM contact
      ORDER BY created_at DESC
    `;

    const result = await client.query(sql);
    client.release();

    return Response.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (err) {
    console.error("Erreur SELECT contact:", err);
    return Response.json(
      {
        error: "Erreur récupération messages",
        details: err.message,
        code: err.code
      },
      { status: 500 }
    );
  }
}
