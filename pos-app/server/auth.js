// server/auth.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");
const util = require("util");
// KAYIT OL
router.post("/register", async (req, res) => {
  console.log("POST /register geldi");
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Boş alan bırakmayın." });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    // promisify YOK! -> mysql2 promise desteği zaten var.
    const [result] = await db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashed]
    );

    return res.status(200).json({ message: "Kullanıcı kaydedildi." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Kayıt sırasında hata." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const sql = "SELECT * FROM users WHERE username = ?";
    const [results] = await db.query(sql, [username]);

    if (results.length === 0) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı." });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password); // async karşılaştırma

    if (!match) {
      return res.status(400).json({ message: "Şifre yanlış." });
    }

    const token = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "2h" });

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Sunucu hatası." });
  }
});

// GÜN SONU KAPANIŞ RAPORU
router.post("/close-day", async (req, res) => {
  try {
    // Genel toplam satış ve gelir
    const [totals] = await db.query(`
      SELECT 
        IFNULL(SUM(amount), 0) AS total_sales, 
        IFNULL(SUM(total), 0) AS total_revenue,
        IFNULL(SUM(cash_amount), 0) AS cash_revenue,
        IFNULL(SUM(card_amount), 0) AS card_revenue
      FROM sales
      WHERE DATE(date) = CURDATE()
    `);

    const { total_sales, total_revenue, cash_revenue, card_revenue } = totals[0];

    

    // Günlük raporu kaydet veya güncelle (gerekirse tablonuza cash ve card sütunları da ekleyin)
    await db.query(`
      INSERT INTO daily_reports (report_date, total_sales, total_revenue, cash_revenue, card_revenue)
      VALUES (CURDATE(), ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        total_sales = VALUES(total_sales), 
        total_revenue = VALUES(total_revenue),
        cash_revenue = VALUES(cash_revenue),
        card_revenue = VALUES(card_revenue)
    `, [total_sales, total_revenue, cash_revenue, card_revenue]);

    res.json({
      message: "Gün sonu raporu kaydedildi.",
      total_sales,
      total_revenue,
      cash_revenue,
      card_revenue
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gün sonu raporu kaydedilemedi." });
  }
});

module.exports = router;
