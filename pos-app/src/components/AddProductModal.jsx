import React, { useState } from "react";
import axios from "axios";
import "../styles/AddProductModal.css"; // İsteğe bağlı stil dosyası

const AddProductModal = ({ onClose, onProductAdded }) => {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/products", {
        name,
        stock,
        price,
        category,
      });
      onProductAdded(); // Ürün eklendikten sonra listeyi yenile
      onClose(); // Modalı kapat
    } catch (err) {
      console.error("Ürün eklenemedi:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Ürün Ekle</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ürün Adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Stok Adedi"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Birim Fiyatı"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <button type="submit" style={{width:"120px", height:"50px", marginLeft:"20px"}}>Kaydet</button>
          <button style={{width:"120px", height:"50px"}} type="button" onClick={onClose} className="close-btn">
            İptal
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
