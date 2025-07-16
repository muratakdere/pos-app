import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../styles/Reports.css";
import { toast } from "react-toastify";

const Reports = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/sales")
      .then((res) => {
        const today = new Date();
        const todayString = today.toISOString().split("T")[0];
        const todaysSales = res.data.filter((sale) => {
          const saleDate = new Date(sale.date).toISOString().split("T")[0];
          return saleDate === todayString;
        });

        setSales(todaysSales);
      })
      .catch((err) => console.error("Satış verisi alınamadı:", err));
  }, []);

  // Toplam satış adedi
  const totalSales = sales.reduce((acc, sale) => acc + sale.amount, 0);

  // Toplam gelir
  const totalRevenue = sales.reduce(
    (acc, sale) => acc + parseFloat(sale.total),
    0
  );

  // Ürün bazında satış adetlerini gruplama ve array yapma
  const salesByProductData = Object.entries(
    sales.reduce((acc, sale) => {
      acc[sale.product_name] = (acc[sale.product_name] || 0) + sale.amount;
      return acc;
    }, {})
  ).map(([product, amount]) => ({ product, amount }));

  const handleCloseDay = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/reports/close-day");
      toast.success(
        `Gün Sonu Kaydedildi! Toplam Satış: ${
          res.data.total_sales
        } | Gelir: ${Number(res.data.total_revenue).toFixed(2)} ₺`
      );
    } catch (err) {
      console.error(err);
      toast.error("Gün sonu raporu kaydedilemedi!");
    }
  };

  return (
    <div className="reports-page">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Bugünün Satış Raporları</h2>
        <button
          style={{
            width: "150px",
            background: "#4a90e2",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
          onClick={handleCloseDay}
        >
          Gün Sonu
        </button>
      </div>
      <p>Toplam Satış Adedi: {totalSales}</p>
      <p>Toplam Gelir: {totalRevenue.toFixed(2)} ₺</p>
      <h3>Ürün Bazında Satışlar</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={salesByProductData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="product" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#357ABD" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Reports;
