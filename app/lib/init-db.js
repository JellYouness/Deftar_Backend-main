// app/lib/init-db.js
import bcrypt from "bcrypt";
import db from "./db.js";

export async function createInitialUser() {
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
}
