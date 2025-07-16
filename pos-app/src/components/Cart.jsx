import React from "react";
import "../styles/Cart.css";

const Cart = ({ cartItems, removeFromCart, updateQuantity, updatePrice }) => {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart">
      <h2>Toplam: {total.toFixed(2)} ₺</h2>
      {cartItems.length === 0 ? (
        <p>Sepet boş</p>
      ) : (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index} className="cart-item">
              <span style={{ flex: 1 }}>{item.name}</span>
              <input
                type="number"
                value={item.price}
                step="0.01"
                min="0"
                style={{ width: "50px" }}
                onChange={(e) => updatePrice(index, parseFloat(e.target.value))}
              />
              <span> x </span>
              {/* Adet input */}
              <input
                type="number"
                value={item.quantity}
                min="1"
                style={{ width: "40px" }}
                onChange={(e) =>
                  updateQuantity(index, parseInt(e.target.value, 10))
                }
              />
              <span style={{ marginLeft: "8px", fontWeight: "bold" }}>
                = {(item.price * item.quantity).toFixed(2)} ₺
              </span>

              <button onClick={() => removeFromCart(index)}>Sil</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
