// Test database connection
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

async function testConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log("🔌 Testing connection to Neon database...");
    const client = await pool.connect();
    console.log("✅ Successfully connected to Neon PostgreSQL!");
    
    // Test a simple query
    const result = await client.query("SELECT NOW() as current_time");
    console.log("⏰ Current database time:", result.rows[0].current_time);
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log("📋 Available tables:", tablesResult.rows.map(row => row.table_name));
    
    client.release();
    await pool.end();
    
    console.log("✅ Database connection test completed successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();
