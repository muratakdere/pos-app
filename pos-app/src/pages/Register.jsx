import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa"; // 👈 İkonları ekle
import "../styles/Register.css"; // CSS dosyasını import et
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if(password !== confirmPassword){
      toast.error("Şifreler eşleşmiyor!");
      return;
    }


    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("backend yanıtı:", res.data);
      toast.success("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      navigate("/login");
    } catch (err) {
      console.error("🔥 HATA:", err);
      toast.error("Hata: " + err.response.data.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Şifreyi Tekrar Giriniz"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Kayıt Ol</button>
      </form>
    </div>
  );
};

export default Register;

