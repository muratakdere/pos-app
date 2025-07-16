const express = require('express');
const cors = require('cors');
const salesRoutes = require('./sales');
const db = require('./db');
const authRoutes = require('./auth');



const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/sales', salesRoutes);



const PORT = 5000;
app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));

app.get('/api/products', async (req, res) => {
  const { category } = req.query;

  try {
    if (category && category !== 'Tümü') {
      const [rows] = await db.query('SELECT * FROM products WHERE category = ?', [category]);
      res.json(rows);
    } else {
      const [rows] = await db.query('SELECT * FROM products');
      res.json(rows);
    }
  } catch (err) {
    console.error('Ürün listeleme hatası:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, stock, price, category } = req.body;

  if (!name || stock == null || price == null || !category) {
    return res.status(400).json({ message: 'Tüm alanları doldurun.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO products (name, stock, price, category) VALUES (?, ?, ?, ?)',
      [name, stock, price, category]
    );
    res.status(201).json({ message: 'Ürün eklendi.', productId: result.insertId });
  } catch (err) {
    console.error('Ürün ekleme hatası:', err);
    res.status(500).json({ message: 'Ürün eklenirken hata oluştu.' });
  }
});


