// routes/dashRoutes.js
import express from "express";
import db from "../db.js";

const router = express.Router();

// --- Statistiques des commandes par statut ---
router.get("/status", async (req, res) => {
  try {
    // Utilisation de .promise() pour rendre query compatible avec async/await
    const [rows] = await db
      .promise()
      .query(
        "SELECT statut_commande AS name, COUNT(*) AS value FROM commandes GROUP BY statut_commande"
      );
    res.json({ data: rows });
  } catch (err) {
    console.error("Erreur /status:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// --- Statistiques des commandes par matière ---
router.get("/matiere", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT matiere AS name, COUNT(*) AS value FROM commandes GROUP BY matiere"
      );
    res.json({ data: rows });
  } catch (err) {
    console.error("Erreur /matiere:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
