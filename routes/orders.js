// Corrected Backend: routes/orders.js
// Added type_carnet, banque_choisie, rib_choisi, montant to extraction and INSERT.
// Added validations for required fields, custom type, files.
// Updated fileFilter to enforce PDF for recu and images for emploi_temps.
// Changed numero_commande to use underscore for consistency.

import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import db from "../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Config Multer pour les uploads
const recuDir = path.join(__dirname, "../uploads/recu");
const emploiDir = path.join(__dirname, "../uploads/emploi_temps");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "recu") {
      cb(null, recuDir);
    } else if (file.fieldname === "emploi_temps") {
      cb(null, emploiDir);
    } else {
      cb(new Error("Champ fichier invalide"), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "recu") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Le reçu doit être un fichier PDF"), false);
      }
    } else if (file.fieldname === "emploi_temps") {
      const allowedTypes = /jpeg|jpg|png|webp/;
      const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = allowedTypes.test(file.mimetype);
      if (mimetype && extname) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "L'emploi du temps doit être une image (jpeg, jpg, png, webp)"
          ),
          false
        );
      }
    } else {
      cb(new Error("Champ fichier invalide"), false);
    }
  },
});

// API CREATE ORDER
router.post(
  "/orders",
  upload.fields([
    { name: "recu", maxCount: 1 },
    { name: "emploi_temps", maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      type_carnet,
      nom_arabe,
      nom_francais,
      email,
      telephone,
      direction_provinciale,
      etablissement,
      region,
      matiere,
      cycle,
      date_commande,
      statut_commande,
      numero_commande,
      methode_paiement,
      banque_choisie,
      rib_choisi,
      montant,
    } = req.body;

    // Validation des champs requis
    if (!nom_arabe || !email || !telephone || !matiere) {
      return res.status(400).json({
        error: "Champs requis manquants: nom_arabe, email, telephone, matiere",
      });
    }

    if (methode_paiement === "virement" && (!banque_choisie || !rib_choisi)) {
      return res.status(400).json({
        error: "Banque choisie et RIB requis pour le virement",
      });
    }

    if (!req.files["recu"]) {
      return res.status(400).json({
        error: "Reçu de paiement requis",
      });
    }

    const isCustom = type_carnet === "custom";
    if (isCustom && !req.files["emploi_temps"]) {
      return res.status(400).json({
        error: "Emploi du temps requis pour le type personnalisé",
      });
    }

    const emploi_temps_url = req.files["emploi_temps"]
      ? `/uploads/emploi_temps/${req.files["emploi_temps"][0].filename}`
      : null;
    const recu_url = req.files["recu"]
      ? `/uploads/recu/${req.files["recu"][0].filename}`
      : null;

    const parsedMontant = parseFloat(montant) || (isCustom ? 50.0 : 30.0);

    const sql = `
    INSERT INTO commandes 
    (type_carnet, nom_arabe, nom_francais, email, telephone, direction_provinciale, etablissement, region, matiere, cycle, emploi_temps_url, date_commande, statut_commande, numero_commande, methode_paiement, banque_choisie, rib_choisi, recu_url, montant) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    RETURNING id
  `;

    try {
      const client = await db.connect();

      const result = await client.query(sql, [
        type_carnet || "standard",
        nom_arabe,
        nom_francais || null,
        email,
        telephone,
        direction_provinciale || null,
        etablissement || null,
        region || null,
        matiere,
        cycle || null,
        emploi_temps_url,
        date_commande ||
          new Date().toISOString().slice(0, 19).replace("T", " "),
        statut_commande || "en_attente",
        numero_commande || `CMD_${Date.now()}`,
        methode_paiement || null,
        banque_choisie || null,
        rib_choisi || null,
        recu_url,
        parsedMontant,
      ]);

      client.release();

      res.json({
        success: true,
        id: result.rows[0].id,
        emploi_temps_url,
        numero_commande,
        recu_url,
        message: "Commande créée avec succès",
      });
    } catch (err) {
      console.error("Erreur insertion commande:", err);
      return res.status(500).json({
        error: "Erreur lors de l'enregistrement de la commande",
      });
    }
  }
);

// API GET ORDERS
router.get("/orders", async (req, res) => {
  try {
    const client = await db.connect();

    const sql = `
      SELECT 
        id,
        type_carnet AS typeCarnet,
        numero_commande AS orderNumber,
        nom_arabe AS teacherName,
        email,
        telephone AS phone,
        matiere AS subject,
        cycle AS level,
        region,
        statut_commande AS status,
        date_commande AS orderDate,
        methode_paiement,
        banque_choisie,
        rib_choisi,
        recu_url,
        emploi_temps_url,
        direction_provinciale,
        etablissement,
        nom_francais,
        montant
      FROM commandes
      ORDER BY date_commande DESC
    `;

    const result = await client.query(sql);
    client.release();

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (err) {
    console.error("Erreur SELECT commandes:", err);
    return res.status(500).json({
      error: "Erreur récupération commandes",
    });
  }
});

export default router;
