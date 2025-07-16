import React from "react";
import "../styles/ProductList.css";
import AddProductModal from "./AddProductModal";

const ProductList = ({ products, addToCart, onAddProduct }) => {
  return (
    <div className="outer-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <h2>Ürünler</h2>
        <button
          onClick={onAddProduct}
          style={{
            width: "120px",
            background: "rgb(53, 122, 189)",
            border: "none",
            borderRadius: "5px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Ürün Ekle
        </button>
      </div>
      <div className="product-list">
        {products.map((product) => (
          <div
            key={product.id}
            className={`product-card ${
              product.stock === 0 ? "out-of-stock" : ""
            }`}
            onClick={() => product.stock > 0 && addToCart(product)} // Stoğu 0 ise tıklama engellenir
          >
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <h3>{product.name}</h3>
            <p>{product.price} ₺</p>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="low-stock-label">
                Stokta Son {product.stock}
              </span>
            )}
            {product.stock === 0 && (
              <span className="out-of-stock-label">Stokta Yok</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
