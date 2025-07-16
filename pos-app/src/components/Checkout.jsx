import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Checkout.css";
import { toast } from "react-toastify";

const Checkout = ({ cartItems, clearCart, fetchProducts }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState("");
  const [change, setChange] = useState(null);
  const [isPartialModalOpen, setIsPartialModalOpen] = useState(false);
  const [partialCash, setPartialCash] = useState();
  const [partialCard, setPartialCard] = useState();

  // Toplamı hesapla
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayment = async (method) => {
    if (total === 0) {
      toast.error("Sepet boş, ödeme yapılamaz!");
      return; // Fonksiyonu burada sonlandır
    }
    let cashAmount = 0;
    let cardAmount = 0;

    if (method === "nakit") {
      cashAmount = total;
    } else if (method === "kart") {
      cardAmount = total;
    }
    try {
      for (const item of cartItems) {
        const itemTotal = item.price * item.quantity;
        await axios.post("http://localhost:5000/api/sales", {
          product_id: item.id, // ürün adı
          amount: item.quantity, // miktar
          total: itemTotal, // toplam tutar
          payment_method: method,
          cash_amount: itemTotal * (cashAmount / total),
          card_amount: itemTotal * (cardAmount / total),
        });
      }
      toast.success(`Ödeme başarıyla alındı! Yöntem: ${method}`);

      clearCart();
      setIsChangeModalOpen(false);
      setReceivedAmount("");
      setChange(null);
      fetchProducts();
    } catch (err) {
      console.error("Satış kaydedilemedi:", err);
      toast.error("Satış kaydedilemedi!");
    }
  };

  const handlePartialPayment = async () => {
    if (total === 0) {
      toast.error("Sepet boş, ödeme yapılamaz!");
      return; // Fonksiyonu burada sonlandır
    }

    if (partialCash + partialCard !== total) {
      toast.error("Nakit + Kart toplamı, toplam tutara eşit olmalı!");
      return;
    }

    try {
      for (const item of cartItems) {
        const itemTotal = item.price * item.quantity;
        // Nakit varsa

        await axios.post("http://localhost:5000/api/sales", {
          product_id: item.id,
          amount: item.quantity,
          total: itemTotal,
          payment_method: "parcali",
          cash_amount: itemTotal * (partialCash / total),
          card_amount: itemTotal * (partialCard / total),
        });
      }
      toast.success("Parçalı ödeme başarıyla kaydedildi!");

      clearCart();
      setIsPartialModalOpen(false);
      setPartialCash(0);
      setPartialCard(0);
      fetchProducts();
    } catch (err) {
      console.error("Parçalı ödeme kaydedilemedi:", err);
      toast.error("Parçalı ödeme kaydedilemedi!");
    }
  };

  const openChangeModal = () => {
    if (total === 0) {
      toast.error("Sepet boş, ödeme yapılamaz!");
      return;
    }
    setPaymentMethod("nakit");
    setIsChangeModalOpen(true);
  };

  // Numpad tuşlama
  const handleNumpadClick = (value) => {
    if (value === "C") {
      setReceivedAmount("");
      setChange(null);
    } else if (value === ".") {
      if (!receivedAmount.includes(".")) {
        setReceivedAmount(receivedAmount + ".");
      }
    } else {
      const newAmount = receivedAmount + value;
      setReceivedAmount(newAmount);
    }
  };

  useEffect(() => {
    const received = parseFloat(receivedAmount);
    if (!isNaN(received) && received >= total) {
      setChange(received - total);
    } else {
      setChange(null);
    }
  }, [receivedAmount, total]);

  return (
    <div className="checkout">
      <h2>Ödeme</h2>
      {/* <p>Toplam Tutar: {total.toFixed(2)} ₺</p> */}

      <div className="payment-methods">
        <div style={{ display: "flex" }}>
          <button onClick={openChangeModal}>Nakit</button>
          <br /> <br />
          <button
            onClick={() => {
              handlePayment("kart");
              setPaymentMethod("kart");
            }}
          >
            Kart
          </button>
        </div>
        <div style={{ marginRight: "60px" }}>
          <button
            onClick={() => setIsPartialModalOpen(true)}
            style={{ width: "195px" }}
          >
            Parçalı Ödeme
          </button>
        </div>
        <div style={{ marginRight: "60px" }}>
          <button
            className="clear-btn"
            onClick={() => {
              clearCart();
              setIsChangeModalOpen(false);
              setReceivedAmount("");
              setChange(null);
            }}
            style={{ marginTop: "20px", marginRight: "10px", width: "195px" }}
          >
            İptal
          </button>
        </div>
      </div>
      {isChangeModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Nakit Ödeme</h3>

            <input
              type="text"
              value={receivedAmount}
              readOnly
              placeholder="Alınan Tutar"
            />

            <div className="numpad">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "C"].map(
                (btn, i) => (
                  <button
                    key={i}
                    className={btn === "C" ? "clear-btn" : ""}
                    onClick={() => handleNumpadClick(btn)}
                  >
                    {btn}
                  </button>
                )
              )}
            </div>
            {/* ANLIK BİLGİ BLOĞU */}
            <div className="info-block">
              <p>Alınan: {receivedAmount || "0"} ₺</p>
              <p>Toplam: {total.toFixed(2)} ₺</p>

              <p className="change-highlight">
                Para Üstü: {change !== null ? `${change.toFixed(2)} ₺` : "0 ₺"}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                disabled={change === null}
                onClick={() => handlePayment("nakit")}
              >
                Ödeme Yap
              </button>

              <button
                className="close-btn"
                onClick={() => setIsChangeModalOpen(false)}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
      {isPartialModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Parçalı Ödeme</h3>

            <label>
              Nakit Tutar:
              <input
                type="number"
                value={partialCash}
                onChange={(e) => setPartialCash(Number(e.target.value))}
                placeholder="Nakit Tutar"
              />
            </label>

            <label>
              Kart Tutar:
              <input
                type="number"
                value={partialCard}
                onChange={(e) => setPartialCard(Number(e.target.value))}
                placeholder="Kart Tutar"
              />
            </label>

            <p>Toplam: {total.toFixed(2)} ₺</p>
            <p>Girilen Toplam: {(partialCash + partialCard).toFixed(2)} ₺</p>

            <div
              style={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              <button onClick={handlePartialPayment}>Ödeme Yap</button>
              <button
                className="close-btn"
                onClick={() => setIsPartialModalOpen(false)}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
