import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// === Multer pour upload des logos ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/banks"); // dossier où enregistrer
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // max 2Mo
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return cb(new Error("Seuls PNG/JPG/JPEG sont acceptés"));
    }
    cb(null, true);
  },
});

// === GET toutes les banques ===
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM banks");
    res.json(rows);
  } catch (err) {
    console.error("Erreur GET /banks:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// === POST ajouter une banque ===
router.post("/", upload.single("logo"), async (req, res) => {
  try {
    const { nom, rib } = req.body;

    // Vérif RIB 24 chiffres
    if (!/^\d{24}$/.test(rib)) {
      return res
        .status(400)
        .json({ message: "Le RIB doit contenir 24 chiffres" });
    }

    const logo = req.file ? req.file.filename : null;

    const [result] = await db
      .promise()
      .query("INSERT INTO banks (nom, rib, logo) VALUES (?, ?, ?)", [
        nom,
        rib,
        logo,
      ]);

    res.json({ id: result.insertId, nom, rib, logo });
  } catch (err) {
    console.error("Erreur POST /banks:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// === PUT modifier une banque ===
router.put("/:id", upload.single("logo"), async (req, res) => {
  try {
    const { nom, rib } = req.body;
    const { id } = req.params;

    if (!/^\d{24}$/.test(rib)) {
      return res
        .status(400)
        .json({ message: "Le RIB doit contenir 24 chiffres" });
    }

    const logo = req.file ? req.file.filename : null;

    let sql = "UPDATE banks SET nom=?, rib=? ";
    let params = [nom, rib];

    if (logo) {
      sql += ", logo=?";
      params.push(logo);
    }
    sql += " WHERE id=?";
    params.push(id);

    await db.promise().query(sql, params);

    res.json({ id, nom, rib, logo });
  } catch (err) {
    console.error("Erreur PUT /banks:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// === DELETE supprimer une banque ===
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.promise().query("DELETE FROM banks WHERE id=?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Erreur DELETE /banks:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
