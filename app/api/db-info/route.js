// app/api/db-info/route.js
import db from "../../lib/db.js";

export async function GET() {
  try {
    const client = await db.connect();

    const [
      { rows: verRows },
      { rows: idRows },
      { rows: pathRows },
      { rows: tablesRows },
    ] = await Promise.all([
      client.query("select version();"),
      client.query("select current_database() as db, current_user as user;"),
      client.query("SHOW search_path;"),
      client.query(`
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_type = 'BASE TABLE'
        ORDER BY table_schema, table_name
      `),
    ]);

    client.release();

    return Response.json({
      success: true,
      version: verRows[0]?.version,
      database: idRows[0]?.db,
      user: idRows[0]?.user,
      search_path: pathRows[0]?.search_path,
      tables: tablesRows,
    });
  } catch (error) {
    console.error("/api/db-info error:", error);
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
