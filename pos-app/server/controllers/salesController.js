const db = require("../config/db");

exports.getAllSales = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.id, s.amount, s.total, s.payment_method, s.date,
             p.name AS product_name
      FROM sales s
      JOIN products p ON s.product_id = p.id
      ORDER BY s.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSale = async (req, res) => {
  const {
    product_id,
    amount,
    total,
    payment_method,
    cash_amount,
    card_amount,
  } = req.body;
  console.log("Satış isteği geldi:", req.body);
  try {
    const [products] = await db.query("SELECT * FROM products WHERE id = ?", [
      product_id,
    ]);
    const product = products[0];
    if (!product) {
      console.log("Ürün bulunamadı:", product_id);
      return res.status(404).json({ error: "Ürün bulunamadı." });
    }
    // 2️⃣ Yeterli stok var mı?
    if (product.stock < amount) {
      console.log("Yetersiz stok:", product.stock, "İstenen:", amount);
      return res.status(400).json({ error: "Yeterli stok yok." });
    }
    // 3️⃣ Satışı kaydet
    const [result] = await db.query(
      "INSERT INTO sales (product_id, amount, total, payment_method, cash_amount, card_amount) VALUES (?, ?, ?, ?, ?, ?)",
      [product_id, amount, total, payment_method, cash_amount, card_amount]
    );
    // 4️⃣ Stoğu düşür
    await db.query("UPDATE products SET stock = stock - ? WHERE id = ?", [
      amount,
      product_id,
    ]);
    res.status(201).json({
      id: result.insertId,
      product_id,
      amount,
      total,
      payment_method,
      cash_amount,
      card_amount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
