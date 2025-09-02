// app/api/init/route.js
import { createInitialUser } from "../../lib/init-db.js";

export async function POST() {
  try {
    await createInitialUser();
    return Response.json({
      success: true,
      message: "Database initialized successfully",
    });
  } catch (error) {
    console.error("Error initializing database:", error);
    return Response.json(
      { error: "Failed to initialize database" },
      { status: 500 }
    );
  }
}
