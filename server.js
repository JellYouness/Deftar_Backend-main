import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import bcrypt from "bcrypt";
import db from "./db.js";

// Import routes
import loginRoutes from "./routes/login.js"; // Renamed for clarity
import contactRoutes from "./routes/contact.js";
import orderRoutes from "./routes/orders.js";
import mailRoutes from "./routes/email.js";
import dashRoutes from "./routes/dashRoutes.js";
import banksRoutes from "./routes/banksRoutes.js";
import modelsRoutes from "./routes/modelsRoutes.js";

// --------------------
// Config
// --------------------
dotenv.config();
const app = express();

// __dirname ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares - CORS disabled to allow anyone to use the API
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

// Additional headers for better API accessibility
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Vérif dossiers upload
const createUploadDirectories = () => {
  const dirs = [
    path.join(__dirname, "uploads/recu"),
    path.join(__dirname, "uploads/emploi_temps"),
    path.join(__dirname, "uploads/Models"),
    path.join(__dirname, "uploads/banks"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  console.log("✅ Répertoires upload vérifiés/créés");
};
createUploadDirectories();

// Servir fichiers uploadés
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", loginRoutes);
app.use("/api", contactRoutes);
app.use("/api", orderRoutes);
app.use("/api", mailRoutes);
app.use("/api/dash", dashRoutes);
app.use("/api", modelsRoutes);
app.use("/banks", banksRoutes);

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend connecté ✅" });
});

// Création utilisateur initial si inexistant
const createInitialUser = async () => {
  const initialUser = {
    name: "Abdessamad HNIOUA",
    email: "abdessamadhnioua@gmail.com",
    password: "D130115280",
    status: "admin",
  };

  try {
    const client = await db.connect();

    // Check if user exists
    const checkResult = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [initialUser.email]
    );

    if (checkResult.rows.length === 0) {
      try {
        const hash = await bcrypt.hash(initialUser.password, 10);
        const insertResult = await client.query(
          "INSERT INTO users (name, email, password, status, must_change_password) VALUES ($1, $2, $3, $4, $5) RETURNING id",
          [initialUser.name, initialUser.email, hash, initialUser.status, true]
        );
        console.log(
          "✅ Utilisateur initial créé avec ID:",
          insertResult.rows[0].id
        );
      } catch (hashError) {
        console.error("❌ Erreur hashage mot de passe:", hashError);
      }
    } else {
      console.log("✅ Utilisateur initial déjà existant");
    }

    client.release();
  } catch (err) {
    console.error("❌ Erreur vérification/création utilisateur:", err);
  }
};
createInitialUser();

// Lancer serveur
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "/";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Serveur backend démarré sur http://${HOST}:${PORT}`);
});
