// app/lib/db.js
import pkg from "pg";
const { Pool } = pkg;

const { DATABASE_URL } = process.env;

// Basic validation + safe diagnostics to avoid leaking secrets
if (!DATABASE_URL) {
  console.error(
    "❌ DATABASE_URL is missing. Set it in your environment (.env.local or hosting env)."
  );
}

let connectionString = DATABASE_URL;
try {
  const u = new URL(DATABASE_URL || "");
  // Log only safe parts
  console.log(
    `🔗 Using database: host=${u.hostname}, db=${u.pathname?.replace(
      /^\//,
      ""
    )}`
  );
} catch (e) {
  console.warn(
    "⚠️ DATABASE_URL is not a valid URL. Current value:",
    DATABASE_URL
  );
}

// Create a connection pool using DATABASE_URL from environment variables
const pool = new Pool({
  connectionString,
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
