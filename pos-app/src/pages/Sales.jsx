import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Sales.css';

const Sales = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/sales')
      .then(res => {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0]; // "YYYY-MM-DD"

      const todaysSales = res.data.filter(sale => {
        const saleDate = new Date(sale.date).toISOString().split('T')[0];
        return saleDate === todayString;
      });
      setSales(todaysSales);
    })
     .catch(err => console.error('Satışlar alınamadı:', err));
  }, []);

  return (
    <div className="sales-page">
      <h2>Günlük Satışlar</h2>
      <table>
        <thead>
          <tr>
            <th>Ürün</th>
            <th>Adet</th>
            <th>Toplam Tutar</th>
            
            <th>Tarih</th>
          </tr>
        </thead>
        <tbody>
          {sales.length > 0 ? (
            sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.product_name}</td>
                <td>{sale.amount}</td>
                <td>{sale.total} ₺</td>
                
                <td>{new Date(sale.date).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Satış bulunamadı.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Sales;


