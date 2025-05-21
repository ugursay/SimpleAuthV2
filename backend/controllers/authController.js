import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { sendVerificaitionEmail } from "../utils/sendVerificaitionEmail.js";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email=? OR username=?",
      [email, username]
    );
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ message: "Bu kullanıcı adı veya email zaten kayıtlı" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (username, email, password) VALUES (?,?,?)",
      [username, email, hashedPassword]
    );

    const userId = result.insertId;

    const verificationToken = jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    await sendVerificaitionEmail(email, verificationToken);

    res.status(201).json({
      message:
        "Kullanıcı başarıyla oluşturuldu. Lütfen E-mail'inizi doğrulayın.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "sunucu hatası." });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email=?", [
      email,
    ]);

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Bu email ile kayıtlı kullanıcı bulunamadı." });
    }

    const user = rows[0];

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "lütfen önce emalinizi doğrulayın" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "şifre yanlış" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Giriş başarılı", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const [rows] = await db.execute(
      "SELECT isVerified FROM users WHERE email=?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Email bulunamadı." });
    }

    if (rows[0].isVerified) {
      return res.status(400).json({ message: "Email zaten doğrulanmış." });
    }

    await db.execute("UPDATE users SET isVerified = TRUE WHERE email=?", [
      email,
    ]);

    res.send(`
      <script>
        alert("Email başarıyla doğrulandı.");
        window.location.href = "http://localhost:3000/login";
      </script>
    `);
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "geçersiz veya süresi dolmuş token.",
      error: err.message,
    });
  }
};
