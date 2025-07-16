import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductList from "../components/ProductList";
import Cart from "../components/Cart";
import Checkout from "../components/Checkout";
import { toast } from "react-toastify";
import AddProductModal from "../components/AddProductModal";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchProducts(category);
  };

  // Veritabanından ürünleri çek
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = (category = "Tümü") => {
    const url =
      category && category !== "Tümü"
        ? `http://localhost:5000/api/products?category=${category}`
        : `http://localhost:5000/api/products`;

    axios
      .get(url)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Ürün çekme hatası:", err));
  };

  const updatePrice = (index, newPrice) => {
    setCartItems((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].price = newPrice;
      return updatedCart;
    });
  };

  const updateQuantity = (index, newQuantity) => {
    setCartItems((prevCart) => {
      const updatedCart = [...prevCart];
      if (newQuantity <= 0) {
        updatedCart.splice(index, 1); // Miktar 0 olursa ürünü sil
      } else {
        updatedCart[index].quantity = newQuantity;
      }
      return updatedCart;
    });
  };

  // Sepete ürün ekle, varsa miktar artır
  const addToCart = (product) => {
    setCartItems((prevCart) => {
      const found = prevCart.find((item) => item.id === product.id);
      if (found) {
        if (found.quantity >= product.stock) {
          toast.info("Yeterli stok yok!");
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Sepette yoksa ve stok 0 ise ekleme yapma
        if (product.stock <= 0) {
          toast.info("Stokta yok!");
          return prevCart;
        }
        // Sepette yoksa ve stok varsa ekle
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Sepetten ürün çıkar
  const removeFromCart = (index) => {
    setCartItems((prevCart) => {
      const newCart = [...prevCart];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  // Sepeti temizle
  const clearCart = () => setCartItems([]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        // height: "100vh",
        padding: "20px",
        boxSizing: "border-box",
        gap: "30px",
      }}
    >
      {/* Üst kısım: Sol (kategori + ürünler) ve sağ (sepet) */}
      <div
        style={{
          display: "flex",
          flex: 1,
          gap: "30px",
          overflow: "hidden",
        }}
      >
        {/* Sol blok: kategori butonları + ürünler (dikey) */}
        <div
          style={{
            flex: 2.9,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            overflowY: "auto",
          }}
        >
          {/* Kategori Butonları */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              maxWidth: "600px",
            }}
          >
            {["Tümü", "İçecek", "Atıştırmalık", "Tatlı"].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  background: selectedCategory === cat ? "#357ABD" : "#eee",
                  color: selectedCategory === cat ? "#fff" : "#000",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100px",
                  height: "60px",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Ürün Listesi */}
          <div style={{ flexGrow: 1 }}>
            <ProductList
              products={products}
              addToCart={addToCart}
              onAddProduct={() => setIsAddProductModalOpen(true)}
            />
          </div>
        </div>

        {/* Sağ blok: Sepet */}
        <div
          style={{
            flex: 1.1,
            overflowY: "auto",
            maxHeight: "100%",
          }}
        >
          <Cart
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            updatePrice={updatePrice}
          />
          <Checkout cartItems={cartItems} clearCart={clearCart} fetchProducts={fetchProducts} />
        </div>
      </div>
      {isAddProductModalOpen && (
        <AddProductModal
          onClose={() => setIsAddProductModalOpen(false)}
          onProductAdded={() => {
            setIsAddProductModalOpen(false);
            fetchProducts(); // Ürünleri yeniden çek
            toast.success("Ürün başarıyla eklendi!")
          }}
        />
      )}
    </div>
  );
};

export default Home;
