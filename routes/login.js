import express from "express";
import bcrypt from "bcrypt";
import db from "../db.js";

const router = express.Router();

// Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" });
  }

  try {
    const client = await db.connect();

    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    client.release();

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "المستخدم غير موجود" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "كلمة المرور غير صحيحة" });
    }

    res.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح ✅",
      userId: user.id,
      email: user.email,
      mustChangePassword: user.must_change_password || false, // Adjusted column name
    });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// Add new account endpoint
router.post("/add-account", async (req, res) => {
  const { email, password, name, status } = req.body;

  if (!email || !password || !name || !status) {
    return res.status(400).json({
      error: "البريد الإلكتروني وكلمة المرور والاسم والحالة مطلوبة",
    });
  }

  try {
    const client = await db.connect();

    // Check if email already exists
    const checkResult = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (checkResult.rows.length > 0) {
      client.release();
      return res.status(409).json({ error: "البريد الإلكتروني موجود بالفعل" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const insertResult = await client.query(
      "INSERT INTO users (name, email, password, status, must_change_password) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [name, email, hashedPassword, status, true] // Set to true for new accounts
    );

    client.release();

    res.json({
      success: true,
      message: "تم إضافة الحساب بنجاح ✅",
      userId: insertResult.rows[0].id,
      email,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// ✅ Update account endpoint
router.post("/update-account", async (req, res) => {
  const { email, currentPassword, newPassword, name, status } = req.body;

  if (!email || !currentPassword || !name || !status) {
    return res.status(400).json({
      error: "البريد الإلكتروني وكلمة المرور الحالية والاسم والحالة مطلوبة",
    });
  }

  try {
    const client = await db.connect();

    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      client.release();
      return res.status(401).json({ error: "كلمة المرور الحالية غير صحيحة" });
    }

    let updateQuery = "UPDATE users SET name = $1, status = $2";
    let updateParams = [name, status];
    let paramIndex = 3;

    // ✅ إذا دخل newPassword كايتم تحديث المودباص
    if (newPassword && newPassword.trim() !== "") {
      if (newPassword.length < 6) {
        client.release();
        return res.status(400).json({
          error: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل",
        });
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

    res.json({
      success: true,
      message: "تم تحديث الحساب بنجاح ✅",
      email,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

export default router;
