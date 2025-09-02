// app/api/add-account/route.js
import bcrypt from "bcrypt";
import db from "../../lib/db.js";

export async function POST(request) {
  try {
    const { email, password, name, status } = await request.json();

    if (!email || !password || !name || !status) {
      return Response.json(
        {
          error: "البريد الإلكتروني وكلمة المرور والاسم والحالة مطلوبة",
        },
        { status: 400 }
      );
    }

    const client = await db.connect();

    // Check if email already exists
    const checkResult = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (checkResult.rows.length > 0) {
      client.release();
      return Response.json(
        { error: "البريد الإلكتروني موجود بالفعل" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const insertResult = await client.query(
      "INSERT INTO users (name, email, password, status, must_change_password) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [name, email, hashedPassword, status, true] // Set to true for new accounts
    );

    client.release();

    return Response.json({
      success: true,
      message: "تم إضافة الحساب بنجاح ✅",
      userId: insertResult.rows[0].id,
      email,
    });
  } catch (err) {
    console.error("Server error:", err);
    return Response.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
