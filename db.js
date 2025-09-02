// db.js
import pkg from "pg";
const { Pool } = pkg;

// Create a connection pool using DATABASE_URL from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Erreur connexion PostgreSQL:", err);
    return;
  }
  console.log("✅ Connecté à PostgreSQL");
  release();
});

export default pool;
