// app/api/login/route.js
import bcrypt from "bcrypt";
import db from "../../lib/db.js";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    const client = await db.connect();

    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    client.release();

    if (result.rows.length === 0) {
      return Response.json({ error: "المستخدم غير موجود" }, { status: 401 });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
    }

    return Response.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح ✅",
      userId: user.id,
      email: user.email,
      mustChangePassword: user.must_change_password || false,
    });
  } catch (err) {
    console.error("Database error:", err);
    return Response.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
