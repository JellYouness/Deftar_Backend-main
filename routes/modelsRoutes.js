// routes/modelsRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import db from "../db.js";

const router = express.Router();

// 📂 Config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join("uploads", "Models");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ➕ API Ajouter image
// ➕ API Ajouter image
router.post("/models", upload.single("file"), async (req, res) => {
  const { title, title_fr, description } = req.body;
  const filePath = req.file ? `/uploads/Models/${req.file.filename}` : null;

  if (!title || !title_fr || !filePath) {
    return res
      .status(400)
      .json({ error: "Titres (arabe et français) et fichier requis" });
  }

  try {
    const client = await db.connect();

    const sql =
      "INSERT INTO models_images (title, title_fr, description, file_path) VALUES ($1, $2, $3, $4) RETURNING id";
    const result = await client.query(sql, [
      title,
      title_fr,
      description,
      filePath,
    ]);

    client.release();

    res.json({ success: true, id: result.rows[0].id, filePath });
  } catch (err) {
    console.error("❌ Erreur insertion:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// 📜 API Lister images
router.get("/models", async (req, res) => {
  try {
    const client = await db.connect();

    const result = await client.query(
      "SELECT id, title, title_fr, description, file_path as filePath, created_at FROM models_images ORDER BY created_at DESC"
    );

    client.release();

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Erreur récupération:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// ❌ API Supprimer image
router.delete("/models/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const client = await db.connect();

    const result = await client.query(
      "SELECT file_path FROM models_images WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: "Image non trouvée" });
    }

    const filePath = path.join(".", result.rows[0].file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await client.query("DELETE FROM models_images WHERE id = $1", [id]);
    client.release();

    res.json({ success: true, message: "Image supprimée" });
  } catch (err) {
    console.error("❌ Erreur suppression:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
