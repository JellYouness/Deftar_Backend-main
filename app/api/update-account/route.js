// app/api/update-account/route.js
import bcrypt from "bcrypt";
import db from "../../lib/db.js";

export async function POST(request) {
  try {
    const { email, currentPassword, newPassword, name, status } =
      await request.json();

    if (!email || !currentPassword || !name || !status) {
      return Response.json(
        {
          error: "البريد الإلكتروني وكلمة المرور الحالية والاسم والحالة مطلوبة",
        },
        { status: 400 }
      );
    }

    const client = await db.connect();

    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      client.release();
      return Response.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      client.release();
      return Response.json(
        { error: "كلمة المرور الحالية غير صحيحة" },
        { status: 401 }
      );
    }

    let updateQuery = "UPDATE users SET name = $1, status = $2";
    let updateParams = [name, status];
    let paramIndex = 3;

    // ✅ إذا دخل newPassword كايتم تحديث المودباص
    if (newPassword && newPassword.trim() !== "") {
      if (newPassword.length < 6) {
        client.release();
        return Response.json(
          {
            error: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل",
          },
          { status: 400 }
        );
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      updateQuery += `, password = $${paramIndex}, must_change_password = $${
        paramIndex + 1
      }`;
      updateParams.push(hashedNewPassword, false);
      paramIndex += 2;
    }

    updateQuery += ` WHERE email = $${paramIndex}`;
    updateParams.push(email);

    await client.query(updateQuery, updateParams);
    client.release();

    return Response.json({
      success: true,
      message: "تم تحديث الحساب بنجاح ✅",
      email,
    });
  } catch (err) {
    console.error("Server error:", err);
    return Response.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
