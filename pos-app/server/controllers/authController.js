const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  console.log("POST /register geldi");
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Boş alan bırakmayın." });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashed]
    );
    return res.status(200).json({ message: "Kullanıcı kaydedildi." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Kayıt sırasında hata." });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const sql = "SELECT * FROM users WHERE username = ?";
    const [results] = await db.query(sql, [username]);

    if (results.length === 0) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı." });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Şifre yanlış." });
    }

    const token = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "2h" });

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Sunucu hatası." });
  }
};


