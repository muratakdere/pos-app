const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
  const { category } = req.query;

  try {
    let rows;
    if (category && category !== "Tümü") {
      [rows] = await db.query("SELECT * FROM products WHERE category = ?", [category]);
    } else {
      [rows] = await db.query("SELECT * FROM products");
    }
    res.json(rows);
  } catch (err) {
    console.error("Ürün listeleme hatası:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  const { name, stock, price, category } = req.body;

  if (!name || stock == null || price == null || !category) {
    return res.status(400).json({ message: "Tüm alanları doldurun." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO products (name, stock, price, category) VALUES (?, ?, ?, ?)",
      [name, stock, price, category]
    );
    res.status(201).json({ message: "Ürün eklendi.", productId: result.insertId });
  } catch (err) {
    console.error("Ürün ekleme hatası:", err);
    res.status(500).json({ message: "Ürün eklenirken hata oluştu." });
  }
};
