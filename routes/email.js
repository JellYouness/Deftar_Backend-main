import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import db from "../db.js"; // ✅ connexion MySQL callback

dotenv.config();

const router = express.Router();
const upload = multer(); // stockage mémoire

// === Config Nodemailer ===
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// === Fonction utilitaire pour envoyer email ===
const sendMail = async ({ to, subject, text, file }) => {
  try {
    const mailOptions = {
      from: `"Plateforme Taalim Work" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `<div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.5;">
               ${text.replace(/\n/g, "<br>")}
             </div>`,
      attachments: file
        ? [
            {
              filename: file.originalname,
              content: file.buffer,
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du mail :", error);
    return { success: false, error };
  }
};

// === Fonction utilitaire pour query PostgreSQL ===
const queryAsync = async (sql, params) => {
  const client = await db.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
};

// === Route Express ===
router.post("/send-mail", upload.single("pdf"), async (req, res) => {
  const { subject, message, teacherEmail, commandeId, messageType } = req.body;

  try {
    // 1️⃣ Envoi du mail
    const result = await sendMail({
      to: teacherEmail,
      subject,
      text: message,
      file: req.file,
    });

    if (!result.success) {
      return res
        .status(500)
        .json({ success: false, error: result.error || "Échec envoi mail" });
    }

    // 2️⃣ Déterminer le nouveau statut
    let newStatus = "en cours";
    switch (messageType) {
      case "completion":
        newStatus = "complété";
        break;
      case "delay":
        newStatus = "en retard";
        break;
      case "rejection":
        newStatus = "refusé";
        break;
      case "payment":
        newStatus = "payé";
        break;
    }

    // 3️⃣ Mise à jour en BDD
    if (commandeId) {
      await queryAsync(
        "UPDATE commandes SET statut_commande = $1 WHERE id = $2",
        [newStatus, commandeId]
      );
      console.log(`📌 Statut commande #${commandeId} mis à jour: ${newStatus}`);
    }

    // 4️⃣ Réponse
    res.json({
      success: true,
      message: "✅ Email envoyé et statut mis à jour",
      statut: newStatus,
    });
  } catch (error) {
    console.error("❌ Erreur route send-mail:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
