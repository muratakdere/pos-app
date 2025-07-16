const db = require('../config/db');

exports.closeDay = async (req, res) => {
  try {
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
      card_revenue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gün sonu raporu kaydedilemedi." });
  }
};
