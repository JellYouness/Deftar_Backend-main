import express from "express";
import db from "../db.js";

const router = express.Router();

// API CREATE CONTACT
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Validation des champs requis
  if (!name || !email || !message) {
    return res.status(400).json({
      error: "Champs requis manquants: name, email, message",
    });
  }

  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Format d'email invalide",
    });
  }

  try {
    const client = await db.connect();

    const sql =
      "INSERT INTO contact (name, email, message, status, created_at) VALUES ($1, $2, $3, 'pas encore', NOW()) RETURNING id";

    const result = await client.query(sql, [name, email, message]);
    client.release();

    res.json({
      success: true,
      id: result.rows[0].id,
      message: "Message envoyé avec succès",
    });
  } catch (err) {
    console.error("Erreur insertion contact:", err);
    return res.status(500).json({
      error: "Erreur lors de l'enregistrement du message",
    });
  }
});

// API GET CONTACTS
router.get("/contact", async (req, res) => {
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

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (err) {
    console.error("Erreur SELECT contact:", err);
    return res.status(500).json({
      error: "Erreur récupération messages",
    });
  }
});

// API REPLY TO CONTACT
router.put("/contact/:id/reply", async (req, res) => {
  const { id } = req.params;
  const { admin_id } = req.body;

  // Validation de l'ID
  if (!id || isNaN(id)) {
    return res.status(400).json({
      error: "ID de message invalide",
    });
  }

  // Validation de l'admin_id
  if (!admin_id) {
    return res.status(400).json({
      error: "ID administrateur requis",
    });
  }

  try {
    const client = await db.connect();

    const sql =
      "UPDATE contact SET status = 'answered', reply_date = NOW(), admin_id = $1 WHERE id = $2";

    const result = await client.query(sql, [admin_id, id]);
    client.release();

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Message non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Message marqué comme répondu",
      affectedRows: result.rowCount,
    });
  } catch (err) {
    console.error("Erreur mise à jour contact:", err);
    return res.status(500).json({
      error: "Erreur mise à jour du message",
    });
  }
});

export default router;
